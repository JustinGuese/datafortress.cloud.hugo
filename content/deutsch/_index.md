---
####################### Banner #########################
banner:
  title : "Technical Outlier & AI Architect 🚀"
  image : "images/banner-art.svg"
  imagetwo: "images/justin-guese-bg-removed.png"
  content : "Skalierung sicherer, hochperformanter Data Engineering-, DevOps- und Agentic-AI-Lösungen für die anspruchsvollsten Branchen der Welt – von Automobilgiganten bis hin zu hochregulierten Bankennetzwerken.<br><br><small>Zertifizierter AWS Cloud Solution Architect und Data Engineer mit Hintergrund in Computational Neuroscience. Spezialisiert auf die Verbindung sicherer On-Premise-Kubernetes/OpenShift-Umgebungen mit modernsten autonomen Workflows.</small>"
  button:
    enable : true
    label : "Architektur-Review buchen"
    link : "https://cal.com/datafortress-justin/15min"


########################## Clients Logo Slider #########################
clients_logo_slider:
  enable : true
  title: "Vertraut von globalen Giganten"
  logos:
  - "images/client-logo/atruvia.png"
  - "images/client-logo/porsche-holding.png"
  - "images/client-logo/vw.png"
  - "images/client-logo/bmw.png"
  - "images/client-logo/hpe-small.png"
  - "images/client-logo/volksbank.png"


##################### Feature ##########################
feature:
  enable : true
  title : "Kernpfeiler der Expertise"
  content : "Ich schreibe nicht nur Code; ich baue Festungen für Ihre Daten. Von gehärteter Sicherheit für reguliertes Banking bis zur nächsten Grenze der Agentic AI."
  button:
    enable : true
    label : "Alle Services erkunden"
    link : "services/"
  feature_item:
  - name : "Cloud-Infrastruktur & DevOps"
    icon : "fa fa-server"
    content : "Orchestrierungs-Spezialisten: Hochverfügbares On-Premise- und Hybrid-Kubernetes/OpenShift. Gehärtete Sicherheit: BaFin-konforme CI/CD, VPC-Isolation und Multi-Rechenzentrums-Guardrails. [Mehr erfahren →](/services/cloud-infrastructure-devops/)"

  - name : "Data Engineering & Analytics"
    icon : "fa fa-database"
    content : "Massiver Maßstab: Petabyte-Datenreplikation über 60+ Länder hinweg. Moderne Data Stacks: Distribuierte Engines mit Trino/Starburst, Hive und MinIO. [Mehr erfahren →](/services/data-engineering-analytics/)"

  - name : "Agentic AI & Automatisierung"
    icon : "fas fa-robot"
    content : "Die nächste Grenze: Multi-Agent-Frameworks (LangGraph/LangChain), die über statisches RAG hinausgehen. Private KI: 100% sichere, lokale LLM-Plattformen für proprietäre Daten. [Mehr erfahren →](/services/agentic-ai-automation/)"

  - name : "Compliance-First Strategie"
    icon : "fas fa-shield-halved"
    content : "Sichere Übertragung hochsensibler Gesundheitsdaten und Finanzbücher in Cloud-Umgebungen (GDPR & BaFin-Konformität). [Sprechen wir darüber →](/contact/)"
      
      

      
######################### Intro Video #####################
intro_video:
  enable: true
  title: "DataFortress.cloud in 60 Sekunden"
  content: "Aufbau hochperformanter Infrastruktur für das KI-Zeitalter."
  video_url: "https://www.youtube.com/embed/eEWvARX0FT0"
  video_thumbnail: "images/video-popup.png"

      
      
######################### Service #####################
service:
  enable : true
  service_item:
  # service item loop
  - title : "Fallstudie: Die 120-Minuten-Banken-Rettung (Atruvia)"
    images:
    - "images/client-logo/atruvia.png"
    - "images/client-logo/volksbank.png"
    content : "**Die Krise:** Ein HashiCorp Vault Synchronisationsfehler verursachte ein Missverhältnis bei den architektonischen Secrets, was dazu führte, dass Anwendungen in Rechenzentrum A Live-Transaktionen direkt in die Produktionsdatenbank von Rechenzentrum B schrieben. Unter strengen BaFin-Vorschriften hatten wir ein definitives 2-Stunden-Fenster, bevor ein obligatorischer Bundesbericht ausgelöst wurde.
<br/><br/>
**Die Lösung:** Nutzung der nativen Container-Orchestrierung von OpenShift und Kubernetes, um Rollouts einzufrieren, falsch konfigurierte Pods zu beenden und maßgeschneiderte Datenabgleichsskripte mit null Datenverlust auszuführen – wenige Minuten vor Ablauf der Frist.
<br/><br/>
**Die permanente Prävention:** Neugestaltung der Architektur unter Verwendung einer erweiterten Istio-Service-Mesh-Konfiguration mit geografischer Sperrung und strengen Autorisierungsregeln für Egress-Gateways."
    button:
      enable : true
      label : "Vollständige Fallstudie lesen"
      link : "/portfolio/atruvia--volksbank-data-warehouse/"
      
  # service item loop
  - title : "Fallstudie: Globale Flotten-Synchronisation (HPE / BMW)"
    images:
    - "images/client-logo/bmw.png"
    - "images/client-logo/hpe-small.png"
    content : "**Die Herausforderung:** Etablierung globaler Ausrichtung und Echtzeit-Datencompliance über massive Data Lakes hinweg für einen der weltweit führenden Automobilgiganten.
