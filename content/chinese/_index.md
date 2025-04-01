---
####################### 横幅 #########################
banner:
  title : "从尘土数据到收入黄金"
  image : "images/banner-art.svg"
  imagetwo: "images/justin-guese-bg-removed.png"
  content : "数据工程，DevOps（K8s，操作系统），人工智能 <br> 我们在这里为您提供帮助"
  button:
    enable : true
    label : "免费15分钟咨询"
    link : "contact/"


########################## 客户标志滑块 #########################
clients_logo_slider:
  enable : true
  title: "受到世界顶级公司的信任"
  logos:
  - "images/client-logo/bmw.png"
  - "images/client-logo/volksbank.png"
  - "images/client-logo/volksbank.png"
  - "images/client-logo/hpe-small.png"
  - "images/client-logo/porsche-holding.png"
  - "images/client-logo/vw.png"
  - "images/client-logo/atruvia.png"
  - "images/client-logo/buchinger-wilhelmi.png"
  - "images/client-logo/ottoai.png"
  - "images/client-logo/summai.png"


##################### 特点 ##########################
feature:
  enable : true
  title : "许多公司难以释放其数据的潜力"
  content : "
这就是我们介入的地方。
虽然AWS和公共云可能成本高昂，并且通常受到德国金融和医疗法规的限制，但我们提供安全的Kubernetes托管解决方案。
凭借与大众汽车、HPE、保时捷和主要银行等企业合作的成功记录，我们可以将您的数据转化为有价值的收入。"
  button:
    enable : true
    label : "免费15分钟咨询"
    link : "contact/"
  feature_item:
  # 特点项目循环
  - name : "大数据"
    icon : "fa fa-database"
    content : "数据仓库、数据湖、数据集市、ETL管道和Trino/Hadoop。我们可以摄取和处理任何数据！"
    
  # 特点项目循环
  - name : "云/Kubernetes"
    icon : "fa fa-cloud"
    content : "裸金属和（混合）云上的Kubernetes。不确定选择哪一个？给我们打电话！"
    
  # 特点项目循环
  - name : "人工智能/机器学习"
    icon : "fas fa-robot"
    content : "符合欧盟标准且可扩展的人工智能解决方案。ML Ops可扩展您的AI工作负载。"
    
  # 特点项目循环
  - name : "端到端服务"
    icon : "far fa-thumbs-up"
    content : "我们提供全面的端到端服务，涵盖从咨询和架构到编程的所有内容。"
      
      
######################### 介绍视频 #####################
intro_video:
  enable: true
  title: "DataFortress.cloud在60秒内"
  content: "因为有时候，一段视频比千言万语更能说明问题。"
  video_url: "https://www.youtube.com/embed/eEWvARX0FT0"
  video_thumbnail: "images/video-popup.png"

      
      
######################### 服务 #####################
service:
  enable : true
  service_item:
  # 服务项目循环
  - title : "企业解决方案架构：与HPE合作，革命性地改变大众汽车的采样流程数据流"
    images:
    - "images/client-logo/vw.png"
    - "images/client-logo/hpe-small.png"
    - "images/service-3.png"
    content : "我们与惠普企业（HPE）和大众汽车（VW）合作，设计了一种尖端的解决方案架构，彻底改变了大众汽车的企业材料采样流程。通过将SaaS平台集成到大众汽车复杂的系统架构中，我们显著提高了新车型的上市速度，同时简化了整个采样工作流程。
<br/><br/>
我们的解决方案利用模块化微服务架构，实现了大众汽车各系统与新平台之间的安全、合规的数据传输。结果？采样时间和错误率显著减少了64%，同时满足了大众汽车和VDA的合规标准。这个项目展示了我们在解决技术挑战、提高效率和为全球领导者提供有影响力的解决方案方面的专业知识。"
      
  # 服务项目循环
  - title : "数据工程：为Atruvia、和Volksbank转变数据管理"
    images:
    - "images/client-logo/volksbank.png"
    - "images/client-logo/volksbank.png"
    - "images/client-logo/atruvia.png"
    content : "我们与Atruvia（Volksbank和的IT提供商）合作，用现代的开源数据仓库取代了昂贵的Hadoop基础设施。基于Trino和S3自动扩展集群的BaFin合规架构处理来自数百万客户的大量金融数据，同时以较低的成本提供卓越的性能。
<br/><br/>
通过设计微服务架构并提供用户友好的分析环境，我们使Atruvia的团队能够无缝分析大型数据集，而无需复杂的配置。我们的解决方案不仅增强了可扩展性和数据性能，还确保了合规性，为Atruvia的未来增长做好了准备。这个项目展示了我们在提供创新、成本效益高的数据架构方面的能力，这些架构符合最高的行业标准。"
      
  # 服务项目循环
  - title : "开源：通过CI/CD和Python Poetry增强Google的TimesFM"
    images:
    - "images/client-logo/googleresearch.jpg"
    content : "作为我对Google Research的TimesFM项目的开源贡献的一部分，我实施了关键改进，简化了开发过程并增强了用户的可访问性。TimesFM是一个前沿的预测模型，预训练了1000亿个真实世界的时间点，在零样本情况下为零售、金融和医疗等行业提供了令人印象深刻的时间序列预测性能。尽管其功能强大，但该项目需要在部署和依赖管理方面进行改进，以最大化其影响。
<br/><br/>
我通过使用GitHub Actions集成了一个持续集成/持续部署（CI/CD）管道，自动化测试和部署工作流程，并确保代码质量的一致性。此外，我还实施了Python Poetry以实现无缝的依赖管理，简化安装并增强可重复性。这些改进降低了新用户和开发人员的门槛，提高了生产力，并促进了更好的协作，使TimesFM能够继续在时间序列预测创新的前沿保持领先地位。
<br/><br/>
通过优化开发环境和部署流程，我的贡献确保了TimesFM能够以更高的效率和便捷性继续提供强大的预测能力。"
      
  # 服务项目循环
  - title : "企业解决方案架构：宝马/HPE：全球虚拟机备份解决方案"
    images:
    - "images/client-logo/bmw.png"
    content : "我们与宝马和HPE合作，设计了一种可扩展且成本效益高的全球备份解决方案，以支持宝马广泛的虚拟机（VM）系统和文件共享基础设施。面对管理全球网络中数百PB数据的挑战，我们开发了一种混合策略，将云存储提供商与本地HPE重复数据删除服务器无缝集成。
<br/><br/>
通过利用AWS、Google Cloud和Azure的优势，结合HPE的先进重复数据删除技术，我们克服了带宽限制并显著降低了存储成本。我们的解决方案通过多云冗余确保数据可靠性，并允许根据宝马的未来需求进行可扩展增长。这个项目突显了我们在架构全球数据备份系统方面的专业知识，这些系统提供了强大的性能、成本效益和长期可持续性。"
       
       
################### 客户评价 ########################
testimonials:
  enable: false
  title: "受到领先企业的信任"
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
        

################### 工具集成 ########################
tools_intregrate:
  enable : true
  title : "与您的团队喜爱的所有工具集成"
  content: "从公共云提供商到简单的Excel - 我们可以处理和集成任何数据源。"
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

  

##################### 行动呼吁 #####################
call_to_action:
  enable : true
  title : "准备好开始了吗？"
  content : "联系我们，进行免费15分钟咨询，告诉我们您的数据/云挑战。"
  button:
    enable : true
    label : "联系我们"
    link : "contact/"
---
