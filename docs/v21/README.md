# V21 — Modularisation interne de `db/`

## Objectif global

V21 rend la couche `db/repositories/` plus lisible et plus maintenable sans changer son comportement, ses contrats publics ni ses chemins d'import.

L'API publique de `db/` reste intacte. Chaque `*.repository.ts` reste le point d'entrée public de son domaine. Chaque `*.types.ts` reste la façade publique de types. Les consumers dans `app/`, `features/` et `components/` ne sont pas recâblés.

V21 ne réécrit pas l'architecture de `db/`. Il extrait, depuis des fichiers devenus trop denses, des blocs internes vers des sous-dossiers locaux au domaine : `queries/`, `helpers/`, `types/`. Ce travail est incrémental, domaine par domaine, lot par lot.

## Ce que V21 ne fait pas

- Aucune modification des signatures runtime des repositories
- Aucun changement des contrats publics exportés
- Aucun changement des chemins publics déjà consommés
- Aucune introduction d'une couche `services/`
- Aucun raw SQL, `$queryRaw`, `$executeRaw`
- Aucun refactor par symétrie entre domaines
- Aucune harmonisation qui n'est pas portée par un lot explicite
- Aucune modification du schéma ou des migrations SQL

## Doctrine

La doctrine complète est dans [`doctrine.md`](./doctrine.md). Les principes directeurs sont :

**Modularisation pragmatique.** Un bloc est extrait uniquement si le gain de lisibilité est net et démontrable. La taille d'un fichier n'est pas une raison suffisante à elle seule. En cas de doute entre extraire et ne pas extraire, la décision est de ne pas extraire.

**Pas de refactor par symétrie.** Un domaine n'est pas découpé parce qu'un autre l'a été. Chaque domaine est évalué sur ses propres blocs.

**Invariants de façade.** Les `*.repository.ts` restent la façade publique runtime. L'extraction de blocs internes se fait par délégation depuis cette façade, jamais par remplacement de son API. Les `*.types.ts` restent la façade publique de types, réservée aux consumers externes.

**Règle d'import interne.** À l'intérieur d'un domaine modularisé, les fichiers internes importent leurs types depuis la source de vérité interne (`types/`), jamais depuis la façade publique `*.types.ts`.

## Décisions transverses

Quatre décisions s'appliquent à tous les lots V21 sans exception. Elles sont documentées intégralement dans [`decisions/v21-cross-lots-decisions.md`](./decisions/v21-cross-lots-decisions.md).

**T-1 — Duplication locale des petites fonctions utilitaires.** Les petites fonctions utilitaires génériques (`isValidNumericId`, `toDbId`, `uniqueBigIntIds`, etc.) sont dupliquées localement dans chaque fichier qui en a besoin. Aucune extraction vers un fichier partagé cross-domain. Cela évite un couplage artificiel entre domaines pour des fonctions sans logique métier propre.

**T-2 — TxClient dans les domaines modularisés.** Si un domaine crée un sous-dossier interne dans V21, l'alias `TxClient` est extrait dans `<domaine>/types/` et partagé entre tous les fichiers internes. Si le domaine reste un fichier plat, `TxClient` reste défini localement dans ce fichier. Pas d'extraction sans sous-dossier.

**T-3 — Position des error mappers.** Les fonctions qui mappent des erreurs Prisma vers des erreurs publiques du repository restent dans la façade `*.repository.ts`. Elles ne sont jamais extraites dans `helpers/` ou `queries/`. Déplacer un error mapper hors de la façade briserait la lisibilité du contrat d'erreur observable depuis l'extérieur.

**T-4 — Gel de `AdminProductImageRepositoryError`.** Cette classe reste dans son état actuel pendant toute la durée de V21. Son inconsistance structurelle avec les autres types d'erreur du domaine `products` est une dette connue et gelée. Tout correctif nécessite un lot dédié.

## Séquencement des lots

| Lot | Domaine | Statut |
|---|---|---|
| V21-1 | Cadrage et audit de `db/repositories/` | Terminé |
| V21-2A | `catalog` — socle interne de la façade de lecture | Terminé |
| V21-2B | `catalog` — cœur de la façade (`listPublishedProducts`, `getPublishedProductBySlug`) | Décisions arrêtées |
| V21-3 | `order` — modularisation interne (728 lignes) | Décisions arrêtées |
| V21-4A | `products` — socle partagé (`admin-product.repository.ts`, 592 lignes) | Décisions arrêtées |
| V21-4B | `products` — variantes et images | Décisions arrêtées |
| V21-5 | Petits domaines restants | Décisions arrêtées |

## Résumé par lot

### V21-1 — Cadrage

Audit de `db/repositories/`. Identification des fichiers prioritaires, définition de la structure cible locale par domaine, séquençage.

### V21-2A — `catalog` : socle interne (terminé)

Premier lot d'extraction sur la façade de lecture storefront `catalog`. Résultat visible dans le code :

- `catalog.types.ts` ré-exporte depuis `types/outputs.ts`
- `helpers/primary-image.ts` — image primaire produit
- `helpers/category-representative-image.ts` — image représentative de catégorie
- `queries/homepage.queries.ts`, `queries/blog.queries.ts`, `queries/recent-products.queries.ts`
- `listPublishedProducts` et `getPublishedProductBySlug` sont restés dans la façade (hors périmètre V21-2A)
- `catalog.mappers.ts` non touché

`catalog` est une **façade de lecture agrégée**, pas un domaine métier autonome. Elle agrège des lectures storefront sur `homepage`, `categories`, `products` et `blog`. Le chemin historique `db/repositories/catalog/**` est conservé pour compatibilité.

### V21-2B — `catalog` : cœur de la façade

Extraction de `listPublishedProducts`, `getPublishedProductBySlug`, `loadPublishedVariantOffersByProductIds`, `buildPublishedProductsWhere`, `getPublishedProductsOrderBy` vers `queries/`.

Volontairement hors périmètre : `mapFeaturedCategoryRecord`, `mapPublishedProductSummaryRecord`, `getNativeSimpleOfferFields`, `getPublishedProductIdsMatchingVariantColor`, `catalog.mappers.ts`.

### V21-3 — `order` : modularisation interne

`order.repository.ts` : 728 lignes. Responsabilités mélangées : validations, mappers, helpers transactionnels, restock, lectures publiques et admin, création de commande, transitions de statut, expédition.

Blocs cibles : `orders/types/` (TxClient), `orders/queries/` (lectures internes), `orders/helpers/` ou `orders/mappers/` (mappers de lignes et de paiement, helpers de transaction).

Invariants critiques : isolation Serializable, retry de génération de référence, restock sur transitions, validation du checkout draft.

`order.repository.ts` et `order.types.ts` restent façades publiques stables. `order-email.repository.ts` hors périmètre V21-3.

### V21-4A — `products` : socle partagé

`admin-product.repository.ts` : 592 lignes. Blocs extraits vers `products/types/`, `products/queries/`, `products/helpers/` :

| Bloc extrait | Destination |
|---|---|
| `TxClient` | `products/types/tx-client.ts` |
| `AdminProductTypeRow` → `ProductTypeRow` | `products/types/product-type-row.ts` |
| `readProductTypeInTx` | `products/queries/read-product-type.ts` |
| `countVariantsInTx` | `products/queries/count-variants.ts` |
| `ensureCategoriesExistInTx` | `products/helpers/ensure-categories.ts` |
| `replaceProductCategoriesInTx` | `products/helpers/replace-categories.ts` |

