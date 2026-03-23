# Domaines du socle — Vue d'ensemble

Ce dossier contient une fiche par domaine métier ou transverse du socle e-commerce.

**Source de vérité doctrinale** : [`docs/architecture/`](../architecture/) — lire en priorité les fichiers `00` à `11` avant d'interpréter les fiches de ce dossier.

---

## Hiérarchie documentaire

Tous les fichiers de `docs/domains/` ne sont pas du même rang **documentaire**.
La structure distingue quatre catégories explicites :

| Catégorie | Signification | Dossier |
|---|---|---|
| **core** | Domaines coeur — présents dans tous les projets, toggleables uniquement au niveau de leurs capabilities internes | `core/` |
| **optional** | Domaines optionnels — activés uniquement si un besoin métier réel le justifie | `optional/` |
| **satellites** | Spécialisations et docs satellites — rattachées à un domaine coeur parent | `satellites/` |
| **cross-cutting** | Concerns transverses — s'appliquent horizontalement à plusieurs domaines | `cross-cutting/` |

---

## Distinction rang documentaire / criticité architecturale

Cette classification est une **organisation documentaire**, pas un jugement de criticité.

Le rang documentaire indique comment une fiche est rattachée à la structure du socle.
La criticité architecturale indique si un sujet est non-toggleable ou structurellement indispensable.

Ces deux dimensions sont indépendantes.

**En particulier** : certains fichiers de `cross-cutting/` couvrent des sujets considérés comme **coeur non toggleables** par [`docs/architecture/03`](../architecture/03-core-domains-and-toggleable-capabilities.md). C'est notamment le cas de `audit`, `observability` et `jobs`.

Ils sont documentés dans `cross-cutting/` parce qu'ils sont de nature **transverse** — ils s'appliquent à tous les domaines, sans appartenir à un domaine métier commercial vertical en particulier. Leur criticité architecturale n'en est pas diminuée.

Se référer à [`docs/architecture/03`](../architecture/03-core-domains-and-toggleable-capabilities.md) pour la grille officielle de classification architecturale.

---

## core/

Domaines structurellement indispensables. Présents dans tous les projets, toggleables uniquement au niveau de leurs capabilities internes.

Référence doctrine : [`docs/architecture/03`](../architecture/03-core-domains-and-toggleable-capabilities.md)

### Structure et identité

- [`auth.md`](core/auth.md)
- [`users.md`](core/users.md)
- [`roles.md`](core/roles.md)
- [`permissions.md`](core/permissions.md)
- [`api-clients.md`](core/api-clients.md)

### Commerce coeur

- [`stores.md`](core/stores.md) — domaine canonique (ancien `store.md`)
- [`customers.md`](core/customers.md)
- [`products.md`](core/products.md)
- [`pricing.md`](core/pricing.md)
- [`availability.md`](core/availability.md) — domaine canonique de disponibilité
- [`cart.md`](core/cart.md)
- [`checkout.md`](core/checkout.md)
- [`orders.md`](core/orders.md)
- [`payments.md`](core/payments.md)
- [`taxation.md`](core/taxation.md)
- [`shipping.md`](core/shipping.md)
- [`documents.md`](core/documents.md)

### Infrastructure coeur

- [`domain-events.md`](core/domain-events.md)
- [`integrations.md`](core/integrations.md)
- [`webhooks.md`](core/webhooks.md)

---

## optional/

Domaines activés uniquement si un besoin métier réel le justifie. Leur absence ne casse pas le coeur du commerce.

Référence doctrine : [`docs/architecture/03`](../architecture/03-core-domains-and-toggleable-capabilities.md) — section "Domaines optionnels toggleables"

### Commerce enrichi

- [`returns.md`](optional/returns.md)
- [`gift-cards.md`](optional/gift-cards.md)
- [`subscriptions.md`](optional/subscriptions.md)
- [`marketplace.md`](optional/marketplace.md)
- [`wishlist.md`](optional/wishlist.md)
- [`loyalty.md`](optional/loyalty.md)

### Contenu et acquisition

- [`blog.md`](optional/blog.md)
- [`homepage-editorial.md`](optional/homepage-editorial.md)
- [`reviews.md`](optional/reviews.md)
- [`pages.md`](optional/pages.md)

### Enrichissement et IA

- [`recommendations.md`](optional/recommendations.md)
- [`ai-assistance.md`](optional/ai-assistance.md)

---

## satellites/

Spécialisations et docs satellites rattachées à un domaine coeur parent. Ces fichiers approfondissent un domaine coeur ou une capability précise. Ils n'ont pas d'autonomie de premier rang : leur périmètre est subordonné à leur domaine parent.

