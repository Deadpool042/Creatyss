# V21 — État final attendu

## Objectif

Figer la forme finale visée pour `db/repositories/` après V21, afin que chaque lot converge vers la même structure sans changer l'API publique.

## Périmètre exact

L'état final attendu de V21 couvre :

- la structure interne de `db/repositories/`
- les façades publiques conservées
- les sous-dossiers internes réellement introduits

## Hors périmètre exact

L'état final attendu de V21 ne couvre pas :

- une nouvelle couche `services/`
- des dossiers globaux `db/queries/`, `db/types/`, `db/helpers/`
- un changement de schéma
- un changement de logique métier

## Invariants à préserver

- Prisma only
- zéro raw SQL
- façades publiques conservées
- contrats publics stables
- signatures runtime stables
- logique métier hors `db/`

## Risques principaux

- vouloir homogénéiser tous les domaines à tout prix
- sur-découper des domaines déjà suffisamment lisibles
- casser des imports publics pour satisfaire une symétrie artificielle

---

## Point 1 — Arborescence cible complète de `db/repositories/` après V21

### Domaines modularisés dans V21

#### `catalog/` — V21-2A + V21-2B

```text
db/repositories/catalog/
├── catalog.repository.ts                        # façade publique storefront — point d'entrée stable
├── catalog.types.ts                             # façade publique de types — ré-exporte depuis types/outputs.ts
├── catalog.mappers.ts                           # helpers de mapping — hors périmètre V21, non extrait
├── types/
│   └── outputs.ts                              # source de vérité des outputs publics (V21-2A)
├── helpers/
│   ├── primary-image.ts                        # sélection et batch loading image primaire produit (V21-2A)
│   ├── category-representative-image.ts        # reconstruction batch image représentative catégorie (V21-2A)
│   └── product-summary.ts                      # mapPublishedProductSummaryRecord — effet de bord structurel V21-2B
└── queries/
    ├── blog.queries.ts                         # lectures Prisma blog public (V21-2A)
    ├── homepage.queries.ts                     # lectures Prisma homepage publique (V21-2A)
    ├── recent-products.queries.ts              # select résumé produit + lecture produits récents (V21-2A)
    ├── catalog-listing.queries.ts              # listPublishedProducts, buildPublishedProductsWhere,
    │                                           # getPublishedProductsOrderBy, loadPublishedVariantOffersByProductIds,
    │                                           # getNativeSimpleOfferFields, getPublishedProductIdsMatchingVariantColor (V21-2B)
    └── product-detail.queries.ts               # getPublishedProductBySlug (V21-2B)
```

#### `orders/` — V21-3 (sous-dossier interne de `order.repository.ts`)

Façades publiques à la racine de `db/repositories/` (non bougées) :

```text
db/repositories/
├── order.repository.ts                         # façade publique runtime — point d'entrée stable
├── order.types.ts                              # façade publique de types — ré-exporte depuis orders/types/public.ts
└── orders/
    ├── types/
    │   ├── internal.ts                         # TxClient + types transactionnels internes
    │   └── public.ts                           # source de vérité des contrats publics ré-exportés par order.types.ts
    ├── queries/
    │   └── order-reads.queries.ts              # lectures internes publiques et admin extraites
    └── helpers/
        ├── mappers.ts                          # mappers de lignes de commande, paiement, contextes email
        ├── transactions.ts                     # helpers transactionnels, checkout, restock, shipping
        └── validation.ts                       # validations locales du domaine
```

#### `products/` — V21-4A + V21-4B

```text
db/repositories/products/
├── admin-product.repository.ts                 # façade publique — 8 fonctions publiques stables
├── admin-product.types.ts                      # façade publique de types
├── admin-product-variant.repository.ts         # façade publique — 4 fonctions publiques stables
├── admin-product-variant.types.ts              # façade publique de types
├── admin-product-image.repository.ts           # façade publique plate — reste plate (T-2, pas de sous-dossier propre)
├── admin-product-image.types.ts                # façade publique de types (AdminProductImageRepositoryError gelée — T-4)
├── simple-product-compat.ts                    # hors périmètre V21 — non touché
├── types/                                      # sous-structure interne partagée entre les 3 façades publiques
│   ├── tx-client.ts                            # TxClient partagé (V21-4A, T-2)
│   └── product-type-row.ts                     # ProductTypeRow canonique intra-domaine (V21-4A)
├── queries/
│   ├── read-product-type.ts                    # readProductTypeInTx (V21-4A)
│   ├── count-variants.ts                       # countVariantsInTx (V21-4A)
│   ├── product-exists.ts                       # productExistsInTx (V21-4B)
│   └── variant-exists.ts                       # variantExistsInTx (V21-4B)
└── helpers/
    ├── ensure-categories.ts                    # ensureCategoriesExistInTx (V21-4A)
    ├── replace-categories.ts                   # replaceProductCategoriesInTx (V21-4A)
    ├── clear-default-variant.ts                # clearDefaultVariantInTx (V21-4B)
    └── clear-primary-image.ts                  # clearPrimaryImageInScopeTx (V21-4B)
```

#### `admin-category/` — V21-5

```text
db/repositories/
├── admin-category.repository.ts                # façade publique — stable
├── admin-category.types.ts                     # façade publique de types
└── admin-category/
    ├── queries/
    │   └── representative-image.queries.ts     # loadRepresentativeImagesByCategoryIds
    └── helpers/
        └── sort.ts                             # sortCategoriesForAdmin, isRepresentativeImageCandidateBetter
```

#### `admin-homepage/` — V21-5

```text
db/repositories/
├── admin-homepage.repository.ts                # façade publique — stable
├── admin-homepage.types.ts                     # façade publique de types
└── admin-homepage/
    ├── types/
    │   └── tx.ts                               # TxClient extrait (V21-5, T-2 appliqué)
    ├── queries/
    │   ├── featured-selections.queries.ts      # listHomepageFeaturedProducts, listHomepageFeaturedCategories,
    │   │                                       # listHomepageFeaturedBlogPosts, loadHomepageFeaturedSelections
    │   └── homepage-options.queries.ts         # loadHomepageOptions
    └── helpers/
        ├── transaction-guards.ts               # ensureHomepageExistsInTx, ensurePublishedProductsExistInTx,
        │                                       # ensureCategoriesExistInTx, ensurePublishedBlogPostsExistInTx
        └── transaction-writes.ts               # replaceHomepageFeaturedProductsInTx,
                                                # replaceHomepageFeaturedCategoriesInTx,
                                                # replaceHomepageFeaturedBlogPostsInTx
```

#### `guest-cart/` — V21-5

```text
db/repositories/
├── guest-cart.repository.ts                    # façade publique — stable
├── guest-cart.types.ts                         # façade publique de types
└── guest-cart/
    └── helpers/
        ├── availability.ts                     # isGuestCartVariantAvailable, isGuestCartLineAvailable
        ├── mappers.ts                          # mapPrismaVariant, mapPrismaCartLine, mapPrismaCheckoutDetails
        └── cart-builder.ts                     # buildGuestCart, getGuestCheckoutIssues
```

### Domaines volontairement plats après V21

```text
db/repositories/
├── payment.repository.ts                       # plat — NO-GO V21-5 : transactions Serializable critiques
├── order-email.repository.ts                   # plat — NO-GO V21-5 : 119 lignes, responsabilité unique
├── admin-blog.repository.ts                    # plat — NO-GO V21-5 : blocs trop couplés, règle de prudence
├── admin-users.repository.ts                   # plat — NO-GO V21-5 : 59 lignes, responsabilité unique
└── admin-media.repository.ts                   # plat — NO-GO V21-5 : 70 lignes, responsabilité unique
```

---

## Point 2 — Façades publiques conservées

Liste exhaustive des fichiers `*.repository.ts` et `*.types.ts` qui restent des points d'entrée stables après V21. Ces fichiers ne bougent pas. Leurs chemins d'import sont inchangés. Les consumers n'ont pas été recâblés.

| Fichier | Chemin public stable |
|---|---|
| `catalog.repository.ts` | `db/repositories/catalog/catalog.repository` |
| `catalog.types.ts` | `db/repositories/catalog/catalog.types` |
| `order.repository.ts` | `db/repositories/order.repository` |
| `order.types.ts` | `db/repositories/order.types` |
| `order-email.repository.ts` | `db/repositories/order-email.repository` |
| `order-email.types.ts` | `db/repositories/order-email.types` |
| `admin-product.repository.ts` | `db/repositories/products/admin-product.repository` |
| `admin-product.types.ts` | `db/repositories/products/admin-product.types` |
| `admin-product-variant.repository.ts` | `db/repositories/products/admin-product-variant.repository` |
| `admin-product-variant.types.ts` | `db/repositories/products/admin-product-variant.types` |
| `admin-product-image.repository.ts` | `db/repositories/products/admin-product-image.repository` |
| `admin-product-image.types.ts` | `db/repositories/products/admin-product-image.types` |
| `admin-category.repository.ts` | `db/repositories/admin-category.repository` |
| `admin-category.types.ts` | `db/repositories/admin-category.types` |
| `admin-homepage.repository.ts` | `db/repositories/admin-homepage.repository` |
| `admin-homepage.types.ts` | `db/repositories/admin-homepage.types` |
| `guest-cart.repository.ts` | `db/repositories/guest-cart.repository` |
| `guest-cart.types.ts` | `db/repositories/guest-cart.types` |
| `payment.repository.ts` | `db/repositories/payment.repository` |
| `payment.types.ts` | `db/repositories/payment.types` |
| `admin-blog.repository.ts` | `db/repositories/admin-blog.repository` |
| `admin-blog.types.ts` | `db/repositories/admin-blog.types` |
| `admin-users.repository.ts` | `db/repositories/admin-users.repository` |
| `admin-users.types.ts` | `db/repositories/admin-users.types` |
| `admin-media.repository.ts` | `db/repositories/admin-media.repository` |
| `admin-media.types.ts` | `db/repositories/admin-media.types` |

