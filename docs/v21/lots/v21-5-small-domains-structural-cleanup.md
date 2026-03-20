# V21-5 — Domaines restants : nettoyage structurel

## Objectif

Modulariser les domaines plats qui présentent un gain structurel net et démontrable. Laisser explicitement intacts les domaines où le gain est marginal ou inexistant. Ne pas introduire de churn par symétrie.

## Scope

### Domaines examinés

Huit domaines ont été audités et tranchés dans `docs/v21/decisions/v21-5-decisions.md` :

- `admin-category` — GO
- `admin-homepage` — GO
- `guest-cart` — GO
- `payment` — NO-GO
- `order-email` — NO-GO
- `admin-blog` — NO-GO
- `admin-users` — NO-GO
- `admin-media` — NO-GO

Les trois domaines `admin-blog`, `admin-users` et `admin-media` ne figuraient pas dans la version initiale de ce lot. Ils ont été audités dans `v21-5-decisions.md` et leurs décisions NO-GO sont opposables dans ce lot.

### Hors périmètre

- Refactor par symétrie avec d'autres domaines
- Modification des contrats publics (types, signatures, exports)
- Modification des comportements métier ou transactionnels
- Tout domaine non listé ci-dessus

---

## Décisions transverses applicables

Les décisions T-1 à T-4 de `docs/v21/decisions/v21-cross-lots-decisions.md` s'appliquent sans exception :

- **T-1** : les petites fonctions utilitaires génériques (`isValidNumericId`, `isValidCategoryId`, `normalizeUniqueIds`, etc.) sont dupliquées localement dans chaque fichier qui en a besoin. Aucune extraction vers un fichier partagé cross-domain.
- **T-2** : si un domaine est modularisé (sous-dossier créé), `TxClient` est extrait dans `<domaine>/types/` et importé par tous les fichiers internes. Pour `admin-homepage`, qui utilisait `TxClient` en local sous hypothèse de non-modularisation, la décision GO de V21-5 impose l'extraction dans `types/tx.ts`.
- **T-3** : les error mappers restent dans la façade publique. `mapPrismaRepositoryError` dans `admin-category.repository.ts` reste en façade.
- **T-4** : sans objet pour les domaines V21-5 (concerne `AdminProductImageRepositoryError` dans `products`).

---

## Go / No-go par domaine

| Domaine | Fichier | Lignes réelles | Décision | Motif résumé |
|---|---|---|---|---|
| admin-category | admin-category.repository.ts | 366 | GO | Bloc de lecture batch autonome de 110 lignes extractible dans `queries/` ; helpers de tri mémoire extractibles dans `helpers/` |
| admin-homepage | admin-homepage.repository.ts | 426 | GO | Trois blocs naturels distincts : lectures pures (~120 lignes), validations transactionnelles (~80 lignes), écritures transactionnelles (~60 lignes) |
| guest-cart | guest-cart.repository.ts | 450 | GO | 450 lignes ; blocs de disponibilité, mappers et agrégation panier clairement séparables ; gain net de lisibilité démontrable |
| payment | payment.repository.ts | 167 | NO-GO | < 200 lignes ; deux transactions Serializable à criticité élevée ; aucun bloc extractible sans risque sur l'idempotence |
| order-email | order-email.repository.ts | 119 | NO-GO | < 150 lignes ; responsabilité unique ; aucun bloc extractible justifié |
| admin-blog | admin-blog.repository.ts | 221 | NO-GO | Logique fortement couplée ; mappers interdépendants ; transaction intégrée à l'orchestration métier ; règle de prudence V21 appliquée |
| admin-users | admin-users.repository.ts | 59 | NO-GO | 59 lignes ; responsabilité unique |
| admin-media | admin-media.repository.ts | 70 | NO-GO | 70 lignes ; responsabilité unique |

---

## Domaines GO — blocs extraits et conservés

### admin-category

**Taille réelle : 366 lignes**

**Blocs extraits :**

| Bloc | Fonctions extraites | Destination |
|---|---|---|
| Lecture batch d'images représentatives | `loadRepresentativeImagesByCategoryIds` | `db/repositories/admin-category/queries/representative-image.queries.ts` |
| Helpers de tri mémoire | `sortCategoriesForAdmin`, `isRepresentativeImageCandidateBetter` | `db/repositories/admin-category/helpers/sort.ts` |

**Blocs conservés en façade :**

| Bloc | Motif |
|---|---|
| `isValidCategoryId` | Utilitaire local < 5 lignes ; duplication locale (T-1) |
| `mapPrismaCategoryToPublic` | Couplé aux types internes ; utilisé dans toutes les mutations et lectures publiques |
| `mapPrismaRepositoryError` | Error mapper ; reste en façade (T-3) |
| Types internes (`PrismaCategoryData`, `CreateAdminCategoryInput`, etc.) | Restent dans la façade ; volume insuffisant pour justifier un sous-dossier `types/` |
| Toutes les fonctions publiques | Orchestration et contrat public |

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

