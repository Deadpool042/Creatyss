# Structure interne actuelle de la façade publique `db/repositories/catalog/`

## Position de cette structure dans la doctrine V21

La structure actuelle de `catalog` est le premier exemple réellement implémenté de la doctrine V21 sur une façade publique de lecture agrégée.

Elle matérialise trois règles de la version :

- la façade publique reste stable
- les contrats publics peuvent être déplacés derrière une façade `*.types.ts`
- les lectures Prisma simples et les helpers techniques peuvent sortir du repository sans changer l'API publique

Cette structure ne doit pas être lue comme une cible déjà atteinte partout dans `db/`. Elle doit être lue comme une première façade publique pilote déjà refactorée.

Le chemin `db/repositories/catalog/**` est conservé pour compatibilité, mais il ne correspond pas à un domaine métier autonome.

## Pourquoi `catalog` n'est pas un domaine métier

Le code actuel de [catalog.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/catalog.repository.ts) montre que `catalog` agrège plusieurs lectures publiques distinctes :

- homepage publique
- catégories mises en avant
- listing produit
- détail produit
- produits récents
- blog public

Cette façade de lecture traverse donc plusieurs domaines métier déjà visibles dans le reste du repository :

- `homepage`
- `categories`
- `products`
- `blog`

Le chemin historique `db/repositories/catalog/**` est conservé pour compatibilité. Il ne transforme pas `catalog` en domaine métier homogène.

## Arborescence actuelle

Après V21-2A, la structure réelle de cette façade publique est :

```text
db/repositories/catalog/
├── catalog.mappers.ts
├── catalog.repository.ts
├── catalog.types.ts
├── helpers/
│   ├── category-representative-image.ts
│   └── primary-image.ts
├── queries/
│   ├── blog.queries.ts
│   ├── homepage.queries.ts
│   └── recent-products.queries.ts
└── types/
    └── outputs.ts
```

## Rôle de la façade publique `catalog.repository.ts`

`catalog.repository.ts` reste l'unique point d'entrée public de cette façade de lecture storefront.

Il expose encore :

- les ré-exports de types publics de la façade
- toutes les fonctions publiques storefront

Il orchestre encore :

- la homepage publique
- les catégories mises en avant
- les filtres catalogue
- le listing catalogue
- le détail produit public
- les produits récents
- le blog public

Après V21-2A, ce fichier ne porte plus les helpers extraits les plus stables. Il reste néanmoins partiellement épais parce qu'il contient encore :

- `listPublishedProducts`
- `getPublishedProductBySlug`
- les builders de filtres et d'ordering du catalogue
- des mappings publics légers
- le chargement local des offres de variantes publiées

## Rôle de `catalog.types.ts`

`catalog.types.ts` est resté la façade publique de types de cette façade de lecture.

Le fichier ne définit plus directement les contrats. Il ré-exporte l'ensemble des types publics depuis `types/outputs.ts`.

Ce choix a gardé inchangé le chemin public :

- `@/db/repositories/catalog/catalog.types`

## Rôle de `types/outputs.ts`

`types/outputs.ts` est devenu la source de vérité des outputs publics exposés par la façade `catalog`.

Le fichier contient :

- les identifiants publics (`DbId`)
- les montants publics (`MoneyAmount`)
- les types homepage (`FeaturedCategory`, `PublishedHomepageContent`)
- les types catalogue (`CatalogFilterCategory`, `PublishedProductSummary`, `PublishedCatalogProductSummary`, `PublishedProductDetail`)
- les types image et variante (`PublishedProductImage`, `PublishedProductVariant`)
- les types blog (`PublishedBlogPostSummary`, `PublishedBlogPostDetail`)

Le fichier ne contient pas de lecture Prisma, de helper ou de mapping.

## Rôle de `helpers/primary-image.ts`

`helpers/primary-image.ts` porte une responsabilité unique : la sélection et le chargement batch de l'image primaire produit.

Exports internes :

- `primaryProductImageSelect`
- `selectPrimaryProductImage`
- `loadPrimaryProductImagesByProductIds`

Ce helper centralise :

- le `select` Prisma sur `product_images`
- le comparateur d'image primaire
- le choix d'une image unique par produit
- le batch loading par `product_id`

La règle de priorité documentée en V19 et V20 est restée implémentée ici :

1. image de produit parent (`variant_id === null`)
2. `is_primary === true`
3. `sort_order ASC`
4. `id ASC`