Volontairement en façade : `mapPrismaRepositoryError` (T-3), `isValidProductId` et `normalizeCategoryIds` (T-1), `assertCanSaveAsSimpleProduct` et asserts voisins (couplés aux erreurs publiques, trop courts pour justifier l'extraction), `loadAdminProductDetailInTx` (flow complexe combinant lecture + mapping + requête conditionnelle). `simple-product-compat.ts` non touché.

`admin-product-variant.repository.ts` non modifié dans V21-4A. Sa migration vers les fichiers partagés est documentée comme dette à résorber en V21-4B.

### V21-4B — `products` : variantes et images

`admin-product-variant.repository.ts` (303 lignes) et `admin-product-image.repository.ts` (345 lignes).

**Variantes :** migration vers les fichiers créés en V21-4A (`ProductTypeRow`, `readProductTypeInTx`, `countVariantsInTx`), extraction de `clearDefaultVariantInTx` vers `products/helpers/clear-default-variant.ts`. En façade : `mapVariantFromPrisma` (couplé aux types publics, règle d'import interne), `mapVariantPrismaError` (T-3), `isValidNumericId` (T-1).

**Images :** extraction de `productExistsInTx` et `variantExistsInTx` vers `products/queries/`, `clearPrimaryImageInScopeTx` vers `products/helpers/clear-primary-image.ts`. En façade : `setPrimaryImageInScopeTx` (orchestre un flow complet avec `mapPrismaProductImage`, extraction inverserait la direction d'import), `mapPrismaProductImage` (couplé aux types publics), `TxClient` local (T-2 : `admin-product-image` reste un fichier plat non modularisé). `AdminProductImageRepositoryError` gelée (T-4).

### V21-5 — Petits domaines restants

Huit domaines audités. Trois GO, cinq NO-GO.

**GO :**

| Domaine | Lignes | Blocs extraits |
|---|---|---|
| admin-category | 366 | `loadRepresentativeImagesByCategoryIds` → `queries/representative-image.queries.ts` ; `sortCategoriesForAdmin` + `isRepresentativeImageCandidateBetter` → `helpers/sort.ts` |
| admin-homepage | 426 | Lectures sélections → `queries/featured-selections.queries.ts` ; options éditeur → `queries/homepage-options.queries.ts` ; validations transactionnelles → `helpers/transaction-guards.ts` ; écritures transactionnelles → `helpers/transaction-writes.ts` ; `TxClient` → `types/tx.ts` |
| guest-cart | 450 | Disponibilité → `helpers/availability.ts` ; mappers → `helpers/mappers.ts` ; agrégation panier → `helpers/cart-builder.ts` |

**NO-GO :**

| Domaine | Lignes | Motif |
|---|---|---|
| payment | 167 | Deux transactions Serializable à criticité élevée, responsabilité cohérente, aucun bloc extractible sans risque |
| order-email | 119 | Responsabilité unique, trop compact |
| admin-blog | 221 | Blocs trop couplés (mappers interdépendants, transaction intégrée à l'orchestration), règle de prudence V21 |
| admin-users | 59 | Responsabilité unique |
| admin-media | 70 | Responsabilité unique |

## Ce qui a été fait vs ce qui a été volontairement non fait

### Fait

- Audit complet de `db/repositories/` (V21-1)
- Modularisation de la façade de lecture `catalog` en deux lots (V21-2A terminé, V21-2B décidé)
- Toutes les décisions lot par lot documentées et tranchées pour V21-2B, V21-3, V21-4A, V21-4B, V21-5
- Décisions transverses T-1 à T-4 fixées et opposables

### Volontairement non fait dans V21

- Harmonisation des error types entre `admin-product-image` et les autres façades du domaine `products` (dette gelée, T-4)
- Extraction de `catalog.mappers.ts`
- Extraction de `mapFeaturedCategoryRecord` hors de `catalog.repository.ts`
- Modularisation de `payment`, `order-email`, `admin-blog`, `admin-users`, `admin-media` (NO-GO explicite V21-5)
- Extraction de `loadAdminProductDetailInTx` hors de `admin-product.repository.ts`
- Extraction de `setPrimaryImageInScopeTx` hors de `admin-product-image.repository.ts`
- Toute modification des contrats publics, signatures runtime, ou chemins d'import consumers

## Dépendances

V21 travaille à l'intérieur du cadre posé par :

- **V19** : Prisma ORM uniquement dans `db/`, contrats publics explicités, disparition du raw SQL runtime
- **V20** : inventaire des domaines, identification des gros repositories, doctrine de modularisation interne

Ces deux versions sont les références de fond. V21 transforme la doctrine de V20 en structure réelle dans le code.

## Navigation

### Cadre général

- [doctrine.md](./doctrine.md)
- [scope.md](./scope.md)
- [roadmap.md](./roadmap.md)
- [decisions/v21-cross-lots-decisions.md](./decisions/v21-cross-lots-decisions.md)

### Lots

- [V21-1 — cadrage et audit](./lots/v21-1-cadrage-audit.md)
- [V21-2A — `catalog` : socle interne](./lots/v21-2a-catalog-socle-interne.md)
- [V21-2B — `catalog` : cœur de la façade](./lots/v21-2b-catalog-coeur.md)
- [V21-3 — `order`](./lots/v21-3-order-internal-modularization.md)
- [V21-4A — `products` : socle partagé](./lots/v21-4a-products-shared-core.md)
- [V21-4B — `products` : variantes et images](./lots/v21-4b-products-variants-images.md)
- [V21-5 — domaines restants](./lots/v21-5-small-domains-structural-cleanup.md)
- [V21 — état final attendu](./lots/v21-final-state.md)

### Décisions et architecture

- [decisions/v21-cross-lots-decisions.md](./decisions/v21-cross-lots-decisions.md)
- [decisions/v21-2a-decisions.md](./decisions/v21-2a-decisions.md)
- [decisions/v21-2b-decisions.md](./decisions/v21-2b-decisions.md)
- [decisions/v21-4a-decisions.md](./decisions/v21-4a-decisions.md)
- [decisions/v21-4b-decisions.md](./decisions/v21-4b-decisions.md)
- [decisions/v21-5-decisions.md](./decisions/v21-5-decisions.md)
- [architecture/catalog-internal-structure.md](./architecture/catalog-internal-structure.md)
