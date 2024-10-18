---
date: 14 de agosto de 2024
draft: false
logo: images/client-logo/bmw.png
title: 'BMW / HPE: Solución de respaldo mundial para máquinas virtuales (VM).

  '

---
> Arquitectura de la solución para el sistema de copia de seguridad mundial de sistemas basados en VM, incluyendo la planificación de las limitaciones de enrutamiento de la red en AWS/Google Cloud/Azure.

{{< image title="BMW / HPE: Solución de copia de seguridad mundial para VM" w="50%" o="webp q100" p="center" c="img-fluid shadow rounded-1" src="images/client-logo/bmw.png" alt="texto alternativo" >}}

## Estudio de Caso: Diseño de una Solución Global de Copia de Seguridad para las Máquinas Virtuales y Herramientas de Compartición de Archivos de BMW

**Cliente**: BMW / HPE

### Descripción del Proyecto:

BMW requería una solución de copia de seguridad robusta y escalable para sus extensos y distribuidos globalmente sistemas de máquinas virtuales (VM) y herramientas de uso compartido de archivos. El principal desafío fue identificar una solución de copia de seguridad capaz de manejar el enorme volumen de datos, que asciende a cientos de petabytes, asegurando la fiabilidad de los datos, una deduplicación eficiente y superando las limitaciones de ancho de banda.

### Objetivo:

Investigar, comparar e implementar una estrategia de copia de seguridad integral que aproveche tanto los proveedores de almacenamiento en la nube como los servidores de deduplicación HPE locales, garantizando la eficiencia de costos y una alta fiabilidad.

### Proceso de Diseño de la Solución:

#### Recopilación de Requisitos:

- Se llevaron a cabo discusiones detalladas con el equipo de TI de BMW para comprender las necesidades y restricciones específicas en relación con la copia de seguridad de datos.
- Se identificaron parámetros críticos como el volumen de datos, las limitaciones de ancho de banda, las velocidades de escritura en disco y la importancia de la deduplicación de datos.

#### Investigación y Análisis:

- Se realizó una extensa investigación sobre diversos proveedores de almacenamiento en la nube, evaluando sus límites de ancho de banda, velocidades de escritura en disco y escalabilidad.
- Se analizaron las implicaciones de costo de utilizar diferentes proveedores de nube para volúmenes de datos tan masivos.
- Se investigó la tecnología de deduplicación de HPE y su potencial para integrarse con soluciones de almacenamiento tanto en la nube como locales.

#### Comparación de Proveedores de Nube:

Se compararon los principales proveedores de almacenamiento en la nube (por ejemplo, AWS, Google Cloud, Microsoft Azure) enfocándose en:
- Límites de ancho de banda
- Velocidades de escritura en disco
- Costo por petabyte de almacenamiento
- Características de redundancia y fiabilidad de datos
Se evaluó la viabilidad de estos proveedores para manejar las necesidades de copia de seguridad de BMW de manera eficaz.

#### Desarrollo de la Solución de Copia de Seguridad Híbrida:

- Se diseñó una estrategia de copia de seguridad híbrida combinando múltiples proveedores de nube para asegurar la multi-fiabilidad y evitar puntos únicos de fallo.
- Se incorporaron servidores de deduplicación HPE para reducir significativamente el volumen de datos que necesita copia de seguridad, abordando las limitaciones de ancho de banda.
- Se garantizó que los datos más críticos se copiaran de forma deduplicada para mejorar aún más la eficiencia de los costos y la protección de los datos.

### Implementación:

#### Integración:

- Se implementó la solución de copia de seguridad híbrida con una integración perfecta entre los servidores de deduplicación HPE locales y los proveedores de almacenamiento en la nube seleccionados.
- Se desarrolló un programa de copia de seguridad sistemático para optimizar el uso del ancho de banda y evitar posibles cuellos de botella.

#### Pruebas y Validación:

- Se realizaron pruebas rigurosas para garantizar la integridad de los datos, las velocidades de copia de seguridad y la eficiencia de los procesos de deduplicación.
- Se validó la fiabilidad de la solución mediante múltiples pruebas de conmutación por error y simulacros de recuperación de datos.

#### Optimización:

- Se monitorizaron continuamente los procesos de copia de seguridad para identificar y corregir cualquier ineficiencia.
- Se ajustó el equilibrio entre el almacenamiento local y en la nube para maximizar los ahorros de costos sin comprometer la seguridad y la accesibilidad de los datos.

### Resultados:

- **Eficiencia de Costos**: Se demostró que una configuración de copia de seguridad autohospedada y deduplicada puede ser significativamente más rentable que depender únicamente de los proveedores de almacenamiento en la nube, especialmente para volúmenes de datos a gran escala.
- **Fiabilidad de Datos**: Se logró una alta fiabilidad de datos mediante una combinación de redundancia multi-nube y la sólida tecnología de deduplicación de HPE.
- **Gestión del Ancho de Banda**: Se mitigó satisfactoriamente las limitaciones de ancho de banda mediante el uso de servidores HPE para reducir el volumen de datos que necesita transferencia al almacenamiento en la nube.
- **Escalabilidad**: Se garantizó que la solución pudiera escalar con las crecientes necesidades de datos de BMW, proporcionando una estrategia de copia de seguridad sostenible a largo plazo.

### Conclusión:

El proyecto culminó en una solución de copia de seguridad altamente eficiente, escalable y rentable para los sistemas de VM y herramientas de uso compartido de archivos de BMW en todo el mundo. Al aprovechar un enfoque híbrido que combina almacenamiento en la nube y servidores de deduplicación HPE locales, no solo se cumplieron sino que superamos las expectativas del cliente, asegurando la fiabilidad de los datos y ahorros significativos de costes.

¡Desbloquea una fiabilidad de datos y ahorros de costos sin precedentes con nuestras soluciones de copia de seguridad híbridas—¡contáctanos ahora para transformar tu estrategia de gestión de datos!
