---
title: Gesichtserkennung mittels MTCNN
bg_image: "/images/index2-1-1280x720.webp"
date: 2020-06-08T07:10:46+02:00
author: Justin Guese
description: Gesichtserkennung mittels MTCNN - eine Anleitung mit Fokus auf Geschwindigkeit
image: "/images/index2-1-1280x720.webp"
categories:
- Computer Vision
- Big Data
- Machine Learning
tags:
- Face Detection
- Neuronal Networks
- MTCNN
- Big Data
- Machine Learning
type: post

---
# Was ist MTCNN

<br>

MTCNN ist eine Python (pip)-Bibliothek, die von [Github-Benutzer ipacz] (https://github.com/ipazc/mtcnn) geschrieben wurde und die [das Papier Zhang, Kaipeng et al. "Joint Face Detection and Alignment Using Multitask Cascaded Convolutional Networks" implementiert. IEEE Signal Processing Letters 23.10 (2016): 1499-1503. Querverweis. Web](https://arxiv.org/abs/1604.02878%5D(https://arxiv.org/abs/1604.02878%20%22https://arxiv.org/abs/1604.02878).

In diesem Papier schlagen sie einen tief kaskadierten Multi-Task-Rahmen vor, der verschiedene Merkmale von "Untermodellen" verwendet, um jeweils ihre korrelierenden Stärken zu verstärken.

MTCNN ist auf einer CPU recht schnell, obwohl S3FD auf einer GPU immer noch schneller läuft - aber das ist ein Thema für einen anderen Beitrag.

Dieser Beitrag verwendet Code aus den beiden folgenden Quellen, schauen Sie sich diese an, sie sind ebenfalls interessant:

* [https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/](https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/ "https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/")
* [https://www.kaggle.com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution](https://www.kaggle.com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution "https://www.kaggle.com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution")

<br>

# Grundlegende Verwendung von MTCNN

<br>

Zögern Sie nicht, auf das gesamte Notebook zuzugreifen:

[https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up](https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up "https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up")

    git clone https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up



Glücklicherweise ist MTCNN als Pip-Paket erhältlich, was bedeutet, dass wir es leicht installieren können mit

    pip install mtcnn



Wenn wir jetzt zu Python/Jupyter Notebook wechseln, können wir die Installation mit einem Import und einer schnellen Überprüfung überprüfen:

    import mtcnn
    # print version
    print(mtcnn.__version__)



Danach sind wir bereit, das Testbild mit der Matplotlib [imread-Funktion] (https://bit.ly/2vo3INw) auszuladen.

    import matplotlib.pyplot as plt
    # load image from file
    filename = "glediston-bastos-ZtmmR9D_2tA-unsplash.webp"
    pixels = plt.imread(filename)
    print("Shape of image/array:",pixels.shape)
    imgplot = plt.imshow(pixels)
    plt.show()

Nun wird Ihre Ausgabe in etwa so aussehen:

    {'box': [1942, 716, 334, 415], 'Vertrauen': 0,999999997615814209, 'Schlüsselpunkte': {'linkes_Auge': (2053, 901), "rechtes_Auge": (2205, 897), "Nase": (2139, 976), "Mund_links": (2139, 976), "Mund_links": (2058, 1029), 'Mund_rechts': (2058, 1029), 'Mund_rechts': (2206, 1023)}}
    {"Kiste": [2084, 396, 37, 46], 'Vertrauen': 0,9999206066131592, 'Schlüsselpunkte': {'linkes_Auge': [2084, 396, 37, 46], 'Vertrauen': [2084, 396, 37, 46], 'Vertrauen': 0,99999206066131592, 'Schlüsselpunkte': [0,9999206066131592], 'Vertrauen (2094, 414), "rechtes_Auge": (2094, 414), "rechtes_Auge": (2112, 414), "Nase": (2094, 414), "Nase": (2102, 426), "Mund_links": (2095, 432), "Mund_rechts": (2112, 431)}}
    {"Kiste": [1980, 381, 44, 59], 'Vertrauen': 0,9998701810836792, 'Schlüsselpunkte': {'linkes_Auge': [1980, 381, 44, 59], 'Vertrauen': 0,9998701810836792, 'Schlüsselpunkte': [1980, 381, 44, 59]: (1997, 404), "rechtes_Auge": (2019, 407), "Nase": (1997, 404), "Nase": (2010, 417), "Mund_links": (2010, 417), "Mund_links": (1995, 425), "Mund_rechts": (1995, 425), "Mund_rechts": (2015, 427)}}
    {"Kiste": [2039, 395, 39, 46], 'Vertrauen': 0,9993435740470886, 'Schlüsselpunkte': {'linkes_Auge': [2039, 395, 39, 46], 'Vertrauen': 0,9993435740470886, 'Vertrauen': 0,9993435740470886, 'Schlüsselpunkte': [2039, 395, 39, 46]: (2054, 409), "rechtes_Auge": (2054, 409), "rechtes_Auge": (2071, 415), "Nase": (2054, 409), "Nase": (2058, 422), "Mund_links": (2048, 425), 'Mund_rechts': (2048, 425), 'Mund_rechts': (2065, 431)}}

Was sagt uns das? Vieles davon ist selbsterklärend, aber im Grunde liefert es Koordinaten oder die Pixelwerte eines Rechtecks, in dem der MTCNN-Algorithmus Gesichter erkannt hat. Der obige "Kasten"-Wert gibt die Position des gesamten Gesichts zurück, gefolgt von einem "Vertrauens"-Level.

Wenn Sie fortgeschrittenere Extraktionen oder Algorithmen durchführen möchten, haben Sie auch Zugang zu anderen Landmarken des Gesichts, die als "Schlüsselpunkte" bezeichnet werden. Das MTCNN-Modell lokalisierte nämlich auch die Augen, den Mund und die Nase!

<br>

## Zeichnen eines Kastens um Gesichter

<br>

Um dies noch besser zu demonstrieren, zeichnen wir mit matplotlib einen Kasten um das Gesicht:

    # draw an image with detected objects
    def draw_facebox(filename, result_list):
    # load the image
    data = plt.imread(filename)
    # plot the image
    plt.imshow(data)
    # get the context for drawing boxes
    ax = plt.gca()
    # plot each box
    for result in result_list:
    # get coordinates
    x, y, width, height = result['box']
    # create the shape
    rect = plt.Rectangle((x, y), width, height, fill=False, color='green')
    # draw the box
    ax.add_patch(rect)
    # show the plot
    plt.show()

    # filename = 'test1.webp' # filename is defined above, otherwise uncomment
    # load image from file
    # pixels = plt.imread(filename) # defined above, otherwise uncomment
    # detector is defined above, otherwise uncomment
    #detector = mtcnn.MTCNN()
    # detect faces in the image
    faces = detector.detect_faces(pixels)
    # display faces on the original image
    draw_facebox(filename, faces)

![](/images/index-1-150x150.webp)

<br>

## Darstellung von Augen, Mund und Nase um Gesichter

<br>

Werfen wir nun einen Blick auf die oben erwähnten "Schlüsselpunkte", die das MTCNN-Modell zurückgebracht hat.

Wir werden diese nun auch für die Darstellung von Nase, Mund und Augen verwenden.  
Wir werden den folgenden Codeschnipsel zu unserem obigen Code hinzufügen:

    # draw the dots
    for key, value in result['keypoints'].items():
    # create and draw dot
    dot = plt.Circle(value, radius=20, color='orange')
    ax.add_patch(dot)

Mit dem vollständigen Code von oben, der wie folgt aussieht:

    # draw an image with detected objects
    def draw_facebox(filename, result_list):
    # load the image
    data = plt.imread(filename)
    # plot the image
    plt.imshow(data)
    # get the context for drawing boxes
    ax = plt.gca()
    # plot each box
    for result in result_list:
    # get coordinates
    x, y, width, height = result['box']
    # create the shape
    rect = plt.Rectangle((x, y), width, height,fill=False, color='orange')
    # draw the box
    ax.add_patch(rect)
    # draw the dots
    for key, value in result['keypoints'].items():
    # create and draw dot
    dot = plt.Circle(value, radius=20, color='red')
    ax.add_patch(dot)
    # show the plot
    plt.show()

    # filename = 'test1.webp' # filename is defined above, otherwise uncomment
    # load image from file
    # pixels = plt.imread(filename) # defined above, otherwise uncomment
    # detector is defined above, otherwise uncomment
    #detector = mtcnn.MTCNN()
    # detect faces in the image
    faces = detector.detect_faces(pixels)
    # display faces on the original image
    draw_facebox(filename, faces)

![](/images/index2-150x150.webp)

<br>

## Erweitertes MTCNN: Beschleunigen Sie es (\\\\~x100)!

<br>

Kommen wir nun zum interessanten Teil. Wenn Sie Millionen von Bildern verarbeiten wollen, müssen Sie MTCNN beschleunigen, sonst werden Sie entweder einschlafen oder Ihre CPU wird verbrennen, bevor sie fertig ist.

Aber worüber genau reden wir hier? Wenn Sie den obigen Code ausführen, dauert es etwa eine Sekunde, d.h. wir werden etwa ein Bild pro Sekunde verarbeiten. Wenn Sie MTCNN auf einer GPU ausführen und die beschleunigte Version verwenden, werden etwa 60-100 Bilder pro Sekunde erreicht. Das ist eine Steigerung von bis zu **100 Mal**!

Wenn Sie z.B. alle Gesichter eines Films extrahieren wollen, wobei Sie 10 Gesichter pro Sekunde extrahieren (eine Sekunde des Films hat im Durchschnitt etwa 24 Bilder, also jedes zweite Bild), dann sind es 10 * 60 (Sekunden) * 120 (Minuten) = 72.000 Bilder.

Das heißt, wenn die Verarbeitung eines Einzelbildes eine Sekunde dauert, dauert sie 72.000 * 1 (Sekunden) = 72.000s / 60s = 1.200m = **20 Stunden**.

Mit der Beschleunigungsversion von MTCNN wird diese Aufgabe 72.000 (Frames) / 100 (Frames/sec) = 720 Sekunden = **12 Minuten** dauern!

Um MTCNN auf einer GPU zu verwenden, müssen Sie CUDA, cudnn, pytorch usw. einrichten. [Pytorch hat ein gutes Tutorial zu diesem Teil geschrieben](https://pytorch.org/get-started/locally/).

Nach der Installation werden wir die notwendigen Importe wie folgt durchführen:

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

Sehen Sie, wie wir das Gerät im obigen Code definiert haben. Sie können alles auch auf einer CPU laufen lassen, wenn Sie CUDA nicht einrichten wollen oder können.

Als nächstes werden wir den Extraktor definieren:

    # define our extractor
    fast_mtcnn = FastMTCNN(
    stride=4,
    resize=0.5,
    margin=14,
    factor=0.6,
    keep_all=True,
    device=device
    )

In diesem Schnipsel geben wir einige Parameter weiter, wobei wir zum Beispiel nur die halbe Bildgröße verwenden, was einer der Haupteinflussfaktoren für die Beschleunigung ist.

Und schließlich lassen wir das Skript zur Gesichtsextraktion laufen:

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
    f'Frames per second: {frames_processed / (time.time() - start):.3f},',
    f'faces detected: {faces_detected}\r',
    end=''
    )

    v_cap.stop()

    run_detection(fast_mtcnn, filenames)

![](/images/teslap100frames.webp)

Das obige Bild zeigt die Ausgabe des Codes, der auf einem NVIDIA Tesla P100 läuft. Je nach Quellmaterial, Grafikprozessor und Prozessor kann die Leistung also besser oder schlechter ausfallen.


[Sie haben eine ähnliche Idee oder wir haben Ihr Interesse geweckt? Kontaktieren Sie uns jetzt für eine gratis 15-minütige Beratung!](https://www.datafortress.cloud/de/contact/)
