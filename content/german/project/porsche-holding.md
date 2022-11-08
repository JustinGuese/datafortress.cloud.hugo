---
title: Porsche Holding Data Science
date: '2022-09-24T14:48:03.000+06:00'
description: "Aufbau von Data Warehouse und datengesteuerten Analysen/Modellen"
bg_image: "/images/project/porsche-holding.jpg"
image: "/images/project/porsche-holding.jpg"
live_demo: ''
case_study: ''
category: Data
overview:
- label: Kunde
  data: Porsche Holding
- label: Branche
  data: Automotive
- label: Ort
  data: Salzburg, Austria
- label: Expertise
  data: Data Engineering, Hybrid Cloud, Data Science
- label: Zeitraum
  data: 2016-2019

---

## Zusammenfassung

Aufbau von Data Warehouse und datengesteuerten Analysen/Modellen

## Stichpunkte

AWS, MS Azure, ETL Pipelines, Tensorflow, Elasticsearch, SQL, NoSQL, Kafka, Python

## Beschreibung

Ziel war es, verschiedene NoSQL- und SQL-Datenbanken in einem zentralen Data Warehouse und Data Lake zusammenzuführen. 
Die Daten mussten sowohl über Batch-Jobs in einem nächtlichen Prozess als auch "live" über Streaming mit Kafka von verschiedenen Endgeräten gesammelt werden. 

Eine besondere Anforderung des Projektes war, dass große Datenmengen zu verwalten waren (20+ Millionen Web-Events / Monat, 2 TB/Monat), sowie die Sicherheitsstandards der Volkswagen AG eingehalten werden mussten. Daneben war ich auch massiv an der Umsetzung der DSGVO-Standards beteiligt, sowie mit dem konzernweiten "Team Cloud" der Volkswagen AG am Ausbau der Cloud-Infrastruktur mit AWS und MS Azure. 

Für den Einsatz in Apps und auf Webseiten wurden verschiedene Recommender-Systeme entwickelt, die das perfekte Fahrzeug für einen Nutzer anzeigen sollen. Diese wurden auf einfache Weise mit Graphen in Elasticsearch und in komplexeren Szenarien mit vorberechneten Clustern oder Machine-Learning-Modellen umgesetzt, die mit OpenFAAS und Kubernetes ausgespielt wurden. 

Darüber hinaus wurden Machine-Learning-Modelle für die Vorhersage von Stückzahlen, Beständen und (Fahrzeug-)Kennzeichen entwickelt.

[Arbeiten Sie an einem ähnlichen Projekt? Sind Sie an etwas Ähnlichem interessiert? Kontaktieren Sie uns jetzt für eine kostenlose 15-minütige Beratung.](/de/contact/)
