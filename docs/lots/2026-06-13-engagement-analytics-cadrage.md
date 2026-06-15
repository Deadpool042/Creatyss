<!-- docs/lots/2026-06-13-engagement-analytics-cadrage.md -->

# Cadrage — `engagement.analytics` → Prisma (périmètre commerce)

> Suite de `docs/roadmap/2026-06-13-audit-catalogue-modules.md`, section 6,
> point 4 : « Brancher `engagement.analytics` sur Prisma (remplacer les mocks
> par `AnalyticsMetric`/`AnalyticsSnapshot`) — débloque aussi le sens réel de
> `insights.analyticsRead`. »

## État actuel (audit)

### Feature catalog et niveaux

`features/admin/pilotage/catalog/feature-catalog.ts` :

```ts
export const FEATURE_LEVELS = {
  analytics: ["read", "insights", "recommendations"],
  ...
};
```

`engagement.analytics` : `family: "optional"`, `module: "engagement"`,
`defaultState: "inactive"`, `mutability: "level_selectable"`, `levels:
FEATURE_LEVELS.analytics`.

`insights.analyticsRead` (`family: "cross_cutting"`, `defaultState:
"active"`, `mutability: "readonly"`) déclare `dependencies:
["engagement.analytics"]`.

### Écart n°1 — le flag `engagement.analytics` n'est jamais seedé : la page est inaccessible

`prisma/seed/feature-flags-catalog.seed.ts` ne seed que les flags
`catalog.products.*`. Aucun seed ne crée de `FeatureFlag` pour
`engagement.analytics`.

`isAnalyticsFeatureActive()`
(`features/admin/insights/queries/is-analytics-feature-active.query.ts`) →
`queryFeatureFlagActive("engagement.analytics")`
(`features/admin/pilotage/queries/query-feature-flag-active.ts`) : si
`flags.length === 0`, retourne `false`.

→ `/admin/insights/analytics` (`app/admin/(protected)/insights/analytics/page.tsx`)
appelle `notFound()` dans l'état actuel du seed. Le cockpit existe en code
mais n'est **pas accessible** tel que le repo est seedé aujourd'hui — plus
proche d'un L1 « code écrit, non activé » que d'un L2 « mock visible ».

### Écart n°2 — le cockpit est 100% statique, sans lecture Prisma

`features/admin/insights/components/analytics-overview-sections.tsx` :
constantes `TODAY`/`MONTH`/`TOP_PAGES` codées en dur, aucun import `db`/Prisma.
Le composant porte lui-même le commentaire :

> « Cockpit analytics — toutes les données sont des mocks assumés. »

`prisma/optional/engagement/analytics.prisma` définit `AnalyticsMetric` et
`AnalyticsSnapshot` (cf. `docs/domains/cross-cutting/analytics.md`, modèle
conceptuel), mais aucun code ne les lit ni n'y écrit.

### Écart n°3 — point de doctrine déjà signalé (roadmap, section 5)

`docs/roadmap/projet-creatyss.md`, section « Hors périmètre assumé », exclut
explicitement **« Analytics complexes »** sans validation. Les indicateurs du
bloc `TODAY` (sessions, pages vues, visiteurs uniques, taux de conversion)
nécessitent un pipeline de tracking de trafic — absent du repo
(`docs/domains/cross-cutting/tracking.md` n'a pas d'implémentation associée
identifiée). Brancher ce bloc relèverait de l'« analytics complexe » exclu.

En revanche, le bloc `MONTH` (revenu, commandes, nouveaux clients, taux de
retour) est calculable depuis des données réelles déjà présentes :
`Order` (`totalAmount`, `status`, `placedAt`/`createdAt`) et `Customer`
(`createdAt`), domaine `commerce.orders`/`commerce.customers` (`core`, déjà
actifs).

## Décision macro tranchée (2026-06-13)

