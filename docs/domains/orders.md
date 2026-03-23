# Domaine `orders`

## Rôle

Le domaine `orders` porte la commande durable du socle.
Il constitue la source de vérité interne d’un achat validé, distincte du panier runtime, du checkout de préparation, des calculs amont et des intégrations externes.

## Responsabilités

Le domaine `orders` prend en charge :

- la création d’une commande à partir d’un checkout validé
- le figement des lignes de commande
- le figement des montants retenus
- le figement des snapshots client, facturation et livraison
- l’identifiant métier durable de la commande
- le cycle de vie métier de la commande
- la lecture durable des commandes pour la boutique, l’admin, le support et les domaines aval
- la base métier consommée par `payments`, `fulfillment`, `documents`, `notifications`, `analytics` et `integrations`

## Ce que le domaine ne doit pas faire

Le domaine `orders` ne doit pas :

- porter le panier runtime, qui relève de `cart`
- porter la validation finale avant commande, qui relève de `checkout`
- recalculer librement pricing, remises, taxes ou frais de livraison
- parler directement aux providers externes
- devenir un fourre-tout mélangeant paiement, logistique, documents, SAV et analytics

Le domaine `orders` porte la commande durable.
Il ne remplace ni `cart`, ni `checkout`, ni `payments`, ni `fulfillment`, ni `integrations`.

## Sous-domaines

- `creation` : création de commande et figement initial
- `lifecycle` : transitions métier de statut
- `reading` : lecture durable et exploitation de la commande

## Entrées

Le domaine reçoit principalement :

- un `Checkout` validé et prêt à être converti
- un `Cart` actif et cohérent
- un breakdown monétaire consolidé
- des snapshots client, facturation et livraison validés
- des commandes internes de lecture ou de transition de statut

## Sorties

Le domaine expose principalement :

- une `Order` durable
- des `OrderLine` figées
- des montants figés
- des snapshots client et livraison figés
- un statut métier exploitable par les domaines aval

## Dépendances vers autres domaines

Le domaine `orders` dépend de :

- `checkout` pour le contexte final validé
- `cart` pour les lignes sources à convertir
- `inventory` pour la réservation ou décrémentation quantitative
- `payments` pour la sémantique du paiement interne initial
- `audit` pour les transitions sensibles
- `observability` pour l’explicabilité des refus et transitions

Les domaines suivants dépendent de `orders` :

- `payments`
- `fulfillment`
- `documents`
- `notifications`
- `analytics`
- `integrations`
- `webhooks`

## Capabilities activables liées

Le domaine `orders` est lié à :

- `guestCheckout`
- `customerCheckout`
- `discounts`
- `taxation`
- `pickupPointDelivery`
- `electronicInvoicing`

### Effet si `guestCheckout` est activée

Le domaine accepte une commande issue d’un checkout invité.

### Effet si `guestCheckout` est désactivée

Le domaine n’accepte qu’un checkout rattaché à un client autorisé.

### Effet si `discounts` ou `taxation` est activée

Le domaine fige les montants consolidés reçus et ne les redéfinit jamais localement.

### Effet si `electronicInvoicing` est activée

