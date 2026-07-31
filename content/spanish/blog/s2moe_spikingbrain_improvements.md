---
title: 'La misma respuesta, 1/32 del trabajo: Añadiendo una FFN Mixture-of-Experts dispersa a SpikingBrain (un modelo inspirado en el cerebro de 5B)'
bg_image: 'images/blog/algorithm.jpg'
date: 2026-07-30T09:10:00+02:00
author: 'Justin Guese'
description: 'Reconstruí la capa feed-forward de SpikingBrain 2.0 como una Mixture-of-Experts dispersa Top-1. Misma calidad con 1/32 del cómputo FFN, 2.71x menos FLOPs de bloque en su forma de 5B - y el resultado que una segunda semilla aleatoria eliminó.'
image: 'images/blog/algorithm.jpg'
categories:
  - Machine Learning

tags:
  [
    'mixture of experts',
    'model efficiency',
    'spikingbrain',
    'cuda kernels',
    'open source',
  ]
type: post
---

## La versión simple, en 60 segundos

Imagina un taller de reparación con 32 especialistas.

Hoy en día, los modelos de IA funcionan como un taller donde **cada trabajo se le entrega a los 32 especialistas a la vez.** Todos tocan todo. Funciona. También es enormemente derrochador.

Reconstruí parte de un modelo de IA de 5 mil millones de parámetros ([SpikingBrain 2.0](https://github.com/BICLab/SpikingBrain2.0)) para que una recepcionista lea cada trabajo primero y lo pase a **el único especialista que debería manejarlo.**

El mismo taller. Los mismos 32 especialistas en nómina. La misma calidad de trabajo saliendo.

**Una trigésima segunda parte del trabajo.**

Esa es toda la idea. El resto de este post es lo que sucedió cuando lo medí correctamente - incluyendo el resultado que tuve que tirar a la basura.

## ¿Qué es un modelo Mixture-of-Experts?

En una red neuronal normal, cada entrada atraviesa todos los parámetros. Es una única función enorme, y toda ella se ejecuta cada vez.

Un modelo **Mixture-of-Experts (MoE)** divide esa gran función en muchas más pequeñas - los "expertos" - y pone un **enrutador** delante. El enrutador observa cada palabra y elige qué experto la maneja.

Con **enrutamiento Top-1**, exactamente un experto se ejecuta por palabra. No dos, no una mezcla. Uno.

Aquí viene la parte que importa: **el costo por palabra no cambia cuando añades más expertos.** Sesenta y cuatro expertos cuestan lo mismo por palabra que ocho, porque todavía solo ejecutas uno de ellos. Pero la capacidad total del modelo crece cada vez que añades uno.

Eso no es un truco ingenioso que alguien descubrió. Es aritmética. Lo cual es exactamente por qué es confiable.

## ¿Qué es SpikingBrain 2.0?

[SpikingBrain 2.0](https://github.com/BICLab/SpikingBrain2.0) es una familia de modelos inspirados en el cerebro de código abierto del Instituto de Automatización, Academia China de Ciencias. Dos modelos de 5B, lanzados con código y pesos.

Es trabajo genuinamente interesante. Reemplaza la atención estándar con un híbrido de atención softmax dispersa y atención lineal dispersa, añade un esquema de codificación de activación que soporta hardware impulsado por eventos, e incluye un pipeline de conversión que transforma Transformers existentes en esta arquitectura.

Leí su código lanzado en lugar de solo el paper, y encontré la apertura que necesitaba: **cada bloque es `atención → feed-forward denso`.** No hay enrutamiento de expertos en la capa feed-forward en ningún lugar de la versión lanzada.

Así que un feed-forward MoE disperso no es una idea rival a la suya. Es una **ranura vacía.**

## Lo que añadí

Cuatro mecanismos, tomados de [mi propio repositorio de investigación](https://github.com/JustinGuese/S2-MoE-llm) y portados a su bloque:

- **Un conjunto de expertos enrutados Top-1** reemplazando la capa feed-forward densa.
- **Un núcleo compartido siempre activo** - un pequeño experto por el cual pasan todas las palabras, junto al enrutado.
- **Un kernel CUDA de grouped-GEMM**, porque sin él todo el asunto es más lento (más sobre esto abajo).
- **Un reciclador de denso a MoE**, para que el conjunto de expertos pueda construirse a partir de sus _pesos ya entrenados_ en lugar de requerir un reentrenamiento desde cero.

Todo se encuentra detrás de una clave de configuración que está ausente en los seis configs que han lanzado. **Sus checkpoints lanzados cargan y se ejecutan byte a byte como antes** a menos que deliberadamente lo enciendas. Hay una prueba que lo afirma.

## Resultado: la misma calidad con 1/32 del cómputo feed-forward

Aquí está la medición principal.

Con **número de parámetros coincidentes** - 77.8M para el modelo disperso versus 77.7M para un control denso, 0.2% separados - el modelo disperso alcanza **la misma perplejidad de validación** mientras ejecuta **1/32 del cómputo feed-forward.**

Eso es **32× la precisión por unidad de cómputo activo.**

Mismo tamaño. Misma calidad. Una trigésima segunda parte del trabajo en esa capa.

Esta es la proposición de MoE disperso funcionando exactamente como se anuncia: la capacidad escala con el conjunto, el cómputo activo permanece plano.

## Lo que eso vale en su escala de 5B

Las afirmaciones de cómputo se determinan por formas de tensores, no por entrenamiento - por lo que se pueden medir directamente en las dimensiones de bloque reales de SpikingBrain con pesos aleatorios, en aproximadamente veinte minutos en una única RTX 4090.

Con `hidden_size 2560`, `intermediate_size 9728`, bf16, parámetros coincidentes, lote 8 × secuencia 512:

| Feed-forward              | MFLOP/token | mJ/token | Active watts | Tokens/sec  |
| ------------------------- | ----------- | -------- | ------------ | ----------- |
| Dense SwiGLU (their code) | 229.1       | 0.669    | 298.5        | **446,070** |
| Sparse MoE, 16 experts    | 89.1        | 0.419    | 138.9        | 331,697     |
| Sparse MoE, 32 experts    | 84.5        | 0.412    | 133.7        | 324,344     |
| Sparse MoE, 64 experts    | 82.3        | 0.414    | 123.7        | 299,053     |

**2.71× menos FLOPs por bloque. 1.62× menos energía por token. Menos de la mitad del consumo de energía** - 134 W contra 299 W.

## Por qué 1/32 no se convierte en 32× en total

Mira esa tabla de nuevo. El cómputo feed-forward se redujo 32×, pero el bloque completo solo se redujo 2.71×. ¿Dónde fue el resto?

**Las partes siempre activas no se encogen.** La atención todavía se ejecuta en cada palabra. El enrutador se ejecuta en cada palabra. El núcleo compartido se ejecuta en cada palabra.

Optimizar un componente solo puede ahorrar la parte de ese componente del total. Una vez que la capa feed-forward es casi gratuita, todo lo demás se convierte en el piso - y has alcanzado el techo de lo que la dispersión feed-forward puede hacer.

Si tomas un número de este post para tu propio trabajo, toma ese. Te dice cuándo dejar de optimizar esta capa e ir a mirar otra.

## La parte honesta: el modelo denso es más rápido

Lee correctamente la columna tokens-por-segundo. **446,000 para denso contra 324,000 para disperso.** Denso gana por un margen cómodo.

La victoria aquí es **FLOPs y potencia, no throughput de reloj de pared.**

La razón es prosaica: una multiplicación de matriz densa amplia utiliza una GPU mejor que una multiplicación de matriz agrupada más un enrutador más un núcleo compartido. Las GPUs están construidas para grandes bloques regulares de aritmética.

En hardware limitado por potencia o impulsado por eventos, ese intercambio se invierte y el modelo disperso gana. En una GPU del datacentre orientada al throughput, no lo hace. Cualquiera que tenga un benchmark de esto lo encontraría en diez minutos, así que no tiene sentido pretender lo contrario.

## Los modelos dispersos son más lentos sin el kernel CUDA correcto

Esta es la parte que más querría que otro ingeniero se llevara.

La implementación obvia recorre expertos en Python - una iteración, un lanzamiento de kernel cada una. Ese overhead es fijo por experto, así que crece exactamente tan rápido como tu ahorro lo hace.

**Medida por sí sola, la capa dispersa ingenua era más lenta que densa en cada número de experto.** El ahorro FLOP existía en papel y absolutamente en ningún otro lugar.

La solución: ordena los tokens por su experto asignado en bloques contiguos y emite una multiplicación de matriz agrupada sobre todos ellos. Envolvé `torch._grouped_mm` en una función autograd con un pase backward explícito para que funcione en entrenamiento también.

| Experts                | 8     | 16    | 32    | 64         |
| ---------------------- | ----- | ----- | ----- | ---------- |
| Forward vs Python loop | 2.27× | 4.60× | 8.29× | **12.75×** |
| Training step vs loop  | 1.85× | 3.99× | 6.34× | **9.95×**  |

Y es **exacto al bit** - diferencia absoluta máxima de cero contra el loop, en los outputs y en ambos gradientes de pesos. Este es puro removimiento de overhead, no una aproximación.

**Una arquitectura eficiente sin su kernel es solo una arquitectura más lenta.** El número FLOP es una promesa; el kernel es si se paga.

## Un bug CUDA que cuelga tu GPU silenciosamente

Vale la pena saber si alguna vez tocas esta operación: **`torch._grouped_mm` se cuelga en divisiones de grupo degeneradas.**

Cuando la ocupación de expertos es desigual, obtienes segmentos de ancho cero. Alimenta esos al kernel y se cuelga - GPU inactiva, un núcleo de CPU girando, sin error, sin timeout. Se ve exactamente como un paso de entrenamiento lento hasta que notas que ha estado lento durante seis horas.

Compactar los grupos vacíos fuera de la llamada es matemáticamente idéntico y elimina el gatillo completamente.

## ¿Sobrevive la dispersión al servicio en lote?

Dos afirmaciones diferentes aquí que se confunden constantemente, así que separémoslas.

**Los FLOPs por token permanecen en 1/32 en cualquier tamaño de lote.** Cada palabra atraviesa exactamente un experto sin importar cuántas palabras están en vuelo. La tabla anterior se midió con lote 8 - esos ya son números en lote.

**Lo que colapsa con el tamaño del lote es la _residencia_ del experto** - la capacidad de mantener solo los expertos activos cargados en memoria. Con lote 1 tocas un experto de 32 y puedes saltarte el resto. Con lote 64, la _unión_ de expertos tocados cubre la mayoría del conjunto:

| Batch size     | 1     | 32    | 64    |
| -------------- | ----- | ----- | ----- |
| Union sparsity | 96.9% | 39.7% | 14.1% |

Así que la descarga de expertos y la compuerta de pesos impulsada por eventos son **proposiciones de flujo único.** Las reducciones de cómputo y energía no lo son - esas se mantienen bajo batching.

Esta distinción es por qué los métodos de "dispersión contextual" continúan fallando al llegar a pilas de servicio de producción, y por qué vale la pena ser preciso sobre cuál de los dos estás afirmando.

## El resultado que eliminé: una semilla aleatoria borró una victoria del 2.1%

Ahora la parte incómoda.

También tenía una victoria de **calidad.** El modelo disperso superó su control denso por 2.1% de perplejidad - 58.99 contra 60.27. Número bonito. Entró en el write-up.

Luego ejecuté una semilla más para obtener barras de error.

La victoria se desvaneció. Segunda semilla: **58.52 contra 58.54.** Un empate total.

Aquí está lo que realmente sucedió. La **línea de base densa** se movió 2.9% entre semillas (60.27 → 58.54). Mi modelo se movió 0.8% (58.99 → 58.52). La primera semilla no había mostrado mi modelo haciendo bien. Había mostrado **la línea de base haciendo mal.**

A través de ambas semillas, la brecha es −1.1% con una dispersión de ±1.05 puntos porcentuales. Indistinguible de la paridad.

**La lección se generaliza: tu línea de base también tiene varianza.** Una comparación de una sola semilla no mide tu método - mide la suerte de ambos modelos. Incluso había escrito la regla de antemano ("una semilla, cualquier cosa menos un par de por ciento no es una conclusión") y 2.1% se sentó justo en la línea, lo cual es precisamente donde tales reglas dejan de ser decorativas.

El resultado principal - paridad con 1/32 del cómputo - nunca fue afectado. Perder un bono no elimina el plato principal. Pero el 2.1% se fue y no volverá.

## Qué más no funcionó

Dos de los cuatro mecanismos no ganaron su lugar, y reportar eso es más barato que tener a alguien más descubrirlo.

**Las activaciones de espiga cuestan 2.8% de perplejidad con cómputo idéntico.** Las activaciones binarias 0/1 producen verdadera dispersión de activación - pero un kernel GPU denso no puede cobrarla. Así que en este hardware es un costo de calidad puro. Su valor es compatibilidad con chips neuromórficos impulsados por eventos, que es un argumento real, solo no uno de precisión o eficiencia GPU.

**La fase de sueño es inerte junto a un núcleo compartido.** Reestructura el conjunto de expertos durante el entrenamiento - fusionando duplicados, podando, regrowth. Resultado: −0.28% de perplejidad por 5.2% de tiempo de entrenamiento extra. Los logs explican por qué: a través de los diez ciclos no fusionó nada. **El núcleo compartido siempre activo absorbe exactamente la redundancia que la fusión existe para eliminar.** Dos mecanismos haciendo el mismo trabajo, así que el segundo no tiene nada izquierdo para hacer.

**Incluso el núcleo compartido es un intercambio, no una victoria gratuita** - compra 2.5% de perplejidad por 52% más de cómputo feed-forward activo. Vale la pena si estás optimizando calidad, no si estás optimizando cómputo.

## Dos bugs en su configuración lanzada

Siguiendo sus propias notas de instalación en una máquina limpia, dos cosas rompen. Ambas son triviales una vez que lo sabes, ambas cuestan una hora si no lo haces:

**Su MoBA incluido aún fija `flash-attn==2.6.3`.** Instalarlo silenciosamente desinstala la `flash-attn==2.7.3` que sus instrucciones piden una línea antes, luego falla construir 2.6.3 desde la fuente. Instalar con `--no-deps` lo arregla, y coincide con su propia nota de que la copia incluida fue adaptada a la interfaz más nueva. El pin es metadata obsoleta.

**`import fla` necesita un compilador C y encabezados Python presentes.** Triton compila un stub del lanzador en tiempo de importación. En una imagen CUDA mínima sin `build-essential` y `python3-dev`, simplemente muere.

## Auditar su mecanismo en lugar del mío

La cosa más interesante que construí no es el MoE. Es un diagnóstico para **su** arquitectura.

Su atención lineal dispersa elige 2 de 4 particiones de estado por palabra, entrenado hacia uso balanceado por una pérdida auxiliar. Esa pérdida solo se ejecuta durante el entrenamiento. **Nada garantiza que el balance sobreviviera a los pesos lanzados** - y tampoco ninguna forma en que pueda fallar aparece en la perplejidad o puntuaciones de benchmark:

- **Colapso de uso** - pocas particiones toman la mayoría de las selecciones, así que el estado expandido es efectivamente más pequeño que lo configurado y su costo de memoria compra menos de lo anunciado.
- **Independencia de entrada** - el uso se ve balanceado en general, pero cada palabra elige el _mismo_ par. El histograma se ve perfecto mientras el enrutamiento no lleva información en absoluto.

Hay una trampa en medir esto. Cargar el modelo con `trust_remote_code=True` importa el código de modelado **incluido en el directorio del checkpoint**, no la copia en el repositorio. Parcha el módulo del repositorio y medirás algo que el modelo nunca llama, y obtendrás una tabla de nada que se ve confiada.

El resultado, a través del rango de contexto entrenado completo del checkpoint:

| Context length   | 1,024  | 4,096  | 8,192  |
| ---------------- | ------ | ------ | ------ |
| Usage entropy    | 0.9868 | 0.9868 | 0.9863 |
| Most-common pair | 25.7%  | 26.2%  | 26.5%  |
| All 6 pairs used | yes    | yes    | yes    |

La entropía de 1.0 significa perfectamente balanceado. Una participación del 16.7% significaría perfectamente uniforme a través de pares.

**Ambos modos de fallo están ausentes, en cada longitud.** Sobre un aumento de contexto de 8×, la entropía se mueve 0.0005. Su pérdida auxiliar hizo su trabajo y la propiedad se mantuvo.

Ese es un resultado nulo, y lo estoy reportando como tal. Ahora es [una discusión abierta en su repo](https://github.com/BICLab/SpikingBrain2.0/issues/4).

## Alcance honesto

Todo lo anterior, limitado:

- **Nada ha sido entrenado a 5B o en sus checkpoints.** El trabajo de calidad está en ≤146M parámetros, desde cero. Los números de 5B son de nivel de bloque y determinados por forma.
- **Los resultados de calidad son de una o dos semillas.** Una ya se derrumbó. Las direcciones son hallazgos; las magnitudes son provisionales.
- **El borde de calidad se invierte en presupuestos de entrenamiento largo** - una ventaja de −5.15% con presupuesto fijo se convirtió en +2.4% con 4× el presupuesto. [Escribí eso por separado](/blog/s2moe_budget_dependent_benchmarking/). SpikingBrain entrena mucho más allá de ese punto.
- **La energía en una GPU es realmente FLOPs sobre latencia.** La potencia varía poco a través de arquitecturas, así que el encuadre defendible es costo de servicio por token, no joules brutos. La contabilidad de energía realmente impulsada por eventos necesita silicio neuromórfico que no he medido.

## Lo que se mantiene

- **Paridad de parámetros coincidentes con 1/32 del cómputo feed-forward activo.** 32× precisión por unidad de cómputo activo.
- **2.71× menos FLOPs de bloque y 1.62× menos energía por token** en su forma de bloque real de 5B, a partir de pesos aleatorios.
- **El kernel de grouped-GEMM es lo que lo hace real** - exacto al bit, hasta 12.75× más rápido que el loop ingenuo. Sin él, el modelo disperso es más lento que denso.
- **Un techo que vale la pena conocer:** la dispersión feed-forward solo puede ahorrarte la parte feed-forward. Después de eso, las partes siempre activas son el piso.
- **Un diagnóstico validado** para el enrutamiento de partición de SpikingBrain, que volvió sano.

## Preguntas frecuentes

**¿Realmente reduce el cómputo Mixture-of-Experts?**
Sí, y por una cantidad predecible. El enrutamiento Top-1 ejecuta un experto por token cualquiera que sea el tamaño del conjunto, así que el cómputo feed-forward es `1/n_experts` de una capa densa de parámetros coincidentes. Con 32 expertos eso se mide en 1/32, lo que se convierte en 2.71× menos FLOPs para el bloque completo una vez que las partes siempre activas se cuentan.

**¿Es un modelo MoE disperso más rápido que uno denso?**
No necesariamente, y aquí no lo era - 324k tokens/seg contra 446k para denso. Menos FLOPs no es lo mismo que menor latencia. La victoria fue en FLOPs y consumo de potencia (134 W vs 299 W), no throughput.

**¿Sobrevive la dispersión de MoE al servicio en lote?**
El ahorro de cómputo sí - cada token aún atraviesa un experto sin importar el tamaño del lote. Lo que no sobrevive es la _residencia_ del experto: la unión de expertos tocados a través de un lote va de 96.9% disperso con lote 1 a 14.1% con lote 64, así que la descarga de expertos es una técnica de flujo único.

**¿Mejoran las activaciones de espiga la precisión?**
No en esta medición. Cuestan 2.8% de perplejidad con cómputo idéntico. El beneficio es compatibilidad con hardware neuromórfico impulsado por eventos, no precisión o eficiencia GPU.

**¿Cuántas semillas necesitas para afirmar una mejora de calidad?**
Más de una, y este post es el cuento cautivo. Una ventaja del 2.1% desapareció en la segunda semilla porque la _línea de base densa_ había sacado una mala semilla. Las comparaciones de una sola semilla miden suerte, no método.

**¿Puedes convertir un modelo denso existente en Mixture-of-Experts?**
Sí - eso es lo que hace el reciclador. Inicializa cada experto a partir de cortes de los pesos feed-forward densos entrenados en lugar de desde cero. Es un puente de inicialización de pesos y aún necesita entrenamiento continuado para recuperar la calidad; no es una conversión gratuita.

## Reproducirlo

```bash
git clone https://github.com/JustinGuese/SpikingBrain2.0-s2moe
cd SpikingBrain2.0-s2moe

# Energy and FLOPs at SpikingBrain's real 5B block shape - random weights, no training
python spb2/s2moe/bench/bench_energy.py --n-experts 32 --param-match
python spb2/s2moe/bench/bench_active_flops.py --n-experts 32

# Kernel equivalence and speedup, forward and training
python spb2/s2moe/bench/bench_dispatch.py

# Audit the released checkpoint's partition routing
python run_model_forward/probe_sse_selection.py --model-path /path/to/SpikingBrain-2.0-base-8k
```

- **The fork, with everything above:** [github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)
- **The original research repo:** [github.com/JustinGuese/S2-MoE-llm](https://github.com/JustinGuese/S2-MoE-llm)
- **Upstream:** [BICLab/SpikingBrain2.0](https://github.com/BICLab/SpikingBrain2.0)
- **Open discussion:** [BICLab/SpikingBrain2.0#4](https://github.com/BICLab/SpikingBrain2.0/issues/4)

Lectura relacionada aquí: [por qué la victoria de energía crece con el número de expertos](/blog/s2moe_energy_scaling_sparse_moe/) y [cómo la afirmación de calidad se invirtió bajo un presupuesto de entrenamiento más largo](/blog/s2moe_budget_dependent_benchmarking/).

Fondo: [Switch Transformer](https://arxiv.org/abs/2101.03961) en enrutamiento Top-1, [DeepSeekMoE](https://arxiv.org/abs/2401.06066) en expertos compartidos, [Drop-Upcycling](https://arxiv.org/abs/2502.19261) en conversión de denso a MoE.

Si un número aquí no está de acuerdo con el log de experimentos en el repo, el log gana - abre un issue.
