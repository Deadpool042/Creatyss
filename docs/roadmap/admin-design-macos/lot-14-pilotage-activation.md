# Lot 14 — Pilotage : activation analytics + fusion overview/analytics

## Statut

Livré — 2026-07-06. `typecheck`, `lint` et vérification navigateur (Playwright) passent.

## Contexte

Audit (`architect-review`, 2026-07-06) demandé par le propriétaire produit sur les sections "Pilotage" et "Maintenance", jugées trop pauvres. Diagnostic pour Pilotage : le hub `/admin/insights/overview` n'affichait qu'une seule carte vers `/admin/insights/analytics`, et cette dernière était gouvernée par le flag `engagement.analytics` en statut `DRAFT` (désactivé par défaut) depuis le cadrage du 2026-06-15 — la seule fonctionnalité vivante de la section était donc masquée par défaut.

## Périmètre

- `prisma/seed/analytics-feature-flag.seed.ts` : `status` `DRAFT` → `ACTIVE`, `isEnabledByDefault` `false` → `true` (niveau `read` par défaut déjà correct). Overrides par store restent prioritaires dans `getFeatureLevelState`, donc rejouable sans risque en production.
- Fusion de `/admin/insights/overview` et `/admin/insights/analytics` en une seule page (la seconde route) : titre "Pilotage", breadcrumb 2 niveaux, suppression du hub, de `InsightsRouteNav` et `InsightsOverviewSections`.
- Nav sidebar (`admin-navigation.data.ts`) : groupe `insights` réduit à une seule entrée (`analytics`, label "Pilotage").

## Hors périmètre

- Maintenance (traité au lot 15).
- Fusion avec le dashboard racine `/admin`.
- Renommage du libellé "Pilotage" pour lever la collision avec `features/admin/pilotage/**` (gouvernance des feature flags) — non demandé.

## Vérifications

- `pnpm run typecheck`, `pnpm run lint`.
- `pnpm db:seed:flags` (dev) puis navigateur (Playwright) : `/admin/insights/analytics` affiche les données réelles (plus d'état désactivé), `/admin/insights/overview` renvoie un "introuvable" propre, lien sidebar "Pilotage" pointe directement sur la page fusionnée.
