# Lot 1 — Admin products routing shell

## Objectif

Stabiliser le squelette de navigation de l'admin produits autour d'une URL canonique, d'un layout commun par produit et d'un point d'entrée explicite pour les futures capabilities, sans modifier encore le métier ni déplacer les modules d'édition.

---

## Périmètre

Inclus dans ce lot :

- canonisation des URLs admin produits vers `/admin/catalog/products/**`
- ajout de `app/admin/(protected)/catalog/products/[slug]/layout.tsx`
- branchement d'un layout léger partagé par `edit` et `preview`
- mise en place d'une navigation secondaire route-based au niveau produit
- introduction d'un resolver minimal de capabilities produit
- alignement des breadcrumbs, hrefs et redirects produits sur la route canonique

---

## Hors périmètre

Explicitement exclus :

- extraction des sous-pages `media`, `seo`, `pricing`, `availability`, `inventory`, `variants`, `related`
- réduction fonctionnelle de `/edit`
- déplacement des formulaires ou actions serveur existantes
- refactor des services `features/admin/products/editor/services/**`
- refactor Prisma, Zod métier ou validation domaine
- mutualisation large des primitives shared admin hors squelette de navigation

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
- `prisma/cross-cutting/feature-flags.prisma`

Zone code principale :

- `app/admin/(protected)/catalog/products/**`
- `features/admin/products/**`
- `features/admin/navigation/**`

---

## Invariants

- aucun changement métier
- aucun changement Prisma
- aucun changement de contrat public de service métier
- aucune nouvelle dépendance
- `edit` doit rester fonctionnellement identique
- `preview` doit rester fonctionnellement identique
- la redirection `[slug] -> edit` doit rester stable
- le lot ne doit pas charger de données lourdes dans le futur layout produit

---

## Fichiers concernés

### À modifier

- `app/admin/(protected)/catalog/products/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/edit/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/preview/page.tsx`
- `features/admin/navigation/utils/admin-navigation.data.ts`
- `features/admin/products/navigation/**` si nécessaire pour aligner les hrefs
- `features/admin/products/components/list/**` si nécessaire pour corriger les liens produits
- `features/admin/products/components/editor/**` si nécessaire pour corriger les liens produits
- `features/admin/products/config/**` si nécessaire pour corriger les hrefs et copy de navigation

### À créer

- `app/admin/(protected)/catalog/products/[slug]/layout.tsx`
- zone de capabilities produit si nécessaire pour ce lot, idéalement sous `features/admin/products/`

### À lire seulement

- `features/admin/navigation/helpers/get-admin-navigation-context.helper.ts`
- `features/admin/navigation/helpers/build-admin-navigation.helper.ts`
- `components/admin/layout/admin-page-shell.tsx`
- `components/admin/tables/layout/admin-data-table-page-shell.tsx`

### Explicitement intouchables

- `features/admin/products/editor/services/**`
- `features/admin/products/editor/actions/**` hors correction de href si strictement nécessaire
- `prisma/**`
- `entities/product/**`

---

## Risques

### Risque 1 — URLs divergentes

Cause :
le repo mélange aujourd'hui `/admin/catalog/products/**` et `/admin/products/**`.

Impact :
404, breadcrumbs incohérents, retour liste cassé, preview et éditor incohérents.

Mitigation :
définir une route canonique unique puis corriger exhaustivement tous les hrefs internes du périmètre produit.

### Risque 2 — Layout produit trop lourd

Cause :
charger les mêmes données que la page `edit` dans `[slug]/layout.tsx`.

Impact :
god-layout, coût serveur inutile, couplage fort avant même l'extraction des modules.

Mitigation :
le layout ne lit qu'un résumé léger produit et les données strictement nécessaires à la navigation.

### Risque 3 — Resolver de capabilities prématurément bloquant

Cause :
brancher des guards trop stricts dès le premier lot.

Impact :
pages existantes inaccessibles sans bénéfice immédiat.

Mitigation :
resolver minimal, permissif, utilisé d'abord pour la navigation et la préparation des modules futurs.

---

## Plan d'exécution

1. identifier et lister toutes les URLs produits encore non canoniques
2. définir la route canonique unique pour les produits admin
3. corriger `features/admin/navigation` et les hrefs produits visibles
4. créer `[slug]/layout.tsx` avec résumé produit léger
5. introduire une navigation secondaire route-based au niveau produit
6. introduire un resolver minimal de capabilities produit
7. rebrancher `edit` et `preview` sous ce layout sans changer leur métier
8. vérifier les redirects, breadcrumbs et liens retour

---

## Vérifications

Vérifications attendues à la fin du lot :

- `pnpm run typecheck`
- `pnpm run lint`
- vérification ciblée des imports et hrefs produits
- vérification manuelle des routes :
  - `/admin/catalog/products`
  - `/admin/catalog/products/[slug]/edit`
  - `/admin/catalog/products/[slug]/preview`

Vérifications non attendues dans ce lot :

- E2E complets produits
- validation des futurs modules `media`, `seo`, `pricing`, `availability`, `inventory`

---

## Critères de fin

Le lot est terminé uniquement si :

- tous les liens produits admin du périmètre pointent vers `/admin/catalog/products/**`
- `app/admin/(protected)/catalog/products/[slug]/layout.tsx` existe
- `edit` et `preview` consomment ce layout commun
- la navigation secondaire produit est route-based et non tab-based
- un resolver minimal de capabilities produit existe et est appelé depuis le layout ou la couche de navigation produit
- aucun changement métier n'a été introduit

---

## Notes de livraison

- route canonique centralisée dans `features/admin/products/navigation/product-routes.ts`
- layout léger ajouté dans `app/admin/(protected)/catalog/products/[slug]/layout.tsx`
- navigation secondaire route-based branchée via `ProductRouteNav` avec entrées `edit` et `preview`
- resolver minimal ajouté sous `features/admin/products/capabilities/product-module-capabilities.ts`
- `edit`, `preview`, `new`, liste produits, redirects create/detail et actions de navigation visibles réalignés sur `/admin/catalog/products/**`
- accès visibles hors feature produits réalignés aussi dans dashboard admin, overview catalogue et page SEO contenu
- écart local assumé : le layout produit reste volontairement léger et n'applique pas encore un shell produit complet partagé ; il fournit d'abord le point d'ancrage de navigation et capabilities sans rebrancher le métier des pages
- blocages éventuels : vérifications `typecheck` et `lint` à exécuter après stabilisation du worktree courant
