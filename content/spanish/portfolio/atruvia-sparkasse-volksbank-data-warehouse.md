---
date: 14 de agosto de 2024
draft: false
logo: images/client-logo/sparkasse.png
title: Atruvia / Sparkasse / Volksbank – Almacén de Datos

---
> Reemplazando Hadoop con un almacén de datos construido sobre Trino, desarrollado con una arquitectura de microservicios con autosescalamiento para manejar datos financieros de millones de clientes alemanes.

{{< image title="Atruvia / Sparkasse / Volksbank – Almacén de Datos" w="50%" o="webp q100" p="center" c="img-fluid shadow rounded-1" src="images/client-logo/sparkasse.png" alt="texto alternativo" >}}

## Caso de Estudio: Revolucionando la Gestión de Datos para Atruvia con Soluciones de Código Abierto

## Cliente: Atruvia (Proveedor de TI para Volksbank y Sparkasse)

### Descripción del Proyecto:

Atruvia, la columna vertebral de TI para Volksbank y Sparkasse, se enfrentaba a costos crecientes y limitaciones con su infraestructura de gestión de datos basada en Hadoop. Reconociendo la necesidad de una solución más rentable y avanzada, Atruvia buscó construir un almacén de datos moderno aprovechando tecnologías de vanguardia. El objetivo era crear una arquitectura de microservicios compatible con BaFin que permitiera a los equipos de análisis manejar conjuntos de datos masivos con facilidad, utilizando únicamente herramientas de código abierto y evitando cualquier componente de la nube pública.

### Objetivo:

Reemplazar la costosa infraestructura de Hadoop con una solución de almacén de datos escalable, eficiente y rentable construida sobre Trino y clústeres S3 con autosescalamiento, asegurando el cumplimiento con las regulaciones de BaFin y optimizando el rendimiento de los datos para los usuarios finales.

### Proceso de Diseño de la Solución:

#### Análisis de Requisitos:

Se llevaron a cabo conversaciones detalladas con los equipos de TI y análisis de Atruvia para comprender sus necesidades específicas, desafíos y requisitos regulatorios.
Se identificaron aspectos críticos como la reducción de costos, la escalabilidad, el rendimiento de los datos y la facilidad de uso para los equipos de análisis.

#### Evaluación Tecnológica:

- Se evaluaron diversas tecnologías de código abierto para reemplazar Hadoop, enfocándose en Trino por sus potentes capacidades de consulta SQL y clústeres S3 con autosescalamiento para un almacenamiento de datos eficiente.
- Se garantizó que todas las tecnologías seleccionadas cumplieran con las regulaciones de BaFin y pudieran integrarse sin problemas en la infraestructura existente de Atruvia.

#### Diseño de la Arquitectura:

- Se diseñó una arquitectura de microservicios utilizando OpenShift para alojar todo el entorno de almacén de datos y análisis.
- Se implementaron clústeres S3 con autosescalamiento como la solución de almacenamiento principal, reemplazando las bases de datos tradicionales y garantizando la escalabilidad para conjuntos de datos enormes.
- Se desarrolló un marco compatible con BaFin para gestionar la seguridad de los datos y el cumplimiento normativo.

#### Herramientas y Entornos de Usuario Amistosos:

- Se crearon entornos preconfigurados de Jupyter Notebook para permitir a los equipos de análisis cargar, analizar y visualizar grandes conjuntos de datos sin necesidad de conocimientos técnicos extensos.
- Se integraron paneles de control interactivos para proporcionar información en tiempo real y agilizar los procesos de análisis de datos.

### Implementación:

#### Configuración de la Infraestructura:

- Se implementaron clústeres Trino y S3 con autosescalamiento dentro del entorno OpenShift, asegurando alta disponibilidad y escalabilidad.
- Se configuró la arquitectura de microservicios para manejar la ingestión, el procesamiento y la consulta de datos de manera eficiente.

#### Migración de Datos:

- Se llevó a cabo una migración fluida de datos desde la infraestructura de Hadoop al nuevo almacén de datos basado en Trino y S3.
- Se garantizó la integridad de los datos y el cumplimiento normativo durante todo el proceso de migración.

#### Capacitación y Soporte al Usuario:

- Se proporcionaron sesiones de capacitación exhaustivas para los equipos de análisis para familiarizarlos con las nuevas herramientas y flujos de trabajo.
- Se estableció un marco de soporte para ayudar a los usuarios en la transición al nuevo entorno y maximizar sus beneficios.

### Resultados:

- Reducción de Costos: Se redujeron con éxito los costos de gestión de datos al reemplazar la costosa infraestructura de Hadoop con una solución de código abierto más eficiente.
- Escalabilidad y Rendimiento: Se lograron mejoras significativas en la escalabilidad y el rendimiento de los datos, lo que permite un manejo sin problemas de conjuntos de datos masivos.
- Cumplimiento Regulatorio: Se garantizó el cumplimiento total con las regulaciones de BaFin, proporcionando un entorno de gestión de datos seguro y confiable.
- Empoderamiento del Usuario: Se empoderaron a los equipos de análisis con herramientas fáciles de usar, eliminando la necesidad de PySpark y configuraciones complejas, y permitiéndoles concentrarse en obtener información de los datos.

### Conclusión:

El proyecto resultó en una solución de gestión de datos transformadora para Atruvia, aprovechando las tecnologías de código abierto para ofrecer un almacén de datos escalable, rentable y compatible con BaFin. Al reemplazar Hadoop con Trino y clústeres S3 con autosescalamiento, y al proporcionar herramientas de análisis fáciles de usar, Atruvia mejoró significativamente sus capacidades de datos, asegurando un rendimiento óptimo y empoderando a sus equipos de análisis.

¿Está buscando modernizar su infraestructura de datos? ¡Contáctenos hoy para descubrir cómo podemos ayudarle a construir una solución de gestión de datos escalable, rentable y conforme a sus necesidades!
