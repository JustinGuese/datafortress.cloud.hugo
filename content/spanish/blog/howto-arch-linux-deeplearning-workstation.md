---
author: Justin Guese
categories:
- Grandes datos
- Tutorial
date: '2020-08-18T10:07:21+06:00'
description: Dejando Ubuntu a un lado por Arch Linux para una estación de trabajo
  de aprendizaje profundo
image: images/blog/deeplearningarch.png
tags:
- big data
- tutorial
- arch linux
- deep learning
- reinforcement learning
- tensorflow
- machine learning
title: Cómo - Abandonar Ubuntu a favor de Arch Linux para una estación de trabajo
  de aprendizaje profundo

---
## ¿Por qué debería abandonar Ubuntu?

Muchos de ustedes podrían estar usando Ubuntu para sus estaciones de trabajo, y eso está bien para los usuarios menos experimentados. Sin embargo, uno de los problemas que tuve con Ubuntu y TensorFlow/CUDA fue la dificultad para gestionar los diferentes controladores y versiones de CUDA, cuDNN, TensorFlow, etc. No estoy seguro de ustedes, pero una vez que tenía un entorno de TensorFlow 1.15 o 2.0 funcional, generalmente no lo tocaba más por miedo a arruinar esta configuración sagrada.

Al trabajar con diferentes programas, sería útil tener una forma de cambiar entre las dos versiones más utilizadas de TensorFlow, 1.15 y 2.0, como se puede hacer con Google Colab con un solo comando, pero instalar una versión diferente de TensorFlow generalmente volvía a estropear mi sistema.

Además, Arch siempre ha estado en mi lista de tareas pendientes, ya que es la distribución Linux más "básica" que puedes obtener, lo que significa que estás trabajando mucho más cerca del hardware en comparación con abstracciones de nivel superior como Ubuntu. En sus propias palabras, Ubuntu está diseñado para "funcionar desde la caja y facilitar el proceso de instalación para los nuevos usuarios", mientras que el lema de Arch Linux es "personaliza todo".
Al estar mucho más cerca del hardware, Arch es increíblemente más rápido que Ubuntu (y mucho más rápido que Windows), a costa de un mayor uso del terminal.

En las últimas semanas, al usar Arch, el uso de RAM generalmente se ha reducido a la mitad en comparación con Ubuntu, e instalar paquetes de aprendizaje automático es muy sencillo. Puedo tener TensorFlow 1.15 y 2.0 funcionando juntos, cambiando las versiones con entornos de Anaconda. Además, el sistema funciona bastante estable, ya que estoy usando los núcleos LTS (de soporte a largo plazo) de Linux, y generalmente las actualizaciones de los famosos paquetes AUR (creados por usuarios en Arch) salen un mes antes que los paquetes Debian (Ubuntu).

En resumen, solo puedo recomendar la configuración de una estación de aprendizaje profundo con Arch Linux, ya que es:
1. Más rápido, como la instalación de paquetes es súper rápida, el aprendizaje profundo está potenciado,...
2. Más estable
3. Más fácil cambiar entre versiones de TensorFlow
en comparación con Ubuntu.


Dividiré la guía en dos partes: la primera, "Cómo instalar Arch Linux", y la segunda, "Cómo instalar los paquetes de la estación de aprendizaje profundo".