## Rôle de `helpers/category-representative-image.ts`

`helpers/category-representative-image.ts` porte la reconstruction batch de `representativeImage` pour les catégories mises en avant de la homepage.

Le helper :

- lit les relations `product_categories`
- lit les produits publiés concernés
- choisit le produit le plus récent par catégorie
- délègue la sélection de l'image au helper `primary-image`
- retourne une map prête à être consommée par la façade publique

Le fichier ne publie qu'une fonction :

- `loadRepresentativeImagesByCategoryIds`

## Rôle de `queries/homepage.queries.ts`

`queries/homepage.queries.ts` regroupe les lectures Prisma simples de la homepage publique.

Exports internes :

- `featuredCategorySelect`
- `FeaturedCategoryRecord`
- `getPublishedHomepageRow`
- `listHomepageFeaturedCategoryRecords`
- `listHomepageFeaturedProductRows`
- `listHomepageFeaturedBlogPostRows`

Le fichier ne mappe pas vers les contrats publics. Il retourne des lignes Prisma ou des sélections internes.

## Rôle de `queries/blog.queries.ts`

`queries/blog.queries.ts` regroupe les lectures Prisma simples du blog public.

Exports internes :

- `listPublishedBlogPostRows`
- `getPublishedBlogPostRowBySlug`

Le mapping final vers `PublishedBlogPostSummary` ou `PublishedBlogPostDetail` reste orchestré par `catalog.repository.ts` via `mapBlogPostSummary`.

## Rôle de `queries/recent-products.queries.ts`

`queries/recent-products.queries.ts` regroupe :

- le `select` résumé produit partagé
- le type Prisma associé
- la lecture Prisma des produits récents publiés

Exports internes :

- `publishedProductSummarySelect`
- `PublishedProductSummaryRecord`
- `listRecentPublishedProductRows`

Ce fichier est utilisé à la fois par le repository et par `homepage.queries.ts`.

## Ce qui n'a pas encore été internalisé

Après V21-2A, les éléments suivants ne sont pas encore sortis de `catalog.repository.ts` :

- `listPublishedProducts`
- `getPublishedProductBySlug`
- `loadPublishedVariantOffersByProductIds`
- `getNativeSimpleOfferFields`
- `getPublishedProductIdsMatchingVariantColor`
- `buildPublishedProductsWhere`
- `getPublishedProductsOrderBy`
- `mapFeaturedCategoryRecord`
- `mapPublishedProductSummaryRecord`

Le fichier `catalog.mappers.ts` n'a pas été redécoupé non plus. Il reste un fichier partagé pour :

- les mappers d'image et de variante
- la résolution de l'offre simple
- le calcul de disponibilité
- le mapping des posts de blog

## Pourquoi `catalog.repository.ts` reste une façade partiellement épaisse

`catalog.repository.ts` reste partiellement épais pour trois raisons observables :

1. `listPublishedProducts` est resté hors périmètre du lot.
2. `getPublishedProductBySlug` est resté hors périmètre du lot.
3. le lot a privilégié l'extraction des blocs déjà stabilisés par V19, pas une refonte complète de cette façade de lecture.

Le résultat est volontaire :

- la façade publique a été allégée
- les helpers et queries les plus lisibles ont été sortis
- le cœur le plus risqué de la façade est resté local pour préserver le comportement

## Lecture actuelle

V21-2A n'a pas transformé `catalog` en façade entièrement modulaire.

Il a créé un premier découpage interne fonctionnel :

- `catalog.repository.ts` comme façade publique
- `catalog.types.ts` comme façade publique de types
- `types/` pour les outputs publics
- `helpers/` pour le batch loading et la reconstruction mémoire
- `queries/` pour les lectures Prisma simples

Cette structure est réelle dans le code. Elle reste incomplète sur les flux catalogue les plus denses.

## Ce qui est transposable aux autres domaines

Les éléments suivants sont directement transposables à d'autres domaines métier V21 ou à d'autres façades publiques si elles apparaissaient un jour dans le code :

- garder `*.repository.ts` comme façade publique stable
- garder `*.types.ts` comme façade publique de types
- déplacer les contrats volumineux derrière un sous-dossier `types/`
- extraire les lectures Prisma simples réutilisées dans `queries/`
- extraire les helpers batch et reconstruction mémoire dans `helpers/`
- conserver dans la façade les flows encore trop denses pour être sortis sans risque

Cette logique est particulièrement transposable à :

