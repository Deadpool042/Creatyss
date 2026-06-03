# Lot 3 — Admin products media and seo extraction

## Objectif

Extraire les responsabilités `media` et `seo` hors de la page coeur `/admin/catalog/products/[slug]/edit` vers des sous-pages dédiées, tout en gardant des frontières nettes avec le coeur `products` et sans introduire de changement métier.

---

## Périmètre

Inclus dans ce lot :

- création des routes dédiées `media` et `seo`
- branchement de ces routes sous le layout produit commun
- retrait de `/edit` des blocs qui relèvent de `media` et `seo`
- conservation du comportement existant des actions et formulaires `media` et `seo`
- alignement de la navigation secondaire produit avec les nouvelles routes

---

## Hors périmètre

Explicitement exclus :

- extraction de `pricing`
- extraction de `availability`
- extraction de `inventory`
- extraction de `variants`
- refonte des services editor
- réécriture des actions `media` ou `seo`
- changement du modèle Prisma ou des invariants domaine

---

## Source de vérité

À lire avant exécution :

- `AGENTS.md`
- `docs/architecture/10-fondations/10-principes-d-architecture.md`
- `docs/architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `docs/domains/core/catalog/products.md`
- `docs/domains/satellites/media.md`
- `docs/domains/cross-cutting/seo.md`
- `prisma/core/catalog/products.prisma`
- `prisma/satellites/media.prisma`
- `prisma/cross-cutting/seo.prisma`

Zone code principale :

- `app/admin/(protected)/catalog/products/[slug]/edit/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/layout.tsx`
- `features/admin/products/components/editor/product-images-tab.tsx`
- `features/admin/products/components/editor/product-seo-tab.tsx`
- `features/admin/products/editor/actions/**`
- `features/admin/products/editor/queries/**`
- `features/admin/products/preview/**` si navigation ou liens impactés

---

## Invariants

- aucun changement métier
- aucune modification Prisma
- `/edit` reste page coeur produit
- `media` reste un module dédié, pas réabsorbé dans le coeur produit
- `seo` reste une préoccupation transverse explicitement isolée
- les actions `upload`, `attach`, `reorder`, `set primary`, `alt text`, `update seo` conservent leur comportement

---

## Fichiers concernés

### À modifier

- `app/admin/(protected)/catalog/products/[slug]/edit/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/layout.tsx`
- `features/admin/products/components/editor/product-editor-panel.tsx`
- navigation produit et liens internes si nécessaires

### À créer

- `app/admin/(protected)/catalog/products/[slug]/media/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/seo/page.tsx`

### À lire seulement

- `features/admin/products/components/editor/product-images-tab.tsx`
- `features/admin/products/components/editor/product-seo-tab.tsx`
- `features/admin/products/editor/actions/product-image-editor-actions.ts`
- `features/admin/products/editor/actions/product-update-editor-actions.ts`
- `features/admin/products/editor/queries/get-admin-product-editor-data.query.ts`
- requêtes et types liés à `images` et `seo`

### Explicitement intouchables

- `prisma/**`
- `entities/product/**`
- `features/admin/products/editor/services/**` hors adaptation minimale de wiring si strictement nécessaire

---

## Répartition cible

### `/edit`

Doit conserver uniquement le coeur produit et ne plus structurer l'écran autour de `media` ou `seo`.

### `/media`

Responsabilité :

- gestion des images du produit
- image principale
- ordre
- alt text
- association bibliothèque
- upload

### `/seo`

Responsabilité :

- metadata SEO produit
- canonical path
- indexing mode
- OG / Twitter
- image SEO si gérée via ce module

---

## Risques

### Risque 1 — Couplage résiduel dans `/edit`

Cause :
laisser des dépendances fortes `media` ou `seo` dans la page coeur.

Impact :
la séparation route-based reste cosmétique.

Mitigation :
faire en sorte que `/edit` ne compose plus directement ces blocs comme sections principales.

### Risque 2 — Duplication de chargement

Cause :
chaque nouvelle route recharge trop de données communes.

Impact :
coût serveur inutile et architecture confuse.

Mitigation :
le layout produit porte uniquement le résumé léger, chaque page module ne charge que ses données propres.

### Risque 3 — Navigation incohérente

Cause :
liens et breadcrumbs non alignés avec les nouvelles routes.

Impact :
retours cassés, UX confuse.

Mitigation :
aligner navigation secondaire, breadcrumbs et actions topbar dans le même lot.

---

## Plan d'exécution

1. confirmer le contrat coeur de `/edit` après lot 2
2. créer les routes `media` et `seo`
3. y brancher les données et formulaires existants sans changer leur métier
4. retirer `media` et `seo` de l'assemblage principal de `/edit`
5. aligner navigation secondaire, breadcrumbs et liens internes
6. vérifier la continuité fonctionnelle des flux `media` et `seo`

---

## Vérifications

Vérifications attendues à la fin du lot :

- `pnpm run typecheck`
- `pnpm run lint`
- vérification manuelle de :
  - `/admin/catalog/products/[slug]/edit`
  - `/admin/catalog/products/[slug]/media`
  - `/admin/catalog/products/[slug]/seo`
- vérification des actions `media`
- vérification de la sauvegarde `seo`

Vérifications non attendues dans ce lot :

- extraction `pricing`, `availability`, `inventory`
- refonte globale de l'éditeur

---

## Critères de fin

Le lot est terminé uniquement si :

- `/media` et `/seo` existent comme routes dédiées
- `/edit` n'est plus structurée autour de `media` ni `seo`
- les flux `media` et `seo` restent fonctionnellement identiques
- la navigation produit expose correctement ces modules
- aucun changement métier non demandé n'a été introduit

---

## Notes de livraison

- `/media` charge actuellement `readAdminProductEditorBySlug(slug)` pour le resume produit + galerie existante, puis `listAttachableMediaAssets(productId)` pour la bibliotheque attachable
- `/seo` charge actuellement `readAdminProductEditorBySlug(slug)` car `ProductSeoTab` consomme `product + seo + images`
- elements retires de `/edit` : plus aucun chargement ni wiring direct de `images`, `attachable media`, `seo action`, `seo form`
- nouvelles routes ajoutees :
  - `/admin/catalog/products/[slug]/media`
  - `/admin/catalog/products/[slug]/seo`
- navigation secondaire produit alignee avec `edit`, `preview`, `media`, `seo`
- couplages residuels :
  - `/media` et `/seo` reutilisent encore `readAdminProductEditorBySlug`, donc le chargement n'est pas encore minimal pour chaque module
  - topbar `media` et `seo` reutilise encore `ProductEditorTopbarMenu`, pas un menu module-specifique pilote par etat local