La commande alimente les flux documentaires et d’intégration après commit, sans parler directement aux providers externes.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support`
- `customer` pour ses propres commandes selon le scope de lecture retenu

### Permissions

Exemples de permissions concernées :

- `orders.read`
- `orders.write`
- `orders.status.write`
- `payments.read`
- `fulfillment.read`
- `documents.read`
- `audit.read`

## Événements émis

Le domaine émet les domain events internes suivants :

- `order.created`
- `order.status.changed`
- `order.cancelled`
- `order.completed`

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `checkout.ready`
- `payment.authorized`
- `payment.captured`
- `payment.failed`
- `fulfillment.shipped`
- `fulfillment.delivered`

## Intégrations externes

Le domaine `orders` ne parle pas directement aux systèmes externes.
Les appels vers ERP, EBP, systèmes comptables, outils logistiques ou providers spécialisés relèvent de `integrations`.
Les notifications sortantes génériques relèvent de `webhooks`.

Le domaine `orders` reste la source de vérité interne de la commande métier.

## Données sensibles / sécurité

Le domaine `orders` porte une donnée métier critique.

Points de vigilance :

- validation serveur stricte de la conversion checkout → order
- interdiction de faire confiance à des montants ou statuts envoyés par le client
- contrôle strict des transitions métier
- lecture et écriture protégées par permissions et scope
- traçabilité forte des opérations sensibles

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une commande a été créée ou refusée
- quel checkout et quel panier ont été convertis
- quels montants et snapshots ont été figés
- pourquoi une transition de statut a été acceptée ou refusée
- si une erreur provient du checkout, du stock, du paiement ou d’un traitement aval

### Audit

Il faut tracer :

- la création de commande
- les transitions de statut sensibles
- les annulations
- les reprises manuelles
- les corrections administratives impactant durablement la commande

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Order` : commande métier durable
- `OrderLine` : ligne de commande figée
- `OrderTotalsSnapshot` : snapshot monétaire figé
- `OrderCustomerSnapshot` : snapshot client figé
- `OrderShippingSnapshot` : snapshot de livraison figé
- `OrderStatus` : cycle de vie métier de la commande

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une commande possède un identifiant durable et un numéro métier stable
- une commande n’est créée qu’à partir d’un checkout validé
- les lignes et montants sont figés à la création
- le domaine `orders` ne recalcule pas librement les montants validés
- une transition de statut suit une machine d’état explicite
- les domaines aval ne recréent pas une vérité divergente de la commande

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- validation finale du checkout utilisé pour la création
- création de `Order`
- création des `OrderLine`
- figement des snapshots client, facturation et livraison
- création de l’enregistrement interne de paiement initial
- réservation ou décrémentation du stock lié aux lignes
- passage du `Cart` source en statut `CONVERTED`
- écriture de `order.created` dans l’outbox

Une transition de statut métier sensible doit également être atomique avec l’écriture de son event correspondant.

### Ce qui peut être eventual consistency

Les traitements suivants ont lieu après commit :

- envoi d’emails transactionnels
- synchronisation ERP ou comptable
- génération documentaire
- analytics et projections secondaires
- webhooks sortants
- déclenchement de jobs de fulfillment

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- une seule conversion réussie par panier source
- une référence métier stable portée par la commande de création
- une transaction applicative unique pour la création initiale
- des gardes de transition sur le statut courant de la commande
- un échec transactionnel complet en cas de conflit stock ou incohérence de source

Les conflits attendus sont :

- double soumission du checkout
- retry HTTP sur la création de commande
- tentative concurrente de conversion du même panier
- transition de statut concurrente
- conflit stock sur la même variante

### Idempotence

Les commandes métier suivantes sont idempotentes :

- `create-order-from-checkout` : clé d’idempotence = référence métier stable de création + identité du panier source
- `change-order-status` : clé d’idempotence = couple `(orderId, targetStatus, actorIntentId)`

Un retry de la même intention retourne la même commande ou confirme le même état final.
Il ne crée jamais une seconde commande durable pour le même achat.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `order.created`
- `order.status.changed`
- `order.cancelled`
- `order.completed`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- appel PSP externe
- email transactionnel
- webhook sortant
- synchronisation ERP / EBP / comptable
- projection analytics
- déclenchement logistique externe

## Cas d’usage principaux

1. Convertir un checkout validé en commande durable
2. Lire une commande et ses lignes figées
3. Lire les montants et snapshots figés
4. Faire évoluer le statut métier de la commande
5. Fournir une base fiable aux domaines aval

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- checkout introuvable ou non prêt
- panier introuvable, vide ou déjà converti
- conflit de stock
- tentative de création concurrente ou dupliquée
- transition de statut invalide
- incohérence entre checkout, panier et snapshots figés

## Décisions d’architecture

Les choix structurants du domaine sont :

- `orders` porte la commande durable du socle
- la création de commande repose sur un checkout validé
- la conversion commande est transactionnelle et idempotente
- le panier source n’est pas supprimé ; il est marqué `CONVERTED`
- l’outbox est écrite dans la même transaction que la commande
- les effets externes partent après commit

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la commande durable relève de `orders`
- le panier runtime relève de `cart`
- la validation finale relève de `checkout`
- les paiements relèvent de `payments`
- les événements durables de commande passent par l’outbox
- les systèmes externes consomment la commande via `integrations` ou `webhooks`
