# Doctrine V17 — Structure des features et introduction de Zod

## Intention

Le dossier `features/` doit devenir plus explicite, plus lisible et plus stable.

Le projet ne doit plus s’appuyer sur `lib/` comme emplacement par défaut pour des responsabilités hétérogènes.

## Structure cible

Le premier niveau de `features/` doit privilégier à terme :

- `features/admin/`
- `features/storefront/`
- `features/shared/` uniquement si un besoin transverse réel existe

V17 ne force pas le déplacement de toutes les features existantes si cela élargit trop le lot.

## Structure interne d’une feature

Une feature doit utiliser uniquement les sous-dossiers réellement utiles parmi :

- `components/`
- `actions/`
- `queries/`
- `schemas/`
- `mappers/`
- `types/`

Aucun sous-dossier ne doit être créé artificiellement.

## Règles de responsabilité

### `components/`

Contient l’UI propre à la feature.

Exemples :

- formulaires
- cards
- tableaux
- blocs de rendu propres à la feature

### `actions/`

Contient les mutations serveur ou server actions propres à la feature.

Exemples :

- création
- mise à jour
- suppression
- login
- soumission d’un formulaire admin

### `queries/`

Contient la lecture serveur et la récupération de données propres à la feature.

Exemples :

- chargement d’un détail
- listing
- options pour formulaires
- données préparées pour affichage

### `schemas/`

Contient les schémas `zod` de validation propres à la feature.

Exemples :

- validation de `FormData`
- parsing de query params
- validation de payloads serveur

### `mappers/`

Contient les transformations explicites entre source de données, structure de feature et UI.

Exemples :

- mapping DB -> row de table
- mapping entity -> valeurs de formulaire
- normalisation explicite d’un payload intermédiaire

### `types/`

Contient uniquement les types propres à la feature, quand ils ne relèvent pas déjà d’une entité plus stable ou d’un schéma.

## Règles sur `lib/`

`lib/` ne doit plus être utilisé comme dossier par défaut.

Quand un fichier situé dans `lib/` est modifié ou déplacé, il doit être reclassé dans le dossier explicite correspondant :

- lecture -> `queries/`
- validation -> `schemas/`
- transformation -> `mappers/`
- type local -> `types/`

Le recul de `lib/` doit se faire progressivement, feature par feature.

## Interdictions

- ne pas créer de `utils/` fourre-tout
- ne pas mélanger lecture et mutation dans le même fichier sans raison forte
- ne pas mettre la logique métier dans les composants UI
- ne pas introduire Prisma dans ce lot
- ne pas déplacer massivement des fichiers sans justification claire
- ne pas créer des schémas `zod` non branchés sans l’indiquer explicitement

## Règle sur les schémas préparatoires

Un schéma `zod` non encore branché dans une action ou un handler doit être clairement marqué comme préparatoire dans le fichier lui-même.

Le statut doit être explicite pour éviter toute ambiguïté entre :

- schéma réellement utilisé en production
- schéma préparatoire pour un lot suivant

## Introduction de Zod

`zod` est introduit dans V17 pour :

- la validation des formulaires admin
- la validation des payloads serveur
- la validation des entrées structurées

L’introduction doit rester progressive.

Le but n’est pas de convertir 100% du repo immédiatement, mais de poser un pattern propre, feature-local et durable.

## Priorités de migration

Priorité haute :

- `features/admin/auth`
- `features/admin/categories`
- `features/admin/products`
- `features/admin/blog`
- `features/admin/homepage`

Le storefront ne doit être touché que si cela reste simple et utile sans faire exploser le périmètre.

## Principe de compatibilité

Quand une validation `zod` remplace partiellement un validator existant de `entities/`, la migration doit rester prudente :

- conserver les normalisations métier encore utiles
- conserver les validators `entities/` tant que tous les cas complexes ne sont pas migrés
- éviter les regressions sur les flux admin existants
