---
####################### Banner #########################
banner:
  title : "De Datos Polvorientos a Oro de Ingresos"
  image : "images/banner-art.svg"
  imagetwo: "images/justin-guese-bg-removed.png"
  content : "Ingeniería de Datos, DevOps (K8s, OS), IA <br> Estamos Aquí para Ayudar"
  button:
    enable : true
    label : "Consulta gratuita de 15 minutos"
    link : "contact/"


########################## Clients Logo Slider #########################
clients_logo_slider:
  enable : true
  title: "Confiado por las mejores empresas del mundo"
  logos:
  - "images/client-logo/bmw.png"
  - "images/client-logo/volksbank.png"
  - "images/client-logo/volksbank.png"
  - "images/client-logo/hpe-small.png"
  - "images/client-logo/porsche-holding.png"
  - "images/client-logo/vw.png"
  - "images/client-logo/atruvia.png"
  - "images/client-logo/buchinger-wilhelmi.png"
  - "images/client-logo/ottoai.png"
  - "images/client-logo/summai.png"


##################### Feature ##########################
feature:
  enable : true
  title : "Muchas empresas luchan por desbloquear el potencial de sus datos"
  content : "
Ahí es donde entramos nosotros.
Mientras que AWS y las nubes públicas pueden ser costosas y a menudo están restringidas por las regulaciones financieras y de salud alemanas, ofrecemos soluciones seguras de alojamiento en Kubernetes.
Con un historial comprobado trabajando con empresas como VW, HPE, Porsche y grandes bancos, podemos transformar sus datos en ingresos valiosos."
  button:
    enable : true
    label : "Consulta gratuita de 15 minutos"
    link : "contact/"
  feature_item:
  # feature item loop
  - name : "Big Data"
    icon : "fa fa-database"
    content : "Almacenamiento de Datos, Lagos de Datos, Marts de Datos, Pipelines ETL y Trino/Hadoop. ¡Podemos ingerir y procesar cualquier dato!"
    
  # feature item loop
  - name : "Cloud/Kubernetes"
    icon : "fa fa-cloud"
    content : "Kubernetes en bare-metal y en la nube (híbrida). ¿No está seguro de cuál elegir? ¡Llámenos!"
    
  # feature item loop
  - name : "IA/ML"
    icon : "fas fa-robot"
    content : "Soluciones de IA escalables y compatibles con la UE. ML Ops para escalar sus cargas de trabajo de IA."
    
  # feature item loop
  - name : "servicios de extremo a extremo"
    icon : "far fa-thumbs-up"
    content : "Ofrecemos servicios integrales de extremo a extremo, que cubren desde la consultoría y la arquitectura hasta la programación."
      
      
######################### Intro Video #####################
intro_video:
  enable: true
  title: "DataFortress.cloud en 60 segundos"
  content: "porque a veces, un video dice más que mil palabras."
  video_url: "https://www.youtube.com/embed/eEWvARX0FT0"
  video_thumbnail: "images/video-popup.png"

      
      
######################### Service #####################
service:
  enable : true
  service_item:
  # service item loop
  - title : "Arquitectura de Soluciones Empresariales: Revolucionando el Flujo de Datos en el Proceso de Muestreo de VW con HPE"
    images:
    - "images/client-logo/vw.png"
    - "images/client-logo/hpe-small.png"
    - "images/service-3.png"
    content : "En colaboración con Hewlett Packard Enterprise (HPE) y Volkswagen (VW), diseñamos una arquitectura de soluciones de vanguardia que transformó el proceso de muestreo de materiales empresariales de VW. Al integrar una plataforma SaaS en la compleja arquitectura del sistema de VW, aumentamos significativamente la velocidad de comercialización de nuevos modelos de vehículos mientras optimizábamos todo el flujo de trabajo de muestreo.
<br/><br/>
Nuestra solución aprovechó una arquitectura de microservicios modular, permitiendo una transferencia de datos segura y compatible entre los diversos sistemas de VW y la nueva plataforma. ¿El resultado? Una notable reducción del 64% en el tiempo de muestreo y las tasas de error, todo mientras cumplíamos con los estándares de cumplimiento de VW y VDA. Este proyecto muestra nuestra experiencia en abordar desafíos tecnológicos, mejorar la eficiencia y ofrecer soluciones impactantes para líderes globales como VW."
      
  # service item loop
  - title : "Ingeniería de Datos: Transformando la Gestión de Datos para Atruvia y Volksbank"
    images:
    - "images/client-logo/volksbank.png"
    - "images/client-logo/volksbank.png"
    - "images/client-logo/atruvia.png"
    content : "En colaboración con Atruvia, el proveedor de TI para Volksbank, reemplazamos una infraestructura costosa basada en Hadoop con un moderno almacén de datos de código abierto. Construida sobre clústeres de autoscaling de Trino y S3, esta arquitectura compatible con BaFin maneja grandes cantidades de datos financieros de millones de clientes mientras ofrece un rendimiento excepcional a un costo reducido.
