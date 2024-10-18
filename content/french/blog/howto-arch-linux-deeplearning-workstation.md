---
author: Justin Guese
categories:
- Big data
- Tutoriel
date: '2020-08-18T10:07:21+06:00'
description: Abandonner Ubuntu pour Arch Linux pour une station de travail Deep Learning
image: images/blog/deeplearningarch.png
tags:
- Grandes données
- Tutoriel
- Arch Linux
- Apprentissage profond
- Apprentissage par renforcement
- TensorFlow
- apprentissage automatique
title: Comment passer d'Ubuntu à Arch Linux pour un poste de travail d'apprentissage
  profond

---
## Pourquoi abandonner Ubuntu ?

La plupart d'entre vous utilisent probablement Ubuntu pour leurs postes de travail, et c'est parfaitement acceptable pour les utilisateurs moins expérimentés. Cependant, j'ai rencontré des difficultés avec Ubuntu, TensorFlow et CUDA, notamment la gestion des différents pilotes et versions de CUDA, cuDNN, TensorFlow et ainsi de suite. Je ne sais pas vous, mais une fois que j'avais un environnement TensorFlow 1.15 ou 2.0 fonctionnel, je ne l'ai plus touché, par crainte de tout gâcher.

Lorsqu'on travaille avec différents programmes, il serait agréable de pouvoir basculer entre les deux versions de TensorFlow les plus utilisées, 1.15 et 2.0, comme on peut le faire avec Google Colab, en une seule commande. Mais l'installation d'une version de TensorFlow différente perturbe généralement à nouveau mon système.

De plus, Arch figurait depuis longtemps sur ma liste de choses à faire, car il s'agit de la distribution Linux la plus « minimaliste » que l'on puisse trouver, ce qui signifie que l'on travaille beaucoup plus près du matériel par rapport aux « abstractions de haut niveau » comme Ubuntu. Dans leurs propres mots, Ubuntu est conçu pour « fonctionner dès la sortie de la boîte et simplifier le processus d'installation pour les nouveaux utilisateurs », tandis que la devise d'Arch Linux est « personnaliser tout ».
En étant beaucoup plus proche du matériel, Arch est incroyablement plus rapide que Ubuntu (et plus rapide que Windows), au prix d'une utilisation plus intensive du terminal.

Au cours des dernières semaines, j'ai constaté que la consommation de RAM était généralement divisée par deux avec Arch par rapport à Ubuntu, et l'installation des packages Machine Learning est un jeu d'enfant. J'arrive à faire fonctionner TensorFlow 1.15 et 2.0 ensemble, en basculant entre les versions à l'aide des environnements Anaconda. De plus, le système fonctionne de manière assez stable, car j'utilise les noyaux LTS (longue durée de support) de Linux, et les mises à jour des célèbres paquets AUR (paquets créés par les utilisateurs dans Arch) sortent généralement un mois avant les paquets Debian (Ubuntu).

Dans l'ensemble, je ne peux que recommander de configurer une station de travail Arch Linux pour le Deep Learning car elle est :
1. Plus rapide, comme l'installation des packages est très rapide, le Deep Learning est hyperperformant, etc.
2. Plus stable
3. Plus facile à utiliser pour basculer entre les versions de TensorFlow
comparé à Ubuntu.


Je vais diviser le tutoriel en deux parties : la première sur « Comment installer Arch Linux » et la seconde sur « Comment installer les packages de station de travail Deep Learning ».