**Périmètre réduit — commerce uniquement** (validé par l'utilisateur) :

- Le bloc « Ce mois » (`MONTH`) est branché sur des données réelles
  (`Order`/`Customer`), via une nouvelle lecture dans le domaine `commerce`.
- Le bloc « Aujourd'hui vs hier » (`TODAY`, trafic/conversion) **reste mock**,
  étiqueté explicitement comme tel (vue partielle, source `tracking`
  absente — cf. `docs/domains/cross-cutting/analytics.md`, invariant « une vue
  partielle, dégradée ou incomplète doit pouvoir être explicitée »).
- Aucun pipeline de tracking de trafic n'est créé. « Analytics complexes »
  reste hors périmètre assumé (`docs/roadmap/projet-creatyss.md`).

## Décisions à trancher (fines)

### B — Stratégie de calcul : lecture live vs `AnalyticsMetric`/`AnalyticsSnapshot`

1. **Lecture live (Recommandé)** : une query `commerce` agrège
   `Order`/`Customer` à la demande (mois courant) pour produire les 4
   indicateurs. `AnalyticsMetric`/`AnalyticsSnapshot` restent posés mais non
   alimentés par ce lot — leur alimentation (historisation, snapshots
   périodiques via `jobs`) est un lot ultérieur distinct. Le composant
   documente cette limite ("vue calculée à la demande, non historisée").
   - Avantage : petit lot, pas de nouvelle infrastructure (jobs/cron), pas
     d'écriture en lecture de page.
2. **Alimentation `AnalyticsMetric`/`AnalyticsSnapshot`** : la page calcule
   puis upsert un `AnalyticsSnapshot` par métrique/période, lu ensuite par le
   cockpit. Honore plus fidèlement le modèle conceptuel posé, mais introduit
   un effet de bord en lecture de page et un besoin de gouvernance
   (idempotence, recalcul) — plus proche d'un chantier `jobs`/`analytics`
   complet.

### C — Gating par niveau

1. **Seeder `engagement.analytics`** (`allowedLevels:
   ["read","insights","recommendations"]`, `defaultLevel: "read"`, même
   schéma que le sous-lot 0 du chantier inventory/media) et gater le bloc
   « Ce mois » réel sur `meetsFeatureLevel("engagement.analytics", "read")` —
   niveau de base. (Recommandé)
2. Pas de gating par niveau : le bloc réel s'affiche dès que le module est
   actif, indépendamment du niveau.

### D — Activation du module

1. **Seeder le `FeatureFlag` `engagement.analytics`** avec `status: "ACTIVE"`,
   `isEnabledByDefault: false` (cohérent avec `defaultState: "inactive"` du
   catalogue — le module devient *togglable* dans le pilotage
   `/admin/settings/advanced`, mais reste désactivé par défaut). Sans ce
   sous-lot, la page reste `notFound()` quel que soit le reste du lot.
   (Recommandé)
2. Activer par défaut (`isEnabledByDefault: true`) — rendrait le cockpit
   visible immédiatement pour toutes les boutiques.

### E — Indicateurs exacts du bloc « Ce mois »

1. **(Recommandé)**
   - `revenue` : somme de `Order.totalAmount` où `status` ∈
     `{CONFIRMED, PROCESSING, COMPLETED}` et `placedAt` dans le mois courant.
   - `orders` : nombre de ces mêmes commandes.
   - `newCustomers` : nombre de `Customer` où `createdAt` dans le mois
     courant.
   - `cancellationRate` (renomme « Taux de retour » → **« Taux
     d'annulation »**) : `count(status = CANCELLED) / count(toutes commandes
     créées)` sur le mois courant, en %. Justification : `commerce.returns`
     est L0 (aucun modèle `Return`), mais `OrderStatus.CANCELLED` existe
     réellement sur `Order` — évite d'inventer une donnée de retour
     inexistante (cf. doctrine « ne jamais remplacer une contrainte projet
     par une préférence générique »).
2. Conserver le libellé « Taux de retour » mais le calculer depuis
   `CANCELLED` quand même (étiquette trompeuse, non recommandé).
3. Retirer ce 4ᵉ indicateur (garder seulement revenu/commandes/nouveaux
   clients).

## Sous-lots proposés (si B1 + C1 + D1 + E1)

1. **Sous-lot 0** — Seed `engagement.analytics` (`allowedLevels`/
   `defaultLevel`/`isEnabledByDefault: false`, via le seed catalogue ou un
   seed dédié `engagement`). Vérif `tsc --noEmit` + vérif manuelle :
   `meetsFeatureLevel("engagement.analytics","read")` retourne `false` par
   défaut (module inactif).
2. **Sous-lot 1** — Query `commerce` : agrégats Prisma `Order`/`Customer` du
   mois courant → `revenue`, `orders`, `newCustomers`, `cancellationRate`.
   Vérif `tsc --noEmit`.
3. **Sous-lot 2** — Câblage : `app/admin/(protected)/insights/analytics/page.tsx`
   appelle la query du sous-lot 1 + `meetsFeatureLevel("engagement.analytics",
   "read")` ; `AnalyticsOverviewSections` reçoit les données réelles pour le
   bloc « Ce mois » (gated) et conserve le bloc « Aujourd'hui vs hier » en
   mock, avec disclaimer renforcé (source tracking absente). Vérif
   `tsc --noEmit`.
4. **Sous-lot 3** — Vérifications + mise à jour
   `docs/domains/cross-cutting/analytics.md` (section « Décisions
   d'implémentation »), `docs/roadmap/2026-06-13-audit-catalogue-modules.md`
   (entrée `engagement.analytics`, point 4 section 6), bilan d'exécution dans
   ce cadrage.

## Hors périmètre (doctrine)

- Bloc « Aujourd'hui vs hier » (sessions, pages vues, visiteurs uniques, taux
  de conversion) — nécessite `tracking`, classé « analytics complexes »,
  hors périmètre assumé sans validation explicite.
- Alimentation effective de `AnalyticsMetric`/`AnalyticsSnapshot`
  (historisation, snapshots périodiques, `jobs`).
- Niveaux `insights`/`recommendations` (analytics avancées, recommandations).
- `commerce.returns` (modèle `Return` dédié) — le KPI « Taux d'annulation »
  reste basé sur `OrderStatus.CANCELLED`, sans créer de modèle retours.
- Toute évolution de `insights.analyticsRead` au-delà de sa dépendance
  déclarative existante.

## Décision tranchée (2026-06-13)

- **B → B1** : lecture live `Order`/`Customer`, `AnalyticsMetric`/
  `AnalyticsSnapshot` non alimentés par ce lot.
- **C → C1** : seed `engagement.analytics` (`allowedLevels:
  ["read","insights","recommendations"]`, `defaultLevel: "read"`), bloc réel
  gated `meetsFeatureLevel("engagement.analytics", "read")`.
- **D → D1** : seed `FeatureFlag` `engagement.analytics`,
  `isEnabledByDefault: false`.
- **E → E1** : Revenu + Commandes + Nouveaux clients + « Taux d'annulation »
  (`CANCELLED` / total commandes du mois).

→ Les 4 sous-lots de la section précédente sont retenus, à exécuter dans
l'ordre, chacun vérifié `tsc --noEmit`.

## Bilan d'exécution (2026-06-13)

Les 4 sous-lots ont été exécutés dans l'ordre, chacun vérifié `tsc --noEmit`
(0 erreur).

### Sous-lot 0 — seed `engagement.analytics`

- `prisma/seed/analytics-feature-flag.seed.ts` (nouveau) :
  `seedAnalyticsFeatureFlag(db)`, `allowedLevels:
  ["read","insights","recommendations"]`, `defaultLevel: "read"`,
  `isEnabledByDefault: false`. Câblé dans `prisma/seed.ts`.
- **Écart mineur vs décision D1** : D1 mentionnait `status: "ACTIVE"`. Le seed
  utilise `status: "DRAFT"`, par cohérence avec le précédent
  `seedLocalizationFeatureFlag` et avec `toggleFeatureFlagAction`
  (`features/admin/pilotage/actions/toggle-feature-flag.action.ts`), qui
  bascule `DRAFT/INACTIVE → ACTIVE` (et synchronise `isEnabledByDefault`) au
  premier clic. Avec `status: "ACTIVE"` + `isEnabledByDefault: false`, le
  premier clic aurait basculé vers `INACTIVE` (état déjà inactif), nécessitant
  deux clics pour activer réellement le module. `DRAFT` +
  `isEnabledByDefault: false` produit le même état effectif (`isActive =
  false`, `meetsFeatureLevel("engagement.analytics","read") === false`) tout
  en rendant le toggle pilotage correct dès le premier clic.
- Vérif manuelle (lecture code, `getFeatureLevelState`) : `flags.length > 0`
  (row seedée) mais `status !== "ACTIVE"` → `isActive = false` →
  `meetsFeatureLevel("engagement.analytics","read") === false`. Module
  inactif par défaut, conforme à D1.

### Sous-lot 1 — query commerce mensuelle

- `features/admin/insights/queries/get-monthly-commerce-analytics.query.ts`
  (nouveau, server-only) : `getMonthlyCommerceAnalytics()`, mois courant (UTC,
  1ᵉʳ du mois → 1ᵉʳ du mois suivant), lecture live `Order`/`Customer` scoped
  `storeId` (`getCurrentStoreId`).
  - `revenue`/`ordersCount` : `db.order.aggregate` (`_sum.totalAmount`,
    `_count`), `status ∈ {CONFIRMED, PROCESSING, COMPLETED}`, `placedAt` dans
    le mois.
  - `newCustomersCount` : `db.customer.count`, `createdAt` dans le mois.
  - `cancellationRate` : `count(status = CANCELLED, createdAt mois) /
    count(toutes commandes créées, createdAt mois) * 100` (0 si aucune
    commande créée ce mois).
  - Retourne aussi `0`/vide si aucun store (cohérent avec les autres
    résolveurs `getCurrentStoreId`-based).

### Sous-lot 2 — câblage page + cockpit

- `app/admin/(protected)/insights/analytics/page.tsx` : appelle
  `meetsFeatureLevel("engagement.analytics","read")` et
  `getMonthlyCommerceAnalytics()` (en parallèle), passe `monthly` (ou `null`
  si le niveau n'est pas atteint) à `AnalyticsOverviewSections`.
- `features/admin/insights/components/analytics-overview-sections.tsx` :
  - prop `monthly?: MonthlyCommerceAnalytics | null` ;
  - bloc « Ce mois » : si `monthly !== null`, affiche Revenu/Commandes/
    Nouveaux clients/« Taux d'annulation » réels (libellé renommé depuis
    « Taux de retour », calcul `CANCELLED`/total commandes du mois) et retire
    le badge « (mock) » ; sinon comportement antérieur inchangé (constantes
    `MONTH`, badge « (mock) ») ;
  - encart « Module analytics » : texte adapté selon `monthly`
    (réel → précise lecture live non historisée + bloc trafic mock ; mock →
    texte d'origine) ;
  - bloc « Aujourd'hui vs hier » : disclaimer renforcé ajouté sous le titre
    de section (« nécessite un pipeline de tracking du trafic — non
    implémenté »), constantes `TODAY`/`TOP_PAGES` inchangées.
- Comportement par défaut (module inactif, seed sous-lot 0) : `page.tsx`
  appelle toujours `notFound()` via `isAnalyticsFeatureActive()` —
  inchangé. Une fois le module activé (toggle pilotage → `ACTIVE`,
  `isEnabledByDefault: true`), `defaultLevel: "read"` est immédiatement
  satisfait (pas d'override) : le bloc « Ce mois » devient réel dès
  l'activation.

### Sous-lot 3 — vérifications + documentation

- `docs/domains/cross-cutting/analytics.md` : section « Décisions
  d'implémentation » ajoutée.
- `docs/roadmap/2026-06-13-audit-catalogue-modules.md` : entrée
  `engagement.analytics` (section 3, optional) passée à « L3 (périmètre
  commerce, 2026-06-13), inactif par défaut » ; note `insights.analyticsRead`
  mise à jour ; synthèse section 4 ajustée (16/32 L3, 1/32 L2) ; point 4
  section 6 marqué fait ; addendum section 5 (clarification doctrine faite
  pour `engagement.analytics`, `ai.core` toujours non ouvert).
- Présent bilan ajouté au cadrage.

### Hors périmètre (confirmé, inchangé)

Pipeline de tracking de trafic (bloc « Aujourd'hui vs hier »), alimentation
`AnalyticsMetric`/`AnalyticsSnapshot`, niveaux `insights`/`recommendations`,
modèle `Return` dédié (`commerce.returns`), toute évolution de
`insights.analyticsRead` au-delà de sa dépendance déclarative existante.
