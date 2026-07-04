# Lot 7 — Grilles de gouvernance avancée responsives

## Statut

Livré — 2026-07-04. `typecheck`, `lint`, `git diff --check` passent. Vérifié navigateur desktop 1440 et mobile 390 sur un panneau de gouvernance `settings/advanced`.

## Objectif

Corriger la primitive partagée des panneaux de gouvernance avancée : `GovernanceStatGrid` appliquait directement `grid-cols-2`, `grid-cols-3` ou `grid-cols-4`, ce qui forçait des cartes de statistiques trop étroites sur mobile.

## Périmètre

- `features/admin/pilotage/components/settings-advanced/governance-panel-primitives.tsx` uniquement.
- Reflow responsive de `GovernanceStatGrid`, sans modifier les cartes, les données ou les panneaux appelants.

## Hors périmètre

- Refonte de `GovernanceStatCard`.
- Refonte des panneaux métier `governance-panels/*`.
- Modification des flags, view-models, queries ou routes.
- Changement de tokens CSS.

## Notes de livraison

- `columns={2}` devient `grid-cols-1 sm:grid-cols-2`.
- `columns={3}` devient `grid-cols-1 sm:grid-cols-3`.
- `columns={4}` devient `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`, pour éviter quatre cartes compressées trop tôt.
- Les appelants gardent leur API existante.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `git diff --check`
- Playwright local :
  - `/admin/settings/advanced/core/pricing` en 1440x900
  - `/admin/settings/advanced/core/pricing` en 390x844
  - présence de stats de gouvernance
  - `documentElement.scrollWidth === clientWidth`
