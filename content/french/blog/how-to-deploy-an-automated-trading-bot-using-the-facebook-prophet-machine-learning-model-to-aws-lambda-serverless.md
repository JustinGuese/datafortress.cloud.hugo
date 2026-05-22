---
author: "Justin Guese"
bg_image: "/images/serverless-investing-bot-facebook-prophet-machine-learning.png"
categories: ["algorithmic-trading", "aws", "serverless", "machine-learning"]
date: 2022-05-23T22:00:00Z
description: "Comment déployer un bot de trading automatisé utilisant le modèle de Machine Learning Facebook Prophet sur AWS Lambda (serverless)"
image: "/images/serverless-investing-bot-facebook-prophet-machine-learning-1.png"
tags: ["cloud-computing", "machine-learning", "algorithmic-trading", "stock", "aws", "aws-lambda", "serverless", "facebook-prophet"]
title: "Comment déployer un bot de trading automatisé utilisant le modèle de Machine Learning Facebook Prophet sur AWS Lambda (serverless)"
type: "post"
---

J'ai divisé cet article en deux parties : le « Pourquoi l'ai-je fait » et le « Comment faire technique ». Si vous souhaitez ignorer la partie « Pourquoi », n'hésitez pas à passer directement à la partie technique.

**1. Fiabilité :** L'algorithme s'exécutera indépendamment des autres systèmes, mises à jour, ...

**2. Efficacité des performances :** Je peux exécuter plusieurs algorithmes sur un seul (petit) système, indépendamment les uns des autres.

