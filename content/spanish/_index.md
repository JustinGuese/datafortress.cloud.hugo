---
####################### Banner #########################
banner:
  title : "Infraestructura de nivel empresarial para la era de la IA"
  image : "images/banner-art.svg"
  imagetwo: "images/justin-guese-bg-removed.png"
  content : "Escalando ingeniería de datos y DevOps de alto rendimiento y seguridad para las industrias más exigentes del mundo, desde gigantes de la automoción hasta redes bancarias que cumplen con la normativa BaFin. Arquitecto de soluciones AWS certificado que une Kubernetes/OpenShift on-premise con flujos de trabajo agentic autónomos."
  button:
    enable : true
    label : "Reservar una revisión de arquitectura"
    link : "contact/"


########################## Clients Logo Slider #########################
clients_logo_slider:
  enable : true
  title: "Con la confianza de las mejores empresas del mundo"
  logos:
  - "images/client-logo/bmw.png"
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
  title : "Tres pilares. Petabytes de datos. Cero margen para el tiempo de inactividad."
  content : "
Diseñamos sistemas de misión crítica en tres disciplinas: <strong>Kubernetes/OpenShift conformes con BaFin</strong> para industrias reguladas, <strong>ingeniería de datos a escala de petabytes</strong> en más de 60 países e <strong>IA agentic</strong> que se ejecuta de forma autónoma on-premise. La nube pública suele ser demasiado costosa y, con frecuencia, está prohibida por las regulaciones financieras y de salud alemanas. Cubrimos ese vacío para VW, HPE, BMW, Porsche y la red bancaria más grande de Alemania."
  button:
    enable : true
    label : "Consulta gratuita de 15 minutos"
    link : "contact/"
  feature_item:
  # feature item loop
  - name : "Big Data"
    icon : "fa fa-database"
    content : "Data Warehousing, Data Lakes, Data Marts, ETL Pipelines y Trino/Hadoop. ¡Podemos ingerir y procesar cualquier dato!"
    
  # feature item loop
  - name : "Cloud/Kubernetes"
    icon : "fa fa-cloud"
    content : "Kubernetes en bare-metal y en la (Hybrid-)Cloud. ¿No está seguro de cuál elegir? ¡Llámenos!"
    
  # feature item loop
  - name : "AI/ML"
    icon : "fas fa-robot"
    content : "Soluciones de IA escalables y conformes con la UE. ML Ops para escalar sus cargas de trabajo de IA."
    
  # feature item loop
  - name : "Servicios end-to-end"
    icon : "far fa-thumbs-up"
    content : "Ofrecemos servicios integrales de principio a fin, que cubren todo, desde la consultoría y la arquitectura hasta la programación."
      
      
######################### Intro Video #####################
intro_video:
  enable: true
  title: "DataFortress.cloud en 60 segundos"
  content: "porque a veces, un vídeo dice más que mil palabras."
  video_url: "https://www.youtube.com/embed/eEWvARX0FT0"
  video_thumbnail: "images/video-popup.png"

      
      
######################### Service #####################
service:
  enable : true
  service_item:
  # service item loop - Atruvia DevOps modernization (headline case)
  - title : "Modernización de DevOps en Atruvia: Microservicios Spring Boot, Jenkins → GitLab, Integración con Finanzamt"
    images:
    - "images/client-logo/atruvia.png"
    - "images/client-logo/volksbank.png"
    content : "Colaboración de DevOps de varios años en Atruvia, el núcleo tecnológico de más de 120 bancos cooperativos alemanes. Lideramos la migración de Jenkins a GitLab CI en cientos de tuberías, refactorizamos servicios monolíticos en microservicios Java Spring Boot en OpenShift y diseñamos la capa de comunicación segura entre los sistemas bancarios centrales y los puntos de notificación del Finanzamt (autoridad fiscal federal) alemán.
<br/><br/>
Cada componente es consciente de BaFin por diseño: tubería como código con puertas de promoción auditables, despliegues impulsados por secretos a través de HashiCorp Vault y una malla de servicios Istio que impone una autorización estricta de servicio a servicio entre centros de datos. El resultado: aumento de la frecuencia de despliegue, reducción del tiempo de espera y una plataforma que resiste la revisión regulatoria.
<br/><br/>
Este es el tipo de trabajo por el que nos llaman: alto riesgo, regulado y diseñado para ser „aburrido“ (sin incidentes)."

  # service item loop
  - title : "Arquitectura de soluciones empresariales: revolucionando el flujo de datos en el proceso de muestreo de VW con HPE"
    images:
    - "images/client-logo/vw.png"
    - "images/client-logo/hpe-small.png"
    - "images/service-3.png"
    content : "En colaboración con Hewlett Packard Enterprise (HPE) y Volkswagen (VW), diseñamos una arquitectura de solución de vanguardia que transformó el proceso de muestreo de materiales empresariales de VW. Al integrar una plataforma SaaS en la compleja arquitectura de sistemas de VW, aumentamos significativamente la velocidad de comercialización de nuevos modelos de vehículos al tiempo que agilizamos todo el flujo de trabajo de muestreo.
