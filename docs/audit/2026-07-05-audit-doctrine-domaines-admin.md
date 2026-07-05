# Audit — Extension de la doctrine UI/UX catalog aux autres domaines admin

> Date : 2026-07-05 · Audit statique en lecture seule (agent `architect-review`)
> Référence doctrinale : chantier admin-design-macos, lot 11
> ([lot-11-breadcrumbs-hub-catalogue.md](../roadmap/admin-design-macos/lot-11-breadcrumbs-hub-catalogue.md))
> Roadmap issue de cet audit : [doctrine-domaines-admin](../roadmap/doctrine-domaines-admin/README.md)

Tout ce qui suit est **Observé** sauf mention contraire (Documenté / Déduit / Inconnu).

## Grille doctrinale (référence = catalog)

1. **Shell** : `AdminPageShell` avec `title` + `breadcrumbs` visibles, grammaire `Admin > Domaine > Section [> Détail]`.
2. **Nav secondaire** : `AdminSectionRouteNav` décliné par domaine.
3. **Overview = map du domaine** : quick links vers toutes les surfaces majeures, configuration incluse.
4. **Hub configuration par domaine** : point d'entrée unique et riche (modèle `catalog-settings-hub`).
5. **Leviers par niveau visibles** : statuts explicites (Actif / Niveau requis / Piloté par l'infra), jamais un bouton simplement absent.
6. **Mobile-first** : variante mobile fonctionnelle de la nav secondaire.

## Faits transverses (Observé, grep quantifié)

- `AdminSectionRouteNav` : 6 déclinaisons exactement (catalog, media, orders, payments, shipping, customers). Aucun route nav dans content, marketing, insights, maintenance, settings, taxation.
- Un seul hub de configuration existe : `features/admin/settings/components/catalog-settings-hub.tsx` (seul fichier avec les statuts « Niveau requis » / « Piloté par l'infra » hors bandeau discounts).
- Breadcrumbs présents sur quasi toutes les pages (via `AdminPageShell` ou layouts split). Exception documentée : home admin.
- `settings/{catalog,media,orders,customers,payments,shipping}/page.tsx` sont des redirects vers les settings de domaine → frontière hub global / hubs de domaine déjà tranchée côté routes.
- `mobileVariant="settings-shortcut"` : utilisé uniquement par `media-route-nav.tsx`.

## Commerce

| Critère                | Verdict                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. Shell + breadcrumbs | Conforme partout, mais **grammaire incohérente** : orders/customers passent par « Commerce » (`customers-list-page.tsx:106-110`, `orders/layout.tsx:17-21`) alors que `payments/settings` (« Admin > Paiements > Configuration »), `shipping/settings` (« Admin > Livraisons > Configuration ») et `customers/settings` (« Admin > Clients > Configuration ») omettent le segment Commerce. Taxation dit « Admin > Commerce > TVA ». |
| 2. Nav secondaire      | Conforme pour orders/payments/shipping/customers. **Écart : taxation sans route nav.**                                                                                                                                                                                                                                                                                                                                               |
| 3. Overview map        | **Écart** : `commerce-overview-sections.tsx` (QUICK_LINKS l.40-65) = 4 liens (Commandes, Clients, Paiements, Livraisons). Manquent TVA et les configurations.                                                                                                                                                                                                                                                                        |
| 4. Hub configuration   | **Écart structurel** : pas de hub commerce. Config éclatée en 4 pages ; `customers/settings` = `AdminComingSoon` (page vide) ; taxation hors de tout parcours configuration.                                                                                                                                                                                                                                                         |
| 5. Statuts par niveau  | Partiel : `CardPaymentStatusNotice` (payments/settings) conforme. **Écart : taxation fait `notFound()` si flag inactif** (`taxation/page.tsx` l.33-34).                                                                                                                                                                                                                                                                              |
| 6. Mobile              | Conforme là où `AdminSectionRouteNav` est utilisé.                                                                                                                                                                                                                                                                                                                                                                                   |

## Content

| Critère | Verdict                                                                                                                                                                                                                                                            |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1       | Conforme pour overview, blog, homepage, seo. **Écart majeur : content/pages** utilise un shell custom `PagesPageShell` (`features/admin/pages/components/pages-page-shell.tsx`, simple `div`) — ni `AdminPageShell`, ni title, ni breadcrumbs (idem `pages/[id]`). |
| 2       | **Écart : aucun route nav** dans tout content (blog, homepage, pages, seo en silos).                                                                                                                                                                               |
| 3       | Conforme (4 quick links) mais aucun lien configuration.                                                                                                                                                                                                            |
| 4       | **Écart : aucun hub configuration content** ; le niveau blog (draft/publish) n'est visible nulle part en configuration.                                                                                                                                            |
| 5       | Partiel : `blog/page.tsx` affiche `publish_level_insufficient` — statut réactif, pas proactif.                                                                                                                                                                     |
| 6       | N/A (pas de nav secondaire).                                                                                                                                                                                                                                       |

Écart structurel signalé (hors grille) : **statistique mockée en dur** dans `content/seo/page.tsx` (~l.30) : `totalSeoMissing: Math.round(productResult.total * 0.6)` — l'UI affiche une donnée fausse.

## Marketing

| Critère | Verdict                                                                                                                                                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1       | Conforme.                                                                                                                                                                                                                                        |
| 2       | **Écart : aucun route nav** (Newsletter ↔ Campagnes naviguent ad hoc).                                                                                                                                                                           |
| 3       | Conforme dans l'esprit ; pas de lien configuration.                                                                                                                                                                                              |
| 4       | **Écart : aucun hub configuration marketing** (niveaux discounts et newsletter invisibles hors des pages).                                                                                                                                       |
| 5       | Mitigé : `discounts/page.tsx` est le meilleur élève hors catalog (3 niveaux interrogés, « Niveau requis : simple » affiché) ; mais discounts, newsletter et automations font tous **`notFound()` si flag racine inactif** (l.43 / l.106 / l.61). |
| 6       | N/A.                                                                                                                                                                                                                                             |

## Insights

- Shell conforme. Domaine mono-page sans overview ni settings — acceptable en l'état (Déduit).
- **Écart** : `notFound()` si flag inactif (`analytics/page.tsx` l.14), alors que 3 niveaux sont interrogés ensuite (l.25-27).

## Maintenance

- Shell conforme (logs, monitoring, observability).
- **Écart** : 3 pages sœurs sans route nav commun — cas d'école pour un `MaintenanceRouteNav`.
- Pas d'overview ni settings maintenance — écart léger.

## Settings (hub global)

- Shell conforme sur toutes les pages feuilles ; split advanced porte ses breadcrumbs via layout.
- **Écart de cohérence interne** : aucune nav secondaire ; circulation uniquement via le hub racine (`buildAdminSettingsHubItems`). Déduit : peut-être voulu (hub = sidebar de facto) — à trancher avant tout lot.
- Frontière hubs de domaine : conforme et propre (redirects).
- **Écart** : `settings/{ai,integrations,search,channels,webhooks}` font `notFound()` si flag inactif — le hub masque des capacités au lieu d'afficher un statut. Note (Documenté) : ces features sont volontairement atomiques ; l'écart porte sur la visibilité UI, pas la gradation Prisma.
- Pilotage : vit sous `settings/advanced` (feature flags) — conforme, déjà la surface de gouvernance.

## Écarts structurels hors grille (signalés, non audités à fond)

- Mock statistique en dur dans `content/seo/page.tsx`.
- Mapping d'erreurs métier dupliqué dans les pages (`getTaxErrorMessage`, `getShippingZoneErrorMessage`) — candidat extraction features.

## Inconnu

- Rendu mobile réel (audit statique, pas de recette navigateur).
