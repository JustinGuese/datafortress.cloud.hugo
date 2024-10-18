---
author: Justin Guese
bg_image: images/blog/kubernetes.jpg
categories:
- Nube privada
date: '2023-01-18T07:10:46+02:00'
description: 'Descubre consejos para ahorrar costos en tu clúster Kubernetes, desde
  el uso de un solo balanceador de carga hasta la eliminación completa de los mismos.

  '
image: images/blog/kubernetes.jpg
tags:
- private cloud
- comparison
title: 'Maximizar los Ahorros de Costos en la Nube: Cómo ejecutar Kubernetes sin un
  balanceador de carga'
type: post

---
Uno de los costos más significativos asociados con la ejecución de Kubernetes en la nube es el uso de un balanceador de carga para cada servicio. Los precios comienzan alrededor de $15 por mes por balanceador de carga, por lo que los costos aumentan rápidamente, especialmente si tienes una gran cantidad de pods. ¿Qué pasaría si te dijera que hay una forma de ejecutar Kubernetes sin un balanceador de carga y, al mismo tiempo, obtener los beneficios de alta disponibilidad y redundancia automática? En este artículo, veremos cómo ejecutar Kubernetes sin un balanceador de carga puede ayudarte a ahorrar dinero en la nube.

## Versión 1: Nginx Ingress con Cert Manager utiliza un solo Balanceador de Carga.

Una estrategia para reducir costos es usar un solo balanceador de carga para todo el clúster en lugar de uno para cada servicio. Esto se puede lograr utilizando un [Nginx Ingress](https://kubernetes.github.io/ingress-nginx/), que sirve como un único punto de entrada para todo el tráfico externo al clúster. En lugar de crear un balanceador de carga por servicio, el Nginx Ingress distribuye el tráfico a los pods apropiados según el nombre de dominio.
Lo mejor de todo es que si instalas [cert-manager.io/docs/installation/helm/], ¡recibirás certificados SSL gratuitos de LetsEncrypt!

Usar Helm es la forma más simple de implementar Nginx Ingress en tu clúster:

```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

Después de eso, para asegurar que https y SSL estén funcionando para tus servicios, necesitas implementar Cert Manager con el siguiente comando:

```
helm install \
        cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --set installCRDs=true
```

Luego, necesitas crear un "ClusterIssuer" para decirle a LetsEncrypt quién eres. Crea un archivo "clusterissuer.yaml" con el contenido adaptado a tu correo electrónico:

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

Después, usa 'kubectl apply -f clusterissuer.yaml' para aplicarlo a tu clúster y ¡listo!

### Establecer un Ingress

Ahora debes elegir un nombre para el servicio que deseas publicar. Puedes obtenerlo escribiendo 'kubectl get service'.

Supongamos que tu servicio se llama "nginx" en el espacio de nombres predeterminado. Para enrutar tu dominio "test.datafortress.cloud" a él, crea el archivo testdf-ingress.yaml como sigue:

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

Ap lícalo con 'kubectl apply -f testdf-ingress.yaml' y apunta el dominio que utilizaste al balanceador de carga de tu nodo. Pronto deberías verlo ejecutándose en tu clúster y tu servicio apareciendo en el dominio que especificaste en el ingreso.
Examina el pod nginx o los certificados para depurar.
¿Tienes problemas? [Contáctanos](/contact) y te ayudaremos!

Aunque esta solución puede ahorrarte dinero en tu factura de la nube, es importante tener en cuenta que utilizar sin balanceadores de carga tiene sus propios problemas. Por ejemplo, si un nodo falla, el tráfico no se enrutará automáticamente a un servidor sano, lo que resulta en tiempo de inactividad del servicio. En muchos casos, un balanceador de carga sigue siendo la mejor opción porque proporciona redundancia automática y garantiza que tus servicios estén disponibles para tus clientes. Es tu responsabilidad sopesar los ahorros de costos frente a los posibles riesgos y tomar una decisión informada sobre la mejor solución para tus necesidades.

## Versión 2: ¡Ahorra aún más dinero usando cero balanceadores de carga!

Si quieres ahorrar aún más dinero en tu factura de la nube, ¡existe una solución que no usa ningún balanceador de carga en absoluto! En lugar de Nginx Ingress, esta solución usa los puertos nodePorts 80 y 443 del servidor para dirigir el tráfico a los pods apropiados. Esto elimina la necesidad de balanceadores de carga, lo que reduce significativamente tus costos en la nube. Profundicemos en los detalles de esta solución.

Para lograr esto, actualizaremos nuestro actual ingreso nginx para usar NodePorts en lugar de Load Balancers:

```
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.service.type=NodePort \
    --set controller.service.ports.http=80 \
    --set service.annotations."metallb.universe.tf/address-pool"=singlenode \
    --set controller.service.ports.https=443
```

Tu servicio ingress-nginx debería cambiar pronto a Nodeport y el balanceador de carga debería desaparecer.

Si bien los balanceadores de carga prestan estabilidad al clúster, también son una forma legítima de ahorrar dinero con distribuciones de Kubernetes de un solo nodo. Puedes reducir significativamente tus costos mensuales eliminando la necesidad de balanceadores de carga y confiando únicamente en los puertos node 80 y 443. Sin embargo, es importante recordar que no tener un balanceador de carga significa que el tráfico no se enrutará automáticamente a un servidor sano en caso de fallo de un nodo. Esta compensación entre estabilidad y ahorro de costos es digna de consideración si ejecutas una distribución de Kubernetes de un solo nodo.


## Conclusión: ¿Vale la pena?

En resumen, hay varias maneras de reducir costos en tu clúster de Kubernetes, desde usar solo un balanceador de carga con nginx ingress hasta usar cero balanceadores de carga y confiar en nodeports. Si bien un balanceador de carga tiene ventajas en términos de estabilidad y enrutamiento de tráfico, hay alternativas que pueden ayudarte a ahorrar dinero. Si todavía no estás seguro sobre la mejor manera de ahorrar dinero en tu clúster de Kubernetes, considera aprovechar los clústeres de Kubernetes compartidos rentables de DataFortress.cloud o busca nuestra asistencia para gestionar los costos de tu clúster.
