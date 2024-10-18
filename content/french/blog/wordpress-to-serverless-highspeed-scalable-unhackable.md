---
author: Justin Guese
bg_image: images/blog/serverless-website.png
categories:
- sans serveur
date: '2022-06-17T11:10:07+06:00'
description: 'J''ai choisi de laisser WordPress derrière moi et de passer à des sites
  web statiques, sans serveur, ultra-rapides et incassables.

  '
image: images/blog/serverless-website.png
tags:
- Nuage
- Sites web
- sans serveur
title: 'Passer de WordPress à des sites web statiques, sans serveur, inattaquables
  et hyper-rapides.

  '
type: post

---
J'ai déjà développé des sites web par le passé, mais j'ai toujours eu du mal aux performances lentes de WordPress. S'il est chargé de plugins, il aura besoin de nombreuses ressources et cela peut être pénible si vous développez une idée sur un petit serveur.


De plus, la sécurité est également préoccupante, et étant donné qu'il s'agit d'un système utilisé par [33,6 % des sites web](https://en.wikipedia.org/wiki/WordPress), il est assez attrayant pour les pirates de trouver des failles et d'autres problèmes.
Mais encore une fois, comme il est très populaire, il y a presque toujours un plugin pour les problèmes que vous rencontrez, ce qui le rend facile à utiliser et à un excellent outil « tout-en-un ».




## Idée 1 : Amélioration du développement WordPress



L'une des premières choses que j'ai faites par le passé a été de développer WordPress localement (par exemple, [consultez cet article AWS](https://www.smashingmagazine.com/2018/04/wordpress-local-development-beginners-setup-deployment/)), puis de publier le résultat sur un serveur. Les vitesses de programmation et d'écriture ont considérablement augmenté, mais la partie téléchargement s'est avérée problématique, car les liens WordPress sont généralement « durcis » dans la base de données SQL qu'il utilise. Cela signifie que tous mes liens renvoyaient vers « https://www.datafotress.cloud » (mon ordinateur) au lieu du domaine cible. Il existe des moyens de résoudre ce problème, comme la réécriture de vos URL dans SQL ou l'utilisation de règles de réécriture htaccess pour renvoyer les anciennes URL vers les nouvelles, mais il était malgré tout très difficile de démarrer.




## Idée 2 : Développement en ligne avec fichiers multimédia transférés


Ce problème de réécriture d'URL m'a vite agacé, et le développement local est mauvais pour plusieurs développeurs. C'est pourquoi j'ai décidé de « repasser en ligne » et de travailler « avec le cloud ». L'architecture que j'ai suivie a été de déployer un serveur de développement accessible uniquement aux développeurs, et de télécharger des fichiers multimédia sur un stockage partagé (AWS S3) à partir duquel les utilisateurs finaux récupèrent les fichiers multimédia. Étant donné que les fichiers multimédia (images, vidéos, etc.) sont les parties les plus gourmandes en ressources de WordPress, la vitesse a augmenté de manière spectaculaire. De plus, il a été facile de configurer un CDN dessus, ce qui signifie fondamentalement que les fichiers multimédia sont déployés partout dans le monde avec une capacité illimitée (essentiellement sans serveur). Cela signifie qu'un utilisateur situé par exemple à Porto Rico n'a pas besoin d'accéder à mon serveur à Francfort, mais qu'il dispose d'une copie « locale » proche de lui. De plus, comme la partie « lourde » de WordPress a été « externalisée », seuls des serveurs « petits » étaient nécessaires pour gérer les requêtes PHP et les parties « back-office » de WordPress. N'hésitez pas à me poser plus de questions dans les commentaires ou par message direct, ou [consultez une approche similaire d'AWS](https://devops.com/hosting-scalable-wordpress-on-aws/).

![Architecture pour WordPress sur AWS](/images/blog/Webp.net-resizeimage.png)

Couplé à l'automatisation d'échelle, cela semblait être la configuration idéale pour WordPress, et elle s'est avérée excellente. MAIS…


Vous deviez toujours vérifier les mises à jour des plugins, la sécurité et la surveillance en général. Même si AWS contribue grandement à rendre cette architecture très résiliente et rapide, une forte demande opérationnelle est toujours nécessaire. De plus, exécuter un serveur de développement, une base de données, un équilibreur de charge, etc., séparément peut être très coûteux, surtout pour un site web qui n'a pas beaucoup d'utilisateurs.
Et qu'est-ce que Werner Vogels a dit lors de re:invent 2015 ?

> « Aucun serveur n'est plus facile à gérer que l'absence de serveur »
> 
> Werner Vogels lors de re:invent 2015


## Excursion : Une brève histoire du code web




WordPress est excellent pour les rédacteurs et les éditeurs, mais du point de vue d'un architecte de solutions, il ne l'est pas. Pourquoi ? Même si tout est cliquable, facile à gérer, etc., toutes les ressources et informations sont extraites d'une base de données en arrière-plan, même si elles sont récupérées 100 000 fois ce jour-là. Il existe des méthodes pour réduire la charge de requêtes sur les bases de données SQL, comme Redis et Memcached, mais pourquoi devrais-je « calculer » la même page web pour chaque utilisateur ? « À l'époque », les sites web se chargeaient en quelques secondes (sauf si quelqu'un était au téléphone) et étaient très petits - qu'est-ce qui a changé ? Avec les nouvelles exigences en matière de design, les sites web d'aujourd'hui regorgent d'effets et de conceptions gourmands en ressources informatiques. Même si c'est certainement une amélioration par rapport au style noir et blanc des années 90, les temps de chargement des sites web ont considérablement augmenté, surtout compte tenu du fait que le standard de connexion mondial est toujours le réseau mobile.


Pour rendre tous les effets, le code PHP est utilisé en arrière-plan, ce qui est du code exécuté sur le serveur lui-même. Cela signifie que chaque fois qu'un utilisateur se connecte à un site web, le serveur calcule le site web qu'il va afficher à l'utilisateur. La version des sites web des années 90 comportait uniquement du code HTML pur, qui sont essentiellement des instructions simples au navigateur sur la manière de gérer les choses. Par exemple, la balise <h1> indique au navigateur qu'il s'agit d'un titre, et <p> est un paragraphe. Aucun calcul (désolé pour la réduction de la complexité) n'est nécessaire.


De plus, Javascript et CSS empruntent une voie similaire : CSS décrit le design d'une manière similaire à HTML, et Javascript est exécuté non pas sur le serveur, mais sur le client. Cela signifie que le serveur ne calcule pas lui-même, mais « envoie des instructions » au navigateur du client (par exemple, votre téléphone).


Alors, pourquoi n'utilisons-nous que HTML, Javascript et CSS ? PHP nous permet de faire beaucoup de choses et permet de créer des frameworks de contenu comme WordPress pour faciliter notre travail. Mais la méthode efficace pour créer des sites web serait de les générer une fois, puis de les distribuer déjà rendus aux masses.




## Idée 4 : Retour aux sources




Dis-je que nous devons revenir aux pages HTML noir et blanc des années 90 ? Bien sûr que non, mais la combinaison de HTML et CSS peut produire d'excellents résultats, et Javascript devient de plus en plus capable de gérer des processus que seul PHP pouvait gérer auparavant. Et si des calculs sont nécessaires, de superbes possibilités sans serveur sont disponibles, comme AWS Lambda (consultez mon blog pour certaines applications de Lambda).


En revenant à la question principale, j'ai décidé d'écrire mon blog et tous les sites web futurs en HTML, CSS et JS pur, car je n'ai pas besoin de

1. **gérer un serveur** - Je peux le héberger presque gratuitement sur Github ou AWS S3
2. **me soucier des ressources importantes** - S3 et Github sont automatiquement dimensionnés, ce qui signifie que si des milliers de visiteurs accèdent à mon site web, mon serveur ne se bloquera pas
3. **payer beaucoup** - Comme je n'ai pas besoin de autant de calculs qu'avec WordPress, ce blog est totalement gratuit
4. **me soucier des problèmes de sécurité** - mon blog est fondamentalement inviolable


De plus, le site web est extrêmement rapide, avec un score Google Pagespeed de 100 %, ce qui a également une incidence importante sur le classement des pages, car Google privilégie les sites web rapides. La seule raison pour laquelle le score actuel est tombé à 90 % est que j'ai décidé d'inclure des outils CRM et de suivi sur mon blog. Quand est-ce que vous avez vu un site web gratuit obtenir un tel score ?


Dans l'ensemble, c'est formidable, mais est-ce que j'écris tout le code HTML moi-même ?





## Présentation : Générateurs de sites web statiques




Bien sûr que non, et heureusement, il existe d'excellents outils pour m'aider. Les générateurs de sites web statiques comme [Jekyll](https://jekyllrb.com/) ou [Hugo](https://gohugo.io/) m'aident beaucoup : il suffit de taper du texte en langage Markdown (essentiellement un simple fichier texte) et de convertir vos textes en HTML et un site web agréable. Le code est calculé une seule fois et peut être téléchargé sur un serveur, ou sur Github Pages et AWS S3 immédiatement pour être totalement sans serveur. [Comment ça marche ? Consultez mes études de cas sur mon blog pour une explication approfondie](/project/serverless-static-website/).





## Résumé




C'est formidable de ne plus avoir à me soucier de la disponibilité, de la mise à l'échelle et de la sécurité. Est-ce plus difficile que WordPress ? Cela dépend. Comme cette technologie est en plein essor, il faut repenser aux méthodes utilisées avec WordPress et d'autres solutions par le passé, mais il existe de nombreux outils excellents qui rendent les générateurs de sites web statiques similaires à l'environnement « connu » de WordPress, comme forestry.io par exemple. Comment ? [Consultez mon blog à l'adresse www.datafortress.cloud pour une explication approfondie](/project/serverless-static-website/).
Pour l'instant, j'aimerais savoir si vous avez déjà essayé le « sans serveur », ou quelles sont vos expériences avec WordPress. [Envoyez-moi un message ou écrivez un commentaire ci-dessous](/contact/).
