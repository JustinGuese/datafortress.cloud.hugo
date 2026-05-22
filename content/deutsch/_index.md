---
####################### Banner #########################
banner:
  title : "Enterprise-Grade Infrastruktur für die KI-Ära"
  image : "images/banner-art.svg"
  imagetwo: "images/justin-guese-bg-removed.png"
  content : "Skalierung von sicherer, hochperformanter Dateninfrastruktur und DevOps für die anspruchsvollsten Branchen weltweit — von Automobilgiganten bis hin zu BaFin-regulierten Bankennetzwerken. Zertifizierter AWS Solutions Architect, der On-Premise Kubernetes/OpenShift mit autonomen KI-Workflows verbindet."
  button:
    enable : true
    label : "Architecture Review buchen"
    link : "contact/"


########################## Clients Logo Slider #########################
clients_logo_slider:
  enable : true
  title: "Vertrauen von weltweit führenden Unternehmen"
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
  title : "Drei Säulen. Petabytes an Daten. Null Toleranz für Ausfälle."
  content : "
Wir entwickeln geschäftskritische Systeme in drei Disziplinen: <strong>BaFin-konformes Kubernetes/OpenShift</strong> für regulierte Industrien, <strong>Petabyte-Scale Data Engineering</strong> in über 60 Ländern und <strong>Agentische KI</strong>, die autonom On-Premise läuft. Public Clouds sind oft zu teuer — und unter deutschen Finanz- und Gesundheitsregulierungen häufig untersagt. Wir schließen diese Lücke für VW, HPE, BMW, Porsche und Deutschlands größte Bankennetzwerke."
  button:
    enable : true
    label : "15 Min. kostenlose Beratung"
    link : "contact/"
  feature_item:
  # feature item loop
  - name : "Big Data"
    icon : "fa fa-database"
    content : "Data Warehousing, Data Lakes, Data Marts, ETL-Pipelines und Trino/Hadoop. Wir können jede Art von Daten verarbeiten!"
    
  # feature item loop
  - name : "Cloud/Kubernetes"
    icon : "fa fa-cloud"
    content : "Kubernetes auf Bare-Metal und in der (Hybrid-)Cloud. Sie sind sich unsicher? Sprechen wir darüber!"
    
  # feature item loop
  - name : "KI/ML"
    icon : "fas fa-robot"
    content : "EU-konforme und skalierbare KI-Lösungen. ML Ops zur Skalierung Ihrer KI-Workloads."
    
  # feature item loop
  - name : "End-to-End Services"
    icon : "far fa-thumbs-up"
    content : "Wir bieten umfassende Services von der Beratung über Architektur bis hin zur Implementierung."
      
      
######################### Intro Video #####################
intro_video:
  enable: true
  title: "DataFortress.cloud in 60 Sekunden"
  content: "Weil ein Video manchmal mehr sagt als tausend Worte."
  video_url: "https://www.youtube.com/embed/eEWvARX0FT0"
  video_thumbnail: "images/video-popup.png"

      
      
######################### Service #####################
service:
  enable : true
  service_item:
  # service item loop — Atruvia DevOps Case
  - title : "DevOps-Modernisierung bei Atruvia: Spring Boot Microservices, Jenkins → GitLab, Finanzamt-Integration"
    images:
    - "images/client-logo/atruvia.png"
    - "images/client-logo/volksbank.png"
    content : "Mehrjährige DevOps-Beauftragung bei Atruvia, dem IT-Rückgrat für über 120 deutsche Genossenschaftsbanken. Wir leiteten die Migration von Jenkins zu GitLab CI über hunderte von Pipelines hinweg, refaktorierten monolithische Dienste in Java Spring Boot Microservices auf OpenShift und entwickelten die sichere Kommunikationsschicht zwischen Kernbanksystemen und den Meldeendpunkten des deutschen Finanzamts.
