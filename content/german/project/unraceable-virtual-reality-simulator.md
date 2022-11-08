+++
bg_image = "/images/img_1286-768x576.webp"
case_study = ""
category = "Virtual Reality"
description = ""
image = "/images/img_1286-768x576.webp"
live_demo = ""
title = "#unraceable Virtual Reality Simulator"
[[overview]]
label = "Client"
data = "Whilst working at Porsche Holding"
[[overview]]
label = "Time"
data = "2016-2019"

+++
Unraceable ist der Name eines **Virtual-Reality-Motionseat**-Projekts und einer **App**, das ich drei Jahre lang geleitet habe.  
Die Idee war, Ausstellungsräume zu verbessern und etwas zu schaffen, das den Menschen ein emotionales Erlebnis bietet.

<br>

<iframe width="555" height="312" src="https://www.youtube.com/embed/qGVJMVGnRaQ?list=PLTk7iL-rVXKkV0ZhCbx4y73LQmPK424CV" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<br>

Der Hauptkampagnenspot von "Audi #unraceable"

Die Anforderung sollte eine Verbesserung der "Audi Sandbox" sein, die von Audi Norwegen produziert wurde, wie Sie im folgenden Video sehen können.

<br>

<iframe width="1078" height="607" src="https://www.youtube.com/embed/s-L53WJIxoA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<br>

## THE CHALLENGE

Ter erste Meilenstein des Produkts hatte einen strengen Zeitplan und verlangte, dass die Kunden ihre Rennstrecke in einer Sandbox bauen, die dann gescannt und schließlich auf einen Virtual-Reality-Bewegungssitz übertragen wird.  
Die "Audi Sandbox" hatte das Problem, dass sie keinen Bewegungssitz enthielt und der "Scan"-Prozess größtenteils manuell war und viel Zeit in Anspruch nahm. Da das Projekt auf einer Messe präsentiert werden sollte, durfte der Scanvorgang nur maximal ein paar Minuten dauern, d.h. es musste ein neuer automatisierter Weg gefunden werden, um diese Strecke zu erstellen.

## THE STRATEGY

Für das Projekt haben wir mit einem Partner zusammengearbeitet und mit verschiedenen Möglichkeiten experimentiert, um diese Idee in die Realität umzusetzen. Für das Scannen wurde eine Xbox Kinect gewählt, da sie sowohl Tiefenbilder (3D-Topografie) als auch das farbige 2D-Bild der Strecke scannen kann. Mit diesen Informationen konnte in Sekundenschnelle eine Karte erstellt werden (was die Komplexität in Bezug auf die Zeit reduzierte), und zusammen mit dem Scannen von Objekten aus den 2D-Bilddaten konnten Objekte auch auf der 3D-Karte platziert werden.

Um den Teil des Bewegungssitzes zu erfüllen, prüften wir mehrere Lösungen und entschieden uns schließlich für einen in der Tschechischen Republik hergestellten 6 DOF Bewegungssimulator. Da er nicht mit Virtual Reality ausgestattet war, musste die VR-Technologie nachgerüstet werden.  
Dies stellt ein großes Problem dar, da herkömmliche Tracker durch die Bewegung des Sitzes irritiert werden, da sie nicht unterscheiden können, ob sich der Kopf oder der Sitz bewegt. Es musste eine maßgeschneiderte Lösung gefunden werden, bei der ein weiterer Tracker am Sitz angebracht wurde und der Abstand zwischen Sitz, Basisstation und VR-Brille in Echtzeit berechnet wurde. Als VR-Brille wurde die HTC Vive gewählt, da sie zu diesem Zeitpunkt die beste Auflösung bot. Ein großes Problem bei VR ist jedoch die Verzögerung. Wenn die Berechnungen der Szene zu lange dauern und das Bild leicht verzögert auf die Bewegung des Sitzes reagiert, fühlen sich Menschen bewegungsunfähig. Dieses Phänomen wird oft als "[virtual reality sickness](https://en.wikipedia.org/wiki/Virtual_reality_sickness?oldformat=true)" oder "[cybersickness](https://en.wikipedia.org/wiki/Virtual_reality_sickness?oldformat=true)" bezeichnet. In den nächsten Schritten wurden daher verschiedene Techniken zur Verringerung der Bewegungskrankheit ausprobiert.  
\#unraceable wurde in mehreren Magazinen vorgestellt und trat sogar bei "Austria's Next Topmodel" als Herausforderung auf.

