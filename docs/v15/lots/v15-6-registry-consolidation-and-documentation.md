# V15-6 — Registry consolidation and documentation

## Objectif du lot

Le lot V15-6 clôt la première phase de la V15 consacrée à l’extraction registry et à la fondation d’un socle multi-projets.

Après :

- la stratégie d’extraction
- la première extraction admin
- la validation de la couche thème
- la validation du workflow MCP
- l’éventuelle extraction sélective de quelques patterns publics

ce lot a pour rôle de consolider l’ensemble, de documenter clairement ce qui a été mis en place, et de rendre la base réellement exploitable pour un prochain projet.

L’objectif n’est plus d’ajouter de nouveaux patterns “par principe”. L’objectif est de transformer les décisions prises pendant V15 en un système lisible, maintenable et réutilisable.

## Intention

V15-6 est un lot de consolidation.

Il doit éviter deux dérives :

- terminer V15 avec un registry techniquement présent mais difficile à comprendre
- laisser plusieurs conventions implicites, dispersées entre les lots, sans documentation claire pour un futur projet

Ce lot sert à rendre explicite ce que la V15 a réellement produit :

- ce qui est maintenant réutilisable
- ce qui reste local au projet
- ce qui dépend du thème
- comment utiliser concrètement le registry et le MCP

## Résultat attendu

À l’issue de V15-6, le projet doit idéalement disposer :

- d’un registry consolidé
- d’une documentation claire des conventions retenues
- d’une liste explicite des items extraits
- d’une séparation lisible entre registry, thème et projet local
- d’une conclusion claire sur la maturité de Creatyss comme base réutilisable multi-projets

## Ce que couvre ce lot

V15-6 couvre :

- la consolidation du registry après les premiers lots d’extraction
- la documentation des conventions de structure et de nommage
- la documentation des frontières entre registry, thème et projet local
- la documentation du workflow MCP retenu
- la clarification des patterns extraits, conservés ou repoussés
- la formulation explicite de la sortie de V15

## Ce que ce lot ne couvre pas

V15-6 ne couvre pas :

- une nouvelle vague d’extraction opportuniste
- une refonte de l’admin ou du storefront
- une nouvelle passe de nettoyage CSS indépendante
- des changements métier ou serveur
- une industrialisation prématurée au-delà de ce qui a réellement été validé

## Problème à résoudre

Un registry peut exister techniquement tout en restant difficile à utiliser.

De la même manière, une stratégie de theming peut être bien pensée sans être réellement lisible pour quelqu’un qui rejoint le projet plus tard.

Le lot doit donc répondre à cette question :

> si je repars demain sur un nouveau projet à partir de Creatyss, est-ce que je comprends clairement ce que je peux réutiliser, comment le réutiliser, comment le thème varie, et ce qui doit rester spécifique au projet ?

## Axes de consolidation attendus

### 1. Consolidation du registry

Le registry doit être relu comme un système cohérent, pas comme une accumulation de fichiers.

Il faut clarifier :

- les namespaces
- la structure des items
- les conventions de nommage
- les dépendances implicites à éviter
- les items réellement prêts à la réutilisation

### 2. Consolidation du thème

Le thème doit être documenté comme une vraie couche d’adaptation.

Il faut clarifier :

- les tokens principaux à modifier d’un projet à l’autre
- les tokens qui doivent rester stables
- la relation entre thème et composants extraits
- la place des theme packs dans le futur workflow multi-projets

### 3. Consolidation du périmètre local

Tout ce qui n’est pas dans le registry ne doit pas être perçu comme un oubli.

Il faut documenter explicitement :

- ce qui reste volontairement local
- pourquoi cela reste local
- quelles zones du storefront ne doivent pas être extraites trop tôt

### 4. Consolidation du workflow MCP

Le MCP doit être documenté comme un outil de travail avec :

- ses cas d’usage pertinents
- ses limites
- son ordre d’usage logique dans un nouveau projet

## Questions auxquelles le lot doit répondre

### 1. Le registry produit est-il lisible pour quelqu’un d’extérieur au chantier ?

Les conventions doivent être suffisamment claires pour qu’un nouveau projet ne dépende pas de la mémoire du chantier V15.

### 2. La frontière registry / thème / projet local est-elle explicite ?

C’est un point clé de réutilisabilité.

### 3. Les items extraits sont-ils documentés selon leur rôle réel ?

Un item ne doit pas exister “nu” dans le registry sans explication sur son usage attendu.

### 4. Le workflow MCP est-il intégré dans la documentation finale ?

Le MCP ne doit pas être une note annexe. Il doit être positionné correctement dans le mode d’emploi du système.

### 5. La V15 peut-elle être considérée comme terminée ?

Le lot doit conclure clairement sur la maturité atteinte.

## Principes de décision

### 1. Documenter ce qui a été réellement validé

Pas de promesse excessive. Le lot doit refléter honnêtement le niveau réel de maturité atteint.

### 2. Rendre explicite le résiduel local

Ce qui reste dans le projet local doit être assumé comme tel, pas laissé dans une zone floue.

### 3. Préparer le prochain projet, pas seulement clôturer celui-ci

La documentation finale doit être utile pour un futur usage réel, pas seulement pour archiver le chantier.

### 4. Préférer la clarté à la complétude artificielle

Un système plus petit mais bien expliqué est meilleur qu’une pseudo-base générique mal maîtrisée.

## Ce que le lot doit éviter

### 1. Réouvrir des extractions non stabilisées

V15-6 n’est pas un prétexte pour ajouter encore quelques items au dernier moment.

### 2. Surdocumenter sans hiérarchie

La documentation doit rester opérationnelle, pas encyclopédique.

### 3. Présenter le registry comme plus mature qu’il ne l’est

Si la base est solide mais encore limitée, il faut le dire clairement.

### 4. Laisser des conventions implicites

Tout ce qui est nécessaire pour comprendre le système doit être formulé explicitement.

## Livrables attendus

Le lot doit idéalement produire :

- une documentation claire du registry
- une documentation claire du rôle du thème
- une documentation claire du périmètre local restant
- une synthèse des items extraits
- une synthèse du workflow MCP retenu
- une conclusion claire sur la sortie de V15

## Validation attendue

### Validation documentaire

Un intervenant extérieur doit pouvoir comprendre rapidement :

- ce qui est réutilisable
- ce qui ne l’est pas encore
- comment un nouveau projet doit utiliser la base
- comment le thème doit varier
- comment le MCP s’insère dans le workflow

### Validation projet

À la fin de V15-6, le projet doit pouvoir être considéré comme une base multi-projets crédible, même si elle reste volontairement limitée à un premier périmètre stable.

## Suite logique

Une fois V15-6 terminé, la suite logique ne sera plus forcément une nouvelle vague d’extraction.

La suite pourra être, selon la priorité :

- l’utilisation réelle de cette base sur un autre projet
- le retour aux sujets métier du projet courant
- l’enrichissement du registry uniquement quand un besoin réel de réutilisation apparaîtra

## Résumé

V15-6 est le lot de consolidation qui transforme V15 en base réellement exploitable.

Il sert à rendre explicite :

- ce qui a été extrait
- ce qui dépend du thème
- ce qui reste local
- comment le registry et le MCP doivent être utilisés

C’est ce lot qui permet de sortir de la V15 avec un système lisible, réutilisable et honnêtement documenté, plutôt qu’avec une extraction partielle difficile à transmettre.
