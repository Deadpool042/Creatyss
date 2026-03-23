# Domaine `checkout`

## Rôle

Le domaine `checkout` porte la validation finale avant commande.
Il décide si un panier est prêt à être transformé en commande, consolide les blocages, prépare les snapshots utiles à `orders` et constitue la source de vérité du contexte de passage de commande.

## Responsabilités

Le domaine `checkout` prend en charge :

- l’état de readiness du checkout
- la collecte et consolidation des données nécessaires à la commande
- la validation finale avant conversion en commande
- la préparation des snapshots client, facturation, livraison et montants
- la persistance du contexte de checkout
- la machine d’état du checkout
- la production d’un contexte exploitable par `orders`

## Ce que le domaine ne doit pas faire

Le domaine `checkout` ne doit pas :

- porter le panier runtime
- porter le catalogue
- définir seul la vendabilité contextuelle
- définir seul la disponibilité quantitative
- recalculer librement les remises, taxes et totaux sans les domaines concernés
- figer la commande durable
- parler directement aux PSPs ou autres providers externes

Le domaine `checkout` valide et prépare.
Il ne remplace ni `cart`, ni `inventory`, ni `pricing`, ni `shipping`, ni `orders`.

## Sous-domaines

- `readiness` : état prêt / non prêt
- `validation` : blocages et avertissements structurés
- `preparation` : snapshot final transmis à `orders`
- `lifecycle` : cycle de vie `ACTIVE / READY / COMPLETED / EXPIRED / CANCELLED`

## Entrées

Le domaine reçoit principalement :

- un `Cart` runtime
- un contexte client éventuel
- des données d’adresse et de contact
- une sélection de mode de livraison
- un breakdown monétaire consolidé
- des lectures de vendabilité et disponibilité
- des commands de validation et de finalisation

## Sorties

Le domaine expose principalement :

- un `Checkout` persistant
- un état de readiness
- une liste de blocages structurés
- une liste d’avertissements structurés
- un contexte final exploitable par `orders`

## Dépendances vers autres domaines

Le domaine `checkout` dépend de :

- `cart`
- `customers`
- `inventory`
- `sales-policy`
- `shipping`
- `pricing`
- `store`
- `audit`
- `observability`

Les domaines suivants dépendent de `checkout` :

- `orders`
- `analytics`
- `dashboarding`

## Capabilities activables liées

Le domaine `checkout` est lié à :

- `guestCheckout`
- `customerCheckout`
- `pickupPointDelivery`
- `discounts`
- `taxation`
- `exciseTax`

### Effet si `guestCheckout` est activée

Le checkout peut être rattaché à un panier invité.

### Effet si `guestCheckout` est désactivée

Un checkout invité est bloqué côté serveur.

### Effet si `pickupPointDelivery` est activée

La sélection d’un point relais valide devient obligatoire pour les méthodes concernées.

### Effet si `discounts` ou `taxation` est activée

