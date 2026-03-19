# Repository `catalog`

## Rôle

`db/repositories/catalog/**` porte la lecture publique du storefront :

- homepage publiée
- catégories mises en avant
- filtres catalogue
- listing boutique
- détail produit public
- produits récents
- blog public

Ce domaine n'expose pas de mutations. C'est un domaine de lecture et d'assemblage de read models publics.

## Structure actuelle

Fichiers actuels :

- `catalog.repository.ts`
- `catalog.types.ts`
- `catalog.mappers.ts`

### Contrats publics

Les principaux contrats exposés sont :

- `PublishedHomepageContent`
- `FeaturedCategory`
- `CatalogFilterCategory`
- `PublishedProductSummary`
- `PublishedCatalogProductSummary`
- `PublishedProductDetail`
- `PublishedBlogPostSummary`
- `PublishedBlogPostDetail`

### Point de dette connu

`catalog.repository.ts` ré-exporte encore les types publics du domaine. Cette exception est réelle et doit être traitée comme une dette structurelle, pas comme la cible.

## Fonctions publiques actuelles

- `getPublishedHomepageContent()`
- `listPublishedFeaturedCategories()`
- `listCatalogFilterCategories()`
- `listPublishedProducts(filters)`
- `getPublishedProductBySlug(slug)`
- `listRecentPublishedProducts(limit)`
- `listPublishedBlogPosts()`
- `getPublishedBlogPostBySlug(slug)`

## Flux principaux

### Homepage publique

`getPublishedHomepageContent()` :

1. lit la homepage publiée
2. charge en parallèle :
   - produits mis en avant
   - catégories mises en avant
   - articles de blog mis en avant
3. reconstruit le contrat public complet

### Listing catalogue

`listPublishedProducts(filters)` :

1. construit un `where` Prisma à partir des filtres
2. lit les produits publiés candidats
3. charge en batch :
   - images primaires candidates
   - variantes publiées utiles à l'offre simple et à la disponibilité
4. dérive en mémoire :
   - `primaryImage`
   - `simpleOffer`
   - `isAvailable`
5. applique `onlyAvailable` en mémoire si demandé

### Détail produit

`getPublishedProductBySlug(slug)` :

1. lit le produit publié
2. charge en parallèle :
   - images produit
   - variantes publiées
   - images de variantes publiées
3. reconstruit :
   - `primaryImage`
   - `simpleOffer`
   - `isAvailable`
   - `images`
   - `variants`

### Blog public

Le blog public est lu directement via Prisma avec mapping léger.

## Points complexes réels

### Helper centralisé d'image primaire

Le domaine contient un helper central de sélection d'image primaire produit :

- `comparePrimaryProductImages`
- `selectPrimaryProductImage`

Règle actuelle partagée :

1. `variant_id === null` prioritaire
2. `is_primary === true`
3. `sort_order` croissant
4. `id` croissant

Ce helper est utilisé dans :

- homepage featured products
- listing catalogue
- détail produit
- produits récents
- catégories homepage après normalisation V19

### Representative image catégorie

`loadRepresentativeImagesByCategoryIds()` :

- lit les liens `product_categories`
- lit les produits publiés concernés
- choisit le produit le plus récent par `created_at DESC`, puis `id DESC`
- récupère l'image via le helper primaire partagé

### Search multi-relations

`buildPublishedProductsWhere()` couvre :

- `products.name`
- `products.slug`
- `categories.name`
- `categories.slug`
- `product_variants.color_name` sur variantes publiées

La recherche couleur passe d'abord par `getPublishedProductIdsMatchingVariantColor()`.

### Offre simple et disponibilité

Le domaine réutilise les helpers de `catalog.mappers.ts` :

- `resolvePublishedSimpleOffer`
- `getPublishedProductAvailability`

## Limites actuelles

- `catalog.repository.ts` mélange encore façade publique, helpers batch, comparateurs et construction de `where`
- `catalog.repository.ts` couvre plusieurs sous-domaines distincts :
  - homepage
  - catalogue
  - détail produit
  - blog
- `listPublishedProducts()` reste le point le plus coûteux du domaine, surtout avec `onlyAvailable`
- `catalog.mappers.ts` reste un fichier utilitaire large, même après la suppression des artefacts raw
- le domaine ne dispose pas encore de séparation `queries` / `helpers` / `repository`

## Lecture V20

Le domaine `catalog` est le meilleur candidat pour une modularisation interne graduelle :

- extraire les queries de lecture par sous-flux
- sortir les helpers d'image et de batch
- réduire le fichier repository à une façade d'orchestration

La contrainte à préserver est forte :

- contrat public inchangé
- ordering inchangé
- même règle d'image primaire
- pas de N+1
