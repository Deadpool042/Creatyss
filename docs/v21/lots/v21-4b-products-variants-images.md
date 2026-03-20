# V21-4B — `products` : variantes et images

## Summary

V21-4B est le lot prévu pour modulariser les deux façades publiques techniques du domaine `products` :

- [admin-product-variant.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/admin-product-variant.repository.ts)
- [admin-product-image.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/admin-product-image.repository.ts)

## Objectif

Clarifier les règles internes liées aux variantes et aux images sans modifier :

- les contrats publics admin
- les règles `is_default`
- les règles `is_primary`
- le scope de l'image primaire produit vs variante
- la compatibilité admin existante

## Audit de départ / contexte réel

État réel actuel :

- `admin-product-variant.repository.ts` : 303 lignes
- `admin-product-variant.types.ts` : 50 lignes
- `admin-product-image.repository.ts` : 345 lignes
- `admin-product-image.types.ts` : 50 lignes

Les responsabilités actuellement portées par ces façades sont :

- gestion du variant par défaut
- validation des règles de création/suppression de variante selon le type produit
- synchronisation de l'offre simple native depuis la variante legacy
- gestion des images dans deux scopes distincts :
  - scope produit
  - scope variante

## Périmètre exact

V21-4B doit couvrir :

- la modularisation interne de `admin-product-variant.repository.ts`
- la modularisation interne de `admin-product-image.repository.ts`
- l'introduction de queries/helpers/types internes si le gain est lisible

## Hors périmètre exact

V21-4B ne doit pas couvrir :

- une modification de `simple-product-compat.ts`
- une modification des façades publiques produits déjà stabilisées en V21-4A
- une modification des contrats publics admin variantes ou images
- un changement de logique de publication produit

## Fichiers potentiellement concernés

- `db/repositories/products/admin-product-variant.repository.ts`
- `db/repositories/products/admin-product-variant.types.ts`
- `db/repositories/products/admin-product-image.repository.ts`
- `db/repositories/products/admin-product-image.types.ts`
- nouveaux fichiers internes sous `db/repositories/products/queries/`
- nouveaux fichiers internes sous `db/repositories/products/helpers/`
- nouveaux fichiers internes sous `db/repositories/products/types/`

## Invariants à préserver

Invariants critiques :

- unicité du variant `is_default` par produit
- règles de suppression/création de variante selon le type produit
- unicité de `is_primary` dans le bon scope
- séparation stricte entre scope produit et scope variante pour les images
- compatibilité admin sur les signatures et contrats d'image/variante

## Risques principaux

Risques principaux :

- casser la remise à zéro du variant par défaut
- casser la remise à zéro des images primaires dans le mauvais scope
- casser la validation d'appartenance variante ↔ produit
- casser la synchronisation de compatibilité simple produit

## Vérifications obligatoires

- `pnpm run typecheck`
- `pnpm run lint`
- vérification ciblée des façades variantes et images
- vérification ciblée des invariants `is_default` et `is_primary`

## État du domaine `products/` au démarrage de V21-4B

V21-4A a créé les fichiers suivants. V21-4B peut les importer mais ne les modifie pas. V21-4B suppose V21-4A terminé et vérifié (`typecheck` et `lint` passants).

| Fichier | Export principal |
|---|---|
| `db/repositories/products/types/tx-client.ts` | `TxClient` |
| `db/repositories/products/types/product-type-row.ts` | `ProductTypeRow` |
| `db/repositories/products/queries/read-product-type.ts` | `readProductTypeInTx` |
| `db/repositories/products/queries/count-variants.ts` | `countVariantsInTx` |
| `db/repositories/products/helpers/ensure-categories.ts` | `ensureCategoriesExistInTx` |
| `db/repositories/products/helpers/replace-categories.ts` | `replaceProductCategoriesInTx` |

## Exports publics avant V21-4B

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

## Exports publics après V21-4B

Les exports publics de `admin-product-variant.repository.ts`, `admin-product-variant.types.ts`, `admin-product-image.repository.ts` et `admin-product-image.types.ts` sont **identiques** avant et après le lot.

C'est l'invariant central de V21-4B. Aucune fonction, aucun type, aucune classe n'est ajouté ou supprimé de la surface publique. Aucun consumer dans `app/`, `features/` ou `components/` ne doit être modifié.

Les fichiers créés dans `products/types/`, `products/queries/` et `products/helpers/` sont des fichiers internes. Ils ne constituent pas de nouveaux points d'entrée publics du domaine.

## Cartographie des blocs

### `admin-product-variant.repository.ts`

