---
author: 贾斯汀·古埃斯
bg_image: images/blog/kubernetes.jpg
categories:
- 私有云
date: '2023-01-18T07:10:46+02:00'
description: 发现节省 Kubernetes 集群成本的技巧，从使用一个负载均衡器到完全消除负载均衡器。
image: images/blog/kubernetes.jpg
tags:
- private cloud
- comparison
title: 云端最大化成本节约：如何无需负载均衡器运行 Kubernetes
type: post

---
在云端运行 Kubernetes 时，最显著的成本之一可能来自为每个服务使用负载均衡器。每个负载均衡器的价格从每月约 15 美元开始，如果你的 Pod 数量很大，成本很容易迅速增加。但是，如果我们告诉你，有一种方法可以在无需负载均衡器的情况下运行 Kubernetes，同时仍然获得高可用性和自动故障转移的好处呢？本文将探讨如何在云端通过在无需负载均衡器的情况下运行 Kubernetes 来节省成本。

## 版本 1：使用 Cert Manager 的 Nginx Ingress 只使用一个负载均衡器

一种省钱的策略是仅使用整个集群的一个负载均衡器，而不是为每个服务使用单独的负载均衡器。这可以通过使用 [Nginx Ingress](https://kubernetes.github.io/ingress-nginx/) 来实现，它充当所有外部流量到集群的单个入口点。然后，Nginx Ingress 会根据域名将流量分发到相应的 Pod，而不是为每个服务创建一个负载均衡器。
最棒的是：如果你添加了 [Cert Manager](https://cert-manager.io/docs/installation/helm/)，你将获得免费的 Let's Encrypt SSL 证书！

在你的集群中部署 Nginx Ingress 的最简单方法是使用 Helm：

```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

之后，为了确保你的服务运行 https 和 SSL，你需要部署 Cert Manager，使用以下命令：

```
helm install \
        cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --set installCRDs=true
```

然后，你需要创建一个“ClusterIssuer”来告诉 Let's Encrypt 你是谁。创建一个名为“clusterissuer.yaml”的文件，其内容已根据你的电子邮件地址进行调整：

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
#更改为你的电子邮件地址
    email: EMAIL
    privateKeySecretRef:
       name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx # public 或 nginx，取决于版本
```

之后，使用 `kubectl apply -f clusterissuer.yaml` 将其应用到你的集群，你已准备好！

### 创建 Ingress

现在，你需要获取你想要暴露给世界的服务的名称。你可以使用 `kubectl get service` 获取它。

在这个例子中，假设你的服务在默认命名空间中名为“nginx”。要将你的域名 “test.datafortress.cloud” 路由到它，你需要创建以下 testdf-ingress.yaml：

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
#更改为你的域名
    - test.datafortress.cloud
    secretName: tls-secret
  rules:
#更改为你的域名
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

使用 `kubectl apply -f testdf-ingress.yaml` 应用它，并将你使用的域名指向你的节点使用的负载均衡器。很快你应该会在你的群集看到它启动，并在你指定的域名中看到你的服务。
要调试，请查看 nginx Pod 或证书。
遇到困难？[联系我们](/contact)，我们将协助你！

虽然此解决方案可能会节省你的云账单费用，但需要注意的是，不使用负载均衡器也会带来自身的一系列挑战。例如，如果某个节点失败，流量不会自动路由到健康的服务器，导致你的服务出现停机时间。在许多情况下，拥有负载均衡器仍然是最佳选择，因为它提供了自动故障转移并确保你的服务保持可访问。你必须权衡成本节省与潜在风险，并就最适合你需求的解决方案做出明智的决定。

## 版本 2：使用 0 个负载均衡器进一步节省成本！

如果你想进一步节省你的云账单，上述解决方案有一个替代方案，它完全不使用负载均衡器！此解决方案不使用 Nginx Ingress，而是使用服务器上的节点端口 80 和 443 将流量重定向到相应的 Pod。这消除了对任何负载均衡器的需求，这可以显著降低你的云成本。让我们深入了解此解决方案的细节。

为此，我们将升级现有的 nginx ingress 以使用 NodePort 而不是负载均衡器：

```
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.service.type=NodePort \
    --set controller.service.ports.http=80 \
    --set service.annotations."metallb.universe.tf/address-pool"=singlenode \
    --set controller.service.ports.https=443
```

你很快就会看到你的 ingress-nginx 服务切换到 NodePort，负载均衡器应该会消失。

虽然使用负载均衡器为集群提供了稳定性，但对于单节点 Kubernetes 分布式，它确实是一种合法的省钱方式。通过完全消除负载均衡器的需求，并仅依赖节点端口 80 和 443，你可以显著降低你的每月成本。但是，请记住，没有负载均衡器意味着，如果某个节点失败，流量不会自动路由到健康的服务器。如果你正在运行单节点 Kubernetes 分布式，那么在稳定性和成本节省之间进行权衡是有意义的。

## 结论：值得吗？

总之，有很多方法可以节省你的 Kubernetes 集群成本，从只使用一个带有 nginx ingress 的负载均衡器到使用 0 个负载均衡器并依赖节点端口。虽然负载均衡器在稳定性和确保流量路由方面有其优势，但还有其他替代方案可以帮助降低成本。如果你仍然不确定在你的 Kubernetes 集群中节省成本的最佳方法，[请考虑利用 DataFortress.cloud 提供的经济实惠的共享 Kubernetes 集群，或者寻求我们的帮助来管理你的集群成本](/contact)。