Pour le tutoriel général « Comment installer Arch Linux », rendez-vous sur cet article : [//www.datafortress.cloud/blog/howto-install-arch-linux-the-easy-way/](//www.datafortress.cloud/blog/howto-install-arch-linux-the-easy-way/).

Si Arch vous semble trop complexe pour l'instant, vous pouvez essayer [Manjaro](//manjaro.org/), une version conviviale d'Arch, même si je ne peux pas garantir que tous les packages fonctionneront de la même manière, car ils sont légèrement différents. Cependant, ils devraient fonctionner de la même manière dans l'ensemble.

J'envisageais de créer une image prête à installer (iso ou img). Si suffisamment de personnes sont intéressées, laissez un commentaire ci-dessous ou envoyez-moi un message !

## Installation de la configuration Deep Learning (TensorFlow, CUDA, cuDNN, Anaconda) sur une nouvelle installation Arch Linux
Une fois que vous avez [terminé l'installation d'Arch Linux (ouf !) ](//www.datafortress.cloud/blog/howto-install-arch-linux-the-easy-way/), modifions d'abord certains paramètres afin que notre système soit plus stable.

### 1. Passer aux miroirs les plus rapides

Les logiciels sont téléchargés à partir de "miroirs", qui sont des serveurs contenant toutes les bibliothèques Arch. Si ce n'est pas fait automatiquement, il se peut que vos serveurs ne soient pas encore optimisés. Par conséquent, nous allons installer un petit outil qui trouve et enregistre les serveurs les plus rapides, appelé "reflector".

Installer reflector :

> sudo pacman -S reflector

Trouver et télécharger les meilleurs serveurs :

> reflector --verbose -l 20 -n 20 --sort rate --save /etc/pacman.d/mirrorlist

Vérifiez la sortie pour vous assurer qu'elle est cohérente, par exemple, si les domaines sont proches de votre emplacement. Sinon, vous pouvez ajouter la balise de pays pour obtenir des résultats plus précis, par exemple, pour l'Allemagne et l'Autriche :

> reflector -c “AT,DE” --verbose -l 20 -n 20 --sort rate --save /etc/pacman.d/mirrorlist

Mettre à jour votre installation :

> sudo pacman -Syyu

### 2. Changer l'environnement de bureau

Si vous utilisez Manjaro ou avez choisi l'environnement de bureau « Gnome », comme vous le connaissez d'Ubuntu, il peut être intéressant de le changer, car Gnome est réputé consommer plus de RAM que Chrome, et nous avons certainement besoin de RAM pour notre configuration Deep Learning.

Si vous aimez Gnome, vous pouvez ignorer cette étape. Sinon, je recommande le bureau Xfce car il est un bon compromis entre légèreté et fonctionnalités complètes.

Télécharger Xfce :

> sudo pacman -S xfce4 xfce4-goodies lxdm

Lxdm est un gestionnaire d'affichage qui vous permet d'utiliser plusieurs bureaux.

Déconnectez-vous de votre session actuelle et appuyez sur Alt + F2 (ou Alt + F3 si cela ne fonctionne pas) pour ouvrir un terminal. Désactivez d'abord Gnome, puis « activez » Xfce :

Désactiver et désinstaller Gnome :

> sudo systemctl disable gdm
> sudo pacman -R gnome gnome-extras

Activer Xfce :

> sudo systemctl enable lxdm
> sudo systemctl start lxdm

Si le nouveau bureau Xfce ne s'ouvre pas, connectez-vous et explorez. Sinon, essayez de redémarrer (sudo reboot). Si cela ne fonctionne pas, passez à la phase de pleurs et de roulements sur le sol, et envoyez-moi un message ou un commentaire ensuite.

### 3. Installation des noyaux Linux LTS (Long Term Support) pour une meilleure stabilité

Arch est réputé pour être très proche des noyaux Linux actuels, ce qui est bien si vous voulez toujours les paquets et fonctions Linux les plus récents, mais peu judicieux si vous construisez une station de travail Deep Learning.

C'est pourquoi j'ai opté pour les noyaux LTS, qui reçoivent plus de support et sont plus stables que les versions plus récentes du noyau Linux.

Heureusement, le changement de noyaux est très simple sous Arch. Nous allons tout d'abord télécharger les noyaux, puis indiquer à notre gestionnaire de démarrage lequel choisir.

Téléchargez d'abord les noyaux LTS :

> sudo pacman -S linux-lts linux-lts-headers

Examinez les versions de votre noyau actuel :

> ls -lsha /boot

Un noyau devrait être nommé vmlinuz-linux.img et initramfs-linux.img (vos versions actuelles), et les noyaux LTS le même nom avec -lts à la fin.

Si vous voyez deux noyaux, vous pouvez maintenant supprimer les anciens noyaux :

> sudo pacman -R linux

Une étape plus avancée consiste à indiquer à votre chargeur de démarrage quel noyau choisir. La question est de savoir quel chargeur de démarrage vous utilisez, mais dans la plupart des cas, il s'agit de Grub. Si vous avez suivi mon tutoriel d'installation d'Arch, votre chargeur de démarrage est systemd-boot.

Ma recommandation est d'essayer les instructions Grub, et si cela ne fonctionne pas, passez aux autres.

#### Modification du chargeur de démarrage Grub pour les noyaux Linux LTS

> grub-mkconfig -o /boot/grub/grub.cfg

Si vous rencontrez une erreur, passez au chargeur de démarrage suivant, sinon redémarrez (sudo reboot).

#### Modification du chargeur de démarrage syslinux pour les noyaux Linux LTS

Modifier le fichier de configuration :

> sudo nano /boot/syslinux/syslinux.cfg

Ajoutez simplement « -lts » à vmlinuz-linux.img et initramfs-linux.img, de sorte qu'ils deviennent vmlinuz-linux-lts.img et initramfs-linux-lts.img.

#### Modification du chargeur de démarrage systemd-boot pour les noyaux Linux LTS

Si vous venez de mon guide d'installation d'Arch, c'est votre chargeur de démarrage.

Modifier le fichier de configuration :

> sudo nano /boot/loader/entries/arch.conf

Ajoutez simplement « -lts » à vmlinuz-linux.img et initramfs-linux.img, de sorte qu'ils deviennent vmlinuz-linux-lts.img et initramfs-linux-lts.img.

### 4. Installation de yay, un moyen simple d'installer les paquets AUR

Vous devriez privilégier l'utilisation ultra-rapide de pacman pour installer la plupart des paquets, mais une chose étonnante d'Arch est que les utilisateurs créent des millions de paquets personnalisés extrêmement faciles à installer. Vous pouvez pratiquement trouver n'importe quel programme imaginable dans ce dépôt.

Installer git SVC :

> sudo pacman -S git
> mkdir ~/tmp
> git clone https://aur.archlinux.org/yay-git.git ~/tmp/yay
> cd ~/tmp/yay
> makepkg -si

Vous pouvez désormais parcourir tous les excellents paquets AUR sur https://aur.archlinux.org/packages/ ou vous lancer directement et taper :

> yay -S [PACKAGE]

pour l'installer.


### 5. Enfin, l'installation réelle de CUDA, cuDNN, Anaconda pour exécuter TensorFlow 1.15 et 2.0

Installer les pilotes Nvidia, CUDA et cuDNN avec une commande simple :

> sudo pacman -S nvidia nvidia-utils cuda cudnn

Cela prend un certain temps, alors prenez une tasse de café ou passez aux étapes suivantes.

Télécharger Anaconda, j'aime Miniconda :

> wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh ~/

Rendre le fichier exécutable et l'installer :

> cd ~/
> chmod +x ./Miniconda*.sh
> ./Miniconda*.sh

Ne modifiez rien par défaut.

> source ./bash_profile

Redémarrer votre système :

> sudo reboot

Installer TensorFlow

Il est maintenant temps de choisir entre TensorFlow pour le processeur ou la carte graphique. Je vais continuer avec l'option carte graphique, mais si vous souhaitez la version processeur, supprimez simplement « -gpu » du nom du paquet.

##### Créer un environnement Anaconda pour TensorFlow 2.0

> conda create --name tf2.0
> conda activate tf2.0
> conda install pip
> conda install tensorflow-gpu pandas numpy

Terminé ! Vérifiez le résultat avec :

> python
> from tensorflow.python.client import device_lib
> device_lib.list_local_devices()

Si le résultat affiche un nom de périphérique comme celui-ci, vous avez terminé !

2018-05-01 05:25:25.929575: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1356] Found device 0 with properties:
name: GeForce GTX 3080 10GB major: …

##### Créer un environnement Anaconda pour TensorFlow 1.15

> conda deactivate
> conda create --name tf1.15
> conda activate tf1.15
> conda install pip python==3.7
> conda install tensorflow-gpu==1.15

Et vérifiez à nouveau si tout fonctionne et si votre carte graphique est détectée :

> python
> from tensorflow.python.client import device_lib
> device_lib.list_local_devices()


### 6. Basculer entre TensorFlow 1.15 et TensorFlow 2.0 sur un seul appareil !

Un rêve devenu réalité à mon avis, il suffit de sélectionner la version 1.15 avec
> conda activate tf1.15

Et la version TensorFlow 2.0 avec
> conda activate tf2.0
