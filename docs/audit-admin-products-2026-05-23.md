# Audit `features/admin/products/*` — 2026-05-23

> Audit de convergence progressive vers le modèle `features/admin/categories/*`.
> Aucun fichier modifié. Aucun refactor déclenché. Diagnostic uniquement.

---

## 1. Résumé exécutif

**État global : moyen — fonctionnel mais fragile à maintenir**

`features/admin/products/*` est **fonctionnel et cohérent dans ses grandes lignes**, mais il souffre de quatre catégories de problèmes concrets :

1. **Duplications silencieuses de types** qui créent un risque de divergence progressive (deux `ProductStockState`, deux `ProductSortOption`, deux `ProductListFilters`).
2. **Surfilamentation de la zone `list/`** : trop de sous-dossiers et de niveaux d'indirection pour un volume d'objets qui ne le justifie pas.
3. **Config incomplète** : le fichier `product-feedback.config.ts` n'existe pas, alors qu'il existe dans `categories`. Les messages de feedback sont dispersés dans les actions et composants.
4. **Fichiers résidus** : un fichier vide (`admin-product.types.ts`), un mapper trivial (`mapProductFilterCategoryOption`), du dead code commenté dans `product-list.config.ts`.

**Risques principaux :**
- Le double `ProductStockState` (avec vs sans `low-stock`) génère une perte silencieuse de l'état `low-stock` dans le mapper de la table. C'est le seul défaut qui peut produire un bug visible.
- Les deux `ProductListFilters` (l'un dans `types/`, l'autre dans `queries/`) ont des signatures différentes. Ce n'est pas encore un bug mais c'est une source d'erreur future dès qu'on croisera les deux.

**Niveau d'urgence : bas à moyen.**
Aucun flux cassé. Aucune action bloquante. La convergence vers `categories` peut se faire en micro-lots sûrs, sans urgence.

**Recommandation générale :**
Nettoyer les duplications de types en priorité, puis consolider la config, puis simplifier la zone `list/`. Ne pas toucher à l'editor (complexité légitime) tant que les fondations ne sont pas stabilisées.

---

## 2. Cartographie actuelle de `features/admin/products/*`

**Volume :** 177 fichiers (vs 52 pour `categories`, ratio 3,4×).

### 2.1 `config/`

| Fichier | Rôle réel | État |
|---|---|---|
| `product-list.config.ts` | Options de filtres, copy table/toolbar/cards/mobile | ✅ Sain — mais contient un bloc `PRODUCT_LIST_PAGE_COPY` commenté (dead code) |
| `product-editor.config.ts` | Copy de tous les onglets éditeur (général, pricing, variantes, images, SEO…) | ✅ Sain — exhaustif, justifié par la complexité |
| `product-navigation.config.ts` | Copy navigation + page titles (inclut `PRODUCT_LIST_PAGE_COPY`) | ⚠️ Conflit avec le bloc commenté dans `product-list.config.ts` |
| `product-sortable.columns.config.ts` | Config colonnes triables | ⚠️ Utilise `Record<string, SortableColumnConfig<string>>` au lieu de `SortableColumnConfig<ProductSortOption>` comme categories |
| `index.ts` | Barrel | ✅ Propre |

**Manquant :** `product-feedback.config.ts` — tous les messages d'erreur et de succès sont actuellement éparpillés directement dans les actions et les composants.

### 2.2 `types/`

| Fichier | Rôle réel | État |
|---|---|---|
| `admin-product-shared.types.ts` | Types partagés : `AdminProductSummary`, `AdminProductRecord`, variants, categories liées | ✅ Sain |
| `action-result.types.ts` | `AdminProductActionResult` (`{ status, message }`) | ✅ Sain |
| `admin-product.types.ts` | **Vide** — 0 ligne | 🔴 Fichier fantôme à supprimer |
| `index.ts` | Barrel | ✅ Propre |

### 2.3 `list/`

Dossier le plus fragmenté. Il contient 6 sous-dossiers pour une feature de listing.

```
list/
  actions/        ← 3 fichiers (toggle, bulk, index)
  hooks/          ← use-product-table-filters.ts + index
  mappers/
    map-product-filter-category-option.ts   ← mapper trivial (passthrough)
    server/       ← map-admin-product-feed-item.ts, map-product-table-item.ts, index
    shared/       ← map-admin-product-feed-item-to-table-item.ts, index
  queries/        ← product-list-queries.ts + index
  schemas/        ← 3 fichiers (filters, bulk, feed)
  services/       ← 2 fichiers (bulk, toggle)
  types/          ← 6 fichiers (table, feed, bulk, card-item, list-query)
  utils/          ← 2 fichiers (utils, filter-labels)
  index.ts
```

**Problèmes dans `list/types/`** (section critique) :

| Fichier | Problème |
|---|---|
| `product-table.types.ts` | Définit `ProductStockState = "in-stock" \| "out-of-stock"` |
| `admin-product-card-item.types.ts` | Définit `ProductStockState = "in-stock" \| "low-stock" \| "out-of-stock"` |
| → Double définition **avec valeurs différentes** | Risque de bug (voir §5 P0) |
| `product-table.types.ts` | Définit `ProductSortOption` |
| `product-list-query.types.ts` | Redéfinit `ProductSortOption` (mêmes valeurs, ordre différent) |
| `product-list-query.types.ts` | Définit `ProductListFilters` (sans `view`) |
| `list/queries/product-list-queries.ts` | Définit et exporte `ProductListFilters` (avec `view`) — type différent |