#### Blocs extraits ou remplacés par import

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `ProductCompatibilityRow` | supprimé — remplacé par import | `products/types/product-type-row.ts` (`ProductTypeRow`) | Type intra-domaine canonique créé par V21-4A avec forme strictement identique — résolution de la dette documentée en V21-4A |
| `readProductTypeInTx` | supprimé — remplacé par import | `products/queries/read-product-type.ts` | Définition dupliquée depuis V21-4A — résolution de la dette documentée en V21-4A |
| `countVariantsInTx` | supprimé — remplacé par import | `products/queries/count-variants.ts` | Même motif |
| `clearDefaultVariantInTx` | extrait | `products/helpers/clear-default-variant.ts` | Mutation transactionnelle autonome (~14 lignes), responsabilité unique (enforce unicité `is_default` par produit) — sans couplage vers les types publics |

#### Blocs conservés dans la façade

| Bloc | Motif |
|---|---|
| `mapVariantFromPrisma` | Couplé à `AdminProductVariantStatus` et `AdminProductVariant` depuis `admin-product-variant.types.ts` — l'extraire dans `helpers/` créerait un import d'un fichier interne vers la façade publique de types, en violation de la règle d'import interne |
| `mapVariantPrismaError` | Error mapper produisant des erreurs publiques (`AdminProductVariantRepositoryError`) — décision transverse T-3 |
| `isValidNumericId` | Petite fonction utilitaire (1 ligne) — duplication locale, décision transverse T-1 |
| 4 fonctions publiques | Fonctions publiques exportées — invariant de façade |

### `admin-product-image.repository.ts`

