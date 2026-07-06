# Lot 6 — Domaines `tracking` et `dashboarding` : cadrage

Suite de `docs/roadmap/analyses-cockpit-analytique/README.md`. Les deux derniers domaines cross-cutting cités par ce chantier comme "documentés mais non implémentés" (`attribution` et `conversion` ont déjà été tranchés — lots 4 et 3). Ce document cadre `tracking` et `dashboarding` avant tout code — aucune implémentation ici.

## Observé (2026-07-06)

### `tracking`

- `docs/domains/cross-cutting/tracking.md` : domaine conceptuel, `activable: oui`, aucun `FeatureFlag` seedé sous ce nom, aucun modèle Prisma dédié (`Prisma` ne contient aucun `TrackingEvent`).
- Le repo a déjà une implémentation concrète qui correspond fonctionnellement à ce que `tracking.md` décrit : `features/analytics/tracking/record-storefront-analytics-event.service.ts` — événements typés (`productView`, `cartAddition`, `searchTermQuery`, `searchZeroResults`), payload structuré, agrégats quotidiens anonymes sans cookie, gatés par le flag `engagement.analytics`.
- Cette implémentation vit sous `features/analytics/`, pas sous un domaine `tracking` dédié, et le flag qui la gouverne est `engagement.analytics`, pas un flag `tracking` propre.

### `dashboarding`

- `docs/domains/cross-cutting/dashboarding.md` : domaine conceptuel, `activable: non` — le domaine est dit "structurel dès qu'une exposition gouvernée de vues de pilotage existe". Aucun modèle Prisma (`DashboardView`/`DashboardWidget`/`DashboardScope`/`DashboardAudience`/`DashboardPolicy` : aucun n'existe).
- Deux écrans jouent déjà ce rôle en pratique : `/admin` (`AdminDashboardSections`, `getAdminDashboardStats`) et `/admin/insights/analytics` (le cockpit Analyses de ce chantier). Chacun compose ses propres sections/props ad hoc (pas de `DashboardWidget` réutilisable, pas de notion de `DashboardAudience` distincte boutique/plateforme — le repo est mono-boutique par instance, cf. `docs/domains/core/foundation/stores.md`).

## Ce qui distingue ces deux cas d'`attribution`/`conversion`

Contrairement à `attribution` (où la brique manquante — mémorisation UTM — introduirait une vraie rupture de principe) et `conversion` (où l'arbitrage a été de réutiliser un moteur existant plutôt que ce domaine), `tracking` et `dashboarding` ne posent pas de fork architectural : une matière fonctionnelle existe déjà et couvre l'essentiel du rôle documenté, seulement sous un autre nom et sans l'abstraction générique (types Prisma `DashboardWidget`, flag `tracking` dédié) que la doctrine envisage.

La question n'est donc pas "faut-il construire" mais : **faut-il matérialiser l'abstraction générique documentée, ou assumer que la version légère actuelle (par écran, par feature) suffit tant que le besoin ne dépasse pas l'échelle actuelle (mono-boutique, deux écrans de pilotage) ?**

## Décision (2026-07-06)

Arbitrage inversé par rapport à la recommandation initiale ci-dessus, sur un périmètre plus étroit que celui envisagé :

- **`tracking`** : séparation du flag de gouvernance uniquement. `engagement.tracking` (`prisma/seed/tracking-feature-flag.seed.ts`) gouverne désormais la collecte storefront, distincte de `engagement.analytics` qui gouverne l'exposition admin des lectures. Seedé actif d'emblée pour toutes les boutiques (remplace une capacité déjà active, pas une nouvelle feature à activer progressivement). Aucun modèle Prisma `TrackingEvent` introduit — la collecte reste sur `AnalyticsSnapshot` existant.
- **`dashboarding`** : extraction de primitives partagées (`components/admin/dashboard-widgets/` — `KpiCard`, `DashboardSection`), déclaratives sans persistance Prisma. Adopté dans `analytics-overview-sections.tsx` où la duplication était réelle (6 wrappers de section répétés). `admin-dashboard-sections.tsx` conserve sa propre mise en page (grille à cellules) : le chevauchement visuel avec le cockpit Analyses n'est pas jugé être une duplication littérale.

Aucun `DashboardWidget`/`DashboardAudience` Prisma introduit, aucune notion d'audience boutique/plateforme : l'abstraction reste au niveau composant React et flag, pas au niveau modèle de données. Les conditions de réouverture listées dans la recommandation initiale restent valables pour toute matérialisation Prisma plus poussée.

## Hors périmètre de ce document

Toute nouvelle implémentation au-delà de ce qui est décrit ci-dessus.
