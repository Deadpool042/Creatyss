# Lot 15 — Maintenance : fusion overview/monitoring/observability

## Statut

Livré — 2026-07-06. `typecheck`, `lint` et vérification navigateur (Playwright) passent.

## Contexte

Suite de l'audit `architect-review` du 2026-07-06 (cf. lot 14 pour Pilotage). Diagnostic pour Maintenance : contrairement à Pilotage, les 4 pages avaient un contenu réel, mais `overview`, `monitoring` et `observability` affichaient toutes des variantes du même payload `getAdminSystemHealth()` (compteurs jobs/events/audit), sans apport distinct entre elles. Seule `logs` (file de jobs, `listAdminJobs`) avait un contenu réellement séparé. Décision produit : fusionner les 3 pages redondantes en une seule "Vue d'ensemble", garder `logs` à part.

## Périmètre

- `features/admin/maintenance/components/maintenance-overview-sections.tsx` : fusionne les stat tiles existantes, le statut des services (porté depuis `monitoring/page.tsx` — `ServiceRow`, bannière d'état global) et le journal d'audit complet (porté depuis `observability/page.tsx` — 50 dernières entrées). Le hub de cartes (`AdminNavigationItem[]`) est retiré : avec un seul onglet restant (Jobs), il aurait reproduit le même problème que le hub Pilotage du lot 14.
- `app/admin/(protected)/maintenance/overview/page.tsx` : simplifié (plus de `getAdminNavigationContext`/`cards`), ajoute `dbOk` (santé DB) en plus de `health`.
- Suppression : `app/admin/(protected)/maintenance/monitoring/`, `.../observability/`.
- `features/admin/maintenance/components/maintenance-route-nav.tsx` : 2 onglets au lieu de 4 (Vue d'ensemble, Jobs).
- `admin-navigation.data.ts` : retrait des items `maintenance-monitoring` et `maintenance-observability`.
- Liens de gouvernance des feature flags (`features/admin/pilotage/components/settings-advanced/feature-flag-detail.tsx` et `governance-panels/maintenance-governance-panels.tsx`) qui pointaient vers `/admin/maintenance/observability` (flag `maintenance.observability`, distinct de la page) : redirigés vers `/admin/maintenance/overview`.

## Hors périmètre

- `logs` (jobs) : inchangée.
- Renommage du libellé "Maintenance" pour lever la collision avec `features/admin/pilotage/**` — non demandé.
- Le flag `maintenance.observability` lui-même (gouvernance des signaux d'observabilité) : uniquement son lien admin a été mis à jour, sa logique de collecte est hors périmètre.

## Vérifications

- `pnpm run typecheck`, `pnpm run lint`.
- Navigateur (Playwright) : `/admin/maintenance/overview` affiche stats + bannière de statut + services + journal d'audit ; `/admin/maintenance/monitoring` et `/admin/maintenance/observability` renvoient un "introuvable" propre ; `/admin/maintenance/logs` inchangée, sans erreur console.
