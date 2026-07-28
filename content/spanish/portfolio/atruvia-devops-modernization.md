---
title: 'Atruvia: Modernización de DevOps, Microservicios Spring Boot e Integración con Finanzamt'
date: '2024-03-15'
draft: false
logo: 'images/client-logo/atruvia.png'
image: 'images/client-logo/atruvia.png'
description: 'Colaboración de DevOps de varios años en Atruvia - migración de Jenkins a GitLab CI, microservicios Java Spring Boot en OpenShift y la capa de integración segura con el Finanzamt para la red de banca cooperativa más grande de Alemania.'
categories: ['Banking IT', 'DevOps', 'OpenShift', 'Spring Boot']
---

## El Compromiso

Atruvia es el núcleo tecnológico de la red de banca cooperativa de Alemania: **más de 120 Volksbanken y Raiffeisenbanken** que prestan servicio a millones de clientes minoristas y corporativos. Su equipo de plataforma gestiona una infraestructura bancaria central que debe superar las revisiones de BaFin, BSI y de los reguladores todos los días.

Me incorporé al equipo de ingeniería de plataforma y DevOps en tres líneas de trabajo interconectadas: modernización de CI/CD, refactorización de microservicios en OpenShift y la capa de comunicación segura entre los sistemas bancarios centrales y el Finanzamt (autoridad fiscal federal) alemán.

---

## 1. Migración de Jenkins → GitLab CI

La presencia de CI de Atruvia era un entorno de Jenkins maduro y complejo: cientos de tuberías, docenas de bibliotecas compartidas, proliferación de complementos y el patrón de credenciales montadas en el maestro que envejece mal en un entorno regulado.

La migración a GitLab CI fue un programa de varios trimestres:

- **Tubería como código en el mismo repositorio que el código fuente.** Cada compilación, cada prueba, cada puerta de despliegue es revisable en el mismo MR que envía el cambio de código. A los auditores les encanta esto. A los revisores les encanta aún más.
- **Artefactos firmados + procedencia estilo SLSA.** Cada artefacto que llega a un clúster de producción lleva un rastro de compilación verificable. Las puertas de despliegue pueden rechazar cualquier cosa que no provenga de la tubería canónica.
- **Puertas de promoción como código.** La promoción de Stage → pre-prod → prod es YAML explícito con reglas de aprobación vinculadas a grupos de proveedores de identidad. No más arqueología de "quién pulsó el botón".
- **Credenciales impulsadas por Vault.** Los secretos en tiempo de compilación y despliegue se extraen de HashiCorp Vault por trabajo con tokens de corta duración. La fuga de credenciales en los registros de compilación se convierte en una imposibilidad arquitectónica, no en una política esperanzadora.

La migración se realizó sin un período de congelación: las antiguas tuberías de Jenkins continuaron ejecutándose mientras las tuberías equivalentes de GitLab se validaban en paralelo, y luego se realizó la transición de un área de producto a la vez.

---

## 2. Microservicios Java Spring Boot en OpenShift

Una gran parte de la pila de aplicaciones bancarias se refactorizó de servicios Java monolíticos a **microservicios Spring Boot** discretos que se ejecutan en **OpenShift**. Aspectos destacados:

- **Límites de servicio adecuados.** Descomposición impulsada por el dominio, no un teatro de "dividir el monolito por nombres de paquetes". Los servicios poseen sus datos y exponen API estrechas y versionadas.
- **Observabilidad de grado de producción.** Cada servicio se entrega con métricas de Micrometer, rastreo distribuido (OpenTelemetry) y registro de auditoría estructurado que satisface los requisitos de rastro de BaFin.
- **Despliegues con Helm + Kustomize.** Manifiestos con plantillas y superposiciones de entorno, desplegados a través de las tuberías de GitLab CI mencionadas anteriormente. ArgoCD supervisa las ramas de entorno canónicas.
- **Resiliencia integrada, no añadida.** Disyuntores (circuit breakers), presupuestos de reintentos y aislamiento (bulkheading) a nivel de marco de trabajo. Sondas de salud y disponibilidad que significan algo. Cierre gradual para despliegues rodantes seguros.

---

## 3. Capa de Integración con el Finanzamt

Los bancos alemanes tienen obligaciones de información no triviales ante el Finanzamt: informes de intereses, informes de ganancias de capital, intercambio FATCA/CRS y una larga lista de presentaciones estructuradas en fechas fijas.

Diseñé la capa de integración segura que une los sistemas bancarios centrales y los puntos finales del Finanzamt:

- **Presentaciones impulsadas por tuberías** con reintentos idempotentes, colas de mensajes no entregados para lotes mal formados e ID de correlación de extremo a extremo para la reproducción de auditorías.
- **Credenciales y claves de firma** gestionadas a través de HashiCorp Vault con rotación integrada en la plataforma.
- **Herramientas de conciliación** que comparan lo que se envió con lo que se reconoció, y detectan desviaciones antes de que lo haga un regulador.

Cada artefacto en esta ruta es auditable de extremo a extremo: el código fuente, la compilación, el despliegue, la emisión de credenciales, la presentación en sí y el acuse de recibo.

---

## El Patrón Arquitectónico Subyacente

Todo esto se asienta sobre un patrón de defensa en profundidad que trata cada capa como independiente:

- **Istio Service Mesh** con bloqueo geográfico y autorización estricta de servicio a servicio en las pasarelas de salida. El tráfico entre centros de datos es un acto deliberado y autorizado, nunca un accidente.
- **HashiCorp Vault** como la única fuente de verdad para los secretos, con emisión vinculada a la identidad de la carga de trabajo.
- **Identidad de carga de trabajo** en la capa de aplicación, de modo que incluso una ruta mal configurada no otorga acceso sin una identidad válida de estilo SPIFFE.

Un fallo en cualquier capa no compromete el sistema. Esa es la propiedad que busca un regulador y es la propiedad que el equipo puede mantener realmente en la semana 50 del año.

---

## Por qué es Importante

La modernización de DevOps en la banca regulada no se trata de seguir tendencias. Se trata de hacer que la plataforma sea _aburrida_: rápida para realizar envíos, difícil de configurar mal, trivial de auditar. Las opciones tecnológicas (GitLab, OpenShift, Spring Boot, Istio, Vault) son el punto de partida. La disciplina es el diferenciador.

Este compromiso es el tipo de trabajo por el que me llaman: alto riesgo, regulado, plurianual y diseñado para desaparecer en el fondo para que el negocio pueda moverse.

---

## Relacionado

- **Servicio:** [Infraestructura de nube y DevOps (Kubernetes/OpenShift conforme a BaFin)](/es/services/cloud-infrastructure-devops/)
- **Servicio:** [Ingeniería de datos y análisis](/es/services/data-engineering-analytics/)
- **Caso de estudio:** [Atruvia / Volksbank - Modernización del almacén de datos](/es/portfolio/atruvia--volksbank-data-warehouse/)
- **Acerca de:** [Justin Güse - Arquitecto de infraestructura empresarial](/es/about/)

**¿Nos está evaluando para un compromiso?** [Reserve una revisión de arquitectura gratuita de 1 hora](/es/contact/): en 60 minutos encontraré más de 100 000 € en riesgos de cumplimiento, desperdicio en la nube o margen de escalabilidad, o se lo diré y me marcharé.
