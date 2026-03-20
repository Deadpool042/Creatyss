# Décisions V21-5 — Domaines restants : nettoyage structurel

## Section 1 — Portée

Ce document tranche le go/no-go par domaine pour V21-5. Il complète `v21-cross-lots-decisions.md`.

Les décisions transverses T-1 à T-4 s'appliquent sans exception aux domaines traités dans V21-5 :

- T-1 : les petites fonctions utilitaires génériques sont dupliquées localement, jamais extraites dans un fichier partagé cross-domain.
- T-2 : si un domaine est modularisé dans V21, `TxClient` est extrait dans `<domaine>/types/` et partagé entre les fichiers internes.
- T-3 : les error mappers restent dans la façade publique.
- T-4 : `AdminProductImageRepositoryError` est gelé pendant V21 (ne concerne pas directement les domaines V21-5, mentionné pour exhaustivité).

V21-5 porte également trois domaines non listés dans `v21-5-small-domains-structural-cleanup.md` mais présents dans le codebase et sans statut documenté dans V21 : `admin-blog`, `admin-users`, `admin-media`. Ce document les tranche explicitement.

---

## Section 2 — Tableau de synthèse go/no-go

| Domaine | Fichier | Lignes réelles | Décision | Motif résumé |
|---|---|---|---|---|
| admin-category | admin-category.repository.ts | 366 | GO | Bloc de lecture batch autonome de 110 lignes extractible dans `queries/`, helpers de tri purement mémoire extractibles dans `helpers/` |
| admin-homepage | admin-homepage.repository.ts | 426 | GO | Trois blocs naturels distincts : lectures pures (~120 lignes), validations transactionnelles (~80 lignes), écritures transactionnelles (~60 lignes) |
| payment | payment.repository.ts | 167 | NO-GO | < 200 lignes, deux transactions Serializable à criticité élevée, responsabilités déjà bien délimitées, aucun bloc extractible sans risque |
| guest-cart | guest-cart.repository.ts | 450 | GO | 450 lignes, blocs de disponibilité, mappers et CRUD clairement séparables, gain net de lisibilité démontrable |
| order-email | order-email.repository.ts | 119 | NO-GO | < 150 lignes, responsabilité unique (CRUD email events), aucun bloc extractible justifié |
| admin-blog | admin-blog.repository.ts | 221 | NO-GO | 221 lignes mais logique fortement couplée : mappers interdépendants, transaction courte intégrée à l'orchestration métier, gain marginal, règle de prudence V21 appliquée |
| admin-users | admin-users.repository.ts | 59 | NO-GO | 59 lignes, responsabilité unique, aucun bloc extractible |
| admin-media | admin-media.repository.ts | 70 | NO-GO | 70 lignes, responsabilité unique, aucun bloc extractible |

---

## Section 3 — Décisions détaillées par domaine

### 3.1 admin-category — GO

**Taille réelle : 366 lignes**

**Blocs identifiés :**

- Types internes (lignes 7–52) : `PrismaCategoryData`, `CreateAdminCategoryInput`, `UpdateAdminCategoryImageInput`, `UpdateAdminCategoryInput`, `AdminCategoryRepresentativeImage`, `RepresentativeImageCandidate`
- Helper de validation (ligne 42) : `isValidCategoryId` — 2 lignes, utilitaire local
- Helpers de tri mémoire (lignes 54–86) : `sortCategoriesForAdmin`, `isRepresentativeImageCandidateBetter` — 32 lignes combinées, purement mémoire, aucune dépendance Prisma
- Mapper (lignes 88–103) : `mapPrismaCategoryToPublic` — 15 lignes, couplé aux types internes
- Lecture batch (lignes 105–215) : `loadRepresentativeImagesByCategoryIds` — 110 lignes, 3 requêtes Prisma séquentielles, logique autonome de résolution d'image représentative, clairement extractible
- Error mapper (lignes 220–235) : `mapPrismaRepositoryError` — reste en façade (T-3)
- Fonctions publiques (lignes 239–365) : `listAdminCategories`, `findAdminCategoryById`, `createAdminCategory`, `updateAdminCategory`, `deleteAdminCategory`, `updateAdminCategoryImage`, `countProductsForCategory` — orchestration, mutations, restent en façade

**Décision : GO**

**Blocs extraits :**

| Bloc | Fonctions | Destination |
|---|---|---|
| Lecture batch representative image | `loadRepresentativeImagesByCategoryIds` | `db/repositories/admin-category/queries/representative-image.queries.ts` |
| Helpers de tri mémoire | `sortCategoriesForAdmin`, `isRepresentativeImageCandidateBetter` | `db/repositories/admin-category/helpers/sort.ts` |

