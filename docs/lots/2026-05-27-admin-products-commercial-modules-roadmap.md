# Lot 4 — Admin products commercial modules

## Objectif

Extraire `pricing`, `availability` et `inventory` hors de la page coeur `/admin/catalog/products/[slug]/edit` vers des sous-pages dédiées, afin d'aligner l'admin produit avec les frontières réelles des domaines coeur et optionnels.

---

## Périmètre

Inclus dans ce lot :

- création des routes dédiées `pricing`, `availability` et `inventory`
- branchement de ces routes sous le layout produit commun
- retrait de `/edit` des blocs qui relèvent de `pricing`, `availability` et `inventory`
- conservation du comportement existant des actions et formulaires de ces modules
- alignement de la navigation secondaire produit avec les nouvelles routes

---

## Hors périmètre

Explicitement exclus :

- extraction de `variants`
- extraction de `related`
- extraction de `categories`
- refonte profonde des services editor
- modification des invariants Prisma
- changement de sémantique métier entre `availability` et `inventory`
- ajout de nouvelles règles de pricing

---

## Source de vérité

À lire avant exécution :

- `AGENTS.md`
- `docs/architecture/10-fondations/10-principes-d-architecture.md`
- `docs/architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `docs/architecture/20-structure/22-capacites-optionnelles.md`
- `docs/domains/core/catalog/products.md`
- `docs/domains/core/catalog/availability.md`
- `docs/domains/core/commerce/pricing.md`
- `docs/domains/optional/commerce/inventory.md`
- `prisma/core/catalog/products.prisma`
- `prisma/core/catalog/availability.prisma`
- `prisma/core/catalog/pricing.prisma`
- `prisma/optional/commerce/inventory/inventory.prisma`

Zone code principale :

- `app/admin/(protected)/catalog/products/[slug]/edit/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/layout.tsx`
- `features/admin/products/components/editor/product-pricing-tab.tsx`
- `features/admin/products/components/editor/product-availability-tab.tsx`
- `features/admin/products/components/editor/product-inventory-tab.tsx`
- `features/admin/products/editor/actions/**`
- `features/admin/products/editor/services/**`
- `features/admin/products/editor/queries/**`

---

## Invariants

- `products` reste le coeur éditorial et identitaire du produit
- `pricing` reste séparé de `products`
- `availability` reste séparé de `inventory`
- `inventory` reste optionnel et activable explicitement
- aucun changement Prisma
- aucun changement de sémantique métier
- les actions existantes conservent leur comportement

---

## Fichiers concernés

### À modifier

- `app/admin/(protected)/catalog/products/[slug]/edit/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/layout.tsx`
- `features/admin/products/components/editor/product-editor-panel.tsx`
- navigation produit et liens internes si nécessaires

### À créer

- `app/admin/(protected)/catalog/products/[slug]/pricing/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/availability/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/inventory/page.tsx`

### À lire seulement

- `features/admin/products/components/editor/product-pricing-tab.tsx`
- `features/admin/products/components/editor/product-availability-tab.tsx`
- `features/admin/products/components/editor/product-inventory-tab.tsx`
- `features/admin/products/editor/actions/product-update-editor-actions.ts`
- `features/admin/products/editor/services/product-update-services.ts`
- `features/admin/products/editor/queries/**`

### Explicitement intouchables

- `prisma/**`
- `entities/product/**`
- `entities/category/**`
- `entities/seo/**`

---

## Répartition cible

### `/edit`

Ne doit plus structurer l'écran autour de `pricing`, `availability` ou `inventory`.

### `/pricing`

Responsabilité :

- prix produit
- listes de prix
- compare-at price
- fenêtres tarifaires si déjà supportées

### `/availability`

Responsabilité :

- disponibilité vendable
- sellable state
- preorder / backorder
- statut de disponibilité par variante

### `/inventory`

Responsabilité :

- quantités `onHand` / `reserved`
- état inventory item
- gestion stock optionnelle liée au produit

---

## Risques

### Risque 1 — Mélanger `availability` et `inventory`

Cause :
les deux blocs sont souvent édités côte à côte dans l'UI actuelle.

Impact :
la séparation route-based deviendrait purement cosmétique et contredirait la doctrine.

Mitigation :
garder deux routes et deux contrats distincts, même si leur ergonomie reste proche.

### Risque 2 — Laisser `/edit` piloter encore les modules commerciaux

Cause :
conserver trop de dépendances d'assemblage dans la page coeur.

Impact :
le coeur produit reste contaminé par des domaines adjacents.

Mitigation :
retirer la structuration principale de `/edit` autour de ces modules dans ce même lot.

### Risque 3 — Guard capability mal placé pour `inventory`

Cause :
`inventory` est optionnel alors que `pricing` et `availability` sont structurellement plus centraux.

Impact :
route visible alors qu'inactive, ou route bloquée alors qu'attendue.

Mitigation :
faire porter la décision par le resolver de capabilities produit au niveau layout/navigation.

---

## Plan d'exécution

1. confirmer la frontière doctrinale entre `pricing`, `availability`, `inventory`
2. créer les routes `pricing`, `availability`, `inventory`
3. brancher chaque route à ses queries et formulaires existants
4. retirer ces blocs de la structure principale de `/edit`
5. aligner navigation secondaire et capacités visibles
6. vérifier que chaque module reste borné à sa responsabilité

---

## Vérifications

Vérifications attendues à la fin du lot :

- `pnpm run typecheck`
- `pnpm run lint`
- vérification manuelle de :
  - `/admin/catalog/products/[slug]/pricing`
  - `/admin/catalog/products/[slug]/availability`
  - `/admin/catalog/products/[slug]/inventory`
  - `/admin/catalog/products/[slug]/edit`
- vérification que `inventory` peut rester masqué ou absent si capability inactive

Vérifications non attendues dans ce lot :

- extraction de `variants`
- extraction de `related`
- extraction de `categories`

---

## Critères de fin

Le lot est terminé uniquement si :

- `/pricing`, `/availability` et `/inventory` existent comme routes dédiées
- `/edit` n'est plus structurée autour de ces modules
- les frontières métier entre `pricing`, `availability` et `inventory` restent explicites
- la navigation produit expose correctement ces modules selon capabilities
- aucun changement métier non demandé n'a été introduit

---

## Notes de livraison

- routes ajoutees :
  - `/admin/catalog/products/[slug]/pricing`
  - `/admin/catalog/products/[slug]/availability`
  - `/admin/catalog/products/[slug]/inventory`
- donnees chargees par `/pricing` :
  - `readAdminProductEditorBySlug(slug)` pour resume produit + structure
  - `readAdminProductPrices(productId)` pour les prix
  - `readAdminPriceLists()` pour les listes de prix
- donnees chargees par `/availability` :
  - `readAdminProductEditorBySlug(slug)` puis reutilisation de `editor.variants`
- donnees chargees par `/inventory` :
  - `readAdminProductEditorBySlug(slug)` puis reutilisation de `editor.variants`
- elements retires de `/edit` :
  - aucun wiring direct de `pricing`
  - aucun wiring direct de `availability`
  - aucun wiring direct de `inventory`
- arbitrage capability actuel sur `inventory` :
  - route et entree de navigation actives via resolver permissif temporaire
  - pas encore pilotees par un vrai feature flag ou contexte store
- couplages residuels :
  - `/availability` et `/inventory` reutilisent encore `readAdminProductEditorBySlug`, donc le chargement n'est pas encore minimal
  - `inventory` n'est pas encore masque par capability runtime fine
- fichiers principaux touches dans le lot :
  - `app/admin/(protected)/catalog/products/[slug]/pricing/page.tsx`
  - `app/admin/(protected)/catalog/products/[slug]/availability/page.tsx`
  - `app/admin/(protected)/catalog/products/[slug]/inventory/page.tsx`
  - `app/admin/(protected)/catalog/products/[slug]/edit/page.tsx`
  - `app/admin/(protected)/catalog/products/[slug]/layout.tsx`
  - `features/admin/products/components/shared/product-module-page-shell.tsx`
  - `features/admin/products/components/shared/product-route-nav.tsx`
  - `components/admin/layout/admin-page-shell.tsx`
  - `components/admin/layout/admin-page-header.tsx`
- vérification manuelle des routes et de `/edit` non répétée ici après la refonte finale du shell, car l’accès HTTP local n’a pas été stable au moment de la clôture
