# Lot 6 — Overview réglages avancés responsive

## Statut

Livré — 2026-07-04. `typecheck`, `lint`, `git diff --check` passent. Vérifié navigateur desktop 1440 sur `/admin/settings/advanced` et mobile 390 sur `/admin/settings/advanced/overview`.

## Objectif

Corriger le dernier point mobile local repéré dans l'overview `settings/advanced` : les cartes de stats de gouvernance des feature flags restaient en colonnes fixes dans le panneau détail.

## Périmètre

- `features/admin/pilotage/components/settings-advanced/feature-flags-overview.tsx` uniquement.
- Passage des grilles de stats de `grid-cols-2` / `grid-cols-3` fixes à un reflow mobile `grid-cols-1` puis `sm:grid-cols-*`.

## Hors périmètre

- Refonte de `StatsCard`.
- Refonte du split-view `settings/advanced`.
- Modification des view-models, queries ou routes.
- Changement de tokens CSS.

## Notes de livraison

- Les 7 indicateurs existants restent présents et dans le même ordre.
- Desktop conserve la densité attendue : 2 colonnes pour la première ligne, 3 colonnes pour les états.
- Mobile évite les cartes étroites et les libellés tassés.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `git diff --check`
- Playwright local :
  - `/admin/settings/advanced` en 1440x900
  - `/admin/settings/advanced/overview` en 390x844
  - présence des indicateurs `Entrées`, `Créées en DB`, `Actifs`
  - `documentElement.scrollWidth === clientWidth`
