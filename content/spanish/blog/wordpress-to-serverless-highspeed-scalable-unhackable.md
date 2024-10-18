---
author: Justin Guese
bg_image: images/blog/serverless-website.png
categories:
- sin servidor
date: '2022-06-17T11:10:07+06:00'
description: 'Elegí dejar WordPress atrás y pasar a sitios web estáticos sin servidor,
  de alta velocidad e inhackeables.

  '
image: images/blog/serverless-website.png
tags:
- cloud
- websites
- serverless
title: 'Pasando de WordPress a sitios web estáticos, sin servidor, de alta velocidad
  e inhackeables.

  '
type: post

---
He construido sitios web en el pasado, pero siempre he tenido problemas con el rendimiento lento de WordPress. Si está cargado con plugins, necesitará bastantes recursos y puede ser un problema si solo está desarrollando una idea en un servidor pequeño.


Además, la seguridad también es una preocupación, y como es un sistema que [el 33,6% de los sitios web utilizan](https://es.wikipedia.org/wiki/WordPress), es bastante atractivo para los hackers encontrar exploits y otros problemas en él.
Pero, de nuevo, como es muy popular, casi siempre hay un plugin para los problemas que tienes, lo que lo hace fácil de usar y una gran herramienta "todo en uno".




## Idea 1: Mejorando el Desarrollo de WordPress



Una de las primeras cosas que hice en el pasado fue desarrollar WordPress localmente (por ejemplo, [consulta esta publicación de AWS](https://www.smashingmagazine.com/2018/04/wordpress-local-development-beginners-setup-deployment/)), y luego publicar el resultado en un servidor. Las velocidades de programación y escritura aumentaron enormemente, pero la parte de carga resultó ser un problema, ya que los enlaces de WordPress suelen estar "cableados" en la base de datos SQL que utiliza. Esto significa que todos mis enlaces hacían referencia a "https://www.datafotress.cloud" (Mi ordenador) en lugar del dominio de destino. Hay formas de solucionar esto, como reescribir las URL en SQL o usar reglas de reescritura .htaccess para referenciar las URL "antiguas" a las "nuevas", pero aun así, fue una gran lucha para comenzar.




## Idea 2: Desarrollo en línea con archivos multimedia descargados



Este problema de reescritura de URL me molestó rápidamente, y el desarrollo local es malo para múltiples desarrolladores. Por eso decidí "volver al online" y trabajar "con la nube". La arquitectura que seguí fue desplegar un servidor de desarrollo, al que solo tienen acceso los desarrolladores, y subir los archivos multimedia a un almacenamiento compartido (AWS S3) desde el que los usuarios finales extraen los archivos multimedia. Dado que los archivos multimedia (imágenes, vídeos, ...) son las partes más exigentes de WordPress, la velocidad aumentó drásticamente, y además, ha sido fácil configurar una CDN encima, lo que básicamente significa que los archivos multimedia se despliegan en todo el mundo con capacidad ilimitada (básicamente sin servidor). Esto significa que un usuario, por ejemplo, en Puerto Rico, no necesita acceder a mi servidor en Frankfurt, sino que tiene una copia "local" cerca de él. Además, como la parte "pesada" de WordPress ha sido "subcontratada", solo se necesitaban servidores "pequeños" para gestionar las solicitudes PHP y las partes de "oficina" de WordPress. No dudes en preguntarme más al respecto en los comentarios o un mensaje directo, o [consultar un enfoque similar de AWS](https://devops.com/hosting-scalable-wordpress-on-aws/).

![Arquitectura para WordPress en AWS](/images/blog/Webp.net-resizeimage.png)

Junto con Autoscaling, este parecía ser el conjunto de configuraciones más ideal para WordPress, y demostró ser excelente. PERO...


Aún tenías que verificar las actualizaciones de plugins, la seguridad y la supervisión en general. Aunque AWS ayuda mucho a que esta arquitectura sea bastante resistente y rápida, todavía hay una gran demanda operativa. Además, ejecutar un servidor de desarrollo separado, una base de datos, equilibrio de carga, etc., puede resultar bastante costoso, especialmente para un sitio web que no tiene muchos usuarios.
¿Y qué dijo Werner Vogels en re:invent 2015?

> **"No hay servidor más fácil de gestionar que ningún servidor"**
> 
> Werner Vogels en re:invent 2015


## Excursión: Una breve historia del código web




WordPress es excelente para escritores y editores, pero desde la perspectiva de un arquitecto de soluciones no es excelente. ¿Por qué? Aunque todo es con clics, fácil de manejar, y así sucesivamente, todos los recursos e información se extraen de una base de datos en segundo plano, incluso si se extrae por la 100000ª vez ese día. Hay métodos para reducir la carga de consultas en las bases de datos SQL, como Redis y Memcached, pero ¿por qué debería "calcular" la misma página web para cada usuario? En "la época dorada", los sitios web se cargaban en segundos (excepto si