# Audit de migration des domaines

## Objectif

Ce document suit la migration et le réalignement de `docs/domains/` avec la doctrine canonique définie dans `docs/architecture/`.

Il sert à :

- repérer les documents encore contradictoires ;
- documenter les arbitrages de classement ou de frontière ;
- identifier ce qui reste à migrer ;
- éviter les requalifications implicites ou incohérentes.

Ce document n’est pas une source de vérité doctrinale autonome.
La doctrine reste portée par `docs/architecture/`.

---

## Référentiel canonique

Les documents de référence pour arbitrer une migration sont :

- `../architecture/README.md`
- `../architecture/00-introduction/00-vue-d-ensemble-du-systeme.md`
- `../architecture/00-introduction/01-glossaire.md`
- `../architecture/00-introduction/02-guide-de-lecture.md`
- `../architecture/10-fondations/10-principes-d-architecture.md`
- `../architecture/10-fondations/11-modele-de-classification.md`
- `../architecture/10-fondations/12-frontieres-et-responsabilites.md`

En cas de conflit :

- `docs/architecture/` fait autorité ;
- ce registre documente l’état de migration ;
- les fiches domaine migrées appliquent la doctrine courante.

---

## État global de migration

### Phase 1 — Gouvernance documentaire

Statut : `fait`

Livré :

- `docs/domains/README.md`
- `docs/domains/_template.md`

Objectif atteint :

- taxonomie documentaire stabilisée ;
- relation `docs/architecture/` → `docs/domains/` clarifiée ;
- complétude minimale d’une fiche domaine cadrée.

---

### Phase 2 — Noyau coeur et coeur structurel

Statut : `largement engagé`

Domaines réalignés ou fortement repris :

- `core/products.md`
- `core/orders.md`
- `core/pricing.md`
- `core/cart.md`
- `core/checkout.md`
- `core/payments.md`
- `core/customers.md`
- `core/taxation.md`
- `core/auth.md`
- `core/users.md`
- `core/roles.md`
- `core/permissions.md`
- `core/shipping.md`
- `core/availability.md`
- `core/stores.md`
- `core/integrations.md`
- `core/webhooks.md`
- `cross-cutting/domain-events.md`

Arbitrages structurants déjà actés :

- `auth`, `users`, `roles`, `permissions` relèvent du coeur structurel ;
- `availability` porte la disponibilité vendable ;
- `shipping` porte l’expédition et le suivi de livraison ;
- `integrations` et `webhooks` sont distincts ;
- `domain-events` porte les faits métier internes publiés.

---

### Phase 3 — Satellites

Statut : `engagé`

Domaines satellites déjà réalignés ou fortement repris :

- `optional/commerce/inventory.md`
- `optional/commerce/fulfillment.md`

Arbitrages structurants déjà actés :

- `inventory` porte la vérité de stock ;
- `fulfillment` porte l’exécution logistique ;
- `shipping` reste distinct de `fulfillment` ;
- `availability` reste distinct d’`inventory`.

Points encore à vérifier dans les satellites :

- `categories.md`
- `channels.md`
- `discounts.md`
- `bundles.md`
- `catalog-modeling.md`
- `gifting.md`
- `media.md`
- `sales-policy.md`

---

### Phase 4 — Transverses critiques et transverses optionnels

Statut : `largement engagé`

Domaines transverses déjà réalignés ou fortement repris :

- `cross-cutting/audit.md`
- `cross-cutting/observability.md`
- `cross-cutting/monitoring.md`
- `cross-cutting/jobs.md`
- `cross-cutting/consent.md`
- `cross-cutting/legal.md`
- `cross-cutting/newsletter.md`
- `cross-cutting/tracking.md`
- `cross-cutting/crm.md`
- `cross-cutting/marketing.md`
- `cross-cutting/search.md`
- `cross-cutting/feature-flags.md`

Arbitrages structurants déjà actés :

- `audit` ≠ `observability` ;
- `monitoring` ≠ `observability` ;
- `jobs` ≠ `domain-events` ;
- `consent` ≠ `legal` ;
- `newsletter` ≠ `consent` ;
- `tracking` ≠ `domain-events` ;
- `crm` ≠ `customers` ;
- `marketing` reste au-dessus de `crm`, `newsletter` et `tracking`.

Points encore à vérifier dans les transverses :

- `analytics.md`
- `attribution.md`
- `conversion.md`
- `dashboarding.md`
- `email.md`
- `events.md`
- `export.md`
- `fraud-risk.md`
- `import.md`
- `localization.md`
- `notifications.md`
- `approval.md`
- `behavior.md`
- `workflow.md`
- `support.md`
- `template-system.md`
- `seo.md`
- `social.md`
- `scheduling.md`

