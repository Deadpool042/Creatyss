# Lot 4 — Dashboard cockpit macOS

## Statut

Livré — 2026-07-04. `typecheck`, `lint`, `git diff --check` passent. Vérifié navigateur desktop 1440 et mobile 390 : rendu lisible, aucun overflow horizontal.

## Objectif

Aplatir le dashboard admin (`/admin`) identifié par l'audit design comme surface "boîtes dans les boîtes" : conserver les mêmes données et les mêmes accès, mais réduire l'effet grille de cartes au profit d'un cockpit dense, lisible et aligné avec le langage macOS du chantier.

## Périmètre

- `components/admin/dashboard/admin-dashboard-sections.tsx` uniquement.
- Composition visuelle : hero non encarté, métriques en panneau partagé, priorités/readiness/vigilance en panneaux sobres, accès rapides en lignes denses.
- Aucun changement de query, modèle, navigation ou capability.

## Hors périmètre

- Refonte du design system ou des tokens.
- Modification de `getAdminDashboardStats`.
- Ajout d'indicateurs analytics réels.
- Changement de la navigation sidebar/bottom nav.

## Notes de livraison

- Les 4 métriques restent alimentées par les mêmes `AdminDashboardStats`.
- Les 6 accès rapides restent les mêmes URLs.
- Le nombre de conteneurs décoratifs est réduit : suppression des `Card` répétées pour les accès rapides, remplacement par des rangées cliquables.
- Les métriques passent en 2 colonnes sur desktop standard et 4 seulement en très grand écran pour éviter les libellés tassés.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `git diff --check`
- Playwright local :
  - `/admin` en 1440×900
  - `/admin` en 390×844
  - `documentElement.scrollWidth === clientWidth`
