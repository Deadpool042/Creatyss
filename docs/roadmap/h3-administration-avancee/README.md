# H3 — Administration avancée

## Objectif métier

Enrichir le back-office pour qu'il soit pleinement exploitable au quotidien par une non-technicienne : historique clients complet, gestion des codes promo avancée, campagnes newsletter, automations avec worker réel, analytics branchés sur un tracking minimal et réglages admin cohérents. Cet horizon consolide la valeur de l'administration sans toucher au parcours achat.

---

## État au 2026-07-02

### Observé comme terminé (base H3)

- `engagement.newsletter` L3 : CRUD `NewsletterSubscriber`, souscription storefront idempotente, niveaux `basic`/`segmentation`/`automation` câblés — observé dans `2026-06-13-audit-catalogue-modules.md`
- `engagement.automations` L3 borné : boucle `NEWSLETTER_SUBSCRIBED → EMAIL_MESSAGE`, worker manuel, gestion jobs (annulation, relance, batch), cockpit admin complet — observé
- `commerce.discounts` L3 : remises `simple`/`rules`/`automation`, `FREE_SHIPPING`, ciblage catalogue, `DiscountCode` secondaires — observé
- `insights.analyticsRead` L3 : bloc "Ce mois" branché sur commandes/clients réels — observé

### Observé comme livré côté code

- `commerce.customers` : base admin dédiée livrée (liste, détail, commandes, consentements, export RGPD) ; CRM avancé (`CrmContact`, `CrmTag`, segmentation) reporté hors H3 livrable
- `engagement.newsletter` : campagnes réelles livrées (création, prévisualisation, envoi avec invariants RGPD, suivi recipients) au 2026-07-02, recette Mailpit locale validée — cf. `lot-newsletter-campagnes.md`
- `engagement.automations` : route cron `POST /api/cron/run-automation-jobs` + `runAutomationJobsBatch` observés — scope étendu à `NEWSLETTER_SUBSCRIBED` et `ORDER_PLACED` (batch, exécution, admin) le 2026-07-01 ; activation production (`CRON_SECRET` + cron externe) reportée au runbook VPS ; `maxAttempts` reste à `1` pour les deux types, retry automatique conditionnel à une décision produit
- `engagement.analytics` : bloc "Aujourd'hui vs hier" branché sur tracking réel anonyme sans cookie (2026-07-02) — cf. `lot-analytics-tracking-reel.md`
- Settings admin : les réglages domaine observés sont relocalisés sous leur domaine métier (`orders`, `payments`, `shipping`, `customers`, `catalog`, `media`) avec routes de compatibilité sous `/admin/settings/*` ; le hub `/admin/settings` reste réservé aux réglages transverses purs et est généré depuis `adminNavigationItems`

### Restant hors H3 code

- Activation production des trois crons internes (automations, webhooks sortants, scan panier abandonné) : définir `CRON_SECRET` et configurer les crons externes sur le VPS — runbook à jour dans `docs/exploitation/07-cron-automations.md` (2026-07-06, couvre désormais les trois routes)
- Retry automatique `ORDER_PLACED` : décision produit préalable requise avant toute hausse de `maxAttempts`

---

## Dépendances

- H2 suffisamment stabilisé côté commandes et checkout pour supporter l'historique client et les futurs déclencheurs `order_created`
- Provider email transactionnel configuré en production (requis pour les campagnes newsletter)

---

## Lots

