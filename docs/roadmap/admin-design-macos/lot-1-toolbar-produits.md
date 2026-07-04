# Lot 1 — Toolbar unifiée + liste produits

## Statut

Livré — 2026-07-04. Toolbar unifiée sur `catalog/products` (bouton de création intégré à la bande recherche/filtres/tri/vue) + largeur de l'éditeur produit corrigée sur ses 10 onglets. `typecheck` et `lint` passent.

## Objectif

Composer une toolbar de page unifiée (style Finder/System Settings) au-dessus de l'existant `AdminPageShell`/`AdminPageContextBar`, l'appliquer sur `catalog/products` comme écran de référence, et brancher le tri de colonnes réel sur `ProductTable` — ce lot sert de pattern de référence pour les lots 2 et 3.

---

## Périmètre

- Composition de toolbar : fusionner contexte (retour/breadcrumb) + recherche/filtre + action principale en une seule bande dense, au-dessus de `AdminPageShell`.
- Application sur `app/admin/(protected)/catalog/products/**` (liste uniquement — pas `[slug]/*`).
- Tri de colonnes réel sur `ProductTable` (actuellement non branché malgré la présence du tri dans `DataTable` générique).
- Conservation stricte des bulk actions et de la vue mobile cards existantes.

---

## Hors périmètre

- Tout token (couleur, radius, shadow) — `app/styles/theme.css`, `themes/creatyss.*.css` intouchables.
- `catalog/products/[slug]/*` (déjà couvert par `ProductRouteNav`, non concerné).
- `OrdersPanelList` et `settings/*` (lots 2 et 3, dépendants de la validation de ce lot).
- Ajout d'un "quick edit" inline (gap identifié mais hors périmètre de ce lot, à cadrer séparément si retenu).

---

## Source de vérité

- `AGENTS.md`
- `docs/architecture/90-reference/design-system.md` (contrat de tokens — ne pas franchir)
- `docs/audit/2026-07-03-audit-design-admin.md`
- `docs/roadmap/admin-design-macos/README.md`
- `components/admin/layout/admin-page-shell.tsx`, `admin-page-header.tsx`
- `features/admin/products/components/list/**`

---

## Invariants

- Aucun changement de token CSS.
- Aucun changement de contrat de données produit (queries, actions serveur inchangées).
- Bulk actions et suppression définitive existantes doivent continuer à fonctionner à l'identique.
- Vue mobile (cards) non régressée.

---

## Fichiers concernés

### À modifier

