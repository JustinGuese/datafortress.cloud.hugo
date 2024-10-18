---
author: Justin Guese
bg_image: /images/download.png
categories:
- Finance
- Trading algorithmique
date: '2022-01-26T23:00:00+00:00'
description: 'L''algorithme d''apprentissage automatique typique ne peut fonctionner
  qu''avec les données qu''il a reçues. Il (généralement) ne peut pas créer de nouvelles
  caractéristiques ou interprétations comme "Si le volume augmente et la 3ème dérivée
  du prix augmente, le prix augmentera très probablement", mais il ne peut que "regarder"
  les données qu''il a reçues. Il s''agit plutôt de calculs comme "si le prix est
  supérieur à 100 USD et le volume supérieur à 2000, le prix augmentera probablement".

  '
image: /images/download.png
tags:
- Investissements dans l'IA
- Investissement
- Actions
- Finance
- Trading algorithmique
title: Amélioration des données boursières pour votre modèle de trading algorithmique
  Python
type: post

---
Disons que vous planifiez de créer votre propre modèle de trading algorithmique.

Vous utiliserez très probablement uniquement les données de prix (Fermeture) pour votre modèle et votre algorithme, mais vous découvrirez rapidement que votre modèle n'a pas de bonnes performances.

Vous utiliserez bientôt des données OHLCV typiques, qui font référence aux données d'ouverture, de plus haut, de plus bas, de fermeture, de volume, ce qui est déjà mieux, mais le modèle ne semble pas avoir de performances suffisamment bonnes.

Que pouvez-vous faire ?

