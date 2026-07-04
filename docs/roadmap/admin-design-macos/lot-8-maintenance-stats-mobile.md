# Lot 8 — Stats maintenance responsives

## Statut

Livré — 2026-07-04. `typecheck`, `lint`, `git diff --check` passent. Vérifié navigateur desktop 1440 et mobile 390 sur les pages maintenance.

## Objectif

Corriger les grilles de stats des écrans maintenance qui forçaient deux colonnes dès le mobile, avec des libellés courts mais des cartes étroites dans un contexte déjà dense.

## Périmètre

- `app/admin/(protected)/maintenance/logs/page.tsx`
- `app/admin/(protected)/maintenance/observability/page.tsx`
- Reflow responsive des stats uniquement.

## Hors périmètre

- Refonte des listes de jobs ou d'audit.
- Modification des queries maintenance.
- Refonte de `monitoring`.
- Changement de tokens CSS.

## Notes de livraison

- Mobile : 1 colonne pour laisser respirer les métriques.
- Tablette : 2 colonnes.
- Desktop large : 4 colonnes, densité conservée.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `git diff --check`
- Playwright local :
  - `/admin/maintenance/logs` en 1440x900 et 390x844
  - `/admin/maintenance/observability` en 1440x900 et 390x844
  - présence des stats principales
  - `documentElement.scrollWidth === clientWidth`
