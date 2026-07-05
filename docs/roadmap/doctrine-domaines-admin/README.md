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

## Décisions (tranchées le 2026-07-05)

- **D1 — Route du hub commerce : `/admin/commerce/settings`.** Symétrie stricte avec `/admin/catalog/settings` ; les redirects du hub global pointent déjà vers les settings de domaine.
- **D2 — Content : hub léger.** `/admin/content/settings` sur le même pattern, surface minimale (un seul levier gradué aujourd'hui : blog draft/publish). Pas de sur-architecture.
- **D3 — Fin des `notFound()` sur flag inactif côté admin.** Un admin authentifié voit un écran de statut « Capacité désactivée — pilotée dans Réglages avancés » (lien vers la gouvernance). Le 404 reste réservé aux ressources inexistantes. S'applique à marketing/\*, taxation, insights et settings/{ai,integrations,search,channels,webhooks} ; la gradation Prisma des flags atomiques reste inchangée.
- **D4 — Statu quo assumé pour le hub global settings.** Pas de nav secondaire dans `settings/*` : le hub racine et la sidebar assurent la circulation. Exception documentée ici.

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
