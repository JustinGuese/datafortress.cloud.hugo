---
title: How To - Weg mit Ubuntu zugunsten von Arch Linux für eine Deep Learning-optimierte Arbeitsumgebung
bg_image: "/images/blog/deeplearningarch.png"
date: 2020-09-29T07:10:46+02:00
author: Justin Guese
description: Arch Linux für eine Deep Learning-optimierte Arbeitsumgebung
image: "/images/blog/deeplearningarch.png"
categories:
- big data
- tutorial
tags:
- big data
- tutorial
- arch linux
- deep learning
- reinforcement learning
- tensorflow
- machine learning
type: post

---

# How To - Weg mit Ubuntu zugunsten von Arch Linux für eine Machine Learning-optimierte Arbeitsumgebung

## Warum sollte ich Ubuntu ersetzen? 

Die meisten von Ihnen verwenden vielleicht Ubuntu für ihre Workstations, und das ist für die unerfahreneren Benutzer in Ordnung. Eines der Probleme, die ich jedoch mit Ubuntu und Tensorflow/CUDA hatte, war, dass der Umgang mit den verschiedenen Treibern und Versionen von CUDA, cudnn, TensorFlow und so weiter ein ziemlicher Kampf war. Bei Ihnen bin ich mir nicht sicher, aber sobald ich eine funktionierende Tensorflow 1.15 oder 2.0-Umgebung hatte, habe ich sie normalerweise nicht mehr angefasst, weil ich Angst hatte, diese heilige Konfiguration durcheinander zu bringen.

Wenn man mit verschiedenen Programmen arbeitet, wäre es schön, eine Möglichkeit zu haben, zwischen den beiden meistgenutzten TensorFlow Versionen 1.15 und 2.0 zu wechseln, wie man es mit Google Colab mit einem einzigen Befehl tun kann, aber die Installation einer anderen TensorFlow Version hat mein System normalerweise wieder durcheinander gebracht. 

Außerdem stand Arch schon immer auf meiner To-Do-Liste, da es die beste "Barebone"-Linux-Distribution ist, die man bekommen kann, was bedeutet, dass man im Vergleich zu "höheren Abstraktionen" wie Ubuntu viel näher an der Hardware arbeitet. Nach ihren eigenen Worten ist Ubuntu dafür gebaut, "out of the box zu arbeiten und den Installationsprozess für neue Benutzer so einfach wie möglich zu machen", während das Motto von Arch Linux "alles anpassen" lautet. 
Da Arch viel näher an der Hardware ist, ist es im Vergleich zu Ubuntu wahnsinnig schneller (und Windows meilenweit voraus), und das bei den Kosten für mehr Terminal-Nutzung. 

Wenn ich Arch in den letzten Wochen benutzt habe, hat sich die RAM-Nutzung normalerweise im Vergleich zu Ubuntu halbiert, und die Installation von Machine-Learning-Paketen ist ein Kinderspiel. Ich kann sowohl TensorFlow 1.15 als auch 2.0 zusammenarbeiten lassen, indem ich die Versionen mit Anaconda-Umgebungen austausche. Außerdem arbeitet das System recht stabil, da ich die LTS-Kernel (Long Term Support) von Linux verwende und Aktualisierungen der berühmten AUR-Pakete (User Made Packages in Arch) normalerweise einen Monat vor den Debian-Paketen (Ubuntu) herauskommen.

Alles in allem kann ich nur empfehlen, eine Arch-Linux-Deep-Learning-Station so einzurichten, wie sie ist:
1. Schneller, so wie sich Pakete superschnell installieren lassen, ist tiefes Lernen aufgeladen, ...
2. Stabiler
3. Einfacherer Wechsel zwischen TensorFlow Versionen
im Vergleich zu Ubuntu. 


Ich werde die Anleitung in zwei Teile aufteilen, wobei der erste Teil "[Wie installiere ich Arch Linux](//www.datafortress.cloud/blog/howto-install-arch-linux-the-easy-way/)" und der zweite Teil "[Wie installiere ich die Deep-Learning-Workstation-Pakete](//https://www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/)" lautet. 

Für das allgemeine ["Wie man Arch Linux installiert", gehen Sie zu diesem Artikel](//www.datafortress.cloud/blog/howto-install-arch-linux-the-easy-way/). 

Wenn Arch für den Moment zu komplex ist, könnten Sie [Manjaro](//https://manjaro.org/) ausprobieren, eine benutzerfreundliche Version von Arch, auch wenn ich nicht garantieren kann, dass alle Pakete gleich funktionieren, da sie leicht unterschiedlich sind. Alles in allem sollte es aber gleich funktionieren.

Ich habe darüber nachgedacht, ein installationsfertiges Image (iso oder img) zu erstellen, wenn genügend Leute daran interessiert sind, hinterlassen Sie einen Kommentar unten oder schreiben Sie mir eine Nachricht!

## Installation des Deep Learning (TensorFlow, CUDA, CUDNN, Anaconda) Setups auf einer frischen Arch-Linux-Installation 

Wenn Sie [mit der Installation von Arch (puh!)](//https://www.datafortress.cloud/blog/howto-install-arch-linux-the-easy-way/) fertig sind, lassen Sie uns zunächst einige Einstellungen so ändern, dass unser System stabiler arbeitet.

### 1. Umschalten auf die schnellsten Spiegel

Software wird von so genannten "Mirrors" heruntergeladen, das sind Server, die alle Arch-Bibliotheken enthalten. Wenn dies nicht automatisch geschieht, kann es passieren, dass Ihre Server noch nicht optimiert sind. Deshalb werden wir ein kleines Tool installieren, das die schnellsten Server findet und speichert, den sogenannten "Spiegel".

Installieren Sie den Reflektor mit


> sudo pacman -S reflector

Finden Sie die besten Server und laden Sie sie herunter

> reflector --verbose -l 20 -n 20 --sort rate --save /etc/pacman.d/mirrorlist

Prüfen Sie die Ausgabe, ob sie sinnvoll ist, z.B. wenn die Domains in der Nähe Ihres Standortes liegen. Wenn nicht, können Sie das Länderkennzeichen hinzufügen, um genauere Ergebnisse zu erhalten, z.B. für Deutschland und Österreich:

> reflector -c “AT,DE” --verbose -l 20 -n 20 --sort rate --save /etc/pacman.d/mirrorlist

Aktualisieren Sie Ihre Installation

> sudo pacman -Syyu

### 2. Ändern der Desktop-Umgebung

Wenn Sie Manjaro verwenden oder die "Gnome"-Desktop-Umgebung wählen, wie Sie sie von Ubuntu her kennen, könnte es sich lohnen, darüber nachzudenken, sie zu ändern, da Gnome bekanntermaßen mehr RAM als Chrome frisst, und wir in unserem Deep Learning-Setup sicherlich RAM benötigen.

Wenn Ihnen Gnome gefällt, können Sie diesen Schritt gerne überspringen. Ansonsten kann ich den Xfce-Desktop empfehlen, da er eine gute Kombination aus geringem Gewicht und vielen Funktionen ist. 

Xfce herunterladen

> sudo pacman -S xfce4 xfce4-goodies lxdm

Lxdm ist ein Displaymanager, mit dem Sie mehrere Desktops verwenden können.

Melden Sie sich von Ihrer aktuellen Sitzung ab und drücken Sie Alt + F2 (oder Alt + F3, wenn es nicht funktioniert), um ein Terminal zu erhalten. Deaktivieren Sie zuerst Gnome und "aktivieren" Sie danach Xfce:

> sudo systemctl disable gdm \
> sudo pacman -R gnome gnome-extras

Aktiviere Xfce

> sudo systemctl enable lxdm \
> sudo systemctl start lxdm

Wenn die neue Xfce-Arbeitsoberfläche geöffnet wird, melden Sie sich einfach an und erkunden Sie sie, wenn nicht, versuchen Sie einen Neustart (sudo reboot). Wenn das nicht hilft, fahren Sie fort zu weinen und sich auf dem Boden zu wälzen, und senden Sie mir danach eine Nachricht oder einen Kommentar.

### 3. Installation der LTS (Langzeit-Unterstützung) Linux-Kernel für bessere Stabilität

Arch ist berühmt dafür, dass er den aktuellen Linux-Kerneln sehr nahe kommt, was gut ist, wenn Sie immer die neuesten Pakete und Linux-Funktionen wollen, aber eine schlechte Idee, wenn Sie eine Deep Learning Workstation bauen. 

Deshalb bin ich auf die LTS-Kernel umgestiegen, die im Grunde Kernel sind, die mehr Unterstützung erhalten und stabiler sind als die neueren Versionen des Linux-Kernels. 

Zum Glück ist der Wechsel des Kernels in Arch. Zuerst werden wir die Kernel herunterladen und danach unserem Bootmanager mitteilen, welchen Kernel er wählen soll.

Zuerst laden wir die LTS-Kernel herunter:

> sudo pacman -S linux-lts linux-lts-headers

Werfen Sie einen Blick auf Ihre aktuellen Kernel-Versionen:

> ls -lsha /boot

Ein Kernel sollte vmlinuz-linux.img und initramfs-linux.img (Ihre aktuellen Versionen) heißen und die LTS-Kernel die gleichen mit -lts am Ende. 

Wenn Sie zwei Kernel sehen, können Sie nun damit fortfahren, die alten Kernel zu löschen:

> sudo pacman -R linux

Ein fortgeschrittener Teil ist nun, dass Sie Ihrem Bootloader mitteilen müssen, welchen Kernel er wählen soll. Die Frage ist, welchen Bootloader Sie verwenden, aber in den meisten Fällen ist es Grub. Wenn Sie [meinem Arch-Installations-Tutorial gefolgt sind](//www.datafortress.cloud/blog/howto-install-arch-linux-the-easy-way/), ist Ihr Bootloader systemd-boot.


Meine Empfehlung ist, die Grub-Anweisungen auszuprobieren, und wenn das nicht funktioniert, fahren Sie mit den anderen fort.

#### Ändern des Grub-Bootloaders für die LTS-Linux-Kernel

> grub-mkconfig -o /boot/grub/grub.cfg

Wenn Sie einen Fehler sehen, fahren Sie mit dem nächsten Bootloader fort, andernfalls führen Sie einen Neustart (sudo reboot) durch.

#### Ändern des syslinux-Bootloaders für die LTS-Linux-Kernel

Bearbeiten Sie die Konfigurationsdatei:

> sudo nano /boot/syslinux/syslinux.cfg

Fügen Sie einfach "-lts" in die vmlinuz-linux.img und initramfs-linux.img ein, so dass sie vmlinuz-linux-lts.img und initramfs-linux-lts.img sind.

#### Changing the systemd-boot bootloader for the LTS linux kernels

Wenn Sie aus meiner Arch-Installationsanleitung kommen, ist dies Ihr Bootloader. 

Bearbeiten Sie die Konfigurationsdatei:

> sudo nano /boot/loader/entries/arch.conf

Fügen Sie einfach "-lts" in die vmlinuz-linux.img und initramfs-linux.img ein, so dass sie vmlinuz-linux-lts.img und initramfs-linux-lts.img sind 

### 4. Installieren von yay, ein einfacher Weg, AUR-Pakete zu installieren

Sie sollten es vorziehen, den ultraschnellen Pacman zur Installation der meisten Pakete zu verwenden, aber das Erstaunliche an Arch ist, dass Benutzer Millionen von benutzerdefinierten Paketen erstellen, die superleicht zu installieren sind. Sie können im Grunde jedes Programm, das Ihnen einfällt, in diesem Repo finden. 

git SVC installieren

> sudo pacman -S git \
> mkdir ~/tmp \
> git-clone https://aur.archlinux.org/yay-git.git ~/tmp/yay \
> cd ~/tmp/yay \
> makepkg -si

Jetzt können Sie all die schönen AUR-Pakete unter https://aur.archlinux.org/packages/ durchstöbern oder einfach loslegen und tippen:

> yay -S [PAKET] 

Um es zu installieren. 

### 5. Schließlich die eigentliche cuda, cudnn, anaconda-Installation, auf der sowohl TensorFlow 1.15 als auch 2.0 läuft

Installieren Sie Nvidia-Treiber, cuda, cudnn mit einem einfachen Befehl

> sudo pacman -S nvidia nvidia-utils cuda cudnn

Dies dauert einige Zeit, also holen Sie sich einen Kaffee oder fahren Sie mit den nächsten Schritten fort

Anakonda herunterladen, ich mag Miniconda:

> wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh ~/

Ausführbar machen und installieren

> cd ~/ \
> chmod +x ./Miniconda*.sh \
> ./Miniconda*.sh

Lassen Sie einfach alles auf Standard.

> source ./bash_profile

Starten Sie Ihr System neu

> sudo reboot

Tensorflow installieren

Jetzt ist es an der Zeit, sich zwischen TensorFlow für CPU oder GPU zu entscheiden. Ich werde mit der GPU-Option fortfahren, aber wenn Sie die CPU-Version laufen lassen wollen, entfernen Sie einfach das "-gpu" aus dem Paketnamen.

##### Erstellen Sie eine Anakonda-Umgebung für Tensorflow 2.0

> conda create --name tf2.0 \
> conda activate tf2.0 \
> conda pip install \
> conda install tensorflow-gpu pandas numpy

Erledigt! Überprüfen Sie nun das Ergebnis mit:

> python \
> from tensorflow.python.client import device_lib  \
> device_lib.list_local_devices()

Wenn das Ergebnis einen Gerätenamen wie diesen zeigt, sind Sie fertig!

2018-05-01 05:25:25.929575: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1356] Gerät 0 mit Eigenschaften gefunden:
Name: GeForce GTX 3080 10GB Dur: ...

##### Erstellen Sie eine Anakonda-Umgebung für Tensorflow 1.15

> conda deactivate \
> conda create --name tf1.15 \
> conda activate tf1.15 \
> conda install pip python==3.7 \
> conda install tensorflow-gpu===1.15

Und überprüfen Sie nochmals, ob alles funktioniert und Ihre gpu erkannt wird:

> python \
> from tensorflow.python.client import device_lib \
> device_lib.list_local_devices()


### 6. Umschalten zwischen TensorFlow 1.15 und TensorFlow 2.0 auf einem Gerät!

Meiner Meinung nach ein Traum der wahr wird, wählen Sie einfach die Version 1.15 mit
> conda activate tf1.15

Und die TensorFlow 2.0 Version mit
> conda activate tf2.0



