**Blocs conservés en façade :**

| Bloc | Motif |
|---|---|
| `isValidCategoryId` | Utilitaire local de validation, < 5 lignes, duplication locale préférable à l'extraction (T-1) |
| `mapPrismaCategoryToPublic` | Couplé aux types internes et utilisé dans toutes les mutations et lectures publiques, extraction sans gain |
| `mapPrismaRepositoryError` | Error mapper, reste en façade par décision T-3 |
| Types internes | Restent dans la façade ou dans `admin-category/types/` si le volume le justifie — à décider à l'exécution |
| Toutes les fonctions publiques | Orchestration, contrat public |

**Implications des décisions transverses :**

- T-1 : `isValidCategoryId` reste défini localement dans `admin-category.repository.ts`. Si les fichiers extraits ont besoin d'une validation similaire, ils la dupliquent localement.
- T-2 : `admin-category` n'utilise pas d'alias `TxClient`. La règle T-2 ne s'applique pas.
- T-3 : `mapPrismaRepositoryError` reste dans `admin-category.repository.ts`.

**Structure cible :**

```text
db/repositories/admin-category/
  admin-category.repository.ts
  admin-category.types.ts
  queries/
    representative-image.queries.ts
  helpers/
    sort.ts
```

---

### 3.2 admin-homepage — GO

**Taille réelle : 426 lignes**

**Blocs identifiés :**

- Types internes (lignes 20–30) : `PrismaHomepageContentData`
- Utilitaires locaux (lignes 34–40) : `isValidNumericId`, `normalizeUniqueIds`
- Mapper (lignes 42–62) : `mapPrismaHomepage`
- Lectures de sélections featured (lignes 66–121) : `listHomepageFeaturedProducts`, `listHomepageFeaturedCategories`, `listHomepageFeaturedBlogPosts`, `loadHomepageFeaturedSelections` — ~55 lignes, 4 requêtes Prisma simples, extractibles dans `queries/`
- Lecture options (lignes 126–184) : `loadHomepageOptions` — ~60 lignes, 3 requêtes Prisma parallèles pour les listes de sélection éditeur, extractible dans `queries/`
- `TxClient` (ligne 188) : alias local — si modularisation GO, extraction dans `types/` requise (T-2)
- Validations transactionnelles (lignes 190–264) : `ensureHomepageExistsInTx`, `ensurePublishedProductsExistInTx`, `ensureCategoriesExistInTx`, `ensurePublishedBlogPostsExistInTx` — ~75 lignes, 4 fonctions autonomes, extractibles dans `helpers/`
- Écritures transactionnelles (lignes 268–326) : `replaceHomepageFeaturedProductsInTx`, `replaceHomepageFeaturedCategoriesInTx`, `replaceHomepageFeaturedBlogPostsInTx` — ~58 lignes, 3 fonctions autonomes, extractibles dans `helpers/`
- Fonctions publiques (lignes 330–425) : `getAdminHomepageCurrentHeroImagePath`, `getAdminHomepageEditorData`, `updateAdminHomepage` — orchestration transactionnelle, restent en façade

**Décision : GO**

**Blocs extraits :**

| Bloc | Fonctions | Destination |
|---|---|---|
| Lectures de sélections featured | `listHomepageFeaturedProducts`, `listHomepageFeaturedCategories`, `listHomepageFeaturedBlogPosts`, `loadHomepageFeaturedSelections` | `db/repositories/admin-homepage/queries/featured-selections.queries.ts` |
| Lecture des options éditeur | `loadHomepageOptions` | `db/repositories/admin-homepage/queries/homepage-options.queries.ts` |
| Validations transactionnelles | `ensureHomepageExistsInTx`, `ensurePublishedProductsExistInTx`, `ensureCategoriesExistInTx`, `ensurePublishedBlogPostsExistInTx` | `db/repositories/admin-homepage/helpers/transaction-guards.ts` |
| Écritures transactionnelles | `replaceHomepageFeaturedProductsInTx`, `replaceHomepageFeaturedCategoriesInTx`, `replaceHomepageFeaturedBlogPostsInTx` | `db/repositories/admin-homepage/helpers/transaction-writes.ts` |
| Alias TxClient | `type TxClient` | `db/repositories/admin-homepage/types/tx.ts` |

**Blocs conservés en façade :**

