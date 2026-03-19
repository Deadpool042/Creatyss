# Frontières de responsabilité

## Principe général

Le code actuel garde une séparation assez nette entre :

- `db/` : accès base, transactions, assemblage de read models
- `entities/` : règles métier, validations métier, présentations métier
- `features/` : actions, schemas, composants, mappers UI, hubs de types locaux

Il n'existe pas de couche `services/` intermédiaire.

## Frontière `db` → `entities`

### Ce que `db` importe depuis `entities/`

Le repository peut importer une règle métier pure ou un type métier stable quand cela fait partie de son contrat.

Exemples réels :

- `order.repository.ts`
  - `createOrderReference`
  - `resolveOrderStatusTransition`
- `catalog.mappers.ts`
  - `resolveSimpleProductOffer`
- `admin-product.repository.ts`
  - `canChangeProductTypeToSimple`
  - `resolveSimpleProductOffer`
- `admin-product-variant.repository.ts`
  - `canCreateVariantForProductType`
  - `canDeleteVariantForProductType`

### Ce que `db` ne doit pas absorber

Le repository ne doit pas devenir le lieu principal des règles métier.

Le code actuel suit cette ligne de partage :

- acceptable dans `db/` :
  - filtrer `status = "published"`
  - compter des variantes
  - recalculer un read model public
- laissé à `entities/` :
  - transitions de statut autorisées
  - règles produit simple / produit avec déclinaisons
  - validations métier d'input

## Frontière `features` → `db`

### Imports runtime

`features/` et `app/` importent les fonctions runtime depuis `*.repository.ts`.

Exemples :

- `createOrderFromGuestCartToken`
- `updateAdminHomepage`
- `listPublishedProducts`

### Imports de types

Le pattern majoritaire est désormais :

- import des fonctions depuis `*.repository.ts`
- import des types et erreurs publiques depuis `*.types.ts`

Exemples :

- `OrderRepositoryError` depuis `order.types.ts`
- `AdminProductRepositoryError` depuis `admin-product.types.ts`
- `GuestCart` depuis `guest-cart.types.ts`

### Exception réelle

Une exception subsiste :

- `features/homepage/types.ts` ré-exporte encore `FeaturedCategory` depuis `catalog.repository.ts`

Cette exception est cohérente avec l'état actuel du code, mais elle n'est pas alignée avec la doctrine cible.

## Frontière `db` → `features/**/types`

Les hubs feature servent de façade locale de consommation.

Exemples sains :

- `features/admin/products/types/product-detail-types.ts`
- `features/admin/orders/types/order-detail-types.ts`
- `features/admin/categories/types/category-types.ts`
- `features/admin/blog/types/blog-types.ts`

Ces hubs :

- ré-exportent les contrats publics depuis `db/...types.ts`
- ajoutent parfois un type purement feature
- ne redéfinissent pas les contrats DB

## Frontière `db` → UI

Le code actuel ne met pas de logique de rendu dans `db/`.

En revanche, certains read models publics sont déjà orientés usage UI, en particulier :

- `PublishedHomepageContent`
- `PublishedCatalogProductSummary`
- `AdminHomepageEditorData`
- `AdminOrderDetail`

Ce choix est assumé : `db/` fournit un contrat de consommation stable, mais pas des composants ni des labels UI.

## Ce que V20 doit préserver

- pas de logique métier déplacée depuis `entities/` vers `db/`
- pas de types Prisma importés dans `entities/`
- pas d'imports de types publics depuis les repositories quand un `*.types.ts` existe
- pas d'introduction d'une couche service pour masquer les repositories
