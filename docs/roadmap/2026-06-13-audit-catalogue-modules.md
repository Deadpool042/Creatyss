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
| `catalog.products.inventory` | L3 (niveaux `manual`/`alerts` câblés, 2026-06-13) | seed `allowedLevels`/`defaultLevel` + résolveur générique de niveau (`meetsFeatureLevel`) ; niveau `alerts` câblé : `InventoryItem.lowStockThreshold` configurable, `getStockBadge()` utilise le seuil configuré. `forecasting` reste déclaré sans implémentation |
| `catalog.products.media` | L3 (niveaux `basic`/`optimization` câblés, 2026-06-13) | seed `allowedLevels`/`defaultLevel` + résolveur générique de niveau ; niveau `optimization` câblé : diagnostic « sans texte alternatif » gated. Diagnostic ratio 4:5 déjà existant, ungated, laissé tel quel (cf. `docs/domains/satellites/media.md`). `generation`/`automation` restent déclarés sans implémentation |
| `settings.advanced` | L3 | le pilotage lui-même |

**Constat :** le socle catalogue est solide. La **gradation
annoncée mais non câblée** de `catalog.products.inventory` et
`catalog.products.media` a été comblée pour les niveaux `alerts`/`optimization`
(2026-06-13, cf. `docs/lots/2026-06-13-inventory-media-levels-cadrage.md`) ;
les niveaux supérieurs (`forecasting`, `generation`/`automation`) restent
déclarés sans implémentation.

### `cross_cutting` (6) — fonctions transverses actives

| Clé | Maturité | Note |
|---|---|---|
| `content.blog` | L3 | `features/admin/blog`, `/admin/content/blog` |
| `content.homepage` | L3 | pilote de la convention copy unifiée (lots localization 1-4) |
| `content.seo` | L3 | `features/seo`, `/admin/content/seo` |
| `maintenance.observability` | L3 | `/admin/maintenance/observability` |
| `maintenance.logs` | L3 | `/admin/maintenance/logs` |
| `insights.analyticsRead` | L3 (capability) | gouverne l'accès admin à `/admin/insights/analytics` — `engagement.analytics` (bloc « Ce mois ») est désormais branché sur des données commerce réelles, mais le module reste inactif par défaut (cf. section optional) |

**Constat :** cohérent et actif. La dépendance `insights.analyticsRead →
engagement.analytics` donne accès à un cockpit partiellement réel (bloc « Ce
mois ») et partiellement mock (bloc « Aujourd'hui vs hier », tracking absent,
cf. section optional).

### `optional` (8) — modules à développement variable

