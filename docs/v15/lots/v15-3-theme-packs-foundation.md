# V15-3 — Theme packs foundation

## Objectif du lot

Le lot V15-3 prend le relais après la stratégie registry et la première extraction admin.

Son rôle est de valider que la structure UI stabilisée du projet peut réellement supporter plusieurs identités visuelles sans réécriture de ses patterns principaux.

Autrement dit, ce lot ne cherche pas à créer un simple “dark mode bis”, ni à multiplier des variables sans usage. Il cherche à démontrer que l’identité d’un projet réutilisant Creatyss doit pouvoir varier principalement par le thème, tout en conservant la même structure d’interface, en particulier côté admin.

## Intention

V15-3 est un lot de fondation visuelle.

Il doit transformer une intuition déjà présente dans le projet en règle explicite :

> d’un projet à l’autre, la structure admin reste largement stable ; ce qui varie principalement, c’est le thème.

Cela implique de préparer une base capable de supporter au moins deux identités visuelles cohérentes sur le même socle :

- une identité Creatyss
- une identité alternative de test, représentant un autre client fictif

Le lot ne vise pas à refaire les composants. Il vise à vérifier que les composants extraits et les patterns encore locaux restent suffisamment pilotés par les tokens pour absorber ce changement d’identité.

## Résultat attendu

À l’issue de V15-3, le projet doit idéalement disposer :

- d’une formalisation plus claire de la couche thème
- d’au moins deux packs de thème cohérents
- d’une validation que l’admin extrait reste stable malgré le changement d’identité
- d’une meilleure séparation entre structure réutilisable et variables de marque
- d’une doctrine claire sur ce qui doit dépendre du thème et ce qui ne doit pas en dépendre

## Ce que couvre ce lot

V15-3 couvre :

- la formalisation des packs de thème initiaux
- la clarification des tokens réellement structurants pour l’identité visuelle
- l’identification de ce qui relève du thème et de ce qui relève de la structure
- la validation qu’un même socle peut porter plusieurs identités visuelles
- l’ajustement éventuel de certains tokens ou aliases si leur rôle est encore ambigu
- la documentation des conventions de theming retenues

## Ce que ce lot ne couvre pas

V15-3 ne couvre pas :

- une refonte des composants admin ou storefront
- un redesign fonctionnel du produit
- l’extraction massive de nouvelles surfaces publiques
- des changements métier ou serveur
- une multiplication incontrôlée de variantes de thème

## Problème à résoudre

Aujourd’hui, le projet possède déjà des tokens, des aliases sémantiques, des couleurs de sidebar, de brand, de surfaces et des variables de rayon.

Mais cela ne suffit pas à prouver qu’il existe de vrais **theme packs** exploitables pour plusieurs projets.

Le lot doit donc répondre à cette question :

> si l’on réutilise demain la même base admin sur un autre e-commerce, quels changements doivent suffire pour obtenir une autre personnalité visuelle crédible, sans retoucher la structure ?

## Hypothèse de travail

Le thème doit piloter principalement :

- la palette sémantique
- la palette brand
- les contrastes de surfaces
- les tons sidebar
- la densité visuelle de certains fonds
- les radius
- certains traitements de surfaces publiques

Le thème ne doit pas piloter :

- les règles métier
- l’organisation logique des écrans
- les APIs des composants admin
- le découpage du domaine
- la composition du storefront spécifique au client

## Structure attendue des thèmes

Le lot doit au minimum permettre de raisonner autour de deux thèmes :

### 1. Thème Creatyss

Le thème de référence du projet actuel.

Il doit devenir la référence documentée de départ.

### 2. Thème alternatif de test

Un thème fictif mais cohérent, servant à démontrer que :

- les tokens sont bien choisis
- les composants n’embarquent pas trop de hardcoding visuel
- le socle admin reste crédible avec une autre identité

Ce second thème n’a pas besoin d’être un thème produit final. Il sert de validation structurelle.

