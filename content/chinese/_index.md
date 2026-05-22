---
####################### Banner #########################
banner:
  title : "AI 时代的企业级基础设施"
  image : "images/banner-art.svg"
  imagetwo: "images/justin-guese-bg-removed.png"
  content : "为全球要求最严苛的行业（从汽车巨头到符合 BaFin 标准的银行网络）提供安全、高性能的数据工程和 DevOps 扩展服务。获得认证的 AWS 解决方案架构师，将本地 Kubernetes/OpenShift 与自主代理工作流无缝连接。"
  button:
    enable : true
    label : "预约架构评审"
    link : "contact/"


########################## Clients Logo Slider #########################
clients_logo_slider:
  enable : true
  title: "深受全球领先企业的信赖"
  logos:
  - "images/client-logo/bmw.png"
  - "images/client-logo/volksbank.png"
  - "images/client-logo/hpe-small.png"
  - "images/client-logo/porsche-holding.png"
  - "images/client-logo/vw.png"
  - "images/client-logo/atruvia.png"
  - "images/client-logo/buchinger-wilhelmi.png"
  - "images/client-logo/ottoai.png"
  - "images/client-logo/summai.png"


##################### Feature ##########################
feature:
  enable : true
  title : "三大支柱。PB 级数据。零停机容忍。"
  content : "
我们在三个领域构建关键任务系统：面向受监管行业的<strong>符合 BaFin 标准的 Kubernetes/OpenShift</strong>、跨越 60 多个国家的 <strong>PB 级数据工程</strong>，以及在本地自主运行的<strong>代理 AI (Agentic AI)</strong>。公有云通常成本过高，且往往受限于德国金融和医疗法规。我们为大众 (VW)、HPE、宝马 (BMW)、保时捷 (Porsche) 和德国最大的银行网络填补了这一空白。"
  button:
    enable : true
    label : "15 分钟免费咨询"
    link : "contact/"
  feature_item:
  # feature item loop
  - name : "大数据"
    icon : "fa fa-database"
    content : "数据仓库、数据湖、数据集市、ETL 管道以及 Trino/Hadoop。我们能摄取并处理任何数据！"
    
  # feature item loop
  - name : "云/Kubernetes"
    icon : "fa fa-cloud"
    content : "裸金属及（混合）云上的 Kubernetes。不确定如何选择？请联系我们！"
    
  # feature item loop
  - name : "AI/ML"
    icon : "fas fa-robot"
    content : "符合欧盟标准且可扩展的 AI 解决方案。通过 ML Ops 扩展您的 AI 工作负载。"
    
  # feature item loop
  - name : "端到端服务"
    icon : "far fa-thumbs-up"
    content : "我们提供全面的端到端服务，涵盖从咨询、架构设计到编程实现的方方面面。"
      
      
######################### Intro Video #####################
intro_video:
  enable: true
  title: "60 秒了解 DataFortress.cloud"
  content: "因为有时视频比文字更具说服力。"
  video_url: "https://www.youtube.com/embed/eEWvARX0FT0"
  video_thumbnail: "images/video-popup.png"

      
      
######################### Service #####################
service:
  enable : true
  service_item:
  # service item loop — Atruvia DevOps modernization (headline case)
  - title : "Atruvia DevOps 现代化：Spring Boot 微服务、Jenkins → GitLab、Finanzamt 集成"
    images:
    - "images/client-logo/atruvia.png"
    - "images/client-logo/volksbank.png"
    content : "在 Atruvia（120 多家德国合作银行的 IT 支柱）开展的多年 DevOps 合作。我们领导了跨数百个管道从 Jenkins 到 GitLab CI 的迁移，将单体服务重构为运行在 OpenShift 上的 Java Spring Boot 微服务，并设计了核心银行 system 与德国联邦税务局 (Finanzamt) 申报端点之间的安全通信层。
<br/><br/>
每个组件在设计上都符合 BaFin 标准——采用具有可审计晋升门的“管道即代码”、通过 HashiCorp Vault 进行机密驱动的部署，以及在数据中心之间执行严格服务间授权的 Istio 服务网格。结果：部署频率提升，交付周期缩短，平台能够经受住监管审查。
<br/><br/>
这正是我们被召集的原因：高风险、受监管，且通过工程化设计确保运行“枯燥”（稳健）。"

  # service item loop
  - title : "企业级解决方案架构：借助 HPE 变革大众 (VW) 采样流程中的数据流"
    images:
    - "images/client-logo/vw.png"
    - "images/client-logo/hpe-small.png"
    - "images/service-3.png"
    content : "我们与慧与科技 (HPE) 和大众汽车 (VW) 合作，设计了尖端的解决方案架构，变革了大众的企业材料采样流程。通过将 SaaS 平台集成到大众复杂的系统架构中，我们显著提高了新车型的上市速度，同时简化了整个采样工作流。
<br/><br/>
我们的解决方案采用了模块化微服务架构，实现了不同大众系统与新平台之间安全、合规的数据传输。结果是：采样时间和错误率降低了 64%，同时完全符合大众和 VDA 的合规标准。该项目展示了我们在应对技术挑战、提高效率以及为大众等全球领导者提供影响力解决方案方面的专长。"
      
  # service item loop
  - title : "数据工程：为 Atruvia 和 Volksbank 变革数据管理"
    images:
    - "images/client-logo/volksbank.png"
    - "images/client-logo/volksbank.png"
    - "images/client-logo/atruvia.png"
    content : "我们与 Volksbank 的 IT 服务提供商 Atruvia 合作，用现代开源数据仓库取代了昂贵的基于 Hadoop 的基础设施。该架构建立在 Trino 和 S3 自动扩展集群之上，符合 BaFin 标准，在处理来自数百万客户的海量金融数据的同时，以更低的成本提供了卓越的性能。
<br/><br/>
通过设计微服务架构并提供用户友好的分析环境，我们使 Atruvia 团队能够无缝分析大型数据集，而无需进行复杂的配置。我们的解决方案不仅增强了可扩展性和数据性能，还确保了监管合规性，为 Atruvia 的未来增长奠定了基础。该项目展示了我们提供满足最高行业标准的创新、高性价比数据架构的能力。"
      
  # service item loop
  - title : "开源贡献：通过 CI/CD 和 Python Poetry 增强 Google 的 TimesFM"
    images:
    - "images/client-logo/googleresearch.jpg"
    content : "作为我对 Google Research 的 TimesFM 项目开源贡献的一部分，我实施了关键改进，简化了开发流程并增强了用户可访问性。TimesFM 是一种尖端的预测模型，在 1000 亿个真实世界时间点上进行了预训练，为零售、金融和医疗等行业的时间序列预测提供令人印象深刻的零样本性能。尽管其功能强大，但该项目在部署和依赖管理方面仍需改进，以最大限度地发挥其影响力。
<br/><br/>
我的贡献包括使用 GitHub Actions 集成持续集成/持续部署 (CI/CD) 管道，实现测试和部署工作流的自动化，并确保一致的代码质量。此外，我实施了 Python Poetry 以实现无缝的依赖管理，简化了安装并增强了可重复性。这些增强功能降低了新用户和开发者的门槛，提高了生产力，并促进了更好的协作，使 TimesFM 能够保持在时间序列预测创新的前沿。
<br/><br/>
通过优化开发环境和部署流程，我的贡献确保了 TimesFM 能够继续以更高的效率和易用性提供强大的预测功能。"
      
  # service item loop
  - title : "企业级解决方案架构：BMW / HPE：全球虚拟机备份解决方案"
    images:
    - "images/client-logo/bmw.png"
    content : "我们与宝马 (BMW) 和 HPE 合作，设计了一个可扩展且具有成本效益的全球备份解决方案，以支持宝马广泛的虚拟机 (VM) 系统和文件共享基础设施。面对在遍布全球的网络中管理数百 PB 数据的挑战，我们开发了一种混合策略，将公有云存储提供商与本地 HPE 重复数据删除服务器无缝集成。
<br/><br/>
通过利用 AWS、Google Cloud 和 Azure 的优势，结合 HPE 先进的重复数据删除技术，我们克服了带宽限制并显著降低了存储成本。我们的解决方案通过多云冗余确保了数据的可靠性，并允许根据宝马未来的需求进行扩展。该项目凸显了我们在构建全球数据备份系统方面的专长，这些系统具有强大的性能、成本效益和长期可持续性。"
       
       
################### Testimonials ########################
testimonials:
  enable: false
  title: "深受领先企业的信赖"
  content: ""
  
  testimonials_quotes:
  - quote: "Lorem ipsum dolor amet, conseetur adipiscing elit. Ornare quam porta arcu congue felis volutpat. Vitae lectudbfs dolor faucibus"
    name: "Ryder Stewart"
    designation: "Lynch, Marquardt"
    image: "images/avatar/02.jpg"

  - quote: "Conseetur adipiscing elit. Ornare quam porta arcu congue felis volutpat. Vitae lectudbfs pellentesque vitae dolor faucibus"
    name: "Kade Kim"
    designation: "Champlin Group"
    image: "images/avatar/03.jpg"

  - quote: "Lorem ipsum dolor amet, conseetur adipiscing elit. Ornare quam porta arcu congue felis volutpat. Vitae lectudbfs pellentesque vitae dolor"
    name: "David Cameron"
    designation: "CEO, Nexuspay"
    image: "images/avatar/04.jpg"
        

################### tools_intregrate ########################
tools_intregrate:
  enable : true
  title : "集成您团队喜爱的所有工具"
  content: "从公有云提供商到简单的 Excel——我们可以处理并集成任何数据源。"
  image : "images/screenshot.svg"

  tools:
    - "images/tools/Amazon_Web_Services-Logo.wine.png"
    - "images/tools/hetzner.png"
    - "images/tools/sap.png"
    - "images/tools/azure.svg.png"
    - "images/tools/jupyter-notebook.png"
    - "images/tools/snowflake.svg.png"
    - "images/tools/docker.png"
    - "images/tools/kubernetes.jpg"
    - "images/tools/trino-logo.png"
    - "images/tools/excel.jpeg"
    - "images/tools/linux.png"
    - "images/tools/google-cloud-logo-3.png"
    - "images/tools/python.svg.png"

  

##################### Call to action #####################
call_to_action:
  enable : true
  title : "我不只是编写代码。我为您的数据建立堡垒。"
  content : "欢迎咨询高复杂度的自由职业项目、架构评审或 AI 集成策略。总部位于德国慕尼黑，服务全球。"
  button:
    enable : true
    label : "预约架构评审"
    link : "contact/"
---
