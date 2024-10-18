---
author: Justin Guese
bg_image: /images/download.png
categories:
- Finanzas
- Comercio algorítmico
date: '2022-01-26T23:00:00+00:00'
description: 'El algoritmo de aprendizaje automático típico solo puede trabajar con
  los datos que recibió.  (Por lo general) no puede crear nuevas características o
  interpretaciones como "Si el volumen aumenta y la tercera derivada del precio sube,
  el precio probablemente subirá", sino que solo puede "observar" los datos que recibió.  Estos
  serían cálculos como "si el precio está por encima de 100 USD y el volumen por encima
  de 2000, el precio probablemente subirá".

  '
image: /images/download.png
tags:
- ai investing
- investing
- stocks
- finance
- algorithmic trading
title: Mejorando los datos de acciones para tu modelo de trading algorítmico en Python
type: post

---
Digamos que estás planeando crear tu propio modelo de trading algorítmico.

Probablemente usarás solo los datos de precio (Cierre) para tu modelo y algoritmo, pero pronto descubrirás que tu modelo no funciona bien.

Pronto usarás datos OHLCV típicos, que se refieren a Apertura, Máximo, Mínimo, Cierre, Volumen, que ya es mejor, pero el modelo no parece funcionar lo suficientemente bien.

¿Qué puedes hacer?

