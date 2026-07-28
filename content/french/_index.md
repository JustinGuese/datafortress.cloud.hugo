---
####################### Banner #########################
banner:
  title : "Infrastructure de classe entreprise pour l'ère de l'IA"
  image : "images/banner-art.svg"
  imagetwo: "images/justin-guese-bg-removed.png"
  content : "Mise à l'échelle de l'ingénierie des données et du DevOps sécurisés et performants pour les industries les plus exigeantes au monde - des géants de l'automobile aux réseaux bancaires conformes à la BaFin. Architecte de solutions AWS certifié faisant le pont entre Kubernetes/OpenShift sur site et les flux de travail agentiques autonomes."
  button:
    enable : true
    label : "Réserver une revue d'architecture"
    link : "contact/"


########################## Clients Logo Slider #########################
clients_logo_slider:
  enable : true
  title: "Approuvé par les meilleures entreprises mondiales"
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
  title : "Trois piliers. Pétaoctets de données. Zéro tolérance pour les temps d'arrêt."
  content : "
Nous concevons des systèmes critiques à travers trois disciplines : <strong>Kubernetes/OpenShift conformes à la BaFin</strong> pour les industries réglementées, <strong>ingénierie des données à l'échelle du pétaoctet</strong> couvrant plus de 60 pays, et <strong>IA agentique</strong> fonctionnant de manière autonome sur site. Le cloud public est souvent trop coûteux - et fréquemment interdit par les réglementations allemandes en matière de finance et de santé. Nous comblons ce fossé pour VW, HPE, BMW, Porsche et le plus grand réseau bancaire d'Allemagne."
  button:
    enable : true
    label : "Consultation gratuite de 15 minutes"
    link : "contact/"
  feature_item:
  # feature item loop
  - name : "Big Data"
    icon : "fa fa-database"
    content : "Data Warehousing, Data Lakes, Data Marts, ETL Pipelines et Trino/Hadoop. Nous pouvons ingérer et traiter n'importe quelle donnée !"
    
  # feature item loop
  - name : "Cloud/Kubernetes"
    icon : "fa fa-cloud"
    content : "Kubernetes sur bare-metal et dans le (Hybrid-)Cloud. Vous ne savez pas quoi choisir ? Appelez-nous !"
    
  # feature item loop
  - name : "AI/ML"
    icon : "fas fa-robot"
    content : "Solutions d'IA conformes à l'UE et évolutives. ML Ops pour mettre à l'échelle vos charges de travail d'IA."
    
  # feature item loop
  - name : "services de bout en bout"
    icon : "far fa-thumbs-up"
    content : "Nous proposons des services complets de bout en bout, couvrant tout, du conseil et de l'architecture à la programmation."
      
      
######################### Intro Video #####################
intro_video:
  enable: true
  title: "DataFortress.cloud en 60 secondes"
  content: "parce que parfois, une vidéo en dit plus que de longs discours."
  video_url: "https://www.youtube.com/embed/eEWvARX0FT0"
  video_thumbnail: "images/video-popup.png"

      
      
######################### Service #####################
service:
  enable : true
  service_item:
  # service item loop - Atruvia DevOps modernization (headline case)
  - title : "Modernisation DevOps chez Atruvia : Microservices Spring Boot, Jenkins → GitLab, Intégration Finanzamt"
    images:
    - "images/client-logo/atruvia.png"
    - "images/client-logo/volksbank.png"
    content : "Engagement DevOps pluriannuel chez Atruvia, le pilier informatique de plus de 120 banques coopératives allemandes. Nous avons dirigé la migration de Jenkins vers GitLab CI à travers des centaines de pipelines, refactorisé des services monolithiques en microservices Java Spring Boot sur OpenShift, et conçu la couche de communication sécurisée entre les systèmes bancaires centraux et les points de terminaison de rapport du Finanzamt (administration fiscale fédérale) allemand.
<br/><br/>
Chaque composant est conçu en tenant compte de la BaFin : pipeline-as-code avec des portes de promotion auditables, déploiements pilotés par des secrets via HashiCorp Vault, et un maillage de services Istio imposant une autorisation stricte de service à service entre les centres de données. Le résultat : fréquence de déploiement en hausse, délais réduits et une plateforme qui résiste aux examens réglementaires.
<br/><br/>
C'est le genre de travail pour lequel on nous sollicite : enjeux élevés, réglementé et conçu pour être « ennuyeux » (fluide)."

  # service item loop
  - title : "Architecture de solution d'entreprise : Révolutionner le flux de données dans le processus d'échantillonnage de VW avec HPE"
    images:
    - "images/client-logo/vw.png"
    - "images/client-logo/hpe-small.png"
    - "images/service-3.png"
    content : "En collaboration avec Hewlett Packard Enterprise (HPE) et Volkswagen (VW), nous avons conçu une architecture de solution de pointe qui a transformé le processus d'échantillonnage des matériaux de l'entreprise VW. En intégrant une plateforme SaaS dans l'architecture système complexe de VW, nous avons considérablement augmenté la rapidité de mise sur le marché des nouveaux modèles de véhicules tout en rationalisant l'ensemble du flux de travail d'échantillonnage.
