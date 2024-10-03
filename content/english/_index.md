---
####################### Banner #########################
banner:
  title : "From Dusty Data to Revenue Gold"
  image : "images/banner-art.svg"
  imagetwo: "images/justin-guese-bg-removed.png"
  content : "Data Engineering, DevOps (K8s, OS), AI <br> We’re Here to Help"
  button:
    enable : true
    label : "Free 15 minute consultation"
    link : "contact/"


########################## Clients Logo Slider #########################
clients_logo_slider:
  enable : true
  title: "Trusted by the world's best companies"
  logos:
  - "images/client-logo/bmw.png"
  - "images/client-logo/volksbank.png"
  - "images/client-logo/sparkasse.png"
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
  title : "Many companies struggle to unlock the potential of their data"
  content : "
That's where we come in.
While AWS and public clouds can be costly and are often restricted by German finance and healthcare regulations, we offer secure Kubernetes hosting solutions.
With a proven track record working with enterprises like VW, HPE, Porsche, and major banks, we can transform your data into valuable revenue."
  button:
    enable : true
    label : "Free 15-minute consultation"
    link : "contact/"
  feature_item:
  # feature item loop
  - name : "Big Data"
    icon : "fa fa-database"
    content : "Data Warehousing, Data Lakes, Data Marts, ETL Pipelines and Trino/Hadoop. We can ingest and process any data!"
    
  # feature item loop
  - name : "Cloud/Kubernetes"
    icon : "fa fa-cloud"
    content : "Kubernetes on bare-metal and in the (Hybrid-)Cloud. Not sure which to choose? Give us a call!"
    
  # feature item loop
  - name : "AI/ML"
    icon : "fas fa-robot"
    content : "EU compliant and scalable AI solutions. ML Ops to scale your AI workloads."
    
  # feature item loop
  - name : "end-to-end services"
    icon : "far fa-thumbs-up"
    content : "We offer comprehensive, end-to-end services, covering everything from consulting and architecture to programming."
      
      
######################### Intro Video #####################
intro_video:
  enable: true
  title: "DataFortress.cloud in 60 seconds"
  content: "because sometimes, a video says more than words ever could."
  video_url: "https://www.youtube.com/embed/eEWvARX0FT0"
  video_thumbnail: "images/video-popup.png"

      
      
######################### Service #####################
service:
  enable : true
  service_item:
  # service item loop
  - title : "Enterprise Solution Architecture: Revolutionizing Data Flow in VW’s Sampling Process with HPE"
    images:
    - "images/client-logo/vw.png"
    - "images/client-logo/hpe-small.png"
    - "images/service-3.png"
    content : "In collaboration with Hewlett Packard Enterprise (HPE) and Volkswagen (VW), we engineered a cutting-edge solution architecture that transformed VW’s enterprise material sampling process. By integrating a SaaS platform into VW’s complex system architecture, we significantly increased the speed-to-market of new vehicle models while streamlining the entire sampling workflow.
<br/><br/>
Our solution leveraged a modular microservice architecture, enabling secure, compliant data transfer between diverse VW systems and the new platform. The result? A remarkable 64% reduction in sampling time and error rates, all while meeting VW and VDA compliance standards. This project showcases our expertise in tackling technological challenges, improving efficiency, and delivering impactful solutions for global leaders like VW."
      
  # service item loop
  - title : "Data Engineering: Transforming Data Management for Atruvia, Sparkasse, and Volksbank"
    images:
    - "images/client-logo/volksbank.png"
    - "images/client-logo/sparkasse.png"
    - "images/client-logo/atruvia.png"
    content : "In collaboration with Atruvia, the IT provider for Volksbank and Sparkasse, we replaced an expensive Hadoop-based infrastructure with a modern, open-source data warehouse. Built on Trino and S3 autoscaling clusters, this BaFin-compliant architecture handles vast amounts of finance data from millions of customers while delivering exceptional performance at a reduced cost.
<br/><br/>
By designing a microservice architecture and providing user-friendly analytics environments, we empowered Atruvia’s teams to seamlessly analyze large datasets without complex configurations. Our solution not only enhanced scalability and data performance but also ensured regulatory compliance, positioning Atruvia for future growth. This project showcases our ability to deliver innovative, cost-efficient data architectures that meet the highest industry standards."
      
  # service item loop
  - title : "Open Source: Enhancing Google’s TimesFM with CI/CD and Python Poetry"
    images:
    - "images/client-logo/googleresearch.jpg"
    content : "As part of my open-source contributions to Google Research’s TimesFM project, I implemented key improvements that streamlined the development process and enhanced user accessibility. TimesFM, a cutting-edge forecasting model pre-trained on 100 billion real-world time points, offers impressive zero-shot performance for time-series forecasting across industries like retail, finance, and healthcare. Despite its robust capabilities, the project needed improvements in deployment and dependency management to maximize its impact.
<br/><br/>
I contributed by integrating a Continuous Integration/Continuous Deployment (CI/CD) pipeline using GitHub Actions, automating testing and deployment workflows, and ensuring consistent code quality. Additionally, I implemented Python Poetry for seamless dependency management, simplifying installation and enhancing reproducibility. These enhancements lowered the barrier for new users and developers, improved productivity, and fostered better collaboration, allowing TimesFM to remain at the forefront of time-series forecasting innovation.
<br/><br/>
By optimizing the development environment and deployment processes, my contributions have ensured that TimesFM can continue to deliver powerful forecasting capabilities with greater efficiency and ease."
      
  # service item loop
  - title : "Enterprise Solution Architecture: BMW / HPE: Worldwide backup solution for VMs"
    images:
    - "images/client-logo/bmw.png"
    content : "In partnership with BMW and HPE, we designed a scalable and cost-efficient global backup solution to support BMW’s extensive virtual machine (VM) systems and file sharing infrastructure. Faced with the challenge of managing hundreds of petabytes of data across a worldwide network, we developed a hybrid strategy that seamlessly integrated cloud storage providers with on-premises HPE deduplication servers.
<br/><br/>
By leveraging the strengths of AWS, Google Cloud, and Azure, combined with HPE’s advanced deduplication technology, we overcame bandwidth limitations and significantly reduced storage costs. Our solution ensured data reliability through multi-cloud redundancy and allowed for scalable growth in line with BMW’s future needs. This project highlights our expertise in architecting global data backup systems that deliver robust performance, cost-efficiency, and long-term sustainability."
       
       
################### Testimonials ########################
testimonials:
  enable: false
  title: "Trusted by leading enterprises"
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
  title : "Integrates with all the tools your team loves using"
  content: "From public cloud providers to simple Excel - we can process and integrate any data source."
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
  title : "Ready to get started?"
  content : "Contact us for a free 15-minute consultation and tell us about your data/cloud challenges."
  button:
    enable : true
    label : "Contact Us"
    link : "contact/"
---
