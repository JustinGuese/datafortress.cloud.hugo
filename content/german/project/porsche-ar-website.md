---
title: 'Website: Porsche AR Viewer'
date: '2018-09-24T14:48:03.000+06:00'
description: This is meta description
bg_image: "/images/annotation-2020-04-06-145542-768x682.webp"
image: "/images/annotation-2020-04-06-145542-768x682.webp"
live_demo: ''
case_study: ''
category: Augmented Reality
overview:
- label: Client
  data: Während meiner Arbeit bei der Porsche Holding
- label: Category
  data: Cloud
- label: Expertise
  data: Serverless Cloud Hosting
- label: Date
  data: Dec, 2018

---
Die Website für den Porsche AR Viewer ([http://www.discovar.at](http://www.discovar.at "http://www.discovar.at")) hatte besondere Anforderungen. Zum einen sind die Sicherheitsrichtlinien für die Porsche Holding immens hoch, zum anderen musste eine Lösung gefunden werden, um die Website zu minimalen Kosten zu hosten. Beide Herausforderungen wurden auf ihre eigene Weise gelöst.

### DIE HERAUSFORDERUNG

Der erste Ansatz war ein klassisches CMS, das auf einem LAMP-Stack gehostet wurde, aber schon bald sprengten die Richtlinien zum Hosting das Budget. Es wurde eine andere Lösung benötigt. Ich schlug die Idee einer statischen Website vor, die auf einem AWS S3-Bucket gehostet wird, weil ohne ein CMS oder irgendwelche dynamischen Teile der Website (PHP, ...) die Website "serverlos" und damit grundsätzlich unhackbar wird. Die Website wurde von mir mit HTML5 und Bootstrap programmiert.

### DIE STRATEGIE

Es gab kaum ein Budget für das Hosting. Zusammen mit den oben genannten Bedingungen war ein klassischer Serveraufbau nicht denkbar. Zusammen mit den Sicherheitsrichtlinien entschied ich mich dafür, die statische Website auf einem AWS S3-Bucket zu hosten, was bedeutet, dass man im Grunde nur für die Nutzung, d.h. wenn jemand die Website aufruft, zahlt, anstatt eine feste monatliche Gebühr zu bezahlen. Zusätzlich beinhaltet der AWS ein "Free Tier Limit", d.h. eine monatliche kostenlose Menge an Speicherplatz und Übertragung, die kostenlos in Ihrem Konto enthalten ist - und daher oft zu einer kostenlos gehosteten Website führt.

Welche Erfahrungen haben Sie mit statischen Websites gemacht? Haben Sie ein Webprojekt, das möglicherweise Geschwindigkeit, Sicherheit und Kostenverbesserung benötigt? Kommentieren Sie unten oder schreiben Sie mir direkt eine Nachricht.




[Sie haben eine ähnliche Idee oder wir haben Ihr Interesse geweckt? Kontaktieren Sie uns jetzt für eine gratis 15-minütige Beratung!](https://www.datafortress.cloud/de/contact/)
