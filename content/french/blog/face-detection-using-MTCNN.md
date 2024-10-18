---
author: Justin Guese
bg_image: images/index2-1-1280x720.webp
categories:
- Vision par ordinateur
- Grandes données
- Apprentissage automatique
date: '2022-06-08T07:10:46+02:00'
description: Détection de Visages avec MTCNN – un guide pour l'extraction de visages
  axé sur la rapidité
image: images/index2-1-1280x720.webp
tags:
- Détection faciale
- Réseaux neuronaux
- Détection de visages MTCNN
- Big Data
- Apprentissage automatique
title: Détection de Visages avec MTCNN
type: post

---
<br>

MTCNN est une bibliothèque Python (pip) développée par [l'utilisateur Github ipacz](https://github.com/ipazc/mtcnn), qui implémente l'article [Zhang, Kaipeng et al. “Détection et alignement conjoints des visages à l’aide de réseaux convolutifs en cascade à tâches multiples.” IEEE Signal Processing Letters 23.10 (2016) : 1499–1503. Crossref. Web](https://arxiv.org/abs/1604.02878).

Dans cet article, ils proposent un cadre de tâches multiples en cascade profond utilisant différentes caractéristiques de « sous-modèles » pour améliorer leurs forces de corrélation.

MTCNN est assez rapide sur un processeur central, même si S3FD est encore plus rapide sur un processeur graphique ; mais c'est un sujet pour un autre article.

Ce document utilise du code provenant des deux sources suivantes, n'hésitez pas à les consulter, elles sont également intéressantes :

* [https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/](https://machinelearningmastery.com/how-to-perform-face-detection-with-classical-and-deep-learning-methods-in-python-with-keras/)
* [https://www.kaggle.com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution](https://www.kaggle.com/timesler/fast-mtcnn-detector-55-fps-at-full-resolution)

<br>

# Utilisation de base de MTCNN

<br>

Vous pouvez accéder au notebook complet via :

[https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up](https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up)

```
git clone https://github.com/JustinGuese/mtcnn-face-extraction-eyes-mouth-nose-and-speeding-it-up
```

Heureusement, MTCNN est disponible en tant que package pip, ce qui signifie que nous pouvons facilement l'installer en utilisant

```
pip install mtcnn
```

Maintenant, en passant à Python/Jupyter Notebook, nous pouvons vérifier l'installation avec une importation et une vérification rapide :

```python
import mtcnn
# afficher la version
print(mtcnn.__version__)
```

Ensuite, nous sommes prêts à charger notre image de test à l'aide de la fonction [imread](https://bit.ly/2vo3INw) de matplotlib.

```python
import matplotlib.pyplot as plt
# charger l'image à partir du fichier
filename = "glediston-bastos-ZtmmR9D_2tA-unsplash.webp"
pixels = plt.imread(filename)
print("Forme de l'image/tableau :", pixels.shape)
imgplot = plt.imshow(pixels)
plt.show()
```

Votre sortie ressemblera beaucoup à ceci :

```
{'box': [1942, 716, 334, 415], 'confidence': 0.9999997615814209, 'keypoints': {'œil_gauche': (2053, 901), 'œil_droit': (2205, 897), 'nez': (2139, 976), 'bouche_gauche': (2058, 1029), 'bouche_droite': (2206, 1023)}}
{'box': [2084, 396, 37, 46], 'confidence': 0.9999206066131592, 'keypoints': {'œil_gauche': (2094, 414), 'œil_droit': (2112, 414), 'nez': (2102, 426), 'bouche_gauche': (2095, 432), 'bouche_droite': (2112, 431)}}
{'box': [1980, 381, 44, 59], 'confidence': 0.9998701810836792, 'keypoints': {'œil_gauche': (1997, 404), 'œil_droit': (2019, 407), 'nez': (2010, 417), 'bouche_gauche': (1995, 425), 'bouche_droite': (2015, 427)}}
{'box': [2039, 395, 39, 46], 'confidence': 0.9993435740470886, 'keypoints': {'œil_gauche': (2054, 409), 'œil_droit': (2071, 415), 'nez': (2058, 422), 'bouche_gauche': (2048, 425), 'bouche_droite': (2065, 431)}}
```

Cela indique les coordonnées, ou les valeurs de pixels d'un rectangle où l'algorithme MTCNN a détecté des visages. La valeur « box » ci-dessus renvoie l'emplacement du visage entier, suivie d'un niveau de « confiance ».

Si vous souhaitez effectuer des extractions ou des algorithmes plus avancés, vous aurez accès à d'autres points de repère faciaux, appelés également « points ». Plus précisément, le modèle MTCNN a également localisé les yeux, la bouche et le nez !

<br>

## Dessin d'une boîte autour des visages

<br>

Pour démontrer cela encore mieux, dessinons une boîte autour du visage à l'aide de matplotlib :

```python
# dessiner une image contenant des objets détectés
def draw_facebox(filename, result_list):
  # charger l'image
  data = plt.imread(filename)
  # afficher l'image
  plt.imshow(data)
  # obtenir le contexte pour dessiner les boîtes
  ax = plt.gca()
  # afficher chaque boîte
for result in result_list:
  # obtenir les coordonnées
  x, y, largeur, hauteur = result['box']
  # créer la forme
  rect = plt.Rectangle((x, y), largeur, hauteur, fill=False, color='green')
  # dessiner la boîte
  ax.add_patch(rect)
  # afficher l'image
  plt.show()

# filename = 'test1.webp' # filename est défini ci-dessus, sinon décommenter
# charger l'image à partir du fichier
# pixels = plt.imread(filename) # défini ci-dessus, sinon décommenter
# detector est défini ci-dessus, sinon décommenter
#detector = mtcnn.MTCNN()
# détecter les visages dans l'image
#faces = detector.detect_faces(pixels)
# afficher les visages sur l'image originale
#draw_facebox(filename, faces)
```

... (reste du code inchangé)

<br>

## Affichage des yeux, de la bouche et du nez autour des visages

<br>

Maintenant, examinons les « points » mentionnés plus haut que le modèle MTCNN a renvoyés.

Nous allons maintenant utiliser ceux-ci pour tracer le nez, la bouche et les yeux également. Nous ajouterons le code suivant à notre code ci-dessus :

```python
# dessiner les points
for key, value in result['keypoints'].items():
# créer et dessiner le point
dot = plt.Circle(value, radius=20, color='orange')
ax.add_patch(dot)
```

Avec le code complet ci-dessus, il ressemblera à ceci :

```python
# dessiner une image contenant des objets détectés
def draw_facebox(filename, result_list):
# charger l'image
data = plt.imread(filename)
# afficher l'image
plt.imshow(data)
# obtenir le contexte pour dessiner les boîtes
ax = plt.gca()
# afficher chaque boîte
for result in result_list:
# obtenir les coordonnées
x, y, largeur, hauteur = result['box']
# créer la forme
rect = plt.Rectangle((x, y), largeur, hauteur, fill=False, color='orange')
# dessiner la boîte
ax.add_patch(rect)
# dessiner les points
for key, value in result['keypoints'].items():
# créer et dessiner le point
dot = plt.Circle(value, radius=20, color='red')
ax.add_patch(dot)
# afficher l'image
plt.show()

# filename = 'test1.webp' # filename est défini ci-dessus, sinon décommenter
# charger l'image à partir du fichier
# pixels = plt.imread(filename) # défini ci-dessus, sinon décommenter
# detector est défini ci-dessus, sinon décommenter
#detector = mtcnn.MTCNN()
# détecter les visages dans l'image
#faces = detector.detect_faces(pixels)
# afficher les visages sur l'image originale
#draw_facebox(filename, faces)
```

... (reste du code inchangé)

<br>

## MTCNN avancé : accélérer (environ x100) !

<br>

Maintenant, voici le point intéressant. Si vous allez traiter des millions d'images, vous devrez accélérer MTCNN, sinon vous vous endormirez ou votre processeur central brûlera avant qu'il ne soit terminé.

Mais de quoi parle-t-on exactement ? Si vous exécutez le code ci-dessus, il faudra environ une seconde, ce qui signifie que nous traiterons environ une image par seconde. Si vous exécutez MTCNN sur une carte graphique et que vous utilisez la version accélérée, vous atteindrez environ 60 à 100 images/images par seconde. C'est une augmentation jusqu'à **100 fois** !

Par exemple, si vous devez extraire tous les visages d'un film, où vous en extrayez 10 par seconde (une seconde de film a en moyenne environ 24 images, donc chaque image), il y aura 10 * 60 (secondes) * 120 (minutes) = 72 000 images.

Ce qui signifie qu'il faudra 72 000 (images) * 1 (seconde) = 72 000 secondes / 60 secondes = 1 200 minutes = **20 heures** si le traitement d'une image prend une seconde.

Avec la version accélérée de MTCNN, cette tâche prendra 72 000 (images) / 100 (images/seconde) = 720 secondes = **12 minutes** !

Pour utiliser MTCNN sur une carte graphique, vous devrez configurer CUDA, cuDNN, PyTorch, etc. [PyTorch a rédigé un excellent tutoriel sur cette partie](https://pytorch.org/get-started/locally/).

Une fois installé, nous effectuerons les importations nécessaires comme suit :

```python
from facenet_pytorch import MTCNN
from PIL import Image
import torch
from imutils.video import FileVideoStream
import cv2
import time
import glob
from tqdm.notebook import tqdm

device = 'cuda' if torch.cuda.is_available() else 'cpu'

filenames = ["glediston-bastos-ZtmmR9D_2tA-unsplash.webp", "glediston-bastos-ZtmmR9D_2tA-unsplash.webp"]
```

(reste du code inchangé)

