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

Wenn es um den Betrieb von Kubernetes in der Cloud geht, einer der größten Kostenfaktoren kann die Verwendung eines Lastausgleichs für jeden Dienst sein. Die Preise beginnen bei etwa 15 Dollar pro Monat und Load Balancer., die Kosten können sich schnell summieren, besonders wenn Sie eine große Anzahl von Hülsen haben. Allerdings, Was wäre, wenn wir Ihnen sagen würden, dass es einen Weg gibt, Kubernetes ohne Load Balancer zu betreiben und trotzdem die Vorteile von Hochverfügbarkeit und automatischem Failover zu nutzen? In diesem Artikel, Wir erforschen, wie Sie Kosteneinsparungen in der Cloud erzielen können, indem Sie Kubernetes ohne einen Load Balancer betreiben..

## Version 1: Nginx Ingress mit Cert Manager, um nur einen Load Balancer zu verwenden

Eine kostensparende Strategie besteht darin, nur einen Load Balancer für den gesamten Cluster zu verwenden., statt eines separaten Load Balancers für jeden Dienst. Dies kann durch die Verwendung eines [Nginx Ingress](https://kubernetes) erreicht werden..github.io/ingress-nginx/), der als einziger Zugangspunkt für den gesamten externen Datenverkehr zum Cluster dient. Der Nginx-Ingress verteilt dann den Datenverkehr auf der Grundlage des Domänennamens an die entsprechenden Pods, anstatt einen Load Balancer pro Dienst zu erstellen.
Das Beste daran: Wenn Sie [cert manager](https://cert-manager.io/docs/installation/helm/), erhalten Sie kostenlose LetsEncrypt SSL-Zertifikate!

Der einfachste Weg, den Nginx Ingress in Ihrem Cluster einzusetzen, ist die Verwendung von Helm:

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

Danach, wenden Sie es mit `kubectl apply -f clusterissuer auf Ihren Cluster an.yaml` und schon sind Sie startklar!

### Erstellen eines Ingresses

Jetzt, Sie müssen den Namen Ihres Dienstes, den Sie der Welt zur Verfügung stellen wollen, erfassen. Sie können es mit `kubectl get service` abrufen.

In diesem Beispiel, Nehmen wir an, Ihr Dienst heißt \nginx\ im Standard-Namensraum. Um Ihre Domain \test\ weiterzuleiten.datafortress.Wolke\ dazu, müssen Sie die folgende testdf-ingress erstellen.yaml:

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

Wenden Sie es mit `kubectl apply -f testdf-ingress.yaml`, und verweisen Sie die von Ihnen verwendete Domäne auf den von Ihrem Knoten verwendeten Load Balancer. Bald sollten Sie sehen, wie er in Ihrem Cluster hochfährt, und sehen Sie Ihren Dienst in der Domäne, die Sie in der Ingress. 
Zur Fehlersuche, Schauen Sie sich den nginx-Pod oder die Zertifikate an. 
Haben Sie Probleme? [Kontaktieren Sie uns](/de/contact) und wir werden Ihnen helfen!

Mit dieser Lösung können Sie zwar Geld bei Ihrer Cloud-Rechnung sparen, Es ist wichtig zu beachten, dass der Verzicht auf Load Balancer eine Reihe von Herausforderungen mit sich bringen kann. Zum Beispiel, wenn ein Knoten ausfällt, der Datenverkehr wird nicht automatisch an einen gesunden Server weitergeleitet, was zu Ausfallzeiten für Ihren Dienst führt. In vielen Fällen, Ein Load Balancer ist immer noch die beste Option, da er eine automatische Ausfallsicherung bietet und sicherstellt, dass Ihre Dienste für Ihre Kunden verfügbar bleiben.. Es liegt an Ihnen, die Kosteneinsparungen gegen die potenziellen Risiken abzuwägen und eine fundierte Entscheidung für die beste Lösung für Ihre Bedürfnisse zu treffen.

## Version 2: Noch mehr Geld sparen mit 0 Load Balancern!

Wenn Sie noch mehr Geld bei Ihrer Cloud-Rechnung sparen möchten, es gibt eine Alternative zur obigen Lösung, die überhaupt keine Load Balancer verwendet! Anstatt Nginx Ingress zu verwenden, Diese Lösung nutzt die nodePorts 80 und 443 auf dem Server, um den Datenverkehr an die entsprechenden Pods umzuleiten.. Dadurch sind keine Load Balancer mehr erforderlich., die Ihre Cloud-Kosten erheblich senken können. Lassen Sie uns in die Details dieser Lösung eintauchen.

Zu diesem Zweck, werden wir unseren bestehenden Nginx-Ingress aktualisieren, um NodePorts anstelle von Load Balancern zu verwenden:

```
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx
    --namespace ingress-nginx \\
    --create-namespace \\
    -Einstellregler.Dienstleistung.type=NodePort \\
    -Einstellregler.Dienstleistung.Häfen.http=80 \\
    -Einstellung Dienst.Anmerkungen.\Metall b.Universum.tf/address-pool\=singlenode \\
    -Einstellregler.Dienstleistung.Häfen.https=443
```

Sie sollten bald sehen, dass Ihr ingress-nginx-Dienst zu Nodeport wechselt, und der Load Balancer sollte verschwinden. 

Der Einsatz von Lastverteilern sorgt für die Stabilität eines Clusters., es ist eine legitime Möglichkeit, mit Ein-Knoten-Kubernetes-Distributionen Geld zu sparen. Durch den Wegfall von Lastverteilern und die ausschließliche Nutzung der Knotenports 80 und 443, Sie können Ihre monatlichen Kosten erheblich senken. Allerdings, Es ist wichtig zu bedenken, dass das Fehlen eines Load Balancers auch bedeutet, dass im Falle eines ausfallenden Knotens, der Datenverkehr wird nicht automatisch an einen gesunden Server weitergeleitet. Wenn Sie eine Ein-Knoten-Kubernetes-Distribution betreiben, dieser Kompromiss zwischen Stabilität und Kosteneinsparungen ist eine Überlegung wert.

## Fazit: Ist es das wert?

Zusammenfassend, Es gibt mehrere Möglichkeiten, Kosten in Ihrem Kubernetes-Cluster zu sparen, von der Verwendung von nur einem Load Balancer mit Nginx Ingress zur Verwendung von 0 Load Balancern und dem Verlassen auf Nodeports. Ein Load Balancer hat zwar seine Vorteile in Bezug auf die Stabilität und die Sicherstellung der Verkehrslenkung, es gibt Alternativen, die zur Kostensenkung beitragen können. Wenn Sie immer noch unsicher sind, wie Sie am besten Geld in Ihrem Kubernetes-Cluster sparen können, [Erwägen Sie die Nutzung der kostengünstigen, gemeinsam genutzten Kubernetes-Cluster, die von DataFortress angeboten werden..Wolke, oder lassen Sie sich bei der Verwaltung Ihrer Clusterkosten von uns unterstützen](/de/contact).