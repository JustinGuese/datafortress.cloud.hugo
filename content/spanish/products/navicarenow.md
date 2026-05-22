---
date: "2024-06-01"
draft: false
title: "NavicareNow"
description: "Plataforma de navegación médica impulsada por IA que guía a los pacientes hacia la atención adecuada en el momento adecuado, creada para el sistema de salud de Alemania."
icon: "fas fa-hospital"

######################### banner #####################
banner:
  title: "NavicareNow – Navegación médica por IA"
  image: "images/banner-art.svg"
  content: "Ayudando a los pacientes a navegar por el complejo sistema de salud de Alemania con orientación impulsada por IA, desde el primer síntoma hasta la cita con el especialista."
  button:
    enable: true
    label: "Visitar NavicareNow"
    link: "https://navicarenow.de/"
  background_class: "bg-light"

######################### about this product #####################
about_this_product:
  enable: false
---

### NavicareNow: navegación inteligente de pacientes para la sanidad alemana

NavicareNow es una plataforma impulsada por IA que elimina la fricción en el trayecto del paciente, guiando a los usuarios desde la evaluación de los síntomas hasta el especialista, clínica o servicio de urgencias adecuado. Creada específicamente para el panorama sanitario alemán de múltiples pagadores y proveedores.

Como CTO y co-arquitecto, Justin Güse diseñó el pipeline de inferencia de IA subyacente, la infraestructura en la nube (Kubernetes) y la arquitectura de datos conforme a GDPR.

### Características Clave

#### Triaje de síntomas impulsado por IA
- **Verificador de síntomas conversacional**: entrada en lenguaje natural que mapea los síntomas con las condiciones probables y los niveles de urgencia.
- **Enrutamiento inteligente**: dirige a los pacientes hacia la vía de atención más adecuada (médico de cabecera, especialista, urgencias, telemedicina).
- **Multilingüe**: soporta alemán e inglés para la diversa población de Alemania.

#### Infraestructura de nivel de cumplimiento
- **Cumple con GDPR y la ley alemana de datos sanitarios**: no se utilizan datos de pacientes para el entrenamiento de modelos sin consentimiento explícito.
- **Alojado en Kubernetes**: alta disponibilidad con despliegues sin tiempo de inactividad.
- **Pista de auditoría**: registro completo para revisión regulatoria.

#### Integración de proveedores
- **Reserva de citas**: programación directa con clínicas y especialistas asociados.
- **Consciente de los seguros**: enruta según la cobertura de seguro estatal o privado del paciente.

### El Stack Técnico

Construido sobre: Python FastAPI · Kubernetes · PostgreSQL · Redis · Flutter (móvil) · React (web) · LLM alojados en Alemania para inferencia sensible.

**[Más información en navicarenow.de →](https://navicarenow.de/)**
