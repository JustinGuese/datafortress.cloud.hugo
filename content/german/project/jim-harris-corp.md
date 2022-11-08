---
title: Jim Harris Real Time Stock Analytics
date: '2022-09-24T14:48:03.000+06:00'
description: "Australische Aktienmarktvorhersage innerhalb von 5 Sekunden.
Speicherung von Börsentickdaten und Aktienkursprognose."
bg_image: "/images/project/jim-harris.jpeg"
image: "/images/project/jim-harris.jpeg"
live_demo: ''
case_study: ''
category: Data
overview:
- label: Kunde
  data: Jim Harris Corp
- label: Branche
  data: Finance
- label: Ort
  data: Brisbane, Australia
- label: Category
  data: Data Engineering, Kubernetes, Tradingbot
- label: Zeitraum
  data: 2020-2022

---

## Zusammenfassung

Australische Aktienmarktvorhersage innerhalb von 5 Sekunden.
Speicherung von Börsentickdaten und Aktienkursprognose.

## Stichpunkte

AWS, ETL Pipelines, Tensorflow, Elasticsearch, NoSQL, Apache Kafka, Apache Flink, Python, Message Queues, Microservices (Lambda), Docker, Dask

## Beschreibung

Das Ziel war es, Livestreams von Tick-Börsendaten in Millisekunden zu verarbeiten und Entscheidungen über Handelsstrategien zu treffen. Im weiteren Verlauf wurde ein automatisierter Handelsbot entwickelt, der auf Basis von maschinellem Lernen Kaufentscheidungen trifft. 

Im Detail wurden ~120 Tickdaten/Sekunde verarbeitet, die an Apache Kafka (mittlerweile Flink) gesendet und dann von selbstskalierenden Microservices (AWS Lambda) verarbeitet wurden. Das Modell selbst wurde mit OpenFAAS in einem Docker Swarm-Cluster gehostet und führte Kaufentscheidungen über benutzerdefinierte APIs für ASX aus.

[Arbeiten Sie an einem ähnlichen Projekt? Sind Sie an etwas Ähnlichem interessiert? Kontaktieren Sie uns jetzt für eine kostenlose 15-minütige Beratung.](/de/contact/)
