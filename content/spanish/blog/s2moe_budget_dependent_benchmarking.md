---
title: 'Mi ganancia de eficiencia se invirtió cuando entrené más tiempo: Una nota sobre la evaluación comparativa dependiente del presupuesto'
bg_image: 'images/blog/budget-reversal.png'
date: 2026-07-28T09:10:00+02:00
author: 'Justin Guese'
description: 'Un MoE disperso superó una línea base densa por 2.4% en 3 seeds. Entrenar 4x más tiempo en datos más difíciles y el signo se invierte - lo que eso dice sobre la evaluación comparativa de arquitecturas eficientes.'
image: 'images/blog/budget-reversal.png'
categories:
  - Machine Learning
tags:
  [
    'mixture of experts',
    'benchmarking',
    'reproducibility',
    'negative results',
    'language models',
  ]
type: post
---

# Mi ganancia de eficiencia se invirtió cuando entrené más tiempo: Una nota sobre la evaluación comparativa dependiente del presupuesto

**Resumen ejecutivo**

- Un modelo [Mixture-of-Experts](https://arxiv.org/abs/2101.03961) disperso Top-1 superó una línea base densa emparejada en parámetros por **−2.4% ± 1.1% perplejidad de validación, 3/3 seeds, t_ emparejado ≈ 3.8 (p ≈ 0.03)**. Resultado limpio. Parecía publicable.
- Tres controles separados lo desmontaron: un cambio de **calendario de tasa de aprendizaje**, una **línea base correctamente sintonizada**, y un **presupuesto de entrenamiento 4× más largo**.
- En presupuesto 4× en texto web difícil, el signo **se invirtió**: denso ganó por **+2.4% ± 0.8%**, también 3/3 seeds.
- La lección general: las comparaciones de eficiencia se ejecutan muy por debajo de los presupuestos [Chinchilla-optimal](https://arxiv.org/abs/2203.15556) sistemáticamente halagan al modelo con menos cálculo activo. La mayoría de los artículos nunca ejecutan el presupuesto más largo.
- Lo que sobrevivió fue el eje que _no podía_ invertirse, porque no se aprende. Más al final, y en el [artículo complementario sobre escalado de energía](./sparse-moe-energy-scaling-per-token).

Todos los números a continuación provienen de un registro de experimentos público: **[github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)** (`EXPERIMENTS.md`, 66 entradas, más reciente primero). Cada afirmación en este artículo cita un número de experimento que puede ir a leer.

---

## 1. El resultado que parecía terminado

La arquitectura es S²-MoE: un modelo de lenguaje Mixture-of-Experts disperso y spiking. El detalle relevante para este artículo es simplemente que enruta cada token a **un** experto de `n`, por lo que ejecuta aproximadamente `1/n` del cálculo feed-forward en comparación con un modelo denso con el mismo recuento de parámetros.

A 25M parámetros en [TinyStories](https://arxiv.org/abs/2305.07759), tokenizado por pares de bytes, 6000 pasos, tres seeds ejecutadas como procesos aislados (**Exp 12**):

| Métrica (25M, 6000 pasos, 3 seeds)                       | S²-MoE                   | Denso         |
| ------------------------------------------------------- | ------------------------ | ------------- |
| Perplejidad de validación                                                   | **5.63 ± 0.09**          | 5.77 ± 0.03   |
| Brecha emparejada (MoE − denso)                                | **−2.4% ± 1.1%**         | —             |
| Brecha por seed                                            | −1.2% / −2.6% / −3.3%    | 3/3 favorecen MoE |
| Precisión por cálculo activo                             | **8.20× ± 0.10**         | 1×            |
| Fracción de cálculo FFN activo                             | 0.125 (exacta)            | 1.000         |
| Delta de gramática [BLiMP](https://arxiv.org/abs/1912.00582) | +0.003 ± 0.015 (neutral) | —             |

Este no es un resultado débil a primera vista. Es emparejado (la misma seed fija el orden de datos e inicialización para ambos brazos), cada seed está de acuerdo en el signo, la línea base densa tiene varianza de seed cercana a cero, y la sonda gramatical dice que la dispersidad no cuesta sintaxis. El entrenamiento más largo hizo que el efecto _más grande_, no más pequeño — generalmente una buena señal.

La tentación en este punto es dejar de medir.

## 2. Tres formas en que se desmoronó

### 2.1 El calendario estaba haciendo el trabajo (Exp 15)

Cada resultado anterior usaba una **tasa de aprendizaje plana** — defecto del proyecto, originalmente sintonizado para el mezclador [gated linear attention](https://arxiv.org/abs/2312.06635). Es una opción defendible para una arquitectura e indefendible para una comparación.

Reejecución en [FineWeb-Edu](https://huggingface.co/datasets/HuggingFaceFW/fineweb-edu) con un calendario moderno idéntico para cada brazo — calentamiento lineal luego desintegración de coseno a 10%, cada modelo en su tasa de aprendizaje pico sintonizado:

| Modelo (25M, FineWeb-Edu, 6000 pasos) | Val ppl   | BLiMP | Cálculo FFN activo |
| ------------------------------------ | --------- | ----- | ------------------ |
| GLA-denso                            | **51.37** | 0.713 | 1.000              |
| Transformer                          | **51.17** | 0.704 | 1.000              |
| S²-MoE                               | 56.90     | 0.694 | **0.125**          |

El MoE pasó de **8% mejor** bajo LR plano a **11% peor** bajo calentamiento+coseno. El mecanismo es visible en los deltas: el modelo denso ganó **25%** desde la programación adecuada (68.5 → 51.4); el MoE ganó solo **9.5%** (62.9 → 56.9). Un modelo denso actualiza cada parámetro en cada paso, por lo que puede explotar la cola de ajuste fino de una desintegración de coseno. Un MoE Top-1 actualiza aproximadamente `1/n` de su grupo de expertos por token, por lo que cada experto ve una fracción de los datos y cobra mucho menos de esa cola.

El protocolo de LR plano no fue neutral. Perjudicó al brazo que se beneficia más de una programación adecuada.

### 2.2 Una línea base que no sintonizó no es una línea base (Exp 15, ejecución #1)

El primer intento de agregar un verdadero control de Transformer de atención softmax le dio la configuración sintonizada de GLA: LR plano `lr=3e-3`, sin calentamiento. Nunca entrenó — perplejidad de validación **380**, contra 68 para el modelo denso GLA.

Esa ejecución produjo un titular de "S²-MoE es 48× mejor que un Transformer."

Ese número es rechazado y registrado como una lección en lugar de ser eliminado. Midió un control roto, no un buen modelo. Un diagnóstico breve confirmó que un Transformer correctamente configurado (`lr=6e-4`, calentamiento, coseno) entrena bien y aterriza a 51.17 — es decir, _supera_ al MoE.

Este modo de falla es barato para caer y caro para capturar después de la publicación. La atención es mucho más sensible al LR que un mezclador de recurrencia lineal; reutilizar los hiperparámetros de una arquitectura en una comparación fabrica el resultado que esperaba. **Informe el presupuesto de sintonización y LR final para cada brazo, incluidos los que intenta superar.**

### 2.3 El presupuesto estaba ocultando la brecha (Exp 44 → Exp 47)

El más transferible de los tres. Configuración idéntica bloqueada — 32 expertos, núcleo compartido siempre encendido, auto-destilación, calendario de coseno, envío GEMM agrupado — barrido sobre presupuesto de entrenamiento en FineWeb-Edu:

| Pasos de entrenamiento | MoE vs denso                              | Veredicto             |
| -------------- | ----------------------------------------- | ------------------- |
| 6,000          | **−5.15% ± 0.11%** (3/3 seeds, _t_ ≈ −81) | MoE gana decisivamente |
| 12,000         | ≈ paridad                                  | —                   |
| 24,000         | **+2.4% ± 0.8%** (3/3 seeds)              | Denso gana          |

Un cruce monótono limpio, confirmado en tres seeds en el punto final, no un golpe de suerte. El resultado 6k tenía una estadística _t_ de −81. También fue, en retrospectiva, una declaración sobre entrenamiento insuficiente en lugar de sobre arquitectura.

![Cruce de presupuesto: la ventaja de calidad MoE se invierte a medida que crece el presupuesto de entrenamiento](paper/figures/fig3_budget_reversal.png)

## 3. La generalización

Aquí está la parte que vale la pena llevar a otros proyectos.

**Las comparaciones ejecutadas muy por debajo de los presupuestos de cálculo óptimo sistemáticamente halagan al modelo con menos cálculo activo por token.** Ambos brazos están entrenados insuficientemente; el modelo denso tiene más capacidad que aún no ha cobrado; el modelo disperso está más cerca de su propio techo porque cada experto ya ha visto su porción estrecha de datos. La brecha que eventualmente los separará no se ha abierto. Mida allí y mida la región de cruce, no la asíntota.

Dos corolarios surgieron del mismo barrido.

**El punto de cruce es una propiedad del corpus, no de la arquitectura.** Ejecute la configuración idéntica de 24k pasos en ambos corpus (**Exp 47**):

| Corpus      | Entropía de unigramas  | MoE vs denso a 24k                | Delta de BLiMP |
| ----------- | ---------------- | ---------------------------------- | ----------- |
| TinyStories | 8.39 bits/token  | **−2.6% ± 0.3%** (3/3, MoE gana)   | +0.039      |
| FineWeb-Edu | 10.50 bits/token | **+2.4% ± 0.8%** (3/3, denso gana) | −0.007      |

El signo se invierte solo con el corpus. En texto estructurado, la ventaja MoE se estrecha con presupuesto (−4.4% a 6k → −2.6% a 24k) pero nunca cruza cero. En texto web diverso, cruza y continúa. Entonces "¿la dispersidad cuesta calidad?" no tiene respuesta libre de presupuesto, libre de corpus — lo que significa que cualquier artículo que informe un solo punto en esta superficie ha informado una coordenada, no una conclusión.

**Y el límite honesto en eso (Exp 53):** la ley _direccional_ se mantiene, pero una _cuantitativa_ no se puede ajustar a partir de estas ejecuciones. Hay solo dos puntos de entropía de corpus, y cronograma, destilación y presupuesto son factores de confusión colineales de magnitud comparable — el recuento de tokens por experto ni siquiera ordena correctamente el signo. Ajustar una curva predictiva a eso produciría una superficie no identificable con R² de apariencia decente. El registro lo dice, y el seguimiento se especifica (congelar un protocolo, agregar ≥2 corpus, ejecutar una cuadrícula `n × corpus`) en lugar de aproximarse.

### Una lista de verificación de cuatro elementos

1. **Ejecute al menos dos presupuestos**, idealmente 4× aparte. Si su afirmación existe solo en uno, es una afirmación sobre ese presupuesto.
2. **Ejecute al menos dos corpus de dificultad diferente.** Los corpus de juguete no son versiones pequeñas de corpus difíciles; invierten el signo aquí.
3. **Ajuste cada línea base por separado e informe su LR.** Un calendario en arquitecturas es un dedo en la balanza.
4. **Informe el signo emparejado por seed, no solo media ± std.** "3/3 seeds están de acuerdo" y "la media es negativa" son afirmaciones diferentes, y la segunda es más débil de lo que parece.

## 4. El proceso que lo atrapó

Nada de esto fue suerte. La práctica es **preregistrar una puerta de muerte numérica antes de una ejecución costosa**, luego honrarla cuando falla. Nueve ideas han muerto en la suya. Una muestra representativa:

| Idea                                                            | Por qué murió                                                    | Exp |
| --------------------------------------------------------------- | -------------------------------------------------------------- | --- |
| Puerta de escritura del mezclador                                                | Saltar escrituras al estado recurrente detonó perplejidad ~7×  | 32  |
| Puerta de detención [Mixture-of-Depths](https://arxiv.org/abs/2404.02258) | −1.9% de calidad; realizado ~16% dispersidad contra 50% objetivo          | 42  |
| Enrutamiento neuromodulador                                         | Sin ganancia de calidad; arreglos de nivel de enrutamiento continúan fallando              | 34  |
| Expertos dendríticos                                               | La puerta se asentó 38% abierta — se convirtió en sparsifier, +1.05% peor      | 46  |
| Punto de consigna de criticidad                                            | 73.03 contra una línea base emparejada 72.86 — puerta no alcanzada                | 62  |
| FFN impulsado por eventos                                                | Coseno de token consecutivo 0.561 contra una barra 0.7                    | 64  |
| Corrección residual de rango 1                                      | Inerte: cálculo activo sin cambios, barrido de umbral no movió nada | 66  |

Las cuatro ideas de puerta comparten una forma, y es el patrón más útil en todo el registro: **cualquier puerta aprendible que el optimizador se le permita cerrar, la cierra.** Cada una fue diseñada para agregar capacidad condicional; cada una fue reclutada como un segundo sparsifier encima del existente y costó 1–2% de calidad.

Dos ideas no fueron pequeñas — fueron los diferenciadores lanzados del proyecto, y murieron a _controles limpios_ en lugar de números malos:

- **Adaptación continua (Exp 60, 61).** Afirmación: los modelos dispersos olvidan menos, porque el crecimiento aísla nuevos dominios en nuevos expertos. Exp 60 agregó un control de sueño desactivado, que aterrizó idéntico al sueño activado — entonces el mecanismo no estaba haciendo el trabajo. Exp 61 luego _forzó_ el aislamiento con un bloqueo de ruta: los tokens de nuevo dominio golpean nuevos expertos exclusivamente (fracción de procedencia medida **1.00**, fuga cero). La retención aún no se movió — **116.7 contra 117.3**. El olvido vive en el componente denso siempre encendido, que la dispersidad no puede proteger. Falseado, no desafinado.
- **"El crecimiento gradual es especial" (Exp 59).** Una sola toma [aumento](https://arxiv.org/abs/2212.05055) anotó **73.37**, sentada dentro de la propagación de dos seeds del brazo de crecimiento gradual de 72.94–73.44. El resultado anterior "las ganancias graduales ganan" provino de un control que se filtró y creció silenciosamente en todo momento.

El argumento de costo para esta disciplina es **Exp 64**. La idea impulsada por eventos fue atractiva y habría tomado semanas para construir. La puerta fue una medición: ¿son las activaciones de token consecutivo lo suficientemente correlacionadas como para omitir el recálculo? Similitud de coseno media **0.561** contra una barra preacordada de 0.7 — y _baja_ con profundidad. Costo total: un script de evaluación comparativa y cero ejecuciones de entrenamiento.

La misma lógica ejecuta las pantallas baratas: una seed en media pasos para responder "¿esto mueve la calidad en absoluto?", y solo los sobrevivientes ganan tres seeds a longitud completa. Una pantalla de $0.30 que dice "no" vale más que una semana gastada en una palanca no validada.

## 5. Lo que realmente sobrevivió

Un párrafo, sin argumento.

La afirmación que se mantuvo a través de cada cambio de calendario, cada corpus, y un barrido de presupuesto 4× fue la que nunca se aprendió en primer lugar: **la precisión por unidad de cálculo feed-forward activo se mantuvo en ~21×** en 6k, 12k, y 24k pasos en ambos corpus. Es determinado por la forma — una consecuencia del enrutamiento Top-1 que ejecuta un experto independientemente del tamaño del grupo — por lo que no hay mecanismo por el cual más entrenamiento pudiera invertirlo. Es precisamente por qué sobrevivió cuando la afirmación de calidad no. Un número que no puede moverse bajo presupuesto es un número que nunca dependió del entrenamiento insuficiente.

Este eje es el tema del siguiente artículo: [cómo la energía por token escala con el recuento de expertos, donde la curva medida deja de estar de acuerdo con el recuento de FLOP, y qué spiking realmente compra](./sparse-moe-energy-scaling-per-token).

---

## Preguntas frecuentes

**P: ¿Por qué MoE supera a denso a pequeña escala pero pierde a gran escala?**
Ambos modelos fueron entrenados insuficientemente. El modelo denso actualiza cada parámetro en cada paso y continúa mejorando; el MoE Top-1 actualiza ~1/n de su grupo de expertos por token, por lo que se acerca a su techo antes. En presupuesto bajo, el modelo denso aún no ha cobrado su capacidad, por lo que la comparación halaga el modelo disperso. Vea Exp 44 y 47.

**P: ¿Eso significa que los modelos dispersos son peores?**
No — significa que la comparación de calidad es dependiente de presupuesto y corpus, y la comparación de _eficiencia_ no lo es. En texto estructurado, la ganancia dispersa sobrevivió a un aumento de presupuesto 4×; en texto web diverso, se invirtió. La ventaja de cálculo activo se mantuvo en todas partes.

**P: ¿Cuántos presupuestos de entrenamiento debo probar antes de afirmar una ganancia de eficiencia?**
Mínimo dos, idealmente 4× aparte, en al menos dos corpus de dificultad diferente. En este proyecto, el signo se invirtió entre 6k y 24k pasos en un corpus y no en el otro.

**P: ¿Qué es una puerta de muerte?**
Un umbral numérico escrito _antes_ de la ejecución costosa, definiendo qué resultado mataría la idea. Exp 64 mató una dirección multisemanal con un script de evaluación comparativa único porque la puerta fue establecida con anticipación.

**P: ¿Dónde puedo ver el registro de experimentos sin procesar?**
`EXPERIMENTS.md` en el [Repositorio de GitHub](https://github.com/JustinGuese/SpikingBrain2.0-s2moe) — 66 entradas, cada una con Hipótesis → Método → Observación → Resultado, incluyendo todo lo que falló.

---

## Reproduzca

El proyecto se administra con [uv](https://docs.astral.sh/uv/) en [PyTorch](https://pytorch.org/):

```bash
git clone https://github.com/JustinGuese/SpikingBrain2.0-s2moe
uv sync
uv run python phase0.py    # regression gate, expects: PHASE 0: PASS

# Frente a frente: MoE + control denso emparejado en parámetros, mismo presupuesto
uv run python train_lm.py --tokenizer bpe --scale 25m \
    --d-model 512 --d-hidden 512 --n-layers 4 --n-experts 32 \
    --d-shared 256 --distill --dispatch grouped --blimp --n-seeds 3
```

- **Código y registro completo:** [github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)
- **Demostración interactiva:** [huggingface.co/spaces/guestros/s2-moe-demo](https://huggingface.co/spaces/guestros/s2-moe-demo)
- **Puntos de control entrenados:** [huggingface.co/guestros/s2-moe-checkpoints](https://huggingface.co/guestros/s2-moe-checkpoints)
- **Archivado (CC BY 4.0):** [doi.org/10.5281/zenodo.20846758](https://doi.org/10.5281/zenodo.20846758)

Las correcciones son bienvenidas como problemas. Si un número aquí no está de acuerdo con el registro, el registro gana.