<br/><br/>
**Das Ergebnis:** Programmierung und Bereitstellung einer Petabyte-Datenreplikations-Pipeline, die gleichzeitig in mehr als 60 Ländern aktiv ist und Hochverfügbarkeit sowie globale Systemkonformität gewährleistet."
    button:
      enable : true
      label : "Vollständige Fallstudie lesen"
      link : "/portfolio/bmw-worldwide-backup-solution/"
      
  # service item loop
  - title : "Open Source Impact & Technische Autorität"
    images:
    - "images/client-logo/googleresearch.jpg"
    content : "Wir nutzen nicht nur Infrastruktur; wir helfen, sie aufzubauen. Direkte Beiträge zu den Kernwerkzeugen, auf die sich die Branche verlässt:
<br/><br/>
- **Google Research (TimesFM):** Beitrag zum SOTA Time Series Foundation Model.
- **Hetzner Cloud:** Aufbau und Beitrag zum primären Kubernetes CSI Storage-Treiber.
- **Pandas:** Direkte technische Beiträge zur grundlegenden Bibliothek für globale Data Science.
- **Anthropic:** Finanziert durch das Anthropic OpenSource-Programm."
    button:
      enable : true
      label : "Technischen Fußabdruck ansehen"
      link : "/recognition/"

  # service item loop
  - title : "Product Foundry: Aigentic Vibes Ecosystem"
    images:
    - "images/service-1.png"
    content : "Wir bauen und warten Live-Produkte im Produktionsmaßstab, die unsere architektonischen Theorien in der realen Welt beweisen:
<br/><br/>
- **AgentBureau:** Elite B2B KI-Agentur-Plattform für Multi-Agent-Workflows.
- **DocumentChat:** Enterprise-KI-RAG-Assistent für Big-Data-Dokumentenanalyse.
- **PsychDiary:** KI-gestützter Begleiter für emotionales Tracking.
- **Quant Trading:** Hochleistungssysteme mit automatisierten Prognosemodellen."
    button:
      enable : true
      label : "Die Foundry erkunden"
      link : "/products/"
       
       
################### Testimonials ########################
testimonials:
  enable: true
  title: "Vertraut von führenden Unternehmen"
  content: "Echte Ergebnisse aus echten Enterprise-Engagements"
  
  testimonials_quotes:
  - quote: "OpenShift, GitLab CI/CD, HashiCorp Vault, Kubernetes im Bankenmaßstab – Justin kennt diesen Stack in- und auswendig und liefert unter Compliance-Bedingungen, mit denen die meisten Ingenieure nie zu tun haben."
    name: "Platform Engineering Lead"
    designation: "Atruvia (120+ deutsche Banken)"
    image: "images/avatar/02.jpg"

  - quote: "Wir haben unsere Data-Warehouse-Kosten um 45 % gesenkt und Abfragen laufen 3x schneller. Nicht nur Infrastruktur – der gesamte Ansatz, wie wir über Daten denken, hat sich geändert."
    name: "Data Engineering Lead"
    designation: "Automobil-OEM (60+ Länder)"
    image: "images/avatar/03.jpg"

  - quote: "Kubernetes fühlte sich unmöglich an, bis wir jemanden hatten, der es tatsächlich erklären konnte. Justin hat nicht nur die Infrastruktur betrieben – er hat uns beigebracht, sie zu beherrschen."
    name: "CTO"
    designation: "Healthcare / SaaS"
    image: "images/avatar/04.jpg"
        

################### tools_intregrate ########################
tools_intregrate:
  enable : true
  title : "Technisches Verzeichnis & Core Stack"
  content: "Sprachen: Python, Go, Rust, Java, TypeScript, HCL. <br> Cloud & Infra: Kubernetes, OpenShift, Helm, ArgoCD, AWS, GCP, Azure. <br> Data Layers: Trino, Kafka, PostgreSQL, MinIO, Hadoop."
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
    - "images/tools/linux.png"
    - "images/tools/google-cloud-logo-3.png"
    - "images/tools/python.svg.png"

  

##################### Call to action #####################
call_to_action:
  enable : true
  title : "Ich schreibe nicht nur Code; ich baue Festungen für Ihre Daten."
  content : "Anfragen für hochkomplexe Freelance-Engagements, Architektur-Review-Verträge oder KI-Integrationsstrategien. Sitz in München, Deutschland (Weltweit verfügbar)."
  button:
    enable : true
    label : "Architektur-Review buchen"
    link : "https://cal.com/datafortress-justin/15min"
---