#### Blocs extraits

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `productExistsInTx` | extrait | `products/queries/product-exists.ts` | Lecture pure transactionnelle autonome (~3 lignes corps), responsabilité unique (vérification d'existence produit) — sans couplage vers les types publics |
| `variantExistsInTx` | extrait | `products/queries/variant-exists.ts` | Même motif (vérification d'existence variante avec contrainte produit) |
| `clearPrimaryImageInScopeTx` | extrait | `products/helpers/clear-primary-image.ts` | Mutation transactionnelle autonome (~25 lignes), responsabilité unique (enforce unicité `is_primary` dans le scope correct produit vs variante) — sans couplage vers les types publics |

#### Blocs conservés dans la façade

| Bloc | Motif |
|---|---|
| `setPrimaryImageInScopeTx` | Orchestre un flow complet (lecture + clear + write + mapping) et appelle `mapPrismaProductImage` qui reste en façade — l'extraire dans `helpers/` créerait un import d'un fichier interne vers la façade, inversant la direction d'import (interdit) |
| `PrismaProductImageData` | Type structural aligné sur le retour Prisma, utilisé uniquement dans ce fichier — la doctrine V21 `types/` exclut les types Prisma internes locaux |
| `mapPrismaProductImage` | Couplé à `AdminProductImage` depuis `admin-product-image.types.ts` — même contrainte que `mapVariantFromPrisma` ; utilisé par 5 fonctions publiques et par `setPrimaryImageInScopeTx` |
| `TxClient` | Domaine `admin-product-image` non modularisé dans V21 (pas de sous-dossier interne propre) — décision transverse T-2 : l'alias reste défini localement |
| `isValidNumericId` | Petite fonction utilitaire (1 ligne) — duplication locale, décision transverse T-1 |
| 10 fonctions publiques | Fonctions publiques exportées — invariant de façade |

## Ce qui reste volontairement dans chaque façade après V21-4B

Les éléments suivants restent dans leur façade respective après l'exécution du lot. Leur présence est une décision explicite, non un oubli.

### `admin-product-variant.repository.ts`

- `mapVariantFromPrisma` — couplé à `AdminProductVariantStatus` et `AdminProductVariant` (types publics) ; extraction interdite par la règle d'import interne
- `mapVariantPrismaError` — error mapper produisant des `AdminProductVariantRepositoryError` ; décision transverse T-3
- `isValidNumericId` — 1 ligne, décision transverse T-1
- `listAdminProductVariants`, `createAdminProductVariant`, `updateAdminProductVariant`, `deleteAdminProductVariant` — invariant de façade

### `admin-product-image.repository.ts`

- `setPrimaryImageInScopeTx` — orchestre le flow upsert entier (lecture + clear + write + mapping) ; dépend de `mapPrismaProductImage` qui reste en façade ; extraction inverserait la direction d'import
- `PrismaProductImageData` — type Prisma interne local, non partagé, exclu de `products/types/` par doctrine
- `mapPrismaProductImage` — couplé à `AdminProductImage` (type public) ; extraction interdite par la règle d'import interne
- `TxClient` — décision transverse T-2 : `admin-product-image.repository.ts` reste un fichier plat non modularisé ; l'alias reste défini localement à la ligne 45
- `isValidNumericId` — 1 ligne, décision transverse T-1
- `listAdminProductImages`, `findAdminPrimaryProductImage`, `findAdminPrimaryVariantImage`, `createAdminProductImage`, `upsertAdminPrimaryProductImage`, `upsertAdminPrimaryVariantImage`, `updateAdminProductImage`, `deleteAdminProductImage`, `deleteAdminPrimaryProductImage`, `deleteAdminPrimaryVariantImage` — invariant de façade

## Compatibilité publique

Compatibilité attendue :

- mêmes chemins publics
- mêmes exports publics
- mêmes signatures runtime
- aucune adaptation nécessaire côté admin

## Décisions préalables

**Prérequis strict :** V21-4A est terminé et vérifié (`typecheck` et `lint` passants) avant le début de V21-4B.

**`ProductCompatibilityRow` → import `ProductTypeRow` :** `admin-product-variant.repository.ts` définit `ProductCompatibilityRow` (lignes 19-22), structurellement identique à `ProductTypeRow` extrait dans V21-4A. V21-4A a explicitement documenté cette migration comme dette à résorber en V21-4B. La définition locale est supprimée et remplacée par un import depuis `./types/product-type-row`.

**`readProductTypeInTx` et `countVariantsInTx` → imports depuis `products/queries/` :** ces deux fonctions sont définies localement dans `admin-product-variant.repository.ts` et sont dupliquées des extraits de V21-4A. V21-4B supprime les définitions locales et les remplace par des imports depuis `./queries/read-product-type` et `./queries/count-variants`. Les appels dans le corps des fonctions publiques restent inchangés.

**`clearDefaultVariantInTx` → `products/helpers/clear-default-variant.ts` :** extraction nouvelle dans V21-4B. Mutation transactionnelle autonome sans couplage vers les types publics. Règle C.

**`setPrimaryImageInScopeTx` reste en façade :** décision explicite de ne pas extraire. Ce helper orchestre un flow complet et appelle `mapPrismaProductImage` (qui reste en façade). L'extraction inverserait la direction d'import.

**`TxClient` dans `admin-product-image.repository.ts` reste local :** décision transverse T-2. Ce fichier n'est pas modularisé dans V21 (pas de sous-dossier propre). L'alias reste défini localement à la ligne 45 du fichier.

**`AdminProductImageRepositoryError` reste inchangée :** décision transverse T-4. Sa structure asymétrique par rapport aux autres types d'erreur du domaine est une inconsistance connue, gelée pour toute la durée de V21.

**Règle de duplication locale T-1 :** `isValidNumericId` reste définie localement dans les deux façades. Aucune extraction vers un fichier partagé.

**Error mappers T-3 :** `mapVariantPrismaError` reste dans `admin-product-variant.repository.ts`. Aucun error mapper n'est déplacé vers `helpers/` ou `queries/`.

**Aucune décision n'est reportée à l'exécution.** Toutes les ambiguïtés ont été tranchées dans `docs/v21/decisions/v21-4b-decisions.md`.

## Critères de fin

V21-4B est considéré terminé quand les conditions suivantes sont toutes vérifiées.

**`admin-product-variant.repository.ts` :**

- `ProductCompatibilityRow` a disparu du fichier → remplacé par import de `ProductTypeRow` depuis `products/types/product-type-row.ts`
- `readProductTypeInTx` locale a disparu → remplacée par import depuis `products/queries/read-product-type.ts`
- `countVariantsInTx` locale a disparu → remplacée par import depuis `products/queries/count-variants.ts`
- `clearDefaultVariantInTx` a quitté le fichier → présente dans `products/helpers/clear-default-variant.ts`

**`admin-product-image.repository.ts` :**

- `productExistsInTx` a quitté le fichier → présente dans `products/queries/product-exists.ts`
- `variantExistsInTx` a quitté le fichier → présente dans `products/queries/variant-exists.ts`
- `clearPrimaryImageInScopeTx` a quitté le fichier → présente dans `products/helpers/clear-primary-image.ts`
- `setPrimaryImageInScopeTx` est toujours présente dans la façade (invariant explicite — ne pas extraire)

**Vérifications globales :**

- Les exports publics de `admin-product-variant.repository.ts`, `admin-product-variant.types.ts`, `admin-product-image.repository.ts` et `admin-product-image.types.ts` sont identiques avant et après le lot
- Les fichiers internes sous `products/` importent depuis `products/types/` uniquement — jamais depuis `admin-product-variant.types.ts` ni depuis `admin-product-image.types.ts`
- `admin-product-image.repository.ts` conserve `TxClient` défini localement (invariant T-2)
- `pnpm run typecheck` passe
- `pnpm run lint` passe
