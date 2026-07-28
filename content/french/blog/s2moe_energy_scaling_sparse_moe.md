---
title: "Le gain d'efficacité qui augmente avec le modèle : Énergie par jeton dans un MoE Spiking Top-1"
bg_image: 'images/blog/energy-scaling.png'
date: 2026-07-26T09:10:00+02:00
author: 'Justin Guese'
description: "Le routage Top-1 rend le coût FFN constant en nombre d'experts, donc l'énergie par jeton baisse à mesure que vous ajoutez des experts. Mesuré sur H100 - 5,1x moins à 1B paramètres, plus où les FLOP cessent de prédire les joules."
image: 'images/blog/energy-scaling.png'
categories:
  - Machine Learning
tags:
  [
    'mixture of experts',
    'energy efficiency',
    'inference optimization',
    'neuromorphic computing',
    'cuda kernels',
  ]
type: post
---

# Le gain d'efficacité qui augmente avec le modèle : Énergie par jeton dans un MoE Spiking Top-1

**Résumé**

- Le routage Top-1 exécute **un** expert par jeton quel que soit la taille du pool, donc le coût feed-forward est **constant en nombre d'experts** tandis que le coût d'un modèle dense apparié en paramètres croît linéairement. Ajouter des experts _réduit_ l'énergie par jeton.
- Mesuré sur un H100 sur trois échelles de modèle : **1,46× → 3,07× → 5,08×** moins d'énergie par jeton à 8 / 32 / 64 experts à 1B paramètres, par rapport à la fois une référence dense et un Transformer apparié en paramètres.
- À 8 experts il n'y a **aucun gain énergétique du tout**. Le régime importe, et ce message mène avec cela.
- Le gain n'est pas gratuit - il nécessite un kernel GEMM groupé. Sans lui, le modèle sparse est _plus lent_ que dense à chaque nombre d'experts.
- Au-dessus de ~128 experts, le proxy FLOP et les joules mesurés **divergent**. Les FLOP cessent d'être un proxy et commencent à raconter une histoire.

Code, kernels et le log d'expérience complet : **[github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)**.

Ceci est le suivi d'[un message sur la façon dont la revendication de _qualité_ dans ce même projet s'est inversée sous un budget d'entraînement plus long](./budget-dependent-benchmarking-sparse-moe). La version courte de celui-ci : les revendications apprises ont bougé, les revendications déterminées par la forme ne l'ont pas fait. Ce message concerne les revendications déterminées par la forme.

---

## 1. Pourquoi le gain augmente avec le nombre d'experts

L'arithmétique est assez simple à énoncer en un paragraphe, ce qui est la raison principale de lui faire confiance.

