---
date: '2024-08-14'
draft: false
logo: images/client-logo/sparkasse.png
title: Atruvia / Sparkasse / Volksbank – Entrepôt de données

---
> Remplacement de Hadoop par un entrepôt de données basé sur Trino, construit avec une architecture microservices à mise à l'échelle automatique pour gérer les données financières de millions de clients allemands.

{{< image title="Atruvia / Sparkasse / Volksbank – Entrepôt de données" w="50%" o="webp q100" p="center" c="img-fluid shadow rounded-1" src="images/client-logo/sparkasse.png" alt="autre texte" >}}

## Étude de cas : Révolutionner la gestion des données pour Atruvia avec des solutions open source

## Client : Atruvia (Fournisseur informatique de Volksbank et Sparkasse)

### Vue d'ensemble du projet :

Atruvia, l'épine dorsale informatique de Volksbank et Sparkasse, se heurtait à des coûts croissants et à des limitations avec son infrastructure de gestion de données basée sur Hadoop. Reconnaissant le besoin d'une solution plus économique et plus avancée, Atruvia a cherché à construire un entrepôt de données moderne en utilisant des technologies de pointe. L'objectif était de créer une architecture microservices conforme à la réglementation BaFin qui permette aux équipes d'analystes de gérer facilement d'énormes ensembles de données, en utilisant uniquement des outils open source et en évitant tout composant de cloud public.

### Objectif :

Remplacer l'infrastructure Hadoop coûteuse par une solution d'entrepôt de données évolutive, efficace et rentable basée sur Trino et des clusters autoscalants S3, garantissant la conformité aux réglementations BaFin et optimisant les performances des données pour les utilisateurs finaux.

### Processus de conception de la solution :

#### Analyse des besoins :

Discussions approfondies avec les équipes informatiques et analytiques d'Atruvia pour comprendre leurs besoins spécifiques, leurs défis et leurs exigences réglementaires.
Identification d'aspects critiques tels que la réduction des coûts, l'évolutivité, les performances des données et la facilité d'utilisation pour les équipes analytiques.

#### Évaluation technologique :

- Évaluation de diverses technologies open source pour remplacer Hadoop, en se concentrant sur Trino pour ses puissantes capacités de requête SQL et sur les clusters autoscalants S3 pour un stockage efficace des données.
- Garantie de la conformité de toutes les technologies sélectionnées aux réglementations BaFin et d'une intégration transparente dans l'infrastructure existante d'Atruvia.

#### Conception de l'architecture :

- Conception d'une architecture microservices utilisant OpenShift pour héberger l'ensemble de l'environnement d'entrepôt de données et d'analyse.
- Implémentation de clusters autoscalants S3 comme solution de stockage principale, remplaçant les bases de données traditionnelles et assurant l'évolutivité pour les énormes ensembles de données.
- Développement d'un cadre conforme à BaFin pour gérer la sécurité des données et la conformité réglementaire.

#### Outils et environnements conviviaux :

- Création d'environnements Jupyter Notebook préconfigurés pour permettre aux équipes analytiques de télécharger, d'analyser et de visualiser de grands ensembles de données sans nécessiter de connaissances techniques approfondies.
- Intégration de tableaux de bord interactifs pour fournir des informations en temps réel et rationaliser les processus d'analyse des données.

### Implémentation :

#### Configuration de l'infrastructure :

- Déploiement de clusters Trino et S3 autoscalants au sein de l'environnement OpenShift, garantissant la haute disponibilité et l'évolutivité.
- Configuration de l'architecture microservices pour gérer efficacement l'ingestion, le traitement et la requête des données.

#### Migration des données :

- Exécution d'une migration transparente des données de l'infrastructure Hadoop vers le nouvel entrepôt de données basé sur Trino et S3.
- Garantie de l'intégrité des données et de la conformité tout au long du processus de migration.

#### Formation et support des utilisateurs :

- Sessions de formation complètes pour les équipes analytiques afin de les familiariser avec les nouveaux outils et flux de travail.
- Mise en place d'un cadre de support pour aider les utilisateurs à effectuer la transition vers le nouvel environnement et à en maximiser les avantages.

### Résultats :

- Réduction des coûts : réduction réussie des coûts de gestion des données en remplaçant l'infrastructure Hadoop coûteuse par une solution open source plus efficace.
- Évolutivité et performances : améliorations significatives de l'évolutivité et des performances des données, permettant de gérer facilement d'énormes ensembles de données.
- Conformité réglementaire : garantie de la conformité complète aux réglementations BaFin, fournissant un environnement de gestion de données sécurisé et fiable.
- Autonomisation des utilisateurs : autonomisation des équipes analytiques avec des outils faciles à utiliser, éliminant le besoin de PySpark et de configurations complexes, et leur permettant de se concentrer sur la déduction d'informations à partir des données.

### Conclusion :

Ce projet a donné lieu à une solution de gestion de données révolutionnaire pour Atruvia, exploitant les technologies open source pour fournir un entrepôt de données évolutif, rentable et conforme à BaFin. En remplaçant Hadoop par Trino et des clusters S3 autoscalants, et en fournissant des outils analytiques conviviaux, Atruvia a considérablement amélioré ses capacités de données, garantissant des performances optimales et en donnant du pouvoir à ses équipes analytiques.

Vous souhaitez moderniser votre infrastructure de données ? Contactez-nous dès aujourd'hui pour découvrir comment nous pouvons vous aider à construire une solution de gestion de données évolutive, rentable et conforme à vos besoins !
