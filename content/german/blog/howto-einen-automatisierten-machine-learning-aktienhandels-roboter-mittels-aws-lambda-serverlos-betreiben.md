+++
author = "Justin Guese"
bg_image = "/images/serverless-investing-bot-facebook-prophet-machine-learning.png"
categories = ["algorithmic-trading", "trading", "serverless", "cloud-computing", "machine-learning"]
date = 2020-08-23T22:00:00Z
description = "In this post, I will introduce my serverless investing algorithm using AWS Lambda, Facebook Prophet as ML model, and my custom Lambda layer."
image = "/images/serverless-investing-bot-facebook-prophet-machine-learning-1.png"
tags = ["serverless-architecture", "serverless", "aws", "aws-lambda", "machine-learning", "facebook-prophet", "automated-trading", "algorithmic-trading"]
title = "Howto: Einen automatisierten Machine-Learning Aktienhandels-Roboter mittels AWS Lambda serverlos betreiben"
type = "post"

+++
In diesem Beitrag werde ich meinen Algorithmus für serverloses Investieren mit AWS Lambda, Facebook Prophet als ML-Modell und meiner benutzerdefinierten Lambda-Schicht vorstellen.

Ich habe diesen Beitrag in die Abschnitte "Warum habe ich das gemacht" und "Technisches How To" unterteilt. Wenn Sie den "Warum"-Teil überspringen möchten, können Sie direkt zum technischen Teil springen.

## Warum sollte ich ein maschinelles Lernmodell in AWS Lambda einsetzen?

