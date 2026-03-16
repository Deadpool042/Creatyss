# V15-4 — MCP workflow validation

## Objectif du lot

Le lot V15-4 prend le relais après la stratégie registry, la première extraction admin et la fondation des theme packs.

Son rôle est de valider que le MCP shadcn n’est pas seulement compatible “sur le papier” avec la direction prise par le projet, mais qu’il s’intègre réellement dans un workflow utile, concret et reproductible.

Autrement dit, ce lot ne sert pas à admirer un registry bien rangé. Il sert à répondre à une question beaucoup plus pratique :

> est-ce qu’un assistant peut réellement naviguer dans le registry Creatyss, retrouver les bons patterns, les installer correctement et accélérer le travail sur un autre projet sans introduire de confusion ?

## Intention

V15-4 est un lot de validation opérationnelle.

Après les lots précédents, le projet doit disposer :

- d’une stratégie d’extraction claire
- d’un premier noyau admin potentiellement extractible ou déjà extrait
- d’une couche thème plus explicitement pensée comme variable entre projets

Le bon test suivant n’est donc plus documentaire. Le bon test est workflow-oriented.

Le lot doit vérifier que le MCP shadcn apporte une vraie valeur dans un usage réel, par exemple pour :

- retrouver un item registry
- comprendre ce qu’il installe
- le réinstaller proprement
- accélérer un nouveau projet
- éviter de recoder des patterns déjà stabilisés

## Résultat attendu

À l’issue de V15-4, le projet doit idéalement disposer :

- d’un workflow MCP validé en pratique
- d’une meilleure compréhension de ce que le MCP aide réellement à faire
- d’une liste claire des usages pertinents du MCP dans le contexte Creatyss
- d’une identification claire de ses limites
- d’une base de travail pour réutiliser plus vite les patterns extraits dans de futurs projets

## Ce que couvre ce lot

V15-4 couvre :

- la validation concrète du workflow MCP shadcn
- la vérification de la découvrabilité des items extraits
- la vérification de la réinstallation des patterns pertinents
- la vérification que le thème et les patterns extraits cohabitent correctement dans ce workflow
- la documentation des usages réellement utiles du MCP pour Creatyss
- la documentation des limites ou frictions observées

## Ce que ce lot ne couvre pas

V15-4 ne couvre pas :

- l’extraction de nouveaux composants par défaut
- une refonte du registry
- une nouvelle couche d’abstraction sur le MCP
- un redesign du thème
- des changements métier ou serveur
- une industrialisation prématurée d’un workflow encore mal compris

## Problème à résoudre

Le MCP shadcn peut être très utile, mais seulement si son usage est réellement intégré au mode de travail du projet.

Dans le contexte Creatyss, il ne s’agit pas de valider le MCP de manière générique.
Il s’agit de valider :

- ce qu’il aide vraiment à faire dans un projet réutilisable
- ce qu’il simplifie
- ce qu’il ne simplifie pas
- à quel moment il devient plus efficace qu’un copier-coller local ou qu’une duplication manuelle

## Hypothèse de travail

Le MCP doit être particulièrement utile pour :

- naviguer dans un registry maison
- retrouver les patterns admin stabilisés
- installer un item réutilisable dans un autre projet
- interroger le registry sans connaître tous les noms exacts à l’avance
- réduire le coût mental de la réutilisation

Le MCP ne doit pas être vu comme :

- un moteur de refonte automatique
- un remplacement de la réflexion d’architecture
- un système qui rend inutile la qualité du registry lui-même
- une solution miracle aux problèmes de découpage ou de thème

## Questions auxquelles le lot doit répondre

### 1. Le registry est-il vraiment navigable via MCP ?

Un futur utilisateur ou assistant doit pouvoir comprendre rapidement ce qui existe, ce qui est installable et à quoi chaque item sert.

### 2. La recherche d’items est-elle suffisamment naturelle ?

Le MCP doit permettre de retrouver les bons patterns à partir d’un besoin réel, pas uniquement à partir d’un nom exact déjà connu.

### 3. L’installation d’un item extrait est-elle claire ?

Le lot doit vérifier si l’installation produit quelque chose de propre, compréhensible et réellement réutilisable.

### 4. Le thème reste-t-il la couche de variation principale ?

Le workflow MCP ne doit pas réintroduire des patterns trop figés visuellement ou trop couplés à Creatyss.

### 5. Quelles sont les limites concrètes du workflow ?

Le lot doit documenter ce que le MCP ne résout pas bien ou ce qui reste plus simple à traiter autrement.

## Cas d’usage à valider

Le lot doit idéalement valider quelques cas d’usage concrets, par exemple :

### Cas 1 — Retrouver un pattern admin à partir d’un besoin métier

Exemple :

- “je veux un shell de page admin avec titre, description et actions”
- “je veux une section de formulaire admin premium”
- “je veux un composant de notice cohérent avec l’admin existant”

### Cas 2 — Réinstaller un item extrait dans un autre contexte

Exemple :

- réinstaller un shell admin dans un projet de test
- vérifier que les dépendances sont claires
- vérifier que l’intégration reste lisible

### Cas 3 — Comprendre la frontière entre thème et structure

Exemple :

- installer un item extrait
- changer de thème
- vérifier que la structure reste stable et que l’identité varie comme prévu

### Cas 4 — Vérifier les limites de découverte

Exemple :

- besoin exprimé de manière floue
- observation de la capacité du MCP à retrouver le bon item ou non

## Principes de décision

### 1. Le MCP doit être jugé sur son utilité concrète

La question n’est pas “est-ce que ça marche ?” au sens technique minimal.

La vraie question est :

> est-ce que cela améliore réellement la réutilisation et la vitesse de travail ?

### 2. Le workflow doit rester lisible

Si l’usage du MCP devient plus compliqué que l’installation manuelle ou la lecture directe du code, il faut le documenter honnêtement.

### 3. Le registry reste la base

Un bon MCP ne compense pas un mauvais découpage d’items. Le lot doit rester lucide sur cette dépendance.

### 4. L’objectif est la réutilisation, pas la démonstration

Le MCP ne doit pas être utilisé comme vitrine technologique, mais comme outil de travail.

## Ce que le lot doit éviter

### 1. Valider le MCP de manière abstraite

Le lot doit s’appuyer sur des cas d’usage réels, pas sur une conclusion vague du type “ça a l’air pratique”.

### 2. Ignorer les frictions

Si la recherche, l’installation ou la compréhension des items pose problème, cela doit être documenté clairement.

### 3. Faire porter au MCP des responsabilités qui relèvent du thème ou du registry

Le MCP aide à utiliser un système. Il ne remplace pas la qualité du système.

### 4. Confondre gain potentiel et gain réel

Le lot doit distinguer ce qui semble prometteur de ce qui est effectivement utile dans le workflow Creatyss.

## Livrables attendus

Le lot doit idéalement produire :

- une validation concrète du workflow MCP
- quelques cas d’usage réellement testés
- une synthèse des points forts constatés
- une synthèse des limites constatées
- une conclusion claire sur la place du MCP dans le workflow futur du projet

## Validation attendue

### Validation pratique

Le lot doit permettre de répondre honnêtement à la question :

> si je repars sur un autre projet demain, est-ce que le MCP me fait réellement gagner du temps pour retrouver et réinstaller mes patterns stabilisés ?

### Validation documentaire

La documentation produite doit permettre à un futur intervenant de comprendre :

- quand utiliser le MCP
- pour quels types de patterns
- avec quelles limites
- dans quel ordre l’utiliser par rapport au thème et au registry

## Suite logique

Une fois V15-4 terminé, la suite logique est :

### V15-5 — Selective public registry extraction

Ce lot pourra décider quels patterns publics très neutres méritent à leur tour de sortir en registry, maintenant que la stratégie, le thème et le workflow MCP auront été validés.

## Résumé

V15-4 est le lot qui transforme le MCP shadcn en outil réellement validé, ou non, dans le workflow Creatyss.

Il sert à vérifier que le registry extrait n’est pas seulement bien structuré, mais réellement découvrable, installable et utile dans une logique multi-projets.
