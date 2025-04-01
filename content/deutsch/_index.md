---
####################### Banner #########################
banner:
  title : "Von staubigen Daten zu Umsatzgold"
  image : "images/banner-art.svg"
  imagetwo: "images/justin-guese-bg-removed.png"
  content : "Datenengineering, DevOps (K8s, OS), KI <br> Wir sind hier, um zu helfen"
  button:
    enable : true
    label : "Kostenlose 15-minütige Beratung"
    link : "contact/"


########################## Clients Logo Slider #########################
clients_logo_slider:
  enable : true
  title: "Vertraut von den besten Unternehmen der Welt"
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


##################### Feature ##########################
feature:
  enable : true
  title : "Viele Unternehmen kämpfen damit, das Potenzial ihrer Daten freizusetzen"
  content : "
Hier kommen wir ins Spiel.l.
Während AWS und öffentliche Clouds teuer sein können und oft durch deutsche Finanz- und Gesundheitsvorschriften eingeschränkt sind, bieten wir sichere Kubernetes-Hosting-Lösungen an.tes-Hosting-Lösungen an.
Mit einer nachgewiesenen Erfolgsbilanz bei der Zusammenarbeit mit Unternehmen wie VW, HPE, Porsche und großen Banken können wir Ihre Daten in wertvollen Umsatz verwandeln."
  button:
    enable : true
    label : "Kostenlose 15-minütige Beratung"
    link : "contact/"
  feature_item:
    # feature item loop
    - name : "Big Data"
      icon : "fa fa-database"
      content : "Data Warehousing, Data Lakes, Data Marts, ETL Pipelines und Trino/Hadoop. Wir können alle Daten aufnehmen und verarbeiten!"
      
    # feature item loop
    - name : "Cloud/Kubernetes"
      icon : "fa fa-cloud"
      content : "Kubernetes auf Bare-Metal und in der (Hybrid-)Cloud. Nicht sicher, welche Sie wählen sollen? Rufen Sie uns an!"
      
    # feature item loop
    - name : "KI/ML"
      icon : "fas fa-robot"
      content : "EU-konforme und skalierbare KI-Lösungen. ML Ops zur Skalierung Ihrer KI-Workloads."
      
    # feature item loop
    - name : "End-to-End-Dienstleistungen"
      icon : "far fa-thumbs-up"
      content : "Wir bieten umfassende End-to-End-Dienstleistungen, die alles von Beratung und Architektur bis hin zur Programmierung abdecken."
      
      
######################### Intro Video #####################
intro_video:
  enable: true
  title: "DataFortress.cloud in 60 Sekunden"
  content: "denn manchmal sagt ein Video mehr als tausend Worte."
  video_url: "https://www.youtube.com/embed/eEWvARX0FT0"
  video_thumbnail: "images/video-popup.png"

      
      
######################### Service #####################
service:
  enable : true
  service_item:
  # service item loop
  - title : "Enterprise Solution Architecture: Revolutionierung des Datenflusses im VW-Sampling-Prozess mit HPE"
    images:
    - "images/client-logo/vw.png"
    - "images/client-logo/hpe-small.png"
    - "images/service-3.png"
    content : "In Zusammenarbeit mit Hewlett Packard Enterprise (HPE) und Volkswagen (VW) haben wir eine hochmoderne Lösungsarchitektur entwickelt, die den Material-Sampling-Prozess von VW revolutionierte. Durch die Integration einer SaaS-Plattform in die komplexe Systemarchitektur von VW haben wir die Markteinführungszeit neuer Fahrzeugmodelle erheblich verkürzt und den gesamten Sampling-Workflow optimiert.ng-Workflow optimiert.
