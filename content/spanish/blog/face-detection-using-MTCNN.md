---
author: Justin Guese
bg_image: images/index2-1-1280x720.webp
categories:
- Visión por Computadora
- Gran Volumen de Datos
- Aprendizaje Automático
date: '2022-06-08T07:10:46+02:00'
description: Detección de Rostros con MTCNN – una guía para la extracción de rostros
  con enfoque en la velocidad
image: images/index2-1-1280x720.webp
tags:
- Face Detection
- Neuronal Networks
- MTCNN
- Big Data
- Machine Learning
title: Detección de rostros con MTCNN
type: post

---
<br>

MTCNN es una biblioteca de Python (pip) escrita por el usuario de GitHub [ipacz](https://github.com/ipazc/mtcnn), que implementa el artículo [Zhang, Kaipeng et al. “Detección y alineación conjunta de rostros utilizando redes convolucionales en cascada multinivel.” IEEE Signal Processing Letters 23.10 (2016): 1499–1503. Crossref. Web](https://arxiv.org/abs/1604.02878).

En este artículo, proponen un marco multinivel en cascada profundo que utiliza diferentes características de "submodelos" para aumentar sus fortalezas correlacionadas.

MTCNN funciona bastante rápido en una CPU, aunque S3FD aún es más rápido ejecutándose en una GPU; pero ese es un tema para otro artículo.

Este artículo utiliza código de las siguientes dos fuentes, échalos un vistazo, también son interesantes:

* [https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/](https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/)
* [https://www.kaggle.com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution](https://www.kaggle.com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution)

<br>

# Uso básico de MTCNN

<br>

Puedes acceder al cuaderno completo a través de:

[https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up](https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up)

    git clone https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up



Afortunadamente, MTCNN está disponible como paquete pip, lo que significa que podemos instalarlo fácilmente con

    pip install mtcnn



Ahora, cambiando a Python/Jupyter Notebook, podemos verificar la instalación con una importación y una verificación rápida:

    import mtcnn
    # Imprimir la versión
    print(mtcnn.__version__)



Luego, estamos listos para cargar nuestra imagen de prueba usando la función de matplotlib [imread](https://bit.ly/2vo3INw).

    import matplotlib.pyplot as plt
    # Cargar imagen desde archivo
    filename = "glediston-bastos-ZtmmR9D_2tA-unsplash.webp"
    pixels = plt.imread(filename)
    print("Forma de la imagen/matriz:", pixels.shape)
    imgplot = plt.imshow(pixels)
    plt.show()

Ahora, tu salida se verá muy parecida a esto:

    {'box': [1942, 716, 334, 415], 'confidence': 0.9999997615814209, 'keypoints': {'ojo_izquierdo': (2053, 901), 'ojo_derecho': (2205, 897), 'nariz': (2139, 976), 'boca_izquierda': (2058, 1029), 'boca_derecha': (2206, 1023)}}
    {'box': [2084, 396, 37, 46], 'confidence': 0.9999206066131592, 'keypoints': {'ojo_izquierdo': (2094, 414), 'ojo_derecho': (2112, 414), 'nariz': (2102, 426), 'boca_izquierda': (2095, 432), 'boca_derecha': (2112, 431)}}
    {'box': [1980, 381, 44, 59], 'confidence': 0.9998701810836792, 'keypoints': {'ojo_izquierdo': (1997, 404), 'ojo_derecho': (2019, 407), 'nariz': (2010, 417), 'boca_izquierda': (1995, 425), 'boca_derecha': (2015, 427)}}
    {'box': [2039, 395, 39, 46], 'confidence': 0.9993435740470886, 'keypoints': {'ojo_izquierdo': (2054, 409), 'ojo_derecho': (2071, 415), 'nariz': (2058, 422), 'boca_izquierda': (2048, 425), 'boca_derecha': (2065, 431)}}

¿Qué nos dice esto? Mucho de ello es autoexplicativo, pero básicamente devuelve las coordenadas, o los valores de píxeles de un rectángulo donde el algoritmo MTCNN detectó caras. El valor "box" anterior devuelve la ubicación de toda la cara, seguido de un nivel de "confianza".

Si deseas realizar extracciones o algoritmos más avanzados, tendrás acceso a otros puntos de referencia faciales, llamados también "puntos clave". ¡En concreto, el modelo MTCNN también localizó los ojos, la boca y la nariz!

<br>

## Dibujar un cuadro alrededor de las caras

<br>

Para demostrarlo aún mejor, dibujemos un cuadro alrededor de la cara usando matplotlib:

    # Dibujar una imagen con objetos detectados
    def draw_facebox(filename, result_list):
    # Cargar la imagen
    data = plt.imread(filename)
    # Trazar la imagen
    plt.imshow(data)
    # Obtener el contexto para dibujar cuadros
    ax = plt.gca()
    # Trazar cada cuadro
    for result in result_list:
    # Obtener las coordenadas
    x, y, width, height = result['box']
    # Crear la forma
    rect = plt.Rectangle((x, y), width, height, fill=False, color='green')
    # Dibujar el cuadro
    ax.add_patch(rect)
    # Mostrar la gráfica
    plt.show()

    # filename = 'test1.webp' # filename se define arriba, de lo contrario descomentar
    # cargar imagen desde archivo
    # pixels = plt.imread(filename) # definido arriba, de lo contrario descomentar
    # detector se define arriba, de lo contrario descomentar
    #detector = mtcnn.MTCNN()
    # detectar caras en la imagen
    faces = detector.detect_faces(pixels)
    # mostrar caras en la imagen original
    draw_facebox(filename, faces)

![](/images/index-1-150x150.webp)

<br>

## Mostrar ojos, boca y nariz alrededor de las caras

<br>

Ahora echemos un vistazo a los "puntos clave" que devolvió el modelo MTCNN.

Ahora utilizaremos estos para graficar la nariz, la boca y los ojos también. Agregaremos el siguiente fragmento de código a nuestro código anterior:

    # Dibujar los puntos
    for key, value in result['keypoints'].items():
    # Crear y dibujar el punto
    dot = plt.Circle(value, radius=20, color='orange')
    ax.add_patch(dot)

Con el código completo de arriba, que se ve así:

    # Dibujar una imagen con objetos detectados
    def draw_facebox(filename, result_list):
    # Cargar la imagen
    data = plt.imread(filename)
    # Trazar la imagen
    plt.imshow(data)
    # Obtener el contexto para dibujar cuadros
    ax = plt.gca()
    # Trazar cada cuadro
    for result in result_list:
    # Obtener las coordenadas
    x, y, width, height = result['box']
    # Crear la forma
    rect = plt.Rectangle((x, y), width, height,fill=False, color='orange')
    # Dibujar el cuadro
    ax.add_patch(rect)
    # Dibujar los puntos
    for key, value in result['keypoints'].items():
    # Crear y dibujar el punto
    dot = plt.Circle(value, radius=20, color='red')
    ax.add_patch(dot)
    # Mostrar la gráfica
    plt.show()

    # filename = 'test1.webp' # filename se define arriba, de lo contrario descomentar
    # cargar imagen desde archivo
    # pixels = plt.imread(filename) # definido arriba, de lo contrario descomentar
    # detector se define arriba, de lo contrario descomentar
    #detector = mtcnn.MTCNN()
    # detectar caras en la imagen
    faces = detector.detect_faces(pixels)
    # mostrar caras en la imagen original
    draw_facebox(filename, faces)

![](/images/index2-150x150.webp)

<br>

## MTCNN avanzado: ¡Aceléralo (aprox. x100)!

<br>

Ahora llegamos a la parte interesante. Si vas a procesar millones de imágenes, necesitarás acelerar MTCNN, de lo contrario, te quedarás dormido o tu CPU se quemará antes de que termine.

¿Pero de qué estamos hablando exactamente? Si ejecutas el código anterior, tardará aproximadamente un segundo, lo que significa que procesaremos aproximadamente una imagen por segundo. Si ejecutas MTCNN en una GPU y usas la versión acelerada, alcanzarás entre 60 y 100 imágenes/fotogramas por segundo. ¡Eso es un aumento de hasta **100 veces**!

Si, por ejemplo, vas a extraer todas las caras de una película, donde extraes 10 caras por segundo (un segundo de la película tiene, en promedio, alrededor de 24 fotogramas, por lo que cada segundo fotograma), serán 10 * 60 (segundos) * 120 (minutos) = 72.000 fotogramas.

Lo que significa que si tarda un segundo en procesar un fotograma, tardará 72.000 * 1 (segundos) = 72.000 s / 60 s = 1.200 m = **20 horas**

Con la versión acelerada de MTCNN, esta tarea tardará 72.000 (fotogramas) / 100 (fotogramas/segundo) = 720 segundos = **12 minutos**!

Para usar MTCNN en una GPU, necesitarás configurar CUDA, cudnn, PyTorch y demás. [PyTorch escribió un buen tutorial sobre esa parte](https://pytorch.org/get-started/locally/).

Una vez instalado, haremos las importaciones necesarias de la siguiente manera:

    from facenet_pytorch import MTCNN
    from PIL import Image
    import torch
    from imutils.video import FileVideoStream
    import cv2
    import time
    import glob
    from tqdm.notebook import tqdm

    device = 'cuda' if torch.cuda.is_available() else 'cpu'

    filenames = ["glediston-bastos-ZtmmR9D_2tA-unsplash.webp","glediston-bastos-ZtmmR9D_2tA-unsplash.webp"]

¿Ves cómo definimos el dispositivo en el código anterior? También podrás ejecutar todo en una CPU si no deseas o no puedes configurar CUDA.

A continuación, definiremos el extractor:

    # definir nuestro extractor
    fast_mtcnn = FastMTCNN(
    stride=4,
    resize=0.5,
    margin=14,
    factor=0.6,
    keep_all=True,
    device=device
    )

En este fragmento, pasamos algunos parámetros, donde, por ejemplo, solo usamos la mitad del tamaño de la imagen, que es uno de los principales factores de impacto para acelerarlo.

Finalmente, ejecutemos el script de extracción de caras:

    def run_detection(fast_mtcnn, filenames):
    frames = []
    frames_processed = 0
    faces_detected = 0
    batch_size = 60
    start = time.time()

    for filename in tqdm(filenames):

    v_cap = FileVideoStream(filename).start()
    v_len = int(v_cap.stream.get(cv2.CAP_PROP_FRAME_COUNT))

    for j in range(v_len):

    frame = v_cap.read()
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frames.append(frame)

    if len(frames) >= batch_size or j == v_len - 1:

    faces = fast_mtcnn(frames)

    frames_processed += len(frames)
    faces_detected += len(faces)
    frames = []

    print(
    f'Fotogramas por segundo: {frames_processed / (time.time() - start):.3f},',
    f'caras detectadas: {faces_detected}\r',
    end=''
    )

    v_cap.stop()

    run_detection(fast_mtcnn, filenames)

![](/images/teslap100frames.webp)

La imagen anterior muestra la salida del código ejecutándose en una NVIDIA Tesla P100, por lo que, dependiendo del material fuente, la GPU y el procesador, puedes experimentar un mejor o peor rendimiento.


</br>
¿Estás trabajando en un proyecto similar? ¿Te interesa algo similar? [Contáctanos ahora](/contact) para una consulta gratuita de 15 minutos.](/contact/)
