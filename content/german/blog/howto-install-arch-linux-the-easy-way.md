---
author: Justin Guese
bg_image: /images/blog/Archlinux_GNOME_3.2.png
categories:
- linux
- tutorial
date: 2020-07-06 07:10:46+02:00
description: "Arch Linux auf einfache Weise mit verschl\xFCsselten Laufwerken installieren"
image: /images/blog/Archlinux_GNOME_3.2.png
tags:
- tutorial
- arch linux
- deep learning
- reinforcement learning
- linux
- encryption
- encypt data at rest
title: "How To - Arch Linux auf einfache Weise mit verschl\xFCsselten Laufwerken installieren"
type: post
---

# Installation von Arch Linux auf einfache Weise mit verschlüsselten Laufwerken für Deep Learning

## Die Vorteile von Arch Linux

In meinem anderen Beitrag, [\How To: Ditching Ubuntu in favor of Arch Linux for a Deep Learning Workstation\](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/), Ich habe erklärt, warum ich für meine Machine Learning Workstation von Ubuntu zu Arch Linux gewechselt habe. Zusammengefasst liegt es vor allem an der Geschwindigkeit, denn Arch ist viel näher an der Hardware und daher viel schneller, weniger Bloatware und daher weniger RAM-Nutzung, die ich für maschinelles Lernen benötige, und die erstaunlichen Pakete pacman und AUR, die schnell und einfach zu installieren sind.

In Ubuntu, zum Beispiel, es ist ziemlich schwierig, TensorFlow und CUDA für Deep Learning zum Laufen zu bringen, da die Debian-Paketstruktur anders ist und die Installation langsamer als bei Arch. In Arch, Abhängigkeiten werden gut gehandhabt, und Pakete sind nicht so abstrahiert, da Arch im Grunde der \reine\ Linux-Kernel selbst ist.

Außerdem kommen die Pakete viel schneller heraus, und das ArchWiki gilt als die umfangreichste Dokumentation, die es für ein Betriebssystem gibt. 

Das Motto von Arch kann als \Alles anpassen\ beschrieben werden., und so schnell wie möglich sein\, während das Motto von Ubuntu lauten würde: \Mache die Installation und Benutzung für neue Benutzer so einfach wie möglich\.. Jetzt, Ich will nicht sagen, dass Ubuntu schlecht ist., weil die Gemeinschaft riesig ist, und es ist die perfekte Distro, um Ihre Reise in die Welt von Linux zu beginnen, aber wenn man sich an Linux gewöhnt hat und mehr Geschwindigkeit braucht, Arch könnte der beste nächste Schritt sein.

Ich bin zumindest mit Arch zufrieden., weil es viel schneller ist als alles, was ich bisher gesehen habe, und ich kann alles individuell anpassen. 

Ich habe darüber nachgedacht, eine iso oder img für mein Deep Learning Build zur Verfügung zu stellen, um eine einfache Installation zu ermöglichen. Bei Interesse bitte kommentieren oder mir eine Nachricht schicken. 

