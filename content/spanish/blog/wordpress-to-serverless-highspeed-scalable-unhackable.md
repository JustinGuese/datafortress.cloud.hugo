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




WordPress es excelente para escritores y editores, pero desde la perspectiva de un arquitecto de soluciones no es excelente. ¿Por qué? Aunque todo es con clics, fácil de manejar, y así sucesivamente, todos los recursos e información se extraen de una base de datos en segundo plano, incluso si se extrae por la 100000ª vez ese día. Hay métodos para reducir la carga de consultas en las bases de datos SQL, como Redis y Memcached, pero ¿por qué debería "calcular" la misma página web para cada usuario? "En la época dorada", los sitios web se cargaban en segundos (excepto si alguien estaba al teléfono) y eran súper pequeños. ¿Qué ha cambiado? Junto con las nuevas demandas de diseño, los sitios web de hoy están llenos de efectos y diseños que consumen muchos recursos computacionales. Aunque esto es definitivamente una mejora respecto al estilo en blanco y negro de los 90, los tiempos de carga de los sitios web aumentaron drásticamente, especialmente porque el estándar de conexión mundial sigue siendo la red móvil.



Para renderizar todos los efectos, se utiliza código PHP en segundo plano, que es código ejecutado en el propio servidor. Esto significa que cada vez que un usuario se conecta a un sitio web, el servidor está calculando el sitio web que va a mostrar al usuario. La versión de los 90 de los sitios web presentaba solo código HTML plano, que son básicamente instrucciones simples al navegador sobre cómo manejar las cosas. Al igual que la etiqueta <h1> le dice al navegador que esto es un encabezado, y <p> es un párrafo. No se necesitan cálculos (¡perdón por reducir la complejidad!).



Además, Javascript y CSS siguen un camino similar, ya que CSS describe el diseño en un enfoque similar al HTML, y Javascript se ejecuta no en el servidor, sino en el lado del cliente. Esto significa que el servidor no calcula por sí mismo, sino que "envía instrucciones" al navegador del cliente (por ejemplo, su teléfono).



Entonces, ¿por qué no usamos solo HTML, Javascript y CSS? PHP nos permite hacer muchas cosas y permite marcos de creación de contenido como WordPress para hacernos la vida más fácil. Pero la forma eficiente de producir sitios web sería generarlos una vez y luego distribuirlos ya renderizados a las masas.





## Idea 4: Volviendo a las raíces




¿Estoy diciendo que deberíamos volver a las páginas HTML en blanco y negro de los 90? Por supuesto que no, pero la combinación de HTML y CSS puede producir grandes resultados, y Javascript se vuelve cada vez más capaz de manejar procesos que solo PHP podía manejar en el pasado. Y si se necesitan cálculos, hay grandes nuevas posibilidades sin servidor disponibles como AWS Lambda (consulta mi blog para algunas aplicaciones de Lambda).



Volviendo al tema principal, he decidido escribir mi blog y cualquier sitio web futuro en HTML, CSS y JS planos, ya que no necesito:

1. **gestionar un servidor**: puedo alojarlo casi gratis en Github o AWS S3.
2. **preocuparme por las altas demandas**: S3 y Github escalan automáticamente, lo que significa que si miles de visitantes llegan a mi sitio web, no colapsará mi servidor.
3. **pagar mucho**: como no necesito tantos cálculos como con WordPress, ejecutar este blog es completamente gratuito.
4. **no necesito preocuparme por problemas de seguridad**: mi blog es básicamente inhackeable.


Además, el sitio web es increíblemente rápido, con una puntuación de Google Pagespeed del 100%, lo que también tiene un gran efecto en el ranking de la página, ya que Google favorece los sitios web de alta velocidad. La única razón por la que la puntuación actual ha bajado al 90% es que decidí incluir herramientas de CRM y seguimiento en mi blog. ¿Cuándo fue la última vez que viste un sitio web gratuito lograr esta puntuación?


En resumen, es simplemente genial, pero ¿estoy escribiendo todo el código HTML yo mismo?





## Presentando: Generadores de sitios web estáticos




Por supuesto que no, y afortunadamente hay grandes herramientas para manejar esto por mí. Los constructores de sitios web estáticos como [Jekyll](https://jekyllrb.com/) o [Hugo](https://gohugo.io/) ayudan mucho a que básicamente solo tengas que escribir en lenguaje Markdown (básicamente un archivo txt simple) y conviertan tus textos en HTML y un sitio web agradable. El código se calcula solo una vez y se puede subir a un servidor, o a Github pages y AWS S3 de inmediato para ser completamente sin servidor. [¿Cómo funciona? Consulta mis casos de estudio en mi blog para una explicación detallada](/project/serverless-static-website/).





## Resumen




Se siente genial no tener que preocuparse más por el tiempo de actividad, el escalado y la seguridad. ¿Es más difícil que WordPress? Depende. A medida que esta tecnología se desarrolla, hay que replantearse las cosas si has trabajado con WordPress y otros en el pasado, pero de nuevo hay muchas herramientas geniales que hacen que los constructores de sitios web estáticos sean similares al entorno "conocido" de WordPress, como forestry.io por ejemplo. ¿Cómo? [Consulta mi blog en www.datafortress.cloud para ver la explicación detallada](/project/serverless-static-website/).
Por ahora, me interesaría saber si alguna vez has intentado pasarte a lo sin servidor, o cuáles son tus experiencias con WordPress. [Envíame un mensaje o escribe un comentario abajo](/contact/).
