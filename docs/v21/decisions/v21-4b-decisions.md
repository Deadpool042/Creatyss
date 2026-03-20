# Décisions V21-4B — `products` : variantes et images

## Section 1 — Portée

Ce document décrit les décisions d'extraction pour le lot V21-4B uniquement.

Il complète `v21-cross-lots-decisions.md`. Les décisions transverses T-1 à T-4 s'appliquent sans exception à ce lot et ne sont pas répétées ici sauf quand une application concrète mérite d'être explicitée.

Ce document couvre exclusivement `admin-product-variant.repository.ts` et `admin-product-image.repository.ts`, ainsi que les nouveaux fichiers internes créés sous `db/repositories/products/` dans le cadre de ce lot. Il ne couvre pas `admin-product.repository.ts` ni `simple-product-compat.ts`, qui sont hors périmètre V21-4B.

---

## Section 2 — État du domaine `products/` au démarrage de V21-4B

V21-4A a créé les fichiers suivants. V21-4B peut les importer mais ne les modifie pas.

| Fichier | Export principal | Utilisable par |
|---|---|---|
| `products/types/tx-client.ts` | `TxClient` | Fichiers internes du domaine |
| `products/types/product-type-row.ts` | `ProductTypeRow` | Fichiers internes du domaine |
| `products/queries/read-product-type.ts` | `readProductTypeInTx` | Fichiers internes du domaine |
| `products/queries/count-variants.ts` | `countVariantsInTx` | Fichiers internes du domaine |
| `products/helpers/ensure-categories.ts` | `ensureCategoriesExistInTx` | Fichiers internes du domaine |
| `products/helpers/replace-categories.ts` | `replaceProductCategoriesInTx` | Fichiers internes du domaine |

Ces fichiers sont considérés présents et stables au démarrage de V21-4B. Aucune vérification de leur contenu n'est incluse dans le périmètre de ce lot.

---

## Section 3 — Exports publics avant V21-4B

### Fonctions exportées depuis `admin-product-variant.repository.ts`

| Fonction | Signature résumée |
|---|---|
| `listAdminProductVariants` | `(productId: string) => Promise<AdminProductVariant[]>` |
| `createAdminProductVariant` | `(input: CreateAdminProductVariantInput) => Promise<AdminProductVariant \| null>` |
| `updateAdminProductVariant` | `(input: UpdateAdminProductVariantInput) => Promise<AdminProductVariant \| null>` |
| `deleteAdminProductVariant` | `(productId: string, variantId: string) => Promise<boolean>` |

### Types et classes exportés depuis `admin-product-variant.types.ts`

| Export | Nature |
|---|---|
| `AdminProductVariantStatus` | type alias (`"draft" \| "published"`) |
| `CreateAdminProductVariantInput` | type |
| `UpdateAdminProductVariantInput` | type |
| `AdminProductVariantRepositoryErrorCode` | type union |
| `AdminProductVariant` | type |
| `AdminProductVariantRepositoryError` | classe |

### Fonctions exportées depuis `admin-product-image.repository.ts`

| Fonction | Signature résumée |
|---|---|
| `listAdminProductImages` | `(productId: string) => Promise<AdminProductImage[]>` |
| `findAdminPrimaryProductImage` | `(productId: string) => Promise<AdminProductImage \| null>` |
| `findAdminPrimaryVariantImage` | `(productId: string, variantId: string) => Promise<AdminProductImage \| null>` |
| `createAdminProductImage` | `(input: CreateAdminProductImageInput) => Promise<AdminProductImage \| null>` |
| `upsertAdminPrimaryProductImage` | `(input: UpsertAdminPrimaryProductImageInput) => Promise<AdminProductImage \| null>` |
| `upsertAdminPrimaryVariantImage` | `(input: UpsertAdminPrimaryVariantImageInput) => Promise<AdminProductImage \| null>` |
| `updateAdminProductImage` | `(input: UpdateAdminProductImageInput) => Promise<AdminProductImage \| null>` |
| `deleteAdminProductImage` | `(productId: string, imageId: string) => Promise<boolean>` |
| `deleteAdminPrimaryProductImage` | `(productId: string) => Promise<boolean>` |
| `deleteAdminPrimaryVariantImage` | `(productId: string, variantId: string) => Promise<boolean>` |

### Types et classes exportés depuis `admin-product-image.types.ts`

| Export | Nature |
|---|---|
| `AdminProductImage` | type |
| `CreateAdminProductImageInput` | type |
| `UpdateAdminProductImageInput` | type |
| `UpsertAdminPrimaryProductImageInput` | type |
| `UpsertAdminPrimaryVariantImageInput` | type |
| `AdminProductImageRepositoryErrorCode` | type alias (`"variant_missing"`) |
| `AdminProductImageRepositoryError` | classe |

---