Zusätzlich, wenn Sie mit einer leichten Abstraktionsschicht zurechtkommen [Manjaro Arch](//manjaro.org/) könnte eine gute Wahl für Sie sein. Es ist im Grunde Arch, aber einfach und benutzerfreundlich gemacht. Ich habe es geliebt, wechselte aber zu Arch, da Manjaro seine eigenen Pakete verwendet, die noch gut sind, aber nicht dasselbe wie die \reinen\ Arch-Pakete. Wenn Sie kein Power-User sind, könnte dies die richtige Wahl für Sie sein. 

## Wie man Arch Linux auf einfache Weise installiert

Während der [einführende Leitfaden](//wiki.archlinux.org/index.php/installation_guide), die von arch bereitgestellt wird, ist bereits recht gut, es kann für Neulinge verwirrend sein. Deshalb habe ich beschlossen, mein eigenes Tutorial zu schreiben. 

Mein Ziel war es, Arch mit verschlüsselten Laufwerken zu installieren, da ich die gespeicherten Daten für meine Kunden sichern muss. 

### 1. Herunterladen des Arch Linux-Images

Besuchen Sie https://www.archlinux.org/download/ und laden Sie das Bild herunter. 

Schreiben Sie sie auf einen USB-Stick. E.g. (Sie können aber auch Ihr eigenes Programm verwenden) für:

Linux:
> dd if=ISOFILE of=/dev/sdX status=progress
 
Wo der sdX ist Ihr USB-Stick. Überprüfen Sie es mit \lsblk\.

Windows / Mac:
Ich benutze gerne Etcher https://www.balena.io/etcher/

Booten Sie den USB-Stick über Ihr Boot-Menü (F11, F12 in den meisten Fällen)

### 2. Erste Einrichtung in Live ISO

Sobald Sie sich in der Live-ISO von Arch, sollten Sie die grundlegende Befehlszeile von Arch sehen. 

**Nicht eine US-Tastatur**? Laden Sie Ihre Tasten mit:
> loadkeys KEYMAP

Wobei Keymap Ihr Gebietsschema ist. Holen Sie sich Ihr Gebietsschema mit

> localectl list-keymaps | grep -i SEARCHTERM

E.g. die Verwendung des obigen Befehls mit SEARCHTERM = Deutschland ergibt de-latin1, für die der Befehl loadkeys gilt:
> loadkeys de-latin1


(Optional) Wenn Sie kein Ethernet haben, müssen Sie möglicherweise mit folgenden Befehlen eine Verbindung zu Ihrem WLAN herstellen. Ersetzen Sie WIFINETWORK und WIFIPASSWORD durch Ihren WiFi-Namen und Ihr Passwort.

> wpa_passphrase 'WIFINETWORK' 'WIFIPASSWORD' >> /etc/wpa_supplicant/wpa_supplicant.conf \\
> wpa_supplicant -Bc /etc/wpa_supplicant/wpa_supplicant.conf -i 'wlan0' \\
Wenn der zweite Befehl nicht funktioniert, ist der Name Ihres WLAN-Geräts möglicherweise anders. Sie können dies mit \ifconfig\ überprüfen
> dhclient

Überprüfen Sie Ihre Verbindung mit Curling eine Website. Wenn die Antwort wie HTML aussieht, sind Sie verbunden, wenn etwas in der Art von \404\ angezeigt wird, \Zeitüberschreitung\ oder \keine Verbindung\ Wiederholen Sie die obigen Schritte und achten Sie auf Tippfehler. 
> curl www.datafortress.Wolke

### 2. Partitionierung der Laufwerke

Dies ist der schwierigste Schritt, Wenn Sie also damit fertig sind, sind Sie fast fertig! Ich habe mich für die fortgeschrittene Version entschieden, bei der das Laufwerk vollständig verschlüsselt ist, um die Sicherheit zu erhöhen, aber Sie können auch die \[Standardmethode](//wiki.archlinux.org/index.php/Partitionierung)\ statt. 

In dieser Anleitung wird davon ausgegangen, dass Sie Ihr gesamtes Laufwerk löschen wollen. Stellen Sie also sicher, dass alle Daten gesichert sind.. Natürlich, ein Dual-Boot mit Windows oder so ist ebenfalls möglich, aber das werde ich in einem anderen Leitfaden erklären.

Es ist geplant, zwei Partitionen einzurichten:
Erste Partition: EFI-Boot-Laufwerk - das Ihrem PC sagt, wie er in Arch booten soll
Zweite Partition: Vollständig verschlüsseltes Laufwerk mit \Sub\-Laufwerken, die die Auslagerungsdatei enthalten, den Stammordner und ein separates /home-Laufwerk zur Sicherheit. 
Warum drei Partitionen auf dem zweiten Laufwerk? Nehmen wir an, Sie vermasseln Ihre Root-Installation. In diesem Fall wird Ihr privater Ordner mit Ihren Dokumenten, Einstellungen usw. befinden sich auf einer separaten Partition und können bei einer Neuinstallation problemlos wiederverwendet werden. Das heißt, Sie könnten eine neue Arch-Installation auf der Root-Partition installieren, und Ihr Stammverzeichnis einfach wiederverwenden. Schön. 

#### Schritt 1: Ermitteln Sie den Namen Ihres Laufwerks

> lbslk -lh

 Hier sehen Sie alle angeschlossenen Laufwerke. Normalerweise sollte Ihr Hauptlaufwerk /dev/sda und Ihr USB-Stick /dev/sdb heißen.. 

**Prüfen Sie, ob die sda wirklich Ihr Hauptlaufwerk ist, entsprechend der GB-Speicherkapazität und allem anderen. Wenn Sie einfach die folgenden Befehle mit sda kopieren und einfügen, löschen Sie möglicherweise das falsche Laufwerk!!!
Deshalb nenne ich das Gerät in den folgenden Abschnitten sdX, aber ersetzen Sie das X durch Ihre Gerätenummer (eine,b,c, ...). Einige Laufwerke haben unterschiedliche Namen, einfach vergleichen und entsprechend ersetzen. 

#### Schritt 2: Partitionierung

gdisk starten

> gdisk /dev/sdX

Boot-EFI-Laufwerk einrichten
1. Geben Sie 'o' ein, um eine Partitionstabelle zu erstellen
2. Geben Sie 'n' für eine neue Partition ein
3. Enter
4. Enter
5. +256M
6. EF00
Dadurch wird eine 256 MB große Partition mit dem EFI-Format erstellt, die wir zum Booten benötigen

Verschlüsselte Arch Drive Einrichtung
1. Geben Sie 'n' ein, um eine neue Partition zu erstellen
2. Enter
3. Enter
4. Enter
5. 8309

Prüfen Sie, ob alles richtig aussieht, indem Sie 'p' drücken.. Sie sollte folgendermaßen aussehen:

>Nummer Anfang (Sektor) Ende (Sektor) Größe Code Name
> 1 2048 1050623 256.0 MiB EF00 EFI System \\
> 2 1050624 242187466 115.0 GiB 8309 Linux LUKS

Sieht gut aus? Drücken Sie 'w', um die Änderungen auf die Festplatte zu schreiben.. 

### 3. Erstellen Sie die verschlüsselten Dateisysteme

Die Partitionen sind im Moment leer. Als nächstes erstellen wir die Dateisysteme und verschlüsselten \Sub\-Partitionen. Denken Sie daran, das X durch Ihre Laufwerksnummer zu ersetzen (normalerweise a).

> cryptsetup luksFormat /dev/sdX2 \\
> cryptsetup open /dev/sdX2 cryptlvm \\
> pvcreate /dev/mapper/cryptlvm \\
> vgcreate datafortress /dev/mapper/cryptlvm

Sie können die folgenden Festplattengrößen vor dem \G\ für Gigabyte durch die gewünschte Größe ersetzen. Für Deep Learning sollte Swap 32 Gb sein, für andere Fälle rund um die Größe Ihres RAM. Ich empfehle, dass das Wurzelsystem 40 GB groß sein sollte., aber das Minimum sollte 10Gb sein. 
Sie können datafortress durch etwas anderes ersetzen, oder es so lassen, wie es ist, um das coole Kind der Stadt zu sein. 

> lvcreate -L 16G datafortress -n swap \\
> lvcreate -L 40G datafortress -n root }
> lvcreate -l +100%FREE datafortress -n home

Dateisysteme erstellen

> mkfs.vat -F32 /dev/sdX1 \\
> mkfs.ext4 /dev/mapper/datafortress-root
> mkfs.ext4 /dev/mapper/datafortress-home \\
> mkswap /dev/mapper/datafortress-swap

Montieren Sie sie

> mount /dev/mapper/datafortress-root /mnt \\
> mkdir /mnt/home \\
> mkdir /mnt/boot 【.
> mount /dev/mapper/datafortress-home /mnt/home \\
> mount /dev/sdX1 /mnt/boot \\
> swapon /dev/mapper/datafortress-swap

### 4. Basis-Linux installieren

Vor der Installation wird empfohlen, die Mirrorliste so zu aktualisieren, dass die Pakete von den nächstgelegenen Mirrors heruntergeladen werden. [Gehen Sie zu meinem anderen Artikel und suchen Sie nach \Reflektor\, um eine Anleitung dazu zu erhalten](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/). 

> pacstrap /mnt base base-devel linux linux-firmware nano

### 5. Fstab installieren

Fstab ist im Grunde eine Anleitung, wie Sie Ihre Laufwerke einbinden. Einfach kopieren und einfügen für den Moment.

> genfstab -U /mnt >> /mnt/etc/fstab

### 6. Letzter Feinschliff

Wir werden in unser Mount chroot, was im Grunde so ist, als würde man sudo in unserem System ausführen.

> arch-chroot /mnt
> ln -s /usr/share/zoneinfo/REGION/CITY /etc/localtime

Wo Region ist Ihre Region (verwenden Sie einfach tab, um die Optionen zu sehen, wenn Sie /usr/..../zoneinfo/, wie Europa, und CITY Ihre Stadt, wie Wien.

> hwclock --systohc

Legen Sie Ihren Hostnamen fest. Der lustige Teil bei der Installation von Arch ist, dass man Dinge tun kann, die Ubuntu und andere für einen tun. Legen Sie den Hostnamen für Ihr Gerät fest, e.g. wenn Sie sich später per ssh in Ihr Gerät einloggen, müssen Sie keine IP eingeben, kann aber stattdessen diesen Namen verwenden. E.g. \ssh user@hunneybunney\ könnte viel angenehmer zu merken sein als 192.168.0.231.

> echo NAME > /etc/hostname

Als nächstes setzen wir unser Gebietsschema, grundsätzlich die Systemsprache. Öffnen Sie die Datei in nano und suchen Sie nach Ihrem Sprachcode. Verwenden Sie nach Möglichkeit die UTF-8-Version. Die Suche mit nano ist möglich mit Strg + W. [Nano-Tutorial](//www.howtogeek.com/howto/42980/the-beginners-guide-to-nano-the-linux-command-line-text-editor/). 
E.g. Ich wollte Deutsch und Englisch (US) haben, Deshalb habe ich en_US auskommentiert..UTF-8 UTF-8 and de_DE.UTF-8 UTF-8
> nano /etc/local.gen

Erzeugen Sie lokale
> locale-gen

(Optional) Wenn Sie eine nicht-amerikanische Tastatur verwenden, fügen Sie nun Ihre Tastaturbelegung hinzu:

> echo KEYMAP > /etc/vconsole.conf

Verwenden Sie die Keymap von Anfang an, wie De-Latin1

Als nächstes installieren Sie eine Software. Wenn Sie bereits pacman-Pakete kennen, die Sie installieren möchten, tun Sie es jetzt. Ich empfehle, zunächst nur das Minimum zu verwenden und dann mit der Installation der Pakete fortzufahren, wenn alles gut funktioniert. 

**Minimum**
> pacman -Syu \\
> pacman -S wpa_supplicant dhclient lvm2 dialog

**Installation einer Desktop-Umgebung**
Sie können bereits eine Desktop-Umgebung installieren, die es Ihnen ermöglicht, eine grafische Benutzeroberfläche für alles zu haben. 

Installieren Sie einen Display-Manager
> pacman -S lightdm

Die Vorteile von Arch sind die Wahl einer eigenen Desktop-Umgebung. Für das Aussehen wählen Sie Gnome, aber er wird RAM-hungrig sein, für Effizienz wählen Sie Xfce. 

**Installieren Sie nur EINEN der folgenden Punkte**

So installieren Sie GNOME:

> pacman -S gnome gnome-extra

So installieren Sie Cinnamon:

> pacman -S cinnamon nemo-fileroller

So installieren Sie XFCE:

> pacman -S xfce4 xfce4-goodies

So installieren Sie KDE:

>pacman -S plasma

So installieren Sie MATE:

> pacman -S mate mate-extra

### 7. Hinzufügen von Benutzern

Ich empfehle, unterschiedliche Passwörter für den Root-Benutzer und den Standardbenutzer zu verwenden. 

> useradd -m -G wheel 'USERNAME' \\
> passwd 'BENUTZERNAME'

Erstellen Sie ein Passwort für den Benutzer root

> passwd

Sie melden sich mit Ihrem Standardbenutzer an. Wenn Sie administrative Aufgaben erledigen müssen, können Sie den Benutzer mit \su - root\ wechseln.

### 8. Boot-Konfiguration

Jetzt gibt es eine Menge Bootmanager, aber ich mochte den systemd-boot loader am meisten. [Sie können auch einen anderen wählen](//wiki.archlinux.org/index.php/Kategorie:Boot_loaders). 

> nano /etc/mkinitcpio.conf

Suchen Sie die HOOKS-Zeile und bearbeiten Sie sie entsprechend. Ordnung muss sein!

> HOOKS=(base udev autodetect keyboard keymap consolefont modconf block encrypt lvm2 filesystems resume fsck)

Schließen und speichern Sie die Datei (Strg + X, y)

> mkinitcpio -p linux \\
> bootctl install

Bearbeiten Sie Ihre Booteinträge

Sie benötigen die Partitions-ID des verschlüsselten Laufwerks. Normalerweise wird dies /dev/sda2 sein, können aber unterschiedlich sein. Es wird nicht das erste 256-MB-Laufwerk sein, da dies die Bootpartition ist. 

Suchen Sie den Namen und notieren Sie ihn, höchstwahrscheinlich ist es /dev/sda2

> lsblk -lh

Suchen Sie dann nach der UUID-Zeichenkette in der Ausgabe des folgenden Befehls für die Geräte-ID /dev/sdX2

> blkid

Sie können denselben Befehl auch mit einem Filter ausprobieren:

> blkid | grep UUID=

Beispiel UUID: 727cac18-044b-4504-87f1-a5aefa774bda


> nano /boot/loader/entries/arch.conf
Fügen Sie Folgendes hinzu:

>Titel ArchLinux \\
>linux /vmlinuz-linux \\
>initrd /initramfs-linux.img \\
>options cryptdevice=UUID=<YOUR-PARTITION-UUID>:lvm:allow-discards resume=/dev/mapper/datafortress-swap root=/dev/mapper/datafortress-root rw quiet

Denken Sie daran, datafortress durch die von Ihnen gewählte ID zu ersetzen, wenn Sie sie geändert haben. Ansonsten unverändert lassen.

### 9. Abschließen

FERTIG! Jetzt neu starten, den USB-Stick entfernen und hoffen, dass alles funktioniert hat.

> exit \\
> umount -R /mnt \\
> Neustart

**[Ich empfehle die Einrichtung von LTS-Kerneln, da sie stabiler sind, und aktualisieren Sie die Spiegelliste. Weitere Informationen dazu finden Sie in meinem Leitfaden zur \Erstellung einer Arch Linux Deep Learning Station\](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/).**

