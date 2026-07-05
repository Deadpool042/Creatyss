# H4 — Plateforme et automatisation

## Objectif métier

Étendre la boutique vers des capacités de plateforme : webhooks sortants pour les intégrations tierces, synchronisation catalogue vers Google/Meta, recherche storefront, multilangue généralisé et IA branchée sur un provider réel. Une base Prisma et admin de lecture existe déjà pour plusieurs de ces modules, tandis que `platform.localization` et certaines surfaces IA sont plus avancées ; leur activation métier complète constitue cet horizon.

---

## État au 2026-07-05

### Observé comme terminé (base)

- `platform.webhooks` L3 gradué : seed, page admin `/admin/settings/webhooks`, lecture `WebhookEndpoint`/`WebhookDelivery`, gestion endpoints et relance delivery derrière niveaux `read`/`manage`/`retry` — observé
- `platform.integrations` L3 lecture seule : seed, page admin `/admin/settings/integrations`, lecture `Integration`/`IntegrationCredential`/`IntegrationSyncState` — observé
- `satellite.channels` L3 lecture seule : seed, page admin `/admin/settings/channels`, lecture `Channel`/`ChannelProductStatus`/`ChannelVariantStatus` — observé
- `satellite.search` L3 lecture seule : seed, page admin `/admin/settings/search`, lecture `SearchDocument` — observé
- `platform.localization` L3 complet : routing localisé, hreflang, sitemap, sélecteur langue — observé
- `ai.core` L3 : niveaux `basic`/`assistant`/`advanced`/`automation` câblés sur SEO produit et blog — observé

### Observé comme non terminé

- `platform.integrations` : aucun adaptateur provider concret — observé
- `satellite.channels` : aucune synchronisation vers Google/Meta — observé
- `satellite.search` : aucun moteur de recherche storefront — observé
- `platform.localization` : généralisation `LocalizedValue` observée sur `homepage`, `product-page-copy`, `boutique-page-copy`, pages de contenu (`contact`, `a-propos`, `les-marches`) et blog (`title`, `excerpt`, `content`) ; restent hors pilote les vrais champs métier produit
- `ai.core` : aucun provider SDK réel branché — observé

---

## Dépendances

- H1 et H2 : catalogue stable et commerce fiable avant d'exposer des webhooks ou des canaux de distribution
- Credentials OAuth Google/Meta pour `lot-channels-google-meta`
- Clé API provider AI (Anthropic ou autre) pour `lot-ai-sdk-provider`
- Décision produit sur le premier provider pour `lot-integrations-providers`
- Décision sur le moteur de recherche (PostgreSQL FTS vs Algolia) pour `lot-search-storefront`

---

## Lots

| Fichier                                                          | Description                                                               | Statut                                                                          |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [lot-webhooks-sortants.md](./lot-webhooks-sortants.md)           | Livraison webhook sortante avec signature HMAC et retry                   | Terminé — 2026-07-05                                                            |
| [lot-integrations-providers.md](./lot-integrations-providers.md) | Brancher un premier adaptateur concret sur le modèle Integration          | A faire                                                                         |
| [lot-channels-google-meta.md](./lot-channels-google-meta.md)     | Synchroniser le catalogue vers Google Merchant Center ou Meta Catalog     | A faire                                                                         |
| [lot-search-storefront.md](./lot-search-storefront.md)           | Recherche full-text dans le storefront                                    | A faire                                                                         |
| [lot-multilangue-generalise.md](./lot-multilangue-generalise.md) | Étendre la généralisation `LocalizedValue` au-delà des pilotes déjà faits | En cours — blog branché, champs métier produit restants                                |
| [lot-ai-sdk-provider.md](./lot-ai-sdk-provider.md)               | Brancher un SDK AI réel sur le modèle AiProvider                          | A faire                                                                         |

Tous ces lots sont relativement indépendants entre eux et peuvent être priorisés selon la valeur métier perçue. `lot-multilangue-generalise` dispose déjà de pilotes observés et peut se poursuivre dès que la prochaine cible de contenu est tranchée. `lot-webhooks-sortants` bénéficie d'un catalogue stable (H2 recommandé).

---

## Risques

- APIs tierces (Google, Meta, Stripe Webhooks) sujettes à des changements de version et de politique
- Synchronisation asynchrone catalogue → canaux : la cohérence entre le catalogue Prisma et l'état du canal externe est non triviale
- Algolia pour la recherche : dépendance externe avec coût récurrent — PostgreSQL FTS est une alternative viable pour le volume d'une boutique artisanale
- RGPD si certaines futures activations H4 croisent données comportementales, recherche ou IA avec des identifiants exploitables

---

## Éléments reportables sans bloquer la valeur métier

- Marketplace d'intégrations et SDK tiers multiples
- Publicité payante et enchères automatiques (Google Ads, Meta Ads)
- Recherche facettée avancée et auto-complétion
- Traduction automatique (machine translation) et workflow collaboratif
- Assistant IA global et auto-génération de contenu