**`list/mappers/` trop fragmenté :**
- `map-product-filter-category-option.ts` : mapper passthrough inutile (retourne l'input tel quel).
- `server/map-product-table-item.ts` : délègue entièrement à `shared/map-admin-product-feed-item-to-table-item.ts` sans ajouter de valeur.
- 3 niveaux d'indirection (top, `server/`, `shared/`) pour ce qui pourrait tenir dans 2 fichiers.

### 2.4 `editor/`

Dossier le plus riche et **le plus justifié** dans sa complexité.

```
editor/
  actions/
    product-update-editor-actions.ts   ← 12 actions de mise à jour
    product-image-editor-actions.ts    ← 5 actions images
    product-variant-editor-actions.ts  ← 4 actions variantes
    delete-product.action.ts           ← action de suppression
    index.ts
  hooks/
    use-product-categories-manager.ts  ← gestionnaire catégories
    index.ts
  mappers/
    product-editor-mappers.ts
    index.ts
  queries/
    get-admin-product-editor-data.query.ts  ← entry point
    get-admin-product-editor-data/          ← sous-dossier (readers, mappers, selects, types)
    product-editor-list-queries.ts
    product-editor-read-queries.ts
    index.ts
  schemas/                              ← 5 fichiers (form, image, media, variant, delete)
  services/
    product-update-services.ts
    product-image-services.ts
    product-variant-services.ts
    shared.ts                           ← barrel re-export du dossier shared/
    shared/                             ← 6 fichiers (assertions, mappers, error)
    index.ts
  types/                                ← 4 fichiers (editor, form, image, variant)
  index.ts
```

**Constat :** L'organisation est solide mais le `services/shared.ts` et le dossier `services/shared/` coexistent — le fichier `.ts` est un barrel qui réexporte le dossier. Acceptable mais inhabituel (risque de confusion `import from ./shared` vs `import from ./shared/error`).

**Incohérence cache:** `delete-product.action.ts` utilise `revalidatePath()` avec des chemins hardcodés (`"/admin/products"`, `"/admin/products/${slug}/edit"`), tandis que tous les autres actions utilisent `refresh()`. Cette incohérence est fonctionnelle mais crée un comportement différent (revalidation partielle vs totale).

### 2.5 `shared/`

Contient le lifecycle produit (archive, restore, delete permanent) côté action ET service.

```
shared/
  product-lifecycle-actions.ts   ← archiveProductBySlugAction, deleteProductPermanentlyBySlugAction, restoreProductBySlugAction
  product-lifecycle-services.ts  ← archiveProduct, restoreProduct, deleteProductPermanently, deleteProductCatalogByIdInTx
  index.ts
```

**Constat :** Logique propre et bien bornée. Ces fonctions sont partagées entre la liste et l'éditeur.

### 2.6 `navigation/`

```
navigation/
  products-page-params.ts        ← types + schemas + normalizer (consolidés)
  products-page-hrefs.ts         ← builders d'URL
  parse-products-page-params.ts  ← entry point parser
  index.ts
```

**Constat :** Bien consolidé — types, schemas et normalizer dans un seul fichier plutôt que 3 fichiers séparés. Plus propre que la simple constante `shared/admin-categories-routes.ts` de categories, et justifié par la complexité de navigation produits (filtres persistants dans l'URL).

### 2.7 `create/`

```
create/
  create-product.action.ts    ← action serveur
  create-product.query.ts     ← liste des types de produits créables
  create-product.schema.ts    ← schéma Zod
  create-product.service.ts   ← service métier
  create-product.types.ts     ← types
  index.ts
```

**Constat :** Cohérent et propre. Structure claire action / service / query / schema / types.

### 2.8 `details/`

```
details/
  product-detail-types.ts                        ← 3 types (AdminProductDetails, AdminProductDetailsFull, variantes)
  read-admin-product-details-by-slug.query.ts    ← query légère
  map-product-details.ts                         ← mapper riche (interne)
  index.ts
```

**Constat :** La séparation `AdminProductDetails` (type public léger) / `AdminProductDetailsFull` (type interne riche) est bien pensée mais `AdminProductDetails.slug` est `string | null` alors que tous les produits ont un slug non-null en base. Léger problème de typage.

### 2.9 `preview/`, `seo/`, `mappers/`, `hooks/`

| Zone | Constat |
|---|---|
| `preview/` | Query isolée pour la prévisualisation — propre |
| `seo/` | Types + helpers SEO produit (consolidés dans un fichier) — propre |
| `mappers/` | Mappers partagés (status, shared, related-type) — propre |
| `hooks/use-admin-product-feed.ts` | Hook de feed infini — propre, bien isolé |

### 2.10 `components/`

```
components/
  create/         ← 2 composants (panel, topbar-menu)
  details/        ← 2 composants (panel, details)
  editor/
    categories/   ← 1 composant
    hooks/        ← use-archived-product-mutations.ts (hook dans les composants)
    images/       ← product-image-item.tsx
    variants/     ← 4 fichiers (variant editor, item, color values, utils)
    product-*-tab.tsx × 9 (onglets)
    product-archived-actions.tsx
    product-editor-panel.tsx
    product-topbar-menus.tsx
    index.ts
  list/
    hooks/        ← 5 hooks (controller, actions, feedback, mobile-selection, lifecycle-state)
    mobile/cards/ ← 6 composants
    table/        ← 2 composants (bulk-bar, empty-state)
    toolbar/      ← 5 composants (filters, mobile-drawer, bulk-actions, delete-dialog, view-switch)
    product-table-context.tsx
    product-table.tsx + desktop + mobile + row
    product-featured-toggle.tsx, product-stock-badge.tsx, etc.
    index.ts
  shared/         ← 4 composants partagés (shell, section, eyebrow, type-label)
  index.ts
```

**Problèmes dans `components/` :**
- `components/editor/hooks/use-archived-product-mutations.ts` : hook dans le dossier composants alors qu'il porte de la logique métier (appel d'actions). Devrait être dans `editor/hooks/`.
- `components/list/hooks/` : 5 hooks (controller, actions, feedback, mobile-selection, lifecycle-state) sont dans le dossier composants. Categories n'a aucun hook dans ses composants.
- `router.refresh()` appelé directement dans `product-pricing-tab.tsx`, `product-seo-tab.tsx`, `product-archived-actions.tsx` — les Server Actions devraient gérer l'invalidation de cache.

---

## 3. Flux réels de la feature produits

### 3.1 Listing produits (vue active / corbeille)

**Fichiers impliqués :**
- `list/queries/product-list-queries.ts` → `listAdminProducts()` + `listProductFilterCategories()`
- `list/mappers/server/map-admin-product-feed-item.ts` → `mapAdminProductFeedItem()`
- `list/mappers/shared/map-admin-product-feed-item-to-table-item.ts` → conversion pour la table
- `components/list/product-table-context.tsx` → `ProductTableProvider`
- `components/list/hooks/use-product-table-controller.ts` → orchestre filters + actions + mobile
- `list/hooks/use-product-table-filters.ts` → state URL + filtres client-side résiduels

**Problème :** `listAdminProducts` renvoie des `AdminProductFeedItem`. `getAdminProductsFeedPage` appelle `listAdminProducts` puis re-filtre en mémoire (double passage sur les données). Si la liste est grande, c'est un gaspillage.

**Comparaison categories :** Categories n'a pas de "feed" séparé. Un seul flux: `listAdminCategories()` → `mapCategoryListItem()` → context. Plus simple, moins de couches.

### 3.2 Filtres / tri / pagination

**Products :** 3 niveaux de filtres:
1. Serveur: search, status, sort, featured, categoryIds, page, perPage
2. Client: image, stock, variant (états locaux non persistés en URL)
3. Residual: filtre côté client sur les items déjà chargés

**Categories :** Tous les filtres sont URL-driven via `useCategoryFilters`. Pas de filtre client-side résiduel.

**Problème products :** Les filtres image/stock/variant ne sont pas persistés en URL. Si on navigue et revient, ils sont perdus. Comportement incohérent avec les autres filtres.

### 3.3 Sélection bulk

**Products :** `useProductTableActions` (dans `components/list/hooks/`) + actions dans `list/actions/` + services dans `list/services/`. La sélection est gérée dans le hook, le feedback dans `useProductTableFeedback`.

**Categories :** `useCategoriesTableContext` (context simple) + actions dans `actions/category-lifecycle-actions.ts`. Pas de hook dédié côté composants.

**Constat :** La solution products est plus complète (sélection page, sélection mobile, bulk status, bulk featured) — complexité justifiée par les besoins.

### 3.4 Archivage / restauration / suppression

**Products :** 2 sources :
- `shared/product-lifecycle-actions.ts` → actions par slug (archive, restore, delete permanent)
- `list/actions/product-bulk-actions.ts` → actions bulk par IDs

**Categories :** 1 source centralisée : `actions/category-lifecycle-actions.ts` (archive, bulk archive, restore, hard delete).

**Constat :** La séparation products `shared/` vs `list/actions/` est fonctionnelle mais crée deux points d'entrée pour des opérations similaires.

### 3.5 Création produit

**Fichiers :** `create/create-product.action.ts` → `create-product.service.ts` → `create-product.query.ts`
Flux en 2 étapes (wizard) : nom/slug → type de produit. Propre et bien isolé.

### 3.6 Édition produit (éditeur)

9 onglets: Général, Pricing, Disponibilité, Inventaire, Caractéristiques, Produits liés, Catégories, SEO, Médias, Variantes.

Chaque onglet : composant → `useActionState` → action → service → `refresh()`.

**Problème `product-pricing-tab.tsx` :** Le composant appelle `router.refresh()` en plus du `refresh()` dans l'action — double invalidation.

**Problème `delete-product.action.ts` :** Utilise `revalidatePath()` avec chemins hardcodés au lieu de `refresh()`.

---

## 4. Comparaison avec `features/admin/categories/*`

### 4.1 Ce que `categories` fait mieux

**Structure config :**
- Categories a `category-feedback.config.ts` avec tous les messages d'erreur et de succès centralisés, exportés via des fonctions typées (`getCategoryEditFormErrorMessage`, etc.).
- Products n'a pas ce fichier : messages éparpillés dans les actions.

**Types non-dupliqués :**
- Categories définit `CategorySortOption` une seule fois dans `list/types/category-list-query.types.ts`.
- Categories n'a pas de `ProductStockState` dupliqué.

**Sortable columns config typé :**
- `CategorySortOption` est utilisé comme paramètre générique : `SortableColumnConfig<CategorySortOption>`.
- Products utilise `SortableColumnConfig<string>` — perte de la vérification de type.

**Hooks dans les composants :**
- Categories : aucun hook métier dans `components/`. Le seul hook est `useCategoryFilters` dans `list/hooks/`, importé directement.
- Products : 5 hooks dans `components/list/hooks/` + 1 hook dans `components/editor/hooks/`.

**Barrel public clair :**
- `categories/index.ts` exporte tout de manière structurée et claire.
- `products/index.ts` exporte aussi beaucoup de types internes (`ProductStockState`, `ProductTableFiltersValues`, etc.) qui n'ont pas vocation à être publics.

**Mappers simples :**
- Categories: 1 mapper (`map-category-list-item.ts`) direct, sans sous-dossiers.
- Products: 3 niveaux de mappers (top, `server/`, `shared/`) dont un mapper trivial.

**Feedback centralisé :**
- Categories : `CategoriesTableProvider` + un seul point d'entrée pour les données de la table.
- Products : contexte + controller + 5 hooks — plus difficile à tracer.

### 4.2 Ce que `products` fait mieux

**Navigation consolidée :**
- `navigation/` rassemble types, schemas, builders et normalizer — plus robuste que la simple constante `shared/admin-categories-routes.ts`.

**Config editor riche :**
- `product-editor.config.ts` couvre 100% du copy de l'éditeur avec une granularité parfaite (un bloc par onglet).

**`shared/` lifecycle propre :**
- Les actions lifecycle (`archiveProduct`, `restoreProduct`, `deleteProductPermanently`) sont bien bornées dans `shared/` et réutilisables depuis la liste et l'éditeur.

**`create/` autonome :**
- La création produit est proprement isolée avec sa propre action, service, query, schema et types.

**`editor/services/shared/` structuré :**
- Les assertions (product, variant, media, categories, related) sont dans des fichiers dédiés, testables indépendamment.

### 4.3 Ce qu'il ne faut PAS copier de `categories`

| Domaine | Raison de la différence |
|---|---|
| Absence de wizard de création | Products a un wizard 2 étapes (nom + type) — justifié |
| Mappers simples | Products a stock, prix, variantes, catégories multiples à mapper — sous-dossiers partiellement justifiés |
| Un seul hook de liste | Products a la sélection bulk mobile, les filtres résiduels client-side, le controller — la décomposition est justifiée |
| Onglets éditeur | Categories a un éditeur à plat (général + SEO + image + archive). Products a 10 onglets — inévitable |
| `navigation/` simple | Products doit persister les filtres dans l'URL lors de la navigation liste↔détail — `navigation/` justifié |

---

## 5. Problèmes classés par priorité

### P0 — Bloquant

#### 5.P0.1 — `ProductStockState` défini deux fois avec des valeurs différentes

**Fichiers :**
- `list/types/admin-product-card-item.types.ts` : `"in-stock" | "low-stock" | "out-of-stock"`
- `list/types/product-table.types.ts` : `"in-stock" | "out-of-stock"`

**Constat précis :** Le mapper `mapAdminProductFeedItemToTableItem` (`list/mappers/shared/`) fait :
```ts
stockState: item.stockState === "in-stock" ? "in-stock" : "out-of-stock"
```
Ce mapping écrase silencieusement l'état `low-stock` → `out-of-stock`. Si `mapAdminProductFeedItem` produit jamais `low-stock`, la table affiche "Rupture" à tort.

**Impact :** Bug d'affichage latent. L'état `low-stock` de `admin-product-card-item.types.ts` est actuellement mort (la query ne le produit pas) mais la divergence rend le code fragile.

**Recommandation :** Unifier en un seul type dans `list/types/product-table.types.ts`. Supprimer `ProductStockState` de `admin-product-card-item.types.ts`. Décider si `low-stock` doit exister (et l'implémenter) ou non (et le supprimer).

**Risque de régression :** Moyen — les imports doivent être mis à jour.
**Effort :** S

---

#### 5.P0.2 — `ProductListFilters` défini deux fois avec des signatures différentes

**Fichiers :**
- `list/types/product-list-query.types.ts` : `{ search, status, featured, sort, categorySlugs, page, perPage }` (sans `view`)
- `list/queries/product-list-queries.ts` : `{ view, search, status, sort, page, perPage, categoryIds, featured }` (avec `view`, sans `categorySlugs`)

**Constat :** Deux types homonymes avec des propriétés différentes. L'un est exporté depuis `list/index.ts` (via `types/`), l'autre est un type local à la query. Si une refactorisation importe le mauvais, TypeScript peut laisser passer une erreur silencieuse.

**Recommandation :** Conserver uniquement le type dans `list/queries/product-list-queries.ts` (avec `view`). Supprimer celui de `product-list-query.types.ts`. Mettre à jour le barrel.

**Risque de régression :** Faible — le type de `types/` n'est pas utilisé par les queries actuelles.
**Effort :** S

---

### P1 — Important

#### 5.P1.1 — `ProductSortOption` défini deux fois

**Fichiers :**
- `list/types/product-table.types.ts`
- `list/types/product-list-query.types.ts`

**Constat :** Mêmes valeurs, ordre différent. Pas de bug aujourd'hui mais divergence possible si l'un des deux est modifié.

**Recommandation :** Garder une seule définition dans `product-table.types.ts`. Réexporter depuis `product-list-query.types.ts`.

**Risque :** Faible. **Effort :** S.

---

#### 5.P1.2 — `admin-product.types.ts` vide (fichier fantôme)

**Fichier :** `types/admin-product.types.ts` — 0 ligne de contenu.

**Constat :** `types/index.ts` n'importe rien depuis ce fichier. Il est vestigial.

**Recommandation :** Supprimer le fichier.

**Risque :** Nul. **Effort :** S.

---

#### 5.P1.3 — `mapProductFilterCategoryOption` est un passthrough inutile

**Fichier :** `list/mappers/map-product-filter-category-option.ts`

```ts
export function mapProductFilterCategoryOption(input: ProductFilterCategoryOption): ProductFilterCategoryOption {
  return input;
}
```

**Constat :** Mapper qui retourne son entrée sans transformation. Exporté depuis `list/index.ts` et depuis `products/index.ts`. Tous les appelants peuvent utiliser le type directement.

**Recommandation :** Supprimer le fichier et retirer son export du barrel.

**Risque :** Faible (mettre à jour les imports appelants). **Effort :** S.

---

#### 5.P1.4 — Config feedback absente

**Constat :** `categories` a `config/category-feedback.config.ts` qui centralise tous les messages d'erreur et de succès avec des fonctions typées. `products` n'a pas l'équivalent : les messages sont inline dans chaque action et dans les composants.

**Impact :** Impossible de vérifier la cohérence des messages sans lire chaque action. Doublons probables (le même message "Produit introuvable." apparaît dans plusieurs fichiers d'action).

**Recommandation :** Créer `config/product-feedback.config.ts`. Déplacer les messages répétitifs. Ne pas faire la migration en une seule fois — commencer par les actions lifecycle.

**Risque :** Faible si fait en micro-lot. **Effort :** M.

---

#### 5.P1.5 — `delete-product.action.ts` utilise `revalidatePath` au lieu de `refresh()`

**Fichier :** `editor/actions/delete-product.action.ts`

**Constat :** Tous les autres actions utilisent `refresh()` (Next.js 15 cache). `delete-product.action.ts` utilise `revalidatePath("/admin/products")` avec un chemin hardcodé. Comportement d'invalidation différent et chemin fragile.

**Recommandation :** Remplacer par `refresh()`.

**Risque :** Très faible. **Effort :** S.

---

#### 5.P1.6 — `router.refresh()` dans des composants de présentation

**Fichiers :**
- `components/editor/product-pricing-tab.tsx`
- `components/editor/product-seo-tab.tsx`
- `components/editor/product-archived-actions.tsx`

**Constat :** Des composants UI appellent `router.refresh()` en plus du `refresh()` déjà fait dans l'action serveur. Double invalidation. Logique de navigation dans la couche présentation.

**Recommandation :** Vérifier si le `router.refresh()` est redondant avec le `refresh()` de l'action. Si oui, supprimer. Si non (cas spécifique de rechargement côté client), documenter le pourquoi.

**Risque :** Faible — au pire un rafraîchissement de moins. **Effort :** S.

---

#### 5.P1.7 — `components/editor/hooks/use-archived-product-mutations.ts` mal placé

**Fichier :** `components/editor/hooks/use-archived-product-mutations.ts`

**Constat :** Hook qui appelle des actions serveur (`archiveProductBySlugAction`, `deleteProductPermanentlyBySlugAction`, `restoreProductBySlugAction`). Ce hook porte de la logique métier — il devrait être dans `editor/hooks/`, pas dans `components/`.

**Recommandation :** Déplacer vers `editor/hooks/use-archived-product-mutations.ts`. Mettre à jour les imports.

**Risque :** Faible. **Effort :** S.

---

### P2 — Amélioration structurante

#### 5.P2.1 — Mappers `list/` trop fragmentés

**Fichiers :**
- `list/mappers/map-product-filter-category-option.ts` (trivial — voir P1.3)
- `list/mappers/server/map-admin-product-feed-item.ts` (gros mapper de la query)
- `list/mappers/server/map-product-table-item.ts` (délègue entièrement à `shared/`)
- `list/mappers/shared/map-admin-product-feed-item-to-table-item.ts`

**Constat :** 3 niveaux de dossiers pour 3 fichiers utiles. `map-product-table-item.ts` ne fait que déléguer vers `shared/` — couche inutile.

**Recommandation :** Aplatir à 2 fichiers : `list/mappers/map-admin-product-feed-item.ts` et `list/mappers/map-product-table-item.ts`. Supprimer les sous-dossiers `server/` et `shared/`.

**Référence `categories` :** 1 seul mapper plat `list/mappers/map-category-list-item.ts`.

**Risque :** Moyen (nombreux imports à mettre à jour). **Effort :** M.

---

#### 5.P2.2 — `components/list/hooks/` — 5 hooks dans les composants

**Fichiers :**
- `use-product-table-controller.ts`
- `use-product-table-actions.ts`
- `use-product-table-feedback.ts`
- `use-product-table-mobile-selection.ts`
- `use-product-lifecycle-action-state.ts`

**Constat :** Ces hooks gèrent la sélection, le state des actions bulk, le feedback et le controller. Ce sont des hooks de logique, pas de présentation. Ils devraient être dans `list/hooks/` (où se trouve déjà `use-product-table-filters.ts`).

**Recommandation :** Déplacer vers `list/hooks/`. Le dossier `components/list/hooks/` n'aurait alors plus de raison d'exister.

**Référence `categories` :** `useCategoryFilters` est dans `list/hooks/`, pas dans `components/`.

**Risque :** Moyen. **Effort :** M.

---

#### 5.P2.3 — `services/shared.ts` + `services/shared/` coexistents dans l'editor

**Constat :** Le fichier `editor/services/shared.ts` est un barrel qui réexporte le dossier `editor/services/shared/`. Ce pattern (fichier `.ts` et dossier du même nom) est ambigu dans certains résolveurs de modules.

**Recommandation :** Renommer `shared.ts` en `shared/index.ts` et déplacer le contenu dedans, ou supprimer `shared.ts` et importer directement depuis `shared/`. La seconde option est plus simple.

**Risque :** Faible. **Effort :** S.

---

#### 5.P2.4 — `PRODUCT_LIST_PAGE_COPY` commenté dans `product-list.config.ts`

**Fichier :** `config/product-list.config.ts` (ligne 72)

**Constat :** Un bloc `PRODUCT_LIST_PAGE_COPY` est commenté, puis redéfini dans `config/product-navigation.config.ts`. Le commentaire laisse une ambiguïté sur la source de vérité.

**Recommandation :** Supprimer le bloc commenté dans `product-list.config.ts`.

**Risque :** Nul. **Effort :** S.

---

#### 5.P2.5 — `product-sortable.columns.config.ts` utilise `string` au lieu du type sort

**Fichier :** `config/product-sortable.columns.config.ts`

```ts
} satisfies Record<string, SortableColumnConfig<string>>;
// categories :
} satisfies Record<string, SortableColumnConfig<CategorySortOption>>;
```

**Constat :** La vérification de type est perdue. Si `ProductSortOption` change, le compilateur ne vérifiera pas la cohérence avec `PRODUCT_SORTABLE_COLUMNS`.

**Recommandation :** Remplacer `<string>` par `<ProductSortOption>`.

**Risque :** Nul (uniquement côté type). **Effort :** S.

---

#### 5.P2.6 — `list/hooks/` et `list/queries/` définissent des choses proches

**Constat :** `list/hooks/use-product-table-filters.ts` est le seul fichier de `list/hooks/`. Les hooks de la table sont dans `components/list/hooks/`. La séparation actuelle est artificielle.

**Recommandation :** Après le déplacement du lot P2.2, `list/hooks/` contiendrait tous les hooks de liste. Plus cohérent.

---

### P3 — Cosmétique

#### 5.P3.1 — `components/list/table/` et `components/list/toolbar/` bien alignés sur `categories`

**Constat :** La séparation `table/` (bulk-bar, empty-state) et `toolbar/` (filter-controls, mobile-drawer, bulk-actions, delete-dialog, view-switch) est cohérente avec `categories`. Pas de problème.

#### 5.P3.2 — Barrel `products/index.ts` trop bavard

**Constat :** Le barrel racine exporte des types très internes (`ProductTableFiltersValues`, `ProductTableFiltersInput`, `ProductStockState`, etc.) qui ne devraient pas être publics. `categories/index.ts` est plus sélectif.

**Recommandation :** Nettoyer les exports après la résolution des duplications.

---

## 6. Proposition de structure cible sobre

La structure cible garde la complexité légitime de `products` tout en corrigeant les problèmes identifiés.

### `config/`

**Responsabilité :** Options de filtres, copy UI, colonnes, navigation, feedback.
**À ajouter :** `product-feedback.config.ts` avec les messages centralisés.
**À corriger :** Supprimer le bloc commenté dans `product-list.config.ts`. Typer `product-sortable.columns.config.ts<ProductSortOption>`.

### `types/`

**Responsabilité :** Types partagés entre toutes les zones (summary, record, variants, action-result).
**À faire :** Supprimer `admin-product.types.ts` vide. Vérifier que les types dupliqués sont retirés.

### `list/`

**Responsabilité :** Listing, filtres, bulk, feed.

```
list/
  actions/            ← inchangé (toggle, bulk, index)
  hooks/              ← use-product-table-filters + hooks déplacés depuis components/list/hooks/
  mappers/            ← aplati : map-admin-product-feed-item.ts + map-product-table-item.ts
  queries/            ← inchangé
  schemas/            ← inchangé
  services/           ← inchangé
  types/              ← après nettoyage des duplications
  utils/              ← inchangé
  index.ts
```

**À ne pas faire :** Ne pas supprimer la pagination server-side, le feed cursor, la sélection bulk mobile — tout cela est justifié.

### `editor/`

**Responsabilité :** Actions, services, queries, schemas et types de l'éditeur produit.
**Modifications minimales :**
- Déplacer `use-archived-product-mutations.ts` de `components/editor/hooks/` vers `editor/hooks/`.
- Résoudre l'ambiguïté `services/shared.ts` vs `services/shared/`.
- Corriger `delete-product.action.ts` (`revalidatePath` → `refresh()`).

**À ne pas toucher :** La sous-structure `queries/get-admin-product-editor-data/` est bien organisée et ne mérite pas de refactor.

### `shared/`

**Responsabilité :** Lifecycle partagé (archive, restore, delete). Inchangé.

### `navigation/`

**Responsabilité :** Params URL, builders d'URL. Inchangé — supérieur au pattern `categories`.

### `create/`

**Responsabilité :** Création produit (wizard). Inchangé.

### `details/`, `preview/`, `seo/`, `mappers/`, `hooks/`

Inchangés — bien organisés et bornés.

### `components/`

```
components/
  create/       ← inchangé
  details/      ← inchangé
  editor/
    categories/ ← inchangé
    images/     ← inchangé
    variants/   ← inchangé
    product-*-tab.tsx × 9
    product-editor-panel.tsx
    product-topbar-menus.tsx
    product-archived-actions.tsx
    index.ts
    (hooks/ supprimé — déplacé vers editor/hooks/)
  list/
    mobile/cards/   ← inchangé
    table/          ← inchangé
    toolbar/        ← inchangé
    product-table-context.tsx
    product-table.tsx + desktop + mobile + row
    product-featured-toggle.tsx, etc.
    index.ts
    (hooks/ supprimé — déplacé vers list/hooks/)
  shared/       ← inchangé
  index.ts
```

---

## 7. Plan de convergence par micro-lots

### Lot 1 — Nettoyage des résidus et dead code

**Objectif :** Supprimer les fichiers inutiles et le dead code sans risque de régression.

**Fichiers ciblés :**
- Supprimer `types/admin-product.types.ts` (vide)
- Supprimer le bloc commenté `PRODUCT_LIST_PAGE_COPY` dans `config/product-list.config.ts`
- Supprimer `list/mappers/map-product-filter-category-option.ts` (passthrough)
- Retirer son export de `list/index.ts` et de `products/index.ts`

**Modifications attendues :** 3 fichiers supprimés, 2 barrels mis à jour.

**Risques :** Très faibles. Vérifier qu'aucun appelant n'importe `mapProductFilterCategoryOption` en dehors de `products/`.

**Commandes de vérification :**
```bash
pnpm run typecheck
pnpm run lint
grep -rn "mapProductFilterCategoryOption" src/ app/ features/ --include="*.ts" --include="*.tsx"
grep -rn "admin-product.types" src/ app/ features/ --include="*.ts"
```

---

### Lot 2 — Unifier les types dupliqués

**Objectif :** Éliminer les deux `ProductStockState`, les deux `ProductSortOption`, les deux `ProductListFilters`.

**Fichiers ciblés :**
1. `list/types/product-table.types.ts` : source de vérité pour `ProductStockState` et `ProductSortOption`
2. `list/types/admin-product-card-item.types.ts` : supprimer `ProductStockState`, importer depuis `product-table.types.ts`
3. `list/types/product-list-query.types.ts` : supprimer `ProductSortOption` (réexporter depuis `product-table.types.ts`), supprimer `ProductListFilters` (conserver uniquement dans `list/queries/`)
4. `list/mappers/shared/map-admin-product-feed-item-to-table-item.ts` : corriger le mapping `stockState` pour gérer `low-stock` explicitement (ou unifier les valeurs possibles)

**Risques :** Moyen — les imports dans plusieurs composants et barrels doivent être mis à jour. Faire en une seule PR pour éviter un état intermédiaire incohérent.

**Commandes de vérification :**
```bash
pnpm run typecheck
pnpm run lint
grep -rn "ProductStockState" --include="*.ts" --include="*.tsx" features/
grep -rn "ProductSortOption" --include="*.ts" --include="*.tsx" features/
grep -rn "ProductListFilters" --include="*.ts" --include="*.tsx" features/
```

---

### Lot 3 — Config feedback et corrections cosmétiques config

**Objectif :** Créer `product-feedback.config.ts`, corriger le typage de `product-sortable.columns.config.ts`.

**Fichiers ciblés :**
- Créer `config/product-feedback.config.ts` avec les messages de feedback récurrents (archive, restore, delete — au moins les messages lifecycle)
- Mettre à jour `config/product-sortable.columns.config.ts` : `SortableColumnConfig<ProductSortOption>` (importer depuis `list/types/product-table.types.ts`)
- Mettre à jour `config/index.ts`

**Limites à ne pas dépasser :** Ne pas migrer tous les messages inline en une fois. Commencer par les actions lifecycle (5-6 messages).

**Risques :** Faibles. Pas de changement de comportement.

**Commandes de vérification :**
```bash
pnpm run typecheck
pnpm run lint
```

---

### Lot 4 — Corrections actions et cache

**Objectif :** Uniformiser la stratégie d'invalidation de cache. Déplacer le hook d'actions archivées.

**Fichiers ciblés :**
- `editor/actions/delete-product.action.ts` : remplacer `revalidatePath()` par `refresh()`
- Vérifier et supprimer les `router.refresh()` redondants dans `product-pricing-tab.tsx`, `product-seo-tab.tsx`, `product-archived-actions.tsx`
- Déplacer `components/editor/hooks/use-archived-product-mutations.ts` → `editor/hooks/use-archived-product-mutations.ts`
- Mettre à jour l'import dans `components/editor/product-archived-actions.tsx`
- Résoudre l'ambiguïté `services/shared.ts` vs `services/shared/` : supprimer `services/shared.ts`, importer directement depuis `services/shared/`

**Risques :** Faibles sur le hook. Moyen sur les `router.refresh()` — vérifier manuellement que l'UI se recharge correctement après ces changements.

**Commandes de vérification :**
```bash
pnpm run typecheck
pnpm run lint
# Tester manuellement : archiver, restaurer, supprimer un produit depuis la liste ET depuis l'éditeur
```

---

### Lot 5 — Aplatir les mappers de list/

**Objectif :** Simplifier `list/mappers/` à 2 fichiers plats.

**Fichiers ciblés :**
- Fusionner `list/mappers/server/map-product-table-item.ts` dans `list/mappers/shared/map-admin-product-feed-item-to-table-item.ts` (ou vice-versa)
- Déplacer `list/mappers/server/map-admin-product-feed-item.ts` → `list/mappers/map-admin-product-feed-item.ts`
- Supprimer les dossiers `server/` et `shared/`
- Mettre à jour tous les imports

**Ce qui doit rester spécifique :** Le mapper `map-admin-product-feed-item.ts` est complexe (stock, prix, catégories) — le conserver intact, juste le déplacer.

**Risques :** Moyen — nombreux imports à mettre à jour. Faire avec une recherche exhaustive avant de modifier.

**Commandes de vérification :**
```bash
pnpm run typecheck
pnpm run lint
grep -rn "list/mappers" --include="*.ts" --include="*.tsx" features/
```

---

### Lot 6 — Déplacer les hooks de list vers list/hooks/

**Objectif :** Faire en sorte que tous les hooks de logique soient dans `list/hooks/` et non dans `components/list/hooks/`.

**Fichiers ciblés :**
- Déplacer `components/list/hooks/*.ts` → `list/hooks/*.ts`
- Mettre à jour les imports dans `components/list/product-table-context.tsx` et autres composants
- Supprimer `components/list/hooks/`

**Limites :** Ne pas modifier la logique des hooks, uniquement les déplacer.

**Risques :** Moyen — le context et plusieurs composants importent ces hooks. Faire en une seule PR.

**Commandes de vérification :**
```bash
pnpm run typecheck
pnpm run lint
# Tester manuellement : listing complet, sélection, bulk actions, mobile
```

---

## 8. Recommandations immédiates

Les 8 actions les plus rentables, classées par ratio valeur/risque.

| # | Action | Priorité | Fichiers | Effort | Risque |
|---|---|---|---|---|---|
| 1 | Supprimer `types/admin-product.types.ts` (vide) | P1 | 1 fichier | S | Nul |
| 2 | Supprimer le bloc commenté dans `product-list.config.ts` | P3 | 1 fichier | S | Nul |
| 3 | Corriger `product-sortable.columns.config.ts<ProductSortOption>` | P2 | 1 fichier | S | Nul |
| 4 | Remplacer `revalidatePath` par `refresh()` dans `delete-product.action.ts` | P1 | 1 fichier | S | Très faible |
| 5 | Supprimer `mapProductFilterCategoryOption` (passthrough) | P1 | 1 fichier + 2 barrels | S | Faible |
| 6 | Unifier `ProductStockState` (2 définitions → 1) | P0 | 4 fichiers | S | Moyen |
| 7 | Unifier `ProductSortOption` et `ProductListFilters` (dupliqués) | P0/P1 | 3-4 fichiers | S | Faible |
| 8 | Déplacer `use-archived-product-mutations.ts` vers `editor/hooks/` | P1 | 2 fichiers | S | Faible |

---

## 9. Vérifications à lancer

Après chaque lot :

```bash
# Typecheck principal
pnpm run typecheck

# Lint
pnpm run lint

# Tests unitaires
pnpm run test:unit

# Vérification manuelle minimale
# → Ouvrir /admin/products : liste s'affiche
# → Filtrer par statut
# → Sélectionner + bulk archive
# → Ouvrir un produit (éditeur)
# → Modifier un champ, enregistrer
# → Archiver depuis l'éditeur
# → Restaurer depuis la liste (vue corbeille)
```

Pour le lot 5 (mappers) et lot 6 (hooks), ajouter :
```bash
grep -rn "from.*list/mappers" features/admin/products --include="*.ts" --include="*.tsx"
grep -rn "from.*components/list/hooks" features/admin/products --include="*.ts" --include="*.tsx"
```

---

## 10. Prompt d'exécution — Lot 1

Prêt à coller dans Cowork / Codex.

---

**Contexte :**
Tu travailles sur Creatyss, un socle e-commerce Next.js App Router + TypeScript strict + Prisma + PostgreSQL.

**Périmètre strict — Lot 1 :**
Nettoyer les résidus et dead code dans `features/admin/products/*`.
Ne modifier **aucune logique métier**. Ne modifier **aucun composant UI**. Ne modifier **aucun service ni action**.

**Fichiers à modifier :**

1. **Supprimer** `features/admin/products/types/admin-product.types.ts` (fichier vide, 0 ligne).

2. **Dans** `features/admin/products/config/product-list.config.ts` :
   Supprimer le bloc commenté qui commence par `// export const PRODUCT_LIST_PAGE_COPY = {` (lignes ~72 à ~82). Ne rien ajouter.

3. **Supprimer** `features/admin/products/list/mappers/map-product-filter-category-option.ts` (mapper trivial qui retourne son entrée sans transformation).

4. **Dans** `features/admin/products/list/index.ts` :
   Retirer la ligne `export { mapProductFilterCategoryOption } from "./mappers/map-product-filter-category-option";`.

5. **Dans** `features/admin/products/index.ts` :
   Retirer la ligne `export { mapProductFilterCategoryOption } from "./list";`.

**Avant de modifier :**
Vérifier qu'aucun fichier extérieur à `features/admin/products/` n'importe `mapProductFilterCategoryOption` :
```bash
grep -rn "mapProductFilterCategoryOption" --include="*.ts" --include="*.tsx" .
```
Si des imports existent en dehors de `features/admin/products/`, **arrêter et signaler** avant de modifier quoi que ce soit.

**Interdictions strictes :**
- Ne pas modifier de service, action, query, composant ou schema.
- Ne pas ajouter de fonctionnalité.
- Ne pas renommer d'autres fichiers.
- Ne pas toucher à `features/admin/categories/`.

**Vérifications à lancer après :**
```bash
pnpm run typecheck
pnpm run lint
```

**Format du compte-rendu final :**
- Fichiers supprimés (liste exacte)
- Fichiers modifiés (liste exacte + nature de la modification)
- Résultat de `pnpm run typecheck` (OK / erreurs)
- Résultat de `pnpm run lint` (OK / erreurs)
- Ce qui N'a PAS été modifié
- Risques résiduels éventuels
