---
author: Justin Guese
bg_image: /images/blog/serverless-website.png
categories:
- serverless
date: 2022-06-17 11:10:07+06:00
description: Ich habe mich entschieden, WordPress hinter mir zu lassen., und gehen
  Sie zu serverlos, schnelle, unhackbare statische Websites stattdessen
image: /images/blog/serverless-website.png
tags:
- cloud
- websites
- serverless
title: Der Wechsel von Wordpress zu Serverless, unhackbare statische Hochgeschwindigkeits-Websites
type: post
---

# Umstieg von Wordpress auf serverlos, unhackbare statische Hochgeschwindigkeits-Websites



Ich habe in der Vergangenheit Websites erstellt, haben aber immer mit der langsamen Leistung von WordPress zu kämpfen gehabt. Wenn es mit Plugins geladen ist, es braucht einige Ressourcen und kann mühsam sein, wenn man nur eine Idee auf einem kleinen Server entwickelt. 


Zusätzlich, auch die Sicherheit ist von Bedeutung, und als ein System, das [33,6% der Websites verwenden](https://en.wikipedia.org/wiki/WordPress), es ist für Hacker sehr attraktiv, darin Sicherheitslücken und andere Probleme zu finden. 
Aber wieder, da sie sehr beliebt ist, es gibt fast immer ein Plugin für die Probleme, die Sie haben, was die Nutzung erleichtert, und ein großartiges \All-in-One\-Tool.




## Idee 1: Verbesserung der WordPress-Entwicklung



Eines der ersten Dinge, die ich in der Vergangenheit getan habe, war, WordPress lokal zu entwickeln (e.g. [siehe diesen AWS-Beitrag](https://www.smashingmagazine.com/2018/04/wordpress-local-development-beginners-setup-deployment/)), und dann einfach das Ergebnis auf einem Server veröffentlichen. Die Programmier- und Schreibgeschwindigkeit ist enorm gestiegen., aber das Hochladen erwies sich als Problem, da WordPress-Links in der Regel in der verwendeten SQL-Datenbank \fest verdrahtet\ sind. Das bedeutet, dass sich alle meine Links auf \https://www\ bezogen haben..datafotress.Cloud\ (Arbeitsplatz) anstelle der Zieldomäne. Es gibt Möglichkeiten, dieses Problem zu lösen, wie das Umschreiben Ihrer URLs in SQL, oder die Verwendung von htaccess-Regeln zum Umschreiben der \alten\ URLs auf die \neuen\ URLs, aber dennoch, es war sehr mühsam, in Gang zu kommen. 




## Idee 2: Online-Entwicklung mit ausgelagerten Mediendateien



Das Problem der URL-Umschreibung ging mir sehr schnell auf die Nerven, und die lokale Entwicklung ist schlecht für mehrere Entwickler. Deshalb habe ich beschlossen, wieder \online\ zu gehen., und arbeiten \mit der Wolke\. Die von mir verfolgte Architektur bestand darin, einen Entwicklungsserver einzusetzen, die nur für Entwickler zugänglich ist, und zum Hochladen von Mediendateien auf einen gemeinsam genutzten Speicher (AWS S3), von dem die Endbenutzer die Mediendateien abrufen. Als Mediendateien (Bilder, Videos, ...) sind die anspruchsvollsten Teile von WordPress, Geschwindigkeit drastisch erhöht, und zusätzlich, es war einfach, ein CDN darauf einzurichten, was im Grunde bedeutet, dass die Mediendateien in der ganzen Welt mit unbegrenzter Kapazität bereitgestellt werden (im Grunde serverlos). Dies bedeutet, dass ein Nutzer in e.g. Puerto Rico muss nicht auf meinen Server in Frankfurt zugreifen, hat aber eine \lokale\ Kopie in seiner Nähe. Zusätzlich, da der \schwere\ Teil von WordPress \outgesourct\ wurde, nur \kleine\ Server wurden benötigt, um PHP-Anfragen und die \Back-Office\-Teile von WordPress zu bearbeiten. Du kannst mich gerne in den Kommentaren oder per Direktnachricht fragen., oder [sehen Sie sich einen ähnlichen Ansatz von AWS an](https://devops.com/hosting-skalierbar-wordpress-auf-aws/).

![Architektur für wordpress auf AWS](/images/blog/Webp.net-resizeimage.png)

Zusammen mit Autoscaling, dies schien die idealste Einstellung für WordPress zu sein, und es erwies sich als großartig. BUT...


Sie müssen noch nach Plugin-Updates suchen, Sicherheit, und Überwachung im Allgemeinen. Auch wenn AWS viel dazu beiträgt, dass diese Architektur sehr robust und schnell ist, es besteht weiterhin eine hohe operative Nachfrage. Zusätzlich, Durchführung einer separaten Entwicklung, Datenbank, Lastausgleich, und so weiter auf dem Server kann recht kostspielig sein, insbesondere für eine Website, die nicht viele Nutzer hat. 
Und was hat Werner Vogels auf der re:invent 2015 gesagt?

> **\Kein Server ist leichter zu verwalten als kein Server \**
>
> Werner Vogels auf der re:invent 2015


## Exkursion: Eine kurze Geschichte des Code of Web




WordPress ist ideal für Autoren und Redakteure, aber aus der Sicht eines Lösungsarchitekten ist es nicht großartig. Und warum? Auch wenn alles anklickbar ist, leicht zu handhaben, und so weiter, alle Ressourcen und Informationen werden im Hintergrund aus einer Datenbank bezogen, auch wenn es zum 100000sten Mal an diesem Tag gezogen wird. Es gibt Methoden zur Verringerung der Abfragelast auf SQL-Datenbanken, wie Redis und Memcached, aber warum sollte ich für jeden einzelnen Nutzer die gleiche Webseite \berechnen\? \Früher\, Websites luden in Sekundenschnelle (es sei denn, jemand hat telefoniert) und sie waren super klein - was hat sich geändert? Zusammen mit neuen Design-Anforderungen, die heutigen Websites sind voll von Effekten und Designs, die viel Rechenleistung erfordern. Auch wenn dies definitiv eine Verbesserung gegenüber dem Schwarz-Weiß-Stil der 90er Jahre ist, die Ladezeiten von Websites haben sich dramatisch verlängert - zumal der weltweite Verbindungsstandard immer noch das Mobilfunknetz ist. 



Um alle Effekte wiederzugeben, PHP-Code wird im Hintergrund verwendet, Code, der auf dem Server selbst ausgeführt wird. Das bedeutet, dass jedes Mal, wenn ein Nutzer eine Verbindung zu einer Website herstellt, der Server berechnet die Website, die er dem Nutzer anzeigen wird. In den 90er Jahren bestand die Website nur aus einfachem HTML-Code., die im Grunde einfache Anweisungen an den Browser sind, wie er Dinge zu behandeln hat. So wie der <h1>-Tag dem Browser mitteilt, dass dies eine Überschrift ist, und <p> ist ein Absatz. Es sind keine (Entschuldigung für die Reduzierung der Komplexität!) Berechnungen erforderlich.. 



Zusätzlich, Javascript und CSS gehen einen ähnlichen Weg, da CSS das Design in einem ähnlichen Ansatz wie HTML beschreibt, und Javascript wird nicht auf dem Server ausgeführt, sondern auf der Client-Seite. Das bedeutet, dass der Server sich nicht selbst berechnet, sondern \sendet Anweisungen\ an den Browser des Kunden (e.g. Ihr Telefon). 



Warum verwenden wir also nicht einfach HTML, Javascript, und CSS? Mit PHP können wir viele Dinge tun, und Frameworks zur Erstellung von Inhalten wie WordPress machen uns das Leben leichter. Aber die effizienteste Art, Websites zu produzieren, wäre, sie einmal zu erstellen und sie dann einfach fertig gerendert an die Massen zu verteilen. 





## Idee 4: Zurück zu den Wurzeln




Will ich damit sagen, dass wir zu den schwarz-weißen HTML-Seiten der 90er Jahre zurückkehren sollten? Natürlich nicht, aber die Kombination von HTML und CSS kann großartige Ergebnisse liefern, und Javascript wird mehr und mehr in der Lage sein, Prozesse zu bewältigen, die früher nur PHP bewältigen konnte. Und wenn Berechnungen erforderlich sind, es gibt großartige neue serverlose Möglichkeiten wie AWS Lambda (in meinem Blog finden Sie einige Anwendungen von Lambda). 



Zurück zum Hauptthema, Ich habe beschlossen, meinen Blog und alle künftigen Websites in einfachem HTML zu schreiben., CSS, und JS, da ich es nicht nötig habe

1. **einen Server verwalten** - ich kann ihn einfach fast kostenlos auf Github oder AWS S3 hosten
2. **Sorgen Sie sich um hohe Anforderungen** - S3 und Github skalieren automatisch, das heißt, wenn Tausende von Besuchern auf meiner Website eintreffen, wird mein Server nicht zusammenbrechen
viel bezahlen - da ich nicht so viele Berechnungen brauche wie bei WordPress, Der Betrieb dieses Blogs ist völlig kostenlos
3. **Sie brauchen sich keine Sorgen um Sicherheitsprobleme zu machen** - mein Blog ist im Grunde unhackbar


Zusätzlich, die Website ist rasend schnell, mit einer Google Pagespeed-Bewertung von 100%, was auch einen großen Einfluss auf das Page Ranking hat, da Google Hochgeschwindigkeits-Websites bevorzugt. Der einzige Grund, warum der aktuelle Punktestand bei 90 % liegt, ist, ist, dass ich beschlossen habe, CRM- und Tracking-Tools in meinen Blog aufzunehmen. Wann haben Sie das letzte Mal gesehen, dass eine kostenlose Website diese Punktzahl erreicht hat?


Alles in allem, es ist einfach großartig, aber schreibe ich den gesamten HTML-Code selbst?





## Wir stellen vor: Statische Website-Generatoren




Natürlich nicht, und zum Glück gibt es großartige Tools, die das für mich erledigen. Statische Website-Baukästen wie [Jekyll](https://jekyllrb.com/) oder [Hugo](https://gohugo.io/) hilft Ihnen dabei, Ihre Texte in Markdown (im Grunde eine einfache Textdatei) zu schreiben und in HTML und eine schöne Website umzuwandeln.. Der Code wird nur einmal berechnet und kann auf einen Server hochgeladen werden, oder Github-Seiten und AWS S3 sofort vollständig serverlos sein. [Wie funktioniert das? Eine ausführliche Erklärung finden Sie in meinen Fallstudien in meinem Blog](/project/serverless-static-website/).





## Zusammenfassung




Es ist ein tolles Gefühl, sich keine Gedanken über die Betriebszeit machen zu müssen, Skalierung, und Sicherheit nicht mehr. Ist es schwieriger als WordPress? Das kommt darauf an. Da sich diese Technologie gerade entwickelt, es muss ein Umdenken stattfinden, wenn Sie in der Vergangenheit mit WordPress und anderen gearbeitet haben, aber auch hier gibt es viele großartige Tools, die statische Website-Builder ähnlich der \bekannten\ WordPress-Umgebung erstellen, wie Forstwirtschaft.io zum Beispiel. Wie? [Besuchen Sie meinen Blog unter www.datafortress.Cloud, um die ausführliche Erklärung zu sehen](/project/serverless-static-website/). 
Im Moment, Es würde mich interessieren, ob Sie jemals versucht haben, serverlos zu arbeiten., oder wie Ihre Erfahrungen mit WordPress sind. [Schicken Sie mir eine Nachricht, oder schreiben Sie einen Kommentar unten](/kontakt/). 

