# V21-2A — `catalog` : socle interne

## Résumé du lot

V21-2A a modularisé le domaine `db/repositories/catalog/**` sans changer sa surface publique.

Le lot a conservé :

- `catalog.repository.ts` comme façade publique du domaine
- `catalog.types.ts` comme façade publique des contrats
- les signatures runtime exportées
- les contrats publics exportés
- les comportements homepage, blog et recent products

Le lot a extrait uniquement les blocs internes stables :

- contrats publics vers `types/outputs.ts`
- helper d'image primaire vers `helpers/primary-image.ts`
- reconstruction batch des images représentatives de catégories homepage vers `helpers/category-representative-image.ts`
- queries simples homepage, blog et recent products vers `queries/`

## Objectif

Réduire la taille et la densité de `catalog.repository.ts` sans modifier :

- les chemins publics
- les exports publics
- les signatures runtime
- l'ordering
- les tie-breaks
- la règle d'image primaire
- les comportements des flux homepage, blog et recent products

## Audit de départ

L'audit de départ du lot a constaté :

- `db/repositories/catalog/` ne contenait que `catalog.repository.ts`, `catalog.types.ts` et `catalog.mappers.ts`
- `catalog.repository.ts` concentrait à la fois :
  - les exports publics
  - des `select` Prisma partagés
  - des comparateurs privés
  - des helpers batch
  - la reconstruction mémoire de `representativeImage`
  - les queries homepage, recent products et blog
  - les zones plus denses `listPublishedProducts` et `getPublishedProductBySlug`
- `catalog.types.ts` portait directement l'ensemble des contrats publics du domaine
- aucun consumer hors `catalog/**` n'avait besoin d'être modifié si les façades publiques restaient stables

Le point de départ documenté avant refactor était :

- `catalog.repository.ts` : 878 lignes
- `catalog.types.ts` : 113 lignes

## Périmètre exact du lot

Fichiers du périmètre :

- `db/repositories/catalog/catalog.repository.ts`
- `db/repositories/catalog/catalog.types.ts`
- `db/repositories/catalog/types/outputs.ts`
- `db/repositories/catalog/helpers/primary-image.ts`
- `db/repositories/catalog/helpers/category-representative-image.ts`
- `db/repositories/catalog/queries/homepage.queries.ts`
- `db/repositories/catalog/queries/blog.queries.ts`
- `db/repositories/catalog/queries/recent-products.queries.ts`

## Hors périmètre exact

Le lot n'a pas traité :

- `listPublishedProducts`
- `getPublishedProductBySlug`
- `catalog.mappers.ts`
- les consumers hors `catalog/**`
- le ré-export de types depuis `catalog.repository.ts`
- les autres domaines `db/`

## Exports publics avant / après

### `catalog.repository.ts` avant le lot

Ré-export de types publics :

- `DbId`
- `MoneyAmount`
- `FeaturedCategory`
- `CatalogFilterCategory`
- `PublishedProductListFilters`
- `PublishedProductImage`
- `PublishedProductSummary`
- `PublishedCatalogProductSummary`
- `PublishedProductVariant`
- `PublishedProductDetail`
- `PublishedBlogPostSummary`
- `PublishedBlogPostDetail`
- `PublishedHomepageContent`

Fonctions publiques :

- `getPublishedHomepageContent`
- `listPublishedFeaturedCategories`
- `listCatalogFilterCategories`
- `listPublishedProducts`
- `getPublishedProductBySlug`
- `listRecentPublishedProducts`
- `listPublishedBlogPosts`
- `getPublishedBlogPostBySlug`

### `catalog.repository.ts` après le lot

Ré-export de types publics inchangé :

- `DbId`
- `MoneyAmount`
- `FeaturedCategory`
- `CatalogFilterCategory`
- `PublishedProductListFilters`
- `PublishedProductImage`
- `PublishedProductSummary`
- `PublishedCatalogProductSummary`
- `PublishedProductVariant`
- `PublishedProductDetail`
- `PublishedBlogPostSummary`
- `PublishedBlogPostDetail`
- `PublishedHomepageContent`

