---
title: "Atruvia：DevOps 现代化、Spring Boot 微服务与联邦税务局 (Finanzamt) 集成"
date: "2024-03-15"
draft: false
logo: "images/client-logo/atruvia.png"
image: "images/client-logo/atruvia.png"
description: "在 Atruvia 开展的多年 DevOps 合作 —— Jenkins 到 GitLab CI 迁移、OpenShift 上的 Java Spring Boot 微服务，以及为德国最大的合作银行网络构建的安全联邦税务局集成层。"
categories: ["金融 IT", "DevOps", "OpenShift", "Spring Boot"]
---

## 项目背景

Atruvia 是德国合作银行网络的 IT 骨干 —— 为 **120 多家 Volksbanken 和 Raiffeisenbanken** 提供服务，覆盖数百万零售和企业客户。他们的平台团队运行着核心银行基础设施，必须每天通过 BaFin（德国联邦金融监管局）、BSI（德国联邦信息安全办公室）和监管机构的审查。

我作为 DevOps 和平台工程专家参与其中，负责三个相互交织的工作流：CI/CD 现代化、基于 OpenShift 的微服务重构，以及核心银行系统与德国联邦税务局 (Finanzamt) 之间的安全通信层。

---

## 1. Jenkins → GitLab CI 迁移

Atruvia 的 CI 现状是一个成熟但复杂的 Jenkins 集群 —— 包含数百个管道、数十个共享库、插件泛滥，以及在受监管环境中难以持续的“机密挂载在 Master 节点上”的模式。

迁移到 GitLab CI 是一个跨越多个季度的项目：

- **管道即代码 (Pipeline-as-code) 与源码同库。** 每次构建、测试和部署门禁都在交付代码更改的同一个 MR（合并请求）中可审计。审计员非常看重这一点，代码评审人员更是如此。
- **签名制品 + SLSA 级溯源。** 进入生产集群的每个制品都带有可验证的构建轨迹。部署门禁可以拒绝任何非规范管道产出的内容。
- **作为代码的晋升门禁。** Stage → pre-prod → prod 的晋升由显式的 YAML 定义，并与身份提供者 (IDP) 组绑定的审批规则关联。不再需要追溯“是谁点击了按钮”。
- **基于 Vault 的机密管理。** 构建和部署时的机密按任务从 HashiCorp Vault 动态获取，并使用短期令牌。这使得构建日志中的机密泄露在架构上成为不可能，而不仅仅是一个愿景。

迁移在没有“封版期”的情况下完成 —— 旧的 Jenkins 管道继续运行，同时并行验证等效的 GitLab 管道，然后按产品领域逐步切换。

---

## 2. 基于 OpenShift 的 Java Spring Boot 微服务

很大一部分银行应用栈从单体 Java 服务重构为运行在 **OpenShift** 上的独立 **Spring Boot 微服务**。项目亮点：

- **清晰的服务边界。** 采用领域驱动设计 (DDD) 进行拆分，而非简单的按包名拆分单体应用。服务拥有自己的数据并暴露精简的、带版本的 API。
- **生产级可观测性。** 每个服务都集成了 Micrometer 指标、分布式追踪 (OpenTelemetry) 和满足 BaFin 审计要求的结构化审计日志。
- **Helm + Kustomize 部署。** 使用带有环境覆盖的模板化清单，通过上述 GitLab CI 管道进行部署。ArgoCD 监控规范的环境分支。
- **内置韧性。** 在框架层面实现断路器、重试预算和舱壁隔离。具有实际意义的健康检查 (Health) 和就绪检查 (Readiness) 探针。支持平滑关闭以实现安全的滚动部署。

---

## 3. 联邦税务局 (Finanzamt) 集成层

德国银行对联邦税务局 (Finanzamt) 负有重要的申报义务 —— 包括利息申报、资本利得税申报、FATCA/CRS 信息交换以及一系列固定时间节点的结构化申报。

我设计并实现了连接核心银行系统与税务局端点的安全集成层：

- **管道驱动的申报。** 具备幂等重试机制、针对格式错误批次的死信队列，以及用于审计回放的端到端关联 ID。
- **机密与签名密钥。** 通过 HashiCorp Vault 进行管理，并内置了自动轮换机制。
- **对账工具。** 对比发送内容与确认内容，在监管机构发现异常之前主动识别数据偏差。

该路径下的每个环节都是端到端可审计的：源码、构建、部署、凭证签发、申报本身以及申报确认。

---

## 底层架构模式

所有这些都建立在将每一层视为独立防护的“深度防御”模式之上：

- **Istio 服务网格。** 具备地理锁定功能，并在出口网关上执行严格的服务间授权。跨数据中心流量是一项刻意的、经过授权的行为，绝非偶然。
- **HashiCorp Vault。** 作为机密的唯一事实来源，基于工作负载身份 (Workload Identity) 签发凭证。
- **应用层工作负载身份。** 即使路由配置错误，如果没有有效的 SPIFFE 风格身份，也无法获得访问权限。

任何一层的失效都不会导致整个系统崩溃。这正是监管机构所追求的属性，也是团队在一年 52 周中能够真实维护的属性。

---

## 为什么这很重要

受监管银行业的 DevOps 现代化并非为了追随技术趋势，而是为了让平台变得“枯燥”（稳健）—— 交付快速、难以误配置、审计简单。技术选择（GitLab、OpenShift、Spring Boot、Istio、Vault）只是基础，纪律才是差异化的核心。

此类项目正是我的专长所在：高风险、受监管、跨年度，且通过工程化设计使其隐入幕后，助力业务快速前行。

---

## 相关内容

- **服务：** [云基础设施与 DevOps (符合 BaFin 标准的 Kubernetes/OpenShift)](/zh/services/cloud-infrastructure-devops/)
- **服务：** [数据工程与分析](/zh/services/data-engineering-analytics/)
- **案例研究：** [Atruvia / Volksbank —— 数据仓库现代化](/zh/portfolio/atruvia--volksbank-data-warehouse/)
- **关于：** [Justin Güse —— 企业基础设施架构师](/zh/about/)

**正在评估我们的合作？** [预约 1 小时免费架构评审](/zh/contact/) —— 我将在 60 分钟内为您识别超过 10 万欧元的合规风险、云支出浪费或扩展瓶颈，否则我会如实相告。