1. **Die Zuverlässigkeit**: Der Algorithmus wird unabhängig von anderen Systemen, Updates, ...
2. **Leistungseffizienz**: Ich kann mehrere Algorithmen auf einem (kleinen) System unabhängig voneinander ausführen.
3. **Kosteneinsparungen**: AWS ermöglicht [3,2 Millionen Rechensekunden pro Monat](https://aws.amazon.com/lambda/?did=ft_card&trk=ft_card), so dass ich im Grunde alle meine Algorithmen kostenlos ausführen kann. 

Ich habe nach einer Möglichkeit gesucht, zunächst sicherzustellen, dass mein Investitions-Bot sicher ausgeführt wird, denn eine fehlgeschlagene Ausführung kann viel Geld kosten, wenn ein Handel nicht umgehend abgebrochen wird, wenn er in die falsche Richtung geht.  Außerdem wollte ich vermeiden, meinen Computer die ganze Zeit laufen zu lassen, und sicherstellen, dass mehrere Algorithmen nebeneinander laufen können, ohne ihre Ausführung zu beeinflussen oder zu verzögern. 

Darüber hinaus ist es ein schöner Gedanke, einen investierenden Algorithmus laufen zu lassen, ohne sich um Betriebssystem-Updates, Hardware-Ausfälle und Stromausfälle usw. zu kümmern, was der allgemeine Vorteil serverloser Technologien ist.  

Im Moment kann ich mehrere Variationen des Algorithmus laufen lassen, um Änderungen des Algorithmus zu testen, und kann sicher sein, dass er läuft. Noch eine nette Sache? AWS bietet etwa 1 Million kostenlose Lambda-Aufrufe an, so dass ich die gesamte Architektur in ihrem Free Tier-Kontingent laufen lassen kann. 

## Der Investitionsalgorithmus

Ich werde den Algorithmus in einem anderen Beitrag auf meiner Website [www.datafortress.cloud]() ausführlicher erläutern, aber mein typischer Aufbau eines Investitionsalgorithmus besteht aus: 

1. Testen des Algorithmus mit [Backtrader](https://www.backtrader.com/), einem Open-Source-Backtesting-Framework, das in Python geschrieben wurde
2. Konvertieren des erfolgreichen Algorithmus in eine einzelne Python-Datei, die eine run()-Methode enthält, die zurückgibt, welche Investitionen getätigt wurden
3. Übertragen der Python-Datei zu AWS Lambda, wo ich die run()-Funktion mit der lambda_handler-Funktion von AWS Lambda aufrufe

In diesem Beispielalgorithmus treffe ich Investitionsentscheidungen in Abhängigkeit davon, ob der aktuelle Kurs über oder unter der Trendlinie liegt, die vom [Prophetenmodell von Facebook](https://facebook.github.io/prophet/) vorhergesagt wird. Ich habe Ideen von [Sean Kelley übernommen](http://seangtkelley.me/blog/2018/08/15/algo-trading-pt2), der ein Backtrader-Setup geschrieben hat, wie man Prophet mit Backtrader einsetzen kann.  

Mein Aktienuniversum in diesem Setup wird berechnet, indem ich die 20 besten Aktien aus dem SPY500-Index auswähle, der in den vergangenen X Zeitschritten die höchste Rendite erzielte. 

Die Datenquelle ist Yahoo Finance, unter Verwendung der kostenlosen [Yfinance-Bibliothek](), und als mein bevorzugter algorithmischer Broker habe ich [Alpaca.markets](https://alpaca.markets/) gewählt.

In meinem Setup wird der Algorithmus einmal pro Tag um 15 Uhr oder alle 15 Minuten während der Handelszeiten ausgeführt.

## Die Probleme beim Einsatz des Facebook-Propheten bei AWS Lambda

AWS Lambda wird mit einigen Python-Bibliotheken vorinstalliert geliefert, aber wie viele von Ihnen vielleicht wissen, ist dies standardmäßig recht begrenzt (was für Lambda's Versprechen angemessen ist). Dennoch erlaubt Lambda die Installation privater Pakete, was für kleinere Pakete recht einfach ist (siehe die[ offizielle Dokumentation](https://docs.aws.amazon.com/lambda/latest/dg/python-package.html)), aber etwas komplizierter wird, wenn es sich um Pakete handelt, die größer als 250 Mb sind. Unglücklicherweise überschreitet das Prophetenmodell von Facebook diese Grenze, aber glücklicherweise hat [Alexandr Matsenov dieses Problem gelöst](https://towardsdatascience.com/how-to-get-fbprophet-work-on-aws-lambda-c3a33a081aaf), indem er die Paketgröße reduziert hat, und [Marc Metz hat sich um Kompilierungsprobleme gekümmert, damit es auf AWS Lambda läuft.](https://github.com/marcmetz/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda)

Nicht standardmäßige Bibliotheken können zu AWS Lambda hinzugefügt werden, indem man Layer verwendet, die alle benötigten Pakete enthalten. Wenn ein Layer importiert wird, können Sie die Pakete einfach in Ihrer Python-Funktion importieren, wie Sie es in Ihrem lokalen Setup tun würden.

# Die technische Anleitung

Lassen Sie mich abschließend erklären, wie genau Sie dies erreichen können. Siehe dieses TLDR für die ungeduldigen Typen oder die detailliertere Version unten.

**TLDR;**

1. Sie benötigen ein Lambda-Layer, laden Sie meine ([Download](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip)) mit Prophet, yfinance, ... auf einen S3-Bucket (privater Zugang)
2. Wählen Sie AWS Lambda, erstellen Sie eine Funktion, fügen Sie ein Layer hinzu und fügen Sie in Ihre S3-Objekt-URL ein
3. Fügen Sie Ihre lambda_function.py in den Lambda-Editor ein ([oder verwenden Sie meine](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py))
4. Richten Sie Ihre Umgebungsvariablen ein (optional)
5. Führen Sie es entweder manuell aus, indem Sie auf "Test" klicken, oder gehen Sie zu CloudWatch -> Regeln -> Regel erstellen und richten Sie "Ausführung planen" ein, um es in einem bestimmten Zeitintervall auszuführen

**Ausführliche Erläuterung:**

## 1. Erstellen eines benutzerdefinierten Layers für AWS Lambda

Sie können entweder mein Lambda-Layer verwenden, die Facebook Prophet, NumPy, Pandas, Alpaka-Handels-API, yfinance ([GitHub](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda)) enthält, oder Sie können Ihre eigene unter Verwendung der [von Marc gegebenen Erklärung zusammenstellen.](https://medium.com/@marc.a.metz/docker-run-rm-it-v-pwd-var-task-lambci-lambda-build-python3-7-bash-c7d53f3b7eb2)

**Meine Lambda-Schicht verwenden**

1. Laden Sie die Zip-Datei von meinem [Github-Repo](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip) herunter, die alle Pakete enthält ([Link](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip))
2. Da Sie Layer nur bis zu einer Größe von 50 Mb direkt auf Lambda hochladen können, müssen wir die Datei zunächst auf AWS S3 hochladen.
3. Erstellen Sie einen Bucket und legen Sie die heruntergeladene Zip-Datei in diesen Eimer. Der Zugang kann privat bleiben und muss NICHT öffentlich sein! Kopieren Sie die URL in Ihre Datei (z.B. [https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip](https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip "https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip")) 
4. Loggen Sie sich in AWS ein und gehen Sie zu Lambda -> Layers ([EU central Link](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/layers))
5. Klicken Sie auf "Layer erstellen", geben Sie ihr einen passenden Namen und wählen Sie "Eine Datei von Amazon S3 hochladen", und kopieren Sie den Code von Schritt 3 hinein. Wählen Sie als Runtimes Python 3.7. Klicken Sie auf "Erstellen".

**Kompilieren Sie Ihre eigenes Lambda-Layer**

Bitte folgen Sie den [Anweisungen von Marc](https://medium.com/@marc.a.metz/docker-run-rm-it-v-pwd-var-task-lambci-lambda-build-python3-7-bash-c7d53f3b7eb2).

## 2. Erstellen einer Lambda Funktion

1. Öffnen Sie das Dashboard der Lambda-Funktion ([EU central Link](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions)) und klicken Sie auf "Funktion erstellen".
2. Lassen Sie das Kontrollkästchen "Von Grund auf neu" unverändert und geben Sie ihm einen passenden Namen. 
3. Wählen Sie in "Runtime" Python 3.7, lassen Sie den Rest unverändert und klicken Sie auf "Funktion erstellen".
4. In der Übersicht der Registerkarte "Designer" sehen Sie eine grafische Darstellung Ihrer Lambda-Funktion. Klicken Sie auf das Feld "Schichten" darunter und klicken Sie auf "Eine Schicht hinzufügen". Wenn Sie den Layer korrekt eingerichtet haben, können Sie ihn im folgenden Dialog auswählen. Klicken Sie schliesslich auf "Hinzufügen".
5. In der Registerkarte "Designer" wählen Sie Ihre Lambda-Funktion aus. Wenn Sie nach unten scrollen, sehen Sie ein Standard-Python-Code-Snippet in einer Datei namens "lambda_function.py". Wenn Sie Ihren Code genauso strukturiert haben wie meinen ([Link](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py)), können Sie Ihre Funktion mit der run()-Funktion ausführen. Wenn eine Lambda-Funktion aufgerufen wird, wird sie die lambda_handler(event, context)-Funktion ausführen, von der aus Sie z.B. die run()-Funktion aufrufen können. Natürlich können Sie alle Dateien und Funktionen umbenennen, aber der Einfachheit halber habe ich dieses Projekt so belassen, wie es ist. 
6. Fühlen Sie sich frei, [meine Funktion](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py) einfach einzufügen und zu testen. 
7. Ein Klick auf "Test" sollte zu einer erfolgreichen Ausführung führen, andernfalls werden die Fehler im Dialog angezeigt.

## 3. Umgebungsvariabeln in AWS Lambda hinzufügen und nutzen

Sie sollten Ihren Benutzer und Ihr Passwort niemals als Klartext in Ihrem Code hinterlassen, weshalb Sie immer Umgebungsvariablen verwenden sollten! Glücklicherweise verwendet auch Lambda diese, und sie können leicht mit dem Python-OS-Paket aufgerufen werden. In meinem Skript rufe ich z.B. die Benutzervariable mit os.environ\['ALPACAUSER'\] auf. Die Umgebungsvariablen können im Hauptfunktionsbildschirm von Lambda eingerichtet werden, wenn Sie unter Ihrem Code-Editor nach unten scrollen.

## 4. AWS Lambda Funktionen in einem bestimmten Zeitintervall auslösen

Das Konzept von Serverless und AWS Lambda basiert auf der Idee, dass eine Funktion ausgeführt wird, wenn ein Trigger-Ereignis eintritt. In meinem Setup wollte ich, dass die Funktion z.B. alle 15 Minuten während der Handelszeiten, Montag bis Freitag, aufgerufen wird. Glücklicherweise bietet AWS eine Möglichkeit, ein Ereignis auszulösen, ohne dass ein Server laufen muss, indem der CloudWatch-Dienst genutzt wird.

1. Gehen Sie zu CloudWatch ([EU central Link](https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1)).
2. Wählen Sie in der linken Leiste "Events" und "Rule".
3. Klicken Sie auf "Create Rule", und wählen Sie "Schedule" anstelle von "Event pattern". Hier können Sie den einfachen "Fixed-rate"-Dialog verwenden oder einen Cron-Ausdruck erstellen. Ich benutze [https://crontab.guru/](https://crontab.guru/ "https://crontab.guru/") (kostenlos), um Cron-Ausdrücke zu erstellen. Mein Cron-Ausdruck für den oben erwähnten Anwendungsfall lautet "0/15 13-21 ? * MON-FRI *".
4. Wählen Sie in der rechten Tafel "Add Target" und wählen Sie Ihre Lambda-Funktion. Sie wird automatisch zu Lambda hinzugefügt.
5. Klicken Sie schließlich auf "Details konfigurieren", geben Sie ihr einen Namen und klicken Sie auf "Regel erstellen".

## 5. (optional) Log Analysen, Errorsuche

Wenn Sie es bis zu diesem Teil geschafft haben, sollten Sie fertig sein! Wenn Sie aber überprüfen wollen, ob alles funktioniert hat, können Sie mit CloudWatch einen Blick auf die Ausgaben der Lambda-Funktionen werfen. Gehen Sie zu CloudWatch -> Logs -> Log-Gruppen ([EU central Link](https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1#logsV2:log-groups)) und wählen Sie Ihre Lambda-Funktion aus. In dieser Übersicht sollten Sie die Ausgaben Ihrer Funktionen sehen können. 

Wenn Ihnen dieser Beitrag gefallen hat, hinterlassen Sie einen Kommentar oder schauen Sie sich andere Beiträge an, um mich weiterhin zum Schreiben zu motivieren 😊.