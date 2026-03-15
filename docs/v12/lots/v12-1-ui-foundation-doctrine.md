# V12-1 — UI foundation doctrine

## Objectif du lot

Le lot V12-1 ouvre la V12.

Son rôle est de fixer la doctrine d’architecture UI avant toute migration visuelle importante.

Ce lot ne vise pas à modifier le comportement fonctionnel de l’application. Il sert à clarifier la cible et à réduire les décisions implicites pour les prochains lots.

## Résultat attendu

À l’issue de V12-1, le projet doit disposer d’une base documentaire claire sur :

- le rôle de `global.css` dans le theming
- la séparation entre primitives UI, composants de thème et implémentation métier
- la place de `components/ui`, `components/theme`, `features/*`, `entities/*` et `registry/*`
- la méthode de migration progressive écran par écran
- l’ordre recommandé des prochains lots V12

## Ce que couvre ce lot

V12-1 couvre uniquement la documentation de fondation UI.

Cela inclut :

- `docs/v12/README.md`
- `docs/v12/doctrine.md`
- `docs/v12/migration-plan.md`
- le présent lot `docs/v12/lots/v12-1-ui-foundation-doctrine.md`

## Ce que ce lot ne couvre pas

V12-1 ne couvre pas :

- la modification de `global.css`
- la création de composants de thème
- la migration du login admin
- la migration d’un écran admin ou storefront
- la création d’un registry exploitable
- des refactors métier

## Motivation

Le projet Creatyss évolue vers un socle e-commerce plus réutilisable.

Pour que cette évolution reste propre, il faut documenter explicitement la hiérarchie visée entre :

- thème global
- composants UI génériques
- patterns visuels premium
- implémentation métier
- logique métier pure

Sans cette doctrine, la migration risque de dériver vers :

- des classes Tailwind ajoutées localement écran par écran
- des composants de thème mélangés à des features métier
- des abstractions prématurées
- une extraction “registry” trop tôt et mal ciblée

## Décisions prises dans V12-1

### 1. `global.css` est la source de vérité du thème

Le thème global vit d’abord dans les tokens.

Les composants doivent s’appuyer prioritairement sur des classes sémantiques comme :

- `bg-background`
- `text-foreground`
- `bg-card`
- `text-card-foreground`
- `border-border`
- `bg-primary`
- `text-primary-foreground`
- `text-muted-foreground`

### 2. `components/ui` reste la couche de primitives

Les primitives UI restent :

- génériques
- peu brandées
- réutilisables
- peu couplées au métier

### 3. `components/theme` devient la couche des patterns premium réutilisables

Cette couche accueillera progressivement :

- auth shell
- premium surface
- section heading
- admin section card
- autres patterns réutilisables

### 4. `features/*` reste la couche d’implémentation métier

Les workflows, écrans métier et composants spécifiques à une fonctionnalité restent dans les features.

### 5. `entities/*` reste la couche de logique métier pure

Aucune logique métier ne doit migrer vers `components/theme`.

### 6. `registry/*` est une cible future seulement

La logique inspirée du registry shadcn est reconnue comme une direction utile, mais elle n’est pas industrialisée dans V12-1.

## Structure documentaire produite

Ce lot s’appuie sur les documents suivants :

### `docs/v12/README.md`

Document de cadrage global de la V12.

Il pose :

- l’objectif
- l’intention
- les couches visées
- les lots futurs
- le rôle général de la migration

### `docs/v12/doctrine.md`

Document de doctrine UI.

Il formalise :

- la hiérarchie des couches
- le rôle des tokens
- la place des primitives UI
- la place des composants de thème
- les règles de décision
- les anti-patterns à éviter

### `docs/v12/migration-plan.md`

Document opérationnel de migration.

Il formalise :

- l’ordre des lots
- la méthode incrémentale
- les validations minimales
- la politique de refactor
- la vision cible à moyen terme

## Règles pour les lots suivants

Les prochains lots V12 devront respecter les règles suivantes :

- pas de gros refactor global non séquencé
- un périmètre limité par lot
- typecheck propre systématique
- validation manuelle des écrans concernés
- adaptation des tests si la structure ou les labels changent légitimement
- pas d’extraction prématurée vers `registry/*`

## Premier écran pilote retenu

Le premier écran pilote recommandé après V12-1 est le login admin.

Raisons :

- surface fonctionnelle limitée
- logique serveur déjà bien isolée
- bon terrain pour tester un premier `AuthShell`
- excellente zone pour définir la tonalité premium du thème

## Lots suivants prévus

### V12-2 — Theme tokens and base theme

But : stabiliser les tokens et la base de thème.

### V12-3 — Admin login as first pilot screen

But : appliquer la nouvelle couche thème sur un écran simple et isolé.

### V12-4 — First reusable theme components

But : créer quelques patterns visuels premium réellement réutilisables.

### V12-5 — Progressive screen migration

But : diffuser progressivement la nouvelle architecture UI sur l’admin puis le storefront.

## Validation du lot

Ce lot étant documentaire, la validation attendue est :

- cohérence entre les documents
- absence de contradiction avec la structure actuelle du repo
- doctrine assez concrète pour guider les prochains lots
- périmètre V12 explicite et non ambigu

## Résumé

V12-1 ne change pas encore l’interface.

Il fixe le cadre qui permettra de faire évoluer Creatyss vers :

- une UI plus cohérente
- un thème mieux structuré
- une séparation plus nette entre visuel et métier
- un socle plus facilement réutilisable dans un futur autre projet e-commerce
