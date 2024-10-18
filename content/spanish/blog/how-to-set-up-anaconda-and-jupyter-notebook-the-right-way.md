---
author: Justin Guese
bg_image: /images/jupyter.png
categories:
- tutorial
date: '2022-01-24T23:00:00+00:00'
description: 'Si Anaconda (conda) y Jupyter Notebook (Jupyter Lab) están configurados
  correctamente, la combinación puede convertirse en el equipo perfecto, permitiéndote
  cambiar fácilmente entre entornos de Deep Learning de conda.  ¿Algunos programas
  requieren TensorFlow 1.15 y otros TensorFlow 2.0? ¡No hay problema! Simplemente
  cambia de entorno y versiones de TensorFlow con un solo clic.

  '
image: /images/jupyter.png
tags:
- deep learning
- tutorial
- anaconda
- jupyter notebook
title: Cómo configurar Anaconda y Jupyter Notebook correctamente
type: post

---
Si Anaconda (conda) y Jupyter Notebook (Jupyter Lab) están configurados correctamente, la combinación puede convertirse en el equipo perfecto, donde puedes cambiar fácilmente entre entornos conda de aprendizaje profundo.

¿Algunos programas requieren TensorFlow 1.15, otros TensorFlow 2.0? ¡No hay problema! Simplemente cambia los entornos y las versiones de TensorFlow con un simple clic.

¿Alguna vez instalaste extensiones de Jupyter Notebook en cada entorno conda? ¡No te preocupes más, las instalaremos una vez y estarán disponibles en cada entorno!


1. Instalar Anaconda o Miniconda
2. Instalar Jupyter Notebook/Lab en el entorno base
3. Instalar un nuevo entorno
4. Activar el entorno para Jupyter Notebook

# ¿Cómo instalar Anaconda o Miniconda?

Anaconda es un buen paquete que contiene muchos paquetes de Python ya instalados y permite un inicio fácil en el mundo de Python. Además, permite crear entornos de Python que contienen diferentes versiones de tus paquetes de Python. Por ejemplo, si un programa solo funciona con Python 2.7 o versiones anteriores de Matplotlib, puedes crear un espacio de trabajo propio para este programa y volver a Python 3 con un clic de botón. Además, cambiar entre TensorFlow 2.0 y TensorFlow 1.15 también se vuelve fácil, lo que finalmente te permite cambiar entre versiones fácilmente (lo cual puede ser bastante problemático de otra manera).

Miniconda es una versión básica de Anaconda y puede ser útil si, por ejemplo, trabajas en un servidor donde el espacio en disco es limitado.

Para instalar Anaconda o Miniconda, visita su sitio web ([https://www.anaconda.com/products/individual#Downloads](https://www.anaconda.com/products/individual#Downloads "https://www.anaconda.com/products/individual#Downloads")), o si usas Linux, copia los siguientes comandos.

El primer enlace busca en el sitio web la versión más reciente y la escribe en la variable LATEST_ANACONDA.

```
cd ~/Downloads
LATEST_ANACONDA=$(wget -O - https://www.anaconda.com/distribution/ 2>/dev/null | sed -ne 's@.*\(https:\/\/repo\.anaconda\.com\/archive\/Anaconda3-.*-Linux-x86_64\.sh\)\">64-Bit (x86) Installer.*@\1@p')
wget $LATEST_ANACONDA
chmod +x Anaconda3*.sh # hazlo ejecutable
./Anaconda3*.sh # ejecuta el instalador
```

Sigue el diálogo y acepta los valores predeterminados.

### Verificando y cambiando los entornos conda

Si conda está instalado correctamente (puede que necesites cerrar sesión e iniciar sesión de nuevo, o reiniciar), deberías ver la salida al escribir `conda` en tu terminal.

Para listar los entornos instalados actualmente, escribe `conda env list`

Actualmente, solo debería mostrar el entorno "base" instalado.

Cambiar entre entornos funciona tan sencillamente como escribir `conda activate [NOMBRE]` y, si lo haces, desactivarlo (y volver al entorno base) con `conda deactivate`.

El entorno base se activa de forma predeterminada.

# Instalar Jupyter Notebook/Lab en el entorno base

Jupyter Notebook se puede instalar fácilmente usando conda. Nuestro plan es instalarlo solo en el entorno base y luego cambiar entre entornos secundarios para evitar configurar Jupyter Lab en cada entorno.

## Instalar Jupyter Notebook (predeterminado)

```
conda install -c conda-forge notebook
conda install -c conda-forge nb_conda_kernels
```

## Instalar Jupyter Lab

```
conda install -c conda-forge jupyterlab
conda install -c conda-forge nb_conda_kernels
```

## Instalar extensiones de Jupyter Notebook

Me gustan mucho las extensiones de Jupyter Notebook, que ofrecen mucha autocompleción, información adicional y, en general, cosas que facilitan la vida. Una buena configuración predeterminada se incluye con el siguiente comando de instalación:

```
conda install -c conda-forge jupyter_contrib_nbextensions
```

Una buena descripción general de otras extensiones: [https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231](https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231 "https://towardsdatascience.com/jupyter-notebook-extensions-517fa69d2231")

### (Opcional) Instalar el gestor de paquetes pip

En mi opinión, es buena idea agregar el gestor de paquetes pip al entorno base (y a cada entorno secundario), ya que no todos los paquetes son compatibles con `conda install`. Además, si pip no está instalado en cada entorno secundario, el paquete podría instalarse solo en el entorno conda "base", lo que causaría un error donde el paquete no se encuentra en tu entorno secundario.

```
conda install pip
```

# Creando entornos en conda y Jupyter Notebook

Digamos que quieres instalar tanto TensorFlow 2.0 como TensorFlow 1.15 en Jupyter Notebook.

Para este ejemplo, primero, decide si quieres usar la versión de GPU o CPU de TensorFlow. Para usar la versión de GPU, agrega "-gpu" a TensorFlow; de lo contrario, déjalo como está.

Para crear un nuevo entorno conda, podemos ejecutar:

`conda create --name tf-2.0`

Si ya planeas instalar algunos paquetes con él, solo agrégalos al final, como:

```
conda create -n tf-2.0 tensorflow-gpu pip ipykernel
```

Recomiendo instalar `pip` para la instalación de paquetes, y `ipykernel` será necesario para cambiar entre entornos usando Jupyter Notebook.

Para instalar un entorno con TensorFlow 1.15, usa lo siguiente:

```
conda create -n tf-1.15 tensorflow-gpu==1.15 pip ipykernel
```

Si se realiza correctamente, deberías ver tres entornos al ejecutar el siguiente comando:

```
conda env list
```

1. base
2. tf-2.0
3. tf-1.15

# Iniciar Jupyter Notebook y verificar los entornos y las extensiones

```
jupyter notebook
```

Al ejecutar Jupyter Notebook en el entorno base, deberías ver una pestaña que contiene "Extensiones", así como "conda"/"entornos". Ve a Extensiones y activa las extensiones que desees, y si estás listo, crea un nuevo cuaderno usando el botón "nuevo". Aquí deberías poder elegir entre tu entorno base, tf-2.0 y tf-1.15.

Atención: Siempre necesitas ejecutar jupyter notebook en el entorno base. Ejecuta `conda deactivate` para salir del entorno actual y volver al base.

Si necesitas instalar más paquetes, activa un entorno usando `conda activate [NOMBRE]`, ejecuta tus comandos como `conda install X` o `pip install X`, y abandona el entorno usando `conda deactivate`.

¡Dime si esto te funcionó, me ayudó mucho y desearía haberlo sabido antes!