<br/><br/>
Nuestra solución aprovechó una arquitectura de microservicios modular, lo que permitió una transferencia de datos segura y conforme entre los diversos sistemas de VW y la nueva plataforma. ¿El resultado? Una notable reducción del 64% en el tiempo de muestreo y en las tasas de error, todo ello cumpliendo con los estándares de cumplimiento de VW y VDA. Este proyecto muestra nuestra experiencia en abordar desafíos tecnológicos, mejorar la eficiencia y ofrecer soluciones impactantes para líderes globales como VW."
      
  # service item loop
  - title : "Ingeniería de datos: transformando la gestión de datos para Atruvia y Volksbank"
    images:
    - "images/client-logo/volksbank.png"
    - "images/client-logo/volksbank.png"
    - "images/client-logo/atruvia.png"
    content : "En colaboración con Atruvia, el proveedor de TI de Volksbank, reemplazamos una costosa infraestructura basada en Hadoop por un almacén de datos moderno y de código abierto. Construida sobre clústeres de autoescalado Trino y S3, esta arquitectura conforme con BaFin maneja grandes cantidades de datos financieros de millones de clientes, al tiempo que ofrece un rendimiento excepcional a un coste reducido.
<br/><br/>
Al diseñar una arquitectura de microservicios y proporcionar entornos de análisis fáciles de usar, capacitamos a los equipos de Atruvia para analizar sin problemas grandes conjuntos de datos sin configuraciones complejas. Nuestra solución no solo mejoró la escalabilidad y el rendimiento de los datos, sino que también garantizó el cumplimiento normativo, posicionando a Atruvia para el crecimiento futuro. Este proyecto muestra nuestra capacidad para ofrecer arquitecturas de datos innovadoras y rentables que cumplen con los más altos estándares de la industria."
      
  # service item loop
  - title : "Código abierto: mejora de TimesFM de Google con CI/CD y Python Poetry"
    images:
    - "images/client-logo/googleresearch.jpg"
    content : "Como parte de mis contribuciones de código abierto al proyecto TimesFM de Google Research, implementé mejoras clave que agilizaron el proceso de desarrollo y mejoraron la accesibilidad para el usuario. TimesFM, un modelo de pronóstico de vanguardia pre-entrenado en 100 mil millones de puntos de tiempo del mundo real, ofrece un impresionante rendimiento zero-shot para el pronóstico de series temporales en industrias como el comercio minorista, las finanzas y la salud. A pesar de sus robustas capacidades, el proyecto necesitaba mejoras en el despliegue y la gestión de dependencias para maximizar su impacto.
<br/><br/>
Contribuí integrando un pipeline de integración continua/despliegue continuo (CI/CD) utilizando GitHub Actions, automatizando los flujos de trabajo de prueba y despliegue, y garantizando una calidad de código constante. Además, implementé Python Poetry para una gestión de dependencias sin fisuras, simplificando la instalación y mejorando la reproducibilidad. Estas mejoras redujeron la barrera para los nuevos usuarios y desarrolladores, mejoraron la productividad y fomentaron una mejor colaboración, permitiendo que TimesFM permanezca a la vanguardia de la innovación en el pronóstico de series temporales.
<br/><br/>
Al optimizar el entorno de desarrollo y los procesos de despliegue, mis contribuciones han garantizado que TimesFM pueda seguir ofreciendo potentes capacidades de pronóstico con mayor eficiencia y facilidad."
      
  # service item loop
  - title : "Arquitectura de soluciones empresariales: BMW / HPE: Solución de copia de seguridad mundial para VMs"
    images:
    - "images/client-logo/bmw.png"
    content : "En asociación con BMW y HPE, diseñamos una solución de copia de seguridad global escalable y rentable para dar soporte a los extensos sistemas de máquinas virtuales (VM) e infraestructura de intercambio de archivos de BMW. Ante el desafío de gestionar cientos de petabytes de datos en una red mundial, desarrollamos una estrategia híbrida que integró a la perfección los proveedores de almacenamiento en la nube con servidores de deduplicación HPE on-premise.
<br/><br/>
Al aprovechar las fortalezas de AWS, Google Cloud y Azure, combinadas con la tecnología avanzada de deduplicación de HPE, superamos las limitaciones de ancho de banda y redujimos significativamente los costes de almacenamiento. Nuestra solución garantizó la fiabilidad de los datos mediante la redundancia multicloud y permitió un crecimiento escalable en línea con las necesidades futuras de BMW. Este proyecto destaca nuestra experiencia en la arquitectura de sistemas globales de copia de seguridad de datos que ofrecen un rendimiento robusto, rentabilidad y sostenibilidad a largo plazo."
       
       
################### Testimonials ########################
testimonials:
  enable: false
  title: "Con la confianza de empresas líderes"
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
  title : "Se integra con todas las herramientas que a su equipo le encanta usar"
  content: "Desde proveedores de nube pública hasta simples Excel: podemos procesar e integrar cualquier fuente de datos."
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
  title : "No solo escribo código. Construyo fortalezas para sus datos."
  content : "Consulte para compromisos freelance de alta complejidad, revisiones arquitectónicas o estrategias de integración de IA. Con sede en Múnich, Alemania, disponible globalmente."
  button:
    enable : true
    label : "Reservar una revisión de arquitectura"
    link : "contact/"
---