Fonctions publiques inchangées :

- `getPublishedHomepageContent`
- `listPublishedFeaturedCategories`
- `listCatalogFilterCategories`
- `listPublishedProducts`
- `getPublishedProductBySlug`
- `listRecentPublishedProducts`
- `listPublishedBlogPosts`
- `getPublishedBlogPostBySlug`

### `catalog.types.ts` avant le lot

Types publics :

- `DbId`
- `MoneyAmount`
- `FeaturedCategory`
- `CatalogFilterCategory`
- `PublishedProductListFilters`
- `PublishedProductImage`
- `PublishedProductSummary`
- `PublishedCatalogProductSummary`
- `PublishedProductVariant`
- `PublishedProductDetail`
- `PublishedBlogPostSummary`
- `PublishedBlogPostDetail`
- `PublishedHomepageContent`

### `catalog.types.ts` après le lot

Types publics inchangés :

- `DbId`
- `MoneyAmount`
- `FeaturedCategory`
- `CatalogFilterCategory`
- `PublishedProductListFilters`
- `PublishedProductImage`
- `PublishedProductSummary`
- `PublishedCatalogProductSummary`
- `PublishedProductVariant`
- `PublishedProductDetail`
- `PublishedBlogPostSummary`
- `PublishedBlogPostDetail`
- `PublishedHomepageContent`

## Liste exacte des fichiers créés

- `db/repositories/catalog/types/outputs.ts`
- `db/repositories/catalog/helpers/primary-image.ts`
- `db/repositories/catalog/helpers/category-representative-image.ts`
- `db/repositories/catalog/queries/homepage.queries.ts`
- `db/repositories/catalog/queries/blog.queries.ts`
- `db/repositories/catalog/queries/recent-products.queries.ts`

## Liste exacte des fichiers modifiés

- `db/repositories/catalog/catalog.repository.ts`
- `db/repositories/catalog/catalog.types.ts`

## Rôle précis de chaque fichier

### `catalog.repository.ts`

Fichier public du domaine. Il continue d'exposer toute la surface publique catalogue.

Après le lot, il orchestre encore :

- les fonctions publiques du domaine
- les mappings vers `FeaturedCategory` et `PublishedProductSummary`
- les lectures catalogue encore non extraites
- la logique locale de filtres catalogue
- la composition du détail produit public

### `catalog.types.ts`

Façade publique des contrats. Le fichier ne duplique plus les définitions. Il ré-exporte les types depuis `types/outputs.ts`.

### `types/outputs.ts`

Source de vérité des outputs publics du domaine `catalog`.

Le fichier contient :

- `DbId`
- `MoneyAmount`
- `FeaturedCategory`
- `CatalogFilterCategory`
- `PublishedProductListFilters`
- `PublishedProductImage`
- `PublishedProductSummary`
- `PublishedCatalogProductSummary`
- `PublishedProductVariant`
- `PublishedProductDetail`
- `PublishedBlogPostSummary`
- `PublishedBlogPostDetail`
- `PublishedHomepageContent`

### `helpers/primary-image.ts`

Helper interne du domaine pour la sélection et le chargement batch de l'image primaire produit.

Le fichier expose :

- `primaryProductImageSelect`
- `selectPrimaryProductImage`
- `loadPrimaryProductImagesByProductIds`

La règle de sélection est restée inchangée :

1. `variant_id === null`
2. `is_primary === true`
3. `sort_order ASC`
4. `id ASC`

### `helpers/category-representative-image.ts`

Helper interne du domaine pour reconstruire en batch `representativeImage` des catégories mises en avant de la homepage.

Le fichier :

- lit `product_categories`
- filtre les produits `published`
- choisit le produit le plus récent selon `created_at DESC`, puis `id DESC`
- réutilise `loadPrimaryProductImagesByProductIds`
- retourne une map `categoryId -> representativeImage`

### `queries/homepage.queries.ts`

Fichier de lectures Prisma simples utilisées par les flux homepage :