Le checkout consolide les composants monétaires produits par les domaines amont et les fige pour la conversion.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support`
- `customer`

### Permissions

Exemples de permissions concernées :

- `checkout.read`
- `checkout.write`
- `cart.read`
- `shipping.read`
- `pricing.read`
- `customers.read`
- `orders.write`
- `audit.read`

## Événements émis

Le domaine émet les domain events internes suivants :

- `checkout.updated`
- `checkout.ready`
- `checkout.blocked`
- `checkout.completed`
- `checkout.expired`
- `checkout.cancelled`

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `cart.updated`
- `inventory.stock.updated`
- `sales_policy.item.sellability.changed`
- `shipping.method.updated`
- `pricing.evaluated`
- `customer.updated`
- `store.capabilities.updated`

## Intégrations externes

Le domaine `checkout` ne parle pas directement aux systèmes externes.
Les appels PSP, antifraude, logistique externe ou provider-specific relèvent de `payments`, `integrations` ou `jobs`.

Le domaine `checkout` reste la source de vérité interne du contexte validé avant commande.

## Données sensibles / sécurité

Le domaine `checkout` porte une donnée métier critique.

Points de vigilance :

- validation exclusivement côté serveur
- contrôle strict des adresses, contacts, shipping et montants
- interdiction de contourner le flux par le client
- blocages structurés et explicables
- refus de conversion si le checkout n’est pas `READY`

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un checkout est `READY` ou bloqué
- quel champ manque ou est incohérent
- quel composant amont a rendu le checkout invalide
- quel panier et quel client ont servi de base
- pourquoi un checkout a été `COMPLETED`, `EXPIRED` ou `CANCELLED`

### Audit

Il faut tracer :

- les changements d’état du checkout
- les corrections administratives
- les validations sensibles impactant la création de commande
- les annulations ou expirations forcées

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Checkout` : contexte persistant de passage de commande
- `CheckoutStatus` : `ACTIVE`, `READY`, `COMPLETED`, `EXPIRED`, `CANCELLED`
- `CheckoutBlockingIssue` : blocage structuré
- `CheckoutWarning` : avertissement structuré
- `CheckoutPreparation` : snapshot final transmis à `orders`

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un checkout est rattaché à un seul panier
- un panier n’a qu’un seul checkout actif
- un checkout non `READY` ne peut pas créer de commande
- un checkout `COMPLETED` ne peut plus être muté
- les montants et données portés par le checkout sont cohérents avec le panier validé
- le checkout prépare `orders` sans redéfinir la vérité des domaines amont

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’un checkout pour un panier
- mise à jour cohérente des champs de contact, facturation, livraison et montants
- transition `ACTIVE` → `READY` avec validation complète
- transition `READY` → `COMPLETED` lors de la conversion en commande
- transition `ACTIVE` ou `READY` → `EXPIRED` / `CANCELLED`
- écriture des events `checkout.*` correspondants

### Ce qui peut être eventual consistency

Les traitements suivants ont lieu après commit :

- analytics
- projections admin
- webhooks sortants
- notifications non bloquantes
- synchronisations externes

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- unicité d’un checkout par panier
- garde sur le statut avant chaque mutation
- transaction applicative pour les transitions d’état
- revalidation complète juste avant la conversion en commande
- refus de conversion si le panier ou le stock ont changé de manière incompatible

Les conflits attendus sont :

- double soumission du checkout
- mise à jour concurrente du checkout et du panier
- conversion concurrente en commande
- expiration ou annulation concurrente

### Idempotence

Les commandes métier suivantes sont idempotentes :

- `upsert-checkout-from-cart` : clé d’idempotence = `cartId`
- `mark-checkout-ready` : clé d’idempotence = `(checkoutId, validationFingerprint)`
- `complete-checkout` : clé d’idempotence = référence métier de conversion

Un retry sur la même intention ne doit pas produire deux checkouts, deux validations divergentes ou deux complétions.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `checkout.updated`
- `checkout.ready`
- `checkout.blocked`
- `checkout.completed`
- `checkout.expired`
- `checkout.cancelled`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- appel PSP externe
- antifraude externe
- webhook sortant
- email
- synchronisation provider-specific

## Cas d’usage principaux

1. Créer ou mettre à jour un checkout depuis un panier
2. Vérifier si un panier est prêt à être commandé
3. Consolider blocages et avertissements
4. Préparer le contexte final pour `orders`
5. Clore le checkout lors de la conversion en commande

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- panier introuvable
- checkout introuvable
- checkout non `ACTIVE` ou non `READY`
- données de contact ou d’adresse invalides
- méthode de livraison invalide
- montants incohérents
- stock ou vendabilité devenus incompatibles
- double soumission concurrente

## Décisions d’architecture

Les choix structurants du domaine sont :

- `checkout` est un agrégat persistant distinct du panier
- un checkout est unique par panier
- la conversion vers `orders` exige un checkout `READY`
- les events `checkout.*` passent par l’outbox
- le checkout ne parle pas directement aux providers externes
- la finalisation de checkout est atomique et ré-idempotente

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- le panier runtime relève de `cart`
- la validation finale relève de `checkout`
- la commande durable relève de `orders`
- un checkout est persistant et rattaché 1:1 au panier
- les validations critiques restent côté serveur
- les effets externes partent après commit
