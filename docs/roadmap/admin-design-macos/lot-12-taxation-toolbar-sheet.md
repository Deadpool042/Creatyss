# Lot 12 — TVA : toolbar unifiée + création/import en Sheet

## Statut

Livré — 2026-07-06. `typecheck`, `lint` passent. Vérifié navigateur (1512×793) : recherche (code/nom), création via Sheet (succès + doublon `duplicate_code`), import CSV via sa propre Sheet, aucune carte permanente résiduelle.

## Objectif

Réévaluer les domaines laissés de côté par la généralisation du 2026-07-05 (`commerce/{payments,shipping,taxation}`, `insights/*`). Vérification faite écran par écran :

- `insights/overview` et `insights/analytics` : déjà alignés (navigation groupée, largeur `max-w-7xl`, pas d'action de création à outiller) — rien à faire.
- `commerce/payments` et `commerce/shipping` : header harmonisé, largeur déjà pleine (`contentPreset="table"`). Recherche manquante sur les deux listes — écart réel mais mineur, laissé pour un lot de suivi séparé.
- `commerce/taxation` : écart net — la page affichait en permanence 3 cartes empilées (formulaire de création, import CSV, liste), exactement l'anti-pattern déjà corrigé au lot 9 (`marketing/discounts`). Ce lot applique le même traitement.

## Périmètre

- `app/admin/(protected)/commerce/taxation/page.tsx` — retrait des 3 `<section>` empilées, rendu du panel avec toolbar.
- Nouveaux composants (calqués sur `admin-discounts-panel.tsx`/`admin-discount-create-sheet.tsx`) :
  - `features/admin/commerce/taxation/components/admin-tax-rules-panel.tsx` — toolbar (`AdminConfigDataTableToolbar` : recherche sur code/nom) + deux triggers ("Nouvelle règle", "Importer CSV") + liste filtrée.
  - `admin-tax-rule-create-sheet.tsx` — Sheet enveloppant `AdminTaxRuleCreateForm` (inchangé).
  - `admin-tax-rules-import-sheet.tsx` — Sheet enveloppant `AdminTaxRulesImport` (inchangé).
- `admin-tax-rules-list.tsx` — ajout d'un `emptyMessage` optionnel (même besoin que lot 9).

## Hors périmètre

- `createTaxRuleAction`, `importTaxRulesAction`, queries, Prisma : inchangés.
- `commerce/payments` / `commerce/shipping` (recherche manquante) — lot de suivi séparé si validé.
- Tokens CSS, `settings/*`, `insights/*`.

## Invariants

- Création de règle fonctionnelle à l'identique (mêmes redirections `tax_created`/`tax_error`).
- Import CSV fonctionnel à l'identique (`useActionState`, pas de signal URL).

## Bug transversal découvert et corrigé

`AdminConfigDataTableToolbar` (`components/admin/tables/admin-config-data-table-toolbar.tsx`) masquait tout le bloc `desktopTrailing` quand `desktopFilters` était absent (`hasDesktopControls = Boolean(desktopFilters)`). Le lot 9 (discounts) avait toujours un filtre statut, donc le cas n'avait jamais été exercé. Taxation n'a pas de filtre — seulement des actions (CTA création + import) — ce qui masquait les deux boutons en desktop. Corrigé : `hasDesktopControls = Boolean(desktopFilters) || Boolean(desktopTrailing)`. Fix transversal au composant partagé, bénéficie à tout futur consommateur sans filtre.

## Notes de livraison

- Donnée de test `LOT12-TEST` créée pendant la vérification navigateur, **non supprimée** : pas d'action de suppression de règle de TVA dans cette feature, et pas d'accès aux identifiants `.env.local` pour une suppression directe en base depuis cette session. À supprimer manuellement (Prisma Studio ou script) si besoin.
- Vérification mobile non faite dans cette session : le redimensionnement de fenêtre du navigateur automatisé ne fonctionne pas dans cet environnement (limitation déjà documentée au lot 1). Le rendu mobile réutilise le même `mobileTrailing` déjà validé en production au lot 9.

## Vérifications

- `pnpm run typecheck`, `pnpm run lint`.
- Navigateur : `/admin/commerce/taxation` — recherche, création (succès + erreur doublon), import CSV.
