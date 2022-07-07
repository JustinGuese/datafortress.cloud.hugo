---
title: Von Wordpress zu serverlosen, unhackbaren statischen Hochgeschwindigkeits-Webseiten
bg_image: "/images/blog/serverless-website.png"
date: 2022-05-17T11:10:07.000+06:00
description: Ich habe mich entschieden, WordPress hinter mir zu lassen und stattdessen zu serverlosen, nicht hackbaren statischen Hochgeschwindigkeits-Websites zu wechseln.
author: Justin Guese
image: "/images/blog/serverless-website.png"
categories:
- serverless
tags:
- cloud
- websites
- serverless
type: post

---
# Von Wordpress zu serverlosen, unhackbaren statischen Hochgeschwindigkeits-Websites



Ich habe in der Vergangenheit Websites erstellt, aber immer mit der langsamen Leistung von WordPress zu kämpfen gehabt. Wenn es mit Plugins geladen ist, wird es ziemlich viele Ressourcen benötigen und kann eine Qual sein, wenn Sie gerade eine Idee auf einem kleinen Server entwickeln. 


Darüber hinaus ist auch die Sicherheit ein Thema, und als ein System, das [33,6% der Websites benutzen](https://en.wikipedia.org/wiki/WordPress), ist es für Hacker recht attraktiv, Exploits und andere Probleme darin zu finden. 
Aber wie gesagt, da es massiv populär ist, gibt es fast jedes Mal ein Plugin für die Probleme, die Sie haben, wodurch es einfach zu benutzen ist, und ein großartiges "All-in-one"-Tool.




## Idee 1: Verbesserung der WordPress-Entwicklung



Eines der ersten Dinge, die ich in der Vergangenheit getan habe, war, WordPress lokal zu entwickeln (z.B. [siehe diesen AWS-Post](https://www.smashingmagazine.com/2018/04/wordpress-local-development-beginners-setup-deployment/)), und dann einfach das Ergebnis auf einem Server zu veröffentlichen. Die Programmier- und Schreibgeschwindigkeiten stiegen enorm an, aber der Teil des Hochladens erwies sich als ein Problem, da WordPress-Links normalerweise fest mit der verwendeten SQL-Datenbank "verdrahtet" sind. Das bedeutet, dass alle meine Links auf "https://www.datafotress.cloud" (Mein Computer) und nicht auf die Zieldomäne verwiesen. Es gibt Möglichkeiten, dies zu lösen, wie z.B. das Neuschreiben Ihrer URLs in SQL oder die Verwendung von neu geschriebenen htaccess-Regeln, um "alte" URLs auf die "neuen" zu verweisen, aber es war trotzdem sehr schwierig, den Anfang zu machen. 




## Idee 2: Online-Entwicklung mit entladenen Mediendateien



Dieses Problem der URL-Umschreibung ging mir sehr schnell auf die Nerven, und die lokale Entwicklung ist schlecht für mehrere Entwickler. Deshalb beschloss ich, wieder "online zu gehen" und "mit der Cloud" zu arbeiten. Die Architektur, der ich gefolgt bin, bestand darin, einen Entwicklungsserver bereitzustellen, der nur für Entwickler zugänglich ist, und Mediendateien auf einen gemeinsamen Speicher (AWS S3) hochzuladen, von dem die Endbenutzer die Mediendateien abrufen. Da Mediendateien (Bilder, Videos, ...) die anspruchsvollsten Teile von WordPress sind, hat sich die Geschwindigkeit drastisch erhöht, und zusätzlich war es einfach, ein CDN darüber einzurichten, was im Grunde bedeutet, dass die Mediendateien weltweit mit unbegrenzter Kapazität (im Grunde serverlos) bereitgestellt werden. Das bedeutet, dass ein Benutzer in z.B. Puerto Rico nicht auf meinen Server in Frankfurt zugreifen muss, sondern eine "lokale" Kopie in seiner Nähe hat. Da außerdem der "schwere" Teil von WordPress "ausgelagert" wurde, wurden nur "kleine" Server benötigt, um PHP-Anfragen und die "Back-Office"-Teile von WordPress zu bearbeiten. Bitte zögern Sie nicht, mich in den Kommentaren oder einer direkten Nachricht mehr darüber zu fragen, oder [sehen Sie sich einen ähnlichen Ansatz von AWS an](https://devops.com/hosting-scalable-wordpress-on-aws/).

![Architektur für WordPress auf AWS](/images/blog/Webp.net-resizeimage.png)

Zusammen mit Autoscaling schien dies das ideale Setup für WordPress zu sein, und es erwies sich als großartig. ABER...


Sie mussten noch nach Plugin-Updates, Sicherheit und Überwachung im Allgemeinen suchen. Auch wenn AWS viel dazu beiträgt, diese Architektur recht belastbar und schnell zu machen, gibt es immer noch einen hohen operativen Bedarf. Außerdem kann der Betrieb einer separaten Entwicklung, Datenbank, Lastverteilung usw. auf dem Server ziemlich teuer sein, besonders für eine Website, die nicht viele Benutzer hat. 
Und was hat Werner Vogels bei re:invent 2015 gesagt?

> **"Kein Server ist einfacher zu verwalten als kein Server "**
> 
> Werner Vogels bei re:invent 2015


## Exkursion: Eine kurze Geschichte des Codes vom Netz




WordPress ist großartig für Autoren und Redakteure, aber aus der Perspektive eines Lösungsarchitekten ist es nicht großartig. Warum? Obwohl alles anklickbar, einfach zu handhaben usw. ist, werden alle Ressourcen und Informationen aus einer Datenbank im Hintergrund abgerufen, auch wenn sie an diesem Tag zum 100000sten Mal abgerufen wird. Es gibt Methoden, um die Abfragelast auf SQL-Datenbanken zu reduzieren, wie Redis und Memcached, aber warum sollte ich für jeden einzelnen Benutzer dieselbe Webseite "berechnen"? "Früher wurden Webseiten in Sekundenschnelle geladen (es sei denn, jemand war am Telefon) und sie waren superklein - was hat sich geändert? Zusammen mit den neuen Design-Anforderungen sind die heutigen Websites voller Effekte und Designs, die die Rechenressourcen stark beanspruchen. Auch wenn dies definitiv eine Verbesserung gegenüber dem Schwarz-Weiß-Stil der 90er Jahre darstellt, haben die Ladezeiten von Websites dramatisch zugenommen - zumal der weltweite Verbindungsstandard nach wie vor das Mobilfunknetz ist. 



Um alle Effekte zu rendern, wird im Hintergrund PHP-Code verwendet, also Code, der auf dem Server selbst ausgeführt wird. Das heißt, jedes Mal, wenn ein Benutzer eine Verbindung zu einer Website herstellt, berechnet der Server die Website, die er dem Benutzer zeigen wird. Die 90er-Jahre-Version von Websites enthielt nur einfachen HTML-Code, bei dem es sich im Grunde um einfache Anweisungen an den Browser handelt, wie die Dinge zu handhaben sind. Wie der <h1>-Tag dem Browser mitteilt, ist dies eine Überschrift, und <p> ist ein Absatz. Es sind keine (sorry für die Reduzierung der Komplexität!) Berechnungen erforderlich. 



Außerdem gehen Javascript und CSS einen ähnlichen Weg, da CSS das Design in einem ähnlichen Ansatz wie HTML beschreibt und Javascript nicht auf dem Server, sondern auf der Client-Seite ausgeführt wird. Das heißt, der Server berechnet sich nicht selbst, sondern "sendet Anweisungen" an den Browser des Clients (z.B. Ihr Telefon). 



Warum verwenden wir also nicht einfach HTML, Javascript und CSS? Mit PHP können wir viele Dinge tun, und es ermöglicht uns die Erstellung von Frameworks zur Inhaltserstellung wie WordPress, um uns das Leben zu erleichtern. Aber der effizienteste Weg, Webseiten zu erstellen, wäre, sie einmal zu generieren und dann einfach die bereits gerenderten Seiten an die Massen zu verteilen. 





## Idee 4: Rückbesinnung auf die Wurzeln 




Sage ich also, dass wir zu den schwarz-weißen HTML-Seiten der 90er Jahre zurückkehren sollten? Natürlich nicht, aber die Kombination von HTML und CSS kann großartige Ergebnisse erzielen, und Javascript wird immer mehr in der Lage, Prozesse zu verarbeiten, die früher nur PHP beherrschte. Und wenn Berechnungen erforderlich sind, gibt es großartige neue serverlose Möglichkeiten wie AWS Lambda (in meinem Blog finden Sie einige Anwendungen von Lambda). 



Um zum Hauptthema zurückzukommen, habe ich beschlossen, meinen Blog und alle zukünftigen Websites in einfachem HTML, CSS und JS zu schreiben, da ich nicht 

1. **einen Server managen** - Ich kann ihn einfach fast kostenlos auf Github oder AWS S3 hosten
2. **sich um hohe Anforderungen kümmern** - S3 und Github skalieren automatisch, d.h. wenn Tausende von Besuchern auf meine Website kommen, stürzt mein Server nicht ab
viel bezahlen - da ich nicht so viele Berechnungen wie bei WordPress benötige, ist der Betrieb dieses Blogs völlig kostenlos
3. **Sie müssen sich keine Sorgen über Sicherheitsfragen machen** - mein Blog ist im Grunde unhackbar


Darüber hinaus ist die Website blitzschnell, mit einem Google Pagespeed-Score von 100%, was sich auch auf das Page Ranking auswirkt, da Google Hochgeschwindigkeits-Websites bevorzugt. Der einzige Grund, warum der aktuelle Wert auf 90 % gesunken ist, ist, dass ich mich entschlossen habe, CRM- und Tracking-Tools in meinen Blog aufzunehmen. Wann haben Sie das letzte Mal gesehen, dass eine kostenlose Website diesen Wert erreicht hat?


Alles in allem ist sie einfach großartig, aber schreibe ich den gesamten HTML-Code selbst?





## Darf ich vorstellen: Statische Website-Generatoren




Natürlich nicht, und glücklicherweise gibt es für mich großartige Werkzeuge, um damit umzugehen. Statische Website-Ersteller wie [Jekyll](https://jekyllrb.com/) oder [Hugo](https://gohugo.io/) helfen sehr dabei, dass Sie im Grunde nur die Markdown-Sprache (im Grunde eine einfache txt-Datei) eingeben und Ihre Texte in HTML und eine schöne Website umwandeln können. Der Code wird nur einmal berechnet und kann auf einen Server hochgeladen werden, oder Github-Seiten und AWS S3 sofort, um völlig serverlos zu sein. Wie funktioniert das? Schauen Sie sich meine Fallstudien in meinem Blog an, um eine ausführliche Erklärung zu erhalten.





## Zusammenfassung




Es ist ein tolles Gefühl, sich keine Sorgen mehr über Betriebszeit, Skalierung und Sicherheit zu machen. Ist es schwieriger als WordPress? Das hängt davon ab. Da sich diese Technologie gerade erst entwickelt, muss man umdenken, wenn man in der Vergangenheit mit WordPress und anderen gearbeitet hat, aber auch hier gibt es viele großartige Tools, die statische Website-Ersteller der "bekannten" WordPress-Umgebung ähnlich machen, wie z.B. forestry.io. Wie? Schauen Sie in meinem Blog unter www.datafortress.cloud nach, um die ausführliche Erklärung zu sehen](/project/serverless-static-website/). 
Im Moment würde es mich interessieren, ob Sie jemals versucht haben, serverlos zu arbeiten, oder welche Erfahrungen Sie mit WordPress gemacht haben. [Schießen Sie mir eine Nachricht, oder schreiben Sie unten einen Kommentar](/de/contact/) 