<br/><br/>
Unsere Lösung nutzte eine modulare Microservice-Architektur, die einen sicheren, konformen Datentransfer zwischen verschiedenen VW-Systemen und der neuen Plattform ermöglichte. Das Ergebnis? Eine bemerkenswerte Reduzierung der Sampling-Zeit und Fehlerquoten um 64%, während gleichzeitig die VW- und VDA-Compliance-Standards eingehalten wurden. Dieses Projekt zeigt unser Fachwissen bei der Bewältigung technologischer Herausforderungen, der Verbesserung der Effizienz und der Bereitstellung wirkungsvoller Lösungen für globale Marktführer wie VW."
      
  # service item loop
  - title : "Datenengineering: Transformation des Datenmanagements für Atruvia und Volksbank"
    images:
    - "images/client-logo/volksbank.png"
    - "images/client-logo/volksbank.png"
    - "images/client-logo/atruvia.png"
    content : "In Zusammenarbeit mit Atruvia, dem IT-Dienstleister für die Volksbank, haben wir eine teure Hadoop-basierte Infrastruktur durch ein modernes, Open-Source-Datenlager ersetzt. Diese BaFin-konforme Architektur, die auf Trino und S3-Autoscaling-Clustern basiert, verarbeitet riesige Mengen an Finanzdaten von Millionen von Kunden und bietet gleichzeitig außergewöhnliche Leistung zu reduzierten Kosten.che Leistung zu reduzierten Kosten.
<br/><br/>
Durch die Gestaltung einer Microservice-Architektur und die Bereitstellung benutzerfreundlicher Analyseumgebungen haben wir die Teams von Atruvia in die Lage versetzt, große Datensätze nahtlos zu analysieren, ohne komplexe Konfigurationen. Unsere Lösung verbesserte nicht nur die Skalierbarkeit und Datenleistung, sondern stellte auch die Einhaltung der Vorschriften sicher und positionierte Atruvia für zukünftiges Wachstum. Dieses Projekt zeigt unsere Fähigkeit, innovative, kosteneffiziente Datenarchitekturen zu liefern, die den höchsten Branchenstandards entsprechen."

  # service item loop
  - title : "Open Source: Verbesserung von Google’s TimesFM mit CI/CD und Python Poetry"
    images:
    - "images/client-logo/googleresearch.jpg"
    content : "Im Rahmen meiner Open-Source-Beiträge zum TimesFM-Projekt von Google Research habe ich wichtige Verbesserungen implementiert, die den Entwicklungsprozess optimierten und die Benutzerfreundlichkeit erhöhten. TimesFM, ein hochmodernes Prognosemodell, das auf 100 Milliarden realen Zeitpunkten vortrainiert wurde, bietet beeindruckende Zero-Shot-Leistung für Zeitreihenprognosen in Branchen wie Einzelhandel, Finanzen und Gesundheitswesen. Trotz seiner robusten Fähigkeiten benötigte das Projekt Verbesserungen bei der Bereitstellung und dem Abhängigkeitsmanagement, um seine Wirkung zu maximieren.
  <br/><br/>
  Ich habe durch die Integration einer Continuous Integration/Continuous Deployment (CI/CD)-Pipeline mit GitHub Actions beigetragen, die Test- und Bereitstellungs-Workflows automatisiert und eine konsistente Codequalität sicherstellt. Zusätzlich habe ich Python Poetry für ein nahtloses Abhängigkeitsmanagement implementiert, was die Installation vereinfachte und die Reproduzierbarkeit verbesserte. Diese Verbesserungen senkten die Einstiegshürde für neue Benutzer und Entwickler, steigerten die Produktivität und förderten eine bessere Zusammenarbeit, sodass TimesFM weiterhin an der Spitze der Zeitreihenprognose-Innovation bleibt.
  <br/><br/>
  Durch die Optimierung der Entwicklungsumgebung und der Bereitstellungsprozesse haben meine Beiträge sichergestellt, dass TimesFM weiterhin leistungsstarke Prognosefähigkeiten mit größerer Effizienz und Leichtigkeit liefern kann."

  # service item loop
  - title : "Enterprise Solution Architecture: BMW / HPE: Weltweite Backup-Lösung für VMs"
    images:
    - "images/client-logo/bmw.png"
    content : "In Zusammenarbeit mit BMW und HPE haben wir eine skalierbare und kosteneffiziente globale Backup-Lösung entwickelt, um die umfangreichen virtuellen Maschinen (VM)-Systeme und die Dateifreigabe-Infrastruktur von BMW zu unterstützen. Angesichts der Herausforderung, Hunderte von Petabytes an Daten über ein weltweites Netzwerk zu verwalten, haben wir eine hybride Strategie entwickelt, die Cloud-Speicheranbieter nahtlos mit lokalen HPE-Deduplizierungsservern integriert.
  <br/><br/>
  Durch die Nutzung der Stärken von AWS, Google Cloud und Azure in Kombination mit der fortschrittlichen Deduplizierungstechnologie von HPE haben wir Bandbreitenbeschränkungen überwunden und die Speicherkosten erheblich reduziert. Unsere Lösung gewährleistete die Zuverlässigkeit der Daten durch Multi-Cloud-Redundanz und ermöglichte ein skalierbares Wachstum im Einklang mit den zukünftigen Anforderungen von BMW. Dieses Projekt unterstreicht unser Fachwissen in der Architektur globaler Datensicherungssysteme, die robuste Leistung, Kosteneffizienz und langfristige Nachhaltigkeit bieten."


  # service item loop
  - title : "Open Source: Verbesserung von Google’s TimesFM mit CI/CD und Python Poetry"
    images:
    - "images/client-logo/googleresearch.jpg"
    content : "Im Rahmen meiner Open-Source-Beiträge zum TimesFM-Projekt von Google Research habe ich wichtige Verbesserungen implementiert, die den Entwicklungsprozess optimierten und die Benutzerfreundlichkeit erhöhten. TimesFM, ein hochmodernes Prognosemodell, das auf 100 Milliarden realen Zeitpunkten vortrainiert wurde, bietet beeindruckende Zero-Shot-Leistung für Zeitreihenprognosen in Branchen wie Einzelhandel, Finanzen und Gesundheitswesen. Trotz seiner robusten Fähigkeiten benötigte das Projekt Verbesserungen bei der Bereitstellung und dem Abhängigkeitsmanagement, um seine Wirkung zu maximieren.
