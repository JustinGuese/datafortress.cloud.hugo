---
title: Porsche AR Viewer
date: '2018-09-24T14:48:03.000+06:00'
description: This is meta description
bg_image: "/images/discovar-ar-viewer-300x151.webp"
image: "/images/discovar-ar-viewer-300x151.webp"
live_demo: ''
case_study: ''
category: Augmented Reality
overview:
- label: Client
  data: Während meiner Arbeit bei der Porsche Holding
- label: Category
  data: Augmented Reality
- label: Expertise
  data: Mobile App
- label: Date
  data: 22 nov, 2019

---
Der Porsche AR Viewer ist eine Augmented Reality-App, die ich während meiner Zeit bei Porsche Austria entwickelt habe.  
Die Anforderung entstand, als eine Lösung benötigt wurde, um die Werbung zu bereichern und die Aufmerksamkeit jüngerer potentieller Kunden zu erregen.

> Experten behaupten, dass die AR/VR-Industrie bis 2025 einen Wert von über 25 Milliarden Dollar haben wird, Tendenz steigend.

[Quelle](https://medium.com/predict/the-future-of-augmented-reality-90143b98f7a3)

Die App kann heruntergeladen werden über:

- [Appstore](https://apps.apple.com/at/app/porsche-ar-viewer/id1339643671)  
- [Playstore](https://play.google.com/store/apps/details?id=at.digitalsolutions.porschearviewer)

[Allgemeine Produktseite: ](http://www.discovar.at/)[http://www.discovar.at](http://www.discovar.at "http://www.discovar.at")

### DIE HERAUSFORDERUNG

Zuerst analysierten wir den Markt, stellten aber bald fest, dass es keine echte App gab, die unsere Anforderungen erfüllt.  
Daher programmierte ich den ersten Entwurf unserer App unter Verwendung der Spielentwicklungsmaschine Unity in Kombination mit Vuforia, die derzeit eine der besten Augmented-Reality-Bibliotheken für AR/VR-Inhalte ist.

### DIE STRATEGIE

Die App hat großartig funktioniert, aber wir haben unsere Entscheidungen revidiert, weil das Unternehmenspreismodell der Vuforia zu hoch war und wir daher nicht genug Geld für Werbung und weitere Verbesserungen übrig gelassen hätten.  
Nach einigen Recherchen entdeckte ich eine alternative Bibliothek, nämlich Wikitude. Ihre Bibliothek bot die Funktionalitäten, die wir wollten, zu einem deutlich niedrigeren Preis.  
Außerdem ließ ich die Unity-Gaming-Engine weg und beschloss, eine native Anwendung für iOS und Android zu programmieren, da sich die Skalierung und Leistung auf diese Weise stark verbesserte.

Das war ein gutes Beispiel dafür, wann es sich auszahlt, andere Möglichkeiten in Betracht zu ziehen und bei einigen Projekten sogar den Nichtmarktführer in Betracht zu ziehen, auch wenn das zu einer Richtungsänderung und einem Neustart führt - denn nur die besten Produkte werden wirklich großartig sein.

##### Letzte Verbesserungen

Nach der ersten veröffentlichten Version ruhte ich mich nicht aus, sondern evaluierte, wie die App weiter verbessert werden könnte.  
Ein schmerzlicher Punkt war, dass zusätzliche Inhalte in die App selbst programmiert werden mussten, was zu einer enormen Verzögerung führte, da der Apple iOS-Store jede App nach der Einreichung neu bewerten muss, was eine lange Zeitspanne in Anspruch nimmt, bis die neuen Inhalte online sind. Dies kann ein Problem darstellen, wenn der Kunde nicht so viel Zeit zum Warten hat. Dasselbe gilt für Änderungen an der App in letzter Minute, was mit dem Apple-Überprüfungsverfahren einfach nicht möglich war.

Deshalb habe ich nach anderen Lösungen gesucht und einen Weg gefunden, neue Inhalte im Wikitude Studio Web-Editor zu generieren, Änderungen in einen AWS S3-Behälter hochzuladen und die Anwendung zieht die neuen Inhalte aus dem S3-Behälter. Daher musste die Anwendung selbst nur einmal bei den Appstores eingereicht werden, und jede Änderung wurde sofort aus einem S3-Eimer gezogen. Ein netter Nebeneffekt war, dass auch die Größe der App stark reduziert wurde, da der Inhalt dynamisch aus dem Eimer gezogen wurde, wenn ein Trigger gescannt wurde, anstatt jeden Inhalt in der App selbst zu speichern.



[Sie haben eine ähnliche Idee oder wir haben Ihr Interesse geweckt? Kontaktieren Sie uns jetzt für eine gratis 15-minütige Beratung!](https://www.datafortress.cloud/de/contact/)
