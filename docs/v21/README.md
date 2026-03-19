# V21 — Modularisation interne de `db/`

## Résumé

V21 ouvre la phase de modularisation interne de la couche `db/` après la stabilisation Prisma de V19 et la doctrine de structure posée par V20.

L'objectif n'est pas de changer l'API publique de `db/`. L'objectif est de réduire la taille des gros repositories, de sortir les blocs internes lisibles et réutilisables, et de garder les fichiers publics comme façades stables.

À la date de cette documentation :

- V21-1 a produit l'audit de cadrage de `db/repositories/`
- V21-2A a été implémenté sur `db/repositories/catalog/**`
- aucun autre lot V21 n'a encore été implémenté

Cette documentation ne décrit donc pas V21 complet comme un état déjà atteint. Elle documente :

- la cible de travail retenue pour V21
- le statut réel des lots
- le contenu effectivement livré par V21-2A

## Objectif global réel de V21

V21 vise à rendre `db/` plus modulaire sans changer le comportement métier, les contrats publics ni les chemins publics déjà consommés par `app/` et `features/`.

Concrètement, V21 cherche à :

- réduire la taille des mega-files de `db/repositories/`
- introduire des sous-dossiers internes locaux au domaine
- garder `*.repository.ts` comme points d'entrée publics
- conserver `*.types.ts` comme façades de contrats publics
- extraire les lectures Prisma canoniques dans `queries/`
- extraire les helpers batch et reconstruction mémoire dans `helpers/`
- éviter tout refactor transversal hors périmètre du lot traité

## Découpage des lots V21

Découpage de travail retenu à ce stade :

- `V21-1` — cadrage et audit concret de `db/repositories/`
- `V21-2A` — `catalog` : extraction du socle interne sûr
- `V21-2B` — `catalog` : finalisation des extractions restantes
- `V21-3` — `order`
- `V21-4` — `products`
- `V21-5` — petits domaines restants

## Statut actuel de V21

### `V21-1`

Statut : réalisé.

Résultat :

- identification des gros fichiers prioritaires
- définition d'une structure cible locale par domaine
- séquençage par lots compatibles avec les chemins publics existants

### `V21-2A`

Statut : réalisé.

Résultat :

- `db/repositories/catalog/catalog.repository.ts` est resté la façade publique du domaine
- `db/repositories/catalog/catalog.types.ts` est resté la façade publique des contrats
- les contrats publics du catalogue ont été déplacés dans `db/repositories/catalog/types/outputs.ts`
- les helpers internes d'image primaire et d'image représentative de catégorie ont été extraits dans `helpers/`
- les queries simples homepage, blog et recent products ont été extraites dans `queries/`
- `listPublishedProducts` et `getPublishedProductBySlug` sont restés dans `catalog.repository.ts`

Documentation de référence pour ce lot :

- [Lot V21-2A — catalog socle interne](./lots/v21-2a-catalog-socle-interne.md)
- [Architecture interne actuelle de `catalog`](./architecture/catalog-internal-structure.md)
- [Décisions V21-2A](./decisions/v21-2a-decisions.md)

### `V21-2B`

Statut : non réalisé.

### `V21-3`

Statut : non réalisé.

### `V21-4`

Statut : non réalisé.

### `V21-5`

Statut : non réalisé.

## Focus explicite sur V21-2A

V21-2A n'a pas cherché à “finir” `catalog`.

Le lot a traité uniquement les extractions les plus stables et les moins risquées :

- façade de types
- helper d'image primaire
- helper de reconstruction batch des catégories mises en avant
- queries simples homepage / blog / recent products

Le lot n'a pas traité les zones les plus lourdes du domaine :

- `listPublishedProducts`
- `getPublishedProductBySlug`
- `catalog.mappers.ts`

Ce découpage est volontaire. Il a permis de réduire la taille du repository public sans toucher au cœur le plus dense du domaine.

## Ce qui reste hors périmètre après V21-2A

Après V21-2A, les points suivants restent hors périmètre ou non traités :

- internalisation de `listPublishedProducts`
- internalisation de `getPublishedProductBySlug`
- refactor de `catalog.mappers.ts`
- suppression du ré-export public de types depuis `catalog.repository.ts`
- migration du consumer [features/homepage/types.ts](/Users/laurent/Desktop/CREATYSS/features/homepage/types.ts)
- modularisation de `order`
- modularisation de `products`
- modularisation des petits domaines plats

## Rôle de cette documentation

`docs/v21/**` n'est pas une nouvelle doctrine abstraite sur Prisma.

Cette arborescence sert à :

- documenter ce qui a été réellement refactoré dans V21
- figer les règles de compatibilité utilisées pendant cette phase
- préparer les lots suivants sans réécrire l'histoire du code

La doctrine de fond reste dans :

- [V19](../v19/README.md) pour la stabilisation Prisma
- [V20](../v20/README.md) pour la doctrine modulaire de `db/`
