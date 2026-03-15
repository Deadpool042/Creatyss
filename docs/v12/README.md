# V12 — Foundation UI, theming et architecture réutilisable

## Objectif

La V12 pose le socle visuel et structurel du front Creatyss.

Cette version ne cherche pas à ajouter une nouvelle fonctionnalité métier. Elle vise à clarifier et stabiliser la manière de construire l’interface, afin de :

- rendre l’UI plus cohérente
- faciliter les futures évolutions visuelles
- éviter les duplications de patterns
- préparer une base réutilisable pour un autre projet e-commerce
- conserver une séparation stricte entre thème, UI générique et logique métier

La V12 est donc une version de **foundation UI**.

## Intention

Creatyss n’est pas pensé comme une simple démo visuelle. Le projet doit rester :

- maintenable
- lisible
- dockerisé localement
- typé strictement
- modulaire
- sobre
- déployable ensuite sur un VPS OVH

Dans cette logique, le travail de theming ne doit pas être traité comme une succession de classes Tailwind ajoutées écran par écran.

L’objectif est de construire un système simple, stable et réutilisable, avec une hiérarchie claire entre :

- primitives UI
- composants de thème
- implémentation métier
- logique de données

## Ce que couvre V12

La V12 couvre :

- la doctrine UI du projet
- la place de `global.css` et des tokens de thème
- la séparation entre `components/ui`, `components/theme`, `features/*`, `entities/*` et une future cible `registry/*`
- les premiers composants de thème réutilisables
- une migration progressive écran par écran

La V12 ne couvre pas :

- une refonte métier du catalogue
- une refonte SQL
- une réécriture massive de l’admin ou du storefront d’un seul bloc
- un packaging registry complet dès le départ
- une abstraction enterprise inutile

## Principe directeur

La stratégie V12 est la suivante :

1. documenter la cible
2. poser les tokens et règles visuelles
3. créer quelques composants de thème réutilisables
4. migrer progressivement des écrans réels
5. extraire plus tard, si nécessaire, une logique inspirée du registry shadcn

Autrement dit :

- **d’abord un bon thème local au projet**
- **ensuite seulement une éventuelle extraction réutilisable**

## Couches visées

### `components/ui`

Contient les primitives UI génériques, neutres, peu ou pas brandées.

Exemples :

- `button`
- `card`
- `input`
- `select`
- `table`
- `dropdown-menu`
- `alert-dialog`

Ces composants restent proches de la logique shadcn/ui :

- réutilisables
- simples
- sémantiques
- peu couplés au métier

### `components/theme`

Contient les patterns visuels premium réutilisables.

Exemples :

- auth shell
- premium surface
- section heading
- admin section card
- patterns storefront réutilisables

Ces composants consomment les tokens du thème et composent les primitives UI, mais ne portent pas la logique métier du projet.

### `features/*`

Contient l’implémentation fonctionnelle du projet.

Exemples :

- admin products
- admin homepage
- admin orders
- store catalog
- checkout

Les features utilisent :

- les primitives de `components/ui`
- les patterns de `components/theme`
- la logique métier dans `entities/*`
- l’accès aux données via `db/*`

### `entities/*`

Contient la logique métier pure.

Exemples :

- règles produit
- publishability
- transitions de commande
- validations métier

### `registry/*`

`registry/*` est une cible future, pas un prérequis immédiat.

Ce dossier pourra accueillir plus tard les composants et patterns suffisamment stables pour être réutilisés dans un autre projet.

La V12 ne cherche pas à industrialiser prématurément cette couche.

## Rôle de `global.css`

`global.css` est la source de vérité du thème global.

Son rôle est de porter :

- les tokens de couleur
- les tokens de surface
- les tokens de border
- les tokens de foreground
- les rayons
- éventuellement certaines variables brand spécifiques

Les composants ne doivent pas dépendre d’une palette hardcodée écran par écran.

Ils doivent s’appuyer autant que possible sur des classes sémantiques comme :

- `bg-background`
- `text-foreground`
- `bg-card`
- `text-card-foreground`
- `border-border`
- `bg-primary`
- `text-primary-foreground`
- `text-muted-foreground`

Le thème vit donc dans les tokens, pas dans une accumulation de classes spécifiques à chaque page.

## Méthode de migration

La migration V12 doit être progressive.

On évite :

- les gros refactors visuels non maîtrisés
- la réécriture simultanée de tout le front
- les abstractions génériques trop tôt

On privilégie :

- un écran pilote
- de petits incréments sûrs
- un typecheck propre
- des tests e2e relancés après chaque lot concerné

## Premier écran pilote

Le premier écran pilote recommandé pour V12 est la page de connexion admin.

Pourquoi :

- surface limitée
- logique déjà simple et isolée
- très bon terrain pour tester un premier `AuthShell`
- bon point d’entrée pour définir le ton premium du thème

## Lots V12 prévus

### V12-1 — Documentation d’architecture UI

- README V12
- doctrine UI
- plan de migration

### V12-2 — Tokens et base theme

- clarification de `global.css`
- pose ou nettoyage des tokens visuels
- cadrage des conventions de classes sémantiques

### V12-3 — Premier écran pilote : login admin

- création des premiers composants de thème
- migration de `app/admin/login/page.tsx`
- conservation stricte de la logique serveur existante

### V12-4 — Premiers composants de thème réutilisables

- surfaces
- headings
- shell auth
- premières briques admin premium

### V12-5 — Migration progressive d’écrans

- homepage admin
- produits admin
- storefront catalogue
- autres zones pertinentes ensuite

## Règle de décision

Quand un nouveau composant est créé, la question à se poser est :

**est-il générique, thématique, ou métier ?**

- générique → `components/ui`
- thématique / premium / réutilisable → `components/theme`
- spécifique à un workflow métier → `features/*`
- logique métier pure → `entities/*`

## Résultat attendu

À la fin de la V12, Creatyss doit disposer :

- d’une base visuelle plus cohérente
- d’un meilleur découplage entre thème et métier
- d’une structure plus claire pour les futurs écrans
- d’un socle suffisamment propre pour être réutilisé partiellement dans un autre projet e-commerce

La V12 est donc une étape de structuration, pas une simple retouche cosmétique.