| Clé | Maturité | Note |
|---|---|---|
| `platform.localization` | L2/L3 partiel, **en pause** | lots 1-4 faits (2026-06-13) : guard gradué, niveau `managed`, admin `/admin/settings/localization`, pilote homepage multilingue. Niveau repassé à `managed`, sélecteur masqué. Lot `localized-routing` (L3) cadré non tranché (`docs/lots/2026-06-13-localization-l3-cadrage.md`) |
| `engagement.analytics` | L3 (périmètre commerce, 2026-06-13), **inactif par défaut** | `/admin/insights/analytics` — flag seedé (`status: DRAFT`, `isEnabledByDefault: false`, niveaux `read/insights/recommendations`) ; bloc « Ce mois » branché sur `Order`/`Customer` réels (lecture live, gated `meetsFeatureLevel("engagement.analytics","read")`) ; bloc « Aujourd'hui vs hier » reste mock (tracking absent, hors périmètre). `AnalyticsMetric`/`AnalyticsSnapshot` toujours non lus/écrits |
| `engagement.newsletter` | L3 (inactif par défaut, niveau `basic`) | 2026-06-13 : `/admin/marketing/newsletter` remplace `AdminComingSoon` — CRUD `NewsletterSubscriber` (ajout + bascule SUBSCRIBED/UNSUBSCRIBED), gated `meetsFeatureLevel("engagement.newsletter","basic")`. 2026-06-14 : la homepage storefront branche enfin `POST /api/newsletter` sur une création/réactivation idempotente du référentiel. Aucune campagne (`NewsletterCampaign`/`NewsletterCampaignRecipient` non alimentés, aucun envoi email). Niveaux `segmentation`/`automation` non implémentés |
| `engagement.automations` | L3 (inactif par défaut, boucle bornée exécutable) | 2026-06-14 : `FeatureFlag` seedé (`prisma/seed/automations-feature-flag.seed.ts`, DRAFT). Schéma Prisma minimal posé (`prisma/optional/engagement/automations.prisma`) puis `/admin/marketing/automations` branché sur un CRUD admin de définitions `Automation` (création, liste, activation/désactivation, puis édition inline et archivage local). Suite du même jour : la souscription storefront newsletter planifie désormais un `Job` par automation `ACTIVE` avec `triggerType = NEWSLETTER_SUBSCRIBED`, `scheduledAt` dérivé de `delayMinutes`, la page admin expose une lecture locale de ces jobs planifiés, permet maintenant aussi de modifier localement le `scheduledAt` d'un job `PENDING` ou de l'archiver depuis sa propre ligne, un exécuteur manuel borné permet de traiter les jobs prêts pour `actionType = EMAIL_MESSAGE`, puis un batch borné permet d'exécuter les jobs prêts déjà visibles ; la même page expose aussi la trace minimale `EmailMessage` liée à chaque job, désormais rendue de façon plus structurée ligne par ligne, et explicite aussi l'absence de trace locale quand elle n'existe pas, y compris avant exécution sur un job `PENDING`, la désactivation d'une automation annule ses jobs `PENDING` encore planifiés, l'archivage d'une définition annule aussi ses jobs `PENDING` encore liés, un job `PENDING` supprimé localement est lui aussi annulé avant archivage, un opérateur peut annuler manuellement un job `PENDING` ligne par ligne, relancer localement un job `FAILED`, relancer en lot les jobs échoués déjà visibles, annuler en lot les jobs en attente déjà visibles, voir sur chaque définition un résumé local de l'activité jobs liée, focaliser la section jobs sur une définition précise depuis la même page, filtrer localement cette section par statut, utiliser directement les badges d'activité des définitions comme points d'entrée vers la vue jobs cohérente, filtrer localement la liste des définitions elles-mêmes selon cette activité, utiliser aussi les cartes de synthèse jobs comme raccourcis vers ce filtre statut, utiliser aussi le résumé du dernier job comme raccourci vers cette même vue cohérente, avec un état visuel actif quand ce raccourci cible déjà la vue ouverte, rendre l'état vide des jobs filtrés explicite et réversible dans la même page, permettre depuis une ligne job de refocaliser directement la page sur son automation, utiliser aussi le badge statut de cette ligne comme raccourci vers la vue cohérente de ce statut, expliciter la nature de la date principale affichée sur chaque ligne job, distinguer visuellement un `PENDING` prêt à exécuter d'un `PENDING` simplement programmé, expliciter aussi si l'exécution est immédiate, déjà échue ou encore future, rappeler dans la zone d'action qu'un job non prêt reste en attente d'échéance, éviter aussi le simple tiret muet sur les états sans action locale, distinguer aussi dans le résumé batch les jobs déjà prêts des jobs encore en attente d'échéance, faire aussi porter aux boutons batch eux-mêmes le volume visible ciblé, distinguer plus clairement l'erreur du job de l'erreur email éventuelle, permettre de retirer explicitement le filtre statut actif depuis l'entête jobs, retirer d'un coup l'ensemble des filtres jobs actifs sans perdre le contexte `definition`, retirer explicitement le filtre `definition` actif depuis sa propre section sans perdre les autres contextes locaux utiles, expliciter aussi sur chaque ligne job les libellés métier du déclencheur et de l'action, rendre visibles les comptages de définitions et de jobs réellement affichés dans le cockpit filtré, afficher un identifiant court de référence sur chaque ligne job, puis permettre aussi de réinitialiser d'un coup l'ensemble des filtres de page actifs. Suite 2026-06-15 : la même page expose aussi les définitions archivées et permet leur restauration locale vers `INACTIVE`, avec code de repli lisible si le code d'origine a déjà été repris ; elle expose aussi désormais les jobs archivés et peut restaurer localement un ancien `PENDING` vers `PENDING` seulement si son automation liée reste `ACTIVE`, sinon simple réaffichage historique ; enfin, les deux sections d'archives visibles supportent maintenant aussi une restauration batch strictement locale. Aucun worker générique, aucun run model, aucun template éditable dans ce lot |
| `platform.notifications` | L3 (inactif par défaut, lecture seule) | 2026-06-14 : `FeatureFlag` seedé (`prisma/seed/notifications-feature-flag.seed.ts`, DRAFT). `/admin/settings/notifications` conserve la config email transactionnelle et expose, une fois la feature active, une lecture admin réelle de `Notification` / `NotificationPreference` (compteurs + dernières entrées). Aucun moteur d'émission, aucun provider externe, aucun CRUD dans ce lot |
| `platform.integrations` | L3 (inactif par défaut, lecture seule) | 2026-06-14 : `FeatureFlag` seedé (`prisma/seed/integrations-feature-flag.seed.ts`, DRAFT). Page discrète `/admin/settings/integrations` avec lecture admin de `Integration`, `IntegrationCredential` redacts et `IntegrationSyncState`. Aucun secret brut, aucun adaptateur provider, aucune action opératoire dans ce lot |
| `platform.webhooks` | L3 (inactif par défaut, lecture seule, sémantique à clarifier) | 2026-06-14 : `FeatureFlag` seedé (`prisma/seed/webhooks-feature-flag.seed.ts`, DRAFT). Page discrète `/admin/settings/webhooks` avec lecture admin de `WebhookEndpoint` / `WebhookDelivery`. Lot volontairement limité à l’observation du modèle réel, sans masquer l’écart avec la doctrine `webhooks entrants` |
| `ai.core` | L0 | aucune query, aucune page — **cf. point de doctrine section 5** |

