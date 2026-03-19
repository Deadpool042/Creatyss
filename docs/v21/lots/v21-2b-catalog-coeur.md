# V21-2B — `catalog` : cœur du domaine

## Summary

V21-2B est le lot prévu pour traiter le cœur restant du domaine `catalog` après V21-2A.

Ce lot vise les deux flux les plus denses encore présents dans [catalog.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/catalog.repository.ts) :

- `listPublishedProducts()`
- `getPublishedProductBySlug()`

## Objectif

Réduire encore la densité de `catalog.repository.ts` en internalisant les blocs privés restants du listing catalogue et du détail produit, sans modifier :

- les façades publiques
- les signatures runtime
- les contrats publics
- les invariants de lecture du storefront

## Audit de départ / contexte réel

Après V21-2A, l'état réel du domaine est :

- `catalog.repository.ts` : 570 lignes
- `catalog.mappers.ts` : 190 lignes
- `catalog.types.ts` : façade publique
- `types/`, `queries/` et `helpers/` déjà introduits pour les blocs les plus stables

Les densités restantes sont concentrées dans :

- `listPublishedProducts()`
- `getPublishedProductBySlug()`
- `loadPublishedVariantOffersByProductIds()`
- `buildPublishedProductsWhere()`
- `getPublishedProductsOrderBy()`
- `mapFeaturedCategoryRecord()` et `mapPublishedProductSummaryRecord()`

## Périmètre exact

V21-2B doit couvrir :

- l'extraction interne de `listPublishedProducts()`
- l'extraction interne de `getPublishedProductBySlug()`
- l'éventuelle clarification du rôle de `catalog.mappers.ts`
- la réduction supplémentaire de `catalog.repository.ts`

## Hors périmètre exact

V21-2B ne doit pas couvrir :

- un changement des exports publics de `catalog.repository.ts`
- un changement des exports publics de `catalog.types.ts`
- une modification des consumers hors `catalog/**`
- une modification des règles métiers de disponibilité ou d'offre simple
- une modification de la règle d'image primaire
- une réintroduction de raw SQL

## Fichiers potentiellement concernés

- `db/repositories/catalog/catalog.repository.ts`
- `db/repositories/catalog/catalog.mappers.ts`
- `db/repositories/catalog/helpers/primary-image.ts`
- `db/repositories/catalog/queries/recent-products.queries.ts`
- nouveaux fichiers internes sous `db/repositories/catalog/queries/` pour le listing catalogue et le détail produit
- nouveaux fichiers internes sous `db/repositories/catalog/helpers/` si l'assemblage listing ou détail devient suffisamment isolable

## Invariants à préserver

Invariants critiques du lot :

- ordering actuel de `listPublishedProducts()`
- filtrage `onlyAvailable` en mémoire
- règle d'image primaire produit
- dérivation de `simpleOffer`
- dérivation de `isAvailable`
- absence de N+1
- façades publiques `catalog.repository.ts` et `catalog.types.ts` inchangées

## Risques principaux

Risques principaux :

- modifier involontairement l'ordering du listing
- casser la dérivation de `simpleOffer`
- casser la dérivation de `isAvailable`
- déplacer trop tôt un mapping encore plus lisible dans la façade
- réintroduire des chargements naïfs ou un N+1

## Vérifications obligatoires

- `pnpm run typecheck`
- `pnpm run lint`
- vérification de la surface publique de `catalog.repository.ts`
- vérification de la surface publique de `catalog.types.ts`
- vérification ciblée de l'absence de N+1 introduit par les nouvelles extractions

## Critères de fin

V21-2B est considéré terminé quand :

- `listPublishedProducts()` est internalisé sans changement observable
- `getPublishedProductBySlug()` est internalisé sans changement observable
- `catalog.repository.ts` est réduit à une façade sensiblement plus compacte
- les façades publiques restent identiques
- `typecheck` et `lint` passent

## Compatibilité publique

Compatibilité attendue :

- même chemin public `@/db/repositories/catalog/catalog.repository`
- même chemin public `@/db/repositories/catalog/catalog.types`
- mêmes exports publics
- mêmes signatures runtime
- aucun recâblage nécessaire dans `app/`, `features/` ou `components/`

## Décisions ou ambiguïtés connues

Décisions déjà prises :

- le lot doit conserver les façades publiques en l'état
- le lot doit préserver les invariants `ordering`, `primary image`, `onlyAvailable`, `simpleOffer`, `isAvailable`

Ambiguïtés connues :

- `catalog.mappers.ts` peut rester partiellement inchangé si son découpage n'apporte pas un gain net
- la forme exacte des nouveaux fichiers internes n'est pas encore figée tant que la lisibilité du flux listing/détail n'est pas démontrée
