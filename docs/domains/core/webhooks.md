# Domaine `webhooks`

## Objectif

Ce document décrit le domaine `webhooks` dans la doctrine courante du socle.

Il précise :

- le rôle du domaine ;
- sa place dans la modularité du socle ;
- sa source de vérité ;
- ses capabilities activables ;
- ses objets métier ;
- ses invariants ;
- son cycle de vie ;
- ses règles de cohérence ;
- ses frontières externes ;
- ses implications de maintenance, d’exploitation et de coût.

Le domaine `webhooks` porte la notification sortante générique du socle vers des endpoints abonnés.
Il ne remplace ni `domain-events`, ni `integrations`.
Il structure la livraison, les retries, les signatures et l’observabilité de ces notifications.

---

## Position dans la doctrine de modularité

Le domaine `webhooks` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine existe comme brique standard du socle pour exposer des faits métier vers l’extérieur.
Le nombre d’événements exposés, d’endpoints, de signatures ou de stratégies de retry varie selon les projets.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- le principe de livraison sortante générique ;
- un modèle d’endpoint ;
- un modèle de delivery ;
- un statut de livraison ;
- une logique de retry contrôlée ;
- une séparation stricte avec les connecteurs provider-specific.

### Ce qui est activable / désactivable par capability

Le domaine `webhooks` est lié aux capabilities suivantes :

- `webhooksOutbound`
- `signedWebhooks`
- `webhookRetries`
- `webhookDeliveryAnalytics`
- `webhookEventExposure.advanced`

### Ce qui relève d’un niveau

Le domaine varie par richesse :

- des signatures ;
- des statuts ;
- des retries ;
- des événements exposés ;
- de l’observability.

### Ce qui relève d’un provider ou d’une intégration externe

Le domaine `webhooks` ne porte pas les connecteurs spécialisés.
Il porte une notification générique vers des endpoints déclarés.

---

## Rôle

Le domaine `webhooks` porte la notification sortante générique du socle.

Il constitue la source de vérité interne pour :

- les endpoints déclarés ;
- les abonnements à des événements exposés ;
- les deliveries ;
- les statuts de delivery ;
- les tentatives de livraison ;
- les retries ;
- les signatures de livraison si activées.

Le domaine est distinct :

- de `domain-events`, qui porte l’outbox interne ;
- de `integrations`, qui porte les connecteurs spécialisés ;
- de `jobs`, qui exécute éventuellement des traitements asynchrones de livraison.

---

## Responsabilités

Le domaine `webhooks` prend en charge :

- la déclaration d’endpoints ;
- les abonnements à certains événements ;
- la création de deliveries à partir d’événements internes exposables ;
- la gestion des tentatives de livraison ;
- la gestion des retries ;
- la gestion des signatures ou secrets de livraison ;
- l’observabilité des succès et échecs de livraison.

---

## Ce que le domaine ne doit pas faire

Le domaine `webhooks` ne doit pas :

- devenir le bus interne du socle ;
- porter la vérité métier source ;
- remplacer `integrations` pour les providers spécialisés ;
- faire entrer des callbacks providers dans le coeur ;
- mélanger webhook générique et logique de connecteur spécialisé.

---

## Source de vérité

Le domaine `webhooks` est la source de vérité pour :

- les endpoints ;
- les souscriptions d’événements ;
- les deliveries ;
- les statuts de delivery ;
- les retries de delivery ;
- les secrets ou signatures de webhook sortant.

Le domaine n’est pas la source de vérité pour :

- les événements métier eux-mêmes ;
- la logique de commande, paiement, checkout, etc. ;
- les connecteurs spécialisés ;
- les payloads providers entrants.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `WebhookEndpoint`
- `WebhookSubscription`
- `WebhookDelivery`
- `WebhookDeliveryStatus`
- `WebhookAttempt`
- `WebhookSignatureContext`

---

## Capabilities activables liées

Le domaine `webhooks` est lié aux capabilities suivantes :

