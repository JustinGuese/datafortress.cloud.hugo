---
author: Justin Guese
bg_image: images/blog/Archlinux_GNOME_3.2.png
categories:
- Linux
- Tutoriel
date: '2020-07-06T07:10:46+02:00'
description: Installer Arch Linux facilement avec des disques chiffrés
image: images/blog/Archlinux_GNOME_3.2.png
tags:
- Tutoriel
- Arch Linux
- Apprentissage profond
- Apprentissage par renforcement
- Linux
- chiffrement
- Chiffrer les données au repos
title: Comment installer Arch Linux facilement avec des disques cryptés
type: post

---
## Les avantages d'Arch Linux

Dans mon autre article, [« Comment passer d'Ubuntu à Arch Linux pour un poste de travail d'apprentissage automatique profond »](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/), j'expliquais pourquoi j'ai migré de Ubuntu à Arch Linux pour mon poste de travail d'apprentissage automatique. En résumé, c'est principalement dû à la vitesse, Arch étant beaucoup plus proche du matériel et donc beaucoup plus rapide, à moins de logiciels inutiles et donc à une consommation de RAM moindre, ce qui est essentiel pour l'apprentissage automatique, et aux incroyables paquets pacman et AUR, rapides et faciles à installer.

Sous Ubuntu, par exemple, il est assez difficile de faire fonctionner TensorFlow et CUDA pour l'apprentissage automatique profond, car la structure des paquets Debian est différente et l'installation plus lente par rapport à Arch. Dans Arch, les dépendances sont gérées proprement, et les paquets ne sont pas aussi abstraits, car Arch est essentiellement le noyau Linux « pur ».

De plus, les paquets sortent beaucoup plus rapidement, et la ArchWiki est réputée pour être la documentation la plus complète qui existe pour un système d'exploitation.

La devise d'Arch peut être décrite comme « Personnaliser tout et être aussi rapide que possible », tandis que celle d'Ubuntu serait « Rendre l'installation et l'utilisation aussi faciles que possible pour les nouveaux utilisateurs ». Maintenant, je ne dis pas qu'Ubuntu est mauvais, car sa communauté est immense et c'est la distribution idéale pour commencer votre aventure dans le monde de Linux, mais une fois que vous êtes plus familier avec Linux et que vous avez besoin de plus de vitesse, Arch pourrait être la meilleure étape suivante.

Je suis au moins satisfait d'Arch, car il est beaucoup plus rapide que tout ce que j'ai vu auparavant et je peux tout personnaliser.

J'ai envisagé de fournir un ISO ou un IMG pour ma configuration d'apprentissage automatique pour une installation facile. Si vous êtes intéressé, veuillez commenter ou me contacter.

De plus, si vous supportez une légère couche d'abstraction, [Manjaro Arch](//manjaro.org/) pourrait être un bon choix pour vous. C'est fondamentalement Arch, mais rendu plus simple et convivial. Je l'ai adoré, mais je suis passé à Arch car Manjaro utilise ses propres paquets, qui sont encore bons, mais pas identiques aux paquets « purs » d'Arch. Si vous n'êtes pas un utilisateur expert, ce pourrait être le choix pour vous.


## Comment installer Arch Linux facilement