### `satellite` (9) — extensions commerce et plateforme

| Clé | Maturité | Note |
|---|---|---|
| `commerce.payments` | L3 (actif) | `/admin/commerce/payments`, liste paiements réelle |
| `commerce.documents` | L3 (inactif par défaut) | 2026-06-14 : `FeatureFlag` seedé (`prisma/seed/documents-feature-flag.seed.ts`, DRAFT, non gradué) — corrige l'écart « code prêt mais inaccessible ». Génération "confirmation de commande" **et** "bon de préparation" (`DELIVERY_NOTE`, même pattern : `documentNumber` null, un actif par commande) utilisables une fois activé via `/admin/settings/advanced`. Pas de génération PDF réelle, schéma inchangé. `INVOICE`/`CREDIT_NOTE` réservés au chantier factures |
| `commerce.discounts` | L3 (inactif par défaut, niveau `simple`) | 2026-06-13 : `/admin/marketing/discounts` remplace `AdminComingSoon` — CRUD `Discount` (création + activation/désactivation), PERCENTAGE/FIXED_AMOUNT, scope ORDER. Aucun effet panier/checkout (`discountAmount` reste à 0). Niveaux `rules`/`automation` (autres scopes, FREE_SHIPPING, codes, automatisation) non implémentés |
| `commerce.shipping` | L3 (actif par défaut) | 2026-06-13 : `/admin/commerce/shipping` remplacé par une vue de suivi des `Shipment` (filtrable par statut, lien commande) ; action "Marquer comme expédiée" capture `carrier`/`trackingUrl` ; nouvelle action "Marquer comme livrée" (`SHIPPED → DELIVERED`, `deliveredAt`). Toujours pas d'intégration transporteur (saisie manuelle uniquement) |
| `commerce.fulfillment` | L3 (inactif par défaut) | 2026-06-14 : préparation logistique V1 (`features/admin/commerce/fulfillment/*`) — création « tout ou rien », transitions PENDING→READY→FULFILLED/CANCELLED, carte dans le détail commande, gated. Indépendant de l'expédition, sans impact stock. Reste : partiel, lien shipment, inventaire |
| `commerce.returns` | L3 (inactif par défaut) | 2026-06-14 : retours V1 (`features/admin/commerce/returns/*`) — demande commande entière, workflow REQUESTED→…→CLOSED avec décisions, réf `RET-…`, carte dans le détail commande, gated. `REFUNDED` déclaratif, sans remboursement ni restock. Reste : sélection lignes, avoir, inventaire, client |
| `commerce.taxation` | L3 (inactif par défaut) | 2026-06-14 : moteur TVA par territoire (métropole + DOM). `entities/tax/*` (détermination territoire CP + ventilation TTC→HT/TVA, testés), `features/commerce/taxation/queries/resolve-tax-rate`, câblage checkout (`order.repository`, capture `taxRatePercent`/`taxTerritory` par ligne + `taxAmount`), seed taux FR/DOM, UI admin lecture `/admin/commerce/taxation`, gating `FeatureFlag`. Cf. `docs/lots/2026-06-14-commerce-taxation-cadrage.md`. Reste : formulaire création/édition règles, OSS UE / export, e-reporting |
| `satellite.search` | L3 (inactif par défaut, lecture seule) | 2026-06-14 : `FeatureFlag` seedé (`prisma/seed/search-feature-flag.seed.ts`, DRAFT). Page discrète `/admin/settings/search` avec lecture admin de `SearchDocument` (compteurs + dernières entrées). Aucun moteur externe, aucune indexation automatique, aucune recherche storefront dans ce lot |
| `satellite.channels` | L3 (inactif par défaut, lecture seule) | 2026-06-14 : `FeatureFlag` seedé (`prisma/seed/channels-feature-flag.seed.ts`, DRAFT). Page discrète `/admin/settings/channels` avec lecture admin de `Channel`, `ChannelProductStatus` et `ChannelVariantStatus`. Aucun provider externe, aucune synchronisation, aucune publication dans ce lot |

