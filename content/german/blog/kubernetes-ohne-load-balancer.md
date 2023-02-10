---
title: "Maximierung der Kosteneinsparungen in der Cloud: Wie man Kubernetes ohne Load Balancer betreibt"
bg_image: "/images/index2-1-1280x720.webp"
date: 2023-01-18T07:10:46+02:00
author: Justin Guese
description: "Entdecken Sie kostensparende Tipps für Ihren Kubernetes-Cluster, von der Verwendung eines Load Balancers bis hin zur völligen Abschaffung."
image: "/images/index2-1-1280x720.webp"
categories:
- Private cloud
- Kubernetes
tags: ["private cloud", "kubernetes"]
type: post
---

# Maximierung der Kosteneinsparungen in der Cloud: Wie man Kubernetes ohne Load Balancer betreibt
Beim Betrieb von Kubernetes in der Cloud kann einer der größten Kostenfaktoren die Verwendung eines Load Balancers für jeden Dienst sein. Bei Preisen ab etwa 15 US-Dollar pro Monat pro Load Balancer können sich die Kosten schnell summieren, vor allem, wenn Sie eine große Anzahl von Pods haben. Aber was wäre, wenn wir Ihnen sagen würden, dass es einen Weg gibt, Kubernetes ohne Load Balancer zu betreiben und trotzdem die Vorteile von Hochverfügbarkeit und automatischem Failover zu nutzen? In diesem Artikel zeigen wir Ihnen, wie Sie Kosteneinsparungen in der Cloud erzielen können, indem Sie Kubernetes ohne Load Balancer betreiben.

## Version 1: Nginx Ingress mit Cert Manager zur Verwendung von nur einem Load Balancer