Auf der letzten Messe war #unraceable ein großer Erfolg und bot die Produktion mehrerer weiterer Meilensteine.  
Im darauffolgenden Jahr trat er sogar in einer modifizierten Version bei der weltweiten "Formel E" auf und reiste zusammen mit dem Team "Audi Sport ABT" um den Globus.

![](/images/img_1286-768x576.webp)

##### Milestone 2: #unraceable App and Quattro-Challenge

Der bisherige Erfolg erlaubte es, das Projekt weiterzuentwickeln und eine App zu produzieren, die eine breitere Masse erreichen sollte. Die Idee war, dass vier Skistars (Quattro, wie der "Audi Quattro") jeweils eine Strecke bauen sollten, die dann von Spielern rund um den Globus befahren werden sollte, wobei der endgültige Gewinner einen Audi A1 für ein Jahr gewinnen sollte.

![](/images/9f01d087dae1e9abb8a2f8c125c7329a-768x555.webp)

Die Strecke sollte sowohl im Simulator als auch in der App selbst spielbar sein. Um dies zu erreichen, waren mehrere Änderungen erforderlich, insbesondere die Portierung eines hochwertigen VR-Spiels auf ein mobiles Spiel, das nur begrenzte Ressourcen zulässt. Es mussten mehrere Anti-Cheat-Mechanismen implementiert und neue Herausforderungen im Bereich des Datenschutzes gelöst werden. Am Ende wurde die App mehr als 30'000 Mal heruntergeladen und erreichte eine Bewertung von 4,3/5 Sternen.  
Da ein Link zum Autokonfigurator von Audi in das Spiel integriert wurde, konnte eine enorme Konversionsrate erzielt werden, da fast 50% der Spieler den Autokonfigurator mindestens einmal öffneten.

![](/images/img_3777-768x432.webp)

[Link: Download the App](https://www.audi.at/audi-erleben/unraceable)

##### Milestone 3: #unraceable Ski-Challenge

Der nächste Schritt bestand darin, mit dem Österreichischen Skiverband ([https://www.oesv.at/](https://www.oesv.at/ "https://www.oesv.at/")) zusammenzuarbeiten und etwas Ähnliches wie die frühere "Skiing Challenge" aufzubauen, die in den vergangenen Jahren großen Erfolg hatte. Die Aufgabe bestand jedoch darin, nicht einfach an diesen Erfolg anzuknüpfen, sondern etwas Neues zu schaffen. Die Idee war, mit einem Audi e-Tron die Skipiste (Hahnenkamm) hinaufzufahren (in Anlehnung an den damaligen Audi e-Tron-Spot, in dem er wie im ersten "Quattro"-Spot eine Skipiste hinauffährt) und sie dann mit einem Skifahrer wieder hinunterzufahren. Auch hier wurde die App mehr als 30'000 Mal heruntergeladen und wird auch heute noch gespielt.

###### Spot: Ferdinand Habsburg & Ernst Hausleitner (ORF)

<iframe width="339" height="191" src="https://www.youtube.com/embed/XvJf_GesdL0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

###### “FC Bayern München” Spot

<iframe width="339" height="191" src="https://www.youtube.com/embed/Y-QGWFz-c8s" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

###### #unraceable Ski Challenge featuring Hans Knauß

<iframe width="339" height="191" src="https://www.youtube.com/embed/LpIVkCKFmyE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


[Arbeiten Sie an einem ähnlichen Projekt? Sind Sie an etwas Ähnlichem interessiert? Kontaktieren Sie uns jetzt für eine kostenlose 15-minütige Beratung.](/de/contact/)
