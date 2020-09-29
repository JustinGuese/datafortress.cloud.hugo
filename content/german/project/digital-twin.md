---
title: Digital Twin
date: '2018-09-24T14:48:03.000+06:00'
description: This is meta description
bg_image: "/images/porsche-bigdata-digital-twin-768x387.webp"
image: "/images/porsche-bigdata-digital-twin-768x387.webp"
live_demo: ''
case_study: ''
category: Big Data
overview:
- label: Client
  data: Während meiner Arbeit bei der Porsche Holding
- label: Category
  data: Big Data
- label: Expertise
  data: Stream Data processing in NoSQL
- label: Date
  data: 2016-2019

---
> "Ein digitaler Zwilling ist eine digitale Replik einer lebenden oder nicht lebenden physischen Einheit".

[Quelle](https://en.wikipedia.org/wiki/Digital_twin)

Ein digitaler Zwilling im Marketing ist ein Benutzer, der einem Benutzer ähnlich ist, der bereits auf Ihrer Website war.  
Dies geschieht, weil Sie bereits wissen, welche Produkte oder Seiten der Benutzer sich angesehen hat, und weil Sie mit der gleichen Erfahrung ein ähnliches Angebot machen können.  
Aber wie wird das gemacht?

### DIE HERAUSFORDERUNG

Porsche brauchte einen anderen Weg, um die Marketingkosten zu senken und die Zielgenauigkeit zu erhöhen.

### DIE STRATEGIE

##### Große Datenaspekte eines digitalen Zwillings

Zunächst haben wir alle Web-Ereignisse unserer Websites in einer No-SQL-Datenbank namens Elasticsearch gespeichert. Elasticsearch ist eine großartige Anwendung für textbasierte Suche und schnelle Abfragen in großen Datenbanken mit Lucene.

##### Graphische Suche in Elasticsearch

Vereinfacht haben wir eine in Elasticsearch ([Link](https://www.elastic.co/de/what-is/elasticsearch-graph)) integrierte Graphensuche verwendet, um Benutzer zu finden, die dem aktuellen Benutzer ähnlich sind. Über REST-API-Aufrufe mit den passenden Lucene-Abfragen wurden ähnliche Produkte von digitalen Zwillingen extrahiert und dem aktuellen Benutzer als Empfehlungen präsentiert.

##### Herausforderungen bei der Verwendung von Elasticsearch für digitale Zwillinge

Eine große Herausforderung in diesem Szenario war die Geschwindigkeit. Benutzer verlassen in der Regel eine Website, wenn sie länger als 250 ms geladen wird. Dies führt zu einer drastischen Ausweitung: 11 % der Benutzer verlassen die Website nach einer Sekunde Ladezeit, und etwa 90 % mit mehr als vier Sekunden Ladezeit ([Quelle](https://think.storage.googleapis.com/docs/mobile-page-speed-new-industry-benchmarks.pdf)). Daher mussten wir den Cluster Elasticsearch optimieren und unsere Abfragen teilweise vereinfachen, um eine Ladezeit von etwa 200 ms zu erreichen. Und wie? Hinterlassen Sie unten eine Nachricht oder kontaktieren Sie mich, um mehr darüber zu erfahren.




[Sie haben eine ähnliche Idee oder wir haben Ihr Interesse geweckt? Kontaktieren Sie uns jetzt für eine gratis 15-minütige Beratung!](https://www.datafortress.cloud/de/contact/)