## 4. Synthèse

- **L3 fonctionnel** : 24/32 (core catalogue produit, content/maintenance, commerce.payments, commerce.documents, commerce.products.related, commerce.shipping, commerce.discounts [niveau `simple`, inactif par défaut], engagement.analytics [périmètre commerce, inactif par défaut], engagement.newsletter [niveau `basic`, inactif par défaut], engagement.automations [référentiel admin, inactif par défaut], platform.notifications [lecture admin, inactif par défaut], satellite.search [lecture admin, inactif par défaut], satellite.channels [lecture admin, inactif par défaut], platform.integrations [lecture admin, inactif par défaut], platform.webhooks [lecture admin, sémantique à clarifier])
- **L2 mock** : 1/32 (localization en pause)
- **L1 placeholder (Coming Soon)** : 0/32
- **L0 catalogué sans code** : 1/32 (`ai.core`) — `commerce.taxation`, `commerce.fulfillment`, `commerce.returns`, `platform.notifications`, `satellite.search`, `satellite.channels`, `platform.integrations` et `platform.webhooks` faits le 2026-06-14
- **Niveaux annoncés non câblés** : catalog.products.inventory (`alerts` câblé le 2026-06-13, `forecasting` restant), catalog.products.media (`optimization` câblé le 2026-06-13, `generation`/`automation` restants)

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