**Implications T-2 :** `admin-category` n'utilise pas d'alias `TxClient`. Règle T-2 sans objet.

---

### admin-homepage

**Taille réelle : 426 lignes**

**Blocs extraits :**

| Bloc | Fonctions extraites | Destination |
|---|---|---|
| Lectures de sélections featured | `listHomepageFeaturedProducts`, `listHomepageFeaturedCategories`, `listHomepageFeaturedBlogPosts`, `loadHomepageFeaturedSelections` | `db/repositories/admin-homepage/queries/featured-selections.queries.ts` |
| Lecture des options éditeur | `loadHomepageOptions` | `db/repositories/admin-homepage/queries/homepage-options.queries.ts` |
| Validations transactionnelles | `ensureHomepageExistsInTx`, `ensurePublishedProductsExistInTx`, `ensureCategoriesExistInTx`, `ensurePublishedBlogPostsExistInTx` | `db/repositories/admin-homepage/helpers/transaction-guards.ts` |
| Écritures transactionnelles | `replaceHomepageFeaturedProductsInTx`, `replaceHomepageFeaturedCategoriesInTx`, `replaceHomepageFeaturedBlogPostsInTx` | `db/repositories/admin-homepage/helpers/transaction-writes.ts` |
| Alias TxClient | `type TxClient` | `db/repositories/admin-homepage/types/tx.ts` |

**Blocs conservés en façade :**

| Bloc | Motif |
|---|---|
| `isValidNumericId` | Utilitaire local < 5 lignes ; duplication locale (T-1) |
| `normalizeUniqueIds` | Utilitaire local < 5 lignes ; duplication locale (T-1) |
| `mapPrismaHomepage` | Couplé aux types publics ; utilisé uniquement dans les fonctions publiques orchestratrices |
| `PrismaHomepageContentData` | Type structural interne utilisé dans la façade et le mapper |
| Toutes les fonctions publiques | Orchestration transactionnelle et contrat public |

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

**Implications T-2 :** `admin-homepage` est modularisé dans V21-5. `TxClient` (défini ligne 188 de la façade actuelle) est extrait dans `types/tx.ts` et importé par les fichiers de `helpers/` qui le reçoivent en paramètre. La note préexistante dans `v21-cross-lots-decisions.md` listant `admin-homepage` comme domaine non modularisé est invalidée par la décision GO de V21-5.

**Implications T-3 :** `admin-homepage` n'a pas d'error mapper qui mappe des erreurs Prisma vers un contrat public. Les `AdminHomepageRepositoryError` lancées depuis les helpers transactionnels sont des erreurs de domaine interne — elles restent dans les helpers. Règle T-3 sans objet.

---

### guest-cart

**Taille réelle : 450 lignes**

**Blocs extraits :**

| Bloc | Fonctions extraites | Destination |
|---|---|---|
| Helpers de disponibilité | `isGuestCartVariantAvailable`, `isGuestCartLineAvailable` | `db/repositories/guest-cart/helpers/availability.ts` |
| Mappers Prisma → contrat | `mapPrismaVariant`, `mapPrismaCartLine`, `mapPrismaCheckoutDetails` | `db/repositories/guest-cart/helpers/mappers.ts` |
| Agrégation panier | `buildGuestCart`, `getGuestCheckoutIssues` | `db/repositories/guest-cart/helpers/cart-builder.ts` |

**Blocs conservés en façade :**

| Bloc | Motif |
|---|---|
| `isValidNumericId` | Utilitaire local < 5 lignes ; duplication locale (T-1) |
| Toutes les fonctions publiques | Orchestration et contrat public ; chaque fonction CRUD est compacte (~15 lignes), extraction sans gain |

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

**Implications T-2 :** `guest-cart` n'utilise pas d'alias `TxClient` (l'upsert atomique de `addGuestCartItemQuantity` n'ouvre pas de transaction explicite avec `TxClient`). Règle T-2 sans objet.

**Implications T-3 :** `guest-cart` n'a pas d'error mapper public. Règle T-3 sans objet.

---

## Domaines explicitement hors V21

**payment** (167 lignes) : deux transactions `{ isolationLevel: "Serializable" }` couvrant l'idempotence des webhooks Stripe. Responsabilité cohérente et bien délimitée. La modularisation n'est pas justifiée dans le cadre V21. Aucune décision ultérieure envisagée sauf ajout substantiel de logique non transactionnelle.

**order-email** (119 lignes) : domaine satellite compact à responsabilité unique. La modularisation n'est pas justifiée. Aucune décision ultérieure envisagée sauf croissance significative du fichier.

