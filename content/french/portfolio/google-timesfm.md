---
date: '2024-08-14'
draft: false
logo: images/client-logo/googleresearch.jpg
title: Google TimesFM – Contribution open source

---
> Contributions open source sur GitHub au projet "TimesFM" de Google Research.


{{< image title="Google TimesFM – Contribution open source" w="50%" o="webp q100" p="center" c="img-fluid shadow rounded-1" src="images/client-logo/googleresearch.jpg" alt="texte alternatif" >}}

https://github.com/google-research/timesfm

https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/

## Résumé du projet : Amélioration du projet TimesFM de Google Research avec CI/CD et Python Poetry

Contribution open source : Intégration continue/déploiement continu (CI/CD) et gestion de dépendances pour TimesFM

### Vue d'ensemble du projet :

TimesFM est un modèle de prévision avancé développé par Google Research, pré-entraîné sur un vaste corpus de 100 milliards de points temporels réels. Il offre des performances impressionnantes en zéro-shot sur divers benchmarks publics provenant de multiples domaines et granularités. Ce modèle se distingue dans la prévision de séries chronologiques, essentielle dans des secteurs comme le commerce de détail, la finance, la fabrication, la santé et les sciences naturelles. TimesFM est particulièrement impactant dans le commerce de détail, où une prévision de la demande précise peut réduire considérablement les coûts d'inventaire et stimuler les revenus.

Malgré ses performances robustes, TimesFM a connu des difficultés communes à de nombreux modèles d'apprentissage profond (AP) : la nécessité de longs cycles d'entraînement et de validation avant le déploiement. Pour y remédier, TimesFM a été conçu comme un modèle de base offrant de solides capacités de prévision hors de la boîte sur de nouvelles données de séries chronologiques sans entraînement supplémentaire. Cela permet aux utilisateurs de mettre en œuvre et d'affiner rapidement les prévisions pour des tâches spécifiques, telles que la planification de la demande en détail.

### Mes contributions :

Pour améliorer encore l'utilisabilité et l'accessibilité de TimesFM, j'ai contribué au projet en implémentant un pipeline d'intégration continue/déploiement continu (CI/CD) à l'aide d'actions GitHub et en intégrant Python Poetry pour la gestion des dépendances et le packaging. Ces contributions visaient à simplifier le processus d'installation et à rationaliser les flux de travail de développement.

### Améliorations clés :

#### Pipeline CI/CD avec actions GitHub :

- **Automatisation**: Automatisation des processus de test, de construction et de déploiement, garantissant que tout changement apporté au code source est vérifié grâce à un flux de travail cohérent et fiable.
- **Assurance qualité**: Amélioration de la qualité du code grâce à l'exécution de tests automatisés sur chaque demande de tirage, permettant de détecter les problèmes tôt dans le cycle de développement.
- **Déploiement**: Simplification du processus de déploiement, permettant des mises à jour plus rapides et plus fiables du modèle TimesFM.

#### Intégration de Python Poetry :

- **Installation simplifiée**: Permis aux utilisateurs d'installer TimesFM plus facilement avec une seule commande (`pip install timesfm`), réduisant les difficultés pour les nouveaux utilisateurs et les développeurs.
- **Gestion des dépendances**: Amélioration de la gestion des dépendances en utilisant Poetry, qui gère plus efficacement les dépendances de paquets et garantit que les versions correctes sont utilisées.
- **Reproductibilité**: Amélioration de la reproductibilité de l'environnement de développement, facilitant aux contributeurs la configuration et la maintenance de leurs environnements de développement.

### Impact des contributions :

- **Facilité d'utilisation**: Réduction du seuil d'entrée pour les nouveaux utilisateurs et les contributeurs, simplifiant l'utilisation de TimesFM.
- **Productivité améliorée**: En automatisant les tâches de routine et en assurant un environnement de développement cohérent, les développeurs peuvent se concentrer davantage sur l'innovation et moins sur la configuration et la maintenance.
- **Collaboration améliorée**: Le pipeline CI/CD automatisé favorise un processus de développement plus collaboratif et efficace, où les modifications de code sont intégrées et testées en continu.

### À propos de TimesFM :

TimesFM représente une avancée significative dans la prévision de séries chronologiques. Il est beaucoup plus petit que les derniers grands modèles linguistiques (200 millions de paramètres), mais il atteint des performances quasi-état de l'art sur une variété d'ensembles de données invisibles. Cela en fait un outil puissant pour les industries qui dépendent de prévisions précises de séries chronologiques.

Pour plus d'informations et accéder au modèle, veuillez consulter les dépôts HuggingFace et GitHub.

### Conclusion :

Mes contributions au projet TimesFM ont considérablement amélioré son utilisabilité et son efficacité de développement. En implémentant un pipeline CI/CD et en intégrant Python Poetry, j'ai aidé à rationaliser les flux de travail et à rendre le modèle plus accessible aux utilisateurs et aux développeurs. Ces améliorations soutiennent le succès continu de TimesFM dans la fourniture de capacités de prévision robustes et en zéro-shot dans divers domaines.
