---
date: '2024-08-14'
draft: false
logo: images/client-logo/buchinger-wilhelmi-small.png
title: Clinique Buchinger Wilhelmi - Entrepôt de données médicales

---
> Architecture de solution et création d'un entrepôt de données respectant la réglementation allemande en matière de soins de santé, comprenant un pipeline ETL pour les données médicales de la clinique de jeûne leader, afin de fournir des suggestions personnalisées basées sur une application pour améliorer le traitement.

{{< image title="Clinique Buchinger Wilhelmi - Entrepôt de données médicales" w="50%" o="webp q100" p="center" c="img-fluid shadow rounded-1" src="images/client-logo/buchinger-wilhelmi-small.png" alt="ancien-texte" >}}

## Étude de cas : Modernisation de l'infrastructure de données pour la clinique de jeûne Buchinger Wilhelmi

**Client :** Buchinger Wilhelmi

### Aperçu du projet :

Buchinger Wilhelmi, la clinique de jeûne leader mondiale, a cherché à améliorer la personnalisation de ses traitements et ses capacités de recherche grâce à une gestion avancée des données. L'objectif était de mettre en place un entrepôt de données robuste respectant les strictes réglementations allemandes en matière de soins de santé, notamment le Kliniklandeskrankenhausgesetz, tout en permettant un traitement efficace des données et des suggestions personnalisées basées sur une application pour les patients.

### Objectif :

Concevoir et mettre en œuvre une solution d'entrepôt de données sécurisée et évolutive avec un pipeline ETL efficace, garantissant le respect des lois allemandes sur la protection des données et permettant à la clinique de fournir des conseils de traitement personnalisés et de faciliter des analyses de recherche complètes.

### Processus de conception de la solution :

#### Analyse des besoins :

- Collaboration avec les équipes médicales et informatiques de Buchinger Wilhelmi pour comprendre leurs besoins spécifiques, les contraintes réglementaires et les exigences de traitement des données.
- Identification de la nécessité d'une solution sur site sécurisée en raison des restrictions concernant l'utilisation des fournisseurs de cloud public.

#### Sélection des technologies :

- Choix de Kubernetes pour ses capacités robustes d'orchestration de conteneurs, permettant l'auto-échelle, la répartition de la charge et une gestion efficace des ressources sur des serveurs bare-metal.
- Sélection de Prefect comme planificateur ETL pour son efficacité et sa flexibilité par rapport aux outils traditionnels comme Airflow.
- Décision d'utiliser Minio pour le stockage objet compatible S3, facilitant la mise en file d'attente transparente des données entre les étapes ETL.
- Choix de PostgreSQL comme référentiel de données final pour sa fiabilité et sa compatibilité avec les outils d'analyse.

#### Conception de l'architecture :

- Conception d'un cluster Kubernetes sur des serveurs bare-metal pour garantir le respect de la réglementation allemande en matière de soins de santé et assurer une évolutivité.
- Implémentation d'un pipeline ETL complet géré par Prefect, orchestrant l'ingestion, le traitement et la transformation des données médicales.
- Configuration de conteneurs Minio S3 pour le stockage intermédiaire des données, assurant un flux de données fluide entre les étapes ETL.
- Mise en place de bases de données PostgreSQL pour stocker les données traitées finales, permettant un accès facile aux recommandations personnalisées basées sur l'application et aux analyses de recherche.

### Implémentation :

#### Configuration de l'infrastructure :

- Déploiement d'un cluster Kubernetes sur des serveurs bare-metal, assurant une haute disponibilité, une auto-échelle et une répartition de la charge pour gérer les charges de travail variables.
- Configuration de Prefect comme planificateur ETL, définissant et orchestrant les flux de travail de traitement des données nécessaires.

#### Développement du pipeline ETL :

- Développement des processus ETL pour extraire les données médicales, les transformer en formats utiles et les charger dans l'entrepôt de données.
- Utilisation de conteneurs Minio S3 pour la mise en file d'attente des données aux différentes étapes ETL, assurant des transitions transparentes et l'intégrité des données.
- Finalisation des données traitées dans les bases de données PostgreSQL, les rendant disponibles pour des analyses ultérieures et une utilisation par l'application.

#### Utilisation des données :

- Intégration des données traitées avec une application personnalisée, fournissant aux utilisateurs des recommandations de jeûne personnalisées basées sur leurs données médicales.
- Développement de tableaux de bord analytiques pour le service de recherche et les médecins, permettant des améliorations basées sur les données des protocoles de traitement.

### Résultats :

- **Conformité aux réglementations :** Mise en œuvre réussie d'une solution d'entrepôt de données sur site sécurisée et conforme au Kliniklandeskrankenhausgesetz.
- **Personnalisation améliorée :** Possibilité de fournir des recommandations de jeûne personnalisées via une application conviviale, améliorant l'expérience de traitement des patients.
- **Amélioration des capacités de recherche :** Fourniture de tableaux de bord analytiques complets au service de recherche et aux professionnels de la santé, favorisant les informations basées sur les données et les améliorations des traitements.
- **Traitement efficace des données :** Réalisation d'un traitement et d'une transformation des données efficaces grâce à l'utilisation de Prefect et de Minio, assurant une disponibilité des données opportune et précise.

### Conclusion :

Ce projet a abouti à une solution d'entrepôt de données de pointe pour Buchinger Wilhelmi, exploitant des technologies avancées pour se conformer aux réglementations allemandes en matière de soins de santé et améliorer considérablement la personnalisation des traitements des patients et les capacités de recherche. En mettant en œuvre une infrastructure sécurisée sur site avec des processus ETL efficaces, la clinique peut désormais proposer des recommandations personnalisées et stimuler des améliorations continues des traitements de jeûne.

**Souhaitez-vous transformer la gestion de vos données de santé ?** Contactez-nous dès aujourd'hui pour explorer comment nous pouvons vous aider à créer une solution d'entrepôt de données conforme, évolutive et efficace, adaptée à vos besoins !
