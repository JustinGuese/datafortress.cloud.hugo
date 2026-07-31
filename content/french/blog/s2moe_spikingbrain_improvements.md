---
title: "Même résultat, 1/32 du travail : Ajout d'une FFN Mixture-of-Experts Sparse à SpikingBrain (un modèle Brain-Inspired de 5B)"
bg_image: 'images/blog/s2moe-vs-dense.png'
date: 2026-07-30T09:10:00+02:00
author: 'Justin Guese'
description: "J'ai reconstruit la couche feed-forward de SpikingBrain 2.0 en tant que Mixture-of-Experts Top-1 sparse. Même qualité à 1/32 du calcul FFN, 2.71x moins de block FLOPs à leur forme 5B - et l'un des résultats qu'une deuxième graine aléatoire a supprimé."
image: 'images/blog/s2moe-vs-dense.png'
categories:
  - Machine Learning

tags:
  [
    'mixture of experts',
    'model efficiency',
    'spikingbrain',
    'cuda kernels',
    'open source',
  ]
type: post
---

## La version simple, en 60 secondes

Imaginez un atelier de réparation avec 32 spécialistes.

Aujourd'hui, les modèles d'IA fonctionnent comme un atelier où **chaque travail est confié à l'ensemble des 32 personnes à la fois.** Tout le monde touche à tout. Cela fonctionne. C'est aussi extraordinairement inefficace.

J'ai reconstruit une partie d'un modèle d'IA de 5 milliards de paramètres ([SpikingBrain 2.0](https://github.com/BICLab/SpikingBrain2.0)) pour qu'une réceptionniste lise d'abord chaque tâche et la passe **au seul spécialiste qui devrait s'en charger.**

Même atelier. Même 32 spécialistes sur la masse salariale. Même qualité de travail en sortie.

**Un trente-deuxième du travail.**

C'est toute l'idée. Le reste de ce post concerne ce qui s'est passé quand j'ai mesuré correctement — y compris le résultat unique que j'ai dû jeter à la poubelle.

## Qu'est-ce qu'un modèle Mixture-of-Experts ?

Dans un réseau de neurones normal, chaque entrée traverse chaque paramètre. C'est une immense fonction unique, et tout s'exécute à chaque fois.

Un modèle **Mixture-of-Experts (MoE)** divise cette grande fonction en plusieurs petites — les « experts » — et place un **routeur** devant. Le routeur regarde chaque mot et décide quel expert le traite.

Avec le **routage Top-1**, exactement un expert s'exécute par mot. Pas deux, pas un mélange. Un.

Voici la partie importante : **le coût par mot ne change pas quand vous ajoutez plus d'experts.** Soixante-quatre experts coûtent autant par mot que huit, car vous n'en exécutez toujours qu'un. Mais la capacité totale du modèle augmente à chaque ajout.

Ce n'est pas une astuce intelligente que quelqu'un aurait découverte. C'est de l'arithmétique. C'est précisément pour cela que c'est fiable.

## Qu'est-ce que SpikingBrain 2.0 ?