## Questions auxquelles le lot doit répondre

### 1. Quels tokens portent réellement l’identité ?

Tous les tokens n’ont pas la même importance. Le lot doit distinguer :

- les tokens fondamentaux
- les aliases sémantiques utiles
- les variables de marque
- les variables purement techniques

### 2. Les composants stabilisés dépendent-ils vraiment des tokens ?

Si un composant reste visuellement figé malgré un changement de thème, cela révèle une dépendance locale mal placée.

### 3. Qu’est-ce qui doit rester invariant entre thèmes ?

La structure, les patterns admin et l’organisation des écrans ne doivent pas varier arbitrairement d’un thème à l’autre.

### 4. Qu’est-ce qui peut varier sans casser la cohérence ?

Le lot doit identifier les dimensions de variation acceptables :

- couleurs
- surfaces
- brand
- sidebar
- radius
- intensité des contrastes
- éventuellement certains fonds neutres

### 5. Le thème reste-t-il lisible pour un futur projet ?

Un thème doit pouvoir être repris, adapté et compris sans reconstituer toute l’histoire du projet.

## Principes de décision

### 1. Le thème pilote l’identité, pas la structure

Le thème ne doit pas devenir un mécanisme de contournement pour des composants mal conçus.

### 2. Deux thèmes suffisent pour valider le principe

V15-3 ne doit pas devenir un atelier infini de skins.

Le but est de prouver le système, pas d’accumuler les variantes.

### 3. Les tokens doivent rester sémantiques

On privilégie des intentions comme :

- `--background`
- `--foreground`
- `--muted`
- `--brand`
- `--sidebar-*`

plutôt qu’une logique trop directement décorative ou trop liée à un projet unique.

### 4. Le thème doit rester compatible avec le registry

Les patterns extraits en V15-2 ne doivent pas figer une identité visuelle locale incompatible avec la réutilisation.

## Ce que le lot doit éviter

### 1. Mélanger theme pack et redesign

Un nouveau thème ne doit pas imposer de reconfigurer la structure de l’interface.

### 2. Ajouter beaucoup de variables sans usage clair

Chaque variable importante doit servir une vraie dimension de variation.

### 3. Créer un faux deuxième thème trop proche du premier

Le thème alternatif doit être suffisamment différent pour tester la robustesse du système.

### 4. Casser la sobriété du projet

Le thème peut varier, mais l’interface doit rester premium, lisible et sobre.

## Livrables attendus

Le lot doit idéalement produire :

- une définition plus claire des packs de thème
- un thème Creatyss documenté comme référence
- un thème alternatif de test
- une liste des tokens ou familles de tokens réellement structurants
- une validation que l’admin et les patterns extraits restent cohérents entre thèmes

## Validation attendue

### Validation visuelle

Le lot doit permettre de vérifier qu’avec deux thèmes distincts :

- l’admin reste crédible et cohérent
- les surfaces restent lisibles
- les contrastes restent utilisables
- la hiérarchie visuelle reste stable
- le changement d’identité est visible sans casser l’interface

### Validation structurelle

Le lot doit permettre de confirmer que le thème varie sans imposer de réécrire les composants structurants.

### Validation documentaire

La documentation produite doit permettre à un futur projet de comprendre :

- quels tokens changer
- lesquels laisser intacts
- comment créer un nouveau thème sans casser la base

## Suite logique

Une fois V15-3 terminé, la suite logique est :

### V15-4 — MCP workflow validation

Ce lot devra valider que le registry et les patterns extraits peuvent être réellement parcourus, trouvés et réinstallés efficacement via le MCP shadcn.

## Résumé

V15-3 est le lot qui transforme le thème en vraie couche d’adaptation multi-projets.

Il sert à démontrer qu’un même socle Creatyss peut porter plusieurs identités visuelles crédibles, sans remettre en cause la structure admin ni les patterns stabilisés extraits vers le registry.
