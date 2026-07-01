# H3 — Administration avancée

## Objectif métier

Enrichir le back-office pour qu'il soit pleinement exploitable au quotidien par une non-technicienne : historique clients complet, gestion des codes promo avancée, campagnes newsletter, automations avec worker réel, analytics branchés sur un tracking minimal et settings manquants. Cet horizon consolide la valeur de l'administration sans toucher au parcours achat.

---

## État au 2026-06-25

### Observé comme terminé (base H3)

- `engagement.newsletter` L3 : CRUD `NewsletterSubscriber`, souscription storefront idempotente, niveaux `basic`/`segmentation`/`automation` câblés — observé dans `2026-06-13-audit-catalogue-modules.md`
- `engagement.automations` L3 borné : boucle `NEWSLETTER_SUBSCRIBED → EMAIL_MESSAGE`, worker manuel, gestion jobs (annulation, relance, batch), cockpit admin complet — observé
- `commerce.discounts` L3 : remises `simple`/`rules`/`automation`, `FREE_SHIPPING`, ciblage catalogue, `DiscountCode` secondaires — observé
- `insights.analyticsRead` L3 : bloc "Ce mois" branché sur commandes/clients réels — observé

### Observé comme non terminé

- `commerce.customers` : base admin dédiée observée (liste, détail, commandes, consentements, export RGPD), mais CRM avancé non observé (`CrmContact`, `CrmTag`, segmentation)
- `engagement.newsletter` : `NewsletterCampaign`/`NewsletterCampaignRecipient` non alimentés, pas d'envoi réel — observé
- `engagement.automations` : route cron `POST /api/cron/run-automation-jobs` + `runAutomationJobsBatch` observés — scope étendu à `NEWSLETTER_SUBSCRIBED` et `ORDER_PLACED` (batch, exécution, admin) le 2026-07-01 ; activation production (CRON_SECRET + cron externe) non configurée ; `maxAttempts` reste à `1` pour les deux types (aucun retry automatique), extension conditionnelle à une décision produit
- `engagement.analytics` : bloc "Aujourd'hui vs hier" mock, tracking absent — observé
- Settings admin : `orders`, `catalog` et `media` observés ; `customers` reste un `AdminComingSoon` assumé, renvoyant vers le lot clients

---

## Dépendances

- H2 suffisamment stabilisé côté commandes et checkout pour supporter l'historique client et les futurs déclencheurs `order_created`
- Provider email transactionnel configuré en production (requis pour les campagnes newsletter)

---

## Lots

| Fichier                                                                    | Description                                                                    | Statut                                                                                                              |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| [lot-clients-historique-crm.md](./lot-clients-historique-crm.md)           | Base clients admin — historique commandes, consentements et export RGPD        | Livré — 2026-06-25                                                                                                  |
| [lot-discounts-backoffice-avance.md](./lot-discounts-backoffice-avance.md) | Back-office DiscountCode dédié, édition de priorité, visualisation redemptions | Livré — 2026-06-25                                                                                                  |
| [lot-newsletter-campagnes.md](./lot-newsletter-campagnes.md)               | Créer et envoyer des campagnes newsletter réelles                              | A faire                                                                                                             |
| [lot-automations-worker-general.md](./lot-automations-worker-general.md)   | Worker/scheduler général pour exécuter les jobs automatiquement                | En cours — NEWSLETTER_SUBSCRIBED + ORDER_PLACED couverts (2026-07-01), activation prod et politique retry restantes |
| [lot-analytics-tracking-reel.md](./lot-analytics-tracking-reel.md)         | Brancher le bloc "Aujourd'hui vs hier" sur un pipeline tracking minimal        | A faire                                                                                                             |
| [lot-settings-manquants.md](./lot-settings-manquants.md)                   | Ouvrir les sections settings orders, catalog, customers et media               | Terminé — customers reste volontairement en stub                                                                    |

`lot-newsletter-campagnes` nécessite un provider email. `lot-automations-worker-general` nécessite un socle H2 suffisamment stabilisé pour les déclencheurs `order_created`. `lot-analytics-tracking-reel` nécessite une décision produit préalable.

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
