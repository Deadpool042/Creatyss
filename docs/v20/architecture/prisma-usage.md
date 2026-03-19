# Usage réel de Prisma

## Point d'entrée

`db/prisma-client.ts` instancie un `PrismaClient` avec `@prisma/adapter-pg` et protège l'instance globale en développement.

Points observables :

- pas de pool `pg` parallèle
- pas de client Prisma par requête
- pas de factory maison

## Source de vérité du schéma

Le code confirme la doctrine V18 :

- le schéma réel reste piloté par `db/migrations/*.sql`
- `prisma/schema.prisma` reste un reflet introspecté
- Prisma n'est pas utilisé comme système de migration applicative

## Patterns de lecture récurrents

### `findUnique` / `findFirst` ciblés

Utilisés pour :

- lecture par id
- lecture par slug
- lecture par token
- lecture par référence de commande

Exemples :

- `findAdminUserById`
- `getPublishedProductBySlug`
- `findPublicOrderByReference`
- `findGuestCartIdByToken`

### `findMany` + `select` minimal

Pattern dominant sur le code actuel :

- projection explicite
- tri explicite
- conversion en contrat public ensuite

Exemples :

- `listPublishedProducts`
- `listRecentPublishedProducts`
- `listCatalogFilterCategories`
- `listAdminOrders`

### `groupBy` et `_count`

Utilisés quand Prisma introspecte certaines relations de façon imparfaite ou quand un agrégat simple suffit.

Exemple concret :

- `admin-product.repository.ts` utilise `groupBy` sur `product_variants` pour obtenir le nombre de déclinaisons par produit

## Conversions de types techniques

### `bigint`

Les ids restent publics en `string`.

Pattern dominant :

- conversion `BigInt(inputId)` au bord Prisma
- conversion `row.id.toString()` dans les mappers publics

### `Decimal`

Les montants publics restent des `string`.

Patterns observés :

- `.toString()` sur `Decimal`
- normalisation monétaire via `normalizeMoneyString`
- calculs en cents via `moneyStringToCents` / `centsToMoneyString`

## Transactions Prisma

Les transactions restent locales aux repositories.

### Domaines simples

`admin-blog` utilise `$transaction` pour les changements de statut.

### Domaines critiques

`payment` et `order` utilisent :

- `prisma.$transaction(async (tx) => { ... })`
- `isolationLevel: "Serializable"`

Cela sert à reproduire la sémantique de verrouillage du SQL historique sans réintroduire de raw SQL.

### Domaines admin composites

`admin-homepage` et `admin-product*` utilisent des transactions pour :

- valider les références avant write
- remplacer des associations
- synchroniser plusieurs tables
- maintenir des compatibilités internes

## Batch loading

Prisma est utilisé avec du batch loading explicite quand une jointure SQL historique n'est plus exprimée sous forme d'une requête unique.

Exemples réels :

- `catalog.repository.ts`
  - `loadPrimaryProductImagesByProductIds`
  - `loadRepresentativeImagesByCategoryIds`
  - `loadPublishedVariantOffersByProductIds`
- `admin-category.repository.ts`
  - `loadRepresentativeImagesByCategoryIds`

## Santé base

`db/health.ts` utilise `prisma.$connect()`.

Ce choix vérifie la connectivité Prisma, pas un round-trip SQL utilisateur complet. Le code l'assume comme health check minimal.

## Ce qui n'est plus présent

- `$queryRaw`
- `$executeRaw`
- `Prisma.sql`
- coexistence `pg` + Prisma dans les fonctions repository

## Limites observables

- les `select` sont souvent définis inline dans les gros repositories
- les helpers batch restent encore mélangés aux façades publiques
- certains commentaires mentionnent encore l'ancien monde SQL, par exemple dans `admin-homepage.repository.ts`

Ce sont des limites de structuration, pas des limites de Prisma.
