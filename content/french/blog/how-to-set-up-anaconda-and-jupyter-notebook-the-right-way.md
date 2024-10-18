---
author: Justin Guese
bg_image: /images/jupyter.png
categories:
- Tutoriel
date: '2022-01-24T23:00:00+00:00'
description: 'Si Anaconda (conda) et Jupyter Notebook (Jupyter Lab) sont correctement
  configurés, leur association peut devenir l''équipe idéale, vous permettant de basculer
  facilement entre les environnements conda pour le Deep Learning. Certains programmes
  nécessitant TensorFlow 1.15, d''autres TensorFlow 2.0 ? Aucun problème ! Il suffit
  de changer d''environnement et de versions de TensorFlow en un clic.

  '
image: /images/jupyter.png
tags:
- Apprentissage profond
- Tutoriel
- Anaconda
- Cahier Jupyter
title: Comment configurer correctement Anaconda et Jupyter Notebook
type: post

---
Si Anaconda (conda) et Jupyter Notebook (Jupyter Lab) sont correctement configurés, leur combinaison peut devenir une équipe idéale, vous permettant de basculer facilement entre les environnements conda pour l'apprentissage automatique profond.

Certains programmes nécessitent Tensorflow 1.15, d'autres Tensorflow 2.0 ? Aucun problème ! Basculez simplement entre les environnements et les versions de Tensorflow en un seul clic.

Avez-vous déjà installé des extensions Jupyter Notebook dans chaque environnement conda ? Ne vous inquiétez plus, nous allons installer les extensions une fois et les rendre disponibles dans chaque environnement !


1. Installer Anaconda ou Miniconda
2. Installer Jupyter Notebook / Lab dans l'environnement de base
3. Installer un nouvel environnement
4. Activer l'environnement pour Jupyter Notebook

# Comment installer Anaconda ou Miniconda ?

Anaconda est un excellent package contenant de nombreux packages Python déjà installés, ce qui permet un démarrage facile dans le monde de Python.  De plus, il permet de créer des environnements Python contenant différentes versions de vos packages Python. Par exemple, si un programme ne fonctionne qu'avec Python 2.7 ou des versions antérieures de Matplotlib, vous pouvez créer un espace de travail dédié à ce programme et revenir à Python 3 d'un clic.  De même, basculer entre Tensorflow 2.0 et Tensorflow 1.15 devient facile, vous permettant ainsi de changer de versions facilement (ce qui peut être source de maux de tête autrement).

Miniconda est une version allégée d'Anaconda, utile si vous travaillez sur un serveur avec un espace disque limité, par exemple.