**admin-blog** (221 lignes) : blocs trop couplés pour une extraction propre — mappers interdépendants, transaction intégrée à l'orchestration métier, aucun bloc autonome de plus de 30 lignes. La modularisation n'est pas justifiée dans le cadre V21. Une décision ultérieure est possible si le fichier dépasse 300 lignes avec des blocs autonomes identifiables.

**admin-users** (59 lignes) : responsabilité unique, aucun bloc extractible. La modularisation n'est pas justifiée dans V21 ni dans un avenir proche.

**admin-media** (70 lignes) : responsabilité unique, aucun bloc extractible. La modularisation n'est pas justifiée dans V21 ni dans un avenir proche.

---

## Invariants à préserver

- Aucun changement de comportement transactionnel sur `admin-homepage`
- Aucun changement de logique de disponibilité, sous-total ou checkout sur `guest-cart`
- Aucun changement sur `AdminCategory`, ses lectures et mutations admin
- Aucun changement sur `payment` : les deux transactions Serializable restent intactes et non extraites
- Aucun changement sur `order-email`, `admin-blog`, `admin-users`, `admin-media`

---

## Risques principaux

- Introduire un changement comportemental lors de l'extraction des helpers transactionnels de `admin-homepage` (les fonctions `ensure*InTx` et `replace*InTx` doivent recevoir `tx` en paramètre sans altérer leur logique)
- Casser un import interne dans `guest-cart.repository.ts` lors du déplacement des mappers (les fonctions publiques appellent les mappers — les imports doivent être mis à jour)
- Sur-découper un domaine GO au-delà des blocs définis dans ce lot

---

## Fichiers créés par ce lot

**admin-category :**
- `db/repositories/admin-category/queries/representative-image.queries.ts`
- `db/repositories/admin-category/helpers/sort.ts`

**admin-homepage :**
- `db/repositories/admin-homepage/types/tx.ts`
- `db/repositories/admin-homepage/queries/featured-selections.queries.ts`
- `db/repositories/admin-homepage/queries/homepage-options.queries.ts`
- `db/repositories/admin-homepage/helpers/transaction-guards.ts`
- `db/repositories/admin-homepage/helpers/transaction-writes.ts`

**guest-cart :**
- `db/repositories/guest-cart/helpers/availability.ts`
- `db/repositories/guest-cart/helpers/mappers.ts`
- `db/repositories/guest-cart/helpers/cart-builder.ts`

---

## Vérifications obligatoires

- `pnpm run typecheck` — sans erreur
- `pnpm run lint` — sans erreur
- Vérifier que seuls les domaines GO ont été modifiés
- Vérifier que les domaines NO-GO sont intacts (aucun fichier créé, aucune ligne modifiée)
- Vérifier qu'aucun consumer dans `app/`, `features/` ou `components/` n'a nécessité de recâblage

---

## Critères de fin

V21-5 est considéré terminé quand toutes les conditions suivantes sont vérifiées :

1. `admin-category` a été modularisé : `loadRepresentativeImagesByCategoryIds` extrait dans `queries/representative-image.queries.ts` ; `sortCategoriesForAdmin` et `isRepresentativeImageCandidateBetter` extraits dans `helpers/sort.ts`.

2. `admin-homepage` a été modularisé : lectures de sélections dans `queries/featured-selections.queries.ts` ; options éditeur dans `queries/homepage-options.queries.ts` ; validations transactionnelles dans `helpers/transaction-guards.ts` ; écritures transactionnelles dans `helpers/transaction-writes.ts` ; `TxClient` extrait dans `types/tx.ts`.

3. `guest-cart` a été modularisé : helpers de disponibilité dans `helpers/availability.ts` ; mappers dans `helpers/mappers.ts` ; builder et issues checker dans `helpers/cart-builder.ts`.

4. Les domaines `payment`, `order-email`, `admin-blog`, `admin-users` et `admin-media` sont intacts — aucune modification structurelle introduite.

5. `pnpm run typecheck` passe sans erreur.

6. `pnpm run lint` passe sans erreur.

7. Aucun consumer dans `app/`, `features/` ou `components/` n'a nécessité de recâblage.

---

## Règles de compatibilité

Aucune façade publique des domaines traités n'est modifiée. Les exports publics de `admin-category.repository.ts`, `admin-homepage.repository.ts` et `guest-cart.repository.ts` restent identiques avant et après V21-5.

Règles applicables pendant l'exécution :

- Aucun changement de chemin public
- Aucun changement de signature runtime
- Aucun changement de contrat public exporté
- Aucun consumer ne doit être recâblé

---

## Référence

Décisions détaillées (go/no-go par domaine, blocs nominaux, implications transverses) : `docs/v21/decisions/v21-5-decisions.md`
