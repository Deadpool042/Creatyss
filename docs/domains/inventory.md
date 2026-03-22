# Domaine inventory

## Rôle

Le domaine `inventory` porte la disponibilité quantitative et les politiques de stock du socle.

Il décrit la capacité réelle d’un produit ou d’une variante à être servi en quantité, selon les règles de stock, de rupture, de précommande, de backorder ou d’autres politiques d’approvisionnement compatibles avec le socle.

## Responsabilités

Le domaine `inventory` prend en charge :

- le stock quantitatif
- la disponibilité en quantité
- les politiques de gestion de stock
- les ruptures
- les backorders
- les preorders
- les règles de décrémentation ou de réservabilité selon le modèle retenu
- la lecture quantitative utilisée par `cart`, `sales-policy`, `checkout`, `orders` et `fulfillment`

## Ce que le domaine ne doit pas faire

Le domaine `inventory` ne doit pas :

- décrire le catalogue produit source, qui relève de `products`
- décider seul si un produit est vendable dans un contexte donné, ce qui relève de `sales-policy`
- calculer les prix, remises ou taxes, qui relèvent de `pricing`, `discounts` et `taxation`
- porter la logique panier, commande ou checkout complète
- devenir un domaine d’ERP ou d’approvisionnement complet par défaut

Le domaine `inventory` porte la quantité disponible et la politique de disponibilité quantitative, pas l’ensemble du commerce.

## Sous-domaines

- `stock` : lecture et écriture des quantités
- `availability` : lecture de disponibilité quantitative exploitable par les autres domaines
- `policies` : règles de stock, rupture, preorder, backorder, etc.

## Entrées

Le domaine reçoit principalement :

- des mises à jour de stock
- des événements de consommation ou de libération de stock
- des demandes de lecture de disponibilité quantitative
- des changements de politique de stock
- des besoins de validation d’une quantité demandée

## Sorties

Le domaine expose principalement :

- une lecture de stock courant
- une lecture de disponibilité quantitative
- des états de rupture ou de disponibilité limitée
- des politiques applicables à un item stocké
- une réponse exploitable par `cart`, `checkout`, `orders` et `fulfillment`

## Dépendances vers autres domaines

Le domaine `inventory` peut dépendre de :

- `products` pour rattacher les niveaux de stock à des produits ou variantes existants
- `audit` pour tracer les changements sensibles de stock
- `observability` pour diagnostiquer des incohérences ou des refus de disponibilité
- `workflow` ou `approval` si certaines opérations de stock doivent être validées

Les domaines suivants peuvent dépendre de `inventory` :

- `sales-policy`
- `cart`
- `checkout`
- `orders`
- `fulfillment`
- `analytics`
- `recommendations`

## Capabilities activables liées

Le domaine `inventory` est directement lié à :

- `backorders`
- `preorders`

### Effet si `backorders` est activée

Le domaine peut exposer une disponibilité compatible avec commande en rupture sous certaines règles.

### Effet si `backorders` est désactivée

Une rupture bloque la disponibilité quantitative, sauf autre politique explicitement active.

### Effet si `preorders` est activée

Le domaine peut exposer une disponibilité de précommande selon la politique retenue.

### Effet si `preorders` est désactivée

La précommande n’est pas proposée.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `catalog_manager`
- `order_manager`
- éventuellement `customer_support` en lecture selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `inventory.read`
- `inventory.write`
- `orders.read`
- `orders.write`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `inventory.stock.updated`
- `inventory.item.out_of_stock`
- `inventory.item.backorder_enabled`
- `inventory.item.preorder_enabled`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `order.created`
- `order.cancelled`
- `order.paid` selon la stratégie de réservation/décrémentation retenue
- événements de fulfillment si la consommation réelle de stock est liée à l’exécution logistique

Le domaine doit toutefois rester maître de ses propres invariants quantitatifs.

## Intégrations externes

Le domaine `inventory` ne doit pas dépendre directement d’un système externe comme source de vérité métier principale.

Si une synchronisation de stock externe existe, elle doit passer par :

- `integrations`
- et éventuellement `jobs`

Le domaine `inventory` reste la source de vérité interne de la disponibilité quantitative dans le socle.

## Données sensibles / sécurité

Le domaine `inventory` porte une donnée métier critique.

Points de vigilance :

- contrôle strict des droits d’écriture
- audit des corrections ou ajustements sensibles
- traçabilité des variations significatives de stock
- protection contre les mises à jour concurrentes incohérentes

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelle quantité a été retenue comme disponible
- quelle politique de stock a été appliquée
- pourquoi une quantité demandée a été acceptée, réduite ou refusée
- pourquoi un item est considéré en rupture, en backorder ou en preorder

### Audit

Il faut tracer :

- les ajustements de stock significatifs
- les changements de politique de stock
- les opérations critiques impactant la disponibilité quantitative

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `InventoryItem` : lecture de stock associée à un produit ou une variante
- `InventoryStockLevel` : niveau quantitatif courant
- `InventoryAvailability` : lecture exploitable de disponibilité
- `InventoryPolicy` : politique appliquée à l’item (rupture, backorder, preorder, etc.)

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un enregistrement de stock est rattaché explicitement à un item catalogue valide
- la disponibilité quantitative ne se confond pas avec la vendabilité contextuelle
- la quantité disponible doit être lue via `inventory`, pas reconstituée localement dans d’autres domaines
- les politiques de backorder et preorder sont explicites
- `inventory` ne remplace ni `products`, ni `sales-policy`, ni `orders`

## Cas d’usage principaux

1. Lire le niveau de stock d’un item
2. Savoir si une quantité demandée est disponible
3. Signaler une rupture de stock
4. Activer ou désactiver un mode backorder
5. Activer ou désactiver un mode preorder
6. Exposer aux autres domaines une lecture fiable de disponibilité quantitative
7. Ajuster le stock suite à une opération métier autorisée

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- item de stock introuvable
- rattachement à un produit ou une variante invalide
- quantité incohérente
- tentative d’opération non autorisée sur le stock
- politique incompatible avec les capabilities activées
- concurrence ou désynchronisation de stock détectée

## Décisions d’architecture

Les choix structurants du domaine sont :

- `inventory` porte la disponibilité quantitative du socle
- `inventory` est distinct de `products`
- `inventory` est distinct de `sales-policy`
- les backorders et preorders sont pilotés comme politiques explicites, activées par capability
- les autres domaines consomment `inventory` au lieu de recalculer localement la quantité disponible
- les synchronisations externes de stock éventuelles passent par `integrations`

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- le stock relève de `inventory`
- la vendabilité contextuelle ne relève pas uniquement de `inventory`
- le domaine `products` ne porte pas le stock quantitatif
- `inventory` ne remplace ni `products`, ni `sales-policy`, ni `orders`
- les politiques de backorder et preorder sont explicites et pilotées par capability
