# Domaine `webhooks`

## Rôle

Le domaine `webhooks` porte la notification sortante générique du socle vers des systèmes abonnés.
Il structure les endpoints, abonnements, livraisons, retries et statuts de diffusion.

## Responsabilités

Le domaine `webhooks` prend en charge :

- les endpoints webhook déclarés
- les abonnements à des événements sortants
- les livraisons webhook
- les retries de livraison
- les signatures ou secrets de livraison
- l’état de diffusion d’une livraison
- la lecture opérable des succès, échecs, abandons et relances

## Ce que le domaine ne doit pas faire

Le domaine `webhooks` ne doit pas :

- porter les faits métier internes
- devenir le bus interne du socle
- porter les adaptateurs provider-specific
- porter le moteur asynchrone générique
- adopter les payloads externes comme langage central du système

Le domaine `webhooks` porte la notification sortante générique.
Il ne remplace ni `domain-events`, ni `integrations`, ni `jobs`.

## Sous-domaines

- `endpoints` : gestion des endpoints
- `subscriptions` : gestion des événements souscrits
- `deliveries` : création et suivi des livraisons
- `retry` : reprises de livraison
- `security` : signature et secret de livraison

## Entrées

Le domaine reçoit principalement :

- des événements internes durables éligibles à diffusion
- des commandes de création ou modification d’endpoint
- des ordres de retry de livraison
- des résultats de tentative HTTP sortante

## Sorties

Le domaine expose principalement :

- un `WebhookEndpoint`
- une `WebhookDelivery`
- un statut `PENDING / DELIVERED / FAILED / CANCELLED`
- un historique d’attempts
- une capacité de livraison sortante générique

## Dépendances vers autres domaines

Le domaine `webhooks` dépend de :

- `domain-events` pour les faits métier internes
- `jobs` pour l’orchestration d’envoi
- `observability` pour le diagnostic
- `audit` pour les reprises et modifications sensibles

Les domaines suivants dépendent de `webhooks` :

- `integrations` dans certains flux génériques
- `monitoring`
- `observability`
- `admin`

## Capabilities activables liées

Le domaine `webhooks` est transversal.
Chaque capability qui expose un fait métier à l’extérieur ajoute des événements diffusables.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `integration_operator`
- `observability_operator`

### Permissions

Exemples de permissions concernées :

- `webhooks.read`
- `webhooks.write`
- `webhooks.retry`
- `integrations.read`
- `observability.read`
- `audit.read`

## Événements émis

Le domaine émet les domain events internes suivants :

- `webhook.endpoint.created`
- `webhook.endpoint.updated`
- `webhook.delivery.created`
- `webhook.delivery.succeeded`
- `webhook.delivery.failed`
- `webhook.delivery.retry.scheduled`
- `webhook.delivery.cancelled`

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `order.created`
- `order.status.changed`
- `payment.captured`
- `payment.failed`
- `inventory.stock.adjusted`
- `auth.password.changed`
- tout autre événement durable explicitement exposé

## Intégrations externes

Le domaine `webhooks` parle à des endpoints externes abonnés.
Il ne devient pas pour autant un domaine d’intégration provider-specific.

Les webhooks sont :

- des notifications sortantes génériques
- dérivées d’événements internes durables
- livrées après commit

## Données sensibles / sécurité

Le domaine `webhooks` manipule des données techniques et sensibles.

Points de vigilance :

- stockage sécurisé du secret de signature
- contrôle strict des URLs déclarées
- payload maîtrisé et non ambigu
- retry borné et traçable
- protection contre les boucles de rediffusion

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel endpoint a été ciblé
- quel événement a été livré
- combien de tentatives ont eu lieu
- quel code de réponse a été reçu
- pourquoi une livraison a échoué ou été annulée

### Audit

Il faut tracer :

- la création et la modification des endpoints
- les changements de souscription
- les retries manuels
- les annulations de livraison
- les désactivations d’endpoint

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `WebhookEndpoint` : endpoint déclaré
- `WebhookDelivery` : livraison d’un événement
- `WebhookStatus` : statut d’endpoint
- `WebhookEventStatus` : statut de livraison
- `WebhookSignatureContext` : contexte de signature

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un endpoint possède un statut explicite
- une livraison est rattachée à un endpoint existant
- une livraison sortante part d’un événement interne durable
- le retry ne modifie pas la vérité métier source
- un endpoint désactivé ne reçoit pas de nouvelle livraison

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création ou mise à jour d’un endpoint
- création d’une livraison à partir d’un événement durable
- mise à jour du statut d’une livraison
- incrément du compteur d’attempts et planification du retry
- écriture des events `webhook.*` correspondants

### Ce qui peut être eventual consistency

Les traitements suivants ont lieu après commit :

- appel HTTP sortant
- retries planifiés
- monitoring externe
- notifications opérateur
- analytics

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- une transaction applicative sur chaque mutation de `WebhookDelivery`
- une déduplication par `eventKey` lorsqu’elle existe
- une seule vérité de statut par livraison
- l’annulation explicite d’une livraison non distribuable

Les conflits attendus sont :

- deux workers tentant le même envoi
- retry concurrent et succès concurrent
- modification d’endpoint pendant une file de livraison

### Idempotence

Les commandes métier suivantes sont idempotentes :

- `enqueue-webhook-delivery` : clé d’idempotence = `(endpointId, eventName, eventKey)`
- `deliver-webhook` : clé d’idempotence = `webhookDeliveryId`
- `retry-webhook-delivery` : clé d’idempotence = `(webhookDeliveryId, attemptSequence)`

Un retry ne doit jamais créer deux livraisons concurrentes pour le même événement logique.

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

- requête HTTP sortante
- monitoring externe
- notification email opérateur
- projection analytics

## Cas d’usage principaux

1. Déclarer un endpoint webhook
2. Souscrire un endpoint à des événements
3. Enfiler une livraison à partir d’un événement durable
4. Envoyer la livraison
5. Replanifier un retry ou annuler la livraison

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- endpoint invalide
- secret manquant
- endpoint désactivé
- livraison dupliquée
- échec HTTP
- retry dépassé
- conflit de worker sur la même livraison

## Décisions d’architecture

Les choix structurants du domaine sont :

- `webhooks` diffuse des notifications sortantes génériques
- les livraisons sont dérivées d’événements durables
- l’envoi HTTP est après commit
- les retries sont bornés et auditables
- les events `webhook.*` passent par l’outbox
- `integrations` porte les adaptateurs provider-specific, pas `webhooks`

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les webhooks sortants relèvent de `webhooks`
- les faits métier internes relèvent de `domain-events`
- les adaptateurs provider-specific relèvent de `integrations`
- les livraisons sont idempotentes
- les retries n’altèrent pas la vérité métier source
- les appels HTTP sortants ne sont jamais dans la transaction métier
