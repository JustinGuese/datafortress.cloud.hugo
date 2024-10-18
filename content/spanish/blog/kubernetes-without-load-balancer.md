---
author: Justin Guese
bg_image: images/blog/kubernetes.jpg
categories:
- Nube privada
date: '2023-01-18T07:10:46+02:00'
description: 'Descubre consejos para ahorrar costos en tu clúster Kubernetes, desde
  usar un solo balanceador de carga hasta incluso eliminarlos por completo.

  '
image: images/blog/kubernetes.jpg
tags:
- private cloud
- comparison
title: 'Maximizar los Ahorros de Costos en la Nube: Cómo ejecutar Kubernetes sin un
  Equilibrador de Carga'
type: post

---
Cuando se trata de ejecutar Kubernetes en la nube, uno de los costos más significativos puede provenir del uso de un equilibrador de carga para cada servicio. Con precios que comienzan alrededor de los $15 por mes por equilibrador de carga, es fácil que los costos aumenten rápidamente, especialmente si se tiene una gran cantidad de pods. Sin embargo, ¿qué tal si te dijéramos que existe una forma de ejecutar Kubernetes sin la necesidad de un equilibrador de carga y aún obtener los beneficios de alta disponibilidad y failover automático? En este artículo, exploraremos cómo se pueden ahorrar costes en la nube ejecutando Kubernetes sin un equilibrador de carga.

## Versión 1: Nginx Ingress con Cert Manager para usar solo un equilibrador de carga

Una estrategia para ahorrar costes es utilizar un solo equilibrador de carga para todo el clúster, en lugar de un equilibrador de carga separado para cada servicio. Esto se puede lograr utilizando un [Nginx Ingress](https://kubernetes.github.io/ingress-nginx/), que actúa como un único punto de entrada para todo el tráfico externo al clúster. El Nginx Ingress distribuye luego el tráfico a los pods apropiados según el nombre de dominio, en lugar de crear un equilibrador de carga por servicio.
Lo mejor de todo: si estás añadiendo [cert manager](https://cert-manager.io/docs/installation/helm/), ¡obtendrás certificados SSL gratuitos de LetsEncrypt!

La forma más sencilla de desplegar Nginx Ingress en tu clúster es usando Helm:

```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

Después de esto, para asegurar que HTTPS y SSL funcionen para tus servicios, debes desplegar Cert Manager con el siguiente comando:

```
helm install \
        cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --set installCRDs=true
```

A continuación, necesitas crear un "ClusterIssuer" para indicar a LetsEncrypt quién eres. Crea un archivo "clusterissuer.yaml" con el contenido adaptado a tu correo electrónico:

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
#cambia a tu correo electrónico
    email: EMAIL
    privateKeySecretRef:
       name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx # público o nginx dependiendo de la versión
```

Después, aplícalo a tu clúster con `kubectl apply -f clusterissuer.yaml` ¡y ya estás configurado!

### Creación de un Ingress

Ahora, necesitas obtener el nombre de tu servicio que deseas exponer al mundo exterior. Puedes obtenerlo con `kubectl get service`.

En este ejemplo, supongamos que tu servicio se llama "nginx" en el espacio de nombres predeterminado. Para enrutar tu dominio "test.datafortress.cloud" a él, necesitas crear el siguiente testdf-ingress.yaml:

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
#cambia a tu dominio
    - test.datafortress.cloud
    secretName: tls-secret
  rules:
#cambia a tu dominio
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

Aplícalo con `kubectl apply -f testdf-ingress.yaml`, y apunta el dominio que utilizaste al equilibrador de carga utilizado por tu nodo. Pronto deberías verlo ejecutándose en tu clúster y ver tu servicio en el dominio que indicaste en el ingreso. Para depurar, observa el pod nginx o los certificados.
¿Tienes problemas? [Contáctanos](/contact) y te ayudaremos.

Aunque esta solución puede ahorrarte dinero en tu factura de la nube, es importante tener en cuenta que el uso de cero equilibradores de carga puede presentar sus propios desafíos. Por ejemplo, si un nodo falla, el tráfico no se enrutará automáticamente a un servidor saludable, lo que provocará un tiempo de inactividad en tu servicio. En muchos casos, tener un equilibrador de carga sigue siendo la mejor opción, ya que proporciona failover automático y garantiza que tus servicios sigan disponibles para tus clientes. Depende de ti sopesar los ahorros de costes contra los riesgos potenciales y tomar una decisión informada sobre la mejor solución para tus necesidades.

## Versión 2: Ahorrando aún más dinero con 0 equilibradores de carga


Si buscas ahorrar aún más dinero en tu factura de la nube, existe una alternativa a la solución anterior que no utiliza ningún equilibrador de carga. En lugar de usar Nginx Ingress, esta solución utiliza los puertos NodePort 80 y 443 en el servidor para redirigir el tráfico a los pods apropiados. Esto elimina la necesidad de cualquier equilibrador de carga, lo que puede reducir significativamente los costos en la nube. Profundicemos en los detalles de esta solución.

Para hacerlo, actualizaremos nuestro ingreso nginx existente para usar NodePorts en lugar de equilibradores de carga:

```
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.service.type=NodePort \
    --set controller.service.ports.http=80 \
    --set service.annotations."metallb.universe.tf/address-pool"=singlenode \
    --set controller.service.ports.https=443
```

Pronto deberías ver tu servicio ingress-nginx cambiando a Nodeport y el equilibrador de carga debería desaparecer. 

Si bien los equilibradores de carga proporcionan estabilidad a un clúster, es una forma legítima de ahorrar dinero con distribuciones de Kubernetes de un solo nodo. Al eliminar la necesidad de equilibradores de carga y confiar únicamente en los puertos NodePort 80 y 443, puedes reducir tus costos mensuales significativamente. Sin embargo, es importante tener en cuenta que la ausencia de un equilibrador de carga también significa que en caso de fallo de un nodo, el tráfico no se enrutará automáticamente a un servidor saludable. Si operas una distribución de Kubernetes de un solo nodo, este equilibrio entre estabilidad y ahorro de costes merece la pena considerarlo.

## Veredicto: ¿Merece la pena?

En conclusión, existen varias maneras de ahorrar costes en tu clúster Kubernetes, desde utilizar solo un equilibrador de carga con nginx ingress hasta utilizar 0 equilibradores de carga y confiar en los nodeports. Si bien un equilibrador de carga tiene sus beneficios en términos de estabilidad y garantía del enrutamiento del tráfico, hay alternativas que pueden ayudar a reducir los costes. Si aún no estás seguro de la mejor forma de ahorrar dinero en tu clúster Kubernetes, [considera aprovechar los clústeres Kubernetes compartidos rentables ofrecidos por DataFortress.cloud, o busca nuestra ayuda para gestionar los costes de tu clúster](/contact).
