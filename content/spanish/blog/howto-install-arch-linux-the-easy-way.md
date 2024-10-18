---
author: Justin Guese
bg_image: images/blog/Archlinux_GNOME_3.2.png
categories:
- Linux
- tutorial
date: '2020-07-06T07:10:46+02:00'
description: Instalar Arch Linux fácilmente con unidades cifradas
image: images/blog/Archlinux_GNOME_3.2.png
tags:
- tutorial
- arch linux
- deep learning
- reinforcement learning
- linux
- encryption
- encypt data at rest
title: Cómo instalar Arch Linux fácilmente con discos encriptados
type: post

---
## Los beneficios de Arch Linux

En mi publicación anterior, ["Cómo: Abandonar Ubuntu a favor de Arch Linux para una estación de trabajo de aprendizaje profundo"](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/), he estado explicando por qué cambié de Ubuntu a Arch Linux para mi estación de trabajo de aprendizaje automático. En resumen, se debe principalmente a la velocidad, ya que Arch está mucho más cerca del hardware y, por lo tanto, es mucho más rápido, a menos bloatware y, por lo tanto, a un menor uso de RAM, lo que necesito para el aprendizaje automático, y a los increíbles paquetes pacman y AUR que son rápidos y fáciles de instalar.

En Ubuntu, por ejemplo, es bastante difícil hacer que TensorFlow y CUDA funcionen para el aprendizaje profundo, ya que la estructura del paquete Debian es diferente y la instalación es más lenta en comparación con Arch. En Arch, las dependencias se gestionan adecuadamente y los paquetes no están tan abstraídos, ya que Arch es básicamente el propio núcleo Linux "puro".

Además, los paquetes se lanzan mucho más rápido, y se dice que la ArchWiki es la documentación más completa que existe para un sistema operativo.

El lema de Arch se puede describir como "Personaliza todo y sé lo más rápido posible", mientras que el lema de Ubuntu sería "Hacer la instalación y el uso lo más sencillo posible para los nuevos usuarios". Ahora bien, no estoy diciendo que Ubuntu sea malo, porque la comunidad es enorme y es la distribución perfecta para comenzar tu viaje al mundo de Linux, pero una vez que estés más familiarizado con Linux y necesites más velocidad, Arch podría ser el mejor paso siguiente.

Al menos estoy satisfecho con Arch, ya que es mucho más rápido que todo lo que he visto antes y puedo personalizarlo todo.

He estado pensando en proporcionar un ISO o IMG para mi configuración de aprendizaje profundo para una instalación fácil. Si estás interesado, por favor, comenta o envíame un mensaje.

