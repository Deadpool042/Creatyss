# Domaine `inventory`

> **Statut documentaire** : satellite de `availability`.
> Le domaine canonique est [`core/availability.md`](../core/availability.md).
> `inventory` spécialise la vérité quantitative de stock. C'est une déclinaison subordonnée d'`availability`, pas un domaine autonome de premier rang.
> Voir [`docs/architecture/03`](../../architecture/03-core-domains-and-toggleable-capabilities.md) — "availability ou inventory selon la structuration retenue".

## Rôle

Le domaine `inventory` porte la vérité quantitative du stock du socle.
Il décrit la capacité réelle d’une variante à être servie en quantité, selon une politique explicite de disponibilité.

## Responsabilités

Le domaine `inventory` prend en charge :

- le stock quantitatif
- la disponibilité quantitative
- la politique de stock par variante
- les réservations et libérations de stock
- les décrémentations liées aux ventes
- les ajustements de stock
- la lecture quantitative utilisée par `cart`, `checkout`, `orders` et `fulfillment`

## Ce que le domaine ne doit pas faire

Le domaine `inventory` ne doit pas :

- porter le catalogue produit source
- décider seul de toute la vendabilité contextuelle
- recalculer le pricing
- porter la logique panier, checkout ou commande complète
- devenir un ERP complet

Le domaine `inventory` porte la vérité quantitative du stock.
Il ne remplace ni `products`, ni `sales-policy`, ni `cart`, ni `checkout`, ni `orders`.

## Sous-domaines

- `items` : item de stock par variante
- `availability` : lecture de quantité disponible
- `reservation` : stock réservé pour commandes en cours
- `adjustments` : historique d’ajustements
- `policies` : `TRACK`, `DENY_OUT_OF_STOCK`, `ALLOW_BACKORDERS`, `ALLOW_PREORDERS`, `INFINITE`

## Entrées

Le domaine reçoit principalement :

- des demandes de lecture de disponibilité
- des demandes de réservation ou libération
- des demandes de décrémentation liées à une vente
- des demandes d’ajustement manuel ou de réception
- des changements de politique de stock

## Sorties

Le domaine expose principalement :

- un `InventoryItem`
- une lecture de quantité disponible
- une lecture de quantité réservée
- une politique de disponibilité
- un historique d’ajustements

## Dépendances vers autres domaines

Le domaine `inventory` dépend de :

- `products` pour le rattachement à une variante
- `audit` pour tracer les corrections sensibles
- `observability` pour diagnostiquer les refus ou incohérences
- `orders` pour les intentions de consommation ou restitution
- `fulfillment` pour l’exécution logistique

Les domaines suivants dépendent de `inventory` :

- `sales-policy`
- `cart`
- `checkout`
- `orders`
- `fulfillment`
- `analytics`

## Capabilities activables liées

Le domaine `inventory` est lié à :

- `backorders`
- `preorders`

### Effet si `backorders` est activée

La politique `ALLOW_BACKORDERS` devient exploitable.

### Effet si `backorders` est désactivée

Une rupture bloque la disponibilité sous politique non permissive.

### Effet si `preorders` est activée

La politique `ALLOW_PREORDERS` devient exploitable.

### Effet si `preorders` est désactivée

La précommande est rejetée.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `catalog_manager`
- `order_manager`
- `customer_support` en lecture

### Permissions

Exemples de permissions concernées :

- `inventory.read`
- `inventory.write`
- `inventory.adjust`
- `orders.read`
- `orders.write`
- `audit.read`

## Événements émis

Le domaine émet les domain events internes suivants :

- `inventory.item.created`
- `inventory.stock.adjusted`
- `inventory.stock.reserved`
- `inventory.stock.released`
- `inventory.stock.decremented`
- `inventory.item.out_of_stock`
- `inventory.policy.changed`

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `order.created`
- `order.cancelled`
- `order.completed`
- `fulfillment.shipped`
- `fulfillment.returned`

## Intégrations externes

Le domaine `inventory` ne dépend pas directement d’une source externe comme vérité primaire.
Les synchronisations externes passent par `integrations` et `jobs`.

Le domaine `inventory` reste la source de vérité interne de la disponibilité quantitative.

## Données sensibles / sécurité

Le domaine `inventory` porte une donnée métier critique.

