# Lot 2 — Admin products core edit

## Objectif

Réduire la page `/admin/catalog/products/[slug]/edit` au coeur métier `products`, sans tabs globales, en préparant l'extraction progressive des modules adjacents vers des sous-pages dédiées.

---

## Périmètre

Inclus dans ce lot :

- redéfinition explicite de `/edit` comme page coeur produit
- conservation sur `/edit` des champs et formulaires relevant strictement du domaine `products`
- retrait de la page `/edit` des modules qui relèvent clairement d'autres responsabilités ou futures capabilities
- préparation de points de sortie clairs pour les futures routes `media`, `seo`, `pricing`, `availability`, `inventory`
- alignement de la composition UI de `/edit` avec une structure verticale sobre, sans navigation par tabs

---

## Hors périmètre

Explicitement exclus :

- implémentation des nouvelles sous-pages
- refactor profond des services editor
- refonte des schémas Prisma
- modification des invariants métier produit
- ajout de nouvelles capabilities métier
- changement de comportement des actions serveur hors périmètre coeur

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
- `docs/domains/satellites/categories.md`
- `prisma/core/catalog/products.prisma`
- `prisma/core/catalog/availability.prisma`
- `prisma/optional/commerce/inventory/inventory.prisma`

Zone code principale :

- `app/admin/(protected)/catalog/products/[slug]/edit/page.tsx`
- `features/admin/products/components/editor/**`
- `features/admin/products/editor/**`
- `features/admin/products/config/product-editor.config.ts`

---

## Invariants

- `/edit` reste la page coeur produit
- aucun changement Prisma
- aucun changement des invariants domaine `products`
- `products` ne récupère pas des responsabilités de `pricing`, `availability`, `inventory`, `seo`, `categories`
- aucune tabs globale ne doit être réintroduite
- aucun changement de contrat public de service métier sans nécessité explicite

---

## Fichiers concernés

### À modifier

- `app/admin/(protected)/catalog/products/[slug]/edit/page.tsx`
- `features/admin/products/components/editor/product-editor-panel.tsx`
- `features/admin/products/config/product-editor.config.ts`
- composants editor strictement liés à l'assemblage de `/edit`

### À lire seulement

- `features/admin/products/components/editor/product-general-tab.tsx`
- `features/admin/products/components/editor/product-characteristics-tab.tsx`
- `features/admin/products/components/editor/product-images-tab.tsx`
- `features/admin/products/components/editor/product-seo-tab.tsx`
- `features/admin/products/components/editor/product-pricing-tab.tsx`
- `features/admin/products/components/editor/product-availability-tab.tsx`
- `features/admin/products/components/editor/product-inventory-tab.tsx`
- `features/admin/products/components/editor/product-categories-tab.tsx`
- `features/admin/products/components/editor/product-related-products-tab.tsx`
- `features/admin/products/components/editor/product-variants-tab.tsx`

### Explicitement intouchables

- `prisma/**`
- `entities/product/**`
- implémentation concrète des futures routes hors `/edit`

---

## Répartition cible de `/edit`

### Doit rester sur `/edit`

- identité produit
- slug
- type produit
- statut lifecycle
- mise en avant
- contenu éditorial coeur
- `careInstructions`
- caractéristiques produit si conservées comme partie de la fiche coeur

### Doit sortir de `/edit`

- médias
- SEO
- pricing
- availability
- inventory

### À arbitrer plus tard

- variants
- related products
- categories

Par défaut pour ce lot :

- `categories` peut encore rester visible si le coût de séparation immédiate est trop élevé, mais elle doit être marquée comme future sortie de `/edit`
- `variants` et `related` ne sont pas forcément extraits dans ce lot

---

## Risques

### Risque 1 — Retirer trop de choses de `/edit` trop tôt

Cause :
vouloir atteindre la cible finale en un seul lot.

Impact :
page coeur incomplète, navigation cassée, besoin de créer des sous-pages dans le même lot.

Mitigation :
ce lot redéfinit `/edit` et allège l'assemblage, mais n'impose pas l'implémentation immédiate de toutes les pages extraites.