- `webhooksOutbound`
- `signedWebhooks`
- `webhookRetries`
- `webhookDeliveryAnalytics`
- `webhookEventExposure.advanced`

### Effet si `webhooksOutbound` est activée

Le socle peut exposer certains événements vers des endpoints externes.

### Effet si `signedWebhooks` est activée

Les deliveries incluent une logique de signature et de vérification côté destinataire.

### Effet si `webhookRetries` est activée

Les échecs de livraison sont repris selon une stratégie bornée.

### Effet si `webhookDeliveryAnalytics` est activée

Le domaine expose davantage de visibilité sur les deliveries et leurs résultats.

### Effet si `webhookEventExposure.advanced` est activée

Le socle peut exposer un périmètre plus riche d’événements aux endpoints externes.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- endpoints simples ;
- deliveries basiques ;
- statut simple ;
- peu d’événements exposés.

### Niveau 2 — standard

- signatures ;
- retries structurés ;
- meilleure visibilité de l’état de delivery.

### Niveau 3 — avancé

- plus d’événements exposés ;
- plus de contrôle opératoire ;
- meilleure observability des tentatives et échecs.

### Niveau 4 — expert / multi-contraintes

- exigences plus fortes sur audit, exposition, signatures, gouvernance et exploitation.

---

## Entrées

Le domaine reçoit principalement :

- des événements durables exposables ;
- des commandes de création / modification d’endpoint ;
- des ordres de retry ;
- les résultats des tentatives HTTP sortantes.

---

## Sorties

Le domaine expose principalement :

- des endpoints ;
- des deliveries ;
- des statuts de livraison ;
- des historiques de tentatives ;
- des événements internes sur succès, échec ou retry.

---

## Dépendances vers autres domaines

Le domaine `webhooks` dépend de :

- `domain-events`
- `jobs`
- `audit`
- `observability`

Les domaines suivants dépendent de `webhooks` :

- `integrations` dans certains cas génériques
- `monitoring`
- `admin`
- `support`

---

## Dépendances vers providers / intégrations

Le domaine `webhooks` parle à des endpoints externes génériques.
Il ne devient pas un domaine provider-specific.

Les connecteurs spécialisés restent dans `integrations`.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `integration_operator`
- `observability_operator`

### Permissions

Exemples de permissions concernées :

- `webhooks.read`
- `webhooks.write`
- `webhooks.retry`
- `integrations.read`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `webhook.endpoint.created`
- `webhook.endpoint.updated`
- `webhook.delivery.created`
- `webhook.delivery.succeeded`
- `webhook.delivery.failed`
- `webhook.delivery.retry.scheduled`
- `webhook.delivery.cancelled`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `order.created`
- `order.status.changed`
- `payment.captured`
- `payment.failed`
- `inventory.stock.adjusted`
- `auth.password.changed`
- tout autre événement explicitement exposé vers l’extérieur

---

## Données sensibles / sécurité

Le domaine `webhooks` manipule des données techniques et sensibles.

Points de vigilance :

- les endpoints doivent être contrôlés ;
- les secrets ou signatures doivent être protégés ;
- les payloads sortants doivent rester maîtrisés ;
- les retries doivent être bornés et observables ;
- les webhooks ne doivent pas devenir une fuite incontrôlée du langage interne.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel endpoint a été ciblé ;
- quel événement a été exposé ;
- combien de tentatives ont eu lieu ;
- pourquoi une livraison a échoué ;
- si un retry a été planifié ou abandonné.

### Audit

Il faut tracer :

- la création ou modification des endpoints ;
- les changements de souscription ;
- les retries manuels ;
- les désactivations ;
- les annulations de delivery.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une delivery est rattachée à un endpoint existant ;
- une delivery sortante part d’un événement interne durable ;
- un endpoint désactivé ne reçoit pas de nouvelle delivery ;
- les retries ne modifient pas la vérité métier source ;
- `webhooks` ne remplace pas `integrations`.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux d’une delivery sont typiquement :

- `PENDING`
- `DELIVERED`
- `FAILED`
- `CANCELLED`