Para la guía general de "[Cómo instalar Arch Linux", consulta este artículo](//www.datafortress.cloud/blog/howto-install-arch-linux-the-easy-way/).

Si Arch te resulta demasiado complejo por ahora, puedes probar [Manjaro](//manjaro.org/), que es una versión fácil de usar de Arch, aunque no puedo garantizar que todos los paquetes funcionen igual, ya que son ligeramente diferentes. Sin embargo, en general deberían funcionar igual.

Estaba pensando en crear una imagen lista para instalar (iso o img), ¡si suficientes personas están interesadas, dejen un comentario a continuación o envíenme un mensaje!

## Instalación de la configuración de aprendizaje profundo (TensorFlow, CUDA, cuDNN, Anaconda) en una nueva instalación de Arch Linux
Una vez que hayas [finalizado la instalación de Arch Linux (¡uf!)](//www.datafortress.cloud/blog/howto-install-arch-linux-the-easy-way/), primero cambiemos algunas configuraciones para que nuestro sistema funcione de forma más estable.

### 1. Cambiar a los espejos más rápidos

El software se descarga de los llamados "espejos", que son servidores que contienen todas las bibliotecas de Arch. Si no se hace automáticamente, puede ocurrir que tus servidores aún no estén optimizados. Por lo tanto, vamos a instalar una pequeña herramienta que encuentra y guarda los servidores más rápidos llamada "reflector".

Instala reflector usando

> sudo pacman -S reflector

Encuentra y descarga los mejores servidores

> reflector --verbose -l 20 -n 20 --sort rate --save /etc/pacman.d/mirrorlist

Revisa la salida para ver si tiene sentido, por ejemplo, si los dominios están cerca de tu ubicación. Si no, puedes agregar la etiqueta del país para obtener resultados más precisos, por ejemplo, para Alemania y Austria:

> reflector -c “AT,DE” --verbose -l 20 -n 20 --sort rate --save /etc/pacman.d/mirrorlist

Actualiza tu instalación

> sudo pacman -Syyu


### 2. Cambiar el entorno de escritorio

Si estás usando Manjaro o elegiste el entorno de escritorio "Gnome" como el que conoces de Ubuntu, podría valer la pena considerarlo ya que Gnome se conoce por consumir más RAM que Chrome, y definitivamente necesitamos RAM en nuestra configuración de aprendizaje profundo.

Si te gusta Gnome, puedes omitir este paso. De lo contrario, puedo recomendar el escritorio Xfce, ya que es una buena combinación de ligereza y funcionalidades.

Descarga Xfce

> sudo pacman -S xfce4 xfce4-goodies lxdm

Lxdm es un gestor de pantalla que permite usar varios escritorios.

Cierra la sesión actual y presiona Alt + F2 (o Alt + F3 si no funciona) para abrir una terminal. Primero desactiva Gnome y luego "activa" Xfce:

Desactiva e instala Gnome:

> sudo systemctl disable gdm
> sudo pacman -R gnome gnome-extras

Activa Xfce

> sudo systemctl enable lxdm
> sudo systemctl start lxdm

Si el nuevo escritorio Xfce no se abre, inicia sesión y explora, si no, intenta reiniciar (sudo reboot). Si eso no ayuda, puedes empezar a gritar y darte golpes, y luego enviarme un mensaje o un comentario.

### 3. Instalación de los núcleos Linux LTS (soporte a largo plazo) para una mayor estabilidad

Arch es famoso por estar muy cerca de los núcleos Linux actuales, lo que es bueno si siempre deseas los paquetes y características de Linux más recientes, pero es una mala idea si estás construyendo una estación de trabajo de aprendizaje profundo.

Por eso cambié a los núcleos LTS, que son básicamente núcleos que reciben más soporte y son más estables que las versiones más recientes del núcleo Linux.

Afortunadamente, cambiar de núcleos es muy fácil en Arch. Primero descargamos los núcleos LTS y luego le indicamos a nuestro gestor de arranque qué núcleo elegir.

Primero descarga los núcleos LTS:

> sudo pacman -S linux-lts linux-lts-headers

Consulta las versiones actuales de tu núcleo:

> ls -lsha /boot

Un núcleo debería llamarse vmlinuz-linux.img e initramfs-linux.img (tus versiones actuales) y los LTS con -lts al final.

Si ves dos núcleos, puedes proceder a eliminar los núcleos antiguos:

> sudo pacman -R linux

Ahora, una parte más avanzada es que deberás indicarle a tu gestor de arranque qué núcleo elegir. La pregunta es qué gestor de arranque estás usando, pero en la mayoría de los casos es Grub. Si seguiste mi tutorial de instalación de Arch, tu gestor de arranque es systemd-boot.

Mi recomendación es probar las instrucciones de Grub, y si no funcionan, pasa a los demás.


#### Cambiar el gestor de arranque Grub para los núcleos Linux LTS

> grub-mkconfig -o /boot/grub/grub.cfg

Si ves un error, pasa al siguiente gestor de arranque; de lo contrario, reinicia (sudo reboot).

#### Cambiar el gestor de arranque syslinux para los núcleos Linux LTS

Edita el archivo de configuración:

> sudo nano /boot/syslinux/syslinux.cfg

Simplemente agrega "-lts" a vmlinuz-linux.img e initramfs-linux.img, de modo que sean vmlinuz-linux-lts.img e initramfs-linux-lts.img.

#### Cambiar el gestor de arranque systemd-boot para los núcleos Linux LTS

Si vienes de mi guía de instalación de Arch, este es tu gestor de arranque.

Edita el archivo de configuración:

> sudo nano /boot/loader/entries/arch.conf

Simplemente agrega "-lts" a vmlinuz-linux.img e initramfs-linux.img, de modo que sean vmlinuz-linux-lts.img e initramfs-linux-lts.img.


### 4. Instalación de yay, una forma sencilla de instalar paquetes AUR

Debes preferir usar pacman súper rápido para instalar la mayoría de los paquetes, pero algo genial de Arch es que los usuarios crean millones de paquetes personalizados que son súper fáciles de instalar. Básicamente puedes encontrar cualquier programa que puedas imaginar en este repositorio.

Instala git SVC

> sudo pacman -S git
> mkdir ~/tmp
> git clone https://aur.archlinux.org/yay-git.git ~/tmp/yay
> cd ~/tmp/yay
> makepkg -si

Ahora puedes explorar todos los maravillosos paquetes AUR en https://aur.archlinux.org/packages/ o puedes simplemente proceder e ingresar:

> yay -S [PAQUETE]

Para instalarlo.

### 5. Finalmente, la verdadera instalación de CUDA, cuDNN, Anaconda que ejecuta TensorFlow 1.15 y 2.0

Instala los controladores Nvidia, CUDA, cuDNN con un simple comando

> sudo pacman -S nvidia nvidia-utils cuda cudnn

Esto tomará algún tiempo, así que toma un café o continúa con los siguientes pasos.

Descarga Anaconda, me gusta Miniconda:

> wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh ~/

Hazlo ejecutable e instala

> cd ~/
> chmod +x ./Miniconda*.sh
> ./Miniconda*.sh

Solo deja todo como predeterminado.

> source ./bashrc

Reinicia tu sistema

> sudo reboot

Instala TensorFlow

Ahora es el momento de decidir entre TensorFlow para CPU o GPU. Continuaré con la opción de GPU, pero si deseas ejecutar la versión para CPU, simplemente elimina "-gpu" del nombre del paquete.


##### Crea un entorno de Anaconda para TensorFlow 2.0

> conda create --name tf2.0
> conda activate tf2.0
> conda install pip
> conda install tensorflow-gpu pandas numpy

¡Listo! Ahora verifica el resultado con:

> python
> from tensorflow.python.client import device_lib
> device_lib.list_local_devices()

¡Si el resultado muestra un nombre de dispositivo como este, has terminado!

2018-05-01 05:25:25.929575: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1356] Found device 0 with properties:
name: GeForce GTX 3080 10GB major: …

##### Crea un entorno de Anaconda para TensorFlow 1.15

> conda deactivate
> conda create --name tf1.15
> conda activate tf1.15
> conda install pip python==3.7
> conda install tensorflow-gpu==1.15

Y nuevamente, verifica si todo funciona y si tu GPU es reconocida:

> python
> from tensorflow.python.client import device_lib
> device_lib.list_local_devices()


### 6. ¡Cambiar entre TensorFlow 1.15 y TensorFlow 2.0 en un solo dispositivo!

Un sueño hecho realidad, en mi opinión, simplemente selecciona la versión 1.15 con
> conda activate tf1.15

Y la versión TensorFlow 2.0 con
> conda activate tf2.0
