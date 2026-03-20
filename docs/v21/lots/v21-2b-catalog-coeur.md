# V21-2B — `catalog` : cœur de la façade de lecture

## Summary

V21-2B est le lot prévu pour traiter le cœur restant de la façade publique de lecture `catalog` après V21-2A.

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

Après V21-2A, l'état réel de cette façade publique est :

- `catalog.repository.ts` : 570 lignes
- `catalog.mappers.ts` : 190 lignes
- `catalog.types.ts` : façade publique
- `types/`, `queries/` et `helpers/` déjà introduits pour les blocs les plus stables

Le chemin `db/repositories/catalog/**` reste historique. Dans cette documentation, `catalog` n'est pas traité comme un domaine métier autonome, mais comme une façade storefront agrégée au-dessus de `homepage`, `categories`, `products` et `blog`.

Les densités restantes sont concentrées dans :

- `listPublishedProducts()`
- `getPublishedProductBySlug()`
- `loadPublishedVariantOffersByProductIds()`
- `buildPublishedProductsWhere()`
- `getPublishedProductsOrderBy()`
- `mapFeaturedCategoryRecord()` — reste dans la façade, hors périmètre d'extraction V21-2B (ses appelants restent également dans la façade)

- `mapPublishedProductSummaryRecord()`, `getNativeSimpleOfferFields()`, `getPublishedProductIdsMatchingVariantColor()` — quittent la façade comme effet de bord structurel nécessaire de l'extraction de leurs appelants directs (voir `decisions/v21-2b-decisions.md`, Décision 1 révisée)

## Périmètre exact

V21-2B doit couvrir :

- l'extraction interne de `listPublishedProducts()`
- l'extraction interne de `getPublishedProductBySlug()`
- la réduction supplémentaire de `catalog.repository.ts`

`catalog.mappers.ts` est **hors périmètre de V21-2B**. Ce fichier n'est ni déplacé, ni modifié, ni réorganisé dans ce lot. Il reste à sa position actuelle (`db/repositories/catalog/catalog.mappers.ts`). Sa clarification est reportée à un lot ultérieur explicite si le besoin est démontré.

## Hors périmètre exact

V21-2B ne doit pas couvrir :

- un changement des exports publics de `catalog.repository.ts`
- un changement des exports publics de `catalog.types.ts`
- une modification des consumers hors `catalog/**`
- une modification des règles métiers de disponibilité ou d'offre simple
- une modification de la règle d'image primaire
- une réintroduction de raw SQL
- un déplacement ou une modification de `catalog.mappers.ts`

## Fichiers potentiellement concernés

- `db/repositories/catalog/catalog.repository.ts`
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

- `listPublishedProducts()` a quitté `catalog.repository.ts`
- `getPublishedProductBySlug()` a quitté `catalog.repository.ts`
- `loadPublishedVariantOffersByProductIds()` a quitté `catalog.repository.ts`
- `buildPublishedProductsWhere()` a quitté `catalog.repository.ts`
- `getPublishedProductsOrderBy()` a quitté `catalog.repository.ts`
- les façades publiques restent identiques
- `typecheck` et `lint` passent

## Compatibilité publique

Compatibilité attendue :

- même chemin public `@/db/repositories/catalog/catalog.repository`
- même chemin public `@/db/repositories/catalog/catalog.types`
- mêmes exports publics
- mêmes signatures runtime
- aucun recâblage nécessaire dans `app/`, `features/` ou `components/`

## Décisions préalables

**Décision — `catalog.mappers.ts` :** hors périmètre de V21-2B. Ce fichier n'est ni déplacé, ni modifié, ni réorganisé dans ce lot. Il reste à `db/repositories/catalog/catalog.mappers.ts`. Sa clarification est reportée à un lot ultérieur explicite si le besoin est démontré.

**Décision — `uniqueBigIntIds` et `toDbId` :** ces deux fonctions utilitaires sont actuellement dupliquées dans `catalog.repository.ts`, `helpers/primary-image.ts` et `helpers/category-representative-image.ts`. Pour V21-2B, la duplication locale est **acceptée et maintenue** : ces fonctions ne seront pas extraites dans un fichier partagé. Elles resteront copiées dans chaque fichier qui en a besoin. Cette décision est locale au domaine `catalog` et ne préjuge pas du traitement des autres domaines. Si un nouveau fichier extrait dans V21-2B utilise ces fonctions, il peut les dupliquer localement.