## Section 4 — Exports publics après V21-4B

Les exports publics de `admin-product-variant.repository.ts`, `admin-product-variant.types.ts`, `admin-product-image.repository.ts` et `admin-product-image.types.ts` sont **identiques** avant et après le lot.

C'est l'invariant central de V21-4B. Aucune fonction, aucun type, aucune classe n'est ajouté ou supprimé de la surface publique. Aucun consumer dans `app/`, `features/` ou `components/` ne doit être modifié.

Les fichiers extraits dans `types/`, `queries/` et `helpers/` sont des fichiers internes. Ils ne constituent pas de nouveaux points d'entrée publics du domaine.

---

## Section 5 — Décisions bloc par bloc — `admin-product-variant.repository.ts`

### Types locaux

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `ProductCompatibilityRow` | supprimé — remplacé par import | `products/types/product-type-row.ts` (`ProductTypeRow`) | Type intra-domaine canonique créé par V21-4A avec forme strictement identique — dette documentée en V21-4A Section 7, résorption dans le périmètre de V21-4B (voir Section 7) |

### Helpers internes — petites fonctions utilitaires

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `isValidNumericId` | reste en façade | — | Petite fonction utilitaire (1 ligne) — duplication locale, décision transverse T-1 |

### Mapper de lecture

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `mapVariantFromPrisma` | reste en façade | — | Mapper couplé à `AdminProductVariantStatus` importé depuis la façade publique `admin-product-variant.types.ts` ; l'extraire dans `helpers/` créerait un import d'un fichier interne vers la façade publique de types, en violation de la règle d'import interne (voir Section 5, note ci-dessous) |

Note sur `mapVariantFromPrisma` : la règle d'import interne V21 interdit aux fichiers internes (`helpers/`, `queries/`) d'importer depuis la façade publique `*.types.ts`. `mapVariantFromPrisma` retourne un `AdminProductVariant` et cast `status` en `AdminProductVariantStatus` — deux types définis dans `admin-product-variant.types.ts`. Son extraction nécessiterait soit l'import depuis la façade publique (interdit), soit la duplication des types dans `products/types/` (hors périmètre V21-4B). Elle reste donc en façade.

### Error mapper

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `mapVariantPrismaError` | reste en façade | — | Error mapper produisant des erreurs publiques (`AdminProductVariantRepositoryError`) — décision transverse T-3 |

### Lectures transactionnelles

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `readProductTypeInTx` | remplacé par import | `products/queries/read-product-type.ts` | Définition dupliquée depuis V21-4A — dette documentée en V21-4A Section 7, résorption dans le périmètre de V21-4B (voir Section 7) |
| `countVariantsInTx` | remplacé par import | `products/queries/count-variants.ts` | Même motif |

### Helper transactionnel de mutation

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `clearDefaultVariantInTx` | extrait | `products/helpers/clear-default-variant.ts` | Mutation transactionnelle autonome (~14 lignes), responsabilité unique (enforce unicité `is_default` par produit) — Règle C ; sans couplage vers la façade publique de types |

### Fonctions publiques

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `listAdminProductVariants` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `createAdminProductVariant` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `updateAdminProductVariant` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `deleteAdminProductVariant` | reste en façade | — | Fonction publique exportée — invariant de façade |

---

## Section 6 — Décisions bloc par bloc — `admin-product-image.repository.ts`

### Type structural interne

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `PrismaProductImageData` | reste en façade | — | Type structural aligné sur le retour Prisma, utilisé uniquement dans ce fichier ; la doctrine V21 `types/` exclut explicitement les rows privées et les types Prisma internes |

### Helpers internes — petites fonctions utilitaires

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `isValidNumericId` | reste en façade | — | Petite fonction utilitaire (1 ligne) — duplication locale, décision transverse T-1 |

### Mapper de lecture

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `mapPrismaProductImage` | reste en façade | — | Mapper couplé à `AdminProductImage` importé depuis la façade publique `admin-product-image.types.ts` ; même contrainte que `mapVariantFromPrisma` — l'extraction créerait un import d'un fichier interne vers la façade publique de types, en violation de la règle d'import interne ; utilisé par 5 fonctions publiques et par `setPrimaryImageInScopeTx` |

### Alias de type transactionnel

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `TxClient` | reste en façade | — | Domaine `admin-product-image` non modularisé dans V21 (pas de sous-dossier interne propre) — décision transverse T-2 : l'alias reste défini localement ; `products/types/tx-client.ts` appartient au domaine modularisé `products` créé par V21-4A et ne doit pas être importé depuis un fichier qui conserve sa structure plate |

Note sur `TxClient` : `admin-product-image.repository.ts` reste une façade plate. Elle n'a pas de sous-dossier interne après V21-4B. La décision T-2 est explicite : extraire `TxClient` uniquement si le domaine est modularisé (sous-dossier créé). Ce fichier ne crée pas de sous-dossier propre et les helpers/queries extraits vont dans le sous-dossier `products/` partagé. L'alias reste défini localement à la ligne 45 du fichier.

