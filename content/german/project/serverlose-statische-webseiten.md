+++
bg_image = "/images/blog/serverless-website.png"
case_study = ""
category = "Cloud"
description = "Erstellen einer serverlosen Website"
image = "/images/blog/serverless-website.png"
live_demo = ""
title = "DataFortress.cloud"
[[overview]]
label = "Client"
data = "Für uns"
[[overview]]
label = "Time"
data = "2020"

+++

# Warum nicht WordPress?


Um eine weitere Erklärung dafür zu geben, warum ich mich entschieden habe, dieses Blog komplett serverlos zu betreiben, [lesen Sie bitte zuerst meinen Artikel](/de/blog/wordpress-zu-serverlos-unhackbare-webseite/).


Ich wollte nicht das berühmte CMS WordPress für mein Blog verwenden, so wie es ist: 
- **Schwerer Rechenaufwand** - der Code wird für jeden einzelnen Benutzer berechnet, der auf die Website kommt, auch wenn es derselbe Inhalt ist
Schwer zu sichern - auch wenn es großartige Plugins gibt, aber ein System, auf dem [33% des Web](https://en.wikipedia.org/wiki/WordPress) läuft, bleibt für Hacker wirklich verlockend. 
- **Verwendung festverdrahteter Links** - Links sind fest mit der Datenbank verdrahtet, was Änderungen an der Domain schrecklich macht.
- **PHP** - die Programmiersprache, die sich mit der Zeit entwickelt hat, statt geplant zu werden
Schwer zu warten - WordPress ist bekannt dafür, dass es bei Aktualisierungen Seiten unterbricht, besonders wenn Plugins nicht mehr gewartet werden

\
</br>Ist alles an WordPress schlecht? Nein, natürlich nicht. Für einige Anwendungen ist es großartig, und es gibt Möglichkeiten, mit den oben genannten negativen Punkten umzugehen - siehe meine Fallstudie über die internationale Informationswebsite, die ich als Beispiel programmiert habe. 

Da ich aber der einzige Redakteur des Blogs bin und Aktualisierungen selten sind und ich mir überhaupt keine Gedanken über Betriebszeiten, Skalierung und Sicherheit machen möchte, habe ich mich für einen serverlosen Ansatz entschieden. 


# Serverlos werden


Aber wie ist es möglich, eine Website serverlos zu betreiben? Natürlich codiere ich nicht jede einzelne Website in einfachem HTML. Es gibt großartige statische Website-Entwickler wie [Jekyll](https://jekyllrb.com/) oder [Hugo](https://gohugo.io/), die einfache Texteingabe verwenden, um eine gut aussehende Website zu erstellen. Der Fortschritt ist ähnlich wie bei [LaTeX](https://www.latex-project.org/), falls Sie es jemals benutzt haben, wo Sie eine Website einmal kodieren und entwerfen müssen und dann einfach jedes Mal die Vorlage für Ihre Texteingabe "wiederverwenden" müssen. Es gibt viele [Vorlagen zur Auswahl](https://themes.gohugo.io/), und sie sind einfach zu erstellen - schicken Sie mir einfach eine Nachricht, wenn Sie Hilfe benötigen. 


## Hosting des HTML-Codes

Und was mache ich mit dem HTML-Code? Der traditionelle Ansatz wäre, den Code auf einem Server mit Apache oder nginx zu hosten, aber glücklicherweise gibt es verschiedene Tools, die ein serverloses Hosting von einfachem HTML ermöglichen, wie [Github Pages](https://pages.github.com/) oder [AWS S3](https://aws.amazon.com/s3/). Ich habe mich für Ersteres entschieden, weil ich die Versionskontrolle meiner Website und das Hosting gleichzeitig durchführen kann. Ich habe etwas getan, das meine Website kaputt gemacht hat? Kein Problem, ich kann problemlos zur vorherigen Version zurückkehren. Aber was ist, wenn ich eine Einstellung oder eine Datenbank kaputt mache? Nicht möglich, da beide Dienste serverlos sind und ich sie nur mit dem Code füttere. Wann haben Sie das letzte Mal nach einem Fehler auf Ihrer Website gesucht, während Ihr Chef oder Ihre Kunden über die Ausfallzeit verärgert waren? Ich bin mehr als erleichtert, Ihnen mitteilen zu können, dass ich mir darüber keine Sorgen mehr zu machen brauche. 

Mein typischer Arbeitsablauf besteht darin, die Website auf Fehler zu überprüfen, indem ich einen lokalen Testserver laufen lasse, der in Hugo enthalten ist, und den Commit in das Github Repo schiebe, wenn alles gut aussieht. Danach werden die Änderungen automatisch auf den Github-Seiten veröffentlicht. 

## Kombination von WordPress und statischen Website-Generatoren

Wenn Sie nicht der Codierungstyp sind, ist es einfach, Ihr Hugo-Projekt in ein speziell für diesen Zweck erstelltes CMS wie https://forestry.io/ zu importieren. Sobald eine Website eingerichtet ist, ist keine Codierung mehr erforderlich, und Sie können Medien einfach eingeben und per Drag & Drop einfügen, wie Sie es in WordPress gewohnt sind.  Wie richten Sie die Website ein? [Schicken Sie mir eine Nachricht und ich kann Ihnen helfen](/de/contact/). 


Ich kann nur jeden dazu auffordern, bei seinen Websites auf den Server zu verzichten, da es billiger ist (diese Website kostet mich keinen einzigen Cent), viel einfacher zu verwalten ist und automatisch skaliert. Selbst wenn eine Million Besucher meinen Blog lesen, wird er immer noch so schnell wie immer sein, und ich werde keine panischen Anrufe bekommen, dass ein Server ausfällt. 
Sind Sie daran interessiert, ohne Server auszukommen? [Schicken Sie mir eine Nachricht oder hinterlassen Sie unten einen Kommentar](/de/contact/). 

