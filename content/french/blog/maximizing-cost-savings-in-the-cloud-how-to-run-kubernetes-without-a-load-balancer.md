---
author: Justin Guese
bg_image: images/blog/kubernetes.jpg
categories:
- Cloud privé
date: '2023-01-18T07:10:46+02:00'
description: 'Découvrez des conseils pour réduire les coûts de votre cluster Kubernetes,
  allant de l''utilisation d''un seul équilibreur de charge à son élimination complète.

  '
image: images/blog/kubernetes.jpg
tags:
- Cloud privé
- Comparaison
title: 'Maximiser les économies de coûts dans le cloud : Comment exécuter Kubernetes
  sans équilibreur de charge'
type: post

---
Un des coûts les plus importants associés à l'exécution de Kubernetes dans le cloud est l'utilisation d'un équilibreur de charge pour chaque service. Les prix commencent aux alentours de 15 $ par mois et par équilibreur de charge, et les coûts augmentent rapidement, surtout si vous avez un grand nombre de pods. Et si on vous disait qu'il existe un moyen d'exécuter Kubernetes sans équilibreur de charge tout en conservant les avantages de la haute disponibilité et du basculement automatique ? Dans cet article, nous allons voir comment l'exécution de Kubernetes sans équilibreur de charge peut vous aider à économiser de l'argent dans le cloud.

## Version 1 : Nginx Ingress avec Cert Manager utilise un seul équilibreur de charge.

Une stratégie d'économie de coûts consiste à utiliser un seul équilibreur de charge pour l'ensemble du cluster au lieu d'un pour chaque service. Cela peut être réalisé en utilisant un [Nginx Ingress](https://kubernetes.github.io/ingress-nginx/), qui sert de point d'entrée unique pour tout le trafic externe vers le cluster. Au lieu de créer un équilibreur de charge par service, Nginx Ingress distribue le trafic aux pods appropriés en fonction du nom de domaine.
Le meilleur point est que si vous installez [cert-manager.io/docs/installation/helm/], vous recevrez des certificats SSL gratuits de LetsEncrypt !

L'utilisation de Helm est le moyen le plus simple de déployer Nginx Ingress dans votre cluster :

```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

Après cela, pour garantir que HTTPS et SSL fonctionnent pour vos services, vous devez déployer Cert Manager avec la commande suivante :

```
helm install \
        cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --set installCRDs=true
```

Ensuite, vous devez créer un « ClusterIssuer » afin d'indiquer à LetsEncrypt qui vous êtes. Créez un fichier « clusterissuer.yaml » avec le contenu adapté à votre adresse électronique :

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
#à modifier avec votre adresse email
    email: EMAIL
    privateKeySecretRef:
       name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx # public ou nginx selon la version
```

Ensuite, utilisez `kubectl apply -f clusterissuer.yaml` pour l'appliquer à votre cluster et vous avez terminé !

### Mise en place d'un Ingress

Vous devez maintenant choisir un nom pour le service que vous souhaitez rendre public. Vous pouvez l'obtenir en tapant `kubectl get service`.

Supposons que votre service s'appelle « nginx » dans l'espace de noms par défaut. Pour router votre domaine « test.datafortress.cloud » vers celui-ci, créez le fichier testdf-ingress.yaml comme suit :

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
#à modifier avec votre domaine
    - test.datafortress.cloud
    secretName: tls-secret
  rules:
#à modifier avec votre domaine
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

Appliquez-le avec `kubectl apply -f testdf-ingress.yaml` et pointez le domaine que vous avez utilisé sur l'équilibreur de charge de votre nœud. Vous devriez bientôt le voir démarrer dans votre cluster et votre service apparaître au domaine que vous avez spécifié dans l'ingress.
Examinez le pod nginx ou les certificats pour le débogage.
Vous rencontrez des difficultés ? [Contactez-nous](/contact) et nous vous aiderons !

Bien que cette solution puisse vous faire économiser de l'argent sur votre facture cloud, il est important de noter que l'utilisation d'aucun équilibreur de charge a ses propres inconvénients. Par exemple, si un nœud tombe en panne, le trafic ne sera pas automatiquement redirigé vers un serveur sain, ce qui entraînera une interruption de service. Dans de nombreux cas, un équilibreur de charge reste la meilleure option car il assure le basculement automatique et garantit que vos services sont disponibles pour vos clients. Il est de votre responsabilité de peser les économies de coûts par rapport aux risques potentiels et de prendre une décision éclairée sur la meilleure solution pour vos besoins.

## Version 2 : Économisez encore plus d'argent en utilisant zéro équilibreur de charge !

Si vous souhaitez économiser encore plus d'argent sur votre facture cloud, il existe une solution qui n'utilise aucun équilibreur de charge ! Au lieu de Nginx Ingress, cette solution utilise les NodePorts 80 et 443 du serveur pour diriger le trafic vers les pods appropriés. Ceci élimine le besoin d'équilibreurs de charge, ce qui réduit considérablement les coûts de votre cloud. Entrons dans les détails de cette solution.

Pour ce faire, nous mettrons à niveau notre ingress nginx actuel pour utiliser NodePorts plutôt que des équilibreurs de charge :

```
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.service.type=NodePort \
    --set controller.service.ports.http=80 \
    --set service.annotations."metallb.universe.tf/address-pool"=singlenode \
    --set controller.service.ports.https=443
```

Votre service ingress-nginx devrait bientôt passer à Nodeport, et l'équilibreur de charge devrait disparaître.

Bien que les équilibreurs de charge apportent de la stabilité au cluster, ils constituent également un moyen légitime d'économiser de l'argent avec les distributions Kubernetes mono-nœud. Vous pouvez réduire considérablement vos coûts mensuels en supprimant le besoin d'équilibreurs de charge et en vous appuyant uniquement sur les ports Node 80 et 443. Cependant, il est important de se souvenir que l'absence d'équilibreur de charge signifie que le trafic ne sera pas automatiquement redirigé vers un serveur sain en cas de panne d'un nœud. Ce compromis entre la stabilité et les économies de coûts mérite d'être envisagé si vous utilisez une distribution Kubernetes mono-nœud.

## Conclusion : Cela vaut-il la peine ?

En résumé, il existe de nombreuses façons de réduire les coûts dans votre cluster Kubernetes, allant de l'utilisation d'un seul équilibreur de charge avec nginx ingress à l'utilisation de zéro équilibreur de charge et à la dépendance aux NodePorts. Bien qu'un équilibreur de charge présente des avantages en termes de stabilité et de routage du trafic, il existe des alternatives qui peuvent vous aider à économiser de l'argent. Si vous n'êtes toujours pas sûr de la meilleure façon d'économiser de l'argent dans votre cluster Kubernetes, [envisagez de profiter des clusters Kubernetes partagés rentables de DataFortress.cloud ou sollicitez notre aide pour gérer les coûts de votre cluster](/contact).