**`engagement.analytics` (2026-06-13)** : clarification faite, cf.
`docs/lots/2026-06-13-engagement-analytics-cadrage.md`. Décision validée :
périmètre réduit à `commerce` (`Order`/`Customer`, déjà `core`/actifs) ; le
bloc nécessitant un pipeline de tracking (« Aujourd'hui vs hier ») reste mock
et hors périmètre. « Analytics complexes » reste exclu sans validation
ultérieure. `ai.core` reste non ouvert.

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
3. ~~**Combler l'écart niveaux déclarés/câblés** sur `catalog.products.inventory`
   (alerts) et `catalog.products.media` (optimization) — petits lots, dans le
   socle existant.~~ **Fait (2026-06-13)**, cf.
   `docs/lots/2026-06-13-inventory-media-levels-cadrage.md`.
4. ~~**Brancher `engagement.analytics` sur Prisma** (remplacer les mocks par
   `AnalyticsMetric`/`AnalyticsSnapshot`) — débloque aussi le sens réel de
   `insights.analyticsRead`.~~ **Fait (2026-06-13), périmètre réduit**, cf.
   `docs/lots/2026-06-13-engagement-analytics-cadrage.md`. Bloc « Ce mois »
   branché sur `Order`/`Customer` réels (lecture live, non historisée) ; bloc
   « Aujourd'hui vs hier » reste mock (tracking absent, hors périmètre) ;
   `AnalyticsMetric`/`AnalyticsSnapshot` restent non alimentés.
   `insights.analyticsRead` continue de gouverner l'accès à la page, sans
   changement de sémantique au-delà de sa dépendance déclarative.
5. **Modules L1 → L3** : ~~`commerce.discounts`~~ **fait (2026-06-13)**, cf.
   `docs/lots/2026-06-13-commerce-discounts-cadrage.md` — admin CRUD niveau
   `simple` (PERCENTAGE/FIXED_AMOUNT, scope ORDER), inactif par défaut, sans
   effet panier/checkout. ~~`engagement.newsletter`~~ **fait (2026-06-13)**,
   cf. `docs/lots/2026-06-13-engagement-newsletter-automations-cadrage.md` —
   admin CRUD `NewsletterSubscriber` niveau `basic` (ajout + bascule
   SUBSCRIBED/UNSUBSCRIBED), inactif par défaut, sans campagne. Reste :
   `engagement.automations` — désormais seedé, documenté et branché sur un
   référentiel admin de définitions, avec schéma minimal de définition
   (`docs/domains/cross-cutting/automations.md`,
   `docs/lots/2026-06-14-engagement-automations-cadrage.md`,
   `docs/lots/2026-06-14-engagement-automations-schema-cadrage.md`,
   `docs/lots/2026-06-14-engagement-automations-crud-cadrage.md`) ; la
   prochaine marche reste le vrai lot d'implémentation métier :
   branchement aux événements source et frontière d'exécution
   `workflow`/`jobs`/`newsletter`.
6. **Modules L0** : `commerce.documents` — **activation + `DELIVERY_NOTE` faits
   (2026-06-14)**, cf. `docs/lots/2026-06-13-commerce-documents-cadrage.md`
   (option A1 seed seul, puis A2 bon de préparation). **Facture V1 faite
   (2026-06-14)** : `commerce.taxation` (prérequis TVA) + `INVOICE` (numérotation
   `DocumentCounter`, snapshot légal, émission, PDF), cf.
   `docs/lots/2026-06-14-commerce-factures-cadrage.md`. Reste : `CREDIT_NOTE`
   (avoir), Factur-X / e-reporting. **`commerce.fulfillment` fait V1
   (2026-06-14)** : préparation « tout ou rien », indépendante de l'expédition,
   sans impact stock, gated, cf.
   `docs/lots/2026-06-14-commerce-fulfillment-cadrage.md`. **`commerce.returns`
   fait V1 (2026-06-14)**. **`platform.notifications` fait V1 lecture admin
   (2026-06-14)** : seed du flag + lecture admin du referentiel sur
   `/admin/settings/notifications`, cf.
   `docs/lots/2026-06-14-platform-notifications-cadrage.md`. **`satellite.search`
   fait V1 lecture admin (2026-06-14)** : seed du flag + lecture admin du
   referentiel `SearchDocument` sur `/admin/settings/search`, cf.
   `docs/lots/2026-06-14-satellite-search-cadrage.md`. **`satellite.channels`
   fait V1 lecture admin (2026-06-14)** : seed du flag + lecture admin du
   referentiel `Channel` / `ChannelProductStatus` / `ChannelVariantStatus` sur
   `/admin/settings/channels`, cf.
   `docs/lots/2026-06-14-satellite-channels-cadrage.md`. **`platform.integrations`
   fait V1 lecture admin (2026-06-14)** : seed du flag + lecture admin du
   referentiel `Integration` / `IntegrationCredential` / `IntegrationSyncState`
   sur `/admin/settings/integrations`, cf.
   `docs/lots/2026-06-14-platform-integrations-cadrage.md`. **`platform.webhooks`
   fait V1 lecture admin (2026-06-14)** : seed du flag + lecture admin du
   referentiel `WebhookEndpoint` / `WebhookDelivery` sur
   `/admin/settings/webhooks`, avec divergence doctrine/modele explicitement
   documentee, cf. `docs/lots/2026-06-14-platform-webhooks-cadrage.md`.
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