### Lectures transactionnelles

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `productExistsInTx` | extrait | `products/queries/product-exists.ts` | Lecture pure transactionnelle autonome (~3 lignes corps), responsabilité unique (vérification d'existence produit) — Règle B ; utilisée par 3 fonctions publiques |
| `variantExistsInTx` | extrait | `products/queries/variant-exists.ts` | Même motif (vérification d'existence variante avec contrainte produit) — Règle B ; utilisée par 2 fonctions publiques |

### Helpers transactionnels de mutation

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `clearPrimaryImageInScopeTx` | extrait | `products/helpers/clear-primary-image.ts` | Mutation transactionnelle autonome (~25 lignes), responsabilité unique (enforce unicité `is_primary` dans le scope correct produit vs variante) — Règle C ; sans couplage vers la façade publique de types ; appelée par `setPrimaryImageInScopeTx` et directement par `createAdminProductImage` et `updateAdminProductImage` |
| `setPrimaryImageInScopeTx` | reste en façade | — | Orchestre plusieurs opérations : lecture de l'état courant, appel à `clearPrimaryImageInScopeTx`, création ou mise à jour Prisma, puis mappage via `mapPrismaProductImage` ; ce dernier appel vers `mapPrismaProductImage` (qui reste en façade) crée un couplage façade→façade ; l'extraire dans `helpers/` diluerait la lecture du flow upsert sans gain structurel net |

Note sur `clearPrimaryImageInScopeTx` et `setPrimaryImageInScopeTx` : ces deux fonctions sont le cœur du risque principal identifié dans `v21-4b-products-variants-images.md` (« casser la remise à zéro des images primaires dans le mauvais scope »). La décision d'extraire `clearPrimaryImageInScopeTx` seule — sans `setPrimaryImageInScopeTx` — repose sur l'observation suivante : `clearPrimaryImageInScopeTx` ne fait que des mutations Prisma avec un filtre de scope ; elle n'accède à aucun type public. `setPrimaryImageInScopeTx` orchestre un flow complet (lecture + clear + write + mapping) et appelle `mapPrismaProductImage`, qui reste en façade. Si les deux étaient extraites ensemble, `setPrimaryImageInScopeTx` devrait importer `mapPrismaProductImage` depuis la façade, inversant la direction d'import (interdit). La séparation retenue est : `clearPrimaryImageInScopeTx` dans `helpers/`, `setPrimaryImageInScopeTx` en façade.

### Fonctions publiques

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `listAdminProductImages` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `findAdminPrimaryProductImage` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `findAdminPrimaryVariantImage` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `createAdminProductImage` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `upsertAdminPrimaryProductImage` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `upsertAdminPrimaryVariantImage` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `updateAdminProductImage` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `deleteAdminProductImage` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `deleteAdminPrimaryProductImage` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `deleteAdminPrimaryVariantImage` | reste en façade | — | Fonction publique exportée — invariant de façade |

---

## Section 7 — Réutilisation des fichiers V21-4A

### `ProductCompatibilityRow` → import depuis `products/types/product-type-row.ts`

**Décision : oui, dans le périmètre de V21-4B.**

`ProductCompatibilityRow` (lignes 19-22 de `admin-product-variant.repository.ts`) est structurellement identique à `ProductTypeRow` extrait dans `products/types/product-type-row.ts` par V21-4A. V21-4A a explicitement documenté cette migration comme dette à résorber en V21-4B (Section 7 de `v21-4a-decisions.md`).

V21-4B supprime la définition locale de `ProductCompatibilityRow` dans `admin-product-variant.repository.ts` et introduit un import depuis `./types/product-type-row` (ou `../types/product-type-row` selon la résolution effective).

Conséquence sur `readProductTypeInTx` local : sa signature de retour référençait `ProductCompatibilityRow`. Une fois que la définition locale est supprimée et remplacée par l'import de `ProductTypeRow`, la définition locale de `readProductTypeInTx` elle-même disparaît (voir ci-dessous).

### `readProductTypeInTx` et `countVariantsInTx` → import depuis `products/queries/`

**Décision : oui, dans le périmètre de V21-4B.**

V21-4A a extrait ces deux fonctions dans `products/queries/read-product-type.ts` et `products/queries/count-variants.ts`. V21-4A a explicitement documenté la consommation depuis `admin-product-variant.repository.ts` comme reportée à V21-4B (Section 4, note sur les lectures transactionnelles partagées).

V21-4B supprime les définitions locales de `readProductTypeInTx` et `countVariantsInTx` dans `admin-product-variant.repository.ts` et les remplace par des imports depuis les fichiers extraits.

Les appels dans le corps des fonctions publiques (`createAdminProductVariant`, `updateAdminProductVariant`, `deleteAdminProductVariant`) restent inchangés : le nom de fonction et la signature sont identiques.

Règle d'import interne appliquée : les imports proviennent de `./queries/read-product-type` et `./queries/count-variants` (ou `../queries/...` selon la profondeur effective), jamais depuis `admin-product.repository.ts`.

---

## Section 8 — Règles de compatibilité

- Aucun consumer dans `app/`, `features/` ou `components/` ne doit être modifié.
- Les imports depuis `db/repositories/products/admin-product-variant.repository.ts` restent valides et inchangés.
- Les imports depuis `db/repositories/products/admin-product-variant.types.ts` restent valides et inchangés.
- Les imports depuis `db/repositories/products/admin-product-image.repository.ts` restent valides et inchangés.
- Les imports depuis `db/repositories/products/admin-product-image.types.ts` restent valides et inchangés.
- Les chemins publics ne changent pas.
- Les signatures runtime des fonctions publiques ne changent pas.
- `simple-product-compat.ts` n'est pas modifié, renommé ni restructuré.
- `admin-product.repository.ts` n'est pas modifié dans V21-4B.
- La logique de scope `is_primary` (produit vs variante) n'est pas modifiée.
- La logique d'unicité `is_default` par produit n'est pas modifiée.
- `AdminProductImageRepositoryError` n'est pas modifiée — décision transverse T-4.

---

## Section 9 — Hypothèses explicites

- V21-4A est terminé et vérifié avant le début de V21-4B.
- `products/types/tx-client.ts`, `products/types/product-type-row.ts`, `products/queries/read-product-type.ts`, `products/queries/count-variants.ts`, `products/helpers/ensure-categories.ts` et `products/helpers/replace-categories.ts` existent avec les exports décrits en Section 2.
- `admin-product-variant.repository.ts` est dans l'état décrit par ce document au démarrage du lot (303 lignes, 4 fonctions publiques, 7 blocs internes).
- `admin-product-image.repository.ts` est dans l'état décrit par ce document au démarrage du lot (345 lignes, 10 fonctions publiques, 8 blocs internes).
- Aucune modification en cours sur les fichiers couverts par ce lot.
- `typecheck` et `lint` passaient avant le début du lot.
- Les fichiers internes créés par V21-4B (`products/helpers/clear-default-variant.ts`, `products/helpers/clear-primary-image.ts`, `products/queries/product-exists.ts`, `products/queries/variant-exists.ts`) n'existent pas encore au démarrage du lot.

---

## Résumé des décisions

### Décisions `admin-product-variant.repository.ts`

| Bloc | Sort |
|---|---|
| `ProductCompatibilityRow` | supprimé — remplacé par import `ProductTypeRow` depuis `products/types/product-type-row.ts` |
| `isValidNumericId` | reste en façade (T-1) |
| `mapVariantFromPrisma` | reste en façade (couplage types publics) |
| `mapVariantPrismaError` | reste en façade (T-3) |
| `readProductTypeInTx` | supprimé — remplacé par import depuis `products/queries/read-product-type.ts` |
| `countVariantsInTx` | supprimé — remplacé par import depuis `products/queries/count-variants.ts` |
| `clearDefaultVariantInTx` | extrait → `products/helpers/clear-default-variant.ts` |
| 4 fonctions publiques | restent en façade (invariant) |

### Décisions `admin-product-image.repository.ts`

| Bloc | Sort |
|---|---|
| `PrismaProductImageData` | reste en façade (type Prisma interne local) |
| `isValidNumericId` | reste en façade (T-1) |
| `mapPrismaProductImage` | reste en façade (couplage types publics) |
| `TxClient` | reste en façade (T-2 — fichier non modularisé) |
| `productExistsInTx` | extrait → `products/queries/product-exists.ts` |
| `variantExistsInTx` | extrait → `products/queries/variant-exists.ts` |
| `clearPrimaryImageInScopeTx` | extrait → `products/helpers/clear-primary-image.ts` |
| `setPrimaryImageInScopeTx` | reste en façade (orchestre le flow upsert avec mapping public) |
| 10 fonctions publiques | restent en façade (invariant) |

### Nouveaux fichiers créés par V21-4B

| Fichier | Export principal |
|---|---|
| `products/helpers/clear-default-variant.ts` | `clearDefaultVariantInTx` |
| `products/helpers/clear-primary-image.ts` | `clearPrimaryImageInScopeTx` |
| `products/queries/product-exists.ts` | `productExistsInTx` |
| `products/queries/variant-exists.ts` | `variantExistsInTx` |

### Décisions reportées à l'exécution

Aucune décision n'est reportée à l'exécution. Toutes les ambiguïtés identifiées ont été tranchées dans ce document.
