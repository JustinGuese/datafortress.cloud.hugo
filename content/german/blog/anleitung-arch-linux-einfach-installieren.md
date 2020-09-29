---
title: How To - Arch Linux auf einfacher Weise mit verschlüsselten Laufwerken installieren
bg_image: "/images/blog/Archlinux_GNOME_3.2.png"
date: 2020-09-29T07:10:46+02:00
author: Justin Guese
description: How To - Arch Linux auf einfache Weise mit verschlüsselten Laufwerken installieren
image: "/images/blog/Archlinux_GNOME_3.2.png"
categories:
- linux
- tutorial
tags:
- tutorial
- arch linux
- deep learning
- reinforcement learning
- linux
- encryption
- encypt data at rest
type: post

---
# Arch Linux auf einfache Weise mit verschlüsselten Laufwerken für tiefes Lernen installieren

## Die Vorteile von Arch Linux

In meinem anderen Beitrag, ["How To: Ditching Ubuntu for a Deep Learning Workstation"](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/), habe ich erklärt, warum ich von Ubuntu zu Arch Linux für meine Machine Learning Workstation gewechselt habe. Zusammengefasst ist es vor allem wegen der Geschwindigkeit, weil Arch viel näher an der Hardware und damit viel schneller ist, weniger Bloatware und damit weniger RAM-Nutzung, die ich für maschinelles Lernen brauche, und wegen der erstaunlichen pacman- und AUR-Pakete, die schnell und einfach zu installieren sind.

In Ubuntu zum Beispiel ist es ziemlich schwierig, TensorFlow und CUDA für Deep Learning zum Laufen zu bringen, da die Debian-Paketstruktur anders ist und die Installation im Vergleich zu Arch langsamer ist. In Arch werden Abhängigkeiten gut gehandhabt, und die Pakete sind nicht so abstrahiert, da Arch im Grunde genommen der "reine" Linux-Kernel selbst ist.

Außerdem kommen Pakete viel schneller heraus, und das ArchWiki gilt als die umfangreichste Dokumentation, die es für ein Betriebssystem gibt. 

Das Motto von Arch kann als "Alles anpassen und so schnell wie möglich sein" beschrieben werden, während das Motto von Ubuntu lautet: "Mache die Installation und Benutzung so einfach wie möglich für neue Benutzer". Nun, ich sage nicht, dass Ubuntu schlecht ist, denn die Gemeinschaft ist riesig, und es ist die perfekte Distro, um Ihre Reise in die Linux-Welt zu beginnen, aber sobald Sie sich mehr an Linux gewöhnt haben und mehr Geschwindigkeit benötigen, könnte Arch der beste nächste Schritt sein.

Ich bin zumindest zufrieden mit Arch, denn es ist viel schneller als alles, was ich bisher gesehen habe, und ich kann alles anpassen. 

Ich habe darüber nachgedacht, für meinen Deep Learning-Build eine iso oder img für eine einfache Installation zur Verfügung zu stellen. Wenn Sie interessiert sind, schreiben Sie mir bitte einen Kommentar oder senden Sie mir eine Nachricht. 