**Décision — forme des nouveaux fichiers internes :** la forme exacte des nouveaux fichiers internes reste à déterminer au moment de l'exécution, dans les limites du périmètre défini. Seule contrainte : respecter la structure `queries/` et `helpers/` déjà établie en V21-2A.

**Décision — `mapFeaturedCategoryRecord` reste dans la façade (non négociable) :** cette fonction reste dans `catalog.repository.ts`. Son seul appelant (`listHomepageFeaturedCategories`) reste dans la façade. Aucun cycle de dépendance. Extraction reportée à un lot ultérieur explicite si le besoin est démontré.

**Décision — effet de bord structurel nécessaire :** les fonctions `mapPublishedProductSummaryRecord`, `getNativeSimpleOfferFields` et `getPublishedProductIdsMatchingVariantColor` quittent `catalog.repository.ts` dans le cadre de V21-2B, uniquement parce que garder ces fonctions dans la façade tout en extrayant leurs appelants directs créerait un cycle de dépendance interne → façade, interdit par la Décision 3. Ce déplacement n'est pas une extension de périmètre. Ces fonctions ne font pas partie des critères de fin. Elles se déplacent par contrainte de graphe. Ces 3 déplacements ne changent pas les critères de fin, ne constituent pas une extension opportuniste du lot, et sont imposés par le graphe d'appel et la règle d'import interne :
- `getNativeSimpleOfferFields` → dans le(s) fichier(s) `queries/` qui accueille(nt) `listPublishedProducts` et `getPublishedProductBySlug`
- `getPublishedProductIdsMatchingVariantColor` → dans le fichier `queries/` qui accueille `buildPublishedProductsWhere`
- `mapPublishedProductSummaryRecord` → dans un nouveau fichier `helpers/product-summary.ts` (appelée à la fois par des fonctions à extraire et des fonctions qui restent dans la façade)

## Exports publics avant V21-2B

### `catalog.repository.ts` — exports actuels avant le lot

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

Fonctions publiques exportées :

- `getPublishedHomepageContent`
- `listPublishedFeaturedCategories`
- `listCatalogFilterCategories`
- `listPublishedProducts`
- `getPublishedProductBySlug`
- `listRecentPublishedProducts`
- `listPublishedBlogPosts`
- `getPublishedBlogPostBySlug`

### `catalog.types.ts` — exports actuels avant le lot

Ré-exporte l'ensemble des types publics depuis `./types/outputs` :

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

## Exports publics après V21-2B

La façade publique est inchangée. C'est un invariant central du lot.

### `catalog.repository.ts` — exports après le lot

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

### `catalog.types.ts` — exports après le lot

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

Les signatures runtime exportées sont identiques avant et après le lot. Aucun recâblage de consumer n'est nécessaire.

## Ce qui reste volontairement dans la façade après V21-2B

**Bloc A — Ce qui reste dans la façade après V21-2B :**

- `mapFeaturedCategoryRecord` — ses appelants restent dans la façade, aucun cycle de dépendance
- Les 8 fonctions publiques exportées — invariant absolu de façade :
  - `getPublishedHomepageContent`
  - `listPublishedFeaturedCategories`
  - `listCatalogFilterCategories`
  - `listRecentPublishedProducts`
  - `listPublishedBlogPosts`
  - `getPublishedBlogPostBySlug`
  - `listPublishedProducts` (délégation vers fichier interne, mais exportée depuis la façade)
  - `getPublishedProductBySlug` (délégation vers fichier interne, mais exportée depuis la façade)

**Bloc B — Ce qui quitte la façade comme effet de bord structurel nécessaire (sans être dans les critères de fin) :**

- `getNativeSimpleOfferFields` → déplacée avec ses appelants extraits
- `getPublishedProductIdsMatchingVariantColor` → déplacée avec `buildPublishedProductsWhere`
- `mapPublishedProductSummaryRecord` → extraite dans `helpers/product-summary.ts`

Ces 3 déplacements ne changent pas les critères de fin, ne constituent pas une extension opportuniste du lot, et sont imposés par le graphe d'appel et la règle d'import interne.

**Fichiers non touchés dans ce lot :**

- `catalog.mappers.ts` — inchangé, hors périmètre
- `catalog.types.ts` — inchangé, façade publique stable
- `helpers/primary-image.ts` — inchangé
- `helpers/category-representative-image.ts` — inchangé
- `queries/homepage.queries.ts` — inchangé
- `queries/blog.queries.ts` — inchangé
- `queries/recent-products.queries.ts` — inchangé ou étendu uniquement si nécessaire
