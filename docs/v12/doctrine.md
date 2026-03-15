# Doctrine UI V12

## Rôle de cette doctrine

Cette doctrine définit la manière de construire l’interface Creatyss à partir de la V12.

Elle sert à éviter :

- les décisions visuelles prises au cas par cas
- la duplication de patterns d’interface
- le mélange entre logique métier, thème et composants génériques
- l’accumulation de classes spécifiques directement dans les pages
- les abstractions prématurées sans usage réel

L’objectif est de fournir un cadre simple, stable et applicable immédiatement.

## Principe général

L’interface doit être construite par couches.

Chaque couche a un rôle clair :

- les **tokens** définissent l’identité visuelle globale
- les **primitives UI** fournissent les briques de base
- les **composants de thème** construisent les patterns visuels réutilisables
- les **features** assemblent ces briques pour répondre à un besoin fonctionnel
- les **entities** portent la logique métier pure

Cette hiérarchie doit rester lisible dans l’arborescence comme dans le code.

## Couche 1 — Tokens et thème global

### Source de vérité

Le thème global est défini dans `global.css` et, si nécessaire plus tard, dans des fichiers de styles dédiés comme `styles/tokens.css` ou `styles/theme.css`.

Cette couche porte notamment :

- les couleurs sémantiques
- les surfaces
- les bordures
- les foregrounds
- les rayons
- les variables de marque utiles à plusieurs écrans

### Règle impérative

Les composants ne doivent pas hardcoder leur palette écran par écran quand un token sémantique existe déjà.

On privilégie :

- `bg-background`
- `text-foreground`
- `bg-card`
- `text-card-foreground`
- `border-border`
- `bg-primary`
- `text-primary-foreground`
- `text-muted-foreground`

On évite autant que possible :

- `bg-stone-100`
- `text-zinc-900`
- `border-stone-200`
- des variantes visuelles répétées et recopiées d’un écran à l’autre

### Conséquence

Le thème doit vivre d’abord dans les tokens.

Les composants consomment le thème ; ils ne doivent pas redéfinir localement une identité visuelle concurrente.

## Couche 2 — `components/ui`

### Rôle

`components/ui` contient les primitives UI génériques.

Elles doivent rester :

- neutres
- sobres
- réutilisables
- peu couplées au métier
- cohérentes avec l’approche shadcn/ui

### Exemples

- `button`
- `card`
- `input`
- `field`
- `select`
- `table`
- `dropdown-menu`
- `alert-dialog`
- `notice`

### Règles

Une primitive UI :

- ne connaît pas le domaine Creatyss
- ne connaît pas la logique métier d’un écran
- ne porte pas de wording métier spécifique
- expose une base fiable, simple et stylable

### Ce qu’une primitive UI n’est pas

Ce n’est pas :

- un block premium de page
- un shell auth
- une carte catalogue spécifique
- une section admin métier

Ces éléments appartiennent à une autre couche.

## Couche 3 — `components/theme`

### Rôle

`components/theme` contient les patterns visuels premium réutilisables.

Ces composants composent les primitives UI et consomment les tokens du thème.

Ils n’embarquent pas la logique métier d’une feature.

### Exemples attendus

- `auth-shell`
- `premium-surface`
- `section-heading`
- `section-eyebrow`
- `admin-section-card`
- certains patterns storefront réutilisables

### Règles

Un composant de thème :

- exprime une grammaire visuelle
- peut être réutilisé dans plusieurs écrans
- peut être réutilisé dans plusieurs projets à terme
- ne dépend pas d’un repository
- ne dépend pas d’une règle métier produit ou commande
- ne décide pas de la logique applicative

### Test simple

Si un composant peut être repris dans un autre e-commerce en changeant seulement le thème et le contenu, il a de fortes chances d’appartenir à `components/theme`.

## Couche 4 — `features/*`

### Rôle

`features/*` contient l’implémentation fonctionnelle réelle des écrans et workflows.

Une feature assemble :

- des primitives UI
- des composants de thème
- des helpers locaux
- des actions serveur
- des composants spécifiques à un workflow

### Exemples

- `features/admin/products`
- `features/admin/orders`
- `features/admin/auth`
- `features/store/catalog`
- `features/store/checkout`

### Règles

Une feature peut être spécifique à Creatyss.

Elle a le droit de connaître :

- les cas d’usage métier
- le wording d’un écran
- le workflow fonctionnel
- les composants spécifiques à une zone donnée

