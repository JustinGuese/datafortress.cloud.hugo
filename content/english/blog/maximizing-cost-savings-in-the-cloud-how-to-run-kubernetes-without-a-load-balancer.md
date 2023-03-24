---
title: "Maximizing Cost Savings in the Cloud: How to Run Kubernetes without a Load Balancer"
bg_image: "/images/blog/kubernetes.jpg"
date: 2023-01-18T07:10:46+02:00
author: Justin Guese
description: "Discover cost-saving tips for your Kubernetes cluster, from using one load balancer to even eliminating them altogether."
image: "/images/blog/kubernetes.jpg"
categories:
- Private cloud
tags: ["private cloud", "comparison"]
type: post
---

# Maximizing Cost Savings in the Cloud: How to Run Kubernetes without a Load Balancer

One of the most significant costs associated with running Kubernetes in the cloud is the use of a load balancer for each service. Prices start around $15 per month per load balancer, so costs quickly add up, especially if you have a large number of pods. What if we told you there's a way to run Kubernetes without a load balancer while still getting the benefits of high availability and automatic failover? In this article, we'll look at how running Kubernetes without a load balancer can help you save money in the cloud.

## Version 1: Nginx Ingress with Cert Manager uses a single Load Balancer.

One cost-cutting strategy is to use a single load balancer for the entire cluster rather than one for each service. This can be accomplished by employing a [Nginx Ingress](https://kubernetes.github.io/ingress-nginx/), which serves as a single point of entry for all external traffic to the cluster. Instead of creating one load balancer per service, the Nginx Ingress distributes traffic to the appropriate pods based on the domain name.
The best part is that if you install [cert-manager.io/docs/installation/helm/], you will receive free LetsEncrypt SSL certificates!

Using Helm is the simplest way to deploy Nginx Ingress in your cluster:

```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

After that, to ensure https and SSL running for your services, you need to deploy Cert Manager with the following command:

```
helm install \
        cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --set installCRDs=true
```

Then, you need to create a "ClusterIssuer" in order to tell LetsEncrypt who you are. Create a file "clusterissuer.yaml" with the content adapted to your Email:

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

After that, use 'kubectl apply -f clusterissuer.yaml' to apply it to your cluster and you're done!

### Establishing an Ingress

Now you must choose a name for your service that you wish to publicize. You can obtain it by typing 'kubectl get service'.

Let's pretend your service is called "nginx" in the default namespace. To route your domain "test.datafortress.cloud" to it, create the testdf-ingress.yaml file as follows:

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

Apply it with 'kubectl apply -f testdf-ingress.yaml' and point the domain you used to your node's load balancer. You should soon see it spin up in your cluster and your service appear at the domain you specified in the ingress.
Examine the nginx pod or certificates to debug.
Struggling? [Contact us](/contact) and we will assist you!

While this solution may save you money on your cloud bill, it's important to note that using no load balancers has its own set of issues. For example, if a node fails, traffic will not be automatically routed to a healthy server, resulting in service downtime. A load balancer is still the best option in many cases because it provides automatic failover and ensures that your services are available to your customers. It is your responsibility to weigh the cost savings versus the potential risks and make an informed decision on the best solution for your needs.

## Version 2: Save even more money by using zero load balancers!

If you want to save even more money on your cloud bill, there is a solution that does not use any load balancers at all! Instead of Nginx Ingress, this solution uses the server's nodePorts 80 and 443 to direct traffic to the appropriate pods. This eliminates the need for load balancers, lowering your cloud costs significantly. Let's get into the specifics of this solution.

To accomplish this, we will upgrade our current nginx ingress to use NodePorts rather than Load Balancers:

```
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.service.type=NodePort \
    --set controller.service.ports.http=80 \
    --set service.annotations."metallb.universe.tf/address-pool"=singlenode \
    --set controller.service.ports.https=443
```

Your ingress-nginx service should soon switch to Nodeport, and the load balancer should disappear.

While load balancers provide cluster stability, they are also a legitimate way to save money with one-node Kubernetes distributions. You can significantly reduce your monthly costs by eliminating the need for load balancers and relying solely on node ports 80 and 443. However, it is important to remember that not having a load balancer means that traffic will not be automatically routed to a healthy server in the event of a failing node. This trade-off between stability and cost savings is worth considering if you run a one-node Kubernetes distribution.

## Conclusion: Is it worthwhile?

To summarize, there are numerous ways to reduce costs in your Kubernetes cluster, ranging from using only one load balancer with nginx ingress to using zero load balancers and relying on nodeports. While a load balancer has advantages in terms of stability and traffic routing, there are alternatives that can help you save money. If you're still unsure about the best way to save money in your Kubernetes cluster, [consider taking advantage of DataFortress.cloud's cost-effective shared Kubernetes clusters, or seek our assistance in managing your cluster costs](/contact).