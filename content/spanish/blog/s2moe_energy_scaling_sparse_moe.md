---
title: 'La ganancia de eficiencia que crece con el modelo: Energía por token en una MoE Spiking Top-1'
bg_image: 'images/blog/energy-scaling.png'
date: 2026-07-26T09:10:00+02:00
author: 'Justin Guese'
description: 'El enrutamiento Top-1 mantiene el costo FFN constante en número de expertos, por lo que la energía por token cae a medida que agrega expertos. Medido en H100 - 5.1x menos a 1B parámetros, además de dónde los FLOP dejan de predecir julios.'
image: 'images/blog/energy-scaling.png'
categories:
  - Machine Learning
tags:
  [
    'mixture of experts',
    'energy efficiency',
    'inference optimization',
    'neuromorphic computing',
    'cuda kernels',
  ]
type: post
---

# La ganancia de eficiencia que crece con el modelo: Energía por token en una MoE Spiking Top-1

**Resumen ejecutivo**

- El enrutamiento Top-1 ejecuta **un** experto por token independientemente del tamaño del grupo, por lo que el costo feed-forward es **constante en el número de expertos** mientras que el costo de un modelo denso emparejado en parámetros crece linealmente. Agregar expertos _reduce_ la energía por token.
- Medido en H100 en tres escalas de modelo: **1.46× → 3.07× → 5.08×** menos energía por token a 8 / 32 / 64 expertos a 1B parámetros, contra tanto una línea base densa como un Transformer emparejado en parámetros.
- A 8 expertos **no hay ganancia de energía en absoluto**. El régimen es importante, y este artículo comienza con eso.
- La ganancia no es gratuita - requiere un kernel GEMM agrupado. Sin él, el modelo disperso es _más lento_ que denso en cada recuento de expertos.
- Por encima de ~128 expertos, el proxy FLOP y los julios medidos **divergen**. Los FLOP dejan de ser un proxy y comienzan a contar una historia.

Código, kernels y registro de experimentos completo: **[github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)**.

Esta es la continuación de [un artículo sobre cómo la afirmación de _calidad_ en este mismo proyecto se invirtió bajo un presupuesto de entrenamiento más largo](./budget-dependent-benchmarking-sparse-moe). La versión corta de eso: las afirmaciones aprendidas se movieron, las determinadas por la forma no. Este artículo se ocupa de las determinadas por la forma.

---

## 1. Por qué la ganancia crece con el número de expertos

La aritmética es lo suficientemente simple para enunciar en un párrafo, que es la razón principal para confiar en ella.

