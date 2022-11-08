---
title: SUMM AI serverless AWS architecture 
date: '2022-09-24T14:48:03.000+06:00'
description: "KI-Startup, das Sprache mit Transformer MLP-Modellen vereinfacht"
bg_image: "/images/project/summai.png"
image: "/images/project/summai.png"
live_demo: ''
case_study: ''
category: Cloud
overview:
- label: Kunde
  data: Otto.ai
- label: Branche
  data: startup
- label: Ort
  data: Munich, Germany
- label: Category
  data: Cloud, AI
- label: Expertise
  data: AWS, Microservices, Terraform
- label: Zeitraum
  data: 2022-2022

---

## Zusammenfassung

KI-Startup, das Sprache mit Transformer MLP-Modellen vereinfacht
https://summ-ai.com/ 
Umwandlung einer bestehenden MariaDB-, Django- und ML-Architektur in eine serverlose AWS-Architektur.

## Stichpunkte

AWS, ETL Pipelines, Tensorflow, SQL, Django, Docker, AWS ECS, AWS Security, AWS API Gateway

## Beschreibung

Ziel war es, die bestehende Python/MariaDB/ML-Architektur in ein serverloses Format zu konvertieren und sie automatisch skalierend und sicher zu AWS zu übertragen. 
Die bestehende Architektur war nicht sicher und ließ sich nicht skalieren. Die einzelnen Komponenten wurden isoliert, in Docker-Images verpackt und in privaten VPCs mit AWS ECS und API Gateway bereitgestellt, um maximale Sicherheit der "geheimen" Modelle zu gewährleisten. Die Architektur wurde in Terraform geschrieben und wird über eine CI/CD-Pipeline mit Github-Aktionen bereitgestellt. Die Architektur entspricht der AWS-Spezifikation "well-architected".

[Arbeiten Sie an einem ähnlichen Projekt? Sind Sie an etwas Ähnlichem interessiert? Kontaktieren Sie uns jetzt für eine kostenlose 15-minütige Beratung.](/de/contact/)
