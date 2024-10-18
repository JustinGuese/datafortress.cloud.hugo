---
author: Justin Guese
bg_image: /images/serverless-investing-bot-facebook-prophet-machine-learning.png
categories:
- Trading algorithmique
- aws
- sans serveur
- apprentissage automatique
date: '2022-05-23T22:00:00+00:00'
description: Comment déployer un robot de trading automatisé utilisant le modèle d'apprentissage
  automatique Facebook Prophet sur AWS Lambda (serverless)
image: /images/serverless-investing-bot-facebook-prophet-machine-learning-1.png
tags:
- informatique en nuage
- apprentissage automatique
- Trading algorithmique
- Actions
- aws
- AWS Lambda
- Sans serveur
- facebook-prophet
title: Comment déployer un robot de trading automatisé utilisant le modèle d'apprentissage
  automatique Facebook Prophet sur AWS Lambda (serverless)
type: post

---
J'ai divisé ce billet en deux parties : « Pourquoi l'ai-je fait » et « Comment faire (technique) ». Si vous souhaitez sauter la partie « Pourquoi », n'hésitez pas à passer directement à la partie technique.


**1. Fiabilité :** L'algorithme s'exécutera indépendamment des autres systèmes, des mises à jour, etc.

**2. Efficacité de la performance :** Je peux exécuter plusieurs algorithmes sur un seul (petit) système, indépendamment les uns des autres.