Une couche [Mixture-of-Experts](https://arxiv.org/abs/2101.03961) avec routage Top-1 envoie chaque jeton à exactement un expert de largeur cachée `d_hidden`. Son coût feed-forward par jeton est donc **indépendant de `n_experts`** - 64 experts coûtent autant par jeton que 8. Un modèle dense apparié en paramètres doit dépenser ces paramètres quelque part, donc sa largeur feed-forward est `d_ff = n_experts · d_hidden`, et son coût par jeton croît **linéairement** dans la même variable.

Le ratio entre eux croît donc linéairement en nombre d'experts. Chaque expert que vous ajoutez rend la base de référence plus chère et laisse le modèle sparse où il était.

Ce n'est pas une propriété apprise. C'est une conséquence des formes de tenseur, c'est pourquoi cela tient sous des poids aléatoires, survit aux balayages de budget, et ne se soucie pas du corpus sur lequel vous entraînez.

![Le compromis brisé : qualité contre calcul actif](paper/figures/fig2_broken_tradeoff.png)

## 2. Le régime où cela ne fonctionne pas (Exp 17)

Vaut la peine de l'énoncer avant les bons chiffres, car cela les limite.

À **8 experts et 25M paramètres, il n'y a aucun gain énergétique.** La mesure (Exp 17) a trouvé :

- Le mélangeur de séquence toujours actif domine la passe avant. Le feed-forward n'est que ~16% du calcul du modèle sparse, donc le réduire de 8× ne réduit que ~50% des FLOP totaux.
- **La puissance GPU est plate d'architecture** - ~52–57 W sur toutes les variantes testées. Sur ce matériel, "l'énergie par jeton" se réduit à la latence par jeton. Il n'y a pas de baisse de puissance à récolter.
- Avec une boucle de distribution Python naïve par expert, le modèle sparse était _plus lent_ que dense. L'économie FLOP a été consommée par la surcharge de lancement de kernel.

La conclusion à ce moment était que l'axe énergétique était mort. Il a nommé son propre itinéraire de fuite, bien que : un gain énergétique n'est concevable que pour des nombres d'experts beaucoup plus importants, où le feed-forward redomine la passe _dense_, et seulement avec un vrai kernel sparse.

Les deux conditions se sont avérées satisfaisantes.

## 3. Où cela bascule (Exp 22)

Maintenant `d_model`, `d_hidden` et la profondeur fixe et en balayant le nombre d'experts, avec l'intégration de puissance soustraite à l'inactivité sur une boucle d'inférence soutenue :

| Experts | Paramètres | MoE groupé ktok/s | Dense ktok/s | **Énergie× vs dense** | vs Transformer    |
| ------- | ---------- | ----------------- | ------------ | --------------------- | ----------------- |
| 8       | 27,3M      | 101,5             | 82,3         | **1,31×**             | 1,16× (≈ égalité) |
| 32      | 77,8M      | 78,4              | 33,8         | **2,50×**             | 1,03×             |
| 64      | 144,9M     | 71,9              | 18,1         | **3,99×**             | 0,97×             |

La part feed-forward du modèle dense grimpe 61% → 86% → 92% de sa passe tandis que celle du modèle sparse reste plate à ~0,022 GFLOP/jeton. Le Transformer apparié en paramètres ne gagne **rien** du balayage (≈1,0× dense partout) car il n'a pas de sparsité à exploiter - donc l'écart par rapport à l'architecture dominante s'ouvre d'une égalité à 8 experts à ~4× à 64.

La puissance est restée plate partout (~54–57 W groupé vs ~57–60 W dense), confirmant qu'il s'agit d'un gain de débit plutôt qu'un gain de tirage de puissance. Cette distinction importe et j'y reviendrai dans la section portée.

## 4. Le kernel porte du poids (Exp 13, Exp 24)

Moins de FLOP ne signifie pas automatiquement moins d'énergie. Quelque chose doit convertir l'un en l'autre.

La mise en œuvre naïve distribue les experts dans une boucle Python - une itération et un lancement de kernel par expert. Cette surcharge est fixe par expert, donc elle croît exactement aussi vite que le gain. **La distribution par boucle est plus lente que dense à chaque nombre d'experts testé** (0,72–0,78× de latence relative). Mesuré isolément, l'architecture "efficace" était une régression.

La correction est un GEMM groupé trié et sans perte : triez les jetons par leur expert assigné en segments contigus, construisez des décalages cumulatifs, et émettez deux matmuls groupés sur tous les segments en un lancement chacun. Un expert à zéro jeton devient un segment de largeur zéro - 0 FLOP, pas de remplissage, donc l'exécution conditionnelle est conservée plutôt que contrefaite.

**Inférence (Exp 13) :**

| Experts | Boucle tok/s | Groupé tok/s | Accélération | max abs Δ logits |
| ------- | ------------ | ------------ | ------------ | ---------------- |
| 8       | 60 061       | 88 963       | **1,48×**    | 0,00e+00         |
| 16      | 41 049       | 86 245       | **2,10×**    | 0,00e+00         |
| 32      | 24 774       | 81 594       | **3,29×**    | 0,00e+00         |

Le débit groupé reste à peu près constant (89k → 86k → 82k) alors que la boucle s'effondre (60k → 41k → 25k). Les sorties sont **bit-identiques** - différence de logit zéro, retournements d'argmax zéro. L'accélération est une pure suppression de surcharge, pas une approximation.

**Entraînement (Exp 24) :** le même kernel a été rendu capable d'autograd avec une rétroaction explicite, donnant **1,26× / 1,61× / 2,59× / 4,51×** étapes d'entraînement plus rapides à 8 / 16 / 32 / 64 experts, avec gradients `w_in` et `w_out` **bit-identiques** à la boucle et Δloss = 0. Cela a supprimé l'astérisque "inférence uniquement" de toute l'histoire.

Si vous retenez un point d'ingénierie de ce message : **une architecture efficace sans son kernel est une architecture plus lente.** Le nombre FLOP est un billet à ordre ; le kernel est s'il se réalise.

## 5. Cela s'adapte (Exp 27)

Neuf points sur un H100 - trois échelles de modèle × trois nombres d'experts - benchmark quatre variantes appariées en forme. Poids aléatoires, inférence uniquement, donc la mesure est déterminée par la forme et ne nécessite pas d'entraînement. Net mJ/jeton, sparse / dense / Transformer, avec le ratio MoE-vs-dense en gras :

| Échelle | 8 experts                        | 32 experts                       | 64 experts                        |
| ------- | -------------------------------- | -------------------------------- | --------------------------------- |
| 25M     | 0,46 / 0,77 / 0,75 (**1,67×**)   | 0,49 / 1,98 / 1,99 (**4,08×**)   | 0,51 / 3,65 / 3,56 (**7,13×**)    |
| 350M    | 2,73 / 4,26 / 3,84 (**1,56×**)   | 2,92 / 10,31 / 9,40 (**3,53×**)  | 3,11 / 17,80 / 16,64 (**5,72×**)  |
| 1B      | 9,12 / 13,35 / 11,65 (**1,46×**) | 9,52 / 29,25 / 28,17 (**3,07×**) | 10,32 / 52,38 / 50,56 (**5,08×**) |

Lisez la rangée 1B sur : l'énergie sparse va 9,1 → 9,5 → 10,3 à mesure que les experts s'adaptent 8× - essentiellement plat, comme l'arithmétique à §1 le prédit. Dense va 13 → 29 → 52.

![Énergie par jeton sur l'échelle de modèle et le nombre d'experts](paper/figures/fig1_energy_scaling.png)

Deux observations honnêtes qui voyagent avec le nombre. Premièrement, le kernel groupé **porté à Hopper (sm_90)** proprement, ayant été développé sur Blackwell (sm_120) - ce n'est pas un artefact d'une seule architecture. Deuxièmement, **le ratio s'adoucit avec l'échelle de modèle** à nombre d'experts fixe (7,1× → 5,7× → 5,1× à 64 experts) car le mélangeur de séquence toujours actif prend une plus grande part absolue à mesure que `d_model` croît. Le levier est le nombre d'experts, pas la taille du modèle. Dire "5× à 1B" sans cette mise en garde serait de la survente par omission.

## 6. Où les FLOP cessent de prédire les joules (Exp 48, Exp 50)

C'est la section qui devrait faire confiance à un lecteur de systèmes.

Il y a deux façons différentes d'"ajouter des experts", et elles se comportent dans des directions opposées.

**`d_hidden` fixe (mise à l'échelle de capacité)** est §3 et §5 : plus d'experts signifie une plus grande base de référence dense, donc le gain énergétique augmente.

**Budget total fixe (granularité)** maintient `n_experts · d_hidden` constant et rend chaque expert plus petit. Le proxy FLOP adore cela - la précision par unité de calcul actif grimpe de façon monotone **23,4× → 35,0× → 46,3× → 53,0×** à 32 / 64 / 128 / 256 experts (Exp 50, avec une confusion de churn de purge corrigée).

L'énergie mesurée n'est pas d'accord. Voici le proxy FLOP et le wattmètre côte à côte, tous deux du même écran (Exp 48 - ses chiffres proxy s'exécutent un peu plus haut que les chiffres Exp 50 corrigés de churn ci-dessus, mais la tendance est ce qui importe) :

| Experts | Précision/calcul-actif (proxy FLOP) | mJ/jeton mesuré | vs énergie dense |
| ------- | ----------------------------------- | --------------- | ---------------- |
| 64      | 34,8×                               | 0,803           | **2,21×** moins  |
| 128     | 50,9×                               | 0,807           | **2,19×** moins  |
| 256     | 60,2×                               | 0,954           | **1,83×** moins  |

**mJ/jeton augmente tandis que le proxy FLOP monte.** La surcharge de lancement par groupe sur de nombreux petits experts (largeur 256 → 64) mange l'économie. Selon une règle de décision consciente de l'énergie - une modification n'est acceptée que si la qualité s'améliore _et_ l'avantage énergétique tient - 64 et 128 passent, et **256 est rejeté** : il dépense de vrais joules pour acheter un nombre proxy.

Donc **~128 experts est le point idéal réalisé**, et "les FLOP ne sont pas des joules" obtient une coordonnée réelle plutôt qu'une mise en garde. L'écart est la surcharge de kernel groupé plutôt que quelque chose de fondamental - un kernel conscient des tuiles pourrait repousser le genou - mais jusqu'à ce que cela soit écrit, la revendication honnête est conditionnée au kernel.

![Granularité : le proxy FLOP et l'énergie mesurée divergent au-dessus de ~128 experts](paper/figures/fig6_granularity_law.png)

## 7. Ce que le spiking achète réellement (Exp 51, Exp 60)

Le modèle utilise des activations [spiking](https://open-neuromorphic.org/) binaires - des neurones à intégration et tir qui émettent 0 ou 1 plutôt qu'un flottant. La question évidente de l'examinateur est si cela coûte de la précision. Deux contrôles y répondent de bout en bout.

Remplacer le spike caché binaire par un SiLU gradué à FLOP égal (Exp 51) : 57,10 contre 57,44 perplexité - le **spike est 0,6% mieux**, grammaire liée. Ensuite, supprimez _l'ensemble de l'appareil_ de spiking y compris la porte d'entrée (Exp 60) : **56,5 contre 57,10** perplexité, BLiMP **0,691 contre 0,691** - exactement à égalité.

Le compte complet est donc : **le spiking coûte environ 1% de qualité au total et est neutre sur la grammaire.** Sa valeur est que les activations binaires rendent l'expert sans multiplication et donnent une vraie exécution conditionnelle zéro FLOP - un expert non atteint ou non déclenché ne fonctionne pas. C'est un argument de compatibilité matérielle pour le silicium piloté par événements, pas un argument de précision, et l'énoncer avant un examinateur ne coûte rien.

## 8. Portée honnête

Lisez ceci avant de citer n'importe quel chiffre ci-dessus.

**Le benchmark énergétique est inférence uniquement et poids aléatoire.** Il mesure la forme du calcul, pas un déploiement entraîné. Cela le rend conservateur et reproductible, mais ce n'est pas un benchmark de service sur une charge réelle.

**Sur les GPU avec puissance plate, "l'énergie par jeton" est vraiment des FLOP-actifs sur le débit.** La puissance mesurée variait ~52–60 W sur toutes les architectures testées, donc le gain est basé sur la latence. Le cadrage défendable est **le coût de service et les jetons par dollar**, pas les joules bruts. Le compte énergétique vrai et piloté par événements nécessite du matériel neuromorphe - [SpiNNaker2](https://spinncloud.com/) ou [Loihi 2](https://www.intel.com/content/www/us/en/research/neuromorphic-computing.html) - que ce projet n'a pas mesuré. C'est le plus grand élément ouvert unique.

**Le service en batch érode la sparsité par jeton (Exp 65).** L'union des experts touchés sur un batch est ce qu'un serveur paie réellement, et il s'effondre rapidement : **96,9% sparsité d'union à batch 1, 39,7% à batch 32, 14,1% à batch 64.** À 64 étapes de décodage simultanées, 86% du pool est touché. C'est la même limitation qui a tenu les astuces de sparsité contextuelle hors des piles de service de production (cf. [Dejavu](https://arxiv.org/abs/2310.17157)), et c'est pourquoi le gain par jeton est mieux lu comme une propriété de décodage de flux unique et de bord.

Une tentative de correction a échoué sa propre barrière (Exp 66) : un objectif de routage à accord de groupe destiné à concentrer le routage d'un batch en moins de groupes d'experts a produit une sparsité d'union batch-32 de **0,371** par rapport à une base de référence non modifiée de **0,397** - la courbe entière superposée. Le terme auxiliaire a été simplement surpassé par la perte d'équilibrage de charge. Signalé plutôt qu'enfoui, pour [les raisons du message compagnon](./budget-dependent-benchmarking-sparse-moe).

**Tout ici est 2,5M–145M paramètres** pour les résultats entraînés, avec la courbe énergétique instantiée jusqu'aux dimensions 1B. Ce n'est pas une revendication d'échelle limite.

## 9. Ce qui tient

Réduit à ce qui survit chaque mise en garde ci-dessus :

- Le routage Top-1 rend le coût feed-forward **constant en nombre d'experts** ; la base de référence dense croît linéairement. C'est de l'arithmétique, pas une découverte.
- Mesuré sur un H100, cela donne **3,07× à 32 experts et 5,08× à 64 experts** moins d'énergie par jeton à 1B paramètres, par rapport à un modèle dense et un Transformer apparié en paramètres.
- **Le kernel GEMM groupé est ce qui le rend réel** - bit-exact, et vaut 3,29× inférence et 4,51× entraînement à des nombres d'experts élevés. Sans lui, rien de tout cela n'existe.
- **Au-dessus de ~128 experts à budget fixe, l'énergie mesurée et le proxy FLOP divergent.** Fiez-vous aux joules.
- **Le spiking coûte ~1% de qualité** et achète la compatibilité neuromorphe, pas la précision.

---

## FAQ

**Q : Mixture-of-Experts économise-t-il réellement de l'énergie à l'inférence ?**
Cela dépend entièrement du nombre d'experts et du kernel. À 8 experts, mesuré ici, il n'y avait aucun gain - le mélangeur toujours actif dominait et la surcharge de distribution mangeait l'économie. À 32–64 experts avec un kernel GEMM groupé, c'était 3–5× moins d'énergie par jeton à 1B paramètres.

**Q : Pourquoi le gain augmente-t-il à mesure que vous ajoutez des experts ?**
Le routage Top-1 exécute un expert par jeton quel que soit la taille du pool, donc le coût sparse est plat en nombre d'experts. Un modèle dense apparié en paramètres augmente la largeur feed-forward linéairement avec le même budget de paramètres. Le ratio croît donc linéairement.

**Q : Est-ce que moins de FLOP signifie moins d'énergie ?**
Non au-dessus de ~128 experts à budget fixe. Le mJ/jeton mesuré est passé de 0,807 à 0,954 en passant de 128 à 256 experts tandis que la métrique basée sur les FLOP continuait à s'améliorer - surcharge de lancement par groupe sur de nombreux petits experts. Mesurez les joules.

**Q : Cela tient-il sous le service en batch ?**
Partiellement. La sparsité d'union par jeton passe de 96,9% à batch 1 à 39,7% à batch 32. Le gain énergétique par jeton est le plus fort pour le décodage de flux unique et de bord ; le service en batch en récupère seulement une partie.

**Q : Que contribuent les activations de spiking ?**
Environ 1% de coût de qualité, grammaire neutre. L'avantage est des experts sans multiplication et une vraie exécution conditionnelle zéro FLOP, ce qui importe pour le matériel neuromorphe piloté par événements plutôt que pour la précision sur un GPU.

---

## Reproduisez-le

Géré avec [uv](https://docs.astral.sh/uv/) sur [PyTorch](https://pytorch.org/) :

```bash
git clone https://github.com/JustinGuese/SpikingBrain2.0-s2moe
uv sync

# Puissance CUDA en direct + latence, poids aléatoires (déterminé par la forme)
uv run python bench_energy.py --n-experts 64 --d-model 512 --d-hidden 512 \
    --n-layers 4 --batch 16 --seq 256

# Équivalence kernel + accélération, inférence et entraînement
uv run python bench_dispatch.py
uv run python bench_train_dispatch.py
```

- **Code, kernels, log complet :** [github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)
- **Démo d'énergie interactive :** [huggingface.co/spaces/guestros/s2-moe-demo](https://huggingface.co/spaces/guestros/s2-moe-demo)
- **Points de contrôle entraînés :** [huggingface.co/guestros/s2-moe-checkpoints](https://huggingface.co/guestros/s2-moe-checkpoints)
- **Archivé (CC BY 4.0) :** [doi.org/10.5281/zenodo.20846758](https://doi.org/10.5281/zenodo.20846758)

Lectures connexes : [Switch Transformer](https://arxiv.org/abs/2101.03961) sur le routage Top-1 à l'échelle, [DeepSeekMoE](https://arxiv.org/abs/2401.06066) sur la topologie d'experts partagés, [Gated Linear Attention](https://arxiv.org/abs/2312.06635) sur le mélangeur de récurrence linéaire, et [Open Neuromorphic](https://open-neuromorphic.org/) pour le côté matériel piloté par événements.

Si un chiffre ici ne s'accorde pas avec `EXPERIMENTS.md`, le log gagne - déposez un problème.
