---
author: Justin Guese
bg_image: /images/serverless-investing-bot-facebook-prophet-machine-learning.png
categories:
- comercio algorítmico
- aws
- sin servidor
- Aprendizaje automático
date: '2022-05-23T22:00:00+00:00'
description: Cómo desplegar un bot de trading automatizado utilizando el modelo de
  aprendizaje automático Facebook Prophet en AWS Lambda (sin servidor)
image: /images/serverless-investing-bot-facebook-prophet-machine-learning-1.png
tags:
- cloud-computing
- machine-learning
- algorithmic-trading
- stock
- aws
- aws-lambda
- serverless
- facebook-prophet
title: Cómo implementar un bot de trading automatizado utilizando el modelo de aprendizaje
  automático Facebook Prophet en AWS Lambda (sin servidor)
type: post

---
Dividí esta publicación en "Por qué lo hice" y "Cómo hacerlo técnicamente". Si quieres omitir la parte del "Por qué", puedes ir directamente a la parte técnica.


**1. Confiabilidad:** El algoritmo se ejecutará independientemente de otros sistemas, actualizaciones, etc.

**2. Eficiencia de rendimiento:** Puedo ejecutar varios algoritmos en un solo sistema (pequeño), independientemente unos de otros.

**3. Ahorro de costos:** AWS permite [3,2 millones de segundos de computación](https://aws.amazon.com/lambda/?did=ft_card&trk=ft_card) al mes, lo que básicamente me permite ejecutar todos mis algoritmos gratis.

He estado buscando una forma de asegurarme de que mi bot de inversión se ejecute con seguridad, ya que una ejecución fallida podría costar mucho dinero si una operación no se cancela rápidamente si va en la dirección equivocada. Además, quería evitar que mi computadora funcionara todo el tiempo y asegurarme de que varios algoritmos pudieran ejecutarse simultáneamente sin influirse ni retrasar su ejecución.

Además, es una buena idea tener un algoritmo de inversión funcionando sin preocuparse por las actualizaciones del sistema operativo, las fallas de hardware y los cortes de energía, etc., lo cual es la ventaja general de las tecnologías sin servidor.

En este momento, puedo ejecutar varias variaciones del algoritmo para probar alteraciones y asegurarme de que se ejecuten. ¿Otra cosa buena? AWS ofrece alrededor de 1 millón de llamadas Lambda gratuitas, lo que me permite ejecutar toda la arquitectura en su nivel gratuito.

## El algoritmo de inversión

Explicaré el algoritmo con más detalle en otra publicación en mi sitio web [www.datafortress.cloud](http://www.datafortress.cloud), pero mi configuración típica de algoritmo de inversión consiste en:

1. Probar el algoritmo usando [Backtrader](https://www.backtrader.com/), un marco de prueba de algoritmos de código abierto escrito en Python.
2. Convertir el algoritmo exitoso en un solo archivo Python que contenga un método `run()` que devuelve las inversiones realizadas.
3. Transferir el archivo Python a AWS Lambda, donde llamo a la función `run()` con la función `lambda_handler` de AWS Lambda.

En este algoritmo de ejemplo, tomo decisiones de inversión dependiendo de si el precio actual está por encima o por debajo de la línea de tendencia predicha por el modelo [Prophet de Facebook](https://facebook.github.io/prophet/). He tomado ideas de Sean Kelley](http://seangtkelley.me/blog/2018/08/15/algo-trading-pt2), quien escribió una configuración de Backtrader sobre cómo utilizar Prophet con Backtrader.

Mi universo de acciones en esta configuración se calcula eligiendo las 20 acciones más importantes del índice SPY500 que obtuvieron el mayor rendimiento en los últimos X pasos de tiempo.

La fuente de datos es Yahoo Finance, utilizando la  [biblioteca gratuita yfinance](https://pypi.org/project/yfinance/), y como mi corredor algorítmico de elección, he elegido [Alpaca.markets](https://alpaca.markets/).

En mi configuración, el algoritmo se ejecutará una vez al día a las 3 p. m. o cada 15 minutos durante el horario de negociación.

### Los problemas de implementar Facebook Prophet en AWS Lambda

AWS Lambda viene con algunas bibliotecas de Python preinstaladas, pero como muchos de ustedes saben, esto es bastante limitado de forma predeterminada (lo cual es razonable para la promesa de Lambda). Sin embargo, Lambda permite instalar paquetes privados, lo cual es bastante fácil para paquetes más pequeños (consulta la [documentación oficial](https://docs.aws.amazon.com/lambda/latest/dg/python-package.html)), pero se vuelve un poco más complicado si se trabaja con paquetes que superan los 250 Mb de tamaño. Desafortunadamente, el modelo Prophet de Facebook supera este límite, pero afortunadamente [Alexandr Matsenov resolvió este problema reduciendo el tamaño del paquete](https://towardsdatascience.com/how-to-get-fbprophet-work-on-aws-lambda-c3a33a081aaf) y [Marc Metz solucionó los problemas de compilación para que funcione en AWS Lambda](https://github.com/marcmetz/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda).

Se pueden agregar bibliotecas que no son predeterminadas a AWS Lambda utilizando capas, que contienen todos los paquetes necesarios. Si se importa una capa, puedes simplemente importar los paquetes en tu función Python como lo harías en tu configuración local.

## Cómo hacerlo (técnico)

Finalmente, permíteme explicar cómo puedes lograr esto exactamente. Consulta este TLDR para los impacientes, o la versión más detallada a continuación.

**TLDR;**

1. Necesitarás una capa Lambda, sube la mía ([descarga](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip)) que contiene Prophet, yfinance, etc., a un bucket S3 (acceso privado).
2. Selecciona AWS Lambda, crea una función, agrega una capa y pega la URL del objeto S3.
3. Pega tu `lambda_function.py` en el editor de Lambda ([o usa la mía](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py)).
4. Configura las variables de entorno (opcional).
5. Ejecútala manualmente haciendo clic en "probar", o dirígete a CloudWatch -> Reglas -> Crear regla y configura "Programar ejecución" para ejecutarla en un intervalo de tiempo específico.

**Explicación detallada**:

### 1. Creación de una capa personalizada para AWS Lambda

Puedes usar mi capa Lambda que contiene Facebook Prophet, NumPy, pandas, [alpaca-trading-API](https://github.com/alpacahq/alpaca-trade-api-python), yfinance ([GitHub](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda)) o compilar la tuya propia siguiendo la explicación de [Marc](https://medium.com/@marc.a.metz/docker-run-rm-it-v-pwd-var-task-lambci-lambda-build-python3-7-bash-c7d53f3b7eb2).

**Usando mi capa Lambda**

1. Descarga el archivo ZIP de mi repositorio de GitHub](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip) que contiene todos los paquetes ([Enlace](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip)).
2. Como solo puedes cargar capas directamente a Lambda hasta un tamaño de 50 Mb, primero tendrás que subir el archivo a AWS S3.
3. Crea un bucket y coloca el archivo ZIP descargado en él. ¡El acceso puede permanecer privado y NO necesita ser público! Copia la URL de tu archivo (por ejemplo, [https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip](https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip "https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip")).
4. Inicia sesión en AWS y ve a Lambda -> Capas ([Enlace de Centro de Europa](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/layers)).
5. Haz clic en "Crear capa", dale un nombre que coincida y selecciona "Cargar un archivo desde Amazon S3", y copia el código del paso 3. Como entorno de ejecución, selecciona Python 3.7. Haz clic en crear.

**Compilar tu propia capa Lambda**

Sigue las instrucciones de [Marc](https://medium.com/@marc.a.metz/docker-run-rm-it-v-pwd-var-task-lambci-lambda-build-python3-7-bash-c7d53f3b7eb2).

### 2. Configurar una función AWS Lambda

1. Abre el panel de funciones Lambda ([Enlace de Centro de Europa](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions)) y haz clic en "Crear función".
2. Deja la casilla "Crear desde cero" tal como está y dale un nombre apropiado.
3. En "Entorno de ejecución", selecciona Python 3.7, deja el resto como está y haz clic en "Crear función".
4. En la vista general de la pestaña "diseñador", verás una representación gráfica de tu función Lambda. Haz clic en el cuadro "capas" debajo y haz clic en "Agregar capa". Si configuras la capa correctamente, podrás seleccionarla en el diálogo siguiente. Finalmente, haz clic en "Agregar".
5. En la pestaña "diseñador", selecciona tu función Lambda. Si te desplazas hacia abajo, verás un fragmento de código Python predeterminado en un archivo llamado `lambda_function.py`. Si has estructurado tu código de la misma manera que el mío ([Enlace](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py)), puedes ejecutar tu función con la función `run()`. Si se llama a una función Lambda, ejecutará la función `lambda_handler(event, context)` desde la que, por ejemplo, podrías llamar a la función `run()`. Por supuesto, puedes cambiar los nombres de todos los archivos y funciones, pero por simplicidad en este proyecto, lo dejo como está.
6. Puedes pegar mi función [aquí](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py) y probarla.
7. Al hacer clic en "Probar", la ejecución debería ser exitosa; de lo contrario, mostrará los errores en el diálogo.

### 3. Uso de variables de entorno en AWS Lambda

Nunca debes dejar tus nombres de usuario y contraseñas como texto sin formato en tu código, ¡por lo que siempre debes usar variables de entorno! Afortunadamente, Lambda también las usa y se pueden llamar fácilmente con el paquete `os` de Python. Por ejemplo, en mi script estoy llamando a la variable de usuario con `os.environ['ALPACAUSER']`. Las variables de entorno se pueden configurar en la pantalla principal de la función Lambda, debajo del editor de código.

### 4. Ejecución de funciones AWS Lambda en un intervalo de tiempo específico

El concepto de sin servidor y AWS Lambda se basa en la idea de que una función se ejecuta cuando ocurre un evento desencadenante. En mi configuración, quería que la función se llamara, por ejemplo, cada 15 minutos durante el horario de negociación, de lunes a viernes. Afortunadamente, AWS ofrece una manera de desencadenar un evento sin necesidad de ejecutar un servidor, utilizando el servicio CloudWatch.

1. Ve a CloudWatch ([Enlace de Centro de Europa](https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1)).
2. En el panel izquierdo, selecciona "Eventos" y "Reglas".
3. Haz clic en "Crear regla" y selecciona "Programación" en lugar de "Patrón de evento". Aquí puedes usar el diálogo simple "Tasa fija" o crear una expresión cron. Estoy usando [https://crontab.guru/](https://crontab.guru/ "https://crontab.guru/") (gratis) para crear expresiones cron. Mi expresión cron para el caso de uso anterior es "0/15 13-21 ? * MON-FRI *".
4. En el panel derecho, selecciona "Agregar destino" y selecciona tu función Lambda. Se agregará automáticamente a Lambda.
5. Finalmente, haz clic en "Configurar detalles", dale un nombre y haz clic en "Crear regla".

### 5. (opcional) Análisis de registros, búsqueda de errores

Si has llegado a esta parte, ¡deberías haber terminado! Pero si quieres verificar si todo funcionó, puedes usar CloudWatch para ver las salidas de las funciones Lambda. Accede a CloudWatch -> Registros -> Grupos de registros ([Enlace de Centro de Europa](https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1#logsV2:log-groups)) y selecciona tu función Lambda. En esta vista general, deberías poder ver la salida de tus funciones.

Si te gustó esta publicación, deja un comentario o visita mi blog [www.datafortress.cloud](http://www.datafortress.cloud) para mantenerme motivado 😊.
