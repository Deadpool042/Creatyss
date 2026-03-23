# Domaine `payments`

## Rôle

Le domaine `payments` porte l’état de paiement interne du socle.
Il gère les intentions, autorisations, captures, échecs, annulations et remboursements liés à une commande, sans confondre la vérité métier du paiement avec le protocole brut d’un PSP.

## Responsabilités

Le domaine `payments` prend en charge :

- l’enregistrement du paiement interne d’une commande
- les statuts internes de paiement
- le rattachement du paiement à la commande
- les références provider utiles au suivi
- les transitions internes `PENDING / AUTHORIZED / CAPTURED / FAILED / CANCELLED / REFUNDED / PARTIALLY_REFUNDED`
- la lecture consolidée de l’état de paiement pour les domaines aval

## Ce que le domaine ne doit pas faire

Le domaine `payments` ne doit pas :

- porter la commande durable
- porter le panier ou le checkout
- recalculer le pricing
- prendre les payloads PSP bruts comme langage officiel du socle
- devenir un domaine d’intégration provider-specific
- porter les documents comptables ou fiscaux

Le domaine `payments` porte le paiement interne du socle.
Il ne remplace ni `orders`, ni `checkout`, ni `integrations`, ni `webhooks`, ni `documents`.

## Sous-domaines

- `records` : enregistrement de paiement interne
- `lifecycle` : transitions de statut
- `provider-mapping` : traduction des références provider
- `refunds` : remboursements et remboursements partiels

## Entrées

Le domaine reçoit principalement :

- une commande existante
- une intention ou un résultat de paiement traduit dans un langage interne
- des références provider stabilisées
- des demandes de capture, annulation, échec ou remboursement
- des événements traduits issus de `integrations`

## Sorties

Le domaine expose principalement :

- un `Payment`
- un statut interne de paiement
- des références provider utiles au rapprochement
- un état de paiement exploitable par `orders`, `documents`, `returns`, `analytics` et `integrations`

## Dépendances vers autres domaines

Le domaine `payments` dépend de :

- `orders` pour la commande métier source
- `audit` pour les transitions sensibles
- `observability` pour diagnostiquer les échecs et incohérences
- `integrations` pour les appels provider-specific
- `webhooks` pour certaines notifications sortantes
- `notifications` pour les communications métier après commit

Les domaines suivants dépendent de `payments` :

- `orders`
- `documents`
- `returns`
- `notifications`
- `analytics`
- `integrations`
- `webhooks`

## Capabilities activables liées

Le domaine `payments` est lié à :

- `guestCheckout`
- `customerCheckout`
- `electronicInvoicing`

### Effet si `guestCheckout` est activée

Le domaine supporte des paiements liés à des commandes invitées.

### Effet si `electronicInvoicing` est activée

Les statuts de paiement alimentent des flux documentaires après commit.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support`
- `finance_manager`

### Permissions

Exemples de permissions concernées :

- `payments.read`
- `payments.write`
- `payments.refund`
- `orders.read`
- `audit.read`
- `documents.read`

## Événements émis

Le domaine émet les domain events internes suivants :

- `payment.created`
- `payment.authorized`
- `payment.captured`
- `payment.failed`
- `payment.cancelled`
- `payment.refunded`
- `payment.partially_refunded`

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `order.created`
- `order.cancelled`
- `integration.payment.intent.updated`
- `integration.payment.capture.succeeded`
- `integration.payment.capture.failed`
- `integration.payment.refund.succeeded`
- `integration.payment.refund.failed`

## Intégrations externes

Le domaine `payments` ne parle pas directement aux PSPs dans sa logique coeur.
Les appels provider-specific relèvent de `integrations`.
Les notifications sortantes génériques relèvent de `webhooks`.

Le domaine `payments` reste la source de vérité interne de l’état de paiement métier.

## Données sensibles / sécurité

Le domaine `payments` manipule une donnée hautement sensible.

Points de vigilance :

- ne jamais stocker de secret provider brut dans le domaine coeur
- contrôler strictement les transitions de statut
- protéger les opérations de remboursement
- tracer les références provider utiles sans exposer de données interdites
- ne jamais faire confiance à un callback brut sans traduction et validation

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un paiement est `PENDING`, `AUTHORIZED`, `CAPTURED`, `FAILED`, `CANCELLED` ou `REFUNDED`
- quelle commande est concernée
- quelle référence provider a été retenue
- pourquoi une transition a été acceptée ou refusée
- quel appel externe ou événement traduit a servi de déclencheur

### Audit

Il faut tracer :

- la création du paiement interne
- les changements de statut
- les annulations
- les captures
- les remboursements
- les interventions manuelles

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Payment` : enregistrement interne de paiement
- `PaymentStatus` : cycle de vie du paiement
- `PaymentMethodKind` : moyen de paiement
- `ProviderReference` : identifiant provider utile au rapprochement
- `ProviderPaymentIntentRef` : référence d’intention provider

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un paiement est rattaché à une commande existante
- le statut du paiement suit une machine d’état explicite
- le domaine `payments` porte la vérité interne du paiement
- les références provider sont des aides de rapprochement, pas la vérité métier primaire
- une mutation de paiement sensible laisse une trace exploitable

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création du paiement interne initial d’une commande
- transition de statut d’un paiement
- écriture des références provider retenues
- écriture d’un remboursement ou remboursement partiel
- éventuelle mise à jour corrélée de l’état de commande lorsque la règle métier l’exige
- écriture des events `payment.*` correspondants

### Ce qui peut être eventual consistency

Les traitements suivants ont lieu après commit :

- appel PSP externe
- email transactionnel
- génération documentaire
- webhook sortant
- analytics
- synchronisation comptable

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- une transaction applicative par mutation de paiement
- une garde stricte sur le statut courant avant transition
- une déduplication des callbacks par référence provider stable
- une traduction provider → langage interne avant mutation métier
- un refus d’appliquer deux fois le même changement métier

Les conflits attendus sont :

- callbacks dupliqués
- callbacks hors ordre
- retry de capture
- retry de remboursement
- double demande manuelle sur le même paiement

### Idempotence

Les commandes métier suivantes sont idempotentes :

- `record-payment-provider-update` : clé d’idempotence = `(providerName, providerReference, providerEventId)`
- `capture-payment` : clé d’idempotence = `(paymentId, captureIntentId)`
- `refund-payment` : clé d’idempotence = `(paymentId, refundIntentId)`

Un retry sur la même intention ne doit jamais produire deux captures, deux annulations ou deux remboursements incompatibles.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `payment.created`
- `payment.authorized`
- `payment.captured`
- `payment.failed`
- `payment.cancelled`
- `payment.refunded`
- `payment.partially_refunded`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- appel PSP externe
- notification email
- webhook sortant
- synchronisation comptable
- projection analytics

## Cas d’usage principaux

1. Créer un paiement interne initial pour une commande
2. Mettre à jour le statut d’un paiement à partir d’un résultat traduit
3. Rapprocher une référence provider avec un paiement interne
4. Capturer, annuler ou rembourser un paiement
5. Fournir un état de paiement fiable aux domaines aval

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- commande introuvable
- paiement introuvable
- transition de statut invalide
- callback dupliqué
- callback hors ordre
- incohérence de montant
- remboursement impossible
- référence provider ambiguë ou absente

## Décisions d’architecture

Les choix structurants du domaine sont :

- `payments` porte le paiement interne du socle
- les PSPs sont traités via `integrations`
- les statuts internes sont distincts des statuts bruts providers
- les transitions sensibles sont atomiques et auditables
- les events `payment.*` passent par l’outbox
- les effets externes partent après commit

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- le paiement interne relève de `payments`
- la commande relève de `orders`
- les providers externes relèvent de `integrations`
- les callbacks dupliqués sont traités en idempotence
- les références provider ne remplacent pas la vérité métier interne
- les remboursements sont des mutations métier tracées