Bien que le [guide d'introduction](//wiki.archlinux.org/index.php/installation_guide) fourni par Arch soit déjà très bon, il peut être déroutant pour les nouveaux utilisateurs. C'est pourquoi j'ai décidé d'écrire mon propre tutoriel.

Mon objectif était d'installer Arch avec des disques cryptés, car je dois sécuriser les données au repos pour mes clients.

### 1. Téléchargement de l'image Arch Linux

Rendez-vous sur https://www.archlinux.org/download/ et téléchargez l'image.

Gravez-la sur une clé USB. Par exemple (mais vous pouvez utiliser votre propre programme) pour :

Linux :
> dd if=ISOFILE of=/dev/sdX status=progress

Où sdX est votre clé USB. Vérifiez-la avec « lsblk »

Windows/Mac :
J'ai utilisé Etcher https://www.balena.io/etcher/

Démarrez à partir de la clé USB en utilisant votre menu de démarrage (F11, F12 dans la plupart des cas).

### 2. Configuration initiale dans l'ISO Live

Une fois que vous êtes dans l'ISO Live d'Arch, vous devriez voir la ligne de commande de base d'Arch.

**Clavier non américain ?** Chargez vos touches avec :
> loadkeys KEYMAP

Où Keymap est votre disposition locale. Obtenez votre disposition locale avec

> localectl list-keymaps | grep -i SEARCHTERM

Par exemple, en utilisant la commande ci-dessus avec SEARCHTERM = Allemagne, cela renvoie de-latin1, pour lequel la commande loadkeys est :
> loadkeys de-latin1


(Facultatif) Si vous n'avez pas d'Ethernet, vous devrez peut-être vous connecter à votre Wi-Fi avec les commandes suivantes. Remplacez RESEAU_WIFI et MOT_DE_PASSE_WIFI par votre nom de réseau Wi-Fi et votre mot de passe.

> wpa_passphrase 'RESEAU_WIFI’ 'MOT_DE_PASSE_WIFI' >> /etc/wpa_supplicant/wpa_supplicant.conf \
> wpa_supplicant -Bc /etc/wpa_supplicant/wpa_supplicant.conf -i 'wlan0' \
Si la deuxième commande ne fonctionne pas, le nom de votre périphérique Wi-Fi pourrait être différent. Vous pouvez le vérifier avec « ifconfig »
> dhclient

Vérifiez votre connexion en accédant à un site Web avec curl. Si la réponse ressemble à du HTML, vous êtes connecté. Si elle indique quelque chose comme « 404 », « expiration du délai » ou « aucune connexion », répétez les étapes ci-dessus et vérifiez les fautes de frappe.
> curl www.datafortress.cloud

### 2. Partitionnement des disques

Ceci est l'étape la plus difficile, donc une fois que vous avez terminé, vous êtes presque arrivé au bout ! J'ai choisi la version plus avancée où le disque est complètement crypté pour une sécurité renforcée, mais n'hésitez pas à utiliser la "[méthode standard](//wiki.archlinux.org/index.php/Partitioning)" à la place.

Ce guide suppose que vous prévoyez de supprimer toutes les données de votre disque. Assurez-vous donc que toutes les données sont sauvegardées. Bien sûr, un démarrage dual avec Windows ou autre est possible, mais je l'expliquerai dans un autre guide.

Le plan est d'avoir deux partitions :
Première partition : lecteur de démarrage EFI – qui indique à votre PC comment démarrer Arch
Deuxième partition : lecteur complètement crypté avec des sous-lecteurs contenant le fichier de swap, le répertoire racine et un lecteur /home distinct pour la sécurité.
Pourquoi trois partitions sur le deuxième lecteur ? Disons que vous faites une erreur lors de l'installation de votre racine. Dans ce cas, votre dossier personnel avec vos documents, paramètres, etc. se trouvera sur une partition distincte et pourra facilement être réutilisé lors d'une nouvelle installation. Cela signifie que vous pourriez installer une nouvelle installation Arch dans la partition racine et simplement "réutiliser" votre dossier personnel. Pratique.

#### Étape 1 : Obtenir le nom de votre lecteur

> lsblk -lh

Cela vous affiche tous les lecteurs connectés. Généralement, votre lecteur principal devrait s'appeler /dev/sda et votre clé USB /dev/sdb.

**Vérifiez que sda est bien votre lecteur principal en fonction de la capacité de stockage en Go et de tout le reste. Si vous copiez et collez simplement les commandes suivantes avec sda, vous risquez de supprimer le mauvais lecteur !**
C'est pourquoi je nommerai le périphérique sdX dans les paragraphes suivants, mais remplacez le X par votre numéro de périphérique (a, b, c, …). Certains lecteurs ont des noms différents, comparez et remplacez en conséquence.

#### Étape 2 : Partitionnement

Démarrez gdisk

> gdisk /dev/sdX

Configuration du lecteur EFI
1. Tapez « o » pour créer une table de partition
2. Tapez « n » pour une nouvelle partition
3. Entrée
4. Entrée
5. +256M
6. EF00
Cela créera une partition de 256 Mo au format EFI dont nous avons besoin pour le démarrage.

Configuration du lecteur Arch crypté
1. Tapez « n » pour créer une nouvelle partition
2. Entrée
3. Entrée
4. Entrée
5. 8309

Vérifiez si tout semble correct avec la touche « p ». Cela devrait ressembler à ceci :

> Numéro Début (secteur) Fin (secteur) Taille Code Nom
> 1 2048 1050623 256,0 Mo EF00 Lecteur système EFI
> 2 1050624 242187466 115,0 Go 8309 Linux LUKS

Ça a l'air bon ? Appuyez sur « w » pour enregistrer les modifications sur le disque.

### 3. Création des systèmes de fichiers cryptés

Les partitions sont actuellement vides. Ensuite, nous allons créer les systèmes de fichiers et les sous-partitions cryptées. N'oubliez pas de remplacer le X par le numéro de votre lecteur (généralement a).

> cryptsetup luksFormat /dev/sdX2
> cryptsetup open /dev/sdX2 cryptlvm
> pvcreate /dev/mapper/cryptlvm
> vgcreate datafortress /dev/mapper/cryptlvm

N'hésitez pas à remplacer les tailles de disque suivantes devant le « G » pour gigaoctet par la taille souhaitée. Pour l'apprentissage automatique profond, le swap devrait être de 32 Go, pour d'autres cas environ la taille de votre RAM. Je recommande une taille racine de 40 Go, mais le minimum devrait être de 10 Go.
Vous pouvez remplacer datafortress par n'importe quoi, ou le laisser tel quel pour être le cool.

> lvcreate -L 16G datafortress -n swap
> lvcreate -L 40G datafortress -n root
> lvcreate -l +100%FREE datafortress -n home

Créer des systèmes de fichiers

> mkfs.vat -F32 /dev/sdX1
> mkfs.ext4 /dev/mapper/datafortress-root
> mkfs.ext4 /dev/mapper/datafortress-home
> mkswap /dev/mapper/datafortress-swap

Les monter

> mount /dev/mapper/datafortress-root /mnt
> mkdir /mnt/home
> mkdir /mnt/boot
> mount /dev/mapper/datafortress-home /mnt/home
> mount /dev/sdX1 /mnt/boot
> swapon /dev/mapper/datafortress-swap

### 4. Installation de base Linux

Avant l'installation, il est recommandé de mettre à jour votre liste de miroirs afin que les paquets soient téléchargés à partir des miroirs les plus proches. [Consultez mon autre article et recherchez « reflector » pour obtenir des instructions sur la façon de le faire](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/).

> pacstrap /mnt base base-devel linux linux-firmware nano


(...)  (Le reste du texte est trop long pour être traduit ici. Il continuera.)
