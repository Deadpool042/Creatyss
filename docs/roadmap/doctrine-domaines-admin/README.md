# Doctrine domaines admin — extension de la doctrine UI/UX catalog

> Chantier transverse · Ouvert le 2026-07-05 · Statut : cadré, aucun lot démarré
> Audit source : [2026-07-05-audit-doctrine-domaines-admin.md](../../audit/2026-07-05-audit-doctrine-domaines-admin.md)
> Référence doctrinale : [admin-design-macos / lot 11](../admin-design-macos/lot-11-breadcrumbs-hub-catalogue.md)

## Objectif

Étendre aux domaines commerce, content, marketing, insights, maintenance et settings la doctrine UI/UX éprouvée sur catalog :

1. shell `AdminPageShell` + breadcrumbs visibles (`Admin > Domaine > Section [> Détail]`) ;
2. nav secondaire `AdminSectionRouteNav` par domaine ;
3. overview = map du domaine (quick links exhaustifs, configuration incluse) ;
4. hub configuration par domaine (modèle `catalog-settings-hub`) ;
5. capacités par niveau visibles (Actif / Niveau requis / Piloté par l'infra) ;
6. mobile-first.

## Hors périmètre

- Refonte visuelle des contenus de pages (formulaires, tableaux) — seul le cadre (shell, nav, hubs, statuts) est concerné.
- Gradation Prisma des feature flags (doctrine flags atomiques inchangée) : seule la **visibilité UI** des capacités est en jeu.
- Storefront.

## Lots

| Lot | Titre                                                                                                                                                                  | Effort | Dépendances | Statut  |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------- | ------- |
| A   | Grammaire breadcrumbs commerce (réinsérer le segment « Commerce » dans payments/shipping/customers settings)                                                           | S      | —           | À faire |
| B   | content/pages sur `AdminPageShell` (supprimer `PagesPageShell` custom, liste + détail)                                                                                 | S      | —           | À faire |
| C   | Taxation dans le parcours commerce (route nav + quick links TVA/configurations dans l'overview)                                                                        | S      | Décision D1 | À faire |
| D   | `MaintenanceRouteNav` (logs, monitoring, observability)                                                                                                                | S      | —           | À faire |
| E   | Hub configuration commerce (modèle catalog : paiements, livraison, TVA, clients, statuts par niveau ; remplace l'`AdminComingSoon` customers)                          | M      | Décision D1 | À faire |
| F   | Hub configuration marketing (niveaux discounts simple/rules/automation et newsletter basic/segmentation ; factoriser la logique de statut de discounts/page.tsx)       | M      | Décision D3 | À faire |
| G   | Hub configuration content + route nav (Blog, Pages, Accueil, SEO ; niveau blog visible)                                                                                | M      | Décision D2 | À faire |
| H   | Doctrine « flag inactif ≠ notFound » (settings/{ai,integrations,search,channels,webhooks}, insights, marketing/\*, taxation → écran de statut « Capacité désactivée ») | S/M    | Décision D3 | À faire |

Ordre recommandé : A → B → D (indépendants, risque nul) puis D1 → C + E, D3 → H + F, D2 → G.

## Décisions à trancher avant les lots dépendants

- **D1 — Route du hub commerce** : créer `/admin/commerce/settings` (symétrie avec `/admin/catalog/settings`) ou promouvoir une page existante ? Impacte C et E.
- **D2 — Content mérite-t-il un settings dédié** (`/admin/content/settings`) ou le niveau blog s'expose-t-il ailleurs ? Impacte G.
- **D3 — Doctrine `notFound()` sur flag inactif** : remplacer partout par un écran de statut (« Capacité désactivée — pilotée dans Réglages avancés »), ou conserver le 404 pour certaines capacités volontairement invisibles ? Impacte F et H. À valider contre la doctrine flags atomiques (notifications/integrations/search/channels).
- **D4 — Nav secondaire du hub global settings** : l'absence de route nav dans `settings/*` est-elle un choix (hub racine = circulation) ou un écart à corriger ? Aucun lot ouvert tant que non tranché.

## Écarts hors périmètre consignés (à traiter dans d'autres chantiers)

- Statistique mockée en dur dans `content/seo/page.tsx` (~l.30, `totalSeoMissing`).
- Mapping d'erreurs métier dupliqué dans les pages (`getTaxErrorMessage`, `getShippingZoneErrorMessage`).

## Invariants

- Micro-lots : un lot = une branche = un merge, typecheck + lint systématiques, recette navigateur (desktop + mobile) pour tout lot touchant le rendu.
- Réutiliser `AdminSectionRouteNav`, les tons active/upgrade/managed et les patterns du hub catalog — aucune nouvelle abstraction sans besoin démontré.
- La documentation de chaque lot livré est ajoutée ici (statut + renvoi commit), pas dans un fichier séparé tant qu'un lot ne le justifie pas.

## Critères de fin

- Les 6 critères de la grille sont conformes (ou en exception documentée) sur les 6 domaines audités.
- Plus aucun `notFound()` piloté par flag sans écran de statut, sauf exception actée en D3.
- Recette navigateur passée sur chaque domaine touché.