<br/><br/>
Jede Komponente ist von Grund auf BaFin-konform konzipiert — Pipeline-as-Code mit prüfbaren Promotion-Gates, Secrets-gesteuerte Deployments über HashiCorp Vault und ein Istio Service Mesh, das eine strikte Service-to-Service-Autorisierung über Rechenzentren hinweg erzwingt. Das Ergebnis: höhere Deployment-Frequenz, kürzere Vorlaufzeiten und eine Plattform, die jeder regulatorischen Prüfung standhält.
<br/><br/>
Dies ist die Art von Arbeit, für die wir gerufen werden: risikoreich, reguliert und so konstruiert, dass sie im Betrieb „langweilig“ (reibungslos) ist."

  # service item loop
  - title : "Enterprise Solution Architecture: Revolutionierung des Datenflusses bei VW mit HPE"
    images:
    - "images/client-logo/vw.png"
    - "images/client-logo/hpe-small.png"
    - "images/service-3.png"
    content : "In Zusammenarbeit mit HPE und VW haben wir eine hochmoderne Lösungsarchitektur entworfen, die den Materialbemusterungsprozess transformiert hat. Durch die Integration einer SaaS-Plattform in die komplexe Systemlandschaft von VW konnten wir die Markteinführung neuer Fahrzeugmodelle beschleunigen.
<br/><br/>
Unsere Lösung setzte auf eine modulare Microservices-Architektur, die einen sicheren und konformen Datentransfer ermöglichte. Ergebnis: Eine Reduzierung der Durchlaufzeiten und Fehlerquoten um 64%, bei gleichzeitiger Einhaltung strenger VDA-Standards."
      
  # service item loop
  - title : "Data Engineering: Transformation des Datenmanagements für Atruvia und Volksbank"
    images:
    - "images/client-logo/volksbank.png"
    - "images/client-logo/volksbank.png"
    - "images/client-logo/atruvia.png"
    content : "In Zusammenarbeit mit Atruvia, dem IT-Dienstleister der Volksbanken, haben wir eine teure Hadoop-basierte Infrastruktur durch ein modernes Open-Source Data Warehouse ersetzt. Auf Basis von Trino und S3-Autoscaling-Clustern verarbeitet diese BaFin-konforme Architektur riesige Mengen an Finanzdaten von Millionen von Kunden und bietet gleichzeitig eine außergewöhnliche Performance bei reduzierten Kosten.
<br/><br/>
Durch den Entwurf einer Microservice-Architektur und die Bereitstellung benutzerfreundlicher Analyseumgebungen haben wir die Teams von Atruvia in die Lage versetzt, große Datensätze ohne komplexe Konfigurationen nahtlos zu analysieren. Unsere Lösung verbesserte nicht nur die Skalierbarkeit und Datenperformance, sondern stellte auch die Einhaltung regulatorischer Vorschriften sicher und positionierte Atruvia für zukünftiges Wachstum. Dieses Projekt zeigt unsere Fähigkeit, innovative, kosteneffiziente Datenarchitekturen zu liefern, die den höchsten Branchenstandards entsprechen."
      
  # service item loop
  - title : "Open Source: Optimierung von Googles TimesFM mit CI/CD"
    images:
    - "images/client-logo/googleresearch.jpg"
    content : "Als Teil meiner Open-Source-Beiträge zu Googles TimesFM (einem SOTA-Modell für Zeitreihen-Vorhersagen) habe ich die Entwicklungs- und Deployment-Prozesse optimiert.
<br/><br/>
Durch die Integration von GitHub Actions für automatisierte Test- und Deployment-Workflows sowie die Einführung von Python Poetry für das Abhängigkeitsmanagement wurde das Projekt für Nutzer und Entwickler weltweit zugänglicher und produktiver gemacht."
      
  # service item loop
  - title : "Enterprise Solution Architecture: Globale VM-Backup-Lösung für BMW / HPE"
    images:
    - "images/client-logo/bmw.png"
    content : "In Partnerschaft mit BMW und HPE haben wir eine skalierbare und kosteneffiziente Backup-Lösung für hunderte Petabytes an Daten entworfen.
<br/><br/>
Durch eine hybride Multi-Cloud-Strategie konnten wir Public-Cloud-Speicher nahtlos mit On-Premise HPE-Deduplizierungsservern integrieren. Das System bietet 99,95% Verfügbarkeit und ermöglicht BMW ein flexibles globales Wachstum bei minimierten Speicherkosten."
       
       
################### Testimonials ########################
testimonials:
  enable: false
  title: "Vertrauen von führenden Unternehmen"
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
  title : "Integration aller Tools, die Ihr Team liebt"
  content: "Von Public Cloud Providern bis hin zu einfachen Excel-Tabellen — wir integrieren jede Datenquelle."
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
  title : "Ich schreibe nicht nur Code. Ich baue Festungen für Ihre Daten."
  content : "Anfragen für komplexe Freelance-Projekte, Architektur-Reviews oder KI-Strategien. Sitz in München, weltweit verfügbar."
  button:
    enable : true
    label : "Architecture Review buchen"
    link : "contact/"
---
