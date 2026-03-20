# Décisions V21-4A — `products` : socle partagé

## Section 1 — Portée

Ce document décrit les décisions d'extraction pour le lot V21-4A uniquement.

Il complète `v21-cross-lots-decisions.md`. Les décisions transverses T-1 à T-4 s'appliquent sans exception à ce lot et ne sont pas répétées ici sauf quand une application concrète mérite d'être explicitée.

Ce document couvre exclusivement `admin-product.repository.ts` et les nouveaux fichiers internes créés sous `db/repositories/products/`. Il ne couvre pas `admin-product-variant.repository.ts`, `admin-product-image.repository.ts` ni `simple-product-compat.ts`, qui font l'objet de lots ultérieurs ou sont hors périmètre V21-4A.

---

## Section 2 — Exports publics avant V21-4A

### Fonctions exportées depuis `admin-product.repository.ts`

| Fonction | Signature résumée |
|---|---|
| `findAdminProductPublishContext` | `(id: string) => Promise<AdminProductPublishContext \| null>` |
| `listAdminProducts` | `() => Promise<AdminProductSummary[]>` |
| `findAdminProductById` | `(id: string) => Promise<AdminProductDetail \| null>` |
| `createAdminProduct` | `(input: CreateAdminProductInput) => Promise<AdminProductDetail>` |
| `updateAdminProduct` | `(input: UpdateAdminProductInput) => Promise<AdminProductDetail \| null>` |
| `updateAdminSimpleProductOffer` | `(input: UpdateAdminSimpleProductOfferInput) => Promise<AdminProductDetail \| null>` |
| `toggleAdminProductStatus` | `(id: string) => Promise<"draft" \| "published" \| null>` |
| `deleteAdminProduct` | `(id: string) => Promise<boolean>` |

### Types et classes exportés depuis `admin-product.types.ts`

| Export | Nature |
|---|---|
| `AdminProductStatus` | type alias (`"draft" \| "published"`) |
| `CreateAdminProductInput` | type |
| `UpdateAdminProductInput` | type |
| `UpdateAdminSimpleProductOfferInput` | type |
| `AdminProductPublishContext` | type |
| `AdminProductRepositoryErrorCode` | type union |
| `AdminProductSummary` | type |
| `AdminProductCategoryAssignment` | type |
| `AdminProductDetail` | type |
| `AdminProductRepositoryError` | classe |

---

## Section 3 — Exports publics après V21-4A

Les exports publics de `admin-product.repository.ts` et de `admin-product.types.ts` sont **identiques** avant et après le lot.

C'est l'invariant central de V21-4A. Aucune fonction, aucun type, aucune classe n'est ajouté ou supprimé de la surface publique. Aucun consumer dans `app/`, `features/` ou `components/` ne doit être modifié.

Les fichiers extraits dans `types/`, `queries/` et `helpers/` sont des fichiers internes. Ils ne constituent pas de nouveaux points d'entrée publics du domaine.

---

## Section 4 — Décisions bloc par bloc

### Types locaux

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `AdminProductTypeRow` | extrait | `products/types/product-type-row.ts` | Type interne utilisé par `readProductTypeInTx` dans les deux repositorys du domaine — partage intra-domaine justifié (voir Section 5) |
| `TxClient` | extrait | `products/types/tx-client.ts` | Domaine `products` modularisé dans V21-4A — décision transverse T-2 : extraction requise |

### Helpers internes — petites fonctions utilitaires

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `isValidProductId` | reste en façade | — | Petite fonction utilitaire (1 ligne) — duplication locale, décision transverse T-1 |
| `normalizeCategoryIds` | reste en façade | — | Petite fonction utilitaire (1 ligne) — duplication locale, décision transverse T-1 |

### Error mapper

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `mapPrismaRepositoryError` | reste en façade | — | Error mapper produisant des erreurs publiques (`AdminProductRepositoryError`) — décision transverse T-3 |

### Fonctions `assert*` — validations métier

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `assertCanSaveAsSimpleProduct` | reste en façade | — | Courte (5 lignes), lance une `AdminProductRepositoryError` publique, extraction n'apporte pas de gain de lisibilité mesurable |
| `assertProductSupportsNativeSimpleOffer` | reste en façade | — | Même motif |
| `assertCompatibleLegacyVariantCountForNativeSimpleOffer` | reste en façade | — | Même motif |

Note : ces trois fonctions sont étroitement couplées aux codes d'erreur publics. Les extraire dans `helpers/` créerait une indirection vers la définition d'erreur publique sans bénéfice structurel. Elles sont appelées dans des flows transactionnels courts et lisibles en contexte.

### Helpers transactionnels

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `ensureCategoriesExistInTx` | extrait | `products/helpers/ensure-categories.ts` | Fonction autonome (~20 lignes), responsabilité unique (lecture + guard catégories), suffisamment volumineuse pour justifier l'extraction |
| `replaceProductCategoriesInTx` | extrait | `products/helpers/replace-categories.ts` | Mutation transactionnelle pure et autonome (deleteMany + createMany) — Règle C |
| `loadAdminProductDetailInTx` | reste en façade | — | Combine lecture Prisma + mapping complet vers `AdminProductDetail` + requête conditionnelle variantes legacy — extraction diluerait la lecture du flow transactionnel (voir Section 4, note ci-dessous) |

Note sur `loadAdminProductDetailInTx` : cette fonction est appelée à la fin de `createAdminProduct`, `updateAdminProduct` et `updateAdminSimpleProductOffer`. Elle est le rechargement transactionnel du détail produit après mutation. Elle porte une logique de mapping identique à `findAdminProductById`, ce qui représente une duplication locale. Cette duplication est acceptée dans V21-4A : la factorisation du mapping est une refactorisation de comportement qui nécessite un lot dédié avec ses propres critères de fin et vérifications.

### Lectures transactionnelles partagées avec `admin-product-variant`

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `readProductTypeInTx` | extrait | `products/queries/read-product-type.ts` | Lecture pure, utilisée dans `admin-product.repository.ts` et `admin-product-variant.repository.ts` — extraction vers `queries/` intra-domaine évite la duplication fonctionnelle (voir Section 5) |
| `countVariantsInTx` | extrait | `products/queries/count-variants.ts` | Même motif |

Note : l'extraction de ces deux fonctions depuis `admin-product.repository.ts` est effectuée dans V21-4A. Leur consommation depuis `admin-product-variant.repository.ts` est reportée à V21-4B, qui gérera la modularisation des variantes. Pendant V21-4A, `admin-product-variant.repository.ts` conserve ses définitions locales de `readProductTypeInTx` et `countVariantsInTx` sans modification.

### Fonctions publiques

| Bloc | Décision | Destination | Motif |
|---|---|---|---|
| `findAdminProductPublishContext` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `listAdminProducts` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `findAdminProductById` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `createAdminProduct` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `updateAdminProduct` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `updateAdminSimpleProductOffer` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `toggleAdminProductStatus` | reste en façade | — | Fonction publique exportée — invariant de façade |
| `deleteAdminProduct` | reste en façade | — | Fonction publique exportée — invariant de façade |

---

## Section 5 — AdminProductTypeRow

### Observation dans le code

`AdminProductTypeRow` est défini dans `admin-product.repository.ts` (lignes 26-29) :

```typescript
type AdminProductTypeRow = {
  id: string;
  product_type: ProductType;
};
```

`admin-product-variant.repository.ts` définit le type identique sous le nom `ProductCompatibilityRow` (lignes 19-22) avec la même forme exacte.

### Question posée

Le type doit-il être partagé entre les deux fichiers, rester dupliqué, ou sa décision est-elle hors périmètre V21-4A ?

### Analyse

La doctrine V21 interdit le partage cross-domain. Elle ne prohibe pas le partage intra-domaine. `admin-product.repository.ts` et `admin-product-variant.repository.ts` sont deux façades du même domaine fonctionnel `products`. La décision T-1 sur la duplication locale vise les petites fonctions utilitaires génériques, pas les types de row Prisma qui structurent un contrat interne partagé entre plusieurs fichiers d'un même domaine.

V21-4A crée le sous-dossier `products/types/`. La création d'un type canonique partagé intra-domaine est cohérente avec cet objectif et ne crée pas de couplage cross-domain.

### Décision

`AdminProductTypeRow` est extrait dans `db/repositories/products/types/product-type-row.ts` sous un nom canonique unique. Le nom retenu est `ProductTypeRow` (sans préfixe domaine, puisque le fichier est déjà dans le sous-dossier `products/types/`).

`admin-product.repository.ts` importe `ProductTypeRow` depuis `./types/product-type-row` et supprime sa définition locale `AdminProductTypeRow`.

`admin-product-variant.repository.ts` conserve sa définition locale `ProductCompatibilityRow` pendant V21-4A. Sa migration vers `ProductTypeRow` est reportée à V21-4B. Cette non-migration temporaire est documentée comme dette connue de V21-4A.

### Règle d'import interne

Les fichiers internes sous `products/` importent `ProductTypeRow` depuis `./types/product-type-row` (ou `../types/product-type-row` selon la profondeur). Ils n'importent jamais ce type depuis `admin-product.types.ts` ni depuis `admin-product-variant.types.ts`.

---

## Section 6 — Règles de compatibilité

- Aucun consumer dans `app/`, `features/` ou `components/` ne doit être modifié.
- Les imports depuis `db/repositories/products/admin-product.repository.ts` restent valides et inchangés.
- Les imports depuis `db/repositories/products/admin-product.types.ts` restent valides et inchangés.
- Les chemins publics ne changent pas.
- Les signatures runtime des fonctions publiques ne changent pas.
- `simple-product-compat.ts` n'est pas modifié, renommé ni restructuré.
- `admin-product-variant.repository.ts` n'est pas modifié dans V21-4A (sauf si un typecheck révèle un problème d'import involontaire, auquel cas la correction est strictement limitée à rétablir la compatibilité).
- `admin-product-image.repository.ts` n'est pas modifié.

---

## Section 7 — Hypothèses explicites

- V21-2A, V21-2B et V21-3 ont été réalisés avant V21-4A.
- `admin-product.repository.ts` est dans l'état décrit dans ce document au démarrage du lot (592 lignes, 8 fonctions publiques exportées, 11 blocs internes).
- Aucune modification en cours sur les fichiers couverts par ce lot.
- `products/types/`, `products/queries/` et `products/helpers/` n'existent pas encore au démarrage de V21-4A. Ils sont créés par ce lot.
- `admin-product-variant.repository.ts` conserve ses définitions dupliquées de `readProductTypeInTx` et `countVariantsInTx` jusqu'à V21-4B. Aucun import croisé n'est introduit entre les deux façades.
- Le mapping dupliqué entre `findAdminProductById` et `loadAdminProductDetailInTx` reste en l'état. Sa factorisation est hors périmètre V21-4A.
- `typecheck` et `lint` passaient avant le début du lot.

---

## Résumé des décisions

### Décisions prises — fonctions nommées + destination

| Bloc | Sort |
|---|---|
| `AdminProductTypeRow` | extrait → `products/types/product-type-row.ts` (sous le nom `ProductTypeRow`) |
| `TxClient` | extrait → `products/types/tx-client.ts` |
| `isValidProductId` | reste en façade |
| `normalizeCategoryIds` | reste en façade |
| `mapPrismaRepositoryError` | reste en façade |
| `assertCanSaveAsSimpleProduct` | reste en façade |
| `assertProductSupportsNativeSimpleOffer` | reste en façade |
| `assertCompatibleLegacyVariantCountForNativeSimpleOffer` | reste en façade |
| `ensureCategoriesExistInTx` | extrait → `products/helpers/ensure-categories.ts` |
| `replaceProductCategoriesInTx` | extrait → `products/helpers/replace-categories.ts` |
| `loadAdminProductDetailInTx` | reste en façade |
| `readProductTypeInTx` | extrait → `products/queries/read-product-type.ts` |
| `countVariantsInTx` | extrait → `products/queries/count-variants.ts` |
| 8 fonctions publiques | restent en façade (invariant) |

### Décisions reportées à l'exécution

Aucune décision n'est reportée à l'exécution. Toutes les ambiguïtés identifiées ont été tranchées dans ce document.

### Dettes documentées pour V21-4B

- Migration de `ProductCompatibilityRow` dans `admin-product-variant.repository.ts` vers `ProductTypeRow` partagé.
- Migration de `readProductTypeInTx` et `countVariantsInTx` dans `admin-product-variant.repository.ts` vers les fichiers extraits dans `products/queries/`.
