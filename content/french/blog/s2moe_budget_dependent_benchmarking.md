---
title: "Mon gain d'efficacité s'est inversé lorsque j'ai entraîné plus longtemps : Une note sur l'évaluation comparative dépendante du budget"
bg_image: 'images/blog/budget-reversal.png'
date: 2026-07-28T09:10:00+02:00
author: 'Justin Guese'
description: "Un MoE sparse a surpassé une base de référence dense de 2,4% sur 3 seeds. Entraîner 4x plus longtemps sur des données plus difficiles et le signe s'inverse - ce que cela dit sur l'évaluation comparative des architectures efficaces."
image: 'images/blog/budget-reversal.png'
categories:
  - Machine Learning
tags:
  [
    'mixture of experts',
    'benchmarking',
    'reproducibility',
    'negative results',
    'language models',
  ]
type: post
---

# Mon gain d'efficacité s'est inversé lorsque j'ai entraîné plus longtemps : Une note sur l'évaluation comparative dépendante du budget

**Résumé**

- Un modèle [Mixture-of-Experts](https://arxiv.org/abs/2101.03961) sparse Top-1 a surpassé une base de référence dense appariée en paramètres de **−2,4% ± 1,1% perplexité de validation, 3/3 seeds, t\_ appariés ≈ 3,8 (p ≈ 0,03)**. Résultat propre. Paraissait publiable.
- Trois vérifications distinctes l'ont démonté : un changement de **calendrier de taux d'apprentissage**, une **base de référence correctement accordée**, et un **budget d'entraînement 4× plus long**.
- À 4× budget sur du texte web difficile, le signe **s'est inversé** : dense a gagné par **+2,4% ± 0,8%**, également 3/3 seeds.
- La leçon générale : les comparaisons d'efficacité qui s'exécutent bien en dessous des budgets [Chinchilla-optimal](https://arxiv.org/abs/2203.15556) aplatissent systématiquement le modèle avec moins de calcul actif. La plupart des articles ne fonctionnent jamais avec le budget plus long.
- Ce qui a survécu était l'axe qui _ne pouvait pas_ s'inverser, car il n'est pas appris. Plus à la fin, et dans l'[article compagnon sur l'échelonnage énergétique](./sparse-moe-energy-scaling-per-token).

Tous les chiffres ci-dessous proviennent d'un log d'expérience public : **[github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)** (`EXPERIMENTS.md`, 66 entrées, les plus récentes en premier). Chaque revendication dans ce message cite un numéro d'expérience que vous pouvez aller lire.

---

## 1. Le résultat qui avait l'air terminé

L'architecture est S²-MoE : un modèle de langage Mixture-of-Experts sparse et spiking. Le détail pertinent pour ce message est simplement qu'il achemine chaque jeton vers **un** expert sur `n`, donc il exécute à peu près `1/n` du calcul avant-plan par rapport à un modèle dense avec le même nombre de paramètres.

À 25M paramètres sur [TinyStories](https://arxiv.org/abs/2305.07759), tokenisé par paires d'octets, 6000 étapes, trois seeds exécutées en tant que processus isolés (**Exp 12**) :

| Métrique (25M, 6000 étapes, 3 seeds)                        | S²-MoE                  | Dense              |
| ----------------------------------------------------------- | ----------------------- | ------------------ |
| Perplexité de validation                                    | **5,63 ± 0,09**         | 5,77 ± 0,03        |
| Écart apparié (MoE − dense)                                 | **−2,4% ± 1,1%**        | -                  |
| Écart par seed                                              | −1,2% / −2,6% / −3,3%   | 3/3 favorisent MoE |
| Précision par calcul actif                                  | **8,20× ± 0,10**        | 1×                 |
| Fraction de calcul FFN actif                                | 0,125 (exacte)          | 1,000              |
| Delta grammatical [BLiMP](https://arxiv.org/abs/1912.00582) | +0,003 ± 0,015 (neutre) | -                  |

Ce n'est pas un faible résultat en apparence. Il est apparié (la même seed fixe l'ordre des données et l'initialisation pour les deux bras), chaque seed est d'accord sur le signe, la base de référence dense a une variance de seed proche de zéro, et la sonde grammaticale dit que la sparsité n'entraîne pas de frais de syntaxe. L'entraînement plus long a rendu l'effet _plus grand_, pas plus petit - généralement bon signe.

La tentation à ce stade est d'arrêter de mesurer.

## 2. Trois façons dont cela s'est effondré

### 2.1 Le calendrier faisait le travail (Exp 15)

Chaque résultat ci-dessus utilisait un **taux d'apprentissage plat** - défaut du projet, initialement accordé au mélangeur [gated linear attention](https://arxiv.org/abs/2312.06635). C'est un choix défendable pour une architecture et indéfendable pour une comparaison.

En relançant sur [FineWeb-Edu](https://huggingface.co/datasets/HuggingFaceFW/fineweb-edu) avec un calendrier moderne identique pour chaque bras - réchauffement linéaire puis décroissance cosinus à 10%, chaque modèle à son taux d'apprentissage pic accordé :

| Modèle (25M, FineWeb-Edu, 6000 étapes) | Val ppl   | BLiMP | Calcul FFN actif |
| -------------------------------------- | --------- | ----- | ---------------- |
| GLA-dense                              | **51,37** | 0,713 | 1,000            |
| Transformer                            | **51,17** | 0,704 | 1,000            |
| S²-MoE                                 | 56,90     | 0,694 | **0,125**        |

Le MoE est passé de **8% mieux** sous LR plat à **11% pire** sous réchauffement+cosinus. Le mécanisme est visible dans les deltas : le modèle dense a gagné **25%** en accordant correctement (68,5 → 51,4) ; le MoE a gagné seulement **9,5%** (62,9 → 56,9). Un modèle dense met à jour chaque paramètre à chaque étape, il peut donc exploiter la queue de mise au point fine d'une décroissance cosinus. Un MoE Top-1 met à jour à peu près `1/n` de son pool d'experts par jeton, donc chaque expert voit une fraction des données et encaisse beaucoup moins de cette queue.

Le protocole LR plat n'était pas neutre. Il a handicapé le bras qui bénéficie le plus d'un bon calendrier.

### 2.2 Une base de référence que vous n'avez pas accordée n'est pas une base de référence (Exp 15, exécution #1)

La première tentative d'ajout d'un vrai contrôle Transformer d'attention softmax lui a remis les paramètres accordés à GLA : LR plat `lr=3e-3`, pas de réchauffement. Il n'a jamais entraîné - perplexité de validation **380**, par rapport à 68 pour le modèle dense GLA.

Cette exécution a produit un titre "S²-MoE est 48× mieux qu'un Transformer."

Ce chiffre est rejeté et enregistré comme une leçon plutôt que supprimé. Il a mesuré un contrôle cassé, pas un bon modèle. Un diagnostic bref a confirmé qu'un Transformer correctement configuré (`lr=6e-4`, réchauffement, cosinus) s'entraîne bien et atterrit à 51,17 - c'est-à-dire, il _surpasse_ le MoE.

Ce mode de défaillance, dans lequel il est facile de tomber, est cher à attraper après la publication. L'attention est bien plus sensible au LR qu'un mélangeur de récurrence linéaire ; réutiliser les hyperparamètres d'une architecture sur une comparaison fabrique le résultat que vous espériez. **Signalez le budget d'accord et le LR final pour chaque bras, y compris ceux que vous essayez de surpasser.**

### 2.3 Le budget cachait l'écart (Exp 44 → Exp 47)

Le plus transférable des trois. Configuration identique verrouillée - 32 experts, cœur partagé toujours actif, auto-distillation, calendrier cosinus, dispatch GEMM groupé - balayé sur le budget d'entraînement sur FineWeb-Edu :

| Étapes d'entraînement | MoE vs dense                              | Verdict                  |
| --------------------- | ----------------------------------------- | ------------------------ |
| 6 000                 | **−5,15% ± 0,11%** (3/3 seeds, _t_ ≈ −81) | MoE gagne sans équivoque |
| 12 000                | ≈ parité                                  | -                        |
| 24 000                | **+2,4% ± 0,8%** (3/3 seeds)              | Dense gagne              |

Un croisement monotone propre, confirmé sur trois seeds au point de terminaison, pas un coup de chance. Le résultat 6k avait une statistique _t_ de −81. C'était aussi, à la réflexion, une affirmation sur le sous-entraînement plutôt que sur l'architecture.

![Croisement de budget : l'avantage de qualité MoE s'inverse à mesure que le budget d'entraînement augmente](paper/figures/fig3_budget_reversal.png)

## 3. La généralisation

Voici la partie qui en vaut la peine de transporter à d'autres projets.

**Les comparaisons qui s'exécutent bien en dessous des budgets optimaux de calcul aplatissent systématiquement le modèle avec moins de calcul actif par jeton.** Les deux bras sont sous-entraînés ; le modèle dense a plus de capacité qu'il n'a pas encore encaissé ; le modèle sparse est plus proche de son propre plafond car chaque expert a déjà vu sa fine tranche de données. L'écart qui finira par les séparer ne s'est pas ouvert. Mesurez cela et vous mesurez la région de croisement, pas l'asymptote.

Deux corollaires sont tombés du même balayage.

**Le point de croisement est une propriété du corpus, pas de l'architecture.** Exécutez la configuration identique à 24k étapes sur les deux corpus (**Exp 47**) :

| Corpus      | Entropie unigramme | MoE vs dense à 24k                  | Delta BLiMP |
| ----------- | ------------------ | ----------------------------------- | ----------- |
| TinyStories | 8,39 bits/jeton    | **−2,6% ± 0,3%** (3/3, MoE gagne)   | +0,039      |
| FineWeb-Edu | 10,50 bits/jeton   | **+2,4% ± 0,8%** (3/3, dense gagne) | −0,007      |

Le signe s'inverse avec le corpus seul. Sur un texte structuré, l'avantage MoE se rétrécit avec le budget (−4,4% à 6k → −2,6% à 24k) mais ne franchit jamais zéro. Sur un texte web divers, il franchit et continue. Donc "la sparsité coûte-t-elle de la qualité ?" n'a aucune réponse libre de budget, libre de corpus - ce qui signifie que tout article signalant un seul point sur cette surface a signalé une coordonnée, pas une conclusion.

**Et la limite honnête là-dessus (Exp 53) :** la loi _directionnelle_ tient, mais une _quantitative_ ne peut pas être adaptée à partir de ces courses. Il n'y a que deux points d'entropie de corpus, et le calendrier, la distillation et le budget sont des facteurs de confusion collinéaires d'ampleur comparable - le nombre de jetons par expert ne classe même pas correctement le signe. Adapter une courbe prédictive à cela produirait une surface non identifiable avec un R² décent. Le log le dit, et le suivi est spécifié (geler un protocole, ajouter ≥2 corpus, exécuter une grille `n × corpus`) plutôt que d'être approché.

### Une liste de contrôle à quatre éléments

1. **Exécutez au moins deux budgets**, idéalement 4× écartés. Si votre revendication n'existe que dans l'un, c'est une revendication sur ce budget.
2. **Exécutez au moins deux corpus de difficulté différente.** Les corpus de jouets ne sont pas des versions réduites de corpus difficiles ; ils changent le signe ici.
3. **Accordez chaque base de référence séparément et signalez son LR.** Un seul calendrier sur les architectures est un doigt sur la balance.
4. **Signalez le signe par seed apparié, pas seulement la moyenne ± std.** "3/3 seeds concordent" et "la moyenne est négative" sont des revendications différentes, et la seconde est plus faible qu'elle ne le semble.

## 4. Le processus qui l'a attrapé

Rien de tout cela n'était de la chance. La pratique consiste à **présigner une barrière de suppression numérique avant une course coûteuse**, puis à l'honorer quand elle échoue. Neuf idées sont mortes aux leurs. Un exemple représentatif :

| Idée                                                                   | Pourquoi elle est morte                                                           | Exp |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --- |
| Portail d'écriture du mélangeur                                        | Sauter les écritures dans l'état de récurrence a fait sauter la perplexité ~7×    | 32  |
| Barrière d'arrêt [Mixture-of-Depths](https://arxiv.org/abs/2404.02258) | −1,9% de qualité ; réalisé ~16% de sparsité par rapport à une cible de 50%        | 42  |
| Routage neuromodulateur                                                | Aucun gain de qualité ; les correctifs de niveau de routage continuent d'échouer  | 34  |
| Experts dendritiques                                                   | La porte s'est installée 38% ouverte - est devenue un sparsificateur, +1,05% pire | 46  |
| Point de consigne de criticité                                         | 73,03 vs une base de référence appariée 72,86 - barrière non franchie             | 62  |
| FFN piloté par événements                                              | Cosinus de jeton consécutif 0,561 vs une barre 0,7                                | 64  |
| Correction résiduelle de rang 1                                        | Inerte : calcul actif inchangé, le balayage de seuil n'a rien déplacé             | 66  |

Les quatre idées de barrière partagent une forme, et c'est le modèle le plus utile dans le journal entier : **toute barrière apprentissable que l'optimiseur est autorisé à fermer, il ferme.** Chacune a été conçue pour ajouter une capacité conditionnelle ; chacune a été recrutée comme deuxième sparsificateur au-dessus de l'existant et a coûté 1–2% de qualité.

Deux idées n'étaient pas petites - elles étaient les différenciateurs lancés du projet, et elles sont mortes à des _contrôles propres_ plutôt qu'à de mauvais chiffres :

- **Adaptation continue (Exp 60, 61).** Revendication : les modèles sparse oublient moins, car la croissance isole les nouveaux domaines dans les nouveaux experts. Exp 60 a ajouté un contrôle de sommeil désactivé, qui a atterri identique à sommeil activé - donc le mécanisme ne faisait pas le travail. Exp 61 a ensuite _forcé_ l'isolation avec un verrou de routage : les nouveaux jetons de domaine frappent les nouveaux experts exclusivement (fraction de provenance mesurée **1,00**, fuite zéro). La rétention ne s'est toujours pas déplacée - **116,7 vs 117,3**. L'oubli vit dans le composant dense toujours actif, que la sparsité ne peut pas protéger. Falsifié, pas mal accordé.
- **"La croissance progressive est spéciale" (Exp 59).** Un [upcycle](https://arxiv.org/abs/2212.05055) en un seul bloc a marqué **73,37**, assis à l'intérieur de la propagation à deux seeds du bras de croissance progressive de 72,94–73,44. Le résultat antérieur "la croissance progressive gagne" provenait d'un contrôle qui avait fui et croissait silencieusement tout du long.

L'argument de coût pour cette discipline est **Exp 64**. L'idée pilotée par événements était attrayante et aurait pris des semaines à construire. La barrière était une mesure : les activations de jetons consécutifs sont-elles suffisamment corrélées pour sauter le recalcul ? Similitude en cosinus moyenne **0,561** par rapport à une barre préalablement convenue de 0,7 - et elle _baisse_ avec la profondeur. Coût total : un script de benchmark et zéro exécutions d'entraînement.

La même logique gère les écrans bon marché : une seed à mi-étapes pour répondre "cela change-t-il du tout la qualité ?", et seuls les survivants gagnent trois seeds à longueur maximale. Un écran de 0,30 $ qui dit non en vaut plus qu'une semaine passée à construire sur un levier non validé.

## 5. Ce qui a réellement survécu

Un paragraphe, pas de débat.

La revendication qui a tenu au travers de chaque changement de calendrier, de chaque corpus, et d'un balayage de budget 4× était celle qui n'a jamais été apprise en premier lieu : **la précision par unité de calcul avant-plan actif est restée à ~21×** sur 6k, 12k, et 24k étapes sur les deux corpus. C'est déterminé par la forme - une conséquence du routage Top-1 exécutant un expert quel que soit la taille du pool - il n'existe donc aucun mécanisme par lequel plus d'entraînement pourrait l'inverser. C'est précisément pourquoi cela a survécu quand la revendication de qualité ne l'a pas fait. Un chiffre qui ne peut pas bouger sous budget est un chiffre qui n'a jamais dépendu du sous-entraînement.

Cet axe est le sujet du prochain message : [comment l'énergie par jeton s'adapte avec le nombre d'experts, où la courbe mesurée cesse de s'accorder avec le nombre FLOP, et ce que le spiking achète réellement](./sparse-moe-energy-scaling-per-token).

---

## FAQ

**Q : Pourquoi le MoE a-t-il surpassé les denses à petite échelle mais perd à grande échelle ?**
Les deux modèles étaient sous-entraînés. Le modèle dense met à jour chaque paramètre à chaque étape et continue à s'améliorer ; le MoE Top-1 met à jour ~1/n de son pool d'experts par jeton, donc il approche son plafond plus tôt. À budget faible, le modèle dense n'a pas encore encaissé sa capacité, donc la comparaison flatte le modèle sparse. Voir Exp 44 et 47.

**Q : Cela signifie-t-il que les modèles sparse sont pires ?**
Non - cela signifie que la comparaison de qualité est dépendante du budget et du corpus, et que la comparaison _d'efficacité_ ne l'est pas. Sur du texte structuré, l'avantage sparse a survécu à une augmentation de budget 4×; sur du texte web divers, il s'est inversé. L'avantage du calcul actif a tenu partout.

**Q : Combien de budgets d'entraînement devrais-je tester avant de revendiquer un gain d'efficacité ?**
Au minimum deux, idéalement 4× écartés, sur au moins deux corpus de difficulté différente. Dans ce projet, le signe s'est inversé entre 6k et 24k étapes sur un corpus et pas sur l'autre.

**Q : Qu'est-ce qu'une barrière de suppression ?**
Un seuil numérique écrit _avant_ la course coûteuse, définissant quel résultat tuerait l'idée. Exp 64 a tué une direction multi-semaines avec un seul script de benchmark car la barrière a été définie à l'avance.

**Q : Où puis-je voir le journal d'expérience brut ?**
`EXPERIMENTS.md` dans le [dépôt GitHub](https://github.com/JustinGuese/SpikingBrain2.0-s2moe) - 66 entrées, chacune avec Hypothèse → Méthode → Observation → Résultat, y compris tout ce qui a échoué.

---

## Reproduisez-le

Le projet est géré avec [uv](https://docs.astral.sh/uv/) sur [PyTorch](https://pytorch.org/) :

```bash
git clone https://github.com/JustinGuese/SpikingBrain2.0-s2moe
uv sync
uv run python phase0.py    # regression gate, expects: PHASE 0: PASS

# Le face-à-face : MoE + contrôle dense appariés en paramètres, même budget
uv run python train_lm.py --tokenizer bpe --scale 25m \
    --d-model 512 --d-hidden 512 --n-layers 4 --n-experts 32 \
    --d-shared 256 --distill --dispatch grouped --blimp --n-seeds 3
```

- **Code et journal complet :** [github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)
- **Démo interactive :** [huggingface.co/spaces/guestros/s2-moe-demo](https://huggingface.co/spaces/guestros/s2-moe-demo)
- **Points de contrôle entraînés :** [huggingface.co/guestros/s2-moe-checkpoints](https://huggingface.co/guestros/s2-moe-checkpoints)
- **Archivé (CC BY 4.0) :** [doi.org/10.5281/zenodo.20846758](https://doi.org/10.5281/zenodo.20846758)

Les corrections sont bienvenues comme des questions. Si un chiffre ici ne s'accorde pas avec le journal, le journal gagne.