<br/><br/>
Ich habe durch die Integration einer Continuous Integration/Continuous Deployment (CI/CD)-Pipeline mit GitHub Actions beigetragen, die Test- und Bereitstellungs-Workflows automatisiert und eine konsistente Codequalität sicherstellt. Zusätzlich habe ich Python Poetry für ein nahtloses Abhängigkeitsmanagement implementiert, was die Installation vereinfachte und die Reproduzierbarkeit verbesserte. Diese Verbesserungen senkten die Einstiegshürde für neue Benutzer und Entwickler, steigerten die Produktivität und förderten eine bessere Zusammenarbeit, sodass TimesFM weiterhin an der Spitze der Zeitreihenprognose-Innovation bleibt.
<br/><br/>
Durch die Optimierung der Entwicklungsumgebung und der Bereitstellungsprozesse haben meine Beiträge sichergestellt, dass TimesFM weiterhin leistungsstarke Prognosefähigkeiten mit größerer Effizienz und Leichtigkeit liefern kann."
        
  # service item loop
  - title : "Enterprise Solution Architecture: BMW / HPE: Weltweite Backup-Lösung für VMs"
    images:
    - "images/client-logo/bmw.png"
    content : "In Zusammenarbeit mit BMW und HPE haben wir eine skalierbare und kosteneffiziente globale Backup-Lösung entwickelt, um die umfangreichen virtuellen Maschinen (VM)-Systeme und die Dateifreigabe-Infrastruktur von BMW zu unterstützen. Angesichts der Herausforderung, Hunderte von Petabytes an Daten über ein weltweites Netzwerk zu verwalten, haben wir eine hybride Strategie entwickelt, die Cloud-Speicheranbieter nahtlos mit lokalen HPE-Deduplizierungsservern integriert.
<br/><br/>
Durch die Nutzung der Stärken von AWS, Google Cloud und Azure in Kombination mit der fortschrittlichen Deduplizierungstechnologie von HPE haben wir Bandbreitenbeschränkungen überwunden und die Speicherkosten erheblich reduziert. Unsere Lösung gewährleistete die Zuverlässigkeit der Daten durch Multi-Cloud-Redundanz und ermöglichte ein skalierbares Wachstum im Einklang mit den zukünftigen Anforderungen von BMW. Dieses Projekt unterstreicht unser Fachwissen in der Architektur globaler Datensicherungssysteme, die robuste Leistung, Kosteneffizienz und langfristige Nachhaltigkeit bieten."


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
  title : "Integriert sich mit allen Tools, die Ihr Team gerne verwendet"
  content: "Von öffentlichen Cloud-Anbietern bis hin zu einfachem Excel - wir können jede Datenquelle verarbeiten und integrieren."
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
  title : "Bereit anzufangen?"
  content : "Kontaktieren Sie uns für eine kostenlose 15-minütige Beratung und erzählen Sie uns von Ihren Daten-/Cloud-Herausforderungen."
  button:
    enable : true
    label : "Kontaktieren Sie uns"
    link : "contact/"
---
