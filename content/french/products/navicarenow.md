---
date: "2024-06-01"
draft: false
title: "NavicareNow"
description: "Plateforme de navigation médicale pilotée par l'IA qui guide les patients vers les bons soins au bon moment — conçue pour le système de santé allemand."
icon: "fas fa-hospital"

######################### banner #####################
banner:
  title: "NavicareNow – Navigation médicale par l'IA"
  image: "images/banner-art.svg"
  content: "Aider les patients à naviguer dans le système de santé complexe de l'Allemagne avec des conseils alimentés par l'IA — du premier symptôme au rendez-vous chez le spécialiste."
  button:
    enable: true
    label: "Visiter NavicareNow"
    link: "https://navicarenow.de/"
  background_class: "bg-light"

######################### about this product #####################
about_this_product:
  enable: false
---

### NavicareNow : Navigation intelligente des patients pour le système de santé allemand

NavicareNow est une plateforme pilotée par l'IA qui élimine les frictions du parcours du patient — guidant les utilisateurs de l'évaluation des symptômes jusqu'au bon spécialiste, à la bonne clinique ou au bon service d'urgence. Conçue spécifiquement pour le paysage de la santé allemand aux multiples payeurs et prestataires.

En tant que CTO et co-architecte, Justin Güse a conçu le pipeline d'inférence d'IA sous-jacent, l'infrastructure cloud (Kubernetes) et l'architecture de données conforme au GDPR.

### Caractéristiques Clés

#### Triage des symptômes par l'IA
- **Vérificateur de symptômes conversationnel** — prise en charge en langage naturel qui fait correspondre les symptômes aux conditions probables et aux niveaux d'urgence.
- **Routage intelligent** — dirige les patients vers le parcours de soins le plus approprié (médecin généraliste, spécialiste, urgences, télémédecine).
- **Multilingue** — prend en charge l'allemand et l'anglais pour la population diversifiée d'Allemagne.

#### Infrastructure de niveau conformité
- **Conforme au GDPR et à la loi allemande sur les données de santé** — aucune donnée de patient utilisée pour l'entraînement des modèles sans consentement explicite.
- **Hébergé sur Kubernetes** — haute disponibilité avec déploiements sans temps d'arrêt.
- **Piste d'audit** — journalisation complète pour examen réglementaire.

#### Intégration des prestataires
- **Prise de rendez-vous** — programmation directe avec les cliniques et spécialistes partenaires.
- **Prise en compte des assurances** — oriente en fonction de la couverture d'assurance légale ou privée du patient.

### Le Stack Technique

Construit sur : Python FastAPI · Kubernetes · PostgreSQL · Redis · Flutter (mobile) · React (web) · LLM hébergés en Allemagne pour l'inférence sensible.

**[En savoir plus sur navicarenow.de →](https://navicarenow.de/)**
