---
author: "Justin Guese"
bg_image: "/images/serverless-investing-bot-facebook-prophet-machine-learning.png"
categories: ["algorithmic-trading", "aws", "serverless", "machine-learning"]
date: 2022-05-23T22:00:00Z
description: "So stellen Sie einen automatisierten Trading-Bot mit dem Facebook Prophet Machine Learning Modell auf AWS Lambda bereit (serverlos)"
image: "/images/serverless-investing-bot-facebook-prophet-machine-learning-1.png"
tags: ["cloud-computing", "machine-learning", "algorithmic-trading", "stock", "aws", "aws-lambda", "serverless", "facebook-prophet"]
title: "So stellen Sie einen automatisierten Trading-Bot mit dem Facebook Prophet Machine Learning Modell auf AWS Lambda bereit (serverlos)"
type: "post"
---

Ich habe diesen Beitrag in den Teil „Warum habe ich es getan“ und das „Technische How-To“ unterteilt. Wenn Sie den Teil „Warum“ überspringen möchten, können Sie gerne direkt zum technischen Teil springen.

**1. Zuverlässigkeit:** Der Algorithmus wird unabhängig von anderen Systemen, Updates, ... ausgeführt.

**2. Performance-Effizienz:** Ich kann mehrere Algorithmen auf einem (kleinen) System ausführen, unabhängig voneinander.