<br/><br/>
Al diseñar una arquitectura de microservicios y proporcionar entornos de análisis fáciles de usar, empoderamos a los equipos de Atruvia para analizar grandes conjuntos de datos sin configuraciones complejas. Nuestra solución no solo mejoró la escalabilidad y el rendimiento de los datos, sino que también aseguró el cumplimiento regulatorio, posicionando a Atruvia para el crecimiento futuro. Este proyecto muestra nuestra capacidad para ofrecer arquitecturas de datos innovadoras y rentables que cumplen con los más altos estándares de la industria."
      
  # service item loop
  - title : "Código Abierto: Mejorando TimesFM de Google con CI/CD y Python Poetry"
    images:
    - "images/client-logo/googleresearch.jpg"
    content : "Como parte de mis contribuciones de código abierto al proyecto TimesFM de Google Research, implementé mejoras clave que optimizaron el proceso de desarrollo y mejoraron la accesibilidad del usuario. TimesFM, un modelo de pronóstico de vanguardia preentrenado en 100 mil millones de puntos de tiempo del mundo real, ofrece un rendimiento impresionante de cero disparos para la previsión de series temporales en industrias como el comercio minorista, las finanzas y la salud. A pesar de sus capacidades robustas, el proyecto necesitaba mejoras en el despliegue y la gestión de dependencias para maximizar su impacto.
<br/><br/>
Contribuí integrando una canalización de Integración Continua/Despliegue Continuo (CI/CD) utilizando GitHub Actions, automatizando las pruebas y los flujos de trabajo de despliegue, y asegurando una calidad de código consistente. Además, implementé Python Poetry para una gestión de dependencias sin problemas, simplificando la instalación y mejorando la reproducibilidad. Estas mejoras redujeron la barrera para nuevos usuarios y desarrolladores, mejoraron la productividad y fomentaron una mejor colaboración, permitiendo que TimesFM siga siendo líder en la innovación de la previsión de series temporales.
<br/><br/>
Al optimizar el entorno de desarrollo y los procesos de despliegue, mis contribuciones han asegurado que TimesFM pueda seguir ofreciendo capacidades de pronóstico poderosas con mayor eficiencia y facilidad."
      
  # service item loop
  - title : "Arquitectura de Soluciones Empresariales: BMW / HPE: Solución de respaldo mundial para VMs"
    images:
    - "images/client-logo/bmw.png"
    content : "En asociación con BMW y HPE, diseñamos una solución de respaldo global escalable y rentable para apoyar los extensos sistemas de máquinas virtuales (VM) y la infraestructura de intercambio de archivos de BMW. Frente al desafío de gestionar cientos de petabytes de datos en una red mundial, desarrollamos una estrategia híbrida que integró sin problemas los proveedores de almacenamiento en la nube con los servidores de deduplicación de HPE en las instalaciones.
<br/><br/>
Aprovechando las fortalezas de AWS, Google Cloud y Azure, combinadas con la avanzada tecnología de deduplicación de HPE, superamos las limitaciones de ancho de banda y reducimos significativamente los costos de almacenamiento. Nuestra solución aseguró la fiabilidad de los datos a través de la redundancia multicloud y permitió un crecimiento escalable en línea con las necesidades futuras de BMW. Este proyecto destaca nuestra experiencia en la arquitectura de sistemas de respaldo de datos globales que ofrecen un rendimiento robusto, rentabilidad y sostenibilidad a largo plazo."
       
       
################### Testimonials ########################
testimonials:
  enable: false
  title: "Confiado por las principales empresas"
  content: ""
  
  testimonials_quotes:
  - quote: "Lorem ipsum dolor amet, conseetur adipiscing elit. Ornare quam porta arcu congue felis volutpat. Vitae lectudbfs dolor faucibus"
    name: "Ryder Stewart"
    designation: "Lynch, Marquardt"
    image: "images/avatar/02.jpg"

  - quote: "Conseetur adipiscing elit. Ornare quam porta arcu congue felis volutpat. Vitae lectudbfs pellentesque vitae dolor faucibus"
    name: "Kade Kim"
    designation: "Champlin Group"
    image: "images/avatar/03.jpg"

  - quote: "Lorem ipsum dolor amet, conseetur adipiscing elit. Ornare quam porta arcu congue felis volutpat. Vitae lectudbfs pellentesque vitae dolor"
    name: "David Cameron"
    designation: "CEO, Nexuspay"
    image: "images/avatar/04.jpg"
        

################### tools_intregrate ########################
tools_intregrate:
  enable : true
  title : "Se integra con todas las herramientas que su equipo ama usar"
  content: "Desde proveedores de nube pública hasta el simple Excel, podemos procesar e integrar cualquier fuente de datos."
  image : "images/screenshot.svg"

  tools:
    - "images/tools/Amazon_Web_Services-Logo.wine.png"
    - "images/tools/hetzner.png"
    - "images/tools/sap.png"
    - "images/tools/azure.svg.png"
    - "images/tools/jupyter-notebook.png"
    - "images/tools/snowflake.svg.png"
    - "images/tools/docker.png"
    - "images/tools/kubernetes.jpg"
    - "images/tools/trino-logo.png"
    - "images/tools/excel.jpeg"
    - "images/tools/linux.png"
    - "images/tools/google-cloud-logo-3.png"
    - "images/tools/python.svg.png"

  

##################### Call to action #####################
call_to_action:
  enable : true
  title : "¿Listo para empezar?"
  content : "Contáctenos para una consulta gratuita de 15 minutos y cuéntenos sobre sus desafíos de datos/nube."
  button:
    enable : true
    label : "Contáctenos"
    link : "contact/"
---