- `getPublishedHomepageRow`
- `listHomepageFeaturedCategoryRecords`
- `listHomepageFeaturedProductRows`
- `listHomepageFeaturedBlogPostRows`
- `featuredCategorySelect`
- `FeaturedCategoryRecord`

### `queries/blog.queries.ts`

Fichier de lectures Prisma simples du blog public :

- `listPublishedBlogPostRows`
- `getPublishedBlogPostRowBySlug`

### `queries/recent-products.queries.ts`

Fichier de lecture Prisma simple des produits récents et de partage du `select` résumé produit :

- `publishedProductSummarySelect`
- `PublishedProductSummaryRecord`
- `listRecentPublishedProductRows`

## Ce qui a été extrait

V21-2A a extrait hors de `catalog.repository.ts` :

- le bloc de définition des contrats publics
- le `select` partagé des images produit
- le comparateur d'image primaire
- le choix d'image primaire
- le batch loading des images primaires par produit
- la reconstruction batch des images représentatives de catégories homepage
- les lectures Prisma simples de homepage
- les lectures Prisma simples du blog
- la lecture Prisma simple des produits récents

## Ce qui est resté volontairement dans `catalog.repository.ts`

Le lot a laissé dans `catalog.repository.ts` :

- le ré-export public des types du domaine
- `getPublishedHomepageContent`
- `listPublishedFeaturedCategories`
- `listCatalogFilterCategories`
- `listPublishedProducts`
- `getPublishedProductBySlug`
- `listRecentPublishedProducts`
- `listPublishedBlogPosts`
- `getPublishedBlogPostBySlug`
- `mapFeaturedCategoryRecord`
- `mapPublishedProductSummaryRecord`
- `loadPublishedVariantOffersByProductIds`
- `getNativeSimpleOfferFields`
- `getPublishedProductIdsMatchingVariantColor`
- `buildPublishedProductsWhere`
- `getPublishedProductsOrderBy`

Le lot a aussi laissé inchangé `catalog.mappers.ts`.

## Compatibilité publique

Compatibilité conservée :

- mêmes chemins publics
- même liste d'exports publics sur `catalog.repository.ts`
- même liste d'exports publics sur `catalog.types.ts`
- mêmes signatures runtime
- aucun recâblage de consumer

Le consumer [features/homepage/types.ts](/Users/laurent/Desktop/CREATYSS/features/homepage/types.ts) est resté inchangé et continue d'importer `FeaturedCategory` depuis `catalog.repository.ts`.

## Vérifications exécutées

Commandes exécutées :

- `pnpm run typecheck`
- `pnpm run lint`
- `rg -n '^export type|^export async function|^export \\{' db/repositories/catalog/catalog.repository.ts db/repositories/catalog/catalog.types.ts`

Résultat :

- `typecheck` a passé
- `lint` a passé
- la surface publique observée avant et après le lot est restée identique

## Risques résiduels

Risques résiduels observables après le lot :

- `catalog.repository.ts` reste un fichier dense
- `listPublishedProducts` reste la zone la plus complexe du domaine
- `getPublishedProductBySlug` reste dans la façade publique avec sa logique de reconstruction locale
- `catalog.mappers.ts` reste un fichier utilitaire large

Le lot n'a pas introduit de nouveau risque fonctionnel identifié. Il n'a pas non plus mesuré un gain de performance.

## Limites résiduelles

Limites visibles après V21-2A :

- le domaine `catalog` n'est pas encore entièrement internalisé
- la façade publique reste partiellement épaisse
- les types publics restent regroupés dans un seul fichier interne `types/outputs.ts`
- `catalog.repository.ts` ré-exporte encore les types publics du domaine

## Conclusion de lot

V21-2A a livré un premier découpage interne réel du domaine `catalog` sans toucher à sa surface publique.

Le lot a atteint son objectif :

- `catalog.types.ts` est devenu une façade propre
- les helpers partagés les plus stables ont été extraits
- les lectures Prisma simples homepage / blog / recent products ont été sorties du repository
- `catalog.repository.ts` est resté le point d'entrée public unique

Le lot n'a pas cherché à terminer la modularisation du domaine. Il a préparé le terrain pour un lot ultérieur sur les zones restantes.