<br/><br/>
Notre solution a exploité une architecture de microservices modulaire, permettant un transfert de données sécurisé et conforme entre les divers systèmes de VW et la nouvelle plateforme. Le résultat ? Une réduction remarquable de 64 % du temps d'échantillonnage et des taux d'erreur, tout en respectant les normes de conformité de VW et de la VDA. Ce projet démontre notre expertise dans la résolution de défis technologiques, l'amélioration de l'efficacité et la fourniture de solutions percutantes pour des leaders mondiaux comme VW."
      
  # service item loop
  - title : "Ingénierie des données : Transformer la gestion des données pour Atruvia et Volksbank"
    images:
    - "images/client-logo/volksbank.png"
    - "images/client-logo/volksbank.png"
    - "images/client-logo/atruvia.png"
    content : "En collaboration avec Atruvia, le fournisseur informatique de la Volksbank, nous avons remplacé une infrastructure coûteuse basée sur Hadoop par un entrepôt de données moderne et open source. Construit sur des clusters Trino et S3 à mise à l'échelle automatique, cette architecture conforme à la BaFin gère de vastes quantités de données financières provenant de millions de clients tout en offrant des performances exceptionnelles à un coût réduit.
<br/><br/>
En concevant une architecture de microservices et en fournissant des environnements d'analyse conviviaux, nous avons permis aux équipes d'Atruvia d'analyser de manière transparente de grands ensembles de données sans configurations complexes. Notre solution a non seulement amélioré l'évolutivité et les performances des données, mais a également assuré la conformité réglementaire, positionnant Atruvia pour une croissance future. Ce projet démontre notre capacité à fournir des architectures de données innovantes et rentables qui répondent aux normes les plus élevées de l'industrie."
      
  # service item loop
  - title : "Open Source : Amélioration du TimesFM de Google avec CI/CD et Python Poetry"
    images:
    - "images/client-logo/googleresearch.jpg"
    content : "Dans le cadre de mes contributions open source au projet TimesFM de Google Research, j'ai mis en œuvre des améliorations clés qui ont rationalisé le processus de développement et amélioré l'accessibilité pour les utilisateurs. TimesFM, un modèle de prévision de pointe pré-entraîné sur 100 milliards de points temporels réels, offre des performances impressionnantes de prévision zero-shot dans des secteurs tels que la vente au détail, la finance et la santé. Malgré ses robustes capacités, le projet nécessitait des améliorations dans le déploiement et la gestion des dépendances pour maximiser son impact.
<br/><br/>
J'ai contribué en intégrant un pipeline d'intégration continue/déploiement continu (CI/CD) utilisant GitHub Actions, en automatisant les flux de travail de test et de déploiement, et en garantissant une qualité de code constante. De plus, j'ai mis en œuvre Python Poetry pour une gestion transparente des dépendances, simplifiant l'installation et améliorant la reproductibilité. Ces améliorations ont abaissé la barrière pour les nouveaux utilisateurs et développeurs, amélioré la productivité et favorisé une meilleure collaboration, permettant à TimesFM de rester à la pointe de l'innovation en matière de prévision de séries chronologiques.
<br/><br/>
En optimisant l'environnement de développement et les processus de déploiement, mes contributions ont permis de s'assurer que TimesFM puisse continuer à offrir de puissantes capacités de prévision avec une plus grande efficacité et facilité."
      
  # service item loop
  - title : "Architecture de solution d'entreprise : BMW / HPE : Solution de sauvegarde mondiale pour les machines virtuelles"
    images:
    - "images/client-logo/bmw.png"
    content : "En partenariat avec BMW et HPE, nous avons conçu une solution de sauvegarde mondiale évolutive et rentable pour prendre en charge les vastes systèmes de machines virtuelles (VM) et l'infrastructure de partage de fichiers de BMW. Face au défi de gérer des centaines de pétaoctets de données sur un réseau mondial, nous avons développé une stratégie hybride qui intègre de manière transparente les fournisseurs de stockage cloud avec des serveurs de déduplication HPE sur site.
<br/><br/>
En tirant parti des forces d'AWS, Google Cloud et Azure, combinées à la technologie avancée de déduplication de HPE, nous avons surmonté les limitations de bande passante et considérablement réduit les coûts de stockage. Notre solution a assuré la fiabilité des données grâce à une redondance multi-cloud et a permis une croissance évolutive en fonction des besoins futurs de BMW. Ce projet souligne notre expertise dans l'architecture de systèmes mondiaux de sauvegarde de données qui offrent des performances robustes, une rentabilité et une durabilité à long terme."
       
       
################### Testimonials ########################
testimonials:
  enable: false
  title: "Approuvé par des entreprises de premier plan"
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
  title : "S'intègre à tous les outils que votre équipe adore utiliser"
  content: "Des fournisseurs de cloud public à simple Excel - nous pouvons traiter et intégrer n'importe quelle source de données."
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
  title : "Je ne me contente pas d'écrire du code. Je construis des forteresses pour vos données."
  content : "Contactez-nous pour des missions en freelance de haute complexité, des revues d'architecture ou des stratégies d'intégration de l'IA. Basé à Munich, Allemagne - disponible dans le monde entier."
  button:
    enable : true
    label : "Réserver une revue d'architecture"
    link : "contact/"
---