Cahier de notes Colab pratique à suivre : [https://colab.research.google.com/drive/1ywqti1TuTDY_Z11ry0x4ITclCwxnXAeI?usp=sharing](https://colab.research.google.com/drive/1ywqti1TuTDY_Z11ry0x4ITclCwxnXAeI?usp=sharing)

Extrait :

[https://gist.github.com/JustinGuese/019e0e71100abe6555f78c32fd0b10a9](https://gist.github.com/JustinGuese/019e0e71100abe6555f78c32fd0b10a9)

## Qu'est-ce qu'un robot de trading Machine Learning aime ?

L'algorithme de machine learning typique ne peut fonctionner qu'avec les données qu'il a reçues. Il ne peut (généralement) pas créer de nouvelles fonctions ou interprétations telles que "Si le volume augmente et que la troisième dérivée du prix augmente, le prix augmentera très probablement", mais il ne peut que « regarder » les données qu'il a reçues. Il s'agirait de calculs tels que « si le prix est supérieur à 100 USD et que le volume est supérieur à 2 000, le prix augmentera très probablement ».

Les nouveaux utilisateurs de Machine Learning essaient maintenant de résoudre ce problème en s'entraînant pendant des décennies ou en utilisant de plus en plus de GPU, mais une méthode beaucoup plus efficace consisterait à alimenter l'algorithme avec des données supplémentaires afin qu'il puisse utiliser plus de ressources pour inférer ses calculs.

Cela peut être réalisé en :

1. Obtenir plus de données (une période plus longue)
2. Ajouter des métriques statistiques
3. Ajouter vos propres signaux et interprétations

# Pratique : Amélioration de vos données

## Premières étapes - Obtention de vos données

Tout d'abord, obtenons des données OHLCV de base. J'aime le module yfinance ([https://pypi.org/project/yfinance/](https://pypi.org/project/yfinance/)) pour sa simplicité. Il n'est pas comparable aux flux de données en temps réel, mais d'un autre côté, il est gratuit et excellent pour l'expérimentation !

    pip install yfinance pandas numpy matplotlib ta

Importez ce module ainsi que Pandas, NumPy, Matplotlib

    import yfinance as yf
    import matplotlib.pyplot as plt
    import pandas as pd

Obtenez des données boursières, l'intervalle et la période se réfèrent aux plages horaires.

interval accepte des valeurs comme 1m,2m,5m,15m,30m,60m,90m,1h,1d,5d,1wk,1mo,3mo

period accepte des valeurs comme 1d,5d,1mo,3mo,6mo,1y,2y,5y,10y,ytd,max

Toutes les combinaisons ne fonctionnent pas, comme les intervalles de 1 minute (1m) ne fonctionnent qu'avec un maximum de 7 jours, 1 heure (1h) avec un maximum de 3 mois (doit être écrit comme 90d). Mais commençons d'abord par les données quotidiennes

    df = yf.download("MSFT",period="5y",interval="1d")
    df.head()

![](/images/screenshot-from-2021-01-27-14-46-45.png)

Excursion rapide : Que sont Ouverture, Haut, Bas, Fermeture, Fermeture Ajustée et Volume ? Où est le prix ?

Il n'y a pas de « prix unique » sur le marché boursier ! Vous pouvez imaginer les données OHLCV comme des « bacs » ou des « bins » dans le temps, résumant toutes les transactions intervenues pendant cette période. Le graphique linéaire classique que vous connaissez fait généralement référence au prix de « fermeture » de cette action pendant la période X, par exemple, la valeur de l'action à la fermeture de la période.

Si nous examinons les données quotidiennes, « Ouverture » fait référence au prix moyen (!) de l'action à l'ouverture des marchés, tandis que « Fermeture » fait référence au prix moyen (!) de l'action à la fermeture des marchés. Si nous examinons les données horaires, l'« Ouverture » fait référence au début de l'heure, comme 11h00, et la « Fermeture » à la fin de l'heure, par exemple 11h59m59s.

De même, « Haut » est la valeur la plus élevée enregistrée pour la période, et « Bas » la valeur la plus basse. Le volume fait référence au nombre d'actifs ou d'actions échangés au cours de cette période.

Cela signifie que si, par exemple, « Bas » et « Fermeture » d'une colonne sont proches l'un de l'autre, nous observons très probablement une tendance à la baisse car la fermeture représente la valeur actuelle du bas. De même, si le volume est élevé, il y a beaucoup d'échanges en cours, donc si le volume est supérieur à la normale, il semble qu'il se passe quelque chose sur le marché. Quoi qu'il en soit, allez regarder sur [https://www.investopedia.com/](https://www.investopedia.com/), nous allons continuer à coder maintenant !

### Qu'est-ce que la "Fermeture Ajustée" ?

Ceci est important, car la plupart des algorithmes ML sont terriblement déroutés par les données de « fermeture » normales. S'il y a une scission de l'action, les données sembleront indiquer une chute de prix incroyable.

La raison est, pour faire court, que si une action devient trop chère, l'entreprise décide de la « scinder » en deux. Cela signifie-t-il que mon investissement diminue de moitié ? Bien sûr que non, vous recevrez simplement le double des actions que vous détenez, donc en théorie vous détenez toujours la même valeur de l'action.

Il est intéressant de noter qu'une scission entraîne généralement une augmentation des prix (des humains stupides !), et si votre algorithme de machine learning constate une forte baisse de prix, il vendra très probablement l'action.

Pour cette raison, vous devez toujours utiliser les valeurs « ajustées », qui peuvent être imaginées comme des données de prix « nettoyees », en tenant compte des scissions, des dividendes et de tous les autres événements n'affectant pas la valeur réelle des données. Par conséquent, essayez toujours d'utiliser les données ajustées pour vos algorithmes !

Dans le cas de yfinance, c'est facile à faire, car nous pouvons simplement utiliser « Fermeture Ajustée » au lieu de « Fermeture ».

### Tracé des données

En regardant les données, nous pouvons déjà constater une courbe bien connue, belle et simple.

    plt.plot(df["Fermeture Ajustée"])

## Deuxième étape : Amélioration de vos données avec des données statistiques

Comme dit précédemment, nous devons créer plus d'informations à partir de nos données pour que l'algorithme puisse les utiliser, car il ne peut pas le faire seul.

J'aime utiliser la bibliothèque ta ([https://github.com/bukosabino/ta](https://github.com/bukosabino/ta)) car elle est très facile à utiliser et contient plus de 100 calculs statistiques.

Installez-la et importez-la avec

    pip install ta
    from ta import add_all_ta_features
    from ta.utils import dropna

Maintenant, si vous savez déjà quelles valeurs vous voulez utiliser, vous pouvez les choisir uniquement, ou bien on applique toutes les 100+ valeurs à nos données :

    df = dropna(df)  # Nettoyez les valeurs manquantes si présentes
    df = add_all_ta_features(df,open="Ouverture", high="Haut", low="Bas", close="Fermeture Ajustée", volume="Volume")

Alors, qu'avons-nous fait ?

    df.columns
    Index(['Ouverture', 'Haut', 'Bas', 'Fermeture', 'Fermeture Ajustée', 'Volume', 'volume_adi',
           'volume_obv', 'volume_cmf', 'volume_fi', 'volume_mfi', 'volume_em',
           'volume_sma_em', 'volume_vpt', 'volume_nvi', 'volume_vwap',
           'volatilité_atr', 'volatilité_bbm', 'volatilité_bbh', 'volatilité_bbl',
           'volatilité_bbw', 'volatilité_bbp', 'volatilité_bbhi',
           'volatilité_bbli', 'volatilité_kcc', 'volatilité_kch', 'volatilité_kcl',
           'volatilité_kcw', 'volatilité_kcp', 'volatilité_kchi',
           'volatilité_kcli', 'volatilité_dcl', 'volatilité_dch', 'volatilité_dcm',
           'volatilité_dcw', 'volatilité_dcp', 'volatilité_ui', 'tendance_macd',
           'tendance_macd_signal', 'tendance_macd_diff', 'tendance_sma_fast',
           'tendance_sma_slow', 'tendance_ema_fast', 'tendance_ema_slow', 'tendance_adx',
           'tendance_adx_pos', 'tendance_adx_neg', 'tendance_vortex_ind_pos',
           'tendance_vortex_ind_neg', 'tendance_vortex_ind_diff', 'tendance_trix',
           'tendance_mass_index', 'tendance_cci', 'tendance_dpo', 'tendance_kst',
           'tendance_kst_sig', 'tendance_kst_diff', 'tendance_ichimoku_conv',
           'tendance_ichimoku_base', 'tendance_ichimoku_a', 'tendance_ichimoku_b',
           'tendance_visual_ichimoku_a', 'tendance_visual_ichimoku_b', 'tendance_aroon_up',
           'tendance_aroon_down', 'tendance_aroon_ind', 'tendance_psar_up',
           'tendance_psar_down', 'tendance_psar_up_indicator',
           'tendance_psar_down_indicator', 'tendance_stc', 'moment_rsi',
           'moment_stoch_rsi', 'moment_stoch_rsi_k', 'moment_stoch_rsi_d',
           'moment_tsi', 'moment_uo', 'moment_stoch',
           'moment_stoch_signal', 'moment_wr', 'moment_ao', 'moment_kama',
           'moment_roc', 'moment_ppo', 'moment_ppo_signal',
           'moment_ppo_hist', 'autres_dr', 'autres_dlr', 'autres_cr'],
          dtype='object')

Bien, cela devrait suffire pour l'instant !

De plus, il y a encore beaucoup de `NaN` présents, car certaines valeurs ne sont calculées que si suffisamment de temps s'est écoulé. Dans mon expérience, les remplacer par zéro fonctionne assez bien, même s'il existe des techniques plus avancées pour cela.

    df = df.fillna(0)

## Troisième étape : Création de vos propres signaux

Il est maintenant temps de traduire vos idées de transactions étranges en nombres !

Commençons par le croisement classique des moyennes mobiles. L'idée est la suivante : si une moyenne mobile courte croise une moyenne mobile plus lente, cela indique soit une hausse, soit une baisse du prix, selon le sens du croisement.

Encore une fois, consultez Investopedia pour plus de détails : [https://www.investopedia.com/articles/active-trading/052014/how-use-moving-average-buy-stocks.asp](https://www.investopedia.com/articles/active-trading/052014/how-use-moving-average-buy-stocks.asp)

Notre objectif est tout d'abord de calculer les moyennes mobiles, puis de formuler les croisements comme 1 et -1, et 0 pour signaler l'absence de croisement.

### Création de moyennes mobiles simples

    # Création de moyennes mobiles simples
    moyennes = [1,2,5,10,15,20,25,50,100]
    for moyenne in moyennes:
      df['SMA_%d'%moyenne] = df["Fermeture Ajustée"].rolling(window=moyenne).mean()
    
    # Visualisation uniquement des SMA
    colonne_filtres = [col for col in df if col.startswith('SMA')]
    df[colonne_filtres].tail()

Et une visualisation :

    # Résultats avec des figures plus grandes
    plt.rcParams["figure.figsize"] = (20,20)
    for filtre in colonne_filtres:
      plt.plot(df[filtre],label=filtre)
    plt.legend()

![SMA python trading](/images/download.png "Image par l'auteur")

### Création d'un signal de croisement

Utilisons une petite fonction auxiliaire

    def createCross(data, fastSMA, slowSMA):
      fast = 'SMA_%d'%fastSMA
      slow = 'SMA_%d'%slowSMA
      nom_croisement = "cross_%d_%d"%(fastSMA,slowSMA)
      previous_fast = data[fast].shift(1)
      previous_slow = data[slow].shift(1)
      neg = ((data[fast] < data[slow]) & (previous_fast >= previous_slow))
      pos = ((data[fast] > data[slow]) & (previous_fast <= previous_slow))
      data[nom_croisement] = 0
      data.loc[neg,nom_croisement] = -1
      data.loc[pos,nom_croisement] = 1
      return data

Et maintenant, vous pouvez soit insérer des valeurs personnalisées, soit suivre notre exemple et prendre simplement les produits croisés :

    for fast in moyennes:
      for slow in moyennes:
        if fast != slow and slow > fast:
          df = createCross(df,fast,slow)

Ceci a créé un signal de classification parfait signalant un croisement haussier avec 1, un croisement baissier avec -1, et 0 étant un signal neutre (pas de croisement).

Ceci n'est qu'un exemple des signaux que vous pouvez fournir.

### Création d'une colonne de variation en pourcentage

Et pour ajouter un autre exemple, si vous essayez de prédire la variation en pourcentage, vous aurez besoin d'une colonne indiquant la variation en pourcentage par rapport à la période précédente. Heureusement, cela peut être facilement fait à l'aide de pandas.

    df["variation_pourcentage"] = df["Fermeture Ajustée"].pct_change()
    
    Date
    2021-01-21    0.013363
    2021-01-22   -0.004463
    2021-01-25    0.000538
    2021-01-26    0.009754
    2021-01-27   -0.010484
    Name: variation_pourcentage, dtype: float64

Quel signal parfait pour un modèle de régression !

# Résumé

Avant d'ajouter nos améliorations, le dataframe ne contenait que 5 colonnes, pas grand-chose pour un modèle de machine learning !

En fin de compte, après avoir ajouté des valeurs statistiques et nos propres signaux, nous avons atteint 135 fonctionnalités et colonnes dans notre dataframe !

Bien meilleur pour votre modèle !

Quelles sont vos réflexions sur ce processus ? Ai-je manqué quelque chose ? Commentez ci-dessous ! Voulez-vous lire plus d'articles de Justin ? Rendez-vous sur mon site web pour en savoir plus !
