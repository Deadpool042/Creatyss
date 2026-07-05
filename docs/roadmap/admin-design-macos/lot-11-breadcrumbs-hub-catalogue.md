# Lot 11 — Breadcrumbs généralisés, hub configuration catalogue, nav secondaire partagée

## Statut

Livré — 2026-07-05. Synthèse d'une vague de micro-lots mergés sur `main` le même jour (6 commits/merges), regroupés ici en un seul fichier pour éviter la dispersion documentaire.

## Objectif

Prolonger la signature de composition du chantier sur deux axes restés hétérogènes après les lots 1–10 :

- rendre le fil d'Ariane visible et cohérent sur tout l'admin (doctrine unique, au lieu d'un affichage au cas par cas) ;
- unifier la navigation secondaire des sections et transformer `/admin/catalog/settings` en hub unique de configuration du catalogue.

## Périmètre livré (par commit)

- `a8564564` (merge) — hub configuration catalogue : `/admin/catalog/settings` devient le hub unique via `CatalogSettingsHub` (`features/admin/settings/components/catalog-settings-hub.tsx`) : leviers métier et niveaux ouverts avec statuts « Actif », « Niveau requis », « Piloté par l'infra ». Nav secondaire normalisée via le composant partagé `components/admin/layout/admin-section-route-nav.tsx`, décliné en `CatalogRouteNav` (Pilotage | Tarification | Configuration) et repris par les route navs media, orders, payments, shipping et customers. Quick links de l'overview catalogue étendus (Tarification, Configuration) ; page pricing avec titre et breadcrumbs restaurés.
- `b1b60949` — build : `NODE_OPTIONS=--max-old-space-size=8192` sur `next build` (`package.json`), le build prod partait en OOM sinon.
- `22807c26` (merge) — breadcrumbs produits : helper `buildAdminProductBreadcrumbs` (`features/admin/products/navigation/`), fil « Admin > Catalogue > Produits > {nom} » sans segment module, rendu visible sur la liste et les 11 onglets produit.
- `a3c0f14e` (merge) — breadcrumbs commerce : customers, payments, shipping (listes, détails, settings).
- `7419104e` (merge) — breadcrumbs généralisés au reste de l'admin : `settings/*`, `content/*`, `marketing/*`, `maintenance/*`, `insights`, commerce overview et taxation.
- `c5b49c56` (merge) — nettoyage : suppression des paramètres morts `currentLabel`/`currentHref` du shell module produit (`features/admin/products/components/shared/product-module-page-shell.tsx`) ; ajout de `app/icon.svg` (monogramme C, `#2a2420`/`#efe4d6`) corrigeant le favicon 404.

## Exception doctrinale

La home admin (`app/admin/(protected)/page.tsx`) conserve son fil masqué : segment unique sans valeur de navigation. C'est le seul usage restant de `showBreadcrumbsInContent={false}` au niveau page — les shells split (`admin-split-page-shell.tsx`, `admin-split-pane-shell.tsx`) le désactivent en interne pour leurs panneaux, par construction.

## Diagnostic acté (sans code)

Hydration mismatch Radix `useId` : bug amont dev-only (radix-ui/primitives#3700, vercel/next.js#84029). Prod vérifiée saine — aucune action côté repo.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Recette navigateur (Playwright local) desktop et mobile
- Build prod (`pnpm run build`, avec le fix mémoire ci-dessus)