**3. Économies de coûts :** AWS permet [3,2 millions de secondes de calcul](https://aws.amazon.com/lambda/?did=ft_card&trk=ft_card) par mois, ce qui me permet concrètement d'exécuter tous mes algorithmes gratuitement.

Je cherchais un moyen de m'assurer d'abord que mon bot d'investissement s'exécute à coup sûr, car une exécution ratée peut coûter cher si une transaction n'est pas annulée rapidement si elle part dans la mauvaise direction. De plus, je voulais éviter de laisser mon ordinateur allumé tout le temps et m'assurer que plusieurs algorithmes puissent s'exécuter les uns à côté des autres, sans influencer ou retarder leur exécution.

En outre, c'est une idée plaisante de faire tourner un algorithme d'investissement sans se soucier des mises à jour du système d'exploitation, des pannes matérielles, des coupures de courant, etc., ce qui est l'avantage général des technologies serverless.

À l'heure actuelle, je peux exécuter plusieurs variantes de l'algorithme pour tester des modifications et être sûr qu'il tournera. Autre chose intéressante ? AWS offre environ 1 million d'appels Lambda gratuits, ce qui me permet de faire fonctionner toute l'architecture dans le cadre de l'offre gratuite.

## L'algorithme d'investissement

Je vais expliquer l'algorithme plus en détail dans un autre article sur mon site web [www.datafortress.cloud](http://www.datafortress.cloud), mais ma configuration type d'algorithme d'investissement se compose de :

1. Tester l'algorithme en utilisant [Backtrader](https://www.backtrader.com/), un framework de backtesting open-source écrit en python.
2. Convertir l'algorithme réussi en un seul fichier python contenant une méthode run() qui renvoie les investissements effectués.
3. Transférer le fichier python vers AWS Lambda, où j'appelle la fonction run() avec la fonction lambda_handler d'AWS Lambda.

Dans cet exemple d'algorithme, je prends des décisions d'investissement selon que le prix actuel est au-dessus ou en dessous de la ligne de tendance prédite par le [modèle Prophet de Facebook](https://facebook.github.io/prophet/). J'ai [repris des idées de Sean Kelley](http://seangtkelley.me/blog/2018/08/15/algo-trading-pt2), qui a écrit une configuration Backtrader sur la manière d'utiliser Prophet avec Backtrader.

Mon univers d'actions dans cette configuration est calculé en choisissant les 20 meilleures actions de l'indice SPY500 qui ont réalisé le rendement le plus élevé au cours des X dernières étapes temporelles.

La source de données est Yahoo Finance, via la [bibliothèque gratuite yfinance](https://pypi.org/project/yfinance/), et comme courtier algorithmique de choix, j'ai sélectionné [Alpaca.markets](https://alpaca.markets/).

Dans ma configuration, l'algorithme s'exécutera une fois par jour à 15h ou toutes les 15 minutes pendant les heures de trading.

### Les problèmes de déploiement de Facebook Prophet sur AWS Lambda

AWS Lambda est livré avec quelques bibliothèques python préinstallées, mais comme beaucoup d'entre vous le savent peut-être, c'est par défaut assez limité (ce qui est raisonnable pour la promesse de Lambda). Pourtant, Lambda permet d'installer des packages privés, ce qui est assez facile pour les petits packages (voir la [documentation officielle](https://docs.aws.amazon.com/lambda/latest/dg/python-package.html)) mais devient un peu plus compliqué lorsqu'on traite des packages qui dépassent 250 Mo. Malheureusement, le modèle Prophet de Facebook dépasse cette limite, mais heureusement [Alexandr Matsenov a résolu ce problème en réduisant la taille du package](https://towardsdatascience.com/how-to-get-fbprophet-work-on-aws-lambda-c3a33a081aaf) et [Marc Metz a géré les problèmes de compilation pour le faire fonctionner sur AWS Lambda](https://github.com/marcmetz/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda).

Des bibliothèques non par défaut peuvent être ajoutées à AWS Lambda en utilisant des Layers, qui contiennent tous les packages nécessaires. Si un layer est importé, vous pouvez simplement importer les packages dans votre fonction python comme vous le feriez dans votre configuration locale.

## Comment faire (technique)

Enfin, laissez-moi vous expliquer comment exactement vous pouvez y parvenir. Voici un TLDR pour les impatients, ou la version plus détaillée ci-dessous.

**TLDR ;**

1. Vous aurez besoin d'un Lambda Layer, téléchargez le mien ([téléchargement](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip)) contenant Prophet, yfinance, … vers un bucket S3 (accès privé).
2. Sélectionnez AWS Lambda, créez une fonction, ajoutez un layer et collez l'URL de votre objet S3.
3. Collez votre lambda_function.py dans l'éditeur Lambda ([ou utilisez le mien](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py)).
4. Configurez vos variables d'environnement (optionnel).
5. Exécutez-le manuellement en cliquant sur « test » ou rendez-vous sur CloudWatch -> Rules -> Create Rule et configurez « Schedule Execution » pour l'exécuter à un intervalle de temps spécifié.

**Explication détaillée** :

### 1. Création d'un layer personnalisé pour AWS Lambda

Vous pouvez soit utiliser mon layer Lambda contenant Facebook Prophet, NumPy, pandas, [alpaca-trading-API](https://github.com/alpacahq/alpaca-trade-api-python), yfinance ([GitHub](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda)) soit compiler le vôtre en utilisant l'explication donnée par [Marc](https://medium.com/@marc.a.metz/docker-run-rm-it-v-pwd-var-task-lambci-lambda-build-python3-7-bash-c7d53f3b7eb2).

**Utiliser mon Layer Lambda**

1. Téléchargez le fichier zip depuis mon [repo Github](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip) contenant tous les packages ([Lien](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/raw/master/python.zip)).
2. Comme vous ne pouvez uploader directement des layers sur Lambda que jusqu'à une taille de 50 Mo, nous devrons d'abord uploader le fichier sur AWS S3.
3. Créez un bucket et placez-y le fichier zip téléchargé. L'accès peut rester privé et n'a PAS besoin d'être public ! Copiez l'URL de votre fichier (ex. [https://NOM_DU_BUCKET.s3.REGION.amazonaws.com/python.zip](https://NOM_DU_BUCKET.s3.REGION.amazonaws.com/python.zip)).
4. Connectez-vous à AWS et allez dans Lambda -> Layers ([Lien EU central](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/layers)).
5. Cliquez sur « Create layer », donnez-lui un nom correspondant, sélectionnez « Upload a file from Amazon S3 » et collez le code de l'étape 3. Comme Runtimes, sélectionnez Python 3.7. Cliquez sur créer.

**Compiler votre propre Layer Lambda**

Veuillez [suivre les instructions de Marc](https://medium.com/@marc.a.metz/docker-run-rm-it-v-pwd-var-task-lambci-lambda-build-python3-7-bash-c7d53f3b7eb2).

### 2. Configuration d'une fonction AWS Lambda

1. Ouvrez le tableau de bord des fonctions Lambda ([Lien EU central](https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions)) et cliquez sur « Create function ».
2. Laissez la case « Author from scratch » telle quelle et donnez-lui un nom approprié.
3. Dans « Runtime », sélectionnez Python 3.7, laissez le reste tel quel et cliquez sur « Create function ».
4. Dans l'aperçu de l'onglet « designer », vous verrez une représentation graphique de votre fonction Lambda. Cliquez sur la case « layers » en dessous et cliquez sur « Add a layer ». Si vous avez correctement configuré le layer, vous pourrez le sélectionner dans le dialogue suivant. Enfin, cliquez sur « Add ».
5. Dans l'onglet « designer », sélectionnez votre fonction Lambda. Si vous faites défiler vers le bas, vous verrez un extrait de code python par défaut dans un fichier appelé « lambda_function.py ». Si vous avez structuré votre code de la même manière que le mien ([Lien](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py)), vous pouvez exécuter votre fonction avec la fonction run(). Lorsqu'une fonction Lambda est appelée, elle exécute la fonction lambda_handler(event, context) à partir de laquelle vous pourriez par exemple appeler la fonction run(). Bien sûr, vous pouvez renommer tous les fichiers et fonctions, mais pour la simplicité de ce projet, je l'ai laissé tel quel.
6. N'hésitez pas à coller simplement [ma fonction](https://github.com/JustinGuese/How-To-Deploy-Facebook-Prophet-on-AWS-Lambda/blob/master/lambda_function.py) et à la tester.
7. Cliquer sur « Test » devrait aboutir à une exécution réussie, sinon les erreurs seront indiquées dans le dialogue.

### 3. Utilisation des variables d'environnement dans AWS Lambda

Vous ne devriez jamais laisser votre nom d'utilisateur et votre mot de passe en texte clair dans votre code, c'est pourquoi vous devriez toujours utiliser des variables d'environnement ! Heureusement, Lambda les utilise également, et elles peuvent être facilement appelées avec le package python os. Par exemple, dans mon script, j'appelle la variable utilisateur avec os.environ\['ALPACAUSER'\]. Les variables d'environnement peuvent être configurées dans l'écran principal de la fonction Lambda en faisant défiler vers le bas sous votre éditeur de code.

### 4. Déclencher des fonctions AWS Lambda à un intervalle de temps spécifié

Le concept de serverless et d'AWS Lambda repose sur l'idée qu'une fonction est exécutée lorsqu'un événement déclencheur se produit. Dans ma configuration, je voulais que la fonction soit appelée par exemple toutes les 15 minutes pendant les heures de trading, du lundi au vendredi. Heureusement, AWS offre un moyen de déclencher un événement sans avoir besoin de faire tourner un serveur, en utilisant le service CloudWatch.

1. Rendez-vous sur CloudWatch ([Lien EU central](https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1)).
2. Dans le panneau de gauche, sélectionnez « Events » puis « Rules ».
3. Cliquez sur « Create Rule », et sélectionnez « Schedule » au lieu de « Event pattern ». Ici, vous pouvez utiliser le dialogue simple « Fixed-rate », ou créer une expression cron. J'utilise [https://crontab.guru/](https://crontab.guru/) (gratuit) pour créer des expressions cron. Mon expression cron pour le cas d'utilisation mentionné ci-dessus est « 0/15 13-21 ? * MON-FRI * ».
4. Dans le panneau de droite, sélectionnez « Add Target » et sélectionnez votre fonction Lambda. Elle sera automatiquement ajoutée à Lambda.
5. Enfin, cliquez sur « Configure details », donnez-lui un nom, et cliquez sur « Create rule ».

### 5. (optionnel) Analyse des logs, recherche d'erreurs

Si vous êtes arrivé à cette partie, vous devriez avoir terminé ! Mais si vous voulez vérifier que tout a fonctionné, vous pouvez utiliser CloudWatch pour consulter les sorties des fonctions Lambda. Allez dans CloudWatch -> Logs -> Log groups ([Lien EU central](https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1#logsV2:log-groups)) et sélectionnez votre fonction Lambda. Dans cet aperçu, vous devriez pouvoir voir la sortie de vos fonctions.

Si vous avez aimé cet article, laissez un commentaire ou rendez-vous sur mon blog [www.datafortress.cloud](http://www.datafortress.cloud) pour me garder motivé 😊.