| Fichier                                                                    | Description                                                                    | Statut                                                                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [lot-clients-historique-crm.md](./lot-clients-historique-crm.md)           | Base clients admin — historique commandes, consentements et export RGPD        | Livré — 2026-06-25                                                                              |
| [lot-discounts-backoffice-avance.md](./lot-discounts-backoffice-avance.md) | Back-office DiscountCode dédié, édition de priorité, visualisation redemptions | Livré — 2026-06-25                                                                              |
| [lot-newsletter-campagnes.md](./lot-newsletter-campagnes.md)               | Créer et envoyer des campagnes newsletter réelles                              | Livré — 2026-07-02 (code + revue + recette Mailpit locale)                                      |
| [lot-automations-worker-general.md](./lot-automations-worker-general.md)   | Worker/scheduler général pour exécuter les jobs automatiquement                | Livré côté code — activation prod VPS + retry ORDER_PLACED conditionnels                        |
| [lot-analytics-tracking-reel.md](./lot-analytics-tracking-reel.md)         | Brancher le bloc "Aujourd'hui vs hier" sur un pipeline tracking minimal        | Livré — 2026-07-02 (anonyme sans cookie, recette locale)                                        |
| [lot-settings-manquants.md](./lot-settings-manquants.md)                   | Ouvrir et relocaliser les réglages domaine, resynchroniser le hub settings     | Terminé — routes domaine + redirects de compatibilité + hub settings resynchronisé (2026-07-02) |
| [lot-gift-cards.md](./lot-gift-cards.md)                                   | Activer le domaine cartes cadeaux (émission, consommation au paiement)         | A faire — Prisma posé et documenté, jamais scopé jusqu'ici (audit 2026-07-23)                   |
| [lot-loyalty.md](./lot-loyalty.md)                                         | Activer le domaine fidélité (points, paliers, récompenses)                     | A faire — Prisma posé et documenté, jamais scopé jusqu'ici (audit 2026-07-23)                   |
| [lot-subscriptions.md](./lot-subscriptions.md)                             | Activer le domaine abonnements (souscription, renouvellement, résiliation)     | A faire — Prisma posé et documenté, jamais scopé jusqu'ici (audit 2026-07-23)                   |
| [lot-recommendations.md](./lot-recommendations.md)                         | Activer le domaine recommandations gouvernées, distinct de `products.related`  | A faire — Prisma posé et documenté, jamais scopé jusqu'ici (audit 2026-07-23)                   |
| [lot-support-tickets.md](./lot-support-tickets.md)                         | Formaliser le domaine support (tickets, conversations, assignation)            | A faire — Prisma posé et documenté, jamais scopé jusqu'ici (audit 2026-07-23)                   |
| [lot-workflow-multi-etapes.md](./lot-workflow-multi-etapes.md)             | Formaliser le domaine workflow multi-étapes (définitions, instances)           | A faire — Prisma posé et documenté, jamais scopé jusqu'ici (audit 2026-07-23)                   |
| [lot-import-masse.md](./lot-import-masse.md)                               | Formaliser le domaine import de masse structuré et gouverné                    | A faire — Prisma posé et documenté, jamais scopé jusqu'ici (audit 2026-07-23)                   |
| [lot-export-masse.md](./lot-export-masse.md)                               | Formaliser le domaine export de masse, distinct de l'export RGPD ad-hoc        | A faire — Prisma posé et documenté, jamais scopé jusqu'ici (audit 2026-07-23)                   |
| [lot-workflow-approbation.md](./lot-workflow-approbation.md)               | Formaliser le domaine approbation (demandes, décisions, blocage préalable)     | A faire — Prisma posé et documenté, jamais scopé jusqu'ici (audit 2026-07-23)                   |
| [lot-bundles.md](./lot-bundles.md)                                         | Activer le domaine bundles (compositions commerciales de produits)             | A faire — Prisma posé et documenté, jamais scopé jusqu'ici (audit 2026-07-23)                   |
| [lot-gifting.md](./lot-gifting.md)                                         | Activer le domaine gifting (contexte cadeau d'une commande)                    | A faire — Prisma posé et documenté, jamais scopé jusqu'ici (audit 2026-07-23)                   |
| [lot-reviews.md](./lot-reviews.md)                                         | Activer le domaine avis clients — aucun modèle Prisma existant à ce jour       | A faire — documenté, aucun socle Prisma, jamais scopé jusqu'ici (audit 2026-07-23)              |
| [lot-wishlist.md](./lot-wishlist.md)                                       | Clarifier/activer le domaine wishlist face au mécanisme `favorites` existant   | A faire — documenté, aucun socle Prisma dédié, jamais scopé jusqu'ici (audit 2026-07-23)        |
| [lot-marketplace.md](./lot-marketplace.md)                                 | Décision stratégique d'activation du domaine marketplace                       | A faire — documenté, aucun socle Prisma, jamais scopé jusqu'ici (audit 2026-07-23)              |

`lot-newsletter-campagnes` nécessite un provider email en production. `lot-automations-worker-general` nécessite une activation VPS explicite (`CRON_SECRET` + cron externe). Le retry automatique `ORDER_PLACED` reste conditionnel à une décision produit. `lot-gift-cards` et `lot-loyalty` nécessitent une décision produit préalable sur la priorité et le barème métier avant tout cadrage détaillé — placés en H3 par proximité avec les autres enrichissements back-office (`discounts`, CRM), pas une classification stricte. Les lots ajoutés le 2026-07-23 (`subscriptions`, `recommendations`, `support-tickets`, `workflow-multi-etapes`, `import-masse`, `export-masse`, `workflow-approbation`, `bundles`, `gifting`, `reviews`, `wishlist`, `marketplace`) suivent le même principe de placement en H3 par proximité fonctionnelle, sans classification stricte ; certains (`reviews`, `wishlist`, `marketplace`) n'ont aucun schéma Prisma existant, contrairement aux autres lots de cette liste.

---

## Risques

- RGPD : `lot-clients-historique-crm` touche au consentement — implications légales à valider si applicable
- Worker général : processus long — gestion des crashes, monitoring et alertes à prévoir
- Analytics tracking : RGPD si tracking comportemental — consentement requis
- Newsletter : réputation d'envoi dépend de la configuration SPF/DKIM/DMARC du domaine

---

## Éléments reportables sans bloquer la valeur métier

- CRM avancé (`CrmContact`/`CrmTag`), segmentation comportementale, support tickets
- A/B testing newsletter et analytics email avancés
- Workflows multi-étapes et retry policies avancées pour les automations
- Analytics complexes, entonnoirs de conversion, heatmaps
