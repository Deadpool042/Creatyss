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

| Fichier                                                  | Description                                                              | Statut      |
| -------------------------------------------------------- | ------------------------------------------------------------------------ | ----------- |
| [lot-1-toolbar-produits.md](./lot-1-toolbar-produits.md) | Toolbar unifiée + liste produits (référence du nouveau pattern de liste) | En cours    |
| lot-2-liste-commandes.md (à créer)                       | Aligner `OrdersPanelList` sur le pattern validé au lot 1                 | Non démarré |
| lot-3-navigation-settings.md (à créer)                   | Navigation groupée style System Settings pour `settings/*`               | Non démarré |

Généralisation aux autres domaines (`content/*`, `commerce/{customers,documents,payments,shipping,taxation}`, `insights/*`, `maintenance/*`, `marketing/*`) : non planifiée en détail, dépend du retour visuel sur les 3 lots pilotes.

## Risques

- Deux archétypes de liste à réconcilier (lot 2) : le risque mobile qui a fait écarter la conversion `<table>` pour `team`/`api-clients`/`blog` (cf. audit design, lot 5) peut s'appliquer aussi à `orders` — à vérifier avant de trancher, pas une conversion par défaut.
- Chantier volontairement limité à des écrans pilotes avant généralisation, pour éviter une réécriture massive contraire à la doctrine micro-lots.