| Fichier satellite | Domaine coeur parent |
|---|---|
| [`categories.md`](satellites/categories.md) | `products` |
| [`catalog-modeling.md`](satellites/catalog-modeling.md) | `products` |
| [`bundles.md`](satellites/bundles.md) | `products` |
| [`media.md`](satellites/media.md) | `products` |
| [`channels.md`](satellites/channels.md) | `products` + `integrations` |
| [`inventory.md`](satellites/inventory.md) | `availability` — voir note de fichier |
| [`discounts.md`](satellites/discounts.md) | `pricing` — voir note de fichier |
| [`sales-policy.md`](satellites/sales-policy.md) | `pricing` + `availability` |
| [`fulfillment.md`](satellites/fulfillment.md) | `orders` + `shipping` |
| [`gifting.md`](satellites/gifting.md) | `cart` + `checkout` |

---

## cross-cutting/

Concerns transverses — ces sujets s'appliquent **horizontalement** à plusieurs domaines. Ils ne sont pas des domaines métier commerciaux verticaux.

**Attention** : cette catégorie documentaire ne dit rien sur la criticité. Certains sujets listés ici sont **non-toggleables architecturalement** (voir tableau ci-dessous). D'autres sont des supports d'exploitation, de conformité ou de diffusion.

| Sujet | Criticité architecturale |
|---|---|
| `audit` | Non-toggleable — voir [`architecture/03`](../architecture/03-core-domains-and-toggleable-capabilities.md) |
| `observability` | Non-toggleable — voir [`architecture/03`](../architecture/03-core-domains-and-toggleable-capabilities.md) |
| `jobs` | Non-toggleable — voir [`architecture/03`](../architecture/03-core-domains-and-toggleable-capabilities.md) |
| autres | Variable — toggleable ou activable selon le projet |

Référence doctrine :
- [`docs/architecture/03`](../architecture/03-core-domains-and-toggleable-capabilities.md) — classification officielle des domaines
- [`docs/architecture/08`](../architecture/08-domain-events-jobs-and-async-flows.md) — events, jobs, async
- [`docs/architecture/09`](../architecture/09-integrations-providers-and-external-boundaries.md) — frontières externes
- [`docs/architecture/10`](../architecture/10-data-lifecycle-and-governance.md) — gouvernance et cycle de vie

### Exploitation et observabilité ⚠️ structurants

Ces sujets sont **non-toggleables** per `architecture/03` malgré leur nature transverse.

- [`audit.md`](cross-cutting/audit.md)
- [`observability.md`](cross-cutting/observability.md)
- [`jobs.md`](cross-cutting/jobs.md)

### Exploitation étendue

- [`monitoring.md`](cross-cutting/monitoring.md)
- [`analytics.md`](cross-cutting/analytics.md)
- [`dashboarding.md`](cross-cutting/dashboarding.md)
- [`events.md`](cross-cutting/events.md)
- [`scheduling.md`](cross-cutting/scheduling.md)

### Processus et gouvernance

- [`workflow.md`](cross-cutting/workflow.md)
- [`approval.md`](cross-cutting/approval.md)
- [`feature-flags.md`](cross-cutting/feature-flags.md)
- [`export.md`](cross-cutting/export.md)
- [`import.md`](cross-cutting/import.md)

### Conformité et légal

- [`legal.md`](cross-cutting/legal.md)
- [`consent.md`](cross-cutting/consent.md)
- [`localization.md`](cross-cutting/localization.md)
- [`fraud-risk.md`](cross-cutting/fraud-risk.md)

### Découvrabilité et expérience

- [`search.md`](cross-cutting/search.md)
- [`seo.md`](cross-cutting/seo.md)
- [`template-system.md`](cross-cutting/template-system.md)

### Marketing, CRM et diffusion

- [`marketing.md`](cross-cutting/marketing.md)
- [`crm.md`](cross-cutting/crm.md)
- [`newsletter.md`](cross-cutting/newsletter.md)
- [`email.md`](cross-cutting/email.md)
- [`social.md`](cross-cutting/social.md)
- [`notifications.md`](cross-cutting/notifications.md)

### Données comportementales et attribution

- [`tracking.md`](cross-cutting/tracking.md)
- [`attribution.md`](cross-cutting/attribution.md)
- [`conversion.md`](cross-cutting/conversion.md)
- [`behavior.md`](cross-cutting/behavior.md)

### Support et relation client

- [`support.md`](cross-cutting/support.md)

---

## Fichiers à la racine

- [`_template.md`](./_template.md) — gabarit de fiche domaine, à utiliser pour toute nouvelle fiche

---

## Règles d'utilisation

1. **Rang documentaire ≠ criticité architecturale.** Un sujet en `cross-cutting/` peut être non-toggleable et structurellement indispensable.
2. **La classification architecturale officielle** est dans [`docs/architecture/03`](../architecture/03-core-domains-and-toggleable-capabilities.md), pas dans ce README.
3. **Ne pas promouvoir un satellite en domaine coeur** sans revue de la doctrine architecture.
4. **Ne pas créer un nouveau fichier flat à la racine** — choisir la catégorie adaptée.
5. **Un domaine optionnel ne contamine pas le coeur** quand il est absent.
6. **Tout nouveau domaine** doit d'abord être classé avant d'être documenté.