Cuaderno de Colab útil para seguir: [https://colab.research.google.com/drive/1ywqti1TuTDY_Z11ry0x4ITclCwxnXAeI?usp=sharing](https://colab.research.google.com/drive/1ywqti1TuTDY_Z11ry0x4ITclCwxnXAeI?usp=sharing "https://colab.research.google.com/drive/1ywqti1TuTDY_Z11ry0x4ITclCwxnXAeI?usp=sharing")

Gist:

[https://gist.github.com/JustinGuese/019e0e71100abe6555f78c32fd0b10a9](https://gist.github.com/JustinGuese/019e0e71100abe6555f78c32fd0b10a9 "https://gist.github.com/JustinGuese/019e0e71100abe6555f78c32fd0b10a9")

## ¿Qué busca un bot de trading de aprendizaje automático?

El algoritmo típico de aprendizaje automático solo puede trabajar con los datos que recibió. No (generalmente) puede crear nuevas características o interpretaciones como "Si el volumen aumenta y la tercera derivada del precio aumenta, el precio probablemente subirá", sino que solo puede "observar" los datos que recibió. Estos serían cálculos como "si el precio está por encima de los 100 USD y el volumen por encima de las 2000 unidades, el precio probablemente subirá".

Los recién llegados al aprendizaje automático ahora intentan resolver este problema entrenando durante décadas o utilizando cada vez más GPU, pero una forma mucho más eficiente sería alimentar al algoritmo con datos adicionales, de modo que pueda utilizar más recursos para inferir sus cálculos.

Esto se puede lograr mediante:

1. Obtener más datos (un período de tiempo mayor)
2. Agregar métricas estadísticas
3. Agregar tus propias señales e interpretaciones

# Práctica: Mejorando tus datos

## Primeros pasos: Obteniendo tus datos

Primero, obtengamos algunos datos básicos de OHLCV. Me gusta el módulo yfinance ([https://pypi.org/project/yfinance/](https://pypi.org/project/yfinance/ "https://pypi.org/project/yfinance/")) por su simplicidad. No es comparable a las transmisiones de datos en tiempo real, ¡pero por otro lado es gratuito y excelente para experimentar!

    pip install yfinance pandas numpy matplotlib ta

Importa ese módulo, así como Pandas, Numpy, Matplotlib

    import yfinance as yf
    import matplotlib.pyplot as plt
    import pandas as pd

Obtén algunos datos de acciones, el intervalo y el período se refieren a los intervalos de tiempo.

interval acepta valores como 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo

period acepta valores como 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max

No todas las combinaciones funcionan, como intervalos de 1 minuto (1m) que solo funcionan con un máximo de 7 días, 1 hora (1h) con un máximo de 3 meses (debe escribirse como 90d). Pero trabajemos primero con datos diarios

    df:yf.download("MSFT",period="5y",interval="1d")
    df.head()

![](/images/screenshot-from-2021-01-27-14-46-45.png)

Breve excursión: ¿Qué demonios son Apertura, Máximo, Mínimo, Cierre, Cierre Ajustado y Volumen? ¿Dónde está el precio?

¡No hay "un precio" en el mercado de valores! Puedes imaginar los datos OHLCV como "cubetas" o "bins" en el tiempo, que resumen todas las operaciones que ocurrieron en esa ventana. El gráfico de línea típico que conoces generalmente se refiere al precio "Cierre" de esa acción en el rango de tiempo X, por ejemplo, el valor que tuvo la acción al cierre del rango de tiempo.

Si estamos viendo datos diarios, "Apertura" se refiere al precio promedio (!) de la acción al inicio del mercado, mientras que "Cierre" se refiere al precio promedio (!) que tenía la acción al cierre del mercado. Si miramos datos horarias, la "Apertura" se refiere al inicio de la hora, como las 11 am, y el "Cierre" al cierre de esa hora, por lo que las 11:59:59 am.

Del mismo modo, "Máximo" es la operación/precio más alto registrado en ese marco de tiempo y "Mínimo" el más bajo. El volumen se refiere al número de activos o acciones negociadas en ese rango de tiempo.

Lo que significa que si, por ejemplo, "Mínimo" y "Cierre" de una columna están cerca uno del otro, lo más probable es que veamos una tendencia a la baja, ya que el cierre es el mínimo actual. También si el volumen es alto, hay muchas operaciones, por lo que si, por ejemplo, el volumen es superior al habitual, parece que hay algo sucediendo en el mercado. De todos modos, dirígete a [https://www.investopedia.com/](https://www.investopedia.com/  "https://www.investopedia.com/") para eso, ¡continuaremos codificando ahora!

### ¿Qué es "Cierre Ajustado"?

Esto es importante, ya que la mayoría de los algoritmos de ML están terriblemente confundidos por los datos de cierre "normales". Si hay una escisión en la acción, los datos parecerán que el precio ha tenido una caída increíble.

La razón, dicho de forma simple, es que si una acción se vuelve demasiado cara, la empresa decide "dividir" la acción en dos. ¿Significa eso que mi inversión se reduce a la mitad? Por supuesto que no, simplemente obtendrás el doble de acciones que posees, por lo que en papel aún mantienes el mismo valor de esa acción.

Curiosamente, una división suele hacer que los precios suban (¡humanos tontos!), y si tu algoritmo de aprendizaje automático ve una gran caída en el precio, lo más probable es que venda la acción.

Por esta razón, siempre debes usar valores "ajustados", que se pueden imaginar como datos de precio "limpios", teniendo en cuenta las divisiones, dividendos y todos los demás eventos que no afectan el valor real de los datos. Por lo tanto, intenta usar siempre datos ajustados para tus algoritmos.

En el caso de yfinance, es fácil de hacer, ya que podemos usar "Cierre Ajustado" en lugar de "Cierre".

### Representando los datos

Observando los datos, ya podemos ver una curva agradable y conocida

    plt.plot(df["Cierre Ajustado"])

## Segundo paso: Mejorando tus datos con datos estadísticos

Como se dijo anteriormente, necesitamos crear más información a partir de nuestros datos para que el algoritmo la utilice, ya que no puede hacerlo por sí mismo.

Me gusta usar la biblioteca ta ([https://github.com/bukosabino/ta](https://github.com/bukosabino/ta "https://github.com/bukosabino/ta")) ya que, de nuevo, es súper fácil de usar y contiene más de 100 cálculos estadísticos.

Instálala e impórtala con

    pip install ta
    from ta import add_all_ta_features
    from ta.utils import dropna

Ahora, si ya sabes qué valores quieres usar, puedes elegir solo esos, o simplemente romper todos los más de 100 con nuestros datos:

    df:dropna(df) # limpia los valores NaN si están presentes
    df:add_all_ta_features(df,open="Apertura", high="Máximo", low="Mínimo", close="Cierre Ajustado", volume="Volumen")

¿Qué hemos hecho?

    df.columns
    Index(['Apertura', 'Máximo', 'Mínimo', 'Cierre', 'Cierre Ajustado', 'Volumen', 'volumen_adi',
           'volumen_obv', 'volumen_cmf', 'volumen_fi', 'volumen_mfi', 'volumen_em',
           'volumen_sma_em', 'volumen_vpt', 'volumen_nvi', 'volumen_vwap',
           'volatilidad_atr', 'volatilidad_bbm',  ... ]
          dtype='object')

¡Bueno, eso debería ser suficiente por ahora!

Además, todavía hay muchos valores NaN, ya que algunos valores solo se calculan si ha pasado suficiente tiempo. En mi experiencia, rellenarlos con ceros funciona bastante bien, incluso aunque existan técnicas más avanzadas para eso.


    df:df.fillna(0)

## Tercer paso: Creando tus propias señales

¡Ahora es el momento de traducir tus extrañas ideas comerciales en números!

Empecemos con el cruce clásico de la media móvil. La idea es la siguiente: Si una media móvil corta cruza una media móvil más lenta, indica una subida o bajada de precio, dependiendo de la dirección del cruce.

De nuevo, echa un vistazo a investopedia para más detalles: [https://www.investopedia.com/articles/active-trading/052014/how-use-moving-average-buy-stocks.asp](https://www.investopedia.com/articles/active-trading/052014/how-use-moving-average-buy-stocks.asp "https://www.investopedia.com/articles/active-trading/052014/how-use-moving-average-buy-stocks.asp")

Nuestro objetivo es primero calcular las medias móviles, y luego formular cruces como 1 y -1, y 0 para señalar la ausencia de cruce.

### Creando medias móviles simples

    # creando medias móviles simples
    promedios:[1,2,5,10,15,20,25,50,100]
    for promedio in promedios:
      df['SMA_%d'%promedio]:df["Cierre Ajustado"].rolling(window=promedio).mean()
    
    # visualizar solo las medias móviles
    columna_filtro:[columna for columna in df if columna.startswith('SMA')]
    df[columna_filtro].tail()

Y algo de visualización:

    # resultados en cifras más grandes
    plt.rcParams["figure.figsize"]:(20,20)
    for filtro in columna_filtro:
      plt.plot(df[filtro],label=filtro)
    plt.legend()

![Trading de acciones con Python](/images/download.png "Imagen del autor")

### Creando una señal de cruce

Usemos una pequeña función auxiliar

    def createCross(data,fastSMA,slowSMA):
      fast:'SMA_%d'%fastSMA
      slow:'SMA_%d'%slowSMA
      nombre_cruce: "cross_%d_%d"%(fastSMA,slowSMA)
      fast_anterior:data[fast].shift(1)
      slow_anterior:data[slow].shift(1)
      neg:((data[fast] < data[slow]) & (fast_anterior >= slow_anterior))
      pos:((data[fast] > data[slow]) & (fast_anterior <= slow_anterior))
      data[nombre_cruce]:0
      data.loc[neg,nombre_cruce]:-1
      data.loc[pos,nombre_cruce]:1
      return data

Y ahora podrías insertar valores personalizados o seguir nuestro ejemplo y tomar solo los productos cruzados:

    for fast in promedios:
      for slow in promedios:
        if fast != slow and slow > fast:
          df:createCross(df,fast,slow)

Esto creó una señal de clasificación perfecta que indica un cruce alcista con 1, y un cruce bajista con -1, siendo 0 un cruce neutro (sin cruce).

Este es solo un ejemplo de las señales adicionales que puedes proporcionar.

### Creando una columna de cambio porcentual

Y para añadir otro ejemplo, si estás intentando predecir el cambio porcentual, necesitarás una columna que muestre el cambio porcentual con respecto al rango de tiempo anterior. Esto, afortunadamente, se puede hacer fácilmente con pandas.

    df["cambio_porcentual"]:df["Cierre Ajustado"].pct_change()
    
    Fecha
    2021-01-21    0.013363
    2021-01-22   -0.004463
    2021-01-25    0.000538
    2021-01-26    0.009754
    2021-01-27   -0.010484
    Nombre: cambio_porcentual, tipo: flotante64

¡Qué señal perfecta para un modelo de regresión!

# Resumen

Antes de agregar nuestras mejoras, el marco de datos solo contenía 5 columnas, ¡no mucho para un modelo de aprendizaje automático!

Al final, después de agregar valores estadísticos y nuestras propias señales, ¡ya hemos llegado a 135 características y columnas de nuestro marco de datos!

¡Mucho mejor para tu modelo!

¿Qué piensas de este proceso? ¿Me he perdido algo? ¡Comenta a continuación!  
¿Quieres leer más artículos de Justin? ¡Visita mi sitio web para más información!
