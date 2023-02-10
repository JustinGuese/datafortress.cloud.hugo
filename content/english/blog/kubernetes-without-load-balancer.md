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

When it comes to running Kubernetes in the cloud, one of the most significant costs can come from using a load balancer for each service. With prices starting at around $15 per month per load balancer, it's easy for costs to quickly add up, especially if you have a large number of pods. However, what if we told you that there's a way to run Kubernetes without the need for a load balancer and still get the benefits of high availability and automatic failover? In this article, we'll explore how you can achieve cost savings in the cloud by running Kubernetes without a load balancer.

## Version 1: Nginx Ingress with Cert Manager to just use one Load Balancer

One cost-saving strategy is to use only one load balancer for the entire cluster, rather than a separate load balancer for each service. This can be achieved by using an [Nginx Ingress](https://kubernetes.github.io/ingress-nginx/), which acts as a single entry point for all external traffic to the cluster. The Nginx Ingress then distributes the traffic to the appropriate pods based on the domain name, instead of creating one load balancer per service.
The best part: If you are adding [cert manager](https://cert-manager.io/docs/installation/helm/), you will get free LetsEncrypt SSL certificates!

The easiest way to deploy the Nginx Ingress in your cluster, is by using Helm:

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

After that, apply it to your cluster with `kubectl apply -f clusterissuer.yaml` and you are set up!

### Creating an Ingress

Now, you need to grab the name of your service that you want to expose to the world. You can get it with `kubectl get service`.

In this example, let's assume your service is named "nginx" in the default namespace. To route your domain "test.datafortress.cloud" to it, you need to create the following testdf-ingress.yaml:

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

Apply it with `kubectl apply -f testdf-ingress.yaml`, and point the domain you used to the load balancer used by your node. Soon you should see it spin up in your cluster, and see your service at the domain you stated in the ingress. 
To debug, have a look at the nginx pod or certificates. 
Struggling? [Contact us](/contact) and we will help you out!

While this solution may save you money on your cloud bill, it's important to note that using no load balancers can come with its own set of challenges. For example, if a node fails, the traffic won't be automatically routed to a healthy server, leading to downtime for your service. In many cases, having a load balancer is still the best option as it provides automatic failover and ensures that your services remain available to your customers. It's up to you to weigh the cost savings against the potential risks and make an informed decision on the best solution for your needs.

## Version 2: Saving even more money with 0 load balancers!

If you're looking to save even more money on your cloud bill, there's an alternative to the above solution that uses no load balancers at all! Instead of using Nginx Ingress, this solution utilizes the nodePorts 80 and 443 on the server to redirect traffic to the appropriate pods. This eliminates the need for any load balancers, which can significantly reduce your cloud costs. Let's dive into the details of this solution.

To do this, we will upgrade our existing nginx ingress to use NodePorts instead of Load Balancers:

```
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.service.type=NodePort \
    --set controller.service.ports.http=80 \
    --set service.annotations."metallb.universe.tf/address-pool"=singlenode \
    --set controller.service.ports.https=443
```

You should soon see your ingress-nginx service to switch to Nodeport, and the load balancer should disappear. 

While using load balancers provides stability to a cluster, it is a legitimate way to save money with one-node Kubernetes distributions. By eliminating the need for load balancers and relying solely on the node ports 80 and 443, you can reduce your monthly costs significantly. However, it's important to keep in mind that not having a load balancer also means that in case of a failing node, the traffic will not be automatically routed to a healthy server. If you are operating a one-node Kubernetes distribution, this trade-off between stability and cost savings is worth considering.

## Verdict: Is it worth it?

In conclusion, there are multiple ways to save costs in your Kubernetes cluster, from using only one load balancer with nginx ingress to using 0 load balancers and relying on nodeports. While a load balancer has its benefits in terms of stability and ensuring traffic routing, there are alternatives that can help reduce costs. If you're still unsure of the best way to save money in your Kubernetes cluster, [consider taking advantage of the cost-effective shared Kubernetes clusters offered by DataFortress.cloud, or seek our assistance in managing your cluster costs](/contact).