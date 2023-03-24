---
author: Justin Guese
bg_image: /images/blog/kubernetes.jpg
categories:
- Private cloud
date: 2023-01-18 07:10:46+02:00
description: "Entdecken Sie kostensparende Tipps f\xFCr Ihren Kubernetes-Cluster,\
  \ von der Verwendung eines Load Balancers bis hin zur v\xF6lligen Abschaffung."
image: /images/blog/kubernetes.jpg
tags:
- private cloud
- comparison
title: 'Maximierung der Kosteneinsparungen in der Cloud: Wie man Kubernetes ohne Load
  Balancer betreibt'
type: post
---


# Maximierung der Kosteneinsparungen in der Cloud: Wie man Kubernetes ohne Load Balancer betreibt

Einer der größten Kostenfaktoren beim Betrieb von Kubernetes in der Cloud ist die Verwendung eines Load Balancers für jeden Dienst. Die Preise beginnen bei etwa 15 Dollar pro Monat und Load Balancer., so dass sich die Kosten schnell summieren, besonders wenn Sie eine große Anzahl von Hülsen haben. Was wäre, wenn wir Ihnen sagen würden, dass es eine Möglichkeit gibt, Kubernetes ohne Load Balancer zu betreiben und trotzdem die Vorteile von Hochverfügbarkeit und automatischem Failover zu nutzen? In diesem Artikel, sehen wir uns an, wie der Betrieb von Kubernetes ohne Load Balancer Ihnen helfen kann, in der Cloud Geld zu sparen.

## Version 1: Nginx Ingress mit Cert Manager verwendet einen einzigen Load Balancer.

Eine Strategie zur Kostensenkung besteht darin, einen einzigen Load Balancer für den gesamten Cluster zu verwenden, anstatt einen für jeden Dienst. Dies kann durch den Einsatz eines [Nginx Ingress](https://kubernetes) erreicht werden..github.io/ingress-nginx/), der als einziger Zugangspunkt für den gesamten externen Verkehr zum Cluster dient. Anstatt einen Load Balancer pro Dienst zu erstellen, der Nginx-Ingress verteilt den Verkehr auf der Grundlage des Domänennamens an die entsprechenden Pods.
Das Beste daran ist, dass Sie bei der Installation von [cert-manager.io/docs/installation/helm/], erhalten Sie kostenlose LetsEncrypt SSL-Zertifikate!

Die Verwendung von Helm ist der einfachste Weg, um Nginx Ingress in Ihrem Cluster einzusetzen:

```
helm upgrade --install ingress-nginx ingress-nginx \\
  --repo https://kubernetes.github.io/ingress-nginx \\
  --namespace ingress-nginx --create-namespace
```

Danach, um sicherzustellen, dass https und SSL für Ihre Dienste laufen, müssen Sie Cert Manager mit dem folgenden Befehl einrichten:

```
helm install \\
        cert-manager jetstack/cert-manager \\
        --namespace cert-manager \\
        --create-namespace \\
        --set installCRDs=true
```

Dann, Sie müssen einen \ClusterIssuer\ erstellen, um LetsEncrypt mitzuteilen, wer Sie sind. Erstellen Sie eine Datei \clusterissuer.yaml\ mit dem an Ihre E-Mail angepassten Inhalt:

```
apiVersion: cert-manager.io/v1
Art: ClusterIssuer
Metadaten:
  Name: letsencrypt-prod
spez:
  acme:
    Server: https://acme-v02.api.letsencrypt.org/Verzeichnis
#Änderungen an Ihrer E-Mail
    E-Mail: EMAIL
    privateKeySecretRef:
       Name: letsencrypt-prod
    Löser:
    - http01:
        eintreten:
          Klasse: nginx # öffentlich oder nginx je nach Version
```

Danach, Verwenden Sie \kubectl apply -f clusterissuer.yaml', um es auf Ihren Cluster anzuwenden, und Sie sind fertig!

### Herstellen eines Ingresses

Nun müssen Sie einen Namen für Ihren Dienst wählen, den Sie bekannt machen möchten. Sie können es durch Eingabe von 'kubectl get service' erhalten.

Nehmen wir an, Ihr Dienst heißt \nginx\ im Standard-Namensraum. Um Ihre Domain \test\ weiterzuleiten.datafortress.Wolke\ dazu, die testdf-ingress erstellen.yaml-Datei wie folgt:

```
apiVersion: Vernetzung.k8s.io/v1
kind: Ingress
Metadaten:
  Name: ingress-nginx-test
  Namensraum: Standard
  Anmerkungen:
    cert-manager.io/cluster-issuer: \letsencrypt-prod\
spez:
  tls:
  - Gastgeber:
#Wechseln Sie zu Ihrer Domain
    - Prüfung.datafortress.Wolke
    geheimName: tls-geheim
  Regeln:
#Wechseln Sie zu Ihrer Domain
  - Gastgeber: test.datafortress.Wolke
    http:
      Wege:
        - Pfad: /
          PfadTyp: Präfix
          Backend:
            Dienstleistung:
              Name: nginx
              Hafen:
                Zahl: 80
```

Anwenden mit 'kubectl apply -f testdf-ingress.yaml' und verweisen Sie die von Ihnen verwendete Domäne auf den Load Balancer Ihres Knotens. Sie sollten bald sehen, wie er in Ihrem Cluster hochgefahren wird und Ihr Dienst in der Domäne erscheint, die Sie in der Ingress.
Untersuchen Sie den Nginx-Pod oder die Zertifikate zur Fehlersuche.
Haben Sie Probleme? [Kontaktieren Sie uns](/Kontakt) und wir werden Ihnen helfen!

Mit dieser Lösung können Sie zwar Geld bei Ihrer Cloud-Rechnung sparen, Es ist wichtig zu beachten, dass der Verzicht auf Load Balancer eine Reihe von Problemen mit sich bringt. Zum Beispiel, wenn ein Knoten ausfällt, der Datenverkehr wird nicht automatisch an einen gesunden Server weitergeleitet, was zu Ausfallzeiten des Dienstes führt. Ein Load Balancer ist in vielen Fällen immer noch die beste Option, da er eine automatische Ausfallsicherung bietet und sicherstellt, dass Ihre Dienste für Ihre Kunden verfügbar sind.. Es liegt in Ihrer Verantwortung, die Kosteneinsparungen gegen die potenziellen Risiken abzuwägen und eine fundierte Entscheidung über die beste Lösung für Ihre Bedürfnisse zu treffen.

## Version 2: Sparen Sie noch mehr Geld durch den Einsatz von Zero Load Balancern!

Wenn Sie noch mehr Geld bei Ihrer Cloud-Rechnung sparen wollen, gibt es eine Lösung, die ganz ohne Load Balancer auskommt! Anstelle von Nginx Ingress, Diese Lösung verwendet die nodePorts 80 und 443 des Servers, um den Datenverkehr an die entsprechenden Pods zu leiten.. Dadurch entfällt die Notwendigkeit von Lastverteilern, Ihre Cloud-Kosten erheblich zu senken. Kommen wir nun zu den Einzelheiten dieser Lösung.

Um dies zu erreichen, werden wir unseren aktuellen Nginx-Ingress aufrüsten, um NodePorts anstelle von Load Balancern zu verwenden:

```
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx
    --namespace ingress-nginx \\
    --create-namespace \\
    -Einstellregler.Dienstleistung.type=NodePort \\
    -Einstellregler.Dienstleistung.Häfen.http=80 \\
    -Einstellung Dienst.Anmerkungen.\Metall b.Universum.tf/address-pool\=singlenode \\
    -Einstellregler.Dienstleistung.Häfen.https=443
```

Ihr ingress-nginx-Dienst sollte bald zu Nodeport wechseln, und der Load Balancer sollte verschwinden.

Lastverteiler sorgen für Stabilität des Clusters, sie sind auch ein legitimer Weg, um mit Ein-Knoten-Kubernetes-Distributionen Geld zu sparen. Sie können Ihre monatlichen Kosten erheblich senken, indem Sie keine Load Balancer mehr benötigen und sich ausschließlich auf die Ports 80 und 443 verlassen.. Allerdings, Es ist wichtig, daran zu denken, dass das Fehlen eines Lastausgleichs bedeutet, dass der Datenverkehr im Falle eines ausfallenden Knotens nicht automatisch an einen gesunden Server weitergeleitet wird.. Dieser Kompromiss zwischen Stabilität und Kosteneinsparungen ist eine Überlegung wert, wenn Sie eine Ein-Knoten-Kubernetes-Distribution betreiben..

## Fazit: Lohnt sich das?

Zusammengefasst, Es gibt zahlreiche Möglichkeiten, die Kosten in Ihrem Kubernetes-Cluster zu senken, von der Verwendung von nur einem Load Balancer mit Nginx-Ingress bis hin zur Verwendung von null Load Balancern und dem Verlassen auf Nodeports. Ein Load Balancer hat zwar Vorteile in Bezug auf die Stabilität und die Weiterleitung des Datenverkehrs, es gibt Alternativen, mit denen Sie Geld sparen können. Wenn Sie immer noch unsicher sind, wie Sie am besten Geld in Ihrem Kubernetes-Cluster sparen können, [erwägen, die Vorteile von DataFortress zu nutzen.kostengünstige gemeinsame Kubernetes-Cluster der Cloud, oder lassen Sie sich bei der Verwaltung Ihrer Clusterkosten von uns unterstützen](/Kontakt).