# V15-5 — Selective public registry extraction

## Objectif du lot

Le lot V15-5 prend le relais après la stratégie registry, la première extraction admin, la fondation des thèmes et la validation du workflow MCP.

Son rôle n’est pas d’extraire le storefront complet, ni de figer la couche publique dans une structure commune à tous les projets. Son rôle est plus précis : identifier quelques patterns publics réellement neutres, suffisamment stables et assez peu dépendants du storytelling d’un client pour mériter de sortir en registry.

L’idée directrice est simple :

> le public reste majoritairement spécifique au projet, mais certains blocs transverses sobres peuvent devenir réutilisables.

## Intention

V15-5 est un lot d’extraction sélective et disciplinée.

Contrairement à l’admin, le public n’a pas le même niveau naturel de mutualisation.

Ce lot doit donc éviter deux erreurs :

- extraire trop de blocs publics trop tôt
- ne rien extraire du tout alors que certains patterns neutres ont déjà prouvé leur stabilité

Le bon niveau est intermédiaire :

- peu d’items
- très ciblés
- très sobres
- peu couplés à la narration Creatyss
- fortement pilotés par les tokens

## Résultat attendu

À l’issue de V15-5, le projet doit idéalement disposer :

- d’un petit lot de patterns publics réellement réutilisables
- d’une frontière plus claire entre public générique et storefront spécifique client
- d’items publics qui restent neutres et compatibles avec plusieurs thèmes
- d’une justification explicite des patterns publics laissés dans le projet local
- d’un registry qui s’enrichit sans devenir un doublon du storefront Creatyss

## Ce que couvre ce lot

V15-5 couvre :

- l’audit des patterns publics encore candidats à l’extraction
- la qualification de ces patterns selon leur niveau réel de neutralité
- l’extraction d’un très petit nombre d’items publics stables
- l’ajustement éventuel des patterns sélectionnés pour les rendre plus réutilisables
- la documentation de ce qui sort et de ce qui reste local

## Ce que ce lot ne couvre pas

V15-5 ne couvre pas :

- l’extraction du storefront complet
- la généralisation des pages publiques entières
- une refonte du front marketing
- la réécriture du catalogue public
- des changements métier
- des abstractions massives ou spéculatives

## Candidats probables

Les meilleurs candidats publics sont probablement des patterns de surface ou de structure légère, par exemple :

- une section publique sobre
- un panneau ou wrapper premium neutre
- un empty state générique
- un bloc de contenu simple
- un shell ou wrapper public réutilisable

La liste réelle doit être confirmée par l’état du repo.

Le lot doit se méfier de tout ce qui dépend fortement :

- du storytelling de la home
- du catalogue Creatyss
- de la narration éditoriale
- d’une composition de page trop spécifique

## Pourquoi ce lot doit rester petit

La couche publique est, par nature, plus variable que l’admin.

Ce qui change d’un projet à l’autre peut inclure :

- la structure de la home
- les priorités marketing
- les sections mises en avant
- le ton éditorial
- le style des hero
- la densité visuelle
- les besoins du catalogue

Cela signifie qu’un pattern public ne doit sortir en registry que s’il a une vraie neutralité structurelle.

Sinon, il doit rester dans le projet local.

## Questions auxquelles le lot doit répondre

### 1. Le pattern public est-il réellement neutre ?

Un bloc n’est pas réutilisable simplement parce qu’il est joli ou déjà présent à plusieurs endroits.

Il doit être suffisamment générique pour servir dans plusieurs projets sans transporter la personnalité narrative de Creatyss.

### 2. Le pattern dépend-il principalement du thème ?

Un bon candidat public est souvent un pattern dont l’identité dépend surtout des tokens et du thème, pas d’un contenu ou d’une structure marketing propre à Creatyss.

### 3. Le pattern a-t-il une API simple ?

Un item public trop configurable ou trop couplé à un contexte local n’est pas un bon premier candidat à l’extraction.

### 4. Le pattern a-t-il plusieurs usages réels ou une vraie réutilisabilité plausible ?

La réutilisation ne doit pas être purement théorique.

### 5. Le pattern reste-t-il utile après extraction ?

L’extraction ne doit pas produire un item abstrait sans usage concret.

## Critères de sélection recommandés

Un pattern public est un bon candidat s’il :

- reste visuellement sobre
- a une structure générique
- dépend principalement des tokens
- n’est pas fortement couplé à un contenu précis
- peut être utilisé dans plusieurs projets sans réécriture lourde
- n’embarque pas une logique métier spécifique
- garde une API simple

À l’inverse, il doit rester local s’il :

- dépend du storytelling Creatyss
- mélange structure et contenu marketing spécifique
- impose une composition de page trop contextualisée
- suppose un catalogue ou une narration donnée
- n’a pas de vraie réutilisabilité hors du projet actuel

## Doctrine d’extraction publique

### 1. Extraire des patterns, pas des pages

Le bon niveau de réutilisation publique est rarement la page complète.

Le bon niveau est plutôt :

- une surface
- un wrapper
- un panel
- une section simple
- un empty state
- un bloc de contenu neutre

### 2. Le thème doit porter la personnalité

Un item public extrait doit pouvoir changer de caractère principalement via le thème.

### 3. Le storefront du client reste local

Ce qui relève de la narration ou de la stratégie de marque du client doit rester dans le projet.

### 4. Mieux vaut peu d’items publics, mais bons

La discipline est plus importante que le volume.

## Ce que le lot doit éviter

### 1. Extraire une home déguisée en bloc réutilisable

Un bloc très lié à Creatyss ne doit pas sortir en registry sous un faux nom neutre.

### 2. Confondre surface neutre et marketing spécifique

Une section premium réutilisable n’est pas un storytelling de marque.

### 3. Créer des composants publics trop configurables

Un item trop flexible devient souvent difficile à réutiliser proprement.

### 4. Dégrader la lisibilité du projet local

L’extraction doit clarifier, pas rendre le storefront actuel plus opaque.

## Livrables attendus

Le lot doit idéalement produire :

- un audit clair des candidats publics
- un très petit nombre d’items publics extraits
- une justification explicite des items sortis
- une justification explicite des patterns publics laissés locaux
- une validation que les items publics extraits restent compatibles avec plusieurs thèmes

## Validation attendue

### Validation de réutilisabilité

Le lot doit permettre de répondre à la question :

> est-ce que ce pattern public peut vraiment être réinstallé dans un autre projet sans embarquer l’identité Creatyss par défaut ?

### Validation de lisibilité

Le projet local doit rester compréhensible après extraction.

### Validation de theming

Les items publics extraits doivent réagir proprement aux thèmes sans nécessiter de hardcoding visuel supplémentaire.

## Suite logique

Une fois V15-5 terminé, la suite logique est :

### V15-6 — Registry consolidation and documentation

Ce lot devra consolider le registry, documenter les conventions retenues et clôturer proprement la première phase d’extraction multi-projets.

## Résumé

V15-5 est un lot d’extraction publique volontairement sélectif.

Il sert à sortir seulement quelques patterns publics réellement neutres et réutilisables, tout en assumant que la majeure partie du storefront doit rester spécifique au projet et au client.