Además, si te da igual una ligera capa de abstracción, [Manjaro Arch](//manjaro.org/) podría ser una buena opción para ti. Básicamente es Arch, pero simplificado y fácil de usar. Me gustó mucho, pero cambié a Arch porque Manjaro utiliza sus propios paquetes, que siguen siendo buenos, pero no son los mismos que los paquetes "puros" de Arch. Si no eres un usuario avanzado, esta podría ser la opción para ti.

## Cómo instalar Arch Linux de forma fácil

Aunque la [guía introductoria](//wiki.archlinux.org/index.php/installation_guide) proporcionada por Arch ya es bastante buena, puede resultar confusa para los principiantes. Por eso he decidido escribir mi propio tutorial.

Mi objetivo ha sido instalar Arch con unidades cifradas, ya que necesito proteger los datos en reposo para mis clientes.

### 1. Descarga de la imagen de Arch Linux

Dirígete a https://www.archlinux.org/download/ y descarga la imagen.

Grábalo en una memoria USB. Por ejemplo (pero puedes usar tu propio programa) para:

Linux:
> dd if=ISOFILE of=/dev/sdX status=progress

Donde sdX es tu memoria USB. Compruébalo con "lsblk".

Windows/Mac:
Me gustó usar Etcher https://www.balena.io/etcher/

Inicia desde la memoria USB utilizando el menú de arranque (F11, F12 en la mayoría de los casos).

### 2. Primera configuración en ISO en vivo

Una vez que estés en el ISO en vivo de Arch, deberías ver la línea de comandos básica de Arch.

**¿No tienes un teclado estadounidense?** Carga tus claves con:
> loadkeys KEYMAP

Donde Keymap es tu configuración regional. Obtén tu configuración regional con:

> localectl list-keymaps | grep -i SEARCHTERM

Por ejemplo, usar el comando anterior con SEARCHTERM = Alemania devuelve de-latin1, para el cual el comando loadkeys es:
> loadkeys de-latin1


(Opcional) Si no tienes conexión Ethernet, es posible que tengas que conectarte a tu WiFi con los siguientes comandos. Reemplaza WIFINETWORK y WIFIPASSWORD con tu nombre y contraseña de WiFi.

> wpa_passphrase 'WIFINETWORK’ 'WIFIPASSWORD' >> /etc/wpa_supplicant/wpa_supplicant.conf \
> wpa_supplicant -Bc /etc/wpa_supplicant/wpa_supplicant.conf -i 'wlan0' \
Si el segundo comando no funciona, el nombre de tu dispositivo WiFi podría ser diferente. Puedes comprobarlo con "ifconfig".
> dhclient

Comprueba tu conexión con curl de un sitio web. Si la respuesta parece HTML, estás conectado; si dice algo como "404", "se agotó el tiempo" o "sin conexión", repite los pasos anteriores y comprueba si hay errores tipográficos.
> curl www.datafortress.cloud

### 2. Particionamiento de las unidades

Este es el paso más difícil, ¡así que una vez que lo hayas finalizado, casi has terminado! Elegí la versión más avanzada, donde el disco se cifra completamente para una mayor seguridad, pero puedes usar el "[método estándar](//wiki.archlinux.org/index.php/Partitioning)" en su lugar.

Esta guía asume que planeas borrar todo el disco. Asegúrate de que todos los datos estén respaldados. Por supuesto, también es posible un arranque dual con Windows, pero lo explicaré en otra guía.

El plan es tener dos particiones:
Primera partición: Unidad de arranque EFI, que indica a tu PC cómo arrancar en Arch.
Segunda partición: Unidad cifrada completamente con unidades "sub"-contenedoras que contienen el archivo de intercambio, la carpeta raíz y una unidad /home independiente para seguridad.
¿Por qué tres particiones en la segunda unidad? Digamos que arruinas la instalación de la raíz. En ese caso, la carpeta de inicio con tus documentos, configuraciones, etc., estará en una partición independiente y se podrá reutilizar fácilmente en una nueva instalación. Esto significa que podrías instalar una nueva instalación de Arch en la partición raíz y simplemente "reutilizar" tu carpeta de inicio. Genial.

#### Paso 1: Obtén el nombre de tu unidad

> lsblk -lh

Esto muestra todas las unidades conectadas. Normalmente, tu unidad principal debería ser /dev/sda y tu memoria USB /dev/sdb.


**Comprueba si sda es realmente tu unidad principal de acuerdo con la capacidad de almacenamiento de GB y todo. Si simplemente copias y pegas los siguientes comandos con sda, ¡podrías borrar la unidad equivocada!**
Por eso, en los siguientes párrafos usaré sdX como nombre de dispositivo, pero reemplaza la X con tu número de dispositivo (a, b, c, ...). Algunas unidades tienen nombres diferentes, solo compara y reemplaza según corresponda.

#### Paso 2: Particionamiento

Inicia gdisk

> gdisk /dev/sdX

Configuración de unidad EFI
1. Escribe ‘o’ para crear una tabla de particiones.
2. Escribe ‘n’ para una nueva partición.
3. Introduce
4. Introduce
5. +256M
6. EF00
Esto creará una partición de 256 MB con el formato EFI que necesitamos para arrancar.

Configuración de unidad Arch cifrada
1. Escribe ‘n’ para crear una nueva partición.
2. Introduce
3. Introduce
4. Introduce
5. 8309

Comprueba si todo parece correcto pulsando ‘p’. Debería parecer así:

>Número  Inicio (sector)    Fin (sector)  Tamaño    Código  Nombre \
>   1            2048         1050623   256.0 MiB   EF00  Sistema EFI \
>   2         1050624       242187466   115.0 GiB   8309  Linux LUKS

¿Todo correcto? Pulsa ‘w’ para grabar los cambios en el disco.

### 3. Crea los sistemas de archivos cifrados

Las particiones están vacías ahora. A continuación, crearemos los sistemas de archivos y las particiones "sub"-cifradas. Recuerda reemplazar la X con tu número de unidad (normalmente a).
> cryptsetup luksFormat /dev/sdX2 \
> cryptsetup open /dev/sdX2 cryptlvm \
> pvcreate /dev/mapper/cryptlvm \
> vgcreate datafortress /dev/mapper/cryptlvm


Siéntete libre de reemplazar los siguientes tamaños de disco delante de la "G" (Gigabyte) con el tamaño que desees. Para el aprendizaje profundo, el intercambio debería ser de 32 GB, para otros casos, aproximadamente el tamaño de tu RAM. Recomiendo que el sistema raíz sea de 40 GB, pero el mínimo debería ser de 10 GB.
Puedes reemplazar datafortress con cualquier nombre, o dejarlo como está para ser el guay.
> lvcreate -L 16G datafortress -n swap \
> lvcreate -L 40G datafortress -n root \
> lvcreate -l +100%FREE datafortress -n home


Crea los sistemas de archivos

> mkfs.vat -F32 /dev/sdX1 \
> mkfs.ext4 /dev/mapper/datafortress-root \
> mkfs.ext4 /dev/mapper/datafortress-home \
> mkswap /dev/mapper/datafortress-swap


Móntelos

> mount /dev/mapper/datafortress-root /mnt \
> mkdir /mnt/home \
> mkdir /mnt/boot \
> mount /dev/mapper/datafortress-home /mnt/home \
> mount /dev/sdX1 /mnt/boot \
> swapon /dev/mapper/datafortress-swap

### 4. Instala el sistema Linux básico

Antes de instalarlo, se recomienda actualizar tu lista de espejos para que los paquetes se descarguen de los espejos más cercanos. [Visita mi otro artículo y busca "reflector" para obtener instrucciones sobre cómo hacerlo](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/).

> pacstrap /mnt base base-devel linux linux-firmware nano

### 5. Instala fstab

Fstab es básicamente una instrucción sobre cómo montar tus unidades. Copia y pega la que tienes por ahora.

> genfstab -U /mnt >> /mnt/etc/fstab

### 6. Últimos retoques

Vamos a realizar una chroot en nuestro montaje, que es básicamente como ejecutar sudo en nuestro sistema.

> arch-chroot /mnt \
> ln -s /usr/share/zoneinfo/REGION/CITY /etc/localtime

Donde Región es tu región (usa la tecla Tab para ver las opciones si escribes /usr/…/zoneinfo/, como Europa, y CIUDAD tu ciudad, como Viena).

> hwclock --systohc


Configura tu nombre de host. La parte divertida de instalar Arch es que puedes hacer cosas que Ubuntu y otros hacen por ti. Configura el nombre de host de tu dispositivo, por ejemplo, si vas a conectarte a tu dispositivo mediante SSH más tarde, no tendrás que escribir la IP, sino que podrás usar este nombre en su lugar. Por ejemplo, "ssh usuario@miel" podría ser mucho más fácil de recordar que 192.168.0.231.

> echo NOMBRE > /etc/hostname

A continuación, configuraremos nuestra configuración regional, básicamente el idioma del sistema. Abre el archivo con nano y busca tu código de idioma. Usa la versión UTF-8 si es posible. La búsqueda con nano es posible usando Ctrl+W. [Tutorial de Nano](//www.howtogeek.com/howto/42980/the-beginners-guide-to-nano-the-linux-command-line-text-editor/).
Por ejemplo, quería tener alemán e inglés (EE. UU.). Por eso descomenté en_US.UTF-8 UTF-8 y de_DE.UTF-8 UTF-8.
> nano /etc/locale.gen

Genera las configuraciones regionales
> locale-gen

(Opcional) Ahora, si usas un teclado no estadounidense, añade tu mapa de teclas:

> echo KEYMAP > /etc/vconsole.conf

Usa el mapa de teclas desde el principio, como de-latin1.

A continuación, instala algo de software. Si ya conoces los paquetes pacman que quieres instalar, hazlo ahora. Te recomiendo que primero uses los mínimos y luego continúes con la instalación de paquetes si todo funciona correctamente.

**Mínimo**
> pacman -Syu \
> pacman -S wpa_supplicant dhclient lvm2 dialog

**Instalación de un entorno de escritorio**
Siéntete libre de instalar un entorno de escritorio ya, lo que te permitirá tener una interfaz gráfica de todo.

Instala un gestor de pantalla
> pacman -S lightdm

Ahora, los beneficios de Arch son elegir tu propio entorno de escritorio. Para el aspecto, elige GNOME, pero será intensivo en RAM; para la eficiencia, elige XFCE.

**Instala SOLO UNO de los siguientes:**

Para instalar GNOME:

> pacman -S gnome gnome-extra

Para instalar Cinnamon:

> pacman -S cinnamon nemo-fileroller

Para instalar XFCE:

> pacman -S xfce4 xfce4-goodies

Para instalar KDE:

> pacman -S plasma

Para instalar MATE:

> pacman -S mate mate-extra


### 7. Adición de usuarios

Te recomiendo que utilices contraseñas diferentes para la raíz y el usuario predeterminado.

> useradd -m -G wheel ‘NOMBRE_USUARIO’ \
> passwd ‘NOMBRE_USUARIO’


Crea una contraseña para el usuario root

> passwd

Iniciarás sesión con tu usuario predeterminado. Si necesitas realizar tareas administrativas, puedes cambiar de usuario con "su - root".

### 8. Configuración de arranque

Ahora hay muchos gestores de arranque, pero me gustó el gestor de arranque systemd más. [Siéntete libre de elegir otro](//wiki.archlinux.org/index.php/Category:Boot_loaders).

> nano /etc/mkinitcpio.conf

Busca la línea HOOKS y edítala según corresponda. ¡El orden importa!

> HOOKS=(base udev autodetect teclado mapa_teclado consolafuente modconf bloque cifrado lvm2 sistemas_de_archivos reanudar fsck)

Ciérrala y guarda el archivo (Ctrl+X, y).

> mkinitcpio -p linux \
> bootctl install

Edita tus entradas de arranque

Necesitarás el identificador de partición de la unidad cifrada. Normalmente será /dev/sda2, pero puede ser diferente. No será la primera unidad de 256 MB, ya que esta es la partición de arranque.

Busca el nombre y anótalo, probablemente sea /dev/sda2.

> lsblk -lh

Luego busca la cadena UUID en la salida del siguiente comando en el identificador de dispositivo /dev/sdX2.

> blkid

También puedes probar el mismo comando con un filtro:

> blkid | grep UUID=

Ejemplo de UUID: 727cac18-044b-4504-87f1-a5aefa774bda


> nano /boot/loader/entries/arch.conf
Agrega lo siguiente:

>title	ArchLinux \
>linux	/vmlinuz-linux \
>initrd	/initramfs-linux.img \
>options cryptdevice=UUID=<TU-UUID-DE-PARTICION>:lvm:allow-discards resume=/dev/mapper/datafortress-swap root=/dev/mapper/datafortress-root rw quiet

Recuerda reemplazar datafortress por el ID que elegiste si lo cambiaste. De lo contrario, déjalo como está.

### 9. Bloqueo

¡HECHO! Ahora reinicia, retira la memoria USB y espera a que todo funcione.

> exit \
> umount -R /mnt \
> reboot

**[Te recomiendo configurar núcleos LTS, ya que son más estables, y actualiza la lista de espejos. Consulta mi guía sobre "Creación de una estación de trabajo de aprendizaje profundo de Arch Linux" para obtener más información sobre cómo hacerlo](//www.datafortress.cloud/blog/howto-arch-linux-deeplearning-workstation/).**
