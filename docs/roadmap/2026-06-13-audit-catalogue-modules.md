<!-- docs/roadmap/2026-06-13-audit-catalogue-modules.md -->

# Audit — Catalogue de pilotage (settings/advanced) et roadmap de développement

**Date :** 2026-06-13
**Statut :** photographie + roadmap de suivi (pas un engagement de calendrier)

## 1. Périmètre de cet audit

`features/admin/pilotage/catalog/feature-catalog.ts` (`FEATURE_CATALOG`) liste 32 entrées
visibles dans `/admin/settings/advanced`, regroupées par famille documentaire
(`docs/domains/README.md`) :

- `core` — bases fondamentales (9 entrées)
- `cross_cutting` — fonctions transverses (6 entrées)
- `optional` — modules optionnels (8 entrées)
- `satellite` — modules satellites (9 entrées)

Chaque entrée porte : `defaultState`, `mutability` (`readonly` / `toggleable` /
`level_selectable`), `scopes`, parfois `levels` et `dependencies`.

`docs/domains/` contient ~70 fiches doctrine (beaucoup plus large que le catalogue :
ce sont les capacités déjà **modélisées en Prisma** sous `prisma/optional/` et
`prisma/satellites/` mais pas encore toutes catalogués/activables). Ce document se
concentre sur les 32 entrées du catalogue, qui sont la surface réellement pilotable
depuis l'admin aujourd'hui.

## 2. Échelle de maturité utilisée

- **L0 — Catalogué seulement** : entrée `FEATURE_CATALOG` + `FeatureFlag` seedé +
  fiche doctrine. Aucune page admin, aucun code dédié.
- **L1 — Gating posé, UI placeholder** : query `isXFeatureActive()` +
  page admin qui affiche `AdminComingSoon` (référence doc + prérequis).
- **L2 — UI construite, données mock** : interface admin réelle mais données non
  branchées sur Prisma (cockpit de démonstration).
- **L3 — Fonctionnel** : lecture/écriture réelles en DB, intégré au flux
  storefront/admin concerné.

## 3. État par entrée

### `core` (9) — toutes actives, socle catalogue produit + pilotage lui-même

| Clé | Maturité | Note |
|---|---|---|
| `catalog.products.pricing` | L3 | |
| `catalog.products.availability` | L3 | |
| `catalog.products.variants` | L3 | |
| `catalog.products.categories` | L3 | |
| `catalog.products.seo` | L3 | dépend de `engagement.analytics` (déclaré, sans effet observé) |
| `catalog.products.related` | L3 | gating posé (`is-related-products-feature-active`), utilisé admin + boutique |
| `catalog.products.inventory` | L3 (niveau `manual`) | niveaux `alerts`/`forecasting` déclarés dans `FEATURE_LEVELS.inventory` mais aucun code ne les implémente |
| `catalog.products.media` | L3 (niveau `basic`) | niveaux `optimization`/`generation`/`automation` déclarés mais non implémentés |
| `settings.advanced` | L3 | le pilotage lui-même |