---

### Phase 5 — Optionnels

Statut : `à reprendre`

Les domaines `optional/**` restent à auditer et réaligner plus systématiquement.

À revoir en priorité selon criticité produit :

- `returns.md`
- `reviews.md`
- `subscriptions.md`
- `marketplace.md`
- `gift-cards.md`
- `loyalty.md`
- `wishlist.md`
- `recommendations.md`
- `blog.md`
- `pages.md`
- `homepage-editorial.md`
- `ai-assistance.md`

---

## Arbitrages doctrinaux stabilisés

### 1. La catégorie documentaire ne dit pas tout

Un domaine :

- peut être `cross-cutting` et critique ;
- peut être `satellite` sans être négligeable ;
- peut être `optional` sans être commercialement secondaire ;
- peut être `core` sans être purement métier.

---

### 2. Le coeur structurel est assumé

Le repo reconnaît explicitement un coeur structurel, notamment :

- `auth`
- `users`
- `roles`
- `permissions`
- `domain-events`
- `integrations`
- `webhooks`

---

### 3. Les frontières stock / vente / logistique sont distinctes

La frontière retenue est :

- `availability` = disponibilité vendable
- `inventory` = vérité de stock
- `fulfillment` = exécution logistique
- `shipping` = expédition et suivi de livraison

Cette distinction est désormais considérée comme structurante.

---

### 4. Les domaines transverses ne sont pas des sous-domaines techniques faibles

Sont considérés comme transverses critiques ou fortement gouvernés selon contexte :

- `audit`
- `observability`
- `monitoring`
- `jobs`
- `consent`
- `legal`

---

### 5. Le cluster marketing / relation client est séparé

La séparation retenue est :

- `customers` = client métier
- `crm` = relation client structurée
- `consent` = expression opposable de volonté
- `newsletter` = abonnement newsletter
- `tracking` = signaux de tracking
- `marketing` = couche marketing interne structurée

---

## Documents encore suspects ou à surveiller

Les documents suivants doivent être considérés comme potentiellement encore hétérogènes, incomplets ou non migrés tant qu’ils n’ont pas été revus explicitement :

### Core

- `core/api-clients.md`
- `core/documents.md`
- `core/availability.md` à revalider si d’autres décisions impactent stock/logistique
- `core/integrations.md` à revalider si la stratégie d’anti-corruption layer évolue

### Satellites

- la majorité des satellites hors `inventory` et `fulfillment`

### Cross-cutting

- la majorité des transverses non encore relus explicitement

### Optional

- la quasi-totalité des optionnels

---

## Règles de migration

### Règle 1 — Ne pas migrer par simple renommage

Une migration n’est pas un renommage de titre.
Il faut vérifier :

- le rôle ;
- la source de vérité ;
- les frontières ;
- la classification ;
- les invariants.

### Règle 2 — Ne pas préserver une contradiction par inertie

Un document historiquement présent peut être :

- resserré ;
- reclassé ;
- scindé ;
- fusionné ;
- supprimé,

si la doctrine courante l’exige.

### Règle 3 — Toute décision de frontière doit être explicitée

Quand un domaine change de périmètre :

- la décision doit apparaître dans la fiche ;
- et le registre peut être mis à jour si l’arbitrage est structurant.

### Règle 4 — Une fiche migrée doit être autoportante

Une fiche réalignée doit être suffisamment claire pour être relue sans devoir revenir à un ancien document.

---

## Critères de sortie de migration

La migration de `docs/domains/` sera considérée comme suffisamment stabilisée lorsque :

- toutes les fiches encore actives auront une classification explicite ;
- les principales frontières litigieuses auront été tranchées ;
- les doublons implicites auront été réduits ;
- les fiches les plus critiques auront été réalignées ;
- le registre ne contiendra plus de décisions majeures “à trancher” sur les domaines structurants déjà migrés.

---

## Suivi pratique

Quand une fiche est reprise :

1. vérifier sa cohérence avec `docs/architecture/`
2. vérifier sa cohérence avec `docs/domains/README.md`
3. réaligner sa classification
4. réaligner ses frontières
5. mettre à jour ce registre uniquement si un arbitrage structurant a changé

---

## Documents liés

- `README.md`
- `_template.md`
- `../architecture/README.md`
- `../architecture/10-fondations/11-modele-de-classification.md`
- `../architecture/10-fondations/12-frontieres-et-responsabilites.md`
