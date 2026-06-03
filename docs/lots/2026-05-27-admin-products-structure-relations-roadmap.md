# Lot 5 — Admin products structure and relations

## Objectif

Finaliser la séparation structurelle de l'admin produits en traitant `variants`, `related` et `categories`, avec une frontière explicite entre structure produit, relations merchandising et rattachement taxonomique.

---

## Périmètre

Inclus dans ce lot :

- arbitrage final sur le statut route dédiée vs maintien transitoire de `variants`, `related`, `categories`
- création des routes dédiées retenues
- retrait de `/edit` des blocs qui ne doivent plus structurer la page coeur
- alignement de la navigation secondaire produit avec ces modules
- conservation du comportement métier existant des actions et formulaires

---

## Hors périmètre

Explicitement exclus :

- refonte profonde du modèle `ProductVariant`
- changement de sémantique des produits liés
- changement de sémantique du rattachement catégorie
- modification Prisma
- nouveau moteur de recommandation
- réarchitecture des domaines `categories` ou `catalog-modeling`

---

## Source de vérité

À lire avant exécution :

- `AGENTS.md`
- `docs/architecture/10-fondations/10-principes-d-architecture.md`
- `docs/architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `docs/domains/core/catalog/products.md`
- `docs/domains/satellites/categories.md`
- `docs/domains/optional/recommendations.md` si utile pour cadrer `related`
- `prisma/core/catalog/products.prisma`
- `prisma/core/catalog/categories.prisma`

Zone code principale :

- `app/admin/(protected)/catalog/products/[slug]/edit/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/layout.tsx`
- `features/admin/products/components/editor/product-variants-tab.tsx`
- `features/admin/products/components/editor/product-related-products-tab.tsx`
- `features/admin/products/components/editor/product-categories-tab.tsx`
- `features/admin/products/editor/actions/**`
- `features/admin/products/editor/services/**`
- `features/admin/products/editor/queries/**`

---

## Invariants

- `products` garde la responsabilité de la structure produit et du rattachement variante
- `categories` ne redevient pas un sous-domaine coeur produit
- `related` reste une relation merchandising bornée, pas un moteur de recommandation
- aucun changement Prisma
- aucun changement des invariants métier existants
- aucune nouvelle dépendance

---

## Fichiers concernés

### À modifier

- `app/admin/(protected)/catalog/products/[slug]/edit/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/layout.tsx`
- `features/admin/products/components/editor/product-editor-panel.tsx`
- navigation produit et liens internes si nécessaires

### À créer

Selon arbitrage du lot :

- `app/admin/(protected)/catalog/products/[slug]/variants/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/related/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/categories/page.tsx`

### À lire seulement

- `features/admin/products/components/editor/product-variants-tab.tsx`
- `features/admin/products/components/editor/product-related-products-tab.tsx`
- `features/admin/products/components/editor/product-categories-tab.tsx`
- `features/admin/products/editor/actions/product-variant-editor-actions.ts`
- `features/admin/products/editor/actions/product-update-editor-actions.ts`
- `features/admin/products/editor/services/product-variant-services.ts`
- queries/types associées à ces trois zones

### Explicitement intouchables

- `prisma/**`
- `entities/product/**`
- `entities/category/**`
- modules `pricing`, `availability`, `inventory`, `media`, `seo` déjà sortis dans les lots précédents

---

## Arbitrage cible

### `variants`

Cible recommandée :

- route dédiée

Raison :

- responsabilité structurelle forte
- surface UI autonome
- flux d'édition déjà dense
- bonne compatibilité avec activation conditionnelle selon `isStandalone`

### `related`

Cible recommandée :

- route dédiée si la surface reste significative
- sinon maintien transitoire sur `/edit` acceptable

Raison :

- module merchandising borné
- pas coeur produit
- peut rester secondaire selon charge UI réelle

### `categories`

Cible recommandée :

- route dédiée

Raison :

- `categories` est un satellite structurant, pas le coeur `products`
- rattachement taxonomique distinct de l'identité produit
- meilleure cohérence avec la doctrine et les futures capabilities

---

## Répartition cible

### `/edit`

Doit rester centré sur le coeur produit uniquement.

### `/variants`

Responsabilité :

- structure simple vs variantes
- création / édition / suppression variante
- default variant
- gestion des option values liées à la structure produit

### `/related`

Responsabilité :

- relations `related`, `cross-sell`, `up-sell`, `accessory`, `similar`
- ordre des relations

### `/categories`

Responsabilité :

- rattachements produit-catégorie
- catégorie principale
- ordre des liens taxonomiques

---

## Risques

### Risque 1 — Garder `categories` dans le coeur produit par habitude UI

Cause :
la proximité d'usage en édition produit.

Impact :
frontière doctrinale floue entre `products` et `categories`.

Mitigation :
assumer explicitement `categories` comme module dédié même si le flux utilisateur reste proche.

### Risque 2 — Laisser `variants` trop couplé à `/edit`

Cause :
`variants` est souvent perçu comme partie naturelle du produit.

Impact :
la page coeur redevient un cockpit complexe.

Mitigation :
sortir `variants` dès que le layout produit et la navigation route-based sont en place.

### Risque 3 — Sur-extraire `related`

Cause :
vouloir forcer la symétrie avec tous les autres modules.

Impact :
route dédiée à faible valeur si la surface réelle est trop faible.

Mitigation :
autoriser explicitement un maintien transitoire de `related` sur `/edit` si nécessaire, tout en le documentant.

---

## Plan d'exécution

1. auditer la densité réelle de `variants`, `related`, `categories`
2. trancher l'arbitrage route dédiée vs maintien transitoire
3. créer les routes retenues
4. brancher chaque route à ses données et formulaires existants
5. retirer ces blocs de la structure principale de `/edit` quand la route dédiée existe
6. aligner navigation secondaire et capabilities visibles
7. vérifier que `/edit` reste strictement coeur produit

---

## Vérifications

Vérifications attendues à la fin du lot :

- `pnpm run typecheck`
- `pnpm run lint`
- vérification manuelle de :
  - `/admin/catalog/products/[slug]/edit`
  - `/admin/catalog/products/[slug]/variants` si créée
  - `/admin/catalog/products/[slug]/related` si créée
  - `/admin/catalog/products/[slug]/categories` si créée
- vérification que `categories` n'est plus structurante dans `/edit` si la route dédiée est créée

Vérifications non attendues dans ce lot :

- nouvelle logique merchandising
- refonte domaine catégories

---

## Critères de fin

Le lot est terminé uniquement si :

- l'arbitrage `variants / related / categories` est explicitement tranché
- `/edit` reste strictement page coeur produit
- les modules extraits ont une responsabilité unique claire
- la navigation produit expose correctement ces modules
- aucun changement métier non demandé n'a été introduit

---

## Notes de livraison

- arbitrage retenu :
  - `variants` -> route dediee creee
  - `categories` -> route dediee creee
  - `related` -> route dediee creee
- routes ajoutees :
  - `/admin/catalog/products/[slug]/variants`
  - `/admin/catalog/products/[slug]/categories`
  - `/admin/catalog/products/[slug]/related`
- donnees chargees par `/variants` :
  - `readAdminProductEditorBySlug(slug)`
  - `readAdminProductVariants(productId)`
  - `readAdminProductImages(productId)`
  - `readAdminProductTypeWithOptions(productTypeId)` si type produit present
- donnees chargees par `/categories` :
  - `readAdminProductEditorBySlug(slug)`
  - `listAdminProductCategoryOptions()`
- donnees chargees par `/related` :
  - `readAdminProductEditorBySlug(slug)`
  - `listAdminRelatedProductOptions(storeId, excludeProductId)`
- blocs retires de `/edit` :
  - aucun wiring direct de `variants`
  - aucun wiring direct de `categories`
  - aucun wiring direct de `related`
- dettes et couplages residuels :
  - `/variants`, `/categories`, `/related` reutilisent encore `readAdminProductEditorBySlug`, donc chargement pas encore minimal
  - navigation produit est complete mais toujours pilotee par resolver permissif temporaire, pas encore par capabilities runtime fines