### Risque 2 — Frontières doctrinales mal respectées

Cause :
laisser `pricing`, `availability` ou `inventory` dans le coeur par commodité.

Impact :
la future architecture par capabilities reste floue et fragile.

Mitigation :
traiter explicitement ces blocs comme modules externes au coeur produit, même si leur extraction complète vient dans les lots suivants.

### Risque 3 — Remplacer les tabs par une page illisible

Cause :
supprimer les tabs sans reconstruire une hiérarchie claire.

Impact :
surface trop longue, difficile à parcourir, toujours couplée.

Mitigation :
utiliser des sections verticales sobres et limitées aux champs coeur, sans transformer `/edit` en écran fourre-tout.

---

## Plan d'exécution

1. cartographier les blocs réellement coeur vs adjacents dans l'éditeur actuel
2. définir la composition cible de `/edit`
3. simplifier l'assemblage de `ProductEditorPanel`
4. retirer la dépendance à une navigation par tabs globale
5. conserver uniquement les sections coeur sur `/edit`
6. préparer les points de sortie vers les futures routes modules
7. vérifier que la page reste cohérente sans introduire de nouvelles routes dans ce lot

---

## Vérifications

Vérifications attendues à la fin du lot :

- `pnpm run typecheck`
- `pnpm run lint`
- vérification manuelle de `/admin/catalog/products/[slug]/edit`
- vérification que la page ne dépend plus d'une navigation tabs globale
- vérification que les blocs `pricing`, `availability`, `inventory`, `seo`, `media` ne structurent plus `/edit`

Vérifications non attendues dans ce lot :

- validation fonctionnelle des futures pages modules
- E2E complets produits

---

## Critères de fin

Le lot est terminé uniquement si :

- `/edit` est clairement identifiable comme page coeur produit
- la navigation tabs globale n'est plus l'axe structurant de la page
- les modules non coeur ne structurent plus la page principale
- la composition UI de `/edit` est lisible, verticale et bornée
- aucun changement métier non demandé n'a été introduit

---

## Notes de livraison

- blocs gardés sur `/edit` : identité, slug, type produit, structure, publication, mise en avant, contenus éditoriaux coeur, `careInstructions`
- blocs sortis conceptuellement de `/edit` : medias, SEO, pricing, availability, inventory
- arbitrage temporaire retenu : `categories`, `variants`, `related` ne sont pas encore sortis vers des routes dédiées, mais ils ne structurent plus `/edit` dans ce lot
- tabs globales supprimées du `ProductEditorPanel`
- `edit/page.tsx` n'assemble plus les queries/actions des modules sortis ; il ne charge plus que le produit editeur et les types produit
- aucun service metier ni schema Prisma modifie
- aucun module-route implemente dans ce lot
- ecart local assume : `characteristics` sort aussi de la page coeur immediate pour garder un lot strict et une surface bornee ; sa requalification pourra etre tranchee dans lot structurel suivant
- fichiers principaux touches dans le lot :
  - `app/admin/(protected)/catalog/products/[slug]/edit/page.tsx`
  - `app/admin/(protected)/catalog/products/[slug]/layout.tsx`
  - `app/admin/(protected)/catalog/products/[slug]/pricing/page.tsx`
  - `app/admin/(protected)/catalog/products/[slug]/availability/page.tsx`
  - `app/admin/(protected)/catalog/products/[slug]/inventory/page.tsx`
  - `app/admin/(protected)/catalog/products/[slug]/media/page.tsx`
  - `app/admin/(protected)/catalog/products/[slug]/seo/page.tsx`
  - `features/admin/products/components/shared/product-module-page-shell.tsx`
  - `features/admin/products/components/shared/product-route-nav.tsx`
  - `components/admin/layout/admin-page-shell.tsx`
  - `components/admin/layout/admin-page-header.tsx`
- vérification manuelle de `/admin/catalog/products/[slug]/edit` non répétée ici après la refonte finale du shell, car l’accès HTTP local n’a pas été stable au moment de la clôture