- `components/admin/layout/admin-page-shell.tsx` (ou composant de composition dédié si la fusion toolbar dépasse la responsabilité actuelle de ce fichier — à trancher pendant l'exécution)
- `features/admin/products/components/list/toolbar/product-list-toolbar.tsx`
- `features/admin/products/components/list/table/product-table.tsx`
- `features/admin/products/components/list/table/desktop/product-table-desktop.config.tsx`

### À lire seulement

- `components/admin/layout/admin-page-header.tsx`
- `features/admin/products/components/list/toolbar/product-table-filter-controls.tsx`
- `features/admin/products/components/list/toolbar/product-table-toolbar-bulk-actions.tsx`
- `components/ui/data-table.tsx` (référence de tri tanstack, ne pas forcément réutiliser tel quel)

### Explicitement intouchables

- `app/styles/theme.css`, `app/styles/themes/creatyss.*.css`
- `features/admin/commerce/orders/components/orders-panel-list.tsx`
- `app/admin/(protected)/settings/**`

---

## Risques

- Fusionner la toolbar peut affecter d'autres écrans consommant `AdminPageShell`/`AdminPageContextBar` (composant partagé) — vérifier les sites d'appel avant modification, ne pas casser les écrans non concernés par ce lot.
- Le tri de colonnes doit rester cohérent avec la pagination et les filtres déjà en place côté query — vérifier qu'aucune régression de performance ou de résultat n'apparaît.

---

## Plan d'exécution

1. Lire en détail `admin-page-shell.tsx`, `admin-page-header.tsx` et les sites d'appel pour mesurer l'impact d'une fusion de toolbar.
2. Concevoir la composition de toolbar unifiée (recherche + filtre + action) pour `catalog/products`.
3. Brancher le tri réel sur `ProductTable`.
4. Vérifier visuellement desktop et mobile (dev server).
5. `pnpm run typecheck` et `pnpm run lint`.

---

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Vérification manuelle desktop + mobile sur `catalog/products` (recherche, filtre, tri, bulk actions, suppression)
- Tests Playwright ciblés si le tri introduit un comportement interactif non couvert

---

## Critères de fin

- Toolbar unifiée visible et fonctionnelle sur `catalog/products`.
- Tri de colonnes fonctionnel sur au moins une colonne pertinente (ex. nom, prix, stock).
- Bulk actions et suppression définitive non régressées.
- `typecheck`/`lint` passent.

---

## Notes de livraison

- Bug hors périmètre découvert et corrigé : `AdminPageShell` en mode `scrollBehavior="external"` ne bornait jamais la hauteur de son wrapper de contenu sur desktop (le parent applique `overflow-hidden` en `display:block`, pas `flex` — la classe `flex-1` du wrapper n'avait donc aucun effet). Conséquence réelle : sur `catalog/products` (154 résultats), impossible de scroller au-delà des ~13 premières lignes. Corrigé par `lg:h-full` sur ce wrapper (commit séparé). Vérifié sans régression sur les écrans split-view (`commerce/orders`), qui gèrent leur propre scroll indépendamment.
- Écart de périmètre assumé : la largeur des 10 onglets de l'éditeur produit (`max-w-6xl` recapé indépendamment du plafond `max-w-7xl` du shell) a été corrigée dans ce même lot suite à un retour direct du propriétaire produit pendant la revue visuelle — hors périmètre initial du fichier de lot, mais même famille d'écran et même session.
- Décision de composition (toolbar) tranchée par le propriétaire produit en langage naturel plutôt que par contribution de code directe (contexte : session en mode "Learning", TODO(human) posé puis résolu sur validation verbale explicite).
- Deuxième bug hors périmètre découvert lors de la revue visuelle (captures fournies par le propriétaire produit) : 8 des 10 onglets de l'éditeur produit (`seo`, `pricing`, `availability`, `inventory`, `categories`, `characteristics`, `related-products`, `images`) ainsi que le panneau de création (`product-create-panel.tsx`) reproduisaient le même piège que le bug du lot — un wrapper `overflow-hidden` + une div interne `overflow-y-auto` prétendant gérer un scroll propre, alors que ces pages tournent en `scrollBehavior="page"` (scroll de page naturel, aucun ancêtre borné en hauteur). Contenu au-delà de la première fenêtre visible silencieusement coupé. Corrigé en alignant ces 9 fichiers sur le pattern simple déjà utilisé par `product-general-tab.tsx` (pas de conteneur de scroll interne artificiel).
- `AdminFormFooter` (mode `overlay`) utilisait `position:absolute`, qui exige un ancêtre positionné et borné en hauteur pour flotter réellement — jamais le cas ici. Passé en `position:fixed` (pill flottante sur mobile, bande sticky classique sur desktop), répondant aussi à la demande explicite du propriétaire produit ("le CTA, peut-être le rendre flottant").
- `AdminPageContextBar` (bande retour + action, partagée par tout l'admin) forçait un empilement sur deux lignes en mobile même sans breadcrumb à afficher — bande à moitié vide constatée sur capture mobile. Corrigée pour rester sur une seule ligne quand aucun breadcrumb n'est présent.
- Vérification mobile réelle non faite dans cette session : l'outil de redimensionnement de fenêtre du navigateur automatisé ne fonctionne pas dans cet environnement (`resize_window` rapporte un succès mais `window.innerWidth` ne change pas). Diagnostic et correctifs mobile fondés sur lecture de code + les captures d'écran réelles fournies par l'utilisateur, pas sur une vérification interactive directe.

## Retouches post-livraison (2026-07-04, commit 0bfaf8a2)

Suite au retour visuel du propriétaire produit (captures desktop + émulation DevTools iPhone SE 375px) :

- **CTA "au milieu" sur desktop** : la bande d'actions (`AdminFormFooter`, mode overlay `lg:sticky lg:w-full`) vivait dans la colonne formulaire et s'arrêtait à sa largeur — pas macOS. Remplacée par une pill compacte `position:fixed` ancrée en bas à droite (`lg:right-6`), les actions d'un panneau macOS vivant en bas-droite.
- **CTA non flottant sur mobile (`/edit`)** : `product-general-tab` était le seul resté en mode non-overlay avec un `sticky` artisanal — avec un contenu court, la bande traînait en pleine page. Basculé en overlay comme les 8 autres onglets ; les overrides `bottom`/`lg:bottom-0` par onglet ont été supprimés (une seule autorité de positionnement : le composant).
- **Dégagement** : en mode overlay, `AdminFormFooter` rend désormais un spacer en flux (`h-16 lg:h-20`) pour que la fin du formulaire ne soit jamais recouverte par la pill, safe-area comprise.
- **Breadcrumbs `/preview` incohérents** : la page construisait son propre shell ("Retour à l'éditeur" + breadcrumb complet sur deux lignes) alors que les 9 autres onglets passent par `getProductModulePageShellProps` (bande compacte "< Produits", breadcrumbs masqués). Alignée sur le shell partagé.
- Vérifié à 375×667 réels (émulation DevTools active sur l'onglet) : pill flottante au-dessus de la bottom nav sur `/seo` et `/edit`, bande retour compacte sur `/preview`. Rendu desktop de la pill bas-droite déduit du code, à confirmer visuellement par le propriétaire produit.
- **Aside non sticky malgré `xl:sticky` déclaré** (commit c18d271d, demande UX du propriétaire produit) : les 10 asides des onglets produit portaient déjà `xl:sticky xl:top-6`, mais `ADMIN_CONTENT_BASE` (wrapper de contenu du shell, presets `detail`/`table`/`form`/`overview`/`dashboard`) appliquait `overflow-x-hidden` — ce qui fait de ce wrapper un scroll container, capturant le contexte de tout `position: sticky` descendant vers un élément qui ne scrolle jamais. Remplacé par `overflow-x-clip` : clipping horizontal identique, sans création de scroll container. Fix transversal au shell — tout sticky futur sous un contentPreset en bénéficie.