---

## Point 3 — Sous-dossiers internes réellement introduits par domaine

| Domaine | Lot | Sous-dossier créé | Contenu principal |
|---|---|---|---|
| catalog | V21-2A | `catalog/types/` | `outputs.ts` — outputs publics de la façade |
| catalog | V21-2A | `catalog/helpers/` | `primary-image.ts`, `category-representative-image.ts` |
| catalog | V21-2A | `catalog/queries/` | `homepage.queries.ts`, `blog.queries.ts`, `recent-products.queries.ts` |
| catalog | V21-2B | `catalog/helpers/` (extension) | `product-summary.ts` — `mapPublishedProductSummaryRecord` (effet de bord structurel) |
| catalog | V21-2B | `catalog/queries/` (extension) | `catalog-listing.queries.ts`, `product-detail.queries.ts` |
| order | V21-3 | `orders/types/` | `internal.ts` — TxClient + types internes transactionnels ; `public.ts` — contrats publics ré-exportés par `order.types.ts` |
| order | V21-3 | `orders/queries/` | `order-reads.queries.ts` |
| order | V21-3 | `orders/helpers/` | `mappers.ts`, `transactions.ts`, `validation.ts` |
| products | V21-4A | `products/types/` | `tx-client.ts`, `product-type-row.ts` |
| products | V21-4A | `products/queries/` | `read-product-type.ts`, `count-variants.ts` |
| products | V21-4A | `products/helpers/` | `ensure-categories.ts`, `replace-categories.ts` |
| products | V21-4B | `products/queries/` (extension) | `product-exists.ts`, `variant-exists.ts` |
| products | V21-4B | `products/helpers/` (extension) | `clear-default-variant.ts`, `clear-primary-image.ts` |
| admin-category | V21-5 | `admin-category/queries/` | `representative-image.queries.ts` |
| admin-category | V21-5 | `admin-category/helpers/` | `sort.ts` |
| admin-homepage | V21-5 | `admin-homepage/types/` | `tx.ts` — alias TxClient |
| admin-homepage | V21-5 | `admin-homepage/queries/` | `featured-selections.queries.ts`, `homepage-options.queries.ts` |
| admin-homepage | V21-5 | `admin-homepage/helpers/` | `transaction-guards.ts`, `transaction-writes.ts` |
| guest-cart | V21-5 | `guest-cart/helpers/` | `availability.ts`, `mappers.ts`, `cart-builder.ts` |

---

## Point 4 — Domaines volontairement laissés plats