Mais elle ne doit pas :

- re-définir les règles métier fondamentales qui appartiennent à `entities/*`
- porter l’accès SQL directement dans les composants
- court-circuiter le thème avec un style divergent non justifié

## Couche 5 — `entities/*`

### Rôle

`entities/*` contient la logique métier pure.

### Exemples

- publishability d’un produit
- règles de transition de commande
- validations métier de blog
- règles de présentation métier stables

### Règles

Les entities :

- ne dépendent pas de l’UI
- ne dépendent pas de React
- ne dépendent pas d’un écran admin ou storefront
- portent les règles du domaine

## `registry/*` comme cible future

### Positionnement

La V12 n’impose pas de construire immédiatement un registry complet.

En revanche, elle reconnaît qu’une partie des composants de thème et patterns UI pourra être extraite plus tard dans une logique inspirée du registry shadcn.

### Conséquence pratique

On construit d’abord un thème local propre dans le projet.

On n’extrait vers `registry/*` que ce qui est :

- stable
- réutilisé
- suffisamment découplé du métier Creatyss

## Règles de décision

### Quand créer un composant dans `components/ui`

Quand le besoin est une brique générique de base.

Question à se poser :

> Est-ce que ce composant pourrait exister dans n’importe quel produit sans connaissance métier ?

Si oui, `components/ui` est probablement le bon endroit.

### Quand créer un composant dans `components/theme`

Quand le besoin est visuel, réutilisable et plus riche qu’une primitive.

Question à se poser :

> Est-ce que ce composant exprime un pattern de marque ou de composition réutilisable ?

Si oui, `components/theme` est probablement le bon endroit.

### Quand créer un composant dans une feature

Quand le besoin est directement lié à un workflow ou un écran métier.

Question à se poser :

> Est-ce que ce composant n’a de sens que dans cette feature précise ?

Si oui, il doit rester dans la feature.

## Règles de style

### 1. Sobriété

L’UI doit rester sobre.

On évite :

- les effets excessifs
- les gradients inutiles partout
- les composants trop démonstratifs
- les artifices visuels qui brouillent la lisibilité

### 2. Hiérarchie forte

Chaque écran doit rendre immédiatement lisibles :

- son niveau de priorité
- sa zone principale
- son action principale
- son état éventuel

### 3. Cohérence

Un même pattern doit garder :

- la même structure
- la même hiérarchie
- le même ton visuel
- les mêmes conventions d’espacement et de surface

### 4. Réutilisation raisonnable

On ne duplique pas un pattern si un composant existant couvre déjà le besoin avec un ajustement mineur.

Mais on ne crée pas non plus une abstraction générique si un pattern n’a encore qu’un seul usage réel.

## Règles de migration V12

### Migration progressive uniquement

Aucune refonte massive ne doit être menée sans incréments sûrs.

Chaque migration doit :

- rester limitée en périmètre
- conserver le comportement fonctionnel
- maintenir un typecheck propre
- préserver les tests existants ou les adapter proprement

### Écran pilote

Le login admin est le premier écran pilote.

Il sert à valider :

- l’usage des tokens
- le premier shell premium
- la séparation entre logique serveur et UI
- la bonne articulation entre `components/theme` et `features/admin/auth`

### Ordre recommandé

1. documentation
2. tokens
3. login
4. premiers composants de thème
5. migration d’autres écrans

## Anti-patterns à éviter

### 1. Mettre toute la direction visuelle dans une page

Une page ne doit pas devenir un bloc de classes Tailwind sans structure réutilisable.

### 2. Mélanger thème et métier

Un composant qui gère un workflow produit ne doit pas devenir en même temps la source d’un pattern visuel global.

### 3. Généraliser trop tôt

Ne pas créer un composant “ultra générique” si le besoin réel n’est pas encore stabilisé.

### 4. Hardcoder les couleurs partout

Le thème doit venir des tokens, pas d’une répétition de classes couleur dans chaque fichier.

### 5. Construire un faux registry avant maturité

Le registry est une conséquence possible d’un bon système local, pas un point de départ obligatoire.

## Doctrine résumée

La V12 repose sur une idée simple :

- le thème est défini par les tokens
- les primitives UI restent neutres
- les composants de thème portent les patterns premium réutilisables
- les features implémentent les cas d’usage
- les entities portent le métier
- la réutilisation future se prépare par la clarté de la structure, pas par une abstraction prématurée