Wenn Sie außerdem mit einer leichten Abstraktionsschicht einverstanden sind, könnte [Manjaro Arch](//manjaro.org/) eine gute Wahl für Sie sein. Es ist im Grunde genommen Arch, aber einfach und benutzerfreundlich gemacht. Ich habe es geliebt, bin aber zu Arch übergegangen, da Manjaro ihre eigenen Pakete verwendet, die immer noch gut sind, aber nicht dasselbe wie die "reinen" Arch-Pakete. Wenn Sie kein Power-User sind, könnte dies die richtige Wahl für Sie sein. 

## Wie man Arch-Linux auf einfache Weise installiert

Während der [einleitende Leitfaden](//wiki.archlinux.org/index.php/installation_guide), der von arch zur Verfügung gestellt wird, bereits recht gut ist, kann er für Neuankömmlinge verwirrend sein. Deshalb habe ich beschlossen, mein eigenes Tutorial zu schreiben. 

Mein Ziel war es, Arch mit verschlüsselten Laufwerken zu installieren, da ich die Daten im Ruhezustand für meine Kunden sichern muss. 

### 1. Herunterladen des Linux-Images von Arch

Gehen Sie auf https://www.archlinux.org/download/ und laden Sie das Bild herunter. 

Schreiben Sie es auf einen USB-Stick. Z.B. (aber Sie können Ihr eigenes Programm benutzen) für:

Linux:
> dd if=ISOFILE of=/dev/sdX status=progress

Wo der sdX Ihr USB-Stick ist. Überprüfen Sie es mit "lsblk".

Windows / Mac:
Ich benutzte gerne Etcher https://www.balena.io/etcher/

Booten Sie den USB-Stick über Ihr Boot-Menü (F11, F12 in den meisten Fällen)

### 2. Erste Einrichtung in Live ISO

Sobald Sie in der Live-ISO von Arch sind, sollten Sie die grundlegende Befehlszeile von Arch sehen. 

**Nicht eine US-Tastatur**? Laden Sie Ihre Tasten mit:
> loadkeys KEYMAP

Wo Keymap Ihr Gebietsschema ist. Erhalten Sie Ihr Gebietsschema mit

> localectl list-keymaps | grep -i SEARCHTERM

Wenn Sie z.B. den obigen Befehl mit SEARCHTERM = Deutschland verwenden, wird de-latin1 zurückgegeben, für das der Befehl loadkeys gilt:
> loadkeys de-latin1


(Optional) Wenn Sie kein Ethernet haben, müssen Sie sich möglicherweise mit den folgenden Befehlen mit Ihrem Wifi verbinden. Ersetzen Sie WIFINETWORK und WIFIPASSWORD durch Ihren wifi-Namen und Ihr wifi-Passwort.

> wpa_passphrase 'WIFINETWORK' 'WIFIPASSWORD' >> /etc/wpa_supplicant/wpa_supplicant.conf \
> wpa_supplicant -Bc /etc/wpa_supplicant/wpa_supplicant.conf -i 'wlan0' 

Wenn der zweite Befehl nicht funktioniert, ist Ihr wifi-Gerätename möglicherweise ein anderer. Sie können dies mit "ifconfig" überprüfen.

> dhclient

Überprüfen Sie Ihre Verbindung mit dem Curling einer Website. Wenn die Antwort wie HTML aussieht, sind Sie verbunden, wenn sie etwas in der Art von "404", "timed out" oder "keine Verbindung" sagt, wiederholen Sie die obigen Schritte und achten Sie auf Tippfehler. 

> curl www.datafortress.cloud

### 2. Partitionierung der Laufwerke

Dies ist der schwierigste Schritt, und wenn Sie damit fertig sind, sind Sie fast fertig! Ich habe mich für die fortgeschrittenere Version entschieden, bei der das Laufwerk für fortgeschrittene Sicherheit vollständig verschlüsselt ist, aber zögern Sie nicht, stattdessen die "[Standardmethode](https://wiki.archlinux.org/index.php/Partitioning)" zu verwenden. 

In dieser Anleitung wird davon ausgegangen, dass Sie vorhaben, Ihr ganzes Laufwerk zu löschen. Stellen Sie also sicher, dass alle Daten gesichert werden. Natürlich ist auch ein Dual-Boot mit Windows oder so möglich, aber das werde ich in einem anderen Leitfaden erklären.

Es ist geplant, zwei Partitionen zu haben:

- Erste Partition: EFI-Bootlaufwerk - das Ihrem PC mitteilt, wie er in Arch booten soll
- Zweite Partition: Vollständig verschlüsseltes Laufwerk mit "Sub"-Laufwerken, die die Auslagerungsdatei, den Stammordner und ein separates /home-Laufwerk zur Sicherheit enthalten. 



Warum drei Partitionen auf dem zweiten Laufwerk? Nehmen wir an, Sie bringen Ihre Root-Installation durcheinander. In diesem Fall befindet sich Ihr Home-Ordner mit Ihren Dokumenten, Einstellungen usw. auf einer separaten Partition und kann bei einer Neuinstallation leicht wiederverwendet werden. Das heißt, Sie könnten eine frische neue Arch-Installation in der Root-Partition installieren und Ihren Home-Ordner einfach "wiederverwenden". Schön. 

#### Schritt 1: Ermitteln Sie den Namen Ihres Laufwerks

> lbslk -lh

 Hier werden Ihnen alle angeschlossenen Laufwerke angezeigt. Normalerweise sollte Ihr Hauptlaufwerk /dev/sda und Ihr USB-Stick /dev/sdb heißen. 
**Prüfen Sie, ob sda wirklich Ihr Hauptlaufwerk ist, entsprechend der GB-Speicherkapazität und allem. Wenn Sie einfach die folgenden Befehle mit sda kopieren und einfügen, könnten Sie das falsche Laufwerk löschen! **
Deshalb werde ich in den folgenden Absätzen das Gerät sdX nennen, aber ersetzen Sie das X durch Ihre Gerätenummer (a,b,c, ...). Einige Laufwerke haben unterschiedliche Namen, vergleichen Sie einfach und ersetzen Sie entsprechend. 

#### Step 2: Partitionieren

gdisk starten

> gdisk /dev/sdX

Einrichtung des Boot-EFI-Laufwerks
1. Geben Sie 'o' ein, um eine Partitionstabelle zu erstellen
2. Typ 'n' für eine neue Partition
3. Geben Sie Eingabe ein.
4. Geben Sie Eingabe ein.
5. +256M
6. EF00

Dadurch wird eine 256-MB-Partition mit dem EFI-Format erstellt, die wir zum Booten benötigen

Einrichtung eines verschlüsselten Bogenlaufwerks
1. Geben Sie 'n' ein, um eine neue Partition zu erstellen
2. Geben Sie Eingabe  ein.
3. Geben Sie Eingabe ein.
4. Geben Sie Eingabe ein.
5. 8309

Prüfen Sie mit 'p', ob alles richtig aussieht. Es sollte wie folgt aussehen:
>Nummer Anfang (Sektor) Ende (Sektor) Größe Code Name \
> 1 2048 1050623 256,0 MiB EF00 EFI-System \
> 2 1050624 242187466 115.0 GiB 8309 Linux-LUKS

Sieht gut aus? Drücken Sie 'w', um Änderungen auf die Festplatte zu schreiben. 

### 3. Erstellen Sie die verschlüsselten Dateisysteme

Die Partitionen sind zur Zeit leer. Als nächstes werden wir die Dateisysteme und verschlüsselten "Sub"-Partitionen erstellen. Denken Sie daran, das X durch Ihre Laufwerksnummer (normalerweise a) zu ersetzen.

> cryptsetup luksFormat /dev/sdX2 \
> cryptsetup open /dev/sdX2 cryptlvm \
> pvcreate /dev/mapper/cryptlvm \
> vgcreate datafortress /dev/mapper/cryptlvm

Fühlen Sie sich frei, die folgenden Plattengrößen vor dem "G" für Gigabyte durch Ihre gewünschte Größe zu ersetzen. Für Deep Learning sollte Swap 32 Gb betragen, für andere Fälle etwa die Größe Ihres RAM. Ich empfehle für das Root-System 40 Gb, aber das Minimum sollte 10 Gb betragen. 
Sie können die Datenfestplatte durch alles Mögliche ersetzen oder sie so lassen, wie sie ist, um das coole Kind der Stadt zu sein. 

> lvcreate -L 16G datafortress -n swap \
> lvcreate -L 40G datafortress -n root \
> lvcreate -l +100%FREIE datafortress -n home

Dateisysteme erstellen

> mkfs.vat -F32 /dev/sdX1 \
> mkfs.ext4 /dev/mapper/datafortress-root \
> mkfs.ext4 /dev/mapper/datafortress-home \
> mkswap /dev/mapper/datafortress-swap > mkswap /dev/mapper/datafortress-swap

Montieren Sie sie

> mount /dev/mapper/datafortress-root /mnt > mount /dev/mapper/datafortress-root \
> mkdir /mnt/home \
> mkdir /mnt/boot \
> mount /dev/mapper/datafortress-home /mnt/home \
> mount /dev/sdX1 /mnt/boot \
> swapon /dev/mapper/datafortress-swap

### 4. Basis-Linux installieren

Vor der Installation wird empfohlen, Ihre Spiegelliste so zu aktualisieren, dass Pakete von den nächstgelegenen Spiegeln heruntergeladen werden. Gehen Sie zu meinem anderen Artikel und suchen Sie nach "Reflektor" für eine Anleitung, wie das zu tun ist](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/). 

> pacstrap /mnt base base-devel linux linux-firmware nano

### 5. Fstab installieren 

Fstab ist im Grunde eine Anleitung, wie Sie Ihre Laufwerke mounten können. Kopieren Sie sie einfach und fügen Sie sie erst einmal ein.

> genfstab -U /mnt >> /mnt/etc/fstab

### 6. Letzte Feinschliffe

Wir werden in unser Hauptverzeichnis chrooten, was im Grunde genommen so ist, als ob wir in unserem System sudo laufen lassen würden.

> arch-chroot /mnt \
> ln -s /usr/share/zoneinfo/REGION/CITY /etc/localtime

Wo Region Ihre Region ist (benutzen Sie einfach die Registerkarte, um die Optionen zu sehen, wenn Sie /usr/..../zoneinfo/ eingeben, wie Europe, und CITY Ihre Stadt, wie Vienna.

> hwclock --systohc

Legen Sie Ihren Hostnamen fest. Der lustige Teil bei der Installation von Arch ist, dass Sie Dinge tun können, die Ubuntu und andere für Sie tun. Legen Sie den Hostnamen für Ihr Gerät fest, z.B. wenn Sie später ssh in Ihr Gerät einspielen wollen, müssen Sie keine IP eingeben, sondern können stattdessen diesen Namen verwenden. Z.B. könnte "ssh user@weihnachtsmann" viel netter zu merken sein als 192.168.0.231.

> echo NAME > /etc/hostname

Als Nächstes stellen wir unser Gebietsschema ein, im Wesentlichen die Systemsprache. Öffnen Sie die Datei in nano und suchen Sie nach Ihrem Sprachcode. Verwenden Sie wenn möglich die UTF-8-Version. Die Suche mit nano ist mit Strg + W möglich. [Nano-Tutorial](//www.howtogeek.com/howto/42980/the-beginners-guide-to-nano-the-linux-command-line-text-editor/). 
Z.B. wollte ich Deutsch und Englisch (US) haben, deshalb habe ich en_US.UTF-8 UTF-8 und de_DE.UTF-8 UTF-8 unkommentiert  
> nano /etc/locale.gen

Generieren von Gebietsschemata
> locale-gen

(Optional) Wenn Sie eine Nicht-US-Tastatur verwenden, fügen Sie jetzt Ihre Tastaturbelegung hinzu:
> echo KEYMAP > /etc/vconsole.conf

Verwenden Sie die Keymap von Anfang an, wie de-latin1

Als nächstes installieren Sie einige Software. Wenn Sie bereits pacman-Pakete kennen, die Sie installieren möchten, tun Sie es jetzt. Ich empfehle, zunächst nur das Minimum zu verwenden und dann mit der Installation der Pakete fortzufahren, wenn alles gut funktioniert.

**Minimum**
> pacman -Syu \
> pacman -S wpa_supplicant dhclient lvm2 dialog


**Installation einer Desktop-Umgebung**

Fühlen Sie sich frei, bereits eine Desktop-Umgebung zu installieren, die es Ihnen erlaubt, von allem eine GUI zu haben. 

Installieren Sie einen Display-Manager 
> pacman -S lightdm

Jetzt liegen die Vorteile von Arch in der Wahl Ihrer eigenen Desktop-Umgebung. Für das Aussehen wählen Sie Gnome, aber es wird RAM-hungrig sein, für Effizienz wählen Sie Xfce. 

**Installieren Sie nur eine der folgenden Optionen**

Um GNOME zu installieren:

> pacman -S gnome-gnome-extra

So installieren Sie Cinnamon:

> pacman -S cinnamon nemo-fileroller

So installieren Sie XFCE:

> pacman -S xfce4 xfce4-goodies

Um KDE zu installieren:

> pacman -S plasma

So installieren Sie MATE:

> pacman -S mate mate-extra

### 7. Hinzufügen von Benutzern

Ich empfehle die Verwendung unterschiedlicher Passwörter für den Root- und den Standardbenutzer. 

> useradd -m -G wheel 'BENUTZERNAME'

> passwd 'BENUTZERNAME'

Erstellen Sie ein Passwort für den Root-Benutzer
> passwd 

Sie werden sich mit Ihrem Standardbenutzer anmelden. Wenn Sie administrative Dinge erledigen müssen, können Sie den Benutzer mit "su - root" wechseln. 

### 8. Boot-Konfiguration

Jetzt gibt es eine Menge Bootmanager, aber der System-Bootloader gefiel mir am besten. Fühlen Sie sich frei, einen anderen zu wählen](//wiki.archlinux.org/index.php/Category:Boot_loaders). 

> nano /etc/mkinitcpio.conf

Suchen Sie die Zeile HOOKS und bearbeiten Sie sie entsprechend. Ordnung zählt!

> HOOKS=(base udev autodetect keyboard keymap consolefont modconf block encrypt lvm2 filesystems resume fsck)

Schließen und Speichern der Datei (Strg + X, y)

> mkinitcpio -p linux

> bootctl-install

Bearbeiten Sie Ihre Boot-Einträge

Sie benötigen die Partitions-ID des verschlüsselten Laufwerks. Normalerweise ist dies /dev/sda2, kann aber auch anders lauten. Es wird nicht das erste Laufwerk mit 256 MB sein, da dies die Boot-Partition ist. 

Suchen Sie nach dem Namen und notieren Sie ihn, höchstwahrscheinlich ist es /dev/sda2

> lsblk -lh

Suchen Sie dann nach der UUID-Zeichenfolge in der Ausgabe des folgenden Befehls unter der Geräte-ID /dev/sdX2

> blkid 

Sie können den gleichen Befehl auch mit einem Filter ausprobieren:

> blkid | grep UUID=

Beispiel UUID: 727cac18-044b-4504-87f1-a5aefa774bda


> nano /boot/loader/entries/arch.conf

Fügen Sie Folgendes hinzu:

>title ArchLinux \
>linux /vmlinuz-linux \
>initrd /initramfs-linux.img \
>options cryptdevice=UUID=<YOUR-PARTITION-UUID>:lvm:allow-discards resume=/dev/mapper/datafortress-swap root=/dev/mapper/datafortress-swap root=/dev/mapper/datafortress-root rw quiet

Denken Sie daran, die Datenfestlegung durch die von Ihnen gewählte ID zu ersetzen, wenn Sie sie geändert haben. Andernfalls belassen Sie sie so, wie sie ist.

### 9. Sperren

ERLEDIGT! Jetzt neu starten, den USB-Stick entfernen und hoffen, dass alles funktioniert hat.

> exit
> umount -R /mnt
> reboot

**[Ich empfehle die Einrichtung von LTS-Kernels, da diese stabiler sind, und die Aktualisierung der Spiegelliste. Schauen Sie in meinen Leitfaden zum "Erstellen einer Arch-Linux-Deep-Learning-Station" für weitere Informationen darüber, wie man das macht](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/).**

