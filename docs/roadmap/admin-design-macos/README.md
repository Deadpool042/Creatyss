# Refonte composition admin — style macOS, parité WooCommerce

Chantier cross-cutting, hors séquence H1-H4 de valeur métier. Déclenché par une demande du propriétaire produit (2026-07-04) : rendre l'admin cohérent visuellement sur un langage de composition inspiré de macOS (toolbar dense, navigation groupée type System Settings), au moins aussi intuitif que l'admin WooCommerce/WordPress (recherche, tri, actions groupées, navigation par catégories).

## Ce que ce chantier touche — et ce qu'il ne touche pas

- **Touche** : composition, disposition, patterns d'interaction (toolbar de page, archétypes de liste, navigation de réglages).
- **Ne touche pas** : le système de tokens (couleurs, radius, shadows — `app/styles/theme.css`, `themes/creatyss.*.css`). `docs/architecture/90-reference/design-system.md` documente une clôture "V2" qui porte sur la cascade CSS/contrat de tokens ; ce chantier reste dans son périmètre en ne touchant qu'à la composition.

## État observé (2026-07-04)

Constats tirés de `docs/audit/2026-07-03-audit-design-admin.md` et d'un inventaire ciblé des composants admin :

- La sidebar (`components/admin/navigation/sidebar/admin-sidebar.styles.ts`) est déjà explicitement documentée "standard Apple sidebar item" — base macOS déjà posée côté navigation globale.
- Le design system fournit déjà les briques nécessaires : `Tabs` variante `"line"` (`components/ui/tabs.tsx`, soulignement animé façon segmented control), tokens `control-surface`/`shadow-control`, hiérarchie de surfaces `shell-surface → surface-panel → surface-subtle`.
- Deux archétypes de liste incohérents coexistent : `ProductTable` (vraie table, tri non branché, sélection multiple + bulk actions + suppression) vs `OrdersPanelList` (liste `<ul>/<li>` non tabulaire, sans tri ni sélection ni bulk actions). Un `DataTable` générique (`components/ui/data-table.tsx`, tanstack table, tri fonctionnel) existe mais n'est utilisé par aucun des deux.
- Aucun "quick edit" inline nulle part — écart réel vs WooCommerce.
- `AdminPageContextBar` (interne à `components/admin/layout/admin-page-shell.tsx`) et `AdminPageHeader` existent déjà comme briques de "toolbar" de page, mais utilisées de façon hétérogène (actions de header masquées sous `lg`, recherche/filtre non unifiée avec l'action principale).
- `settings/*` : une trentaine d'écrans de formulaires plats indépendants, sans navigation groupée transversale (à la différence de `settings/advanced/*`, déjà en split-view).

## Signature de composition

Un seul élément porte la personnalité macOS, décliné partout : une **toolbar unifiée de page** (retour/breadcrumb + titre court + recherche/filtre + action principale, dense, jamais séparée de son contenu par une carte — esprit Finder/System Settings), déclinée en deux variantes :

- écrans liste : toolbar + liste unifiée (tri + sélection + bulk actions cohérents) ;
- écrans réglages : navigation groupée (icône + libellé + description courte) façon System Settings, réutilisant `AdminSplitView` existant.

## Dépendances

Les lots pilotes 2 et 3 dépendent de la validation visuelle du lot pilote 1 (référence du nouveau pattern). Pas d'ordre imposé au-delà.

## Lots

| Fichier                                                                                      | Description                                                                                           | Statut             |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------ |
| [lot-1-toolbar-produits.md](./lot-1-toolbar-produits.md)                                     | Toolbar unifiée + liste produits (référence du nouveau pattern de liste)                              | Livré — 2026-07-04 |
| [lot-2-liste-commandes.md](./lot-2-liste-commandes.md)                                       | Aligner `OrdersPanelList` sur le pattern validé au lot 1                                              | Livré — 2026-07-04 |
| [lot-3-navigation-settings.md](./lot-3-navigation-settings.md)                               | Navigation groupée style System Settings pour `settings/*`                                            | Livré — 2026-07-04 |
| [lot-4-dashboard.md](./lot-4-dashboard.md)                                                   | Aplatir le dashboard en cockpit macOS plus dense                                                      | Livré — 2026-07-04 |
| [lot-5-categories-list-sort.md](./lot-5-categories-list-sort.md)                             | Exposer le tri existant dans la split-list catégories                                                 | Livré — 2026-07-04 |
| [lot-6-settings-advanced-overview.md](./lot-6-settings-advanced-overview.md)                 | Reflow mobile des stats `settings/advanced`                                                           | Livré — 2026-07-04 |
| [lot-7-settings-advanced-governance-grids.md](./lot-7-settings-advanced-governance-grids.md) | Rendre responsives les grilles de gouvernance avancée                                                 | Livré — 2026-07-04 |
| [lot-8-maintenance-stats-mobile.md](./lot-8-maintenance-stats-mobile.md)                     | Reflow mobile des stats maintenance                                                                   | Livré — 2026-07-04 |
| [lot-9-discounts-toolbar-sheet.md](./lot-9-discounts-toolbar-sheet.md)                       | Codes promo : toolbar unifiée + création en Sheet                                                     | Livré — 2026-07-05 |
| [lot-10-blog-list-toolbar.md](./lot-10-blog-list-toolbar.md)                                 | Blog : recherche et filtre statut sur la liste d'articles                                             | Livré — 2026-07-05 |
| [lot-11-breadcrumbs-hub-catalogue.md](./lot-11-breadcrumbs-hub-catalogue.md)                 | Breadcrumbs généralisés, hub configuration catalogue, nav secondaire partagée (synthèse de 6 commits) | Livré — 2026-07-05 |

Prolongement (lot 11) : après la clôture des 10 lots initiaux, une vague de micro-lots du 2026-07-05 a généralisé les breadcrumbs à tout l'admin, unifié la navigation secondaire des sections (`components/admin/layout/admin-section-route-nav.tsx`) et fait de `/admin/catalog/settings` le hub unique de configuration du catalogue.

Généralisation : au 2026-07-05, les candidats identifiés sont traités ou écartés — `commerce/customers`, `catalog/pricing`, `settings/team`, `settings/api-clients` déjà alignés (toolbar ou Dialog/Drawer en topbar) ; `marketing/discounts` (lot 9) et `content/blog` (lot 10) livrés. Les domaines restants (`commerce/{documents,payments,shipping,taxation}`, `insights/*`) sont des overviews/écrans de réglages déjà responsives, sans liste dense à outiller — à réévaluer si un besoin apparaît.

## Risques

- Deux archétypes de liste à réconcilier (lot 2) : le risque mobile qui a fait écarter la conversion `<table>` pour `team`/`api-clients`/`blog` (cf. audit design, lot 5) peut s'appliquer aussi à `orders` — à vérifier avant de trancher, pas une conversion par défaut.
- Chantier volontairement limité à des écrans pilotes avant généralisation, pour éviter une réécriture massive contraire à la doctrine micro-lots.