Points de vigilance :

- contrôle strict des droits d’écriture
- audit des ajustements et corrections
- protection contre les mises à jour concurrentes incohérentes
- justification structurée des ajustements
- lecture cohérente de `quantityOnHand`, `quantityReserved` et `quantityAvailable`

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelle quantité a été retenue comme disponible
- quelle politique de stock a été appliquée
- pourquoi une réservation ou un décrément a été accepté ou refusé
- pourquoi un item est en rupture, en backorder ou en preorder

### Audit

Il faut tracer :

- les ajustements de stock
- les changements de politique
- les réservations et libérations significatives
- les corrections manuelles
- les opérations liées aux commandes et retours

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `InventoryItem` : stock d’une variante
- `InventoryPolicyKind` : politique de disponibilité
- `InventoryAdjustment` : variation tracée de stock
- `QuantityOnHand` : quantité physiquement détenue
- `QuantityReserved` : quantité déjà engagée
- `QuantityAvailable` : quantité exposée à la vente

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un `InventoryItem` est rattaché à une variante valide
- `quantityAvailable` est cohérente avec la politique et les quantités sous-jacentes
- la vérité quantitative ne se reconstitue pas dans les autres domaines
- toute variation de stock durable laisse une trace explicite
- une opération métier ne peut pas produire un stock incohérent

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’un `InventoryItem`
- changement de politique de stock
- réservation de stock et écriture de l’ajustement associé
- libération de stock et écriture de l’ajustement associé
- décrémentation de stock et écriture de l’ajustement associé
- correction manuelle et écriture de l’ajustement associé
- écriture des events `inventory.*` correspondants

### Ce qui peut être eventual consistency

Les traitements suivants ont lieu après commit :

- projections admin
- analytics
- webhooks sortants
- synchronisations externes
- notifications internes non bloquantes

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- une transaction applicative sur chaque mutation quantitative
- une lecture et écriture cohérentes du même `InventoryItem`
- un refus complet si la quantité disponible ne couvre pas l’opération
- une écriture d’ajustement dans la même transaction que la variation
- une seule vérité quantitative par variante

Les conflits attendus sont :

- deux réservations concurrentes sur la même variante
- une réservation et une correction manuelle concurrentes
- un décrément et une annulation concurrents
- une mise à jour concurrente de politique de stock

### Idempotence

Les commandes métier suivantes sont idempotentes :

- `reserve-stock` : clé d’idempotence = `(inventoryItemId, referenceKind, referenceId)`
- `release-stock` : clé d’idempotence = `(inventoryItemId, referenceKind, referenceId, releaseIntentId)`
- `adjust-stock` : clé d’idempotence = `(inventoryItemId, referenceKind, referenceId, adjustmentKind)`

Un retry de la même intention ne doit jamais doubler une réservation, une libération ou un ajustement.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `inventory.stock.adjusted`
- `inventory.stock.reserved`
- `inventory.stock.released`
- `inventory.stock.decremented`
- `inventory.item.out_of_stock`
- `inventory.policy.changed`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- synchronisation externe de stock
- webhook sortant
- analytics
- notification
- recalcul de projection secondaire

## Cas d’usage principaux

1. Lire le niveau de stock d’une variante
2. Savoir si une quantité demandée est disponible
3. Réserver du stock pour une commande
4. Libérer du stock à l’annulation
5. Décrémenter ou ajuster le stock
6. Modifier la politique de disponibilité

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- item de stock introuvable
- variante invalide
- quantité incohérente
- politique incompatible
- stock insuffisant
- tentative d’ajustement non autorisée
- conflit concurrent détecté

## Décisions d’architecture

Les choix structurants du domaine sont :

- `inventory` porte la vérité quantitative du socle
- la disponibilité repose sur une politique explicite
- toute variation durable de stock écrit un ajustement
- la réservation, la libération et la décrémentation sont transactionnelles
- les events `inventory.*` passent par l’outbox
- les synchronisations externes sont découplées du commit métier

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- le stock relève de `inventory`
- le catalogue relève de `products`
- la vendabilité contextuelle ne relève pas uniquement de `inventory`
- les politiques de backorder et preorder sont explicites
- les écritures quantitatives critiques sont atomiques
- les intégrations externes ne sont pas la vérité primaire du stock