| Domaine | Fichier | Motif |
|---|---|---|
| payment | `payment.repository.ts` | NO-GO V21-5 : 167 lignes, deux transactions `Serializable` à criticité élevée (idempotence webhooks Stripe), responsabilité cohérente (cycle de vie paiement), aucun bloc extractible sans risque |
| order-email | `order-email.repository.ts` | NO-GO V21-5 : 119 lignes, responsabilité unique (CRUD événements email commande), trop compact |
| admin-blog | `admin-blog.repository.ts` | NO-GO V21-5 : 221 lignes mais blocs trop couplés (mappers interdépendants, transaction intégrée à l'orchestration), règle de prudence V21 appliquée |
| admin-users | `admin-users.repository.ts` | NO-GO V21-5 : 59 lignes, responsabilité unique (accès utilisateurs admin) |
| admin-media | `admin-media.repository.ts` | NO-GO V21-5 : 70 lignes, responsabilité unique (CRUD assets média) |
| simple-product-compat | `products/simple-product-compat.ts` | hors périmètre V21 explicite — invariant préservé, non modifié, non restructuré |
| admin-product-image | `products/admin-product-image.repository.ts` | reste une façade publique plate : pas de sous-dossier propre après V21-4B ; ses blocs extraits vivent dans `products/` partagé avec les autres façades du domaine (T-2 : TxClient reste défini localement car fichier non modularisé) |

---

## Point 5 — Asymétries assumées

Les asymétries suivantes sont des choix, non des dettes.

**`catalog` vs `order` vs `products` : structures internes différentes.** Chaque domaine a sa propre arborescence interne, adaptée à ses blocs réels. `catalog` est une façade de lecture agrégée sans mutation. `order` centralise des flux transactionnels lourds. `products` partage des sous-dossiers internes entre trois façades publiques. Aucune structure uniforme n'est imposée.

**Le répertoire `db/repositories/products/` porte à la fois trois façades publiques et des sous-dossiers internes partagés.** Trois façades publiques (`admin-product`, `admin-product-variant`, `admin-product-image`) cohabitent avec `types/`, `queries/` et `helpers/`. `admin-product-image.repository.ts` ne crée pas de sous-dossier propre : ses blocs extraits (`productExistsInTx`, `variantExistsInTx`, `clearPrimaryImageInScopeTx`) vivent dans cette structure partagée. C'est une asymétrie intentionnelle : 3 façades publiques, 1 structure interne commune.

**`orders/` (pluriel) comme sous-dossier interne de `order.repository.ts` (singulier).** L'asymétrie de nommage entre la façade publique (`order.repository.ts` au singulier) et le sous-dossier interne (`orders/` au pluriel) est documentée et intentionnelle. Ce sous-dossier préexistait à V21-3.

**`guest-cart` n'a que `helpers/`, pas de `queries/` ni `types/`.** Les blocs extraits de `guest-cart` sont purement mémoire : helpers de disponibilité, mappers Prisma → contrat, agrégation de panier. Aucune requête Prisma n'est extraite dans un fichier `queries/` séparé. Aucun alias `TxClient` n'est utilisé. La structure reflète la nature réelle des extractions, pas une symétrie attendue avec d'autres domaines.

**`catalog.mappers.ts` non extrait.** Décision V21-2B (Décision 4). Le fichier reste à la racine du dossier `catalog/` après V21-2B. Son redécoupage est hors périmètre V21.

**`mapPublishedProductSummaryRecord`, `getNativeSimpleOfferFields`, `getPublishedProductIdsMatchingVariantColor` quittent la façade en V21-2B.** Ces trois fonctions ne sont pas "volontairement hors périmètre" : elles quittent `catalog.repository.ts` comme effet de bord structurel nécessaire de l'extraction de leurs appelants directs. Les garder en façade après extraction de leurs appelants créerait un cycle import interne → façade, interdit par la doctrine V21. Elles ne figurent pas dans les exclusions V21 (Point 7).

**`admin-homepage` a un sous-dossier `types/` alors que `admin-category` n'en a pas.** `admin-homepage` utilise un alias `TxClient` — la décision T-2 impose son extraction dans `types/` dès lors que le domaine est modularisé. `admin-category` n'utilise pas d'alias `TxClient` — la règle T-2 ne s'applique pas. Les structures `types/` ne sont pas ajoutées par symétrie.

---

## Point 6 — Critères de fin réels de V21

### Lots exécutés

**V21-2B — terminé quand :**
- Ces 5 fonctions ont quitté `catalog.repository.ts` : `listPublishedProducts`, `getPublishedProductBySlug`, `loadPublishedVariantOffersByProductIds`, `buildPublishedProductsWhere`, `getPublishedProductsOrderBy`
- Elles sont déléguées vers de nouveaux fichiers dans `catalog/queries/`
- Ces 3 fonctions ont quitté la façade comme effet de bord structurel nécessaire : `getNativeSimpleOfferFields` et `getPublishedProductIdsMatchingVariantColor` vers `catalog/queries/`, `mapPublishedProductSummaryRecord` vers `catalog/helpers/product-summary.ts`
- Les exports publics de `catalog.repository.ts` et `catalog.types.ts` sont identiques avant et après

**V21-3 — terminé quand :**
- Les helpers de transaction sont sortis dans `db/repositories/orders/helpers/transactions.ts`
- Les lectures internes (publiques et admin) sont sorties dans `db/repositories/orders/queries/order-reads.queries.ts`
- Les mappers de lignes de commande et de paiement sont sortis dans `db/repositories/orders/helpers/mappers.ts`
- `TxClient` et les types transactionnels internes vivent dans `db/repositories/orders/types/internal.ts`
- `order.types.ts` ré-exporte depuis `db/repositories/orders/types/public.ts`
- `order.repository.ts` et `order.types.ts` restent façades publiques stables
- L'isolation `Serializable`, le retry de génération de référence et le restock sont préservés

**V21-4A — terminé quand :**
- Ces 6 blocs ont quitté `admin-product.repository.ts` : `TxClient` → `products/types/tx-client.ts`, `AdminProductTypeRow` (renommé `ProductTypeRow`) → `products/types/product-type-row.ts`, `readProductTypeInTx` → `products/queries/read-product-type.ts`, `countVariantsInTx` → `products/queries/count-variants.ts`, `ensureCategoriesExistInTx` → `products/helpers/ensure-categories.ts`, `replaceProductCategoriesInTx` → `products/helpers/replace-categories.ts`
- Les exports publics de `admin-product.repository.ts` et `admin-product.types.ts` sont identiques avant et après
- `admin-product-variant.repository.ts` n'est pas modifié dans ce lot

**V21-4B — terminé quand :**
- `admin-product-variant.repository.ts` : `ProductCompatibilityRow` remplacé par import `ProductTypeRow`, `readProductTypeInTx` et `countVariantsInTx` remplacés par imports, `clearDefaultVariantInTx` extrait → `products/helpers/clear-default-variant.ts`
- `admin-product-image.repository.ts` : `productExistsInTx` → `products/queries/product-exists.ts`, `variantExistsInTx` → `products/queries/variant-exists.ts`, `clearPrimaryImageInScopeTx` → `products/helpers/clear-primary-image.ts`
- Les exports publics de toutes les façades `products` sont identiques avant et après
- La logique `is_default` et `is_primary` est inchangée

**V21-5 — terminé quand :**
- `admin-category` : `loadRepresentativeImagesByCategoryIds` extrait dans `queries/representative-image.queries.ts`, `sortCategoriesForAdmin` et `isRepresentativeImageCandidateBetter` extraits dans `helpers/sort.ts`
- `admin-homepage` : lectures sélections dans `queries/featured-selections.queries.ts`, options éditeur dans `queries/homepage-options.queries.ts`, validations transactionnelles dans `helpers/transaction-guards.ts`, écritures transactionnelles dans `helpers/transaction-writes.ts`, `TxClient` dans `types/tx.ts`
- `guest-cart` : disponibilité dans `helpers/availability.ts`, mappers dans `helpers/mappers.ts`, agrégation panier dans `helpers/cart-builder.ts`
- Les domaines `payment`, `order-email`, `admin-blog`, `admin-users`, `admin-media` sont intacts

### Vérifications transversales

- `pnpm run typecheck` passe sans erreur
- `pnpm run lint` passe sans erreur
- Aucun consumer dans `app/`, `features/`, `components/` n'a été recâblé
- Tous les chemins d'import publics existants avant V21 sont toujours valides

### Documentation

- `docs/v21/decisions/` contient une fiche pour chaque lot : v21-2a, v21-2b, v21-4a, v21-4b, v21-5, cross-lots
- `docs/v21/architecture/` reflète l'état réel livré (pas l'état projeté)
- Ce document (`v21-final-state.md`) a été mis à jour pour refléter ce qui a réellement été livré vs ce qui était projeté