| Bloc | Motif |
|---|---|
| `isValidNumericId` | Utilitaire local < 5 lignes, duplication locale (T-1) |
| `normalizeUniqueIds` | Utilitaire local < 5 lignes, duplication locale (T-1) |
| `mapPrismaHomepage` | Couplé aux types publics et utilisé uniquement dans les fonctions publiques orchestratrices |
| `PrismaHomepageContentData` | Type structural interne, utilisé dans la façade et le mapper — reste dans la façade ou dans `types/` si le volume le justifie |
| Toutes les fonctions publiques | Orchestration transactionnelle, contrat public |

**Implications des décisions transverses :**

- T-1 : `isValidNumericId` et `normalizeUniqueIds` restent définis localement dans `admin-homepage.repository.ts`. Les fichiers extraits qui auraient besoin d'une logique similaire la dupliquent.
- T-2 : `admin-homepage` est modularisé dans V21-5. `TxClient` doit être extrait dans `db/repositories/admin-homepage/types/tx.ts` et importé par les fichiers internes de `helpers/` qui l'utilisent. Note : la décision T-2 dans `v21-cross-lots-decisions.md` indiquait `admin-homepage` comme cas de "TxClient reste défini localement" sous l'hypothèse que ce domaine ne serait pas modularisé. La décision GO de V21-5 invalide cette hypothèse : T-2 impose donc l'extraction de `TxClient` dans `types/`.
- T-3 : `admin-homepage` n'a pas d'error mapper public. La règle T-3 ne s'applique pas. Les erreurs `AdminHomepageRepositoryError` sont lancées depuis les helpers transactionnels — elles restent dans ces helpers puisqu'elles ne constituent pas un "remapping d'erreurs publiques" au sens de T-3 (elles sont lancées en interne, pas mappées depuis Prisma vers un contrat public dans la façade).

**Structure cible :**

```text
db/repositories/admin-homepage/
  admin-homepage.repository.ts
  admin-homepage.types.ts
  types/
    tx.ts
  queries/
    featured-selections.queries.ts
    homepage-options.queries.ts
  helpers/
    transaction-guards.ts
    transaction-writes.ts
```

---

### 3.3 payment — NO-GO

**Taille réelle : 167 lignes**

**Blocs identifiés :**

- Helper de validation (ligne 10) : `isValidOrderReference` — regex locale
- Lecture (lignes 14–53) : `findPaymentStartContextByOrderReference` — 1 requête Prisma avec relation
- Écriture simple (lignes 55–85) : `saveStripeCheckoutSessionForOrder` — upsert atomique
- Transaction Serializable 1 (lignes 87–132) : `markPaymentSucceededByCheckoutSessionId` — read + conditional update payment + conditional update order
- Transaction Serializable 2 (lignes 134–167) : `markPaymentFailedByCheckoutSessionId` — read + conditional update payment

**Décision : NO-GO**