**3. Kostenersparnis:** AWS erlaubt [3,2 Millionen Rechensekunden](https://aws.amazon.com/lambda/?did=ft_card&trk=ft_card) pro Monat, was es mir im Grunde ermöglicht, alle meine Algorithmen kostenlos auszuführen.

Ich habe nach einem Weg gesucht, um erstens sicherzustellen, dass mein Investment-Bot sicher ausgeführt wird, da eine fehlgeschlagene Ausführung viel Geld kosten kann, wenn ein Trade nicht umgehend storniert wird, falls er in die falsche Richtung geht. Außerdem wollte ich vermeiden, meinen Computer ständig laufen zu lassen, und sicherstellen, dass mehrere Algorithmen nebeneinander laufen können, ohne sich gegenseitig zu beeinflussen oder ihre Ausführung zu verzögern.

Darüber hinaus ist es ein schöner Gedanke, einen Investment-Algorithmus laufen zu lassen, ohne sich um Betriebssystem-Updates, Hardwarefehler, Stromausfälle usw. kümmern zu müssen, was der allgemeine Vorteil von serverlosen Technologien ist.

Im Moment kann ich mehrere Variationen des Algorithmus ausführen, um Änderungen am Algorithmus zu testen, und kann sicher sein, dass er laufen wird. Eine weitere feine Sache? AWS bietet rund 1 Million kostenlose Lambda-Aufrufe an, wodurch ich die gesamte Architektur im Rahmen des Free Tier Kontingents betreiben kann.

## Der Investment-Algorithmus

Ich werde den Algorithmus in einem anderen Beitrag auf meiner Website [www.datafortress.cloud](http://www.datafortress.cloud) ausführlicher erklären, aber mein typisches Setup für einen Investment-Algorithmus besteht aus:

1. Testen des Algorithmus mit [Backtrader](https://www.backtrader.com/), einem in Python geschriebenen Open-Source-Backtesting-Framework.
2. Konvertieren des erfolgreichen Algorithmus in eine einzige Python-Datei, die eine run()-Methode enthält, die zurückgibt, welche Investitionen getätigt wurden.
3. Übertragen der Python-Datei zu AWS Lambda, wo ich die run()-Funktion mit der lambda_handler-Funktion von AWS Lambda aufrufe.

In diesem Beispiel-Algorithmus treffe ich Investitionsentscheidungen abhängig davon, ob der aktuelle Preis über oder unter der von [Facebooks Prophet-Modell](https://facebook.github.io/prophet/) vorhergesagten Trendlinie liegt. Ich habe [Ideen von Sean Kelley übernommen](http://seangtkelley.me/blog/2018/08/15/algo-trading-pt2), der ein Backtrader-Setup darüber geschrieben hat, wie man Prophet mit Backtrader nutzt.

Mein Aktienuniversum in diesem Setup wird berechnet, indem die Top-20-Aktien aus dem SPY500-Index ausgewählt werden, die in den letzten X Zeitschritten die höchste Rendite erzielt haben.

Die Datenquelle ist Yahoo Finance unter Verwendung der [kostenlosen yfinance-Bibliothek](https://pypi.org/project/yfinance/), und als algorithmischen Broker meiner Wahl habe ich [Alpaca.markets](https://alpaca.markets/) gewählt.

In meinem Setup wird der Algorithmus einmal täglich um 15 Uhr oder alle 15 Minuten während der Handelszeiten ausgeführt.

### Die Probleme bei der Bereitstellung von Facebook Prophet auf AWS Lambda

AWS Lambda wird mit einigen vorinstallierten Python-Bibliotheken geliefert, aber wie viele von Ihnen wissen dürften, ist dies standardmäßig recht begrenzt (was für das Versprechen von Lambda angemessen ist). Dennoch erlaubt Lambda die Installation privater Pakete, was für kleinere Pakete recht einfach ist (siehe die [offizielle Dokumentation](https://docs.aws.amazon.com/lambda/latest/dg/python-package.html)), aber etwas komplizierter wird, wenn man es mit Paketen zu tun hat, die eine Größe von 250 MB überschreiten. Leider überschreitet das Prophet-Modell von Facebook diese Grenze, aber glücklicherweise hat [Alexandr Matsenov dieses Problem gelöst, indem er die Paketgröße reduziert hat](https://towardsdatascience.com/how-to-get-fbprophet-work-on-aws-lambda-c3a33a081aaf), und [Marc Metz kümmerte sich um Kompilierungsprobleme, damit es auf AWS Lambda läuft](https://github.com/marcmetz/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda).

Nicht standardmäßige Bibliotheken können zu AWS Lambda hinzugefügt werden, indem Layers verwendet werden, die alle benötigten Pakete enthalten. Wenn ein Layer importiert wird, können Sie die Pakete in Ihrer Python-Funktion einfach so importieren, wie Sie es in Ihrem lokalen Setup tun würden.

## How-To (technisch)

Abschließend möchte ich erklären, wie genau Sie dies erreichen können. Siehe dieses TLDR für die Ungeduldigen oder die detailliertere Version unten.

**TLDR;**

1. Sie benötigen einen Lambda-Layer. Laden Sie meinen hoch ([Download](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip)), der Prophet, yfinance, ... enthält, in einen S3-Bucket (privater Zugriff).
2. Wählen Sie AWS Lambda, erstellen Sie eine Funktion, fügen Sie einen Layer hinzu und fügen Sie Ihre S3-Objekt-URL ein.
3. Fügen Sie Ihre lambda_function.py in den Lambda-Editor ein ([oder verwenden Sie meine](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py)).
4. Richten Sie Ihre Umgebungsvariablen ein (optional).
5. Führen Sie es entweder manuell aus, indem Sie auf „Test“ klicken, oder gehen Sie zu CloudWatch -> Rules -> Create Rule und richten Sie „Schedule Execution“ ein, um es in einem festgelegten Zeitintervall auszuführen.

**Detaillierte Erklärung**:

### 1. Erstellen eines benutzerdefinierten Layers für AWS Lambda

Sie können entweder meinen Lambda-Layer verwenden, der Facebook Prophet, NumPy, Pandas, [alpaca-trading-API](https://github.com/alpacahq/alpaca-trade-api-python), yfinance ([GitHub](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda)) enthält, oder Ihren eigenen kompilieren, indem Sie die Erklärung von [Marc](https://medium.com/@marc.a.metz/docker-run-rm-it-v-pwd-var-task-lambci-lambda-build-python3-7-bash-c7d53f3b7eb2) befolgen.

**Verwendung meines Lambda-Layers**

1. Laden Sie die Zip-Datei aus meinem [Github-Repo](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip) herunter, die alle Pakete enthält ([Link](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip)).
2. Da Sie Layer nur bis zu einer Größe von 50 MB direkt in Lambda hochladen können, müssen wir die Datei zuerst zu AWS S3 hochladen.
3. Erstellen Sie einen Bucket und legen Sie die heruntergeladene Zip-Datei darin ab. Der Zugriff kann privat bleiben und muss NICHT öffentlich sein! Kopieren Sie die URL zu Ihrer Datei (z.B. [https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip](https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip)).
4. Melden Sie sich bei AWS an und gehen Sie zu Lambda -> Layers ([EU central Link](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/layers)).
5. Klicken Sie auf „Create layer“, geben Sie ihm einen passenden Namen, wählen Sie „Upload a file from Amazon S3“ und kopieren Sie den Code aus Schritt 3 hinein. Als Runtimes wählen Sie Python 3.7. Klicken Sie auf „Create“.

**Kompilieren Ihres eigenen Lambda-Layers**

Bitte [folgen Sie den Anweisungen von Marc](https://medium.com/@marc.a.metz/docker-run-rm-it-v-pwd-var-task-lambci-lambda-build-python3-7-bash-c7d53f3b7eb2).

### 2. Einrichten einer AWS Lambda Funktion

1. Öffnen Sie das Lambda Function Dashboard ([EU central Link](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions)) und klicken Sie auf „Create function“.
2. Lassen Sie das Kontrollkästchen „Author from scratch“ aktiviert und geben Sie der Funktion einen passenden Namen.
3. Wählen Sie unter „Runtime“ Python 3.7, lassen Sie den Rest wie er ist und klicken Sie auf „Create function“.
4. In der Übersicht des Tabs „Designer“ sehen Sie eine grafische Darstellung Ihrer Lambda-Funktion. Klicken Sie auf das Feld „Layers“ darunter und klicken Sie auf „Add a layer“. Wenn Sie den Layer korrekt eingerichtet haben, können Sie ihn im folgenden Dialog auswählen. Klicken Sie abschließend auf „Add“.
5. Wählen Sie im Tab „Designer“ Ihre Lambda-Funktion aus. Wenn Sie nach unten scrollen, sehen Sie ein Standard-Python-Code-Snippet in einer Datei namens „lambda_function.py“. Wenn Sie Ihren Code so strukturiert haben wie meinen ([Link](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py)), können Sie Ihre Funktion mit der Funktion run() ausführen. Wenn eine Lambda-Funktion aufgerufen wird, führt sie die Funktion lambda_handler(event, context) aus, von der aus Sie z.B. die Funktion run() aufrufen könnten. Natürlich können Sie alle Dateien und Funktionen umbenennen, aber der Einfachheit halber habe ich es so gelassen, wie es ist.
6. Fühlen Sie sich frei, einfach [meine Funktion](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py) einzufügen und zu testen.
7. Ein Klick auf „Test“ sollte zu einer erfolgreichen Ausführung führen, andernfalls werden die Fehler im Dialog angezeigt.

### 3. Verwendung von Umgebungsvariablen in AWS Lambda

Sie sollten Ihren Benutzernamen und Ihr Passwort niemals als Klartext in Ihrem Code hinterlassen. Deshalb sollten Sie immer Umgebungsvariablen verwenden! Glücklicherweise nutzt Lambda diese ebenfalls, und sie können einfach mit dem Python-os-Paket aufgerufen werden. Beispielsweise rufe ich in meinem Skript die Benutzervariable mit os.environ\['ALPACAUSER'\] auf. Die Umgebungsvariablen können im Hauptbildschirm der Lambda-Funktion eingerichtet werden, wenn Sie unter den Code-Editor scrollen.

### 4. AWS Lambda Funktionen in einem festgelegten Zeitintervall auslösen

Das Konzept von Serverless und AWS Lambda basiert auf der Idee, dass eine Funktion ausgeführt wird, wenn ein Trigger-Event eintritt. In meinem Setup wollte ich, dass die Funktion zum Beispiel alle 15 Minuten während der Handelszeiten von Montag bis Freitag aufgerufen wird. Glücklicherweise bietet AWS eine Möglichkeit, ein Event auszulösen, ohne einen Server betreiben zu müssen, indem der CloudWatch-Service genutzt wird.

1. Gehen Sie zu CloudWatch ([EU central Link](https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1)).
2. Wählen Sie im linken Bereich „Events“ und „Rules“.
3. Klicken Sie auf „Create Rule“ und wählen Sie „Schedule“ anstelle von „Event pattern“. Hier können Sie den einfachen Dialog „Fixed-rate“ verwenden oder einen Cron-Ausdruck erstellen. Ich verwende [https://crontab.guru/](https://crontab.guru/) (kostenlos), um Cron-Ausdrücke zu erstellen. Mein Cron-Ausdruck für den oben genannten Anwendungsfall ist „0/15 13-21 ? * MON-FRI *“.
4. Wählen Sie im rechten Bereich „Add Target“ und wählen Sie Ihre Lambda-Funktion aus. Sie wird automatisch zu Lambda hinzugefügt.
5. Klicken Sie abschließend auf „Configure details“, geben Sie einen Namen ein und klicken Sie auf „Create rule“.

### 5. (optional) Log-Analyse, Fehlersuche

Wenn Sie an diesem Punkt angekommen sind, sollten Sie fertig sein! Wenn Sie jedoch überprüfen möchten, ob alles funktioniert hat, können Sie CloudWatch verwenden, um sich die Ausgaben der Lambda-Funktionen anzusehen. Gehen Sie zu CloudWatch -> Logs -> Log groups ([EU central Link](https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1#logsV2:log-groups)) und wählen Sie Ihre Lambda-Funktion aus. In dieser Übersicht sollten Sie die Ausgabe Ihrer Funktionen sehen können.

Wenn Ihnen dieser Beitrag gefallen hat, hinterlassen Sie einen Kommentar oder besuchen Sie meinen Blog [www.datafortress.cloud](http://www.datafortress.cloud), um mich motiviert zu halten 😊.