**Constat :** le socle catalogue est solide. Le seul écart est la **gradation
annoncée mais non câblée** de `catalog.products.inventory` et
`catalog.products.media` — les niveaux existent dans `FEATURE_LEVELS` (donc
sélectionnables dans l'UI de pilotage) sans effet fonctionnel derrière.

### `cross_cutting` (6) — fonctions transverses actives

| Clé | Maturité | Note |
|---|---|---|
| `content.blog` | L3 | `features/admin/blog`, `/admin/content/blog` |
| `content.homepage` | L3 | pilote de la convention copy unifiée (lots localization 1-4) |
| `content.seo` | L3 | `features/seo`, `/admin/content/seo` |
| `maintenance.observability` | L3 | `/admin/maintenance/observability` |
| `maintenance.logs` | L3 | `/admin/maintenance/logs` |
| `insights.analyticsRead` | L3 (capability) | gouverne l'accès admin à `/admin/insights/analytics` — mais les données affichées (`engagement.analytics`) sont en L2 (mock) |

**Constat :** cohérent et actif. Le seul point d'attention est la dépendance
`insights.analyticsRead → engagement.analytics` : la capability d'accès est réelle,
mais ce à quoi elle donne accès est un cockpit mock (cf. section optional).

### `optional` (8) — modules à développement variable

| Clé | Maturité | Note |
|---|---|---|
| `platform.localization` | L2/L3 partiel, **en pause** | lots 1-4 faits (2026-06-13) : guard gradué, niveau `managed`, admin `/admin/settings/localization`, pilote homepage multilingue. Niveau repassé à `managed`, sélecteur masqué. Lot `localized-routing` (L3) cadré non tranché (`docs/lots/2026-06-13-localization-l3-cadrage.md`) |
| `engagement.analytics` | L2 | `/admin/insights/analytics` — cockpit complet, **toutes les données sont des mocks assumés** (commentaire en tête de fichier), modèles `AnalyticsMetric`/`AnalyticsSnapshot` posés en Prisma mais non lus |
| `engagement.newsletter` | L1 | `AdminComingSoon`, doc `cross-cutting/newsletter.md` |
| `engagement.automations` | L1 | `AdminComingSoon`, **schéma Prisma non identifié** ("à définir" dans le placeholder — à vérifier vs `docs/domains/cross-cutting/marketing.md` / `workflow.md`) |
| `platform.notifications` | L0 | aucune query de gating, aucune page admin dédiée (à ne pas confondre avec `/admin/settings/notifications`, qui est la config email transactionnelle du store — domaine `core`) |
| `platform.integrations` | L0 | aucune query, aucune page |
| `platform.webhooks` | L0 | aucune query, aucune page |
| `ai.core` | L0 | aucune query, aucune page — **cf. point de doctrine section 5** |

### `satellite` (9) — extensions commerce et plateforme

| Clé | Maturité | Note |
|---|---|---|
| `commerce.payments` | L3 (actif) | `/admin/commerce/payments`, liste paiements réelle |
| `commerce.documents` | L3 (inactif par défaut) | génération "confirmation de commande" implémentée et intégrée au détail commande (`features/admin/commerce/documents/*`) — le module le plus avancé parmi les `inactive` |
| `commerce.discounts` | L1 | `AdminComingSoon`, niveaux `simple/rules/automation` déclarés, rien implémenté |
| `commerce.shipping` | L1 (actif par défaut) | `AdminComingSoon` côté admin — le storefront gère uniquement "Virement bancaire" (H2 hors périmètre paiement en ligne) ; pas de transporteurs/suivi |
| `commerce.fulfillment` | L0 | aucune query, aucune page |
| `commerce.returns` | L0 | aucune query, aucune page |
| `commerce.taxation` | L0 | aucune query, aucune page |
| `satellite.search` | L0 | aucune query, aucune page |
| `satellite.channels` | L0 | aucune query, aucune page |

## 4. Synthèse

- **L3 fonctionnel** : 14/32 (core catalogue produit, content/maintenance, commerce.payments, commerce.documents, commerce.products.related)
- **L2 mock** : 2/32 (engagement.analytics, localization en pause)
- **L1 placeholder (Coming Soon)** : 4/32 (commerce.shipping, commerce.discounts, engagement.newsletter, engagement.automations)
- **L0 catalogué sans code** : 9/32 (platform.notifications/integrations/webhooks, ai.core, commerce.fulfillment/returns/taxation, satellite.search/channels)
- **Niveaux annoncés non câblés** : catalog.products.inventory (alerts/forecasting), catalog.products.media (optimization/generation/automation)

## 5. Point de doctrine à signaler (écart catalogue / roadmap)

`docs/roadmap/projet-creatyss.md`, section « Hors périmètre assumé », exclut
explicitement **« IA produit »** et **« Analytics complexes »** sans validation.
Or `ai.core` (niveaux `basic → automation`) et `engagement.analytics` (niveaux
`read → insights → recommendations`) sont déjà catalogués dans
`FEATURE_CATALOG` avec une gradation complète.

Ce n'est pas forcément incohérent (le catalogue peut documenter une capacité
*sans* l'activer), mais cela mérite une clarification explicite la prochaine fois
qu'un de ces deux modules est ouvert : confirmer que l'ouverture reste soumise à
la même validation que pour toute capacité « Plus tard », malgré sa présence dans
le catalogue.

## 6. Roadmap proposée (ordre indicatif, à valider lot par lot)

Conformément à AGENTS.md / Horizon 4 : aucune ouverture de module n'est une
construction libre — c'est une **activation gouvernée**, précédée d'un cadrage
(`architect-review`) qui tranche les décisions produit, comme fait pour
`platform.localization` et `clone-à-blanc`.

Ordre proposé, du plus proche du fonctionnel au plus loin :

1. **Finir ce qui est en pause** : `platform.localization` — trancher le cadrage
   `localized-routing` (L3) ou généraliser `LocalizedValue` à d'autres contenus.
2. **Compléter un module déjà L3 partiel** : `commerce.shipping` — admin
   transporteurs/suivi, pour atteindre la cohérence avec son `defaultState: active`.
3. **Combler l'écart niveaux déclarés/câblés** sur `catalog.products.inventory`
   (alerts) et `catalog.products.media` (optimization) — petits lots, dans le
   socle existant.
4. **Brancher `engagement.analytics` sur Prisma** (remplacer les mocks par
   `AnalyticsMetric`/`AnalyticsSnapshot`) — débloque aussi le sens réel de
   `insights.analyticsRead`.
5. **Modules L1 → L3** : `commerce.discounts`, `engagement.newsletter`,
   `engagement.automations` (vérifier/poser le schéma Prisma manquant en premier).
6. **Modules L0** : `commerce.documents` (étendre au-delà de la confirmation de
   commande), puis `commerce.fulfillment`, `commerce.returns`, `commerce.taxation`,
   `platform.notifications`, `platform.integrations`, `platform.webhooks`,
   `satellite.search`, `satellite.channels`.
7. **`ai.core`** : en dernier, et seulement après clarification du point 5.

## 7. Checklist générique par module (pattern canonique H4)

À dupliquer dans un cadrage dédié (`docs/lots/AAAA-MM-JJ-<module>-cadrage.md`)
avant tout sous-lot :

- [ ] Décisions produit tranchées (périmètre, niveaux retenus, dépendances)
- [ ] Prérequis socle vérifiés (rien à refondre dans `core`)
- [ ] `FeatureFlag` : statut DRAFT → ACTIVE, `allowedLevels`/`defaultLevel` si gradué
- [ ] Modèle Prisma : déjà posé (`prisma/optional/` ou `prisma/satellites/`) — vérifier l'écart avec le besoin réel
- [ ] Admin : remplace `AdminComingSoon` par l'implémentation réelle (queries + actions + composants)
- [ ] Storefront : intégration si le module a un effet visible côté client
- [ ] Tests unitaires/E2E ciblés
- [ ] Fiche `docs/domains/**` mise à jour (statut, invariants, limites)
- [ ] `docs/roadmap/projet-creatyss.md` : sortir le module de « Plus tard » et tracer son état

## 8. Suivi

Ce document est la photographie de référence pour le suivi des modules
`optional`/`satellite`. À chaque module ouvert : mettre à jour son entrée dans la
section 3 (maturité, note) et cocher la checklist section 7 dans son propre
cadrage.