---

## Point 7 — Ce qui reste explicitement hors V21

- Harmonisation de `AdminProductImageRepositoryError` avec les autres types d'erreur du domaine `products` (dette gelée — T-4)
- Extraction de `catalog.mappers.ts`
- Extraction de `mapFeaturedCategoryRecord` hors de `catalog.repository.ts`
- Extraction de `loadAdminProductDetailInTx` hors de `admin-product.repository.ts`
- Extraction de `setPrimaryImageInScopeTx` hors de `admin-product-image.repository.ts`
- Modularisation de `payment`, `order-email`, `admin-blog`, `admin-users`, `admin-media`
- Modification de `simple-product-compat.ts`
- Modification des contrats publics, signatures runtime, ou chemins d'import consumers
- Toute évolution du schéma Prisma
- Toute introduction d'une couche `services/` ou d'une abstraction cross-domain

---

## Vérifications obligatoires

Vérifications attendues à fermeture de V21 :

- `pnpm run typecheck`
- `pnpm run lint`
- vérification des façades publiques conservées
- vérification de l'absence de raw SQL
- vérification documentaire de cohérence avec les lots réellement livrés

## Compatibilité publique

- conservation des façades publiques `*.repository.ts`
- conservation des façades publiques `*.types.ts`
- consumers `app/` et `features/` non cassés par la modularisation interne