**3. Économies de coûts :** AWS permet [3,2 millions de secondes de calcul](https://aws.amazon.com/lambda/?did=ft_card&trk=ft_card) par mois, me permettant de faire tourner tous mes algorithmes gratuitement.

J'ai cherché un moyen de m'assurer que mon bot d'investissement s'exécute correctement, car une exécution ratée peut coûter cher si une transaction n'est pas annulée rapidement si elle se déroule dans la mauvaise direction. De plus, je voulais éviter de laisser mon ordinateur fonctionner en permanence et m'assurer que plusieurs algorithmes pouvaient s'exécuter simultanément sans s'influencer ni retarder leur exécution.

De plus, c'est une bonne idée d'avoir un algorithme d'investissement qui fonctionne sans se soucier des mises à jour du système d'exploitation, des pannes matérielles et des coupures de courant, etc., ce qui est l'avantage général des technologies serverless.

Actuellement, je peux exécuter plusieurs variantes de l'algorithme pour tester des modifications et être sûr qu'il fonctionnera. Autre point positif ? AWS propose environ 1 million d'appels Lambda gratuits, ce qui me permet de faire fonctionner toute l'architecture dans sa version gratuite.

## L'algorithme d'investissement

J'expliquerai l'algorithme plus en détail dans un autre billet sur mon site web [www.datafortress.cloud](http://www.datafortress.cloud), mais la configuration typique de mon algorithme d'investissement consiste en :

1. Tester l'algorithme à l'aide de [Backtrader](https://www.backtrader.com/), un framework de backtesting open source écrit en Python.
2. Convertir l'algorithme réussi en un seul fichier Python contenant une méthode `run()` qui retourne les investissements effectués.
3. Transférer le fichier Python vers AWS Lambda, où j'appelle la fonction `run()` avec la fonction `lambda_handler` d'AWS Lambda.

Dans cet algorithme d'exemple, je prends des décisions d'investissement en fonction du fait que le prix actuel se trouve au-dessus ou au-dessous de la ligne de tendance prédite par le modèle [Prophet de Facebook](https://facebook.github.io/prophet/). J'ai puisé des idées chez [Sean Kelley](http://seangtkelley.me/blog/2018/08/15/algo-trading-pt2), qui a écrit une configuration Backtrader pour utiliser Prophet avec Backtrader.

Mon univers d'actions dans cette configuration est calculé en sélectionnant les 20 actions parmi l'indice SPY500 ayant réalisé le meilleur rendement au cours des X derniers pas de temps.

La source de données est Yahoo Finance, en utilisant la bibliothèque [yfinance gratuite](https://pypi.org/project/yfinance/), et, en tant que courtier algorithmique de choix, j'ai opté pour [Alpaca.markets](https://alpaca.markets/).

Dans ma configuration, l'algorithme s'exécutera une fois par jour à 15 h 00 ou toutes les 15 minutes pendant les heures de bourse.

### Les problèmes de déploiement de Facebook Prophet sur AWS Lambda

AWS Lambda est fourni avec certaines bibliothèques Python préinstallées, mais, comme beaucoup d'entre vous le savent, celles-ci sont par défaut assez limitées (ce qui est raisonnable pour la promesse de Lambda). Néanmoins, Lambda permet l'installation de packages privés, ce qui est assez facile pour les petits packages (voir la [documentation officielle](https://docs.aws.amazon.com/lambda/latest/dg/python-package.html)), mais devient un peu plus compliqué si l'on travaille avec des packages dépassant 250 Mo. Malheureusement, le modèle Prophet de Facebook dépasse cette limite, mais heureusement, [Alexandr Matsenov a résolu ce problème en réduisant la taille du package](https://towardsdatascience.com/how-to-get-fbprophet-work-on-aws-lambda-c3a33a081aaf) et [Marc Metz a géré les problèmes de compilation pour le faire fonctionner sur AWS Lambda](https://github.com/marcmetz/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda).

Les bibliothèques autres que celles par défaut peuvent être ajoutées à AWS Lambda à l'aide de couches, qui contiennent tous les packages nécessaires. Si une couche est importée, vous pouvez simplement importer les packages dans votre fonction Python comme vous le feriez dans votre configuration locale.

## Comment faire (technique)

Enfin, laissez-moi vous expliquer comment réaliser cela. Consultez ce TLDR pour les plus impatients, ou la version plus détaillée ci-dessous.

**TLDR ;**

1. Vous aurez besoin d'une couche Lambda, téléchargez la mienne ([téléchargement](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip)) contenant Prophet, yfinance, etc., sur un bucket S3 (accès privé).
2. Sélectionnez AWS Lambda, créez une fonction, ajoutez une couche et collez l'URL de votre objet S3.
3. Collez votre `lambda_function.py` dans l'éditeur Lambda ([ou utilisez la mienne](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py)).
4. Configurez vos variables d'environnement (facultatif).
5. Exécutez-la manuellement en cliquant sur « Tester » ou accédez à CloudWatch -> Règles -> Créer une règle et configurez « Planifier l'exécution » pour l'exécuter à intervalles réguliers.

**Explication détaillée :**

### 1. Création d'une couche personnalisée pour AWS Lambda

Vous pouvez soit utiliser ma couche Lambda contenant Facebook Prophet, NumPy, pandas, [alpaca-trading-API](https://github.com/alpacahq/alpaca-trade-api-python), yfinance ([GitHub](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda)) ou compiler la vôtre en suivant les explications de [Marc](https://medium.com/@marc.a.metz/docker-run-rm-it-v-pwd-var-task-lambci-lambda-build-python3-7-bash-c7d53f3b7eb2).

**Utilisation de ma couche Lambda**

1. Téléchargez le fichier zip de mon [référentiel GitHub](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip) contenant tous les packages ([Lien](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip)).
2. Comme vous ne pouvez charger les couches directement dans Lambda que jusqu'à 50 Mo, nous devons d'abord télécharger le fichier sur AWS S3.
3. Créez un bucket et placez le fichier zip téléchargé à l'intérieur. L'accès peut rester privé et n'a PAS besoin d'être public ! Copiez l'URL de votre fichier (par exemple, [https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip](https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip "https://BUCKETNAME.s3.REGION.amazonaws.com/python.zip")).
4. Connectez-vous à AWS et accédez à Lambda -> Couches ([Lien pour l'Europe centrale](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/layers)).
5. Cliquez sur « Créer une couche », donnez-lui un nom correspondant et sélectionnez « Charger un fichier à partir d'Amazon S3 », puis collez le code de l'étape 3. En tant que runtime, sélectionnez Python 3.7. Cliquez sur Créer.

**Compilation de votre propre couche Lambda**

Veuillez [suivre les instructions de Marc](https://medium.com/@marc.a.metz/docker-run-rm-it-v-pwd-var-task-lambci-lambda-build-python3-7-bash-c7d53f3b7eb2).

### 2. Configuration d'une fonction AWS Lambda

1. Ouvrez le tableau de bord des fonctions Lambda ([lien pour l'Europe centrale](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions)) et cliquez sur « Créer une fonction ».
2. Laissez la case « Créer à partir de zéro » cochée et donnez-lui un nom approprié.
3. Dans « Runtime », sélectionnez Python 3.7, laissez le reste tel quel et cliquez sur « Créer la fonction ».
4. Dans la vue d'ensemble de l'onglet « Conception », vous verrez une représentation graphique de votre fonction Lambda. Cliquez sur la zone « Couches » située en dessous et cliquez sur « Ajouter une couche ». Si vous avez correctement configuré la couche, vous pourrez la sélectionner dans le dialogue suivant. Enfin, cliquez sur « Ajouter ».
5. Dans l'onglet "Conception", sélectionnez votre fonction Lambda. Si vous faites défiler vers le bas, vous verrez un extrait de code Python par défaut dans un fichier appelé "lambda_function.py". Si vous avez structuré votre code de la même manière que le mien ([Lien](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py)), vous pouvez exécuter votre fonction avec la fonction `run()`. Si une fonction Lambda est appelée, elle exécutera la fonction `lambda_handler(event, context)` à partir de laquelle vous pouvez par exemple appeler la fonction `run()`. Bien sûr, vous pouvez renommer tous les fichiers et fonctions, mais pour la simplicité de ce projet, je l'ai laissé tel quel.
6. N'hésitez pas à coller [ma fonction](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py) et à la tester.
7. Cliquer sur « Tester » devrait déboucher sur une exécution réussie, sinon il indiquera les erreurs dans le dialogue.

### 3. Utilisation des variables d'environnement dans AWS Lambda

Vous ne devriez jamais laisser vos identifiants et mots de passe en clair dans votre code, c'est pourquoi vous devez toujours utiliser des variables d'environnement ! Heureusement, Lambda les utilise également et elles peuvent être appelées facilement avec le package Python `os`. Par exemple, dans mon script, j'appelle la variable d'utilisateur avec `os.environ['ALPACAUSER']`. Les variables d'environnement peuvent être configurées dans l'écran principal de la fonction Lambda, en faisant défiler vers le bas sous l'éditeur de code.

### 4. Déclencher des fonctions AWS Lambda à intervalle de temps spécifique

Le concept de serverless et d'AWS Lambda repose sur l'idée qu'une fonction est exécutée lorsqu'un événement de déclenchement se produit. Dans ma configuration, je voulais que la fonction soit appelée toutes les 15 minutes pendant les heures de bourse, du lundi au vendredi. Heureusement, AWS propose un moyen de déclencher un événement sans avoir besoin d'exécuter un serveur, en utilisant le service CloudWatch.

1. Rendez-vous sur CloudWatch ([lien pour l'Europe centrale](https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1)).
2. Dans le panneau de gauche, sélectionnez « Événements » et « Règles ».
3. Cliquez sur « Créer une règle » et sélectionnez « Horaires » au lieu de « Modèle d'événement ». Vous pouvez ici utiliser le dialogue simple « Intervalle fixe » ou créer une expression cron. J'utilise [https://crontab.guru/](https://crontab.guru/) (gratuit) pour créer des expressions cron. Mon expression cron pour le cas d'utilisation ci-dessus est « 0/15 13-21 ? * L-V * ».
4. Dans le panneau de droite, sélectionnez « Ajouter une cible » et sélectionnez votre fonction Lambda. Elle sera automatiquement ajoutée à Lambda.
5. Enfin, cliquez sur « Configurer les détails », donnez-lui un nom et cliquez sur « Créer la règle ».

### 5. (facultatif) Analyse des journaux, recherche des erreurs

Si vous avez atteint cette partie, vous devriez être prêt ! Mais si vous souhaitez vérifier si tout fonctionne, vous pouvez utiliser CloudWatch pour consulter les sorties des fonctions Lambda. Rendez-vous sur CloudWatch -> Logs -> Groupes de journaux ([lien pour l'Europe centrale](https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1#logsV2:log-groups)) et sélectionnez votre fonction Lambda. Dans cette vue d'ensemble, vous devriez pouvoir voir la sortie de vos fonctions.

Si vous avez aimé ce billet, laissez un commentaire ou visitez mon blog [www.datafortress.cloud](http://www.datafortress.cloud) pour me motiver 😊.
