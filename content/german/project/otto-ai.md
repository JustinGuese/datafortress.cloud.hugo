---
title: OttoAI Machine Learning (NLP) SAAS
date: '2022-09-24T14:48:03.000+06:00'
description: "Entwicklung einer Software, die Informationen über potenzielle Kontakte aus verschiedenen Quellen sammelt, mit Hilfe von NLP eine personalisierte Nachricht generiert und die Kontakte dann automatisch über LinkedIn anschreibt."
bg_image: "/images/project/ottoai.jpg"
image: "/images/project/ottoai.jpg"
live_demo: ''
case_study: ''
category: Cloud
overview:
- label: Kunde
  data: Otto.ai
- label: Branche
  data: IT
- label: Ort
  data: New York, USA
- label: Category
  data: Cloud, AI
- label: Expertise
  data: AWS, Microservices, Terraform
- label: Zeitraum
  data: 2022-2022

---

## Zusammenfassung

Entwicklung einer Software, die Informationen über potenzielle Kontakte aus verschiedenen Quellen sammelt, mit Hilfe von NLP eine personalisierte Nachricht generiert und die Kontakte dann automatisch über LinkedIn anschreibt.


## Stichpunkte

AWS, Docker, Python, NLP Machine Learning, Webscraper, Autoscaling, Terraform, AWS CloudFormation, CI/CD Pipelines

## Beschreibung

Ziel des Projekts ist es, eine Cloud-Architektur und Software zu entwickeln, die Informationen über potenzielle Kunden sammelt und sie mit einer sehr personalisierten Nachricht auf LinkedIn anschreibt.

Zu diesem Zweck wurde zunächst ein Web Scraper eingerichtet, der LinkedIn, Twitter und Google nach Informationen über den potenziellen Kontakt durchsucht und diese Informationen mithilfe von maschinellem NLP-Lernen interpretiert und eine "Datei" pro Kunde erstellt. 

Anschließend wird mithilfe eines anderen NLP-Modells ein personalisiertes Anschreiben generiert, und ein weiterer Selenium-Python-Bot wird verwendet, um die Nachricht über LinkedIn an den Kunden zu senden.

Da die Software und die Modelle Tausende von Anfragen innerhalb weniger Sekunden verarbeiten müssen, war es notwendig, eine autoskalierende und schnelle Architektur mit Docker und AWS ECS zu entwickeln, die gleichzeitig nicht zu viele Kosten durch GPU-Instanzen auf AWS verursacht. Die endgültige Architektur ist eine Mischung aus Docker-Microservices und Spot-Instanzen, die die GPU-Docker-Images bei Bedarf hosten.

[Arbeiten Sie an einem ähnlichen Projekt? Sind Sie an etwas Ähnlichem interessiert? Kontaktieren Sie uns jetzt für eine kostenlose 15-minütige Beratung.](/de/contact/)
