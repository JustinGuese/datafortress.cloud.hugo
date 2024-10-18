---
author: Justin Guese
bg_image: images/blog/kubernetes.jpg
categories:
- Cloud privé
date: '2023-01-18T07:10:46+02:00'
description: 'Découvrez des conseils pour réduire les coûts de votre cluster Kubernetes,
  allant de l''utilisation d''un seul équilibreur de charge à son élimination totale.

  '
image: images/blog/kubernetes.jpg
tags:
- Cloud privé
- Comparaison
title: 'Maximiser les économies de coûts dans le Cloud : Comment exécuter Kubernetes
  sans équilibreur de charge'
type: post

---
Lorsqu'il s'agit d'exécuter Kubernetes dans le cloud, l'un des coûts les plus importants peut provenir de l'utilisation d'un équilibreur de charge pour chaque service. Avec des prix commençant à environ 15 $ par mois et par équilibreur de charge, les coûts peuvent rapidement s'accumuler, surtout si vous avez un grand nombre de pods. Mais que se passe-t-il si on vous disait qu'il existe un moyen d'exécuter Kubernetes sans équilibreur de charge et de bénéficier malgré tout de la haute disponibilité et du basculement automatique ? Dans cet article, nous allons explorer comment réaliser des économies dans le cloud en exécutant Kubernetes sans équilibreur de charge.

## Version 1 : Nginx Ingress avec Cert Manager pour utiliser un seul équilibreur de charge

Une stratégie d'économie de coûts consiste à utiliser un seul équilibreur de charge pour l'ensemble du cluster au lieu d'un équilibreur de charge distinct pour chaque service. Cela peut être réalisé en utilisant un [Nginx Ingress](https://kubernetes.github.io/ingress-nginx/), qui agit comme un point d'entrée unique pour toutes les connexions externes vers le cluster. L'Ingress Nginx distribue ensuite le trafic vers les pods appropriés en fonction du nom de domaine, au lieu de créer un équilibreur de charge par service.
Le meilleur : si vous ajoutez [Cert Manager](https://cert-manager.io/docs/installation/helm/), vous obtiendrez des certificats SSL gratuits de Let's Encrypt !

La méthode la plus simple pour déployer Nginx Ingress dans votre cluster est d'utiliser Helm :

```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

Ensuite, pour garantir l'exécution de https et du SSL pour vos services, vous devez déployer Cert Manager avec la commande suivante :

```
helm install \
        cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --set installCRDs=true
```

Ensuite, vous devez créer un "ClusterIssuer" afin d'indiquer à Let's Encrypt qui vous êtes. Créez un fichier "clusterissuer.yaml" avec le contenu adapté à votre adresse électronique :

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
#modifiez pour votre adresse électronique
    email: EMAIL
    privateKeySecretRef:
       name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx # public ou nginx selon la version
```

Ensuite, appliquez-le à votre cluster avec `kubectl apply -f clusterissuer.yaml`, et vous êtes configuré !

### Création d'un Ingress

Maintenant, vous devez obtenir le nom de votre service que vous souhaitez exposer au monde. Vous pouvez l'obtenir avec `kubectl get service`.

Dans cet exemple, supposons que votre service se nomme "nginx" dans l'espace de noms par défaut. Pour acheminer votre domaine "test.datafortress.cloud" vers celui-ci, vous devez créer le fichier testdf-ingress.yaml suivant :

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
#modifiez pour votre domaine
    - test.datafortress.cloud
    secretName: tls-secret
  rules:
#modifiez pour votre domaine
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

Appliquez-le avec `kubectl apply -f testdf-ingress.yaml`, et pointez le domaine que vous avez utilisé vers l'équilibreur de charge utilisé par votre nœud. Vous devriez bientôt le voir démarrer dans votre cluster et voir votre service sur le domaine spécifié dans l'ingress. Pour déboguer, examinez le pod nginx ou les certificats. 
Vous rencontrez des difficultés ? [Contactez-nous](/contact) et nous vous aiderons !

Bien que cette solution puisse vous faire économiser sur votre facture cloud, il est important de noter que l'absence d'équilibreur de charge peut présenter ses propres défis. Par exemple, si un nœud tombe en panne, le trafic ne sera pas automatiquement redirigé vers un serveur sain, ce qui entraînera des temps d'arrêt pour votre service. Dans de nombreux cas, l'utilisation d'un équilibreur de charge reste la meilleure option, car il assure un basculement automatique et garantit que vos services restent disponibles pour vos clients. Il vous appartient de peser les économies de coûts contre les risques potentiels et de prendre une décision éclairée quant à la meilleure solution pour vos besoins.

## Version 2 : Économiser encore plus d'argent avec 0 équilibreurs de charge !

Si vous souhaitez économiser encore plus sur votre facture cloud, il existe une solution alternative à la solution ci-dessus qui n'utilise aucun équilibreur de charge ! Au lieu d'utiliser Nginx Ingress, cette solution utilise les ports NodePort 80 et 443 sur le serveur pour rediriger le trafic vers les pods appropriés. Cela élimine le besoin d'équilibreurs de charge, ce qui peut réduire considérablement les coûts de votre cloud. Plongeons dans les détails de cette solution.

Pour ce faire, nous allons mettre à niveau notre ingress nginx existant pour utiliser NodePort au lieu des équilibreurs de charge :

```
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.service.type=NodePort \
    --set controller.service.ports.http=80 \
    --set service.annotations."metallb.universe.tf/address-pool"=singlenode \
    --set controller.service.ports.https=443
```

Vous devriez bientôt voir votre service ingress-nginx basculer vers Nodeport, et l'équilibreur de charge devrait disparaître.

Bien que l'utilisation d'équilibreurs de charge offre de la stabilité à un cluster, c'est une solution légitime pour économiser de l'argent avec des distributions Kubernetes à un seul nœud. En éliminant le besoin d'équilibreurs de charge et en s'appuyant uniquement sur les ports Node 80 et 443, vous pouvez réduire vos coûts mensuels de manière significative. Toutefois, il est important de garder à l'esprit qu'en l'absence d'équilibreur de charge, un nœud défaillant n'entraîne pas de redirection automatique du trafic vers un serveur sain. Si vous exploitez une distribution Kubernetes à un seul nœud, ce compromis entre stabilité et économies de coûts est à considérer.

## Verdict : Cela vaut-il la peine ?

En conclusion, il existe de multiples façons d'économiser sur le coût de votre cluster Kubernetes, allant de l'utilisation d'un seul équilibreur de charge avec nginx ingress à l'utilisation de 0 équilibreurs de charge et à l'utilisation des ports NodePort. Bien qu'un équilibreur de charge présente des avantages en termes de stabilité et de garantie de routage du trafic, il existe des alternatives qui peuvent contribuer à réduire les coûts. Si vous n'êtes toujours pas certain de la meilleure façon d'économiser sur votre cluster Kubernetes, [envisagez de profiter des clusters Kubernetes partagés rentables proposés par DataFortress.cloud, ou sollicitez notre assistance pour gérer les coûts de votre cluster](/contact).
