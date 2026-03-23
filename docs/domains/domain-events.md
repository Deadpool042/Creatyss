# Domaine `domain-events`

## Rôle

Le domaine `domain-events` porte l’outbox d’événements métier internes du socle.
Il formalise les faits métier déjà validés, les persiste durablement et fournit la base fiable de diffusion, retry, replay contrôlé et découplage entre domaines.

## Responsabilités

Le domaine `domain-events` prend en charge :

- la persistance durable des faits métier internes
- l’enveloppe commune des événements internes
- le statut de dispatch des événements
- le comptage de retries
- la traçabilité des erreurs de dispatch
- la base de découplage interne entre domaines émetteurs et domaines consommateurs

## Ce que le domaine ne doit pas faire

Le domaine `domain-events` ne doit pas :

- porter les logs techniques
- porter les webhooks sortants
- devenir un bus flou sans sémantique métier
- prendre les payloads providers bruts comme langage interne
- reconstituer la vérité métier primaire à la place des domaines source
- exécuter lui-même les effets externes métier

Le domaine `domain-events` porte les faits métier internes persistés.
Il ne remplace ni `webhooks`, ni `integrations`, ni `jobs`, ni les domaines source.

## Sous-domaines

- `outbox` : persistance des événements
- `dispatch` : état de diffusion
- `retry` : reprises de diffusion
- `replay` : rejouabilité contrôlée
- `observability` : visibilité sur les échecs de diffusion

## Entrées

Le domaine reçoit principalement :

- des faits métier validés émis par les domaines source
- des demandes de dispatch
- des demandes de retry
- des erreurs de diffusion
- des commandes d’inspection ou replay contrôlé

## Sorties

Le domaine expose principalement :

- un `DomainEvent` persistant
- un statut `PENDING / DISPATCHED / FAILED`
- un compteur de retry
- des métadonnées d’erreur de diffusion
- un flux interne stable à destination de `jobs`, `webhooks`, `integrations` et autres consommateurs

## Dépendances vers autres domaines

Le domaine `domain-events` dépend de :

- tous les domaines source émetteurs
- `observability` pour le diagnostic
- `audit` pour les opérations sensibles de replay ou reprise
- `jobs` pour l’orchestration asynchrone
- `webhooks` pour la notification sortante générique
- `integrations` pour les connecteurs provider-specific

Les domaines suivants dépendent de `domain-events` :

- `jobs`
- `webhooks`
- `integrations`
- `notifications`
- `analytics`
- `tracking`

## Capabilities activables liées

Le domaine `domain-events` est transversal.
Toute capability métier qui crée un nouveau fait durable y produit de nouveaux événements.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `observability_operator`
- `integration_operator`

### Permissions

Exemples de permissions concernées :

- `domain_events.read`
- `domain_events.retry`
- `domain_events.replay`
- `observability.read`
- `audit.read`

## Événements émis

Le domaine émet les événements techniques internes suivants sur sa propre mécanique :

- `domain_event.dispatch.succeeded`
- `domain_event.dispatch.failed`
- `domain_event.retry.scheduled`
- `domain_event.replayed`

## Événements consommés

Le domaine consomme les faits métier validés en provenance des domaines source, par exemple :

- `cart.converted`
- `checkout.completed`
- `order.created`
- `order.status.changed`
- `payment.captured`
- `payment.failed`
- `inventory.stock.adjusted`
- `auth.session.created`

## Intégrations externes

Le domaine `domain-events` ne parle pas directement aux systèmes externes.
Les sorties externes passent par `webhooks`, `integrations` ou `jobs`.

Le domaine `domain-events` reste la source de vérité interne du langage événementiel durable du socle.

## Données sensibles / sécurité

Le domaine `domain-events` porte une donnée technique et métier critique.

Points de vigilance :

- stabilité du schéma d’événement
- payload interne structuré et non ambigu
- contrôle des retries et replays
- interdiction de publier un event durable hors transaction source
- traçabilité des erreurs de diffusion

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel événement a été écrit
- quel domaine source l’a produit
- quel est son statut de dispatch
- combien de retries ont eu lieu
- quelle erreur a empêché le dispatch

### Audit

Il faut tracer :

- les replays manuels
- les retries manuels
- les purges exceptionnelles
- les corrections opérées sur le pipeline de dispatch

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `DomainEvent` : fait métier persistant
- `DomainEventStatus` : `PENDING`, `DISPATCHED`, `FAILED`
- `AggregateReference` : couple `(aggregateType, aggregateId)`
- `DispatchAttempt` : tentative de diffusion
- `ReplayIntent` : intention contrôlée de rejeu

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un événement durable représente un fait métier déjà validé
- un événement durable est écrit dans la même transaction que la mutation source
- le dispatch ne redéfinit pas la vérité métier
- un retry de dispatch ne réexécute pas la mutation métier source
- l’état de dispatch est traçable et explicable

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- écriture de l’événement durable
- mutation métier source qu’il représente
- mise à jour du statut de dispatch d’un événement
- incrément du compteur de retry avec journalisation d’erreur
- marquage `DISPATCHED` avec `dispatchedAt`

### Ce qui peut être eventual consistency

Les traitements suivants ont lieu après commit :

- consommation par `jobs`
- livraison webhook
- synchronisation provider-specific
- projections analytics
- notifications

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- une transaction applicative pour toute mutation d’état de l’outbox
- un traitement déterministe des reprises
- une seule vérité de statut par événement
- une consommation basée sur un état persistant et non mémoire

Les conflits attendus sont :

- deux workers tentant de dispatcher le même événement
- retry concurrent et dispatch concurrent
- replay manuel pendant un dispatch en cours

### Idempotence

Les commandes métier suivantes sont idempotentes :

- `append-domain-event` : clé d’idempotence = identité de la mutation source
- `dispatch-domain-event` : clé d’idempotence = `domainEventId`
- `retry-domain-event` : clé d’idempotence = `(domainEventId, retrySequence)`

Un retry de dispatch ne doit jamais recréer la mutation source ni dupliquer l’état métier primaire.

### Domain events écrits dans la même transaction

Le domaine persiste tous les événements métier durables dans la même transaction que leur mutation source, notamment :

- `cart.*`
- `checkout.*`
- `order.*`
- `payment.*`
- `inventory.*`
- `auth.*`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- appel HTTP externe
- livraison webhook
- notification email
- projection analytics
- synchronisation provider-specific

## Cas d’usage principaux

1. Persister un fait métier durable
2. Marquer un événement comme dispatché
3. Marquer un échec de dispatch
4. Replanifier un retry
5. Rejouer un événement de manière contrôlée

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- payload invalide
- événement source absent
- double tentative de dispatch concurrente
- erreur de diffusion
- replay interdit
- corruption d’état de dispatch

## Décisions d’architecture

Les choix structurants du domaine sont :

- `domain-events` est une outbox persistée
- un event durable est écrit dans la même transaction que la mutation source
- le dispatch est découplé du commit métier
- `jobs`, `webhooks` et `integrations` consomment l’outbox après commit
- les retries n’impactent pas rétroactivement la vérité métier
- les replays sont contrôlés et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `domain-events` porte l’outbox interne du socle
- les payloads providers bruts ne deviennent pas le langage interne
- les effets externes partent après commit
- le dispatch ne remplace pas les domaines source
- les retries concernent la diffusion, pas la mutation métier source
- l’atomicité mutation source + outbox est obligatoire