**Justification :** 167 lignes, en deçà du seuil GO. Les deux transactions `{ isolationLevel: "Serializable" }` couvrent une logique de prévention de concurrence critique (idempotence des webhooks Stripe). Extraire les corps transactionnels dans des helpers modifierait la surface de compréhension de ce comportement sans apporter de gain de lisibilité démontrable. La responsabilité du fichier est bien délimitée (cycle de vie d'un paiement Stripe). Le domaine reste hors périmètre V21.

---

### 3.4 guest-cart — GO

**Taille réelle : 450 lignes**

**Blocs identifiés :**

- Helper de validation (ligne 19) : `isValidNumericId`
- Helpers de disponibilité (lignes 25–45) : `isGuestCartVariantAvailable`, `isGuestCartLineAvailable` — 2 fonctions, ~20 lignes, logique purement mémoire
- Mappers (lignes 49–188) : `mapPrismaVariant` (~28 lignes), `mapPrismaCartLine` (~47 lignes), `mapPrismaCheckoutDetails` (~48 lignes) — 3 fonctions, ~123 lignes combinées, transformations Prisma row → contrat public
- Builder et issues checker (lignes 174–200) : `buildGuestCart` (~15 lignes), `getGuestCheckoutIssues` (~10 lignes) — logique mémoire d'agrégation du panier
- CRUD items (lignes 204–343) : `findGuestCartIdByToken`, `createGuestCart`, `findGuestCartVariantById`, `findGuestCartItemByVariant`, `findGuestCartItemById`, `addGuestCartItemQuantity`, `updateGuestCartItemQuantity`, `removeGuestCartItem` — 8 fonctions publiques, ~140 lignes
- Checkout details (lignes 383–428) : `readGuestCheckoutDetailsByCartId`, `upsertGuestCheckoutDetails` — 2 fonctions publiques, ~45 lignes
- Context agrégateur (lignes 430–449) : `readGuestCheckoutContextByToken` — 1 fonction publique, ~20 lignes

**Décision : GO**

**Blocs extraits :**

| Bloc | Fonctions | Destination |
|---|---|---|
| Helpers de disponibilité | `isGuestCartVariantAvailable`, `isGuestCartLineAvailable` | `db/repositories/guest-cart/helpers/availability.ts` |
| Mappers Prisma → contrat | `mapPrismaVariant`, `mapPrismaCartLine`, `mapPrismaCheckoutDetails` | `db/repositories/guest-cart/helpers/mappers.ts` |
| Agrégation panier | `buildGuestCart`, `getGuestCheckoutIssues` | `db/repositories/guest-cart/helpers/cart-builder.ts` |

**Blocs conservés en façade :**

| Bloc | Motif |
|---|---|
| `isValidNumericId` | Utilitaire local < 5 lignes, duplication locale (T-1) |
| Toutes les fonctions publiques | Orchestration, contrat public ; les CRUD items restent en façade car chaque fonction est compacte (~15 lignes) et ne bénéficie pas d'une extraction séparée |

**Implications des décisions transverses :**

- T-1 : `isValidNumericId` reste défini localement dans `guest-cart.repository.ts`. Les fichiers extraits ne l'utilisent pas directement.
- T-2 : `guest-cart` n'utilise pas d'alias `TxClient` (utilise `Prisma.TransactionClient` directement, mais uniquement dans `addGuestCartItemQuantity` via upsert atomique sans transaction explicite). La règle T-2 ne s'applique pas.
- T-3 : `guest-cart` n'a pas d'error mapper public. La règle T-3 ne s'applique pas.

**Structure cible :**

```text
db/repositories/guest-cart/
  guest-cart.repository.ts
  guest-cart.types.ts
  helpers/
    availability.ts
    mappers.ts
    cart-builder.ts
```

---

### 3.5 order-email — NO-GO

**Taille réelle : 119 lignes**

**Blocs identifiés :**

- Mapper (lignes 11–37) : `mapPrismaOrderEmailEvent` — 26 lignes, unique mapper du domaine
- 4 fonctions publiques : `createOrderEmailEventIfAbsent`, `markOrderEmailEventSent`, `markOrderEmailEventFailed`, `listOrderEmailEventsByOrderId`

**Décision : NO-GO**

**Justification :** 119 lignes, bien en deçà du seuil. Responsabilité unique (gestion des événements email liés aux commandes). Le mapper est compact, utilisé par toutes les fonctions publiques et ne justifie pas un fichier séparé. Le domaine reste hors périmètre V21. Aucune décision ultérieure n'est envisagée sauf si le volume croît significativement.

---

### 3.6 admin-blog — NO-GO

**Taille réelle : 221 lignes**

**Blocs identifiés :**

- Type interne (lignes 15–28) : `PrismaBlogPostData`
- Helper de validation (ligne 32) : `isValidBlogPostId`
- Mappers (lignes 36–59) : `mapPrismaBlogPostToSummary` (~14 lignes), `mapPrismaBlogPostToDetail` (~7 lignes, délègue à Summary) — 2 fonctions interdépendantes
- Error mapper (lignes 64–79) : `mapPrismaRepositoryError` — reste en façade (T-3)
- 6 fonctions publiques (lignes 83–220) : `listAdminBlogPosts`, `findAdminBlogPostById`, `createAdminBlogPost`, `updateAdminBlogPost`, `toggleAdminBlogPostStatus`, `deleteAdminBlogPost`
- Transaction interne (lignes 179–202) dans `toggleAdminBlogPostStatus` : read + update, 23 lignes, couplée à la logique métier du statut

**Décision : NO-GO**

**Justification :** 221 lignes, au-dessus du seuil de 200 lignes, mais la règle de prudence V21 s'applique. Les deux mappers sont interdépendants (`mapPrismaBlogPostToDetail` appelle `mapPrismaBlogPostToSummary`) et totalisent 21 lignes — extraction sans gain net. L'error mapper reste en façade (T-3). La transaction de `toggleAdminBlogPostStatus` est intégrée à l'orchestration métier du statut et ne peut être extraite sans diluer la compréhension du comportement. Aucun bloc n'atteint 30 lignes extractibles de façon autonome. Le gain structurel ne compense pas le churn documentaire et technique. Le domaine reste hors périmètre V21. Une décision ultérieure pourrait être envisagée si le volume dépasse 300 lignes avec des blocs autonomes réels.

---

### 3.7 admin-users — NO-GO

**Taille réelle : 59 lignes**

**Blocs identifiés :**

- Mapper (lignes 8–24) : `mapPrismaAdminUser`
- 3 fonctions publiques : `findAdminUserByEmail`, `findAdminUserById`, `createAdminUser`

**Décision : NO-GO**

**Justification :** 59 lignes, responsabilité unique (accès aux utilisateurs admin). Aucun bloc extractible. Le domaine reste hors périmètre V21. Aucune décision ultérieure envisagée.

---

### 3.8 admin-media — NO-GO

**Taille réelle : 70 lignes**

**Blocs identifiés :**

- Type interne (lignes 5–16) : `PrismaMediaAssetData`
- Mapper (lignes 18–34) : `mapPrismaMediaAsset`
- 3 fonctions publiques : `listAdminMediaAssets`, `getAdminMediaAssetById`, `createAdminMediaAsset`

**Décision : NO-GO**

**Justification :** 70 lignes, responsabilité unique (CRUD assets média). Aucun bloc extractible. Le domaine reste hors périmètre V21. Aucune décision ultérieure envisagée.

---

## Section 4 — Domaines explicitement hors V21

**payment** : 167 lignes, deux transactions Serializable à criticité élevée, responsabilité cohérente autour du cycle de vie d'un paiement Stripe. La modularisation n'est pas justifiée dans le cadre V21. Une décision ultérieure n'est pas envisagée sauf ajout substantiel de logique non transactionnelle.

**order-email** : 119 lignes, domaine satellite compact à responsabilité unique. La modularisation n'est pas justifiée. Une décision ultérieure n'est pas envisagée sauf croissance significative du fichier.

**admin-blog** : 221 lignes, blocs trop couplés pour une extraction propre dans le cadre V21. La modularisation n'est pas justifiée dans le cadre V21. Une décision ultérieure est possible si le fichier dépasse 300 lignes avec des blocs autonomes identifiables.

**admin-users** : 59 lignes, responsabilité unique. La modularisation n'est pas justifiée dans V21 ni dans un avenir proche.

**admin-media** : 70 lignes, responsabilité unique. La modularisation n'est pas justifiée dans V21 ni dans un avenir proche.

---

## Section 5 — Critères de fin de V21-5 (préfiguration)

Les conditions suivantes doivent toutes être vérifiées pour déclarer V21-5 terminé :

1. `admin-category` a été modularisé selon les blocs définis en section 3.1 : `loadRepresentativeImagesByCategoryIds` extrait dans `queries/representative-image.queries.ts`, `sortCategoriesForAdmin` et `isRepresentativeImageCandidateBetter` extraits dans `helpers/sort.ts`.

2. `admin-homepage` a été modularisé selon les blocs définis en section 3.2 : lectures de sélections dans `queries/featured-selections.queries.ts`, options éditeur dans `queries/homepage-options.queries.ts`, validations transactionnelles dans `helpers/transaction-guards.ts`, écritures transactionnelles dans `helpers/transaction-writes.ts`, `TxClient` extrait dans `types/tx.ts`.

3. `guest-cart` a été modularisé selon les blocs définis en section 3.4 : helpers de disponibilité dans `helpers/availability.ts`, mappers dans `helpers/mappers.ts`, builder et issues checker dans `helpers/cart-builder.ts`.

4. Les domaines `payment`, `order-email`, `admin-blog`, `admin-users` et `admin-media` sont laissés intacts — aucune modification structurelle introduite.

5. `pnpm run typecheck` passe sans erreur.

6. `pnpm run lint` passe sans erreur.

7. Aucun consumer dans `app/`, `features/` ou `components/` n'a nécessité de recâblage.

---

## Section 6 — Règles de compatibilité

Aucune façade publique des domaines traités n'est modifiée. Les exports publics de `admin-category.repository.ts`, `admin-homepage.repository.ts` et `guest-cart.repository.ts` restent identiques avant et après V21-5. Aucun consumer ne doit être recâblé.

Règles applicables pendant l'exécution :

- aucun changement de chemin public
- aucun changement de signature runtime
- aucun changement de contrat public exporté
- aucun changement de comportement transactionnel sur `admin-homepage`
- aucun changement de logique de disponibilité, sous-total ou checkout sur `guest-cart`
- aucun changement sur les reads et mutations `admin-category`