Les endpoints peuvent être :

- `ACTIVE`
- `DISABLED`
- `ARCHIVED`

### Transitions autorisées

Exemples :

- `PENDING -> DELIVERED`
- `PENDING -> FAILED`
- `FAILED -> PENDING` dans le cadre d’un retry explicite
- `ACTIVE -> DISABLED`

### Transitions interdites

Exemples :

- considérer une delivery échouée comme “jamais existée” ;
- réactiver implicitement un endpoint archivé ;
- confondre l’état de la delivery avec l’état métier source.

### Règles de conservation / archivage / suppression

- les deliveries utiles au support et à l’audit restent traçables ;
- les endpoints désactivés restent compréhensibles ;
- les purges éventuelles sont contrôlées.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création ou mise à jour d’un endpoint ;
- création d’une delivery ;
- mise à jour du statut d’une delivery ;
- incrément d’attempts et planification de retry ;
- écriture des events `webhook.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- appel HTTP sortant ;
- monitoring externe ;
- notification opérateur ;
- analytics ;
- retries planifiés.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les mutations de delivery ;
- une seule vérité de statut par delivery ;
- déduplication par clé d’événement logique lorsque nécessaire ;
- annulation explicite des deliveries non distribuables.

Les conflits attendus sont :

- deux workers sur la même delivery ;
- retry concurrent ;
- modification d’endpoint pendant une file de livraison.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `enqueue-webhook-delivery` : clé d’intention = `(endpointId, eventName, eventKey)`
- `deliver-webhook` : clé d’intention = `webhookDeliveryId`
- `retry-webhook-delivery` : clé d’intention = `(webhookDeliveryId, retrySequence)`

Un retry ne doit pas créer deux deliveries logiques concurrentes pour le même événement.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `webhook.endpoint.created`
- `webhook.endpoint.updated`
- `webhook.delivery.created`
- `webhook.delivery.succeeded`
- `webhook.delivery.failed`
- `webhook.delivery.retry.scheduled`
- `webhook.delivery.cancelled`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- requête HTTP sortante ;
- monitoring externe ;
- notification opérateur ;
- analytics externe.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` avec peu d’endpoints ;
- `M2` dès que les webhooks deviennent un point de synchronisation important ;
- `M3` avec plusieurs endpoints, retries et forte exigence de support ;
- `M4` en cas d’exigences particulièrement fortes d’audit ou de gouvernance.

### Pourquoi

Les webhooks deviennent vite une source de support et de confusion s’ils ne sont pas observables et bien contrôlés.

### Points d’exploitation à surveiller

- taux d’échec ;
- nombre de retries ;
- endpoints désactivés ;
- événements les plus livrés ;
- latence de delivery ;
- actions manuelles opérateur.

---

## Impact coût / complexité

Le coût du domaine `webhooks` monte principalement avec :

- le nombre d’endpoints ;
- le nombre d’événements exposés ;
- la richesse des signatures ;
- la richesse des retries ;
- le niveau d’observability attendu.

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Déclarer un endpoint webhook
2. Souscrire un endpoint à des événements
3. Créer une delivery depuis un événement durable
4. Tenter une livraison
5. Replanifier un retry

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- endpoint invalide ;
- endpoint désactivé ;
- delivery dupliquée ;
- échec HTTP ;
- retry dépassé ;
- conflit de worker ;
- signature incohérente.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `webhooks` est un domaine coeur à capabilities toggleables ;
- il porte la notification sortante générique ;
- il ne remplace ni `domain-events` ni `integrations` ;
- les deliveries partent après commit ;
- les retries sont bornés et observables ;
- les webhooks sortants restent découplés de la vérité métier source.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `webhooks` appartient au socle comme brique standard ;
- il porte des notifications sortantes génériques ;
- il ne porte pas les connecteurs spécialisés ;
- les deliveries sont idempotentes et tracées ;
- les effets externes sont hors transaction métier ;
- la frontière avec `integrations` reste explicite.