[SpikingBrain 2.0](https://github.com/BICLab/SpikingBrain2.0) est une famille de modèles brain-inspired open-source de l'Institut d'automatisation, Académie chinoise des sciences. Deux modèles 5B, sortis avec le code et les poids.

C'est un travail vraiment intéressant. Il remplace l'attention standard par un hybride d'attention softmax sparse et d'attention linéaire sparse, ajoute un schéma de codage d'activation qui prend en charge le matériel event-driven, et offre un pipeline de conversion qui transforme les Transformers existants en cette architecture.

J'ai lu leur code publié plutôt que simplement l'article, et j'ai trouvé l'ouverture dont j'avais besoin : **chaque bloc est `attention → dense feed-forward`.** Il n'y a pas de routage d'experts dans la couche feed-forward n'importe où dans la sortie.

Ainsi, une couche feed-forward MoE sparse n'est pas une idée concurrente à la leur. C'est un **créneau vide.**

## Ce que j'ai ajouté

Quatre mécanismes, tirés de [mon propre dépôt de recherche](https://github.com/JustinGuese/S2-MoE-llm) et portés dans leur bloc :

- **Un pool d'experts routé Top-1** remplaçant la couche feed-forward dense.
- **Un noyau partagé toujours actif** — un petit expert que chaque mot traverse, aux côtés de celui routé.
- **Un noyau CUDA grouped-GEMM**, car sans lui tout est plus lent (plus d'informations ci-dessous).
- **Un upcycler dense-vers-MoE**, pour que le pool d'experts puisse être construit à partir de leurs _poids déjà entraînés_ plutôt que de nécessiter un réentraînement à partir de zéro.

Tout est caché derrière une clé de configuration absente de l'ensemble de leurs six configurations distribuées. **Leurs points de contrôle publiés se chargent et fonctionnent octet-pour-octet comme avant** sauf si vous le désactivez délibérément. Il y a un test qui l'affirme.

## Résultat : la même qualité à 1/32 du calcul feed-forward

Voici la mesure principale.

Au **nombre de paramètres équivalent** — 77,8 M pour le modèle sparse contre 77,7 M pour un contrôle dense, 0,2 % d'écart — le modèle sparse atteint **la même perplexité de validation** tout en utilisant **1/32 du calcul feed-forward.**

C'est **32× la précision par unité de calcul actif.**

Même taille. Même qualité. Un trente-deuxième du travail dans cette couche.

C'est la proposition MoE sparse fonctionnant exactement comme annoncée : la capacité augmente avec le pool, le calcul actif reste plat.

## Ce que cela vaut à leur échelle 5B

Les revendications de calcul sont déterminées par les formes de tenseur, pas par l'entraînement — elles peuvent donc être mesurées directement aux vraies dimensions de bloc de SpikingBrain 5B avec des poids aléatoires, en environ vingt minutes sur une RTX 4090 unique.

À `hidden_size 2560`, `intermediate_size 9728`, bf16, parameter-matched, batch 8 × sequence 512 :

| Feed-forward              | MFLOP/token | mJ/token | Active watts | Tokens/sec  |
| ------------------------- | ----------- | -------- | ------------ | ----------- |
| Dense SwiGLU (their code) | 229.1       | 0.669    | 298.5        | **446,070** |
| Sparse MoE, 16 experts    | 89.1        | 0.419    | 138.9        | 331,697     |
| Sparse MoE, 32 experts    | 84.5        | 0.412    | 133.7        | 324,344     |
| Sparse MoE, 64 experts    | 82.3        | 0.414    | 123.7        | 299,053     |

**2.71× moins de FLOPs par bloc. 1.62× moins d'énergie par token. Moins de la moitié de la consommation électrique** — 134 W contre 299 W.

## Pourquoi 1/32 ne se transforme pas en 32× globalement

Regardez ce tableau à nouveau. Le calcul feed-forward a chuté 32×, mais l'ensemble du bloc n'a chuté que de 2,71×. Où est passé le reste ?

**Les parties toujours actives ne se réduisent pas.** L'attention s'exécute toujours sur chaque mot. Le routeur s'exécute sur chaque mot. Le noyau partagé s'exécute sur chaque mot.

L'optimisation d'un composant ne peut vous faire économiser que la part de ce composant dans le total. Une fois que la couche feed-forward est presque gratuite, tout le reste devient le plancher — et vous avez atteint le plafond de ce que la sparsité feed-forward peut faire.

Si vous retenez un seul chiffre de ce post pour votre propre travail, retenez celui-ci. Il vous dit quand arrêter d'optimiser cette couche et regarder une autre.

## La partie honnête : le modèle dense est plus rapide

Lisez correctement la colonne tokens-par-seconde. **446 000 pour dense contre 324 000 pour sparse.** Dense gagne avec une bonne marge.

La victoire ici est **FLOPs et puissance, pas débit wall-clock.**

La raison est peu glamour : une multiplication dense matricielle large utilise mieux un GPU qu'une multiplication matricielle groupée plus un routeur plus un noyau partagé. Les GPUs sont conçus pour de grands blocs réguliers d'arithmétique.

Sur un matériel limité en puissance ou event-driven, ce commerce s'inverse et le modèle sparse gagne. Sur un GPU de centre de données limité en débit, ce n'est pas le cas. Quiconque ferait un benchmark cela trouverait en dix minutes, donc pas la peine de prétendre le contraire.

## Les modèles sparse sont plus lents sans le bon noyau CUDA

C'est la partie que j'aimerais le plus qu'un autre ingénieur retienne.

L'implémentation évidente boucle sur les experts en Python — une itération, un lancement de noyau chacun. Cet overhead est fixe par expert, donc il augmente exactement aussi vite que votre économie.

**Mesuré seul, la couche sparse naïve était plus lente que dense à chaque nombre d'experts.** L'économie FLOP existait sur papier et absolument nulle part ailleurs.

Le correctif : triez les tokens par expert assigné en blocs contigus et lancez une multiplication matricielle groupée unique sur l'ensemble. J'ai enveloppé `torch._grouped_mm` dans une fonction autograd avec un passe arrière explicite pour qu'il fonctionne à l'entraînement aussi.

| Experts                | 8     | 16    | 32    | 64         |
| ---------------------- | ----- | ----- | ----- | ---------- |
| Forward vs Python loop | 2.27× | 4.60× | 8.29× | **12.75×** |
| Training step vs loop  | 1.85× | 3.99× | 6.34× | **9.95×**  |

Et c'est **bit-exact** — différence absolue maximale de zéro par rapport à la boucle, sur les résultats et les deux gradients de poids. C'est du pur retrait de surcharge, pas une approximation.

**Une architecture efficace sans son noyau est juste une architecture plus lente.** Le nombre de FLOP est une promesse ; le noyau est de savoir si elle est payée.

## Un bug CUDA qui pend silencieusement votre GPU

Utile à savoir si vous touchez jamais à cette op : **`torch._grouped_mm` fait un deadlock sur les divisions de groupe dégénérées.**

Quand l'occupation des experts est inégale, vous obtenez des segments de largeur zéro. Alimentez-les au noyau et il se fige — GPU inactif, un cœur CPU qui tourne, pas d'erreur, pas d'expiration. Cela ressemble exactement à une étape d'entraînement lente jusqu'à ce que vous remarquiez que c'est lent depuis six heures.

Le compactage des groupes vides avant l'appel est mathématiquement identique et élimine complètement le déclencheur.

## La sparsité survit-elle au service batched ?

Deux revendications différentes ici qui se mélangent constamment, alors séparons-les.

**FLOPs par token restent à 1/32 à n'importe quelle taille de batch.** Chaque mot traverse exactement un expert quel que soit le nombre de mots en vol. Le tableau ci-dessus a été mesuré au batch 8 — ce sont déjà des chiffres en lot.

**Ce qui s'effondre avec la taille du batch est la résidence des experts** — la capacité à garder seulement les experts actifs chargés en mémoire. Au batch 1 vous touchez un expert sur 32 et pouvez sauter le reste. Au batch 64, l'_union_ des experts touchés couvre la plupart du pool :

| Batch size     | 1     | 32    | 64    |
| -------------- | ----- | ----- | ----- |
| Union sparsity | 96.9% | 39.7% | 14.1% |

Ainsi, la déchargement des experts et la pondération des portes event-driven sont **des propositions single-stream.** Les réductions de calcul et d'énergie ne le sont pas — elles se maintiennent sous le batching.

Cette distinction est pourquoi les méthodes « contextual sparsity » n'arrivent pas à atteindre les piles de service en production, et pourquoi cela vaut la peine d'être précis sur lequel des deux vous revendiquez.

## Le résultat que j'ai supprimé : une graine aléatoire a effacé une victoire de 2,1 %

Maintenant la partie inconfortable.

J'avais aussi une victoire de **qualité**. Le modèle sparse a battu son contrôle dense par 2,1 % de perplexité — 58,99 contre 60,27. Beau chiffre. C'est entré dans la rédaction.

Puis j'ai lancé une graine de plus pour obtenir des barres d'erreur.

La victoire a disparu. Deuxième graine : **58,52 contre 58,54.** Une égalité morte.

Voici ce qui s'est réellement passé. Le **dense baseline** s'est déplacé de 2,9 % entre les graines (60,27 → 58,54). Mon modèle s'est déplacé de 0,8 % (58,99 → 58,52). La première graine n'avait pas montré que mon modèle se comportait bien. Il avait montré **le baseline qui se comportait mal.**

Sur les deux graines, l'écart est −1,1 % avec une propagation de ±1,05 points de pourcentage. Indiscernable de la parité.

**La leçon se généralise : votre baseline a aussi de la variance.** Une comparaison à une seule graine ne mesure pas votre méthode — elle mesure la chance des deux modèles. J'avais même écrit la règle à l'avance (« une graine, tout ce qui est inférieur à quelques pour cent n'est pas une conclusion ») et 2,1 % s'assis juste sur la ligne, ce qui est précisément où de telles règles cessent d'être décoratives.

Le résultat principal — parité à 1/32 du calcul — n'a jamais été affecté. Perdre un bonus n'enlève pas le plat principal. Mais le 2,1 % est parti et il ne revient pas.

## Ce d'autre qui n'a pas fonctionné

Deux des quatre mécanismes n'ont pas justifié leur présence, et le rapporter c'est moins cher que d'avoir quelqu'un d'autre le découvrir.

**Les activations spiking coûtent 2,8 % de perplexité au calcul identique.** Les activations binaires 0/1 produisent une véritable sparsité d'activation — mais un noyau GPU dense ne peut pas l'encaisser. Donc sur ce matériel c'est un coût de qualité pur. Sa valeur est la compatibilité avec les puces neuromorphes event-driven, ce qui est un argument réel, juste pas un argument de précision ou d'efficacité GPU.

**La phase de sommeil est inerte à côté d'un noyau partagé.** Elle restructure le pool d'experts pendant l'entraînement — fusionnant les doublons, élagage, repousse. Résultat : −0,28 % de perplexité pour 5,2 % de temps d'entraînement supplémentaire. Les journaux expliquent pourquoi : sur les dix cycles, il n'a fusionné rien. **Le noyau partagé toujours actif absorbe exactement la redondance pour laquelle la fusion existe pour supprimer.** Deux mécanismes faisant le même travail, donc le second n'a rien à faire.

**Même le noyau partagé est un compromis, pas une victoire gratuite** — il achète 2,5 % de perplexité pour 52 % plus de calcul feed-forward actif. Cela en vaut la peine si vous optimisez la qualité, pas si vous optimisez le calcul.

## Deux bugs dans leur configuration distribuée

En suivant leurs propres notes d'installation sur une machine propre, deux choses se cassent. Les deux sont triviales une fois que vous savez, les deux vous coûtent une heure si vous ne savez pas :

**Leur MoBA groupé pinne toujours `flash-attn==2.6.3`.** L'installer désinstalle silencieusement le `flash-attn==2.7.3` que leurs instructions demandent une ligne avant, puis échoue à construire 2.6.3 à partir de la source. L'installer avec `--no-deps` le répare, et correspond à leur propre note que la copie groupée a été adaptée à l'interface plus récente. Le pin est des métadonnées obsolètes.

**`import fla` a besoin d'un compilateur C et des en-têtes Python présents.** Triton compile un talon de lanceur au moment de l'importation. Sur une image CUDA minimale sans `build-essential` et `python3-dev`, ça meurt juste.

## Vérification de leur mécanisme au lieu du mien

La chose la plus intéressante que j'ai construite n'est pas le MoE. C'est un diagnostic pour **leur** architecture.

Leur attention linéaire sparse choisit 2 des 4 partitions d'état par mot, entraîné vers une utilisation équilibrée par une perte auxiliaire. Cette perte s'exécute seulement pendant l'entraînement. **Rien ne garantit que l'équilibre a survécu dans les poids publiés** — et non plus de la façon dont cela peut échouer ne montre dans la perplexité ou les scores de benchmark :

- **Effondrement d'utilisation** — quelques partitions prennent la plupart des choix, donc l'état étendu est effectivement plus petit que configuré et son coût mémoire achète moins que annoncé.
- **Input-indépendance** — l'utilisation regarde équilibrée globalement, mais chaque mot choisit la _même_ paire. L'histogramme regarde parfait tandis que le routage n'apporte aucune information du tout.

Il y a un piège à mesurer cela. Le chargement du modèle avec `trust_remote_code=True` importe le code de modélisation **groupé dans le répertoire du checkpoint**, pas la copie dans le référentiel. Patcher le module du référentiel et vous mesurerez quelque chose que le modèle n'appelle jamais, et obtenez une table de rien qui regarde confident.

Le résultat, sur la plage de contexte entière du checkpoint entraîné :

| Context length   | 1,024  | 4,096  | 8,192  |
| ---------------- | ------ | ------ | ------ |
| Usage entropy    | 0.9868 | 0.9868 | 0.9863 |
| Most-common pair | 25.7%  | 26.2%  | 26.5%  |
| All 6 pairs used | yes    | yes    | yes    |

L'entropie de 1,0 signifie parfaitement équilibrée. Une part de 16,7 % signifierait parfaitement uniforme sur les paires.

**Les deux modes d'échec sont absents, à chaque longueur.** Sur une augmentation de contexte 8×, l'entropie se déplace de 0,0005. Leur perte auxiliaire a fait son travail et la propriété s'est maintenue.

C'est un résultat nul, et je le rapporte comme tel. C'est maintenant [une discussion ouverte sur leur repo](https://github.com/BICLab/SpikingBrain2.0/issues/4).

## Portée honnête

Tout ce qui précède, borné :

- **Rien n'a été entraîné à 5B ou sur leurs checkpoints.** Le travail de qualité est à ≤146M paramètres, à partir de zéro. Les chiffres 5B sont au niveau du bloc et déterminés par la forme.
- **Les résultats de qualité sont une à deux graines.** Une a déjà échoué. Les directions sont des conclusions ; les magnitudes sont provisoires.
- **L'avantage de qualité s'inverse avec les budgets d'entraînement longs** — un avantage −5,15 % à un budget fixe est devenu +2,4 % à 4× le budget. [J'ai écrit cela séparément](/blog/s2moe_budget_dependent_benchmarking/). SpikingBrain s'entraîne bien au-delà de ce point.
- **L'énergie sur un GPU est vraiment FLOPs sur latence.** La puissance varie peu selon les architectures, donc le cadrage défendable est le coût de service par token, pas les joules bruts. L'accounting réelle d'énergie event-driven a besoin de silicium neuromorphe que je n'ai pas mesuré.

## Ce qui tient

- **Parité parameter-matched à 1/32 du calcul feed-forward actif.** 32× la précision par unité de calcul actif.
- **2.71× moins de block FLOPs et 1.62× moins d'énergie par token** à la vraie forme de bloc 5B, à partir de poids aléatoires.
- **Le noyau grouped-GEMM est ce qui le rend réel** — bit-exact, jusqu'à 12,75× plus rapide que la boucle naïve. Sans lui le modèle sparse est plus lent que dense.
- **Un plafond à savoir :** la sparsité feed-forward ne peut vous faire économiser que la part feed-forward. Après cela, les parties toujours actives sont le plancher.
- **Un diagnostic validé** pour le propre routage de partition de SpikingBrain, qui est revenu sain.

## FAQ

**Mixture-of-Experts réduit-il réellement le calcul ?**
Oui, et d'une montant prévisible. Le routage Top-1 exécute un expert par token quelle que soit la taille du pool, donc le calcul feed-forward est `1/n_experts` d'une couche dense parameter-matched. À 32 experts, cela est mesuré à 1/32, ce qui devient 2,71× moins de FLOPs pour l'ensemble du bloc une fois les parties toujours actives comptées.

**Un modèle MoE sparse est-il plus rapide qu'un modèle dense ?**
Pas nécessairement, et ici ça ne l'était pas — 324k tokens/sec contre 446k pour dense. Moins de FLOPs n'est pas la même chose que latence inférieure. La victoire était en FLOPs et consommation électrique (134 W vs 299 W), pas débit.

**La sparsité MoE survit-elle au service batched ?**
Le calcul économisant le fait — chaque token traverse toujours un expert quelle que soit la taille du batch. Ce qui ne survit pas est la résidence des experts : l'union des experts touchés sur un batch va de 96,9 % sparse au batch 1 à 14,1 % au batch 64, donc le déchargement des experts est une technique single-stream.

**Les activations spiking améliorent-elles la précision ?**
Non dans cette mesure. Elles coûtent 2,8 % de perplexité au calcul identique. L'avantage est la compatibilité avec le matériel neuromorphe event-driven, pas la précision ou l'efficacité GPU.

**Combien de graines faut-il pour revendiquer une amélioration de qualité ?**
Plus d'une, et ce post en est le conte cautionnaire. Un avantage de 2,1 % a disparu sur la deuxième graine parce que le _dense baseline_ avait tiré une mauvaise graine. Les comparaisons single-seed mesurent la chance, pas la méthode.

**Pouvez-vous convertir un modèle dense existant en Mixture-of-Experts ?**
Oui — c'est ce que l'upcycler fait. Il initialise chaque expert à partir de tranches des poids feed-forward dense entraînés plutôt qu'à partir de zéro. C'est un pont d'initialisation de poids et a toujours besoin d'un entraînement continu pour récupérer la qualité ; ce n'est pas une conversion gratuite.

## Reproduisez-le

```bash
git clone https://github.com/JustinGuese/SpikingBrain2.0-s2moe
cd SpikingBrain2.0-s2moe

# Energy and FLOPs at SpikingBrain's real 5B block shape - random weights, no training
python spb2/s2moe/bench/bench_energy.py --n-experts 32 --param-match
python spb2/s2moe/bench/bench_active_flops.py --n-experts 32

# Kernel equivalence and speedup, forward and training
python spb2/s2moe/bench/bench_dispatch.py

# Audit the released checkpoint's partition routing
python run_model_forward/probe_sse_selection.py --model-path /path/to/SpikingBrain-2.0-base-8k
```

- **Le fork, avec tout ce qui précède :** [github.com/JustinGuese/SpikingBrain2.0-s2moe](https://github.com/JustinGuese/SpikingBrain2.0-s2moe)
- **Le dépôt de recherche original :** [github.com/JustinGuese/S2-MoE-llm](https://github.com/JustinGuese/S2-MoE-llm)
- **Upstream :** [BICLab/SpikingBrain2.0](https://github.com/BICLab/SpikingBrain2.0)
- **Discussion ouverte :** [BICLab/SpikingBrain2.0#4](https://github.com/BICLab/SpikingBrain2.0/issues/4)

Lectures connexes ici : [pourquoi la victoire énergétique grandit avec le nombre d'experts](/blog/s2moe_energy_scaling_sparse_moe/) et [comment la revendication de qualité s'est inversée sous un budget d'entraînement plus long](/blog/s2moe_budget_dependent_benchmarking/).

Arrière-plan : [Switch Transformer](https://arxiv.org/abs/2101.03961) sur le routage Top-1, [DeepSeekMoE](https://arxiv.org/abs/2401.06066) sur les experts partagés, [Drop-Upcycling](https://arxiv.org/abs/2502.19261) sur la conversion dense-vers-MoE.

Si un chiffre ici n'est pas d'accord avec le journal d'expériences dans le repo, le journal gagne — ouvrez une issue.