- `order`
- `products`
- `admin-homepage`
- `guest-cart`

## Ce qui est spécifique à `catalog`

Certains choix de cette structure restent propres à la façade publique `catalog` :

- le helper central d'image primaire produit
- la reconstruction batch de `representativeImage` pour les catégories de homepage
- le partage du `publishedProductSummarySelect` entre homepage et recent products
- le fait que `catalog` soit une façade de lecture storefront sans mutation

Ces éléments ne doivent pas être transformés en abstraction cross-domain.

Ils doivent rester locaux tant qu'un autre domaine n'a pas exactement la même responsabilité technique.

## Cible post-V21-2B

### Arborescence cible après V21-2B

```text
db/repositories/catalog/
├── catalog.repository.ts                        # façade publique — réduite après extraction des 5 fonctions
├── catalog.types.ts                             # façade publique de types — inchangée
├── catalog.mappers.ts                           # helpers de mapping — inchangé, hors périmètre V21-2B
├── types/
│   └── outputs.ts                              # types internes — inchangé
├── helpers/
│   ├── primary-image.ts                        # helper batch image primaire — inchangé
│   ├── category-representative-image.ts        # helper batch image représentative catégorie — inchangé
│   └── product-summary.ts                      # nouveau V21-2B — mapPublishedProductSummaryRecord (effet de bord structurel)
└── queries/
    ├── blog.queries.ts                         # queries blog — inchangées
    ├── homepage.queries.ts                     # queries homepage — inchangées
    ├── recent-products.queries.ts              # queries produits récents — inchangées ou étendues
    └── [nouveaux fichiers pour les 5 fonctions extraites]
```

### Blocs fonctionnels à externaliser dans `queries/`

V21-2B extrait cinq fonctions de `catalog.repository.ts` vers de nouveaux fichiers internes sous `queries/`. La forme exacte des fichiers est déterminée au moment de l'exécution. Les blocs fonctionnels et leurs destinations probables sont :

**Bloc listing catalogue**

Fonctions : `listPublishedProducts`, `buildPublishedProductsWhere`, `getPublishedProductsOrderBy`, `loadPublishedVariantOffersByProductIds`

Destination probable : `queries/catalog-listing.queries.ts` ou découpage en deux fichiers distincts (`queries/catalog-filters.queries.ts` pour les builders de filtres et d'ordering, `queries/catalog-listing.queries.ts` pour le chargement des données).

**Bloc détail produit**

Fonction : `getPublishedProductBySlug`

Destination probable : `queries/product-detail.queries.ts`

### Rôle attendu de `catalog.repository.ts` après V21-2B

Après V21-2B, `catalog.repository.ts` reste l'unique point d'entrée public de la façade de lecture storefront. Il continue d'exposer les mêmes fonctions publiques et les mêmes ré-exports de types.

Il orchestre encore, en délégant vers les nouveaux fichiers internes :

- la homepage publique (inchangé)
- les catégories mises en avant (inchangé)
- les filtres catalogue (délégué vers `queries/`)
- le listing catalogue (délégué vers `queries/`)
- le détail produit public (délégué vers `queries/`)
- les produits récents (inchangé)
- le blog public (inchangé)

Il conserve localement après V21-2B :

- `mapFeaturedCategoryRecord` — hors périmètre d'extraction, tous ses appelants restent dans la façade

Les fonctions suivantes quittent `catalog.repository.ts` dans V21-2B comme effet de bord structurel nécessaire de l'extraction de leurs appelants directs (les garder en façade créerait un cycle interne → façade interdit par la doctrine) :

- `getNativeSimpleOfferFields` — déplacée avec `listPublishedProducts` et `getPublishedProductBySlug` dans `queries/`
- `getPublishedProductIdsMatchingVariantColor` — déplacée avec `buildPublishedProductsWhere` dans `queries/`
- `mapPublishedProductSummaryRecord` — extraite dans `helpers/product-summary.ts`

### Ce qui ne change pas entre V21-2A et V21-2B

- `catalog.types.ts` — inchangé
- `catalog.mappers.ts` — inchangé
- `types/outputs.ts` — inchangé
- `helpers/primary-image.ts` — inchangé
- `helpers/category-representative-image.ts` — inchangé
- `queries/blog.queries.ts` — inchangé
- `queries/homepage.queries.ts` — inchangé
- `queries/recent-products.queries.ts` — inchangé ou étendu uniquement si nécessaire
- la surface publique de `catalog.repository.ts` — inchangée