Pour installer Anaconda ou Miniconda, rendez-vous sur leur site web ([https://www.anaconda.com/products/individual#Downloads](https://www.anaconda.com/products/individual#Downloads "https://www.anaconda.com/products/individual#Downloads")), ou, si vous utilisez Linux, copiez les commandes suivantes.

Le premier lien parcourt le site web pour trouver la version la plus récente et l'écrit dans la variable `LATEST_ANACONDA`.

```bash
cd ~/Téléchargements
LATEST_ANACONDA=$(wget -O - https://www.anaconda.com/distribution/ 2>/dev/null | sed -ne 's@.*\(https:\/\/repo\.anaconda\.com\/archive\/Anaconda3-.*-Linux-x86_64\.sh\)\">64-Bit (x86) Installer.*@\1@p')
wget $LATEST_ANACONDA
chmod +x Anaconda3*.sh # le rendre exécutable
./Anaconda3*.sh # exécuter l'installateur
```

Suivez les instructions à l'écran et acceptez les valeurs par défaut.

### Vérification et basculement des environnements conda

Si conda est installé correctement (cela peut nécessiter une déconnexion et une connexion, ou un redémarrage), vous devriez voir la sortie lorsque vous tapez `conda` dans votre terminal.

Pour lister les environnements installés, tapez `conda env list`.

Cela devrait actuellement afficher uniquement l'environnement "base" installé.

Le basculement entre les environnements est aussi simple que de taper `conda activate [NOM]` et, une fois terminé, le désactiver (et revenir à l'environnement de base) avec `conda deactivate`.

L'environnement de base est activé par défaut.

# Installer Jupyter Notebook / Lab dans l'environnement de base

Jupyter Notebook peut être facilement installé avec conda. Notre plan est de l'installer uniquement dans l'environnement de base, puis de basculer entre les sous-environnements pour éviter de configurer Jupyter Lab dans chaque environnement.

## Installation de Jupyter Notebook (par défaut)

```bash
conda install -c conda-forge notebook
conda install -c conda-forge nb_conda_kernels
```

## Installation de Jupyter Lab

```bash
conda install -c conda-forge jupyterlab
conda install -c conda-forge nb_conda_kernels
```

## Installation des extensions Jupyter Notebook

J'apprécie beaucoup les extensions Jupyter Notebook, qui prennent en charge de nombreuses fonctionnalités d'auto-complétion, d'informations supplémentaires et, en général, des éléments qui facilitent la vie.  Le paramètre par défaut est inclus avec la commande d'installation suivante :

```bash
conda install -c conda-forge jupyter_contrib_nbextensions
```

Une bonne vue d'ensemble des autres extensions : [https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231](https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231 "https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231")

### (Facultatif) Installation du gestionnaire de paquets pip

À mon avis, il est judicieux d'ajouter le gestionnaire de paquets pip à l'environnement de base (et à chaque sous-environnement), car tous les paquets ne sont pas compatibles avec `conda install`. De plus, si pip n'est pas installé dans chaque sous-environnement, le paquet pourrait être installé uniquement dans l'environnement conda "de base", ce qui provoquerait une erreur indiquant que le paquet n'est pas trouvé dans votre sous-environnement.

```bash
conda install pip
```

# Création d'environnements dans conda et Jupyter Notebook

Supposons que vous souhaitiez installer à la fois Tensorflow 2.0 et Tensorflow 1.15 dans Jupyter Notebook.

Pour cet exemple, commencez par décider si vous souhaitez utiliser la version GPU ou CPU de Tensorflow. Pour utiliser la version GPU, ajoutez "-gpu" à TensorFlow, sinon laissez-la telle quelle.

Pour créer un nouvel environnement conda, vous pouvez exécuter :

```bash
conda create --name tf-2.0
```

Si vous prévoyez déjà installer certains paquets avec, ajoutez-les à la fin, comme ceci :

```bash
conda create -n tf-2.0 tensorflow-gpu pip ipykernel
```

Je recommande d'installer `pip` pour l'installation des paquets, et `ipykernel` sera nécessaire pour basculer entre les environnements à l'aide de Jupyter Notebook

Pour installer un environnement avec TensorFlow 1.15, utilisez :

```bash
conda create -n tf-1.15 tensorflow-gpu==1.15 pip ipykernel
```

Si l'opération réussit, vous devriez voir trois environnements lorsque vous exécutez la commande suivante :

```bash
conda env list
```

1. base
2. tf-2.0
3. tf-1.15

# Démarrer Jupyter Notebook et vérifier les environnements et les extensions

```bash
jupyter notebook
```

Le lancement de Jupyter Notebook dans l'environnement de base devrait vous permettre de voir un onglet contenant "Extensions", ainsi que "conda"/"environnements".  Allez dans Extensions, activez les extensions souhaitées, puis créez un nouveau notebook à l'aide du bouton "nouveau". Vous devriez pouvoir choisir entre votre environnement de base, tf-2.0 et tf-1.15.

Attention : Vous devez toujours exécuter jupyter notebook dans l'environnement de base. Exécutez `conda deactivate` pour quitter votre environnement courant et revenir à l'environnement de base.

Si vous avez besoin d'installer d'autres paquets, activez un environnement avec `conda activate [NOM]`, exécutez vos commandes comme `conda install X` ou `pip install X`, et quittez l'environnement avec `conda deactivate`.

Faites-moi savoir si cela a fonctionné pour vous, cela m'a beaucoup aidé et j'aurais souhaité le savoir plus tôt !
