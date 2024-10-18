---
author: 贾斯汀·格斯
bg_image: images/blog/kubernetes.jpg
categories:
- 私有云
date: '2023-01-18T07:10:46+02:00'
description: 发现为您的 Kubernetes 集群节省成本的技巧，从使用一个负载均衡器到完全消除负载均衡器。
image: images/blog/kubernetes.jpg
tags:
- private cloud
- comparison
title: 云端最大化成本节约：如何在没有负载均衡器的情况下运行 Kubernetes
type: post

---
云原生 Kubernetes 部署中一个主要的成本是每个服务的负载均衡器。每个负载均衡器每月约 15 美元，如果部署有大量 Pod，成本会迅速增加。如果我们告诉你有一种方法可以在无需负载均衡器的情况下运行 Kubernetes，同时获得高可用性和自动故障转移的好处，你会怎么做？本文将探讨如何在云端运行 Kubernetes 而无需负载均衡器，从而节省成本。

## 版本 1：使用 Cert Manager 的 Nginx Ingress 使用单个负载均衡器

一种节约成本的策略是使用单个负载均衡器为整个集群提供服务，而不是为每个服务使用一个。这可以通过使用 [Nginx Ingress](https://kubernetes.github.io/ingress-nginx/) 实现，它作为所有外部流量进入集群的唯一入口点。Nginx Ingress 不需要为每个服务创建负载均衡器，而是根据域名将流量分配到相应的 Pod。
最棒的是，如果你安装了 [cert-manager.io/docs/installation/helm/]，你将获得免费的 Let's Encrypt SSL 证书！

使用 Helm 是在集群中部署 Nginx Ingress 的最简单方法：

```
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace
```

之后，为了确保服务使用 HTTPS 和 SSL，你需要部署 Cert Manager，使用以下命令：

```
helm install \
        cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --set installCRDs=true
```

然后，你需要创建一个“ClusterIssuer”，以便告知 Let's Encrypt 你的身份。创建一个名为 "clusterissuer.yaml" 的文件，内容根据你的邮箱地址进行调整：

```
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
#修改成你的邮件地址
    email: EMAIL
    privateKeySecretRef:
       name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx # 根据版本选择 public 或 nginx
```

之后，使用 'kubectl apply -f clusterissuer.yaml' 将其应用到你的集群，就完成啦！

### 创建 Ingress

现在你必须为想要公开的服务选择一个名称。你可以通过键入 'kubectl get service' 获取它。

假设你的服务在默认命名空间中名为 "nginx"。要将你的域名 "test.datafortress.cloud" 路由到它，请创建 testdf-ingress.yaml 文件，如下所示：

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
#修改成你的域名
    - test.datafortress.cloud
    secretName: tls-secret
  rules:
#修改成你的域名
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

使用 'kubectl apply -f testdf-ingress.yaml' 应用它，并将你使用的域名指向你的节点的负载均衡器。你很快会看到它在你的集群中启动，并且你的服务出现在你指定的域中。
检查 nginx Pod 或证书进行调试。
遇到困难？[联系我们](/contact)，我们将提供帮助！

虽然此解决方案可以节省你的云账单费用，但使用零负载均衡器也有其自身的缺点。例如，如果节点故障，流量不会自动路由到健康的服务器，导致服务中断。在许多情况下，负载均衡器仍然是最佳选择，因为它提供自动故障转移并确保你的服务可用于你的客户。你需要衡量成本节约与潜在风险，并做出最适合你需求的明智决策。

## 版本 2：通过使用零负载均衡器进一步节省成本！

如果你想进一步节省云账单费用，有一种解决方案根本不用负载均衡器！这种方案不用 Nginx Ingress，而是使用服务器的 nodePort 80 和 443 将流量定向到相应的 Pod。这消除了负载均衡器的需求，从而显着降低云成本。让我们深入探讨这种解决方案的具体细节。

为此，我们将升级当前的 nginx ingress 以使用 NodePort 而不是负载均衡器：

```
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.service.type=NodePort \
    --set controller.service.ports.http=80 \
    --set service.annotations."metallb.universe.tf/address-pool"=singlenode \
    --set controller.service.ports.https=443
```

你的 ingress-nginx 服务应该很快切换到 NodePort，负载均衡器应该消失。

虽然负载均衡器提供了集群稳定性，但它们也是在单节点 Kubernetes 分布中节省开支的合理方式。通过消除负载均衡器的需求，仅依靠 node port 80 和 443，可以显着降低你的每月成本。但是，请记住，没有负载均衡器意味着如果节点故障，流量不会自动路由到健康的服务器。这种稳定性和成本节约之间的权衡，如果你运行的是单节点 Kubernetes 分布，值得考虑。


## 结论：值得吗？

总而言之，有许多方法可以降低 Kubernetes 集群的成本，从使用单个 Nginx Ingress 负载均衡器到使用零负载均衡器并依靠 nodePort。虽然负载均衡器在稳定性和流量路由方面具有优势，但还有其他替代方案可以帮助你节省成本。如果你仍不确定在 Kubernetes 集群中节省成本的最佳方法，请考虑利用 DataFortress.cloud 的经济实惠的共享 Kubernetes 集群，或寻求我们的协助来管理你的集群成本。
