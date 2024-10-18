---
author: Justin Guese
bg_image: /images/index2-1-1280x720.webp
categories:
- Computer Vision
- Big Data
- Machine Learning
date: 2022-06-08 07:10:46+02:00
description: "Gesichtserkennung mit MTCNN - ein Leitfaden f\xFCr die Gesichtserkennung\
  \ mit Schwerpunkt auf Geschwindigkeit"
image: /images/index2-1-1280x720.webp
tags:
- Face Detection
- Neuronal Networks
- MTCNN
- Big Data
- Machine Learning
title: Gesichtserkennung mit MTCNN
type: post
---

# Was ist MTCNN?

<br>

MTCNN ist eine Python-Bibliothek (pip), die von [Github-Benutzer ipacz](https://github.com/ipazc/mtcnn), die das [Papier Zhang] umsetzt, Kaipeng und andere. \Gemeinsame Gesichtserkennung und -ausrichtung mit kaskadierten Multitask-Faltungsnetzen.\ IEEE Signal Processing Letters 23.10 (2016): 1499-1503. Crossref. Web](https://arxiv.org/abs/1604.02878%5D(https://arxiv.org/abs/1604.02878%20%22https://arxiv.org/abs/1604.02878).

In diesem Papier, sie schlagen ein tiefes, kaskadiertes Multi-Task-System vor, das verschiedene Merkmale von \Untermodellen\ verwendet, um deren Korrelationsstärke zu erhöhen.

MTCNN arbeitet recht schnell auf einer CPU, auch wenn S3FD auf einer GPU noch schneller ist - aber das ist ein Thema für einen anderen Beitrag.

Dieser Beitrag verwendet Code aus den folgenden beiden Quellen, überprüfen Sie sie, auch sie sind interessant:

* [https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/](https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/ \https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/\)
* [https://www...com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution](https://www...com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution \https://www...com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution\)

<br>

# Grundlegende Verwendung von MTCNN

<br>

Sie können das gesamte Notizbuch über die folgende Adresse aufrufen:

[https://github.com/JustinGuese/mtcnn-gesichtsextraktion-augen-mund-nase-und-beschleunigen-es-auf](https://github.com/JustinGuese/mtcnn-gesichtsextraktion-augen-mund-nase-und-beschleunigen-es-\https://github.com/JustinGuese/mtcnn-gesichtsextraktion-augen-mund-nase-und-beschleunigen-es-up\)

    git clone https://github.com/JustinGuese/mtcnn-gesichtsextraktion-augen-mund-nase-und-beschleunigen-es-auf



Glücklicherweise ist MTCNN als Pip-Paket verfügbar, Das heißt, wir können es einfach installieren mit

    pip install mtcnn



Wenn wir nun zu Python/Jupyter Notebook wechseln, können wir die Installation mit einem Import und einer schnellen Überprüfung überprüfen:

    import mtcnn
    # print version
    print(mtcnn.__version__)



Danach, Wir sind bereit, das Testbild mit der matplotlib [imread-Funktion] zu laden (https://bit.ly/2vo3INw).

    matplotlib importieren.pyplot als plt
    # Bild aus Datei laden
    filename = \glediston-bastos-ZtmmR9D_2tA-unsplash.webp\
    Pixel = plt.imread(Dateiname)
    print(\Form des Bildes/Arrays:\),Pixel.Form)
    imgplot = plt.imshow(pixel)
    plt.zeigen()

Ihre Ausgabe wird nun in etwa so aussehen:

    {'box': [1942, 716, 334, 415], 'Vertrauen': 0.9999997615814209, 'Keypoints': {'left_eye': (2053, 901), rechtes_Auge\: (2205, 897), Nase\: (2139, 976), Mund_links\: (2058, 1029), Mund_rechts\: (2206, 1023)}}
    {'box': [2084, 396, 37, 46], 'Vertrauen': 0.9999206066131592, 'Keypoints': {'left_eye': (2094, 414), rechtes_Auge\: (2112, 414), Nase\: (2102, 426), Mund_links\: (2095, 432), Mund_rechts\: (2112, 431)}}
    { 'Box': [1980, 381, 44, 59], 'Vertrauen': 0.9998701810836792, 'Keypoints': {'left_eye': (1997, 404), right_eye\: (2019, 407), Nase\: (2010, 417), Mund_links\: (1995, 425), mouth_right\: (2015, 427)}}
    { 'box': [2039, 395, 39, 46], 'Vertrauen': 0.9993435740470886, 'Keypoints': {'left_eye': (2054, 409), rechtes_Auge\: (2071, 415), Nase\: (2058, 422), Mund_links\: (2048, 425), Mund_rechts\: (2065, 431)}}

Was sagt uns das? Vieles davon ist selbsterklärend, aber im Grunde liefert es Koordinaten, oder die Pixelwerte eines Rechtecks, in dem der MTCNN-Algorithmus Gesichter erkannt hat. Der obige Wert \box\ gibt die Position der gesamten Fläche an, gefolgt von einem \Vertrauensniveau.

Wenn Sie fortgeschrittenere Extraktionen oder Algorithmen verwenden möchten, Sie werden Zugang zu anderen Gesichtsmerkmalen haben, auch \Keypoints\ genannt. Das MTCNN-Modell ortete nämlich die Augen, auch Mund und Nase!

<br>

## Zeichnen eines Rahmens um Gesichter

<br>

Um dies noch besser zu demonstrieren, wollen wir mit matplotlib einen Rahmen um das Gesicht zeichnen:

    # ein Bild mit erkannten Objekten zeichnen
    def draw_facebox(filename, result_list):
    # Lade das Bild
    Daten = plt.imread(Dateiname)
    # Plotten des Bildes
    plt.imshow(Daten)
    # den Kontext für das Zeichnen von Boxen erhalten
    ax = plt.gca()
    # Jede Box wird gezeichnet.
    for result in result_list:
    # Koordinaten ermitteln
    x, y, Breite, height = result['box']
    # die Form erstellen
    rekt = plt.Rectangle((x, y), Breite, Höhe, fill=False, color='grün')
    # Zeichnen Sie den Kasten
    ax.add_patch(rect)
    # Anzeige des Plots
    plt.zeigen()

    # Dateiname = 'test1.webp' # Dateiname ist oben definiert, sonst unkommentiert
    # Bild aus Datei laden
    # Pixel = plt.imread(filename) # oben definiert, sonst unkommentiert
    # Detektor ist oben definiert, sonst unkommentiert
    #detector = mtcnn.MTCNN()
    # Gesichter im Bild erkennen
    Gesichter = Detektor.detect_faces(pixels)
    # Gesichter auf dem Originalbild anzeigen
    draw_facebox(Dateiname, Gesichter)

![](/images/index-1-150x150.webp)

<br>

## Anzeige der Augen, Mund, und Nase um Gesichter

<br>

Werfen wir nun einen Blick auf die oben erwähnten \Keypoints\, die das MTCNN-Modell liefert.

Wir werden diese nun verwenden, um die Nase grafisch darzustellen, Mund, und auch die Augen.  
Wir werden den folgenden Codeschnipsel zu unserem obigen Code hinzufügen:

    # Zeichnen Sie die Punkte
    für Schlüssel, Wert in Ergebnis['Keypoints'].items():
    # Punkt erstellen und zeichnen
    Punkt = plt.Kreis(Wert, Radius=20, color='orange')
    ax.add_patch(punkt)

Der vollständige Code von oben sieht wie folgt aus:

    # ein Bild mit erkannten Objekten zeichnen
    def draw_facebox(filename, result_list):
    # Lade das Bild
    Daten = plt.imread(Dateiname)
    # Plotten des Bildes
    plt.imshow(Daten)
    # den Kontext für das Zeichnen von Boxen erhalten
    ax = plt.gca()
    # Jede Box wird gezeichnet.
    for result in result_list:
    # Koordinaten ermitteln
    x, y, Breite, height = result['box']
    # die Form erstellen
    rekt = plt.Rectangle((x, y), Breite, Höhe,fill=False, color='orange')
    # Zeichnen Sie den Kasten
    ax.add_patch(rect)
    # Zeichnen Sie die Punkte
    für Schlüssel, Wert in Ergebnis['Keypoints'].items():
    # Punkt erstellen und zeichnen
    Punkt = plt.Kreis(Wert, Radius=20, color='rot')
    ax.add_patch(punkt)
    # Anzeige des Plots
    plt.zeigen()

    # Dateiname = 'test1.webp' # Dateiname ist oben definiert, sonst unkommentiert
    # Bild aus Datei laden
    # Pixel = plt.imread(filename) # oben definiert, sonst unkommentiert
    # Detektor ist oben definiert, sonst unkommentiert
    #detector = mtcnn.MTCNN()
    # Gesichter im Bild erkennen
    Gesichter = Detektor.detect_faces(pixels)
    # Gesichter auf dem Originalbild anzeigen
    draw_facebox(Dateiname, Gesichter)

![](/images/index2-150x150.webp)

<br>

## Erweitertes MTCNN: Speed it up (\\\\\\~x100)!

<br>

Kommen wir nun zum interessanten Teil. Wenn Sie Millionen von Bildern verarbeiten wollen, müssen Sie MTCNN beschleunigen., ansonsten, Sie werden entweder einschlafen oder Ihre CPU wird verbrennen, bevor sie fertig ist..

Aber wovon genau sprechen wir hier? Wenn Sie den obigen Code ausführen, dauert es etwa eine Sekunde, Das bedeutet, dass wir etwa ein Bild pro Sekunde verarbeiten werden.. Wenn Sie MTCNN auf einer GPU laufen lassen und die beschleunigte Version verwenden, erreichen Sie etwa 60-100 Bilder/Bilder pro Sekunde. Das ist eine Steigerung um das bis zu **100-fache**!

Wenn Sie zum Beispiel alle Gesichter eines Films extrahieren wollen, wo Sie 10 Gesichter pro Sekunde extrahieren (eine Sekunde des Films hat im Durchschnitt 24 Bilder, also jedes zweite Bild) sind es 10 * 60 (Sekunden) * 120 (Minuten) = 72,000 Rahmen.

Das heißt, wenn es eine Sekunde dauert, ein Bild zu verarbeiten, dauert es 72,000 * 1 (Sekunden) = 72,000s / 60s = 1,200m = **20 Stunden**

Mit der beschleunigten Version von MTCNN dauert diese Aufgabe 72,000 (Bilder) / 100 (Bilder/Sek) = 720 Sekunden = **12 Minuten**!

Um MTCNN auf einer GPU zu verwenden, müssen Sie CUDA einrichten, miraclenn, pytorch und so weiter. [Pytorch hat eine gute Anleitung zu diesem Teil geschrieben](https://pytorch.org/get-started/locally/).

Nach der Installation werden wir die notwendigen Importe wie folgt durchführen:

    from facenet_pytorch import MTCNN
    von PIL importieren Image
    Importfackel
    von imutils.video importieren FileVideoStream
    cv2 importieren
    Einfuhrzeit
    Globus importieren
    von tqdm.notebook import tqdm

    Gerät = 'cuda' if torch.cuda.is_available() else 'cpu'

    filenames = [\glediston-bastos-ZtmmR9D_2tA-unsplash.webp\,\glediston-bastos-ZtmmR9D_2tA-unsplash.webp\]

Sehen Sie, wie wir das Gerät im obigen Code definiert haben? Sie können alles auch auf einer CPU ausführen, wenn Sie nicht wollen oder können CUDA einrichten.

Weiter, werden wir den Extraktor definieren:

    # unseren Extraktor definieren
    fast_mtcnn = FastMTCNN(
    stride=4,
    Größe ändern=0.5,
    margin=14,
    Faktor=0.6,
    keep_all=True,
    device=Gerät
    )

In diesem Ausschnitt, geben wir einige Parameter mit, wo wir zum Beispiel nur die Hälfte der Bildgröße verwenden, was einer der wichtigsten Faktoren für die Beschleunigung ist.

Und schließlich, Lassen Sie uns das Skript zur Gesichtsextraktion ausführen:

    def run_detection(fast_mtcnn, Dateinamen):
    frames = []
    frames_processed = 0
    faces_detected = 0
    los_größe = 60
    Start = Zeit.Zeit()

    for filename in tqdm(filenames):

    v_cap = FileVideoStream(Dateiname).start()
    v_len = int(v_cap.Strom.get(cv2.CAP_PROP_FRAME_COUNT))

    For j in range(v_len):

    Rahmen = v_cap.lesen()
    frame = cv2.cvtColor(Rahmen, cv2.COLOR_BGR2RGB)
    Rahmen.anhängen(frame)

    wenn len(frames) >= batch_size oder j == v_len - 1:

    faces = fast_mtcnn(frames)

    frames_processed += len(frames)
    faces_detected += len(faces)
    frames = []

    drucken(
    f'Frames pro Sekunde: {frames_processed / (time.Zeit() - Start):.3f},',
    f'faces detected: {GESICHTER_ERKANNT',
    end=''
    )

    v_cap.stop()

    run_detection(fast_mtcnn, Dateinamen)

![](/images/teslap100frames.webp)

Das obige Bild zeigt die Ausgabe des Codes, der auf einem NVIDIA Tesla P100 läuft, also je nach Quellenmaterial, GPU und Prozessor können die Leistung verbessern oder verschlechtern.


</br>
[Arbeiten Sie an einem ähnlichen Projekt? Sind Sie an etwas Ähnlichem interessiert? [Kontaktieren Sie uns](/Kontakt) jetzt für eine kostenlose 15-minütige Beratung.](/Kontakt/)