Eine kostensparende Strategie besteht darin, nur einen Load Balancer für den gesamten Cluster zu verwenden, anstatt einen separaten Load Balancer für jeden Dienst. Dies kann durch die Verwendung eines [Nginx Ingress](https://kubernetes.github.io/ingress-nginx/) erreicht werden, der als einziger Eingangspunkt für den gesamten externen Verkehr zum Cluster fungiert. Der Nginx Ingress verteilt dann den Datenverkehr auf der Grundlage des Domänennamens an die entsprechenden Pods, anstatt einen Load Balancer pro Dienst zu erstellen.
Das Beste daran: Wenn Sie [cert manager](https://cert-manager.io/docs/installation/helm/) hinzufügen, erhalten Sie kostenlose LetsEncrypt SSL-Zertifikate!

Der einfachste Weg, Nginx Ingress in Ihrem Cluster einzusetzen, ist die Verwendung von Helm:

```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

Danach müssen Sie Cert Manager mit dem folgenden Befehl einsetzen, um sicherzustellen, dass https und SSL für Ihre Dienste laufen:

```
helm install \
        cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --set installCRDs=true
```

Dann müssen Sie einen "ClusterIssuer" erstellen, um LetsEncrypt mitzuteilen, wer Sie sind. Erstellen Sie eine Datei "clusterissuer.yaml" mit dem an Ihre E-Mail angepassten Inhalt:

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
#change to your email
    email: EMAIL
    privateKeySecretRef:
       name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx # public or nginx depending on version
```

Danach wenden Sie es mit `kubectl apply -f clusterissuer.yaml` auf Ihren Cluster an und schon sind Sie startklar!

### Erstellen eines Ingress

Nun müssen Sie den Namen Ihres Dienstes, den Sie der Welt zur Verfügung stellen wollen, ermitteln. Sie können ihn mit `kubectl get service` ermitteln.

In diesem Beispiel nehmen wir an, dass Ihr Dienst "nginx" im Standard-Namensraum heißt. Um Ihre Domain "test.datafortress.cloud" dorthin zu leiten, müssen Sie die folgende testdf-ingress.yaml erstellen:

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-nginx-test
  namespace: default
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
#change to your domain
    - test.datafortress.cloud
    secretName: tls-secret
  rules:
#change to your domain
  - host: test.datafortress.cloud
    http:
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: nginx
              port:
                number: 80
```

Wenden Sie es mit `kubectl apply -f testdf-ingress.yaml` an und verweisen Sie die von Ihnen verwendete Domäne auf den von Ihrem Knoten verwendeten Load Balancer. Schon bald sollten Sie sehen, dass Ihr Cluster hochgefahren ist und Ihr Dienst auf der Domain läuft, die Sie im Ingress angegeben haben. 
Zur Fehlersuche sehen Sie sich den nginx-Pod oder die Zertifikate an. 
Haben Sie Probleme? [Kontaktieren Sie uns](/de/contact) und wir werden Ihnen helfen!

Diese Lösung kann Ihnen zwar Geld für Ihre Cloud-Rechnung sparen, aber es ist wichtig zu wissen, dass der Verzicht auf Load Balancer mit einer Reihe von Problemen verbunden ist. Wenn zum Beispiel ein Knoten ausfällt, wird der Datenverkehr nicht automatisch an einen gesunden Server weitergeleitet, was zu Ausfallzeiten für Ihren Dienst führt. In vielen Fällen ist ein Load Balancer immer noch die beste Option, da er eine automatische Ausfallsicherung bietet und sicherstellt, dass Ihre Dienste für Ihre Kunden verfügbar bleiben. Es liegt an Ihnen, die Kosteneinsparungen gegen die potenziellen Risiken abzuwägen und eine fundierte Entscheidung für die beste Lösung für Ihre Bedürfnisse zu treffen.

## Version 2: Noch mehr Geld sparen mit 0 Load Balancern!

Wenn Sie noch mehr Geld bei Ihrer Cloud-Rechnung sparen möchten, gibt es eine Alternative zur obigen Lösung, die überhaupt keine Load Balancer verwendet! Anstatt Nginx Ingress zu verwenden, nutzt diese Lösung die nodePorts 80 und 443 auf dem Server, um den Datenverkehr an die entsprechenden Pods weiterzuleiten. Auf diese Weise werden keine Load Balancer benötigt, was Ihre Cloud-Kosten erheblich senken kann. Schauen wir uns nun die Details dieser Lösung an.

Dazu werden wir unseren bestehenden Nginx-Ingress so aufrüsten, dass er NodePorts anstelle von Load Balancern verwendet:

```
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.service.type=NodePort \
    --set controller.service.ports.http=80 \
    --set service.annotations."metallb.universe.tf/address-pool"=singlenode \
    --set controller.service.ports.https=443
```
Sie sollten bald sehen, dass Ihr ingress-nginx-Dienst zu Nodeport wechselt und der Load Balancer verschwindet. 

Die Verwendung von Load Balancern sorgt zwar für die Stabilität eines Clusters, ist aber auch ein legitimer Weg, um bei Kubernetes-Distributionen mit einem Knoten Geld zu sparen. Durch den Wegfall von Load Balancern und die ausschließliche Nutzung der Node-Ports 80 und 443 können Sie Ihre monatlichen Kosten erheblich senken. Es ist jedoch wichtig zu bedenken, dass der Verzicht auf einen Load Balancer auch bedeutet, dass im Falle eines ausfallenden Knotens der Datenverkehr nicht automatisch an einen gesunden Server weitergeleitet wird. Wenn Sie eine Kubernetes-Distribution mit nur einem Knoten betreiben, ist dieser Kompromiss zwischen Stabilität und Kosteneinsparungen eine Überlegung wert.

## Fazit: Ist es das wert?

Zusammenfassend lässt sich sagen, dass es mehrere Möglichkeiten gibt, in Ihrem Kubernetes-Cluster Kosten zu sparen, von der Verwendung von nur einem Load Balancer mit Nginx-Ingress bis hin zur Verwendung von 0 Load Balancern und dem Verlassen auf Nodeports. Ein Load Balancer hat zwar seine Vorteile, was die Stabilität und das Routing des Datenverkehrs angeht, aber es gibt auch Alternativen, die helfen können, die Kosten zu senken. Wenn Sie immer noch unsicher sind, wie Sie in Ihrem Kubernetes-Cluster am besten Geld sparen können, [erwägen Sie die kostengünstigen gemeinsam genutzten Kubernetes-Cluster, die von DataFortress.cloud angeboten werden, oder lassen Sie sich von uns bei der Verwaltung Ihrer Clusterkosten unterstützen](/de/contact).