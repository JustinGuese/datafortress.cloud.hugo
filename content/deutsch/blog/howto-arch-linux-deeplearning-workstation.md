---
title: "How-To – Ubuntu zugunsten von Arch Linux für eine Deep Learning Workstation aufgeben"
date: 2020-08-18T10:07:21+06:00
author: "Justin Guese"
description: "Ubuntu zugunsten von Arch Linux für eine Deep Learning Workstation aufgeben"
image: "images/blog/deeplearningarch.png"
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

---

## Warum sollte ich Ubuntu aufgeben?

Die meisten von Ihnen verwenden vielleicht Ubuntu für ihre Workstations, und das ist für unerfahrenere Benutzer auch völlig in Ordnung. Eines der Probleme, die ich mit Ubuntu und Tensorflow/CUDA hatte, war jedoch, dass der Umgang mit den verschiedenen Treibern und Versionen von CUDA, cuDNN, TensorFlow usw. ziemlich mühsam war. Ich weiß nicht, wie es Ihnen geht, aber wenn ich erst einmal eine funktionierende Tensorflow 1.15- oder 2.0-Umgebung hatte, habe ich sie normalerweise nicht mehr angerührt, aus Angst, diese heilige Konfiguration zu ruinieren.

Wenn man mit verschiedenen Programmen arbeitet, wäre es schön, eine Möglichkeit zu haben, zwischen den beiden meistgenutzten TensorFlow-Versionen 1.15 und 2.0 zu wechseln, so wie man es bei Google Colab mit einem einzigen Befehl tun kann. Aber die Installation einer anderen TensorFlow-Version hat mein System normalerweise wieder durcheinandergebracht.

Zusätzlich stand Arch schon immer auf meiner To-Do-Liste, da es die puristischste („barebone“) Linux-Distributionsart ist, die man bekommen kann. Das bedeutet, dass man viel näher an der Hardware arbeitet als bei „höheren Abstraktionen“ wie Ubuntu. In ihren eigenen Worten ist Ubuntu so gebaut, dass es „out of the box funktioniert und den Installationsprozess für neue Benutzer so einfach wie möglich macht“, während das Motto von Arch Linux „alles anpassen“ lautet.
Da Arch viel näher an der Hardware ist, ist es wahnsinnig viel schneller als Ubuntu (und meilenweit vor Windows), allerdings um den Preis einer stärkeren Nutzung des Terminals.

Als ich Arch in den letzten Wochen benutzt habe, hat sich der RAM-Verbrauch im Vergleich zu Ubuntu normalerweise halbiert, und die Installation von Machine-Learning-Paketen ist ein Kinderspiel. Ich kann sowohl TensorFlow 1.15 als auch 2.0 gleichzeitig am Laufen haben und die Versionen mit Anaconda-Umgebungen wechseln. Außerdem läuft das System recht stabil, da ich die LTS-Kernel (Long Term Support) von Linux verwende und Aktualisierungen im berühmten AUR (vom Benutzer erstellte Pakete in Arch) normalerweise einen Monat vor den Debian (Ubuntu)-Paketen erscheinen.

Alles in allem kann ich die Einrichtung einer Arch Linux Deep Learning Station nur empfehlen, da sie:
1. Schneller ist, d.h. Pakete lassen sich superschnell installieren, Deep Learning ist beschleunigt, ...
2. Stabiler ist
3. Ein einfacheres Wechseln zwischen TensorFlow-Versionen ermöglicht
im Vergleich zu Ubuntu.

Ich werde dieses How-to in zwei Teile aufteilen: Der erste ist „Wie installiere ich Arch Linux“ und der zweite „Wie installiere ich die Pakete für die Deep Learning Workstation“.

Für das allgemeine [„Wie installiere ich Arch Linux“ besuchen Sie diesen Artikel](//www.datafortress.cloud/blog/howto-install-arch-linux-the-easy-way/).

Wenn Arch im Moment zu komplex ist, könnten Sie [Manjaro](//manjaro.org/) ausprobieren, eine benutzerfreundliche Version von Arch, auch wenn ich nicht garantieren kann, dass alle Pakete genauso funktionieren, da sie sich leicht unterscheiden. Im Großen und Ganzen sollte es jedoch gleich funktionieren.

Ich habe darüber nachgedacht, ein installationsbereites Image (iso oder img) zu erstellen. Wenn genügend Leute interessiert sind, hinterlassen Sie unten einen Kommentar oder schreiben Sie mir eine Nachricht!

## Installation des Deep Learning-Setups (TensorFlow, CUDA, cuDNN, Anaconda) auf einer frischen Arch Linux Installation
Sobald Sie [mit der Arch-Installation fertig sind (uff!)](//www.datafortress.cloud/blog/howto-install-arch-linux-the-easy-way/), lassen Sie uns zuerst einige Einstellungen ändern, damit unser System stabiler läuft.

### 1. Wechsel zu den schnellsten Mirrors

Software wird von sogenannten „Mirrors“ heruntergeladen. Das sind Server, die alle Arch-Bibliotheken enthalten. Wenn dies nicht automatisch geschieht, kann es vorkommen, dass Ihre Server noch nicht optimiert sind. Daher installieren wir ein kleines Tool namens „reflector“, das die schnellsten Server findet und speichert.

Installieren Sie Reflector mit:

> sudo pacman -S reflector

Finden und laden Sie die besten Server herunter:

> reflector --verbose -l 20 -n 20 --sort rate --save /etc/pacman.d/mirrorlist

Prüfen Sie, ob die Ausgabe Sinn ergibt, z.B. ob die Domains in der Nähe Ihres Standorts liegen. Wenn nicht, können Sie den Länder-Tag hinzufügen, um präzisere Ergebnisse zu erhalten, z.B. für Deutschland und Österreich:

> reflector -c “AT,DE” --verbose -l 20 -n 20 --sort rate --save /etc/pacman.d/mirrorlist

Aktualisieren Sie Ihre Installation:

> sudo pacman -Syyu

### 2. Ändern der Desktop-Umgebung

Wenn Sie Manjaro verwenden oder die „Gnome“-Desktop-Umgebung gewählt haben, wie Sie sie von Ubuntu kennen, könnte es sich lohnen, über einen Wechsel nachzudenken, da Gnome dafür bekannt ist, mehr RAM zu verbrauchen als Chrome – und wir brauchen in unserem Deep-Learning-Setup definitiv RAM.

Wenn Sie Gnome mögen, können Sie diesen Schritt gerne überspringen. Ansonsten kann ich den Xfce-Desktop empfehlen, da er eine gute Kombination aus Leichtgewichtigkeit und Funktionsreichtum ist.

Xfce herunterladen:

> sudo pacman -S xfce4 xfce4-goodies lxdm

Lxdm ist ein Display-Manager, mit dem Sie mehrere Desktops verwenden können.

Melden Sie sich von Ihrer aktuellen Sitzung ab und drücken Sie Alt + F2 (oder Alt + F3, wenn es nicht funktioniert), um ein Terminal aufzurufen. Deaktivieren Sie zuerst Gnome und „aktivieren“ Sie anschließend Xfce:

Gnome deaktivieren und deinstallieren:

> sudo systemctl disable gdm \
> sudo pacman -R gnome gnome-extras

Xfce aktivieren:

> sudo systemctl enable lxdm \
> sudo systemctl start lxdm

Wenn sich der neue Xfce-Desktop öffnet, loggen Sie sich einfach ein und erkunden Sie ihn. Wenn nicht, versuchen Sie einen Neustart (sudo reboot). Wenn das nicht hilft, fangen Sie an zu weinen, rollen Sie sich auf dem Boden und schicken Sie mir anschließend eine Nachricht oder einen Kommentar.

### 3. Installation der LTS-Linux-Kernel (Long Term Support) für bessere Stabilität

Arch ist berühmt dafür, sehr nah an den aktuellen Linux-Kerneln zu sein, was gut ist, wenn man immer die neuesten Pakete und Linux-Features will, aber eine schlechte Idee, wenn man eine Deep Learning Workstation baut.

Deshalb bin ich auf die LTS-Kernel umgestiegen. Das sind im Grunde Kernel, die mehr Support erhalten und stabiler sind als die neueren Versionen des Linux-Kernels.

Glücklicherweise ist der Wechsel des Kernels in Arch super einfach. Zuerst laden wir die Kernel herunter und sagen danach unserem Boot-Manager, welcher Kernel gewählt werden soll.

Zuerst die LTS-Kernel herunterladen:

> sudo pacman -S linux-lts linux-lts-headers

Schauen Sie sich Ihre aktuellen Kernel-Versionen an:

> ls -lsha /boot

Ein Kernel sollte vmlinuz-linux.img und initramfs-linux.img heißen (Ihre aktuellen Versionen) und die LTS-Varianten genauso mit -lts am Ende.

Wenn Sie zwei Kernel sehen, können Sie nun dazu übergehen, die alten Kernel zu löschen:

> sudo pacman -R linux

Ein etwas fortgeschrittener Teil ist nun, dass Sie Ihrem Bootloader mitteilen müssen, welchen Kernel er wählen soll. Die Frage ist, welchen Bootloader Sie verwenden, aber in den meisten Fällen ist es Grub. Wenn Sie meinem Arch-Installations-Tutorial gefolgt sind, ist Ihr Bootloader systemd-boot.

Meine Empfehlung ist, es mit den Anweisungen für Grub zu versuchen, und wenn das nicht funktioniert, mit den anderen fortzufahren.

#### Ändern des Grub-Bootloaders für die LTS-Linux-Kernel

> grub-mkconfig -o /boot/grub/grub.cfg

Wenn Sie einen Fehler sehen, fahren Sie mit dem nächsten Bootloader fort, ansonsten starten Sie neu (sudo reboot).

#### Ändern des Syslinux-Bootloaders für die LTS-Linux-Kernel

Bearbeiten Sie die Konfigurationsdatei:

> sudo nano /boot/syslinux/syslinux.cfg

Fügen Sie einfach „-lts“ zu vmlinuz-linux.img und initramfs-linux.img hinzu, sodass daraus vmlinuz-linux-lts.img und initramfs-linux-lts.img werden.

#### Ändern des Systemd-boot Bootloaders für die LTS-Linux-Kernel

Wenn Sie meine Arch-Installationsanleitung genutzt haben, ist dies Ihr Bootloader.

Bearbeiten Sie die Konfigurationsdatei:

> sudo nano /boot/loader/entries/arch.conf

Fügen Sie einfach „-lts“ zu vmlinuz-linux.img und initramfs-linux.img hinzu, sodass daraus vmlinuz-linux-lts.img und initramfs-linux-lts.img werden.

### 4. Installation von yay, ein einfacher Weg für AUR-Pakete

Sie sollten es vorziehen, das ultraschnelle Pacman zu verwenden, um die meisten Pakete zu installieren. Aber eine großartige Sache an Arch ist, dass Benutzer Millionen von benutzerdefinierten Paketen erstellen, die super einfach zu installieren sind. In diesem Repo finden Sie im Grunde jedes Programm, das Sie sich vorstellen können.

Git SVC installieren:

> sudo pacman -S git \
> mkdir ~/tmp \
> git clone https://aur.archlinux.org/yay-git.git ~/tmp/yay \
> cd ~/tmp/yay \
> makepkg -si

Jetzt können Sie alle schönen AUR-Pakete unter https://aur.archlinux.org/packages/ durchsuchen oder es einfach wagen und tippen:

> yay -S [PAKET]

um es zu installieren.

### 5. Schließlich die echte Installation von CUDA, cuDNN, Anaconda für TensorFlow 1.15 und 2.0

Installieren Sie Nvidia-Treiber, CUDA und cuDNN mit einem einfachen Befehl:

> sudo pacman -S nvidia nvidia-utils cuda cudnn

Das dauert eine Weile, also holen Sie sich einen Kaffee oder fahren Sie mit den nächsten Schritten fort.

Anaconda herunterladen (ich mag Miniconda):

> wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh ~/

Ausführbar machen und installieren:

> cd ~/ \
> chmod +x ./Miniconda*.sh \
> ./Miniconda*.sh

Lassen Sie alles auf Standard.

> source ./bash_profile

Starten Sie Ihr System neu:

> sudo reboot

TensorFlow installieren:

Jetzt ist es an der Zeit, sich zwischen TensorFlow für CPU oder GPU zu entscheiden. Ich fahre mit der GPU-Option fort. Wenn Sie die CPU-Version ausführen möchten, entfernen Sie einfach das „-gpu“ aus dem Paketnamen.

##### Erstellen einer Anaconda-Umgebung für Tensorflow 2.0

> conda create --name tf2.0 \
> conda activate tf2.0 \
> conda install pip \
> conda install tensorflow-gpu pandas numpy

Fertig! Überprüfen Sie das Ergebnis nun mit:

> python \
> from tensorflow.python.client import device_lib \
> device_lib.list_local_devices()

Wenn das Ergebnis einen Gerätenamen wie diesen zeigt, sind Sie fertig!

2018-05-01 05:25:25.929575: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1356] Found device 0 with properties:
name: GeForce GTX 3080 10GB major: …

##### Erstellen einer Anaconda-Umgebung für Tensorflow 1.15

> conda deactivate \
> conda create --name tf1.15 \
> conda activate tf1.15 \
> conda install pip python==3.7 \
> conda install tensorflow-gpu==1.15

Und prüfen Sie erneut, ob alles funktioniert und Ihre GPU erkannt wird:

> python \
> from tensorflow.python.client import device_lib \
> device_lib.list_local_devices()

### 6. Wechseln zwischen TensorFlow 1.15 und TensorFlow 2.0 auf einem Gerät!

Meiner Meinung nach wird hier ein Traum wahr. Wählen Sie einfach die 1.15-Version mit:
> conda activate tf1.15

und die TensorFlow 2.0-Version mit:
> conda activate tf2.0
