# V21-4A — `products` : socle partagé

## Summary

V21-4A est le lot prévu pour extraire le socle partagé du domaine `products`, centré sur [admin-product.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/admin-product.repository.ts), sans encore traiter le détail variantes + images comme lot séparé.

## Objectif

Réduire la densité de `admin-product.repository.ts` en sortant les lectures et helpers internes partagés du domaine `products`, tout en laissant inchangé le rôle de [simple-product-compat.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/simple-product-compat.ts).

## Audit de départ / contexte réel

État réel actuel :

- `admin-product.repository.ts` : 592 lignes
- `admin-product.types.ts` : 96 lignes
- `simple-product-compat.ts` : 126 lignes

`admin-product.repository.ts` mélange aujourd'hui :

- validation locale des identifiants et catégories
- mappage d'erreurs Prisma
- chargement du détail admin
- calcul local du `simpleOffer`
- remplacement des catégories produit
- mutations transactionnelles de création et mise à jour
- chargement du contexte de publication

## Périmètre exact

V21-4A doit couvrir :

- la modularisation interne de `admin-product.repository.ts`
- l'introduction de `types/`, `queries/` et `helpers/` locaux au domaine `products`
- la clarification des blocs partagés entre lecture détail, publication, catégories et offre simple

## Hors périmètre exact

V21-4A ne doit pas couvrir :

- la modularisation complète des variantes
- la modularisation complète des images
- le renommage de `simple-product-compat.ts`
- un changement des façades publiques `admin-product.repository.ts` et `admin-product.types.ts`

## Fichiers potentiellement concernés

- `db/repositories/products/admin-product.repository.ts`
- `db/repositories/products/admin-product.types.ts`
- `db/repositories/products/simple-product-compat.ts`
- nouveaux fichiers internes sous `db/repositories/products/types/`
- nouveaux fichiers internes sous `db/repositories/products/queries/`
- nouveaux fichiers internes sous `db/repositories/products/helpers/`

## Fichiers internes attendus après V21-4A

- `db/repositories/products/types/tx-client.ts`
- `db/repositories/products/types/product-type-row.ts`
- `db/repositories/products/queries/read-product-type.ts`
- `db/repositories/products/queries/count-variants.ts`
- `db/repositories/products/helpers/ensure-categories.ts`
- `db/repositories/products/helpers/replace-categories.ts`

## Invariants à préserver

Invariants critiques :

- règles de `productType`
- cohérence des catégories produit
- compatibilité `simple product` / héritage legacy
- contrat `AdminProductPublishContext`
- contrats publics admin produit inchangés
- rôle inchangé de `simple-product-compat.ts`

## Risques principaux

Risques principaux :

- casser la compatibilité entre offre simple native et variante legacy
- casser la validation de changement de type de produit
- déplacer trop tôt la logique encore plus lisible dans la façade
- diluer la lecture du détail admin dans trop de fichiers

## Vérifications obligatoires

- `pnpm run typecheck`
- `pnpm run lint`
- vérification ciblée des façades `admin-product.repository.ts` et `admin-product.types.ts`
- vérification que les 8 exports nommés de `admin-product.repository.ts` sont strictement inchangés
- vérification que `admin-product.types.ts` conserve strictement le même ensemble d'exports
- vérification qu'aucun consumer hors `db/repositories/products/**` n'est modifié
- vérification de l'absence de changement sur `simple-product-compat.ts`

## Critères de fin

V21-4A est considéré terminé quand :

- `readProductTypeInTx` a quitté `admin-product.repository.ts` → présente dans `products/queries/read-product-type.ts`
- `countVariantsInTx` a quitté `admin-product.repository.ts` → présente dans `products/queries/count-variants.ts`
- `ensureCategoriesExistInTx` a quitté `admin-product.repository.ts` → présente dans `products/helpers/ensure-categories.ts`
- `replaceProductCategoriesInTx` a quitté `admin-product.repository.ts` → présente dans `products/helpers/replace-categories.ts`
- `TxClient` a quitté `admin-product.repository.ts` → présent dans `products/types/tx-client.ts`
- `AdminProductTypeRow` a quitté `admin-product.repository.ts` → présent dans `products/types/product-type-row.ts` sous le nom `ProductTypeRow`
- les 8 fonctions publiques de `admin-product.repository.ts` ont des signatures identiques avant et après
- les imports dans `admin-product.repository.ts` sont mis à jour pour pointer vers les nouveaux fichiers internes
- les fichiers internes importent depuis `products/types/` (jamais depuis `admin-product.types.ts`)
- `simple-product-compat.ts` conserve son rôle interne actuel, inchangé
- `pnpm run typecheck` passe
- `pnpm run lint` passe

## Exports publics avant V21-4A

### Fonctions exportées depuis `admin-product.repository.ts`

| Fonction                         | Signature résumée                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| `findAdminProductPublishContext` | `(id: string) => Promise<AdminProductPublishContext \| null>`                        |
| `listAdminProducts`              | `() => Promise<AdminProductSummary[]>`                                               |
| `findAdminProductById`           | `(id: string) => Promise<AdminProductDetail \| null>`                                |
| `createAdminProduct`             | `(input: CreateAdminProductInput) => Promise<AdminProductDetail>`                    |
| `updateAdminProduct`             | `(input: UpdateAdminProductInput) => Promise<AdminProductDetail \| null>`            |
| `updateAdminSimpleProductOffer`  | `(input: UpdateAdminSimpleProductOfferInput) => Promise<AdminProductDetail \| null>` |
| `toggleAdminProductStatus`       | `(id: string) => Promise<"draft" \| "published" \| null>`                            |
| `deleteAdminProduct`             | `(id: string) => Promise<boolean>`                                                   |

### Types et classes exportés depuis `admin-product.types.ts`

| Export                               | Nature                                |
| ------------------------------------ | ------------------------------------- |
| `AdminProductStatus`                 | type alias (`"draft" \| "published"`) |
| `CreateAdminProductInput`            | type                                  |
| `UpdateAdminProductInput`            | type                                  |
| `UpdateAdminSimpleProductOfferInput` | type                                  |
| `AdminProductPublishContext`         | type                                  |
| `AdminProductRepositoryErrorCode`    | type union                            |
| `AdminProductSummary`                | type                                  |
| `AdminProductCategoryAssignment`     | type                                  |
| `AdminProductDetail`                 | type                                  |
| `AdminProductRepositoryError`        | classe                                |

## Exports publics après V21-4A

Les exports publics de `admin-product.repository.ts` et de `admin-product.types.ts` sont **identiques** avant et après le lot.

C'est l'invariant central de V21-4A. Aucune fonction, aucun type, aucune classe n'est ajouté ou supprimé de la surface publique. Aucun consumer dans `app/`, `features/` ou `components/` ne doit être modifié.

Les fichiers extraits dans `types/`, `queries/` et `helpers/` sont des fichiers internes. Ils ne constituent pas de nouveaux points d'entrée publics du domaine.

## Cartographie des blocs

### Blocs extraits

| Bloc                                             | Destination                              | Motif                                                                                                                                    |
| ------------------------------------------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `TxClient`                                       | `products/types/tx-client.ts`            | domaine modularisé — décision transverse T-2 : extraction requise dès lors qu'un sous-dossier interne est créé                           |
| `AdminProductTypeRow` (renommé `ProductTypeRow`) | `products/types/product-type-row.ts`     | type de row Prisma partagé intra-domaine — utilisé par `readProductTypeInTx` dans les deux repositorys du domaine                        |
| `readProductTypeInTx`                            | `products/queries/read-product-type.ts`  | lecture pure, partageable avec V21-4B ; extraction dans V21-4A, consommation par `admin-product-variant.repository.ts` reportée à V21-4B |
| `countVariantsInTx`                              | `products/queries/count-variants.ts`     | même motif que `readProductTypeInTx`                                                                                                     |
| `ensureCategoriesExistInTx`                      | `products/helpers/ensure-categories.ts`  | fonction autonome (~20 lignes), responsabilité unique (lecture + guard catégories), volumineuse suffisamment pour justifier l'extraction |
| `replaceProductCategoriesInTx`                   | `products/helpers/replace-categories.ts` | mutation transactionnelle pure et autonome (deleteMany + createMany)                                                                     |

### Blocs conservés dans la façade

| Bloc                                                     | Motif                                                                                                                                                                 |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isValidProductId`                                       | petite fonction utilitaire (1 ligne) — duplication locale, décision transverse T-1                                                                                    |
| `normalizeCategoryIds`                                   | petite fonction utilitaire (1 ligne) — duplication locale, décision transverse T-1                                                                                    |
| `mapPrismaRepositoryError`                               | error mapper produisant des erreurs publiques (`AdminProductRepositoryError`) — décision transverse T-3                                                               |
| `assertCanSaveAsSimpleProduct`                           | courte (5 lignes), lance une `AdminProductRepositoryError` publique, extraction n'apporte pas de gain de lisibilité mesurable                                         |
| `assertProductSupportsNativeSimpleOffer`                 | même motif                                                                                                                                                            |
| `assertCompatibleLegacyVariantCountForNativeSimpleOffer` | même motif                                                                                                                                                            |
| `loadAdminProductDetailInTx`                             | combine lecture Prisma + mapping complet vers `AdminProductDetail` + requête conditionnelle variantes legacy — extraction diluerait la lecture du flow transactionnel |
| 8 fonctions publiques exportées                          | invariant de façade — voir section "Exports publics"                                                                                                                  |

## Ce qui reste volontairement dans la façade après V21-4A

Les éléments suivants restent dans `admin-product.repository.ts` après l'exécution du lot. Leur présence dans la façade est une décision explicite, non un oubli.

**Error mapper :**

- `mapPrismaRepositoryError` — produit des erreurs publiques `AdminProductRepositoryError` ; déplacer l'error mapper hors de la façade briserait la lisibilité du contrat d'erreur observable depuis l'extérieur (décision transverse T-3)

**Petits utilitaires — règle de duplication locale :**

- `isValidProductId` — 1 ligne, décision transverse T-1 : les petites fonctions utilitaires génériques sont dupliquées localement, jamais extraites cross-domain
- `normalizeCategoryIds` — 1 ligne, même motif

**Validations métier étroitement couplées aux erreurs publiques :**

- `assertCanSaveAsSimpleProduct` — 3-5 lignes, lance directement `AdminProductRepositoryError` ; extraction dans `helpers/` créerait une indirection vers la définition d'erreur publique sans bénéfice structurel
- `assertProductSupportsNativeSimpleOffer` — même motif
- `assertCompatibleLegacyVariantCountForNativeSimpleOffer` — même motif

**Chargement transactionnel du détail :**

- `loadAdminProductDetailInTx` — combine lecture Prisma + mapping complet + requête conditionnelle variantes legacy ; extraction diluerait la lisibilité du flow transactionnel ; la factorisation du mapping dupliqué entre `findAdminProductById` et `loadAdminProductDetailInTx` est hors périmètre V21-4A

**Fonctions publiques exportées (invariant de façade) :**

- `findAdminProductPublishContext`
- `listAdminProducts`
- `findAdminProductById`
- `createAdminProduct`
- `updateAdminProduct`
- `updateAdminSimpleProductOffer`
- `toggleAdminProductStatus`
- `deleteAdminProduct`

## Compatibilité publique

Compatibilité attendue :

- mêmes chemins publics `admin-product.repository.ts` et `admin-product.types.ts`
- mêmes exports publics
- mêmes signatures runtime

## Règles d'import internes

- `admin-product.repository.ts` peut importer depuis `./types/*`, `./queries/*`, `./helpers/*`, `./admin-product.types` et `./simple-product-compat`
- les fichiers internes sous `types/`, `queries/` et `helpers/` ne doivent jamais importer depuis `admin-product.repository.ts`
- les fichiers internes sous `types/`, `queries/` et `helpers/` ne doivent jamais importer depuis `admin-product.types.ts`
- les fichiers internes ne doivent pas créer de dépendances circulaires entre eux

## Décisions préalables

**Décision — `AdminProductTypeRow` (partage intra-domaine) :** `AdminProductTypeRow` est défini dans `admin-product.repository.ts` (lignes 26-29). `admin-product-variant.repository.ts` définit un type identique sous le nom `ProductCompatibilityRow`. Ces deux fichiers appartiennent au même domaine fonctionnel `products`. La doctrine V21 interdit le partage cross-domain, pas le partage intra-domaine. `AdminProductTypeRow` est extrait dans `products/types/product-type-row.ts` sous le nom canonique `ProductTypeRow`. `admin-product-variant.repository.ts` conserve sa définition locale `ProductCompatibilityRow` pendant V21-4A ; sa migration vers `ProductTypeRow` est reportée à V21-4B.

**Décision — `TxClient` :** V21-4A crée un sous-dossier interne `products/types/`. Dès lors qu'un domaine est modularisé (sous-dossier créé), la décision transverse T-2 impose d'extraire `TxClient` dans `products/types/tx-client.ts` et de le partager entre tous les fichiers internes. Il ne doit pas être redéfini localement dans chaque fichier interne.

**Décision — `readProductTypeInTx` et `countVariantsInTx` :** ces deux fonctions sont extraites depuis `admin-product.repository.ts` vers `products/queries/` dans V21-4A. Leur consommation depuis `admin-product-variant.repository.ts` est reportée à V21-4B. Pendant V21-4A, `admin-product-variant.repository.ts` conserve ses définitions locales de `readProductTypeInTx` et `countVariantsInTx` sans modification. Aucun import croisé n'est introduit entre les deux façades dans ce lot.

**Décision — règle de duplication locale T-1 :** `isValidProductId` et `normalizeCategoryIds` sont de petites fonctions utilitaires génériques (1 ligne chacune). La décision transverse T-1 impose la duplication locale pour ce type de fonction : elles restent définies dans `admin-product.repository.ts` et ne sont pas extraites dans un fichier partagé. Si un fichier interne extrait dans V21-4A a besoin d'une fonction similaire, il la définit localement.

**Décision — error mappers (T-3) :** `mapPrismaRepositoryError` reste dans `admin-product.repository.ts`. La décision transverse T-3 interdit de déplacer un error mapper vers `helpers/` ou `queries/`.

**Décision — fonctions `assert*` :** `assertCanSaveAsSimpleProduct`, `assertProductSupportsNativeSimpleOffer` et `assertCompatibleLegacyVariantCountForNativeSimpleOffer` restent dans la façade. Elles sont courtes (3-5 lignes), étroitement couplées aux codes d'erreur publics, et appelées dans des flows transactionnels courts. Leur extraction créerait une indirection sans gain structurel mesurable.

**Décision — `loadAdminProductDetailInTx` :** reste dans la façade. La factorisation du mapping entre `findAdminProductById` et `loadAdminProductDetailInTx` est hors périmètre V21-4A et nécessite un lot dédié avec ses propres critères de fin.

**Décision — `admin-product-variant.repository.ts` :** non modifié dans V21-4A, sauf correction strictement limitée à rétablir la compatibilité si un typecheck révèle un problème d'import involontaire.

**Décision — `simple-product-compat.ts` :** non modifié, non renommé, non restructuré dans V21-4A.
