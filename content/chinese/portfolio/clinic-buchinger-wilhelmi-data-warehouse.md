---
date: "2024-08-14"
draft: false
title: "布兴格威廉米诊所 - 医疗数据仓库"
logo: "images/client-logo/buchinger-wilhelmi-small.png"
---

> 解决方案架构和创建符合德国医疗法规的数据仓库，包括一个用于领先的禁食诊所的医疗数据的ETL管道，以提供个性化的应用程序建议来改善治疗。

{{< image title="布兴格威廉米诊所 - 医疗数据仓库" w="50%" o="webp q100" p="center" c="img-fluid shadow rounded-1" src="images/client-logo/buchinger-wilhelmi-small.png" alt="alter-text" >}}

## 案例研究：现代化布兴格威廉米禁食诊所的数据基础设施

**客户**：布兴格威廉米

### 项目概述：

布兴格威廉米，世界领先的禁食诊所，寻求通过先进的数据管理来增强其治疗个性化和研究能力。目标是建立一个符合严格的德国医疗法规（特别是Kliniklandeskrankenhausgesetz）的强大数据仓库，同时实现高效的数据处理和为患者提供个性化的应用程序建议。

### 目标：

设计并实施一个安全、可扩展的数据仓库解决方案，具有高效的ETL管道，确保符合德国隐私法，并使诊所能够提供个性化的治疗建议和促进全面的研究分析。

### 解决方案设计过程：

#### 需求分析：

- 与布兴格威廉米的医疗和IT团队合作，了解他们的具体需求、法规约束和数据处理要求。
- 确定由于公共云提供商的使用限制，需要一个安全的本地解决方案。

#### 技术选择：

- 选择Kubernetes进行强大的容器编排，支持自动扩展、负载均衡和高效的资源管理。
- 选择Prefect作为ETL调度器，其效率和灵活性优于传统工具如Airflow。
- 选择Minio作为兼容S3的对象存储，促进ETL步骤之间的无缝数据分段。
- 选择PostgreSQL作为最终数据存储库，其可靠性和与分析工具的兼容性。

#### 架构设计：

- 设计了一个基于裸机服务器的Kubernetes集群，以确保符合德国医疗法规并提供可扩展性。
- 实施了由Prefect管理的综合ETL管道，协调医疗数据的摄取、处理和转换。
- 配置了Minio S3存储桶用于中间数据存储，确保ETL阶段之间的数据流畅。
- 建立了PostgreSQL数据库以存储最终处理的数据，使其易于访问用于应用程序的个性化推荐和研究分析。

### 实施：

#### 基础设施设置：

- 部署了一个基于裸机服务器的Kubernetes集群，确保高可用性、自动扩展和负载均衡以处理不同的工作负载。
- 配置了Prefect作为ETL调度器，定义和协调必要的数据处理工作流。

#### ETL管道开发：

- 开发了ETL流程以提取医疗数据，将其转换为有用的格式，并加载到数据仓库中。
- 使用Minio S3存储桶在不同的ETL步骤中分段数据，确保无缝过渡和数据完整性。
- 在PostgreSQL数据库中最终处理数据，使其可用于进一步的分析和应用程序使用。

#### 数据利用：

- 将处理后的数据与个性化应用程序集成，根据用户的医疗数据提供量身定制的禁食建议。
- 为研究部门和医生开发了分析仪表板，促进数据驱动的治疗协议改进。

### 结果：

- **法规遵从**：成功实施了一个符合Kliniklandeskrankenhausgesetz的安全本地数据仓库解决方案。
- **增强个性化**：通过用户友好的应用程序实现个性化禁食建议，提升患者治疗体验。
- **改进研究能力**：为研究部门和医疗专业人员提供了全面的分析仪表板，促进数据驱动的洞察和治疗改进。
- **高效数据处理**：通过使用Prefect和Minio实现了高效的数据处理和转换，确保数据的及时和准确可用性。

### 结论：

该项目为布兴格威廉米提供了一个最先进的数据仓库解决方案，利用先进技术来符合德国医疗法规，并显著增强患者治疗个性化和研究能力。通过实施安全的本地基础设施和高效的ETL流程，诊所现在可以提供个性化建议并推动禁食治疗的持续改进。

**想要转变您的医疗数据管理？** 联系我们，探索我们如何帮助您构建符合要求、可扩展且高效的数据仓库解决方案，满足您的需求！