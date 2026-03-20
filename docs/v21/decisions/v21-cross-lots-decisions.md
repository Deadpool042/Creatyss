# V21 — Décisions transverses (cross-lots)

## Portée de ce document

Ce document complète les fiches de décision de chaque lot. Il établit des règles applicables uniformément à V21-3, V21-4A, V21-4B et V21-5. En cas de contradiction avec une fiche de lot, ce document est prioritaire sauf décision explicite contraire dans la fiche de lot.

Ce document ne remplace pas les fiches de lot. Il documente uniquement les règles qui s'appliquent à plusieurs lots simultanément.

---

## Décision T-1 — Duplication locale des petites fonctions utilitaires

### Règle

Les petites fonctions utilitaires génériques (conversion d'identifiants, normalisation de champs, validation de format) sont dupliquées localement dans chaque fichier ou chaque domaine qui en a besoin. Aucune extraction vers un fichier partagé cross-domain n'est autorisée dans le cadre de V21.

### Motif

V21-2B a établi cette décision pour le domaine `catalog` : `uniqueBigIntIds` et `toDbId` sont dupliqués entre `catalog.repository.ts`, `helpers/primary-image.ts` et `helpers/category-representative-image.ts` sans extraction vers un fichier partagé. La doctrine V21 interdit explicitement les abstractions cross-domain dans `helpers/`. Une extraction partagée créerait un couplage entre domaines sans bénéfice démontré sur le périmètre des lots V21.

Référence : `docs/v21/decisions/v21-2b-decisions.md`, Décision 2 — Duplication locale de `uniqueBigIntIds` et `toDbId`.

### Cas concrets nommés dans le code

- `uniqueBigIntIds` — dupliquée dans `catalog.repository.ts` et ses helpers internes
- `toDbId` — dupliquée dans `catalog.repository.ts` et ses helpers internes
- `isValidProductId` — définie localement dans `db/repositories/products/admin-product.repository.ts` (ligne 33)
- `normalizeCategoryIds` — définie localement dans `db/repositories/products/admin-product.repository.ts` (ligne 37)
- `isValidNumericId` — définie localement dans `db/repositories/products/admin-product-image.repository.ts` (ligne 25) et dans `db/repositories/products/admin-product-variant.repository.ts` (ligne 26)

### Ce qui est interdit

- Créer un fichier `db/repositories/shared/` ou `db/repositories/utils/` pour centraliser ces fonctions
- Extraire ces fonctions vers `helpers/` d'un domaine tiers pour les partager cross-domain
- Importer une de ces fonctions depuis un autre domaine

### Lots concernés

V21-3, V21-4A, V21-4B, V21-5.

---

## Décision T-2 — Traitement de TxClient dans les domaines modularisés

### Règle

Si un domaine est modularisé dans V21 (création d'un sous-dossier interne avec plusieurs fichiers), et que ce domaine utilise un alias `TxClient`, cet alias est extrait dans le sous-dossier `types/` du domaine et partagé entre tous les fichiers internes. Il n'est jamais redéfini localement dans chaque fichier interne. Si le domaine n'est pas modularisé dans V21 (reste un seul fichier plat), `TxClient` reste défini localement dans ce fichier. Pas d'extraction si pas de sous-dossier.

### Motif

V21-3 a établi cette décision pour le domaine `order` : `TxClient` (défini dans `order.repository.ts` comme `type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]`) doit être extrait dans `db/repositories/orders/types/` et importé par tous les fichiers internes du domaine. Redéfinir l'alias dans chaque fichier interne introduirait une duplication interne à un même domaine modularisé, sans garantie de cohérence.

Référence : `docs/v21/lots/v21-3-order-internal-modularization.md`, section "Décisions ou ambiguïtés connues".

### Règle complémentaire — domaine initialement plat, finalement modularisé

Si un domaine était initialement supposé rester plat, mais qu'une décision de lot V21 tranche GO pour sa modularisation, alors T-2 s'applique rétroactivement : `TxClient` doit être extrait dans `<domaine>/types/` selon les mêmes règles. L'hypothèse initiale de non-modularisation est invalidée par la décision de lot. La fiche de décision du lot concerné fait autorité sur toute note antérieure dans ce document.

### Cas concrets nommés dans le code

Domaines modularisés dans V21 — extraction de `TxClient` requise :

- `order` — `TxClient` défini dans `db/repositories/order.repository.ts`, à extraire dans `db/repositories/orders/types/`
- `admin-homepage` — `TxClient` défini localement à la ligne 188 de `db/repositories/admin-homepage.repository.ts` ; la décision GO de V21-5 impose l'extraction dans `db/repositories/admin-homepage/types/tx.ts`. Note : ce document listait initialement `admin-homepage` comme domaine plat — cette hypothèse est invalidée par `docs/v21/decisions/v21-5-decisions.md`, Section 3.2.

Domaines non modularisés dans V21 — `TxClient` reste défini localement :

- `admin-product-image` — `TxClient` défini localement à la ligne 45 de `db/repositories/products/admin-product-image.repository.ts` ; ce fichier n'a pas de sous-dossier interne dans V21 (ses extractions vivent dans `products/` partagé), la définition locale est correcte

Note : `admin-product-variant.repository.ts` utilise `Prisma.TransactionClient` directement sans alias `TxClient` — cette pratique reste valide et n'est pas concernée par cette règle.

### Ce qui est interdit

- Redéfinir `TxClient` dans chaque fichier interne d'un domaine modularisé (par exemple dans `orders/helpers/*.ts` et `orders/queries/*.ts` séparément)
- Extraire `TxClient` dans un fichier partagé cross-domain hors du sous-dossier `types/` du domaine concerné
- Extraire `TxClient` d'un domaine qui reste un fichier plat non modularisé

### Lots concernés

V21-3 (extraction effective pour `order`). V21-4A, V21-4B, V21-5 : appliquer si ces lots modularisent un domaine qui utilise un alias `TxClient`.

---

## Décision T-3 — Position des error mappers

### Règle

Les fonctions d'error mapping qui produisent des erreurs publiques d'un repository restent dans la façade publique (`*.repository.ts` à la racine du domaine). Elles ne sont pas extraites dans `helpers/`, `queries/` ou tout autre sous-dossier interne.

### Motif

Les error mappers ont un couplage direct avec les types d'erreur publics qui font partie du contrat public du repository. Les déplacer hors de la façade briserait la lisibilité du contrat d'erreur observable depuis l'extérieur du domaine. La doctrine V21 liste explicitement le remapping d'erreurs publiques parmi les responsabilités qui restent dans la façade publique.

Référence : `docs/v21/doctrine.md`, section "Définition d'une façade publique" et section "Ce qui ne doit jamais être extrait".

### Cas concrets nommés dans le code

- `mapPrismaRepositoryError` dans `db/repositories/products/admin-product.repository.ts` (ligne 44) — produit des `AdminProductRepositoryError`
- `mapVariantPrismaError` dans `db/repositories/products/admin-product-variant.repository.ts` (ligne 63) — produit des `AdminProductVariantRepositoryError`
- `mapPrismaRepositoryError` dans `db/repositories/admin-blog.repository.ts` (ligne 64) — produit des `AdminBlogRepositoryError`

Ces trois fonctions sont définies dans leur façade publique respective et y restent.

### Ce qui est interdit

- Déplacer un error mapper vers `helpers/` ou `queries/`
- Centraliser les error mappers de plusieurs domaines dans un fichier partagé
- Extraire un error mapper hors de sa façade publique sans lot dédié explicite

### Lots concernés

V21-3, V21-4A, V21-4B, V21-5.

---

## Décision T-4 — AdminProductImageRepositoryError : gel pendant V21

### Règle

`AdminProductImageRepositoryError` reste dans son état actuel pendant toute la durée de V21. Aucun lot V21 n'est autorisé à modifier sa structure sans lot dédié explicite. Si un exécutant constate l'inconsistance décrite ci-dessous, il la note dans le compte-rendu de lot mais ne la corrige pas.

### Observation dans le code

`AdminProductImageRepositoryError` est défini dans `db/repositories/products/admin-product-image.types.ts` (lignes 43-49). Son constructeur ne prend pas `code` en paramètre : il force la valeur `"variant_missing"` en dur, quelle que soit l'erreur lancée. Le type `AdminProductImageRepositoryErrorCode` existe mais ne couvre qu'un seul cas.

Cette structure diffère de `AdminProductRepositoryError` et `AdminProductVariantRepositoryError`, dont les constructeurs acceptent `code` comme paramètre explicite et couvrent plusieurs cas d'erreur distincts (`slug_taken`, `sku_taken`, `product_referenced`, etc.).

L'inconsistance est interne au domaine `products` : les trois types d'erreur du domaine ont des structures différentes.

### Motif

V21 est un lot de modularisation structurelle, pas un lot d'harmonisation des contrats d'erreur. Corriger `AdminProductImageRepositoryError` dans le cadre de V21 modifierait un contrat public sans lot dédié, en violation de la Règle 4 de la doctrine V21 (stabilité des contrats publics). Tout correctif devra faire l'objet d'un lot explicite documentant la migration des callers concernés.

Référence : `docs/v21/doctrine.md`, section "Règles de stabilité des exports", Règle 4.

### Ce qui est interdit

- Ajouter un paramètre `code` au constructeur de `AdminProductImageRepositoryError` dans un lot V21
- Harmoniser la structure de cet error type avec `AdminProductRepositoryError` ou `AdminProductVariantRepositoryError` dans un lot V21
- Ajouter de nouveaux codes d'erreur à `AdminProductImageRepositoryErrorCode` dans un lot V21

### Lots concernés

V21-3, V21-4A, V21-4B, V21-5. La règle s'applique à tout exécutant qui touche au domaine `products` dans ces lots.
