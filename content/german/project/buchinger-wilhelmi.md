---
title: Buchinger Wilhelmi Private Cloud
date: '2022-09-24T14:48:03.000+06:00'
description: "Aufbau einer sicheren und DSGVO-konformen privaten Cloud mit Data Warehouse und datengesteuerten Analysen/Modellen"
bg_image: "/images/project/buchinger-wilhelmi.webp"
image: "/images/project/buchinger-wilhelmi.webp"
live_demo: ''
case_study: ''
category: Cloud
overview:
- label: Kunde
  data: Buchinger Wilhelmi
- label: Branche
  data: Healthcare
- label: Ort
  data: Überlingen, Germany
- label: Expertise
  data: Kubernetes, Data Engineering, Hybrid Cloud
- label: Zeitraum
  data: 2020-

---

## Zusammenfassung

Aufbau einer sicheren und DSGVO-konformen privaten Cloud mit Data Warehouse und datengesteuerten Analysen/Modellen

## Stichpunkte

Kubernetes, K3s, Terraform, Linux, AWS, ETL Pipelines, OpenStack, Docker Swarm, HL7, Tensorflow, Elasticsearch, SQL, NoSQL, Prefect, Dask, CI/CD Pipelines, Machine Learning, Tensorflow, ArgoCD, Github Actions, Keycloak, Microservices, FastAPI

## Beschreibung

Ziel des Projekts ist es, aus bestehenden und zukünftigen Daten eine Datenlandschaft aufzubauen, die dann genutzt werden kann, um Geschäftsprozesse besser zu verstehen und mithilfe von maschinellem Lernen automatisch datengestützte Empfehlungen und Entscheidungen zu treffen. 

Eine besondere Herausforderung war der Umgang mit sensiblen Patientendaten, weshalb die Anforderungen der Datenschutz-Grundverordnung (DSGVO) und des baden-württembergischen Krankenhaus-IT-Gesetzes erfüllt werden mussten.
Die erste Phase des Projekts bestand daher aus der Planung und engen Abstimmung mit mehreren Anwaltskanzleien, um die Vorgaben der Krankenhausgesetze zu erarbeiten und zu planen.

Die ursprüngliche Architektur war serverless auf AWS aufgebaut, wurde dann aber aufgrund der gesetzlichen Vorgaben für medizinische Daten auf Kubernetes umgestellt. Hohe Datensicherheit war eine Anforderung, da hochsensible medizinische Daten verwendet und analysiert werden, was eine ISO-Zertifizierung und die Verwaltung von HL7-Daten erfordert. 
Ich habe dann einen BareMetal-Kubernetes-Cluster auf der Hetzner Cloud mit K3s, Terraform und MicroOS eingerichtet, der automatisch horizontal skaliert, die Last ausgleicht und automatisch Zertifikate erstellt (https://github.com/kube-hetzner/terraform-hcloud-kube-hetzner). Der Cluster und das Deployment werden kontinuierlich überwacht und Fehler automatisch behoben. Neben den Sicherheitsaspekten können wir damit auch 90 % der Kosten im Vergleich zu AWS EKS einsparen.

Im Bereich der Analytik haben wir ein Dashboard für NoSQL- und SQL-Daten sowie ETL-Pipelines zur Erstellung eines Data Warehouse erstellt. 

Beim maschinellen Lernen bestand ein Ziel darin, hoch skalierbare Modelle in der Cloud auszuführen, um Entscheidungen zu treffen und Kunden und App-Nutzer in Millisekunden zu klassifizieren. 

Um die Customer Journey zu verbessern, wurde für jeden Kunden ein "Profil" erstellt, gefolgt von einer manuellen Analyse, einer Klassifizierung mithilfe von Data Science und einer Zwillings-Kundenanalyse.  

[Arbeiten Sie an einem ähnlichen Projekt? Sind Sie an etwas Ähnlichem interessiert? Kontaktieren Sie uns jetzt für eine kostenlose 15-minütige Beratung.](/de/contact/)