Una capa [Mixture-of-Experts](https://arxiv.org/abs/2101.03961) con enrutamiento Top-1 envía cada token a exactamente un experto de ancho oculto `d_hidden`. Su costo feed-forward por token es por lo tanto **independiente de `n_experts`** - 64 expertos cuestan lo mismo por token que 8. Un modelo denso emparejado en parámetros tiene que gastar esos parámetros en algún lugar, por lo que su ancho feed-forward es `d_ff = n_experts · d_hidden`, y su costo por token crece **linealmente** en la misma variable.

La relación entre ellos por lo tanto crece linealmente en el número de expertos. Cada experto que agregue hace que la línea base sea más cara y deja el modelo disperso donde estaba.

Esta no es una propiedad aprendida. Es una consecuencia de las formas de tensor, por lo que se mantiene bajo pesos aleatorios, sobrevive a barridos de presupuesto y no le importa qué corpus entrene.

![El compromiso roto: calidad contra cálculo activo](paper/figures/fig2_broken_tradeoff.png)

## 2. El régimen donde no funciona (Exp 17)

Vale la pena enunciarlo antes de los buenos números, porque los limita.

A **8 expertos y 25M parámetros, no hay ganancia de energía.** La medición (Exp 17) encontró:

- El mezclador de secuencias siempre encendido domina el pase hacia adelante. Feed-forward es solo ~16% del cálculo del modelo disperso, por lo que reducirlo en 8× reduce solo ~la mitad de los FLOP totales.
- **La potencia GPU es plana de arquitectura** - ~52–57 W en todas las variantes probadas. En este hardware, "energía por token" se reduce a latencia por token. No hay caída de potencia que cosechar.
- Con un bucle de distribución de Python ingenuo por experto, el modelo disperso era _más lento_ que denso. La ganancia de FLOP fue consumida por la sobrecarga de lanzamiento de kernel.

La conclusión en ese momento fue que el eje de energía estaba muerto. Sin embargo, nombró su propia ruta de escape: una ganancia de energía solo es concebible a números de expertos mucho mayores, donde el feed-forward vuelve a dominar el pase _denso_, y solo con un kernel disperso real.

Ambas condiciones resultaron ser satisfacibles.

## 3. Dónde gira (Exp 22)

Manteniendo `d_model`, `d_hidden` y profundidad fijos y barriendo el número de expertos, con integración de potencia restada a la inactividad sobre un bucle de inferencia sostenido:

| Expertos | Parámetros | MoE agrupado ktok/s | Denso ktok/s | **Energía× vs denso** | vs Transformer   |
| -------- | ---------- | ------------------- | ------------ | --------------------- | ---------------- |
| 8        | 27.3M      | 101.5               | 82.3         | **1.31×**             | 1.16× (≈ empate) |
| 32       | 77.8M      | 78.4                | 33.8         | **2.50×**             | 1.03×            |
| 64       | 144.9M     | 71.9                | 18.1         | **3.99×**             | 0.97×            |

La parte feed-forward del modelo denso sube 61% → 86% → 92% de su pase mientras que la del modelo disperso se mantiene plana en ~0.022 GFLOP/token. El Transformer emparejado en parámetros gana **nada** del barrido (≈1.0× denso en todas partes) porque no tiene dispersidad que explotar - entonces la brecha contra la arquitectura dominante se abre desde un empate a 8 expertos a ~4× a 64.

La potencia se mantuvo plana en todas partes (~54–57 W agrupado contra ~57–60 W denso), confirmando que se trata de una ganancia de rendimiento en lugar de una ganancia de consumo de potencia. Esta distinción importa y volveré a ella en la sección de alcance.

## 4. El kernel tiene peso (Exp 13, Exp 24)

Menos FLOP no significa automáticamente menos energía. Algo tiene que convertir uno en el otro.

La implementación ingenua distribuye expertos en un bucle Python - una iteración y un lanzamiento de kernel por experto. Esa sobrecarga es fija por experto, por lo que crece exactamente tan rápido como la ganancia. **El envío de bucle es más lento que denso en cada recuento de expertos probado** (latencia relativa 0.72–0.78×). Medido de forma aislada, la arquitectura "eficiente" era una regresión.

La corrección es un GEMM agrupado ordenado y sin goteo: ordene tokens por su experto asignado en segmentos contiguos, construya desplazamientos acumulativos e emita dos matmuls agrupados sobre todos los segmentos en un lanzamiento cada uno. Un experto de token cero se convierte en un segmento de ancho cero - 0 FLOP, sin relleno, por lo que la ejecución condicional se retiene en lugar de ser simulada.

**Inferencia (Exp 13):**

| Expertos | Bucle tok/s | Agrupado tok/s | Aceleración | máx abs Δ logits |
| -------- | ----------- | -------------- | ----------- | ---------------- |
| 8        | 60,061      | 88,963         | **1.48×**   | 0.00e+00         |
| 16       | 41,049      | 86,245         | **2.10×**   | 0.00e+00         |
| 32       | 24,774      | 81,594         | **3.29×**   | 0.00e+00         |

El rendimiento agrupado se mantiene aproximadamente constante (89k → 86k → 82k) mientras que el bucle se derrumba (60k → 41k → 25k). Las salidas son **idénticas a nivel de bit** - diferencia cero de logit, cero volteos de argmax. La aceleración es eliminación pura de sobrecarga, no una aproximación.

**Entrenamiento (Exp 24):** el mismo kernel se hizo compatible con autograd con un hacia atrás explícito, dando **1.26× / 1.61× / 2.59× / 4.51×** pasos de entrenamiento más rápidos a 8 / 16 / 32 / 64 expertos, con gradientes `w_in` y `w_out` **idénticos a nivel de bit** al bucle y Δloss = 0. Eso eliminó el asterisco de "solo inferencia" de toda la historia.

Si toma un punto de ingeniería de este artículo: **una arquitectura eficiente sin su kernel es una arquitectura _más lenta_.** El recuento de FLOP es un pagaré; el kernel es si lo completa.

## 5. Se escala (Exp 27)

Nueve puntos en una H100 - tres escalas de modelo × tres números de expertos - evaluación comparativa de cuatro variantes emparejadas en forma. Pesos aleatorios, solo inferencia, por lo que la medición es determinada por la forma y no requiere entrenamiento. Net mJ/token, disperso / denso / Transformer, con relación MoE-vs-denso en negrita:

| Escala | 8 expertos                       | 32 expertos                      | 64 expertos                       |
| ------ | -------------------------------- | -------------------------------- | --------------------------------- |
| 25M    | 0.46 / 0.77 / 0.75 (**1.67×**)   | 0.49 / 1.98 / 1.99 (**4.08×**)   | 0.51 / 3.65 / 3.56 (**7.13×**)    |
| 350M   | 2.73 / 4.26 / 3.84 (**1.56×**)   | 2.92 / 10.31 / 9.40 (**3.53×**)  | 3.11 / 17.80 / 16.64 (**5.72×**)  |
| 1B     | 9.12 / 13.35 / 11.65 (**1.46×**) | 9.52 / 29.25 / 28.17 (**3.07×**) | 10.32 / 52.38 / 50.56 (**5.08×**) |

Lea la fila 1B en: la energía dispersa va de 9.1 → 9.5 → 10.3 mientras que los expertos escalan 8× - esencialmente plana, como predice la aritmética en §1. Denso va 13 → 29 → 52.

![Energía por token en escala de modelo y número de expertos](paper/figures/fig1_energy_scaling.png)

Dos observaciones honestas que viajan con el número. Primero, el kernel agrupado **se porta a Hopper (sm_90)** limpiamente, habiendo sido desarrollado en Blackwell (sm_120) - no es un artefacto de una arquitectura. Segundo, **la proporción se suaviza con la escala del modelo** en el número de expertos fijo (7.1× → 5.7× → 5.1× a 64 expertos) porque el mezclador de secuencias siempre encendido toma una parte absoluta más grande a medida que `d_model` crece. La palanca es el número de expertos, no el tamaño del modelo. Decir "5× a 1B" sin esta advertencia sería sobreventa por omisión.

## 6. Dónde los FLOP dejan de predecir julios (Exp 48, Exp 50)

Esta es la sección que debería hacer que un lector de sistemas confíe en el resto.

Hay dos formas diferentes de "agregar expertos", y se comportan en direcciones opuestas.

**`d_hidden` fijo (escalado de capacidad)** es §3 y §5: más expertos significa una línea base más grande, por lo que la ganancia de energía aumenta.

**Presupuesto total fijo (granularidad)** mantiene `n_experts · d_hidden` constante e hace cada experto más pequeño. El proxy FLOP ama esto - la precisión por unidad de cálculo activo sube monótonamente **23.4× → 35.0× → 46.3× → 53.0×** a 32 / 64 / 128 / 256 expertos (Exp 50, con confusión purga-churn corregida).

La energía medida no está de acuerdo. Aquí están el proxy FLOP y el vatímetro lado a lado, ambos de la misma pantalla (Exp 48 - sus cifras de proxy se ejecutan un poco más altas que las cifras Exp 50 corregidas por churn anteriores, pero la tendencia es lo que importa):

| Expertos | Precisión/cálculo-activo (proxy FLOP) | mJ/token medido | vs energía densa |
| -------- | ------------------------------------- | --------------- | ---------------- |
| 64       | 34.8×                                 | 0.803           | **2.21×** menos  |
| 128      | 50.9×                                 | 0.807           | **2.19×** menos  |
| 256      | 60.2×                                 | 0.954           | **1.83×** menos  |

**mJ/token sube mientras el proxy FLOP sube.** La sobrecarga de lanzamiento por grupo en muchos expertos pequeños (ancho 256 → 64) come la ganancia. Bajo una regla de decisión consciente de la energía - un cambio solo se acepta si la calidad mejora _y_ la ventaja de energía se mantiene - 64 y 128 pasan, y **256 es rechazado**: gasta julios reales para comprar un número proxy.

Entonces **~128 expertos es el punto óptimo realizado**, y "los FLOP no son julios" obtiene una coordenada real en lugar de una advertencia. La brecha es sobrecarga de kernel agrupado en lugar de algo fundamental - un kernel consciente de tiles podría empujar la rodilla - pero hasta que eso se escriba, la afirmación honesta es condicionada por kernel.

![Granularidad: proxy FLOP y energía medida divergen por encima de ~128 expertos](paper/figures/fig6_granularity_law.png)

## 7. Lo que el spiking realmente compra (Exp 51, Exp 60)

El modelo utiliza activaciones [spiking](https://open-neuromorphic.org/) binarias - neuronas de integración y disparo que emiten 0 o 1 en lugar de un flotante. La pregunta evidente del revisor es si eso cuesta precisión. Dos controles la responden de extremo a extremo.

Reemplace el pico oculto binario con un SiLU gradado en FLOP igual (Exp 51): 57.10 vs 57.44 perplejidad - el **pico es 0.6% mejor**, gramática empatada. Luego elimine _todo el aparato_ de spiking incluida la puerta de entrada (Exp 60): **56.5 vs 57.10** perplejidad, BLiMP **0.691 vs 0.691** - exactamente empatados.

La contabilidad completa es por lo tanto: **el spiking cuesta aproximadamente 1% de calidad en total y es neutral en gramática.** Su valor es que las activaciones binarias hacen que los expertos sean libres de multiplicación y ceden ejecución condicional verdadera de cero FLOP - un experto no alcanzado o no desencadenado no ejecuta nada. Este es un argumento de compatibilidad de hardware para silicio controlado por eventos, no un argumento de precisión, y enunciarlo antes de un revisor no cuesta nada.

## 8. Alcance honesto

Lea esto antes de citar cualquier número anterior.

**El punto de referencia de energía es solo inferencia y peso aleatorio.** Mide la forma del cálculo, no un despliegue entrenado. Esto lo hace conservador y reproducible, pero no es un punto de referencia de servicio en una carga de trabajo real.

**En GPU con potencia plana, "energía por token" es realmente FLOP activos sobre el rendimiento.** La potencia medida varió ~52–60 W en todas las arquitecturas probadas, por lo que la ganancia es impulsada por la latencia. El encuadre defendible es **costo de servicio y tokens por dólar**, no julios brutos. La contabilidad de energía verdadera impulsada por eventos requiere hardware neuromórfico - [SpiNNaker2](https://spinncloud.com/) o [Loihi 2](https://www.intel.com/content/www/us/en/research/neuromorphic-computing.html) - que este proyecto no ha medido. Este es el elemento abierto único más grande.

**El servicio en lote erosiona la dispersidad por token (Exp 65).** La unión de expertos tocados en un lote es lo que un servidor realmente paga, y se colapsa rápidamente: **96.9% dispersidad de unión en lote 1, 39.7% en lote 32, 14.1% en lote 64.** En 64 pasos de decodificación concurrentes, se toca el 86% del grupo. Esta es la misma limitación que ha mantenido los trucos de dispersidad contextual fuera de las pilas de servicio de producción (cf. [Dejavu](https://arxiv.org/abs/2310.17157)), y es por qué la ganancia por token se lee mejor como una propiedad de decodificación de flujo único y borde.

Un intento de arreglarlo falló su propia puerta (Exp 66): un objetivo de enrutamiento de acuerdo grupal destinado a concentrar el enrutamiento de un lote en menos grupos de expertos produjo dispersidad de unión de lote-32 de **0.371** contra una línea base no modificada de **0.397** - la curva completa superpuesta. El término auxiliar fue simplemente abrumado por la pérdida de equilibrio de carga. Reportado en lugar de enterrado, por [las razones en el artículo complementario](./budget-dependent-benchmarking-sparse-moe).

**Todo aquí es 2.5M–145M parámetros** para los resultados entrenados, con la curva de energía concretizada hasta dimensiones 1B. No es una afirmación de escala fronteriza.

## 9. Qué se mantiene

Reducido a lo que sobrevive cada advertencia anterior:

- El enrutamiento Top-1 hace que el costo feed-forward sea **constante en el número de expertos**; la línea base densa crece linealmente. Esta es aritmética, no un hallazgo.
- Medido en una H100, esto produce **3.07× a 32 expertos y 5.08× a 64 expertos** menos energía por token a 1B parámetros, contra modelo denso y Transformer emparejado en parámetros.
- **El kernel GEMM agrupado es lo que lo hace real** - exacto a nivel de bit, y aporta 3.29× de inferencia y 4.51× de entrenamiento en recuentos de expertos altos. Sin él, nada de esto existe.
- **Por encima de ~128 expertos en presupuesto fijo, la energía medida y el proxy FLOP divergen.** Confía en los julios.
- **El spiking cuesta ~1% de calidad** y compra compatibilidad neuromórfica, no precisión.

---

## Preguntas frecuentes

**P: ¿Mixture-of-Experts realmente ahorra energía en inferencia?**
Depende completamente del número de expertos y del kernel. A 8 expertos, medido aquí, no hubo ganancia - el mezclador siempre encendido dominaba y la sobrecarga de envío comía la ganancia. A 32–64 expertos con un kernel GEMM agrupado, fue 3–5× menos energía por token a 1B parámetros.

**P: ¿Por qué la ganancia crece a medida que agrega expertos?**
El enrutamiento Top-1 ejecuta un experto por token sin importar el tamaño del grupo, por lo que el costo disperso es plano en el número de expertos. Un modelo denso emparejado en parámetros aumenta el ancho feed-forward linealmente con el mismo presupuesto de parámetros. La proporción por lo tanto crece linealmente.

**P: ¿Menos FLOP es lo mismo que menos energía?**
No por encima de ~128 expertos en presupuesto fijo. El mJ/token medido pasó de 0.807 a 0.954 yendo de 128 a 256 expertos mientras que la métrica basada en FLOP continuaba mejorando - sobrecarga de lanzamiento por grupo en muchos expertos pequeños. Mida julios.

**P: ¿Esto se mantiene bajo el servicio en lote?**
Parcialmente. La dispersidad de unión por token cae de 96.9% en lote 1 a 39.7% en lote 32. La ganancia de energía por token es más fuerte para decodificación de flujo único y borde; el servicio en lote recupera solo una parte.

**P: ¿Qué contribuyen las activaciones de spiking?**
Aproximadamente 1% de costo de calidad, neutral en gramática. El beneficio es expertos libres de multiplicación y ejecución condicional verdadera de cero FLOP, lo que importa para hardware neuromórfico controlado por eventos en lugar de precisión en GPU.

---

## Reproduzca

Administrado con [uv](https://docs.astral.sh/uv/) en [PyTorch](https://pytorch.org/):

```bash
git clone https://github.com/JustinGuese/SpikingBrain2.0-s2moe
uv sync

# Potencia CUDA en vivo + latencia, pesos aleatorios (determinado por forma)
uv run python bench_energy.py --n-experts 64 --d-model 512 --d-hidden 512 \
    --n-layers 4 --batch 16 --seq 256

# Equivalencia de kernel + aceleración, inferencia y entrenamiento
uv run python bench_dispatch.py
uv run python bench_train_dispatch.py
```

- **Código, kernels, registro completo:** [github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)
- **Demostración de energía interactiva:** [huggingface.co/spaces/guestros/s2-moe-demo](https://huggingface.co/spaces/guestros/s2-moe-demo)
- **Puntos de control entrenados:** [huggingface.co/guestros/s2-moe-checkpoints](https://huggingface.co/guestros/s2-moe-checkpoints)
- **Archivado (CC BY 4.0):** [doi.org/10.5281/zenodo.20846758](https://doi.org/10.5281/zenodo.20846758)

Lecturas relacionadas: [Switch Transformer](https://arxiv.org/abs/2101.03961) en enrutamiento Top-1 a escala, [DeepSeekMoE](https://arxiv.org/abs/2401.06066) en topología de expertos compartidos, [Gated Linear Attention](https://arxiv.org/abs/2312.06635) en mezclador de recurrencia lineal, y [Open Neuromorphic](https://open-neuromorphic.org/) para el lado del hardware controlado por eventos.

Si un número aquí no está de acuerdo con `EXPERIMENTS.md`, el registro gana - presente un problema.
