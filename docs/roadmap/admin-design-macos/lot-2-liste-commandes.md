# Lot 2 — Liste commandes alignée sur le pattern toolbar

## Statut

Livré — 2026-07-04. Tri exposé (menu filtres desktop + sheet mobile), perte du paramètre `sort` corrigée sur filtre et recherche, `categories` non régressé. `typecheck` et `lint` passent.

## Notes de livraison

- Options de tri retenues (décision propriétaire produit, validée verbalement) : "Plus récentes d'abord" (défaut `created-desc`), "Plus anciennes d'abord", "Modifiées récemment" — `updated-asc` écarté faute de cas d'usage.
- Vérification navigateur réelle (session Chrome authentifiée) : tri desktop, préservation `sort` sur changement de statut (`?status=shipped&sort=created-asc`) et sur recherche GET (`?search=WOO&status=shipped&sort=created-asc`), sheet mobile avec section Tri synchronisée, menu `categories` sans section Tri.
- Limite de vérification breakpoints : le redimensionnement de fenêtre Chrome plafonne à ~581px (minimum OS) — la disposition mobile (`< md` 768px) a bien été exercée, mais pas le viewport 375px exact. Une vérification en émulation device (DevTools/Playwright) reste possible en complément.

## Objectif

Aligner la liste commandes (`commerce/orders`, split-view) sur le pattern de toolbar validé au lot 1 : exposer le tri (déjà supporté côté query mais absent de l'UI), corriger la perte de paramètres lors des changements de filtre, et densifier la bande recherche/filtre/tri dans l'esprit Finder/System Settings — sans convertir la liste en table.

---

## État observé (2026-07-04)

- `parseAdminOrderListSearchParams` accepte déjà `sort` (`created-desc|created-asc|updated-desc|updated-asc`, défaut `created-desc`) et `listAdminOrders` l'applique — mais aucune UI ne l'expose.
- `AdminPanelListControls` (partagé avec `categories`) ne gère que `search` + `status` : changer le statut ou soumettre la recherche **perd** `sort`/`perPage` (le formulaire GET n'a un hidden input que pour `status`, et `buildAdminFilterHref` ne connaît que `search`/`status`).
- `withAdminOrderListParams` préserve déjà correctement les 5 paramètres sur la navigation liste ↔ détail.
- Aucune action serveur bulk n'existe pour les commandes.

---

## Périmètre

- Extension **opt-in** de `AdminPanelListControls` : contrôle de tri (desktop + sheet mobile) et préservation de paramètres additionnels dans le formulaire de recherche et les changements de filtre.
- Extension de `buildAdminFilterHref` pour transporter le tri.
- Branchement du tri sur `OrdersPanelList` avec des options de tri définies en config (`order-list.config.ts`).
- Non-régression stricte de `categories-panel-list.tsx` (consommateur partagé, ne doit rien voir changer).

---

## Hors périmètre

- Conversion de la liste `<ul>/<li>` en table (risque mobile identifié dans le README du chantier — split-view conservé).
- Sélection multiple + bulk actions commandes : aucune action serveur bulk n'existe ; en créer relèverait d'un lot métier dédié, pas d'un lot de composition.
- Tout token CSS (`app/styles/theme.css`, `themes/creatyss.*.css`).
- Le détail commande (`orders/[id]`, onglets livrés dans un lot antérieur).

---

## Source de vérité

- `AGENTS.md`
- `docs/roadmap/admin-design-macos/README.md` + `lot-1-toolbar-produits.md` (pattern de référence)
- `components/admin/layout/admin-panel-list-controls.tsx`, `admin-build-filter-href.ts`
- `features/admin/commerce/orders/**` (config, schemas, components)

---

## Invariants

- Aucun changement de token CSS.
- Aucun changement du contrat de données commandes (query `listAdminOrders` inchangée).
- `categories-panel-list.tsx` non régressé (extension opt-in uniquement).
- Navigation liste ↔ détail conserve tous les paramètres (déjà le cas, à ne pas casser).

---

## Fichiers concernés

### À modifier

- `components/admin/layout/admin-panel-list-controls.tsx` (tri opt-in + préservation params)
- `components/admin/layout/admin-build-filter-href.ts` (transport du tri)
- `features/admin/commerce/orders/components/orders-panel-list.tsx` (branchement)
- `features/admin/commerce/orders/config/order-list.config.ts` (options de tri)

### À lire seulement

- `features/admin/categories/components/list/categories-panel-list.tsx` (non-régression)
- `features/admin/commerce/orders/shared/admin-orders-routes.ts`
- `features/admin/commerce/orders/list/schemas/parse-admin-order-list-search-params.ts`

---

## Vérifications

- `pnpm run typecheck`, `pnpm run lint`
- Vérification navigateur (Playwright, viewports réels via `browser_resize`) : 375, 768, 1024, 1440 — recherche, filtre statut, tri, préservation des paramètres, split-view.
- Vérification que `categories` est visuellement et fonctionnellement inchangé.

---

## Critères de fin

- Tri visible et fonctionnel sur la liste commandes (desktop + mobile).
- Changer statut ou recherche ne perd plus `sort`.
- `categories` inchangé.
- `typecheck`/`lint` passent.
