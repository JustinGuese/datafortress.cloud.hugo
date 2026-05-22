---
title: "Atruvia : Modernisation DevOps, Microservices Spring Boot et Intégration Finanzamt"
date: "2024-03-15"
draft: false
logo: "images/client-logo/atruvia.png"
image: "images/client-logo/atruvia.png"
description: "Engagement DevOps pluriannuel chez Atruvia — migration de Jenkins vers GitLab CI, microservices Java Spring Boot sur OpenShift et couche d'intégration sécurisée Finanzamt pour le plus grand réseau bancaire coopératif d'Allemagne."
categories: ["Banking IT", "DevOps", "OpenShift", "Spring Boot"]
---

## L'Engagement

Atruvia est le pilier informatique du réseau bancaire coopératif allemand — **plus de 120 Volksbanken et Raiffeisenbanken** au service de millions de clients particuliers et entreprises. Leur équipe plateforme gère une infrastructure bancaire centrale qui doit passer chaque jour les examens de la BaFin, du BSI et des régulateurs.

J'ai été intégré au côté ingénierie DevOps et plateforme sur trois flux de travail interdépendants : la modernisation du CI/CD, le refactoring des microservices sur OpenShift et la couche de communication sécurisée entre les systèmes bancaires centraux et le Finanzamt (administration fiscale fédérale) allemand.

---

## 1. Migration de Jenkins → GitLab CI

L'empreinte CI d'Atruvia était un parc Jenkins mature et complexe — des centaines de pipelines, des dizaines de bibliothèques partagées, une prolifération de plugins et le type de modèle « identifiants montés sur le maître » qui vieillit mal dans un environnement réglementé.

La migration vers GitLab CI a été un programme s'étendant sur plusieurs trimestres :

- **Pipeline-as-code dans le même repo que la source.** Chaque build, chaque test, chaque porte de déploiement est consultable dans le même Merge Request (MR) qui livre le changement de code. Les auditeurs adorent ça. Les relecteurs encore plus.
- **Artefacts signés + provenance de style SLSA.** Chaque artefact qui atteint un cluster de production porte une trace de build vérifiable. Les portes de déploiement peuvent refuser tout ce qui ne provient pas du pipeline canonique.
- **Portes de promotion en tant que code.** La promotion Stage → pré-prod → prod est un YAML explicite avec des règles d'approbation liées aux groupes du fournisseur d'identité. Fini l'archéologie du « qui a cliqué sur le bouton ».
- **Identifiants pilotés par Vault.** Les secrets de build et de déploiement sont extraits de HashiCorp Vault par job avec des jetons à courte durée de vie. La fuite d'identifiants dans les logs de build devient une impossibilité architecturale, pas une simple politique espérée.

La migration s'est faite sans période de gel — les anciens pipelines Jenkins continuaient à fonctionner pendant que les pipelines GitLab équivalents étaient validés en parallèle, puis le basculement s'est fait domaine de produit par domaine de produit.

---

## 2. Microservices Java Spring Boot sur OpenShift

Une grande partie de la pile d'applications bancaires a été refactorisée de services Java monolithiques en **microservices Spring Boot** distincts fonctionnant sur **OpenShift**. Points forts :

- **Limites de service appropriées.** Décomposition pilotée par le domaine, pas un simulacre de « division du monolithe par noms de packages ». Les services possèdent leurs données et exposent des API étroites et versionnées.
- **Observabilité de niveau production.** Chaque service est livré avec des métriques Micrometer, du traçage distribué (OpenTelemetry) et une journalisation d'audit structurée qui satisfait aux exigences de traçabilité de la BaFin.
- **Déploiements Helm + Kustomize.** Manifestes templatisés avec des superpositions d'environnement, déployés via les pipelines GitLab CI mentionnés ci-dessus. ArgoCD surveille les branches d'environnement canoniques.
- **Résilience intégrée, pas ajoutée après coup.** Coupe-circuits (circuit breakers), budgets de tentatives et cloisonnement (bulkheading) au niveau du framework. Sondes de santé (health) et de disponibilité (readiness) qui ont un sens. Arrêt gracieux pour des déploiements progressifs sécurisés.

---

## 3. Couche d'Intégration Finanzamt

Les banques allemandes ont des obligations de reporting non négligeables auprès du Finanzamt — reporting des intérêts, reporting des plus-values, échange FATCA/CRS et une longue liste de soumissions structurées à des échéances fixes.

J'ai conçu la couche d'intégration sécurisée qui fait le pont entre les systèmes bancaires centraux et les points de terminaison du Finanzamt :

- **Soumissions pilotées par pipeline** avec tentatives idempotentes, files d'attente de lettres mortes (dead-letter queues) pour les lots mal formés et ID de corrélation de bout en bout pour le rejeu d'audit.
- **Identifiants et clés de signature** gérés via HashiCorp Vault avec rotation intégrée à la plateforme.
- **Outils de réconciliation** qui comparent ce qui a été envoyé à ce qui a été acquitté, et font remonter les écarts avant qu'un régulateur ne le fasse.

Chaque artefact dans ce chemin est auditable de bout en bout : le code source, le build, le déploiement, la délivrance des identifiants, la soumission elle-même et l'acquittement.

---

## Le Modèle Architectural Sous-jacent

Tout cela repose sur un modèle de défense en profondeur qui traite chaque couche comme indépendante :

- **Istio Service Mesh** avec verrouillage géographique et autorisation stricte de service à service sur les passerelles de sortie. Le trafic entre centres de données est un acte délibéré et autorisé — jamais un accident.
- **HashiCorp Vault** comme source unique de vérité pour les secrets, avec délivrance liée à l'identité de la charge de travail (workload identity).
- **Identité de charge de travail** à la couche application, de sorte que même une route mal configurée n'accorde pas d'accès sans une identité valide de style SPIFFE.

Une défaillance dans n'importe quelle couche ne compromet pas le système. C'est la propriété que recherche un régulateur, et c'est la propriété que l'équipe peut réellement maintenir à la 50e semaine de l'année.

---

## Pourquoi C'est Important

La modernisation DevOps dans la banque réglementée ne consiste pas à courir après les tendances. Il s'agit de rendre la plateforme *ennuyeuse* — rapide à déployer, difficile à mal configurer, triviale à auditer. Les choix technologiques (GitLab, OpenShift, Spring Boot, Istio, Vault) sont le point de départ. La discipline est le différenciateur.

Cet engagement est le genre de travail pour lequel on me sollicite : enjeux élevés, réglementé, pluriannuel et conçu pour disparaître en arrière-plan afin que l'entreprise puisse avancer.

---

## En relation

- **Service :** [Infrastructure Cloud & DevOps (Kubernetes/OpenShift conforme BaFin)](/fr/services/cloud-infrastructure-devops/)
- **Service :** [Ingénierie des Données & Analytics](/fr/services/data-engineering-analytics/)
- **Étude de cas :** [Atruvia / Volksbank — Modernisation de l'entrepôt de données](/fr/portfolio/atruvia--volksbank-data-warehouse/)
- **À propos :** [Justin Güse — Architecte d'infrastructure d'entreprise](/fr/about/)

**Vous nous évaluez pour une mission ?** [Réservez une revue d'architecture gratuite d'une heure](/fr/contact/) — en 60 minutes, je trouverai plus de 100 000 € de risques de conformité, de gaspillage cloud ou de marge d'évolutivité, ou je vous le dirai franchement.
