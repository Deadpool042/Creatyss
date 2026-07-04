# Lot 5 — Tri des catégories dans la split-list

## Statut

Livré — 2026-07-04. `typecheck`, `lint`, `git diff --check` passent. Vérifié navigateur desktop 1440 et mobile 390 sur la split-list catégories avec `sort=name-desc`.

## Objectif

Aligner la split-list catégories sur le pattern de toolbar des lots pilotes : exposer le tri déjà supporté côté URL, parser et query, sans convertir la liste en table et sans modifier le modèle de données.

## Périmètre

- `features/admin/categories/config/category-list.config.ts` : options de tri visibles et libellés de contrôle.
- `features/admin/categories/components/list/categories-panel-list.tsx` : branchement opt-in du tri dans `AdminPanelListControls`.
- `features/admin/categories/list/schemas/parse-admin-category-list-search-params.ts` : partage de la constante de tri par défaut avec la config d'affichage.

## Hors périmètre

- Conversion de la liste catégories en table.
- Actions groupées ou quick edit.
- Modification de `listAdminCategories`.
- Refonte du détail ou de l'éditeur catégorie.
- Changement de tokens CSS.

## Notes de livraison

- Options exposées : `name-asc`, `name-desc`, `updated-desc`.
- `updated-asc` reste accepté par le parser pour compatibilité URL, mais n'est pas présenté dans l'UI faute de cas d'usage courant.
- Le contrôle reste opt-in via `AdminPanelListControls` : aucun autre consommateur n'est modifié.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `git diff --check`
- Playwright local :
  - `/admin/catalog/categories/overview?sort=name-desc` en 1440x900
  - `/admin/catalog/categories?sort=name-desc` en 390x844
  - ouverture du filtre desktop et mobile, présence des options `Nom Z à A` et `Modifiées récemment`
  - `documentElement.scrollWidth === clientWidth`
