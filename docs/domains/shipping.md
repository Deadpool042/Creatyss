# Domaine shipping

## Rôle

Le domaine `shipping` porte la logique de livraison du socle.

Il décide quelles méthodes de livraison sont disponibles pour un contexte donné, dans quelles zones, avec quelles contraintes, quels coûts estimés et quelles exigences spécifiques comme le domicile, le point relais ou d’autres modalités de remise compatibles avec le socle.

## Responsabilités

Le domaine `shipping` prend en charge :

- les transporteurs
- les méthodes de livraison
- les zones de livraison
- l’éligibilité des méthodes selon le contexte
- les quotes de livraison
- la sélection d’une méthode de livraison
- la distinction domicile / point relais / autres modalités compatibles
- les contraintes de livraison dépendant du contexte boutique, du panier, du pays ou d’autres règles explicites
- la lecture exploitable par `checkout`, `pricing`, `orders` et `documents`

## Ce que le domaine ne doit pas faire

Le domaine `shipping` ne doit pas :

- porter le panier, qui relève de `cart`
- porter le catalogue source, qui relève de `products`
- porter la vendabilité contextuelle globale, qui relève de `sales-policy`
- porter le stock quantitatif, qui relève de `inventory`
- calculer l’ensemble du pricing transverse, qui relève de `pricing`
- parler directement aux providers externes, ce qui relève de `integrations`
- devenir le domaine de fulfillment logistique réel, qui relève de `fulfillment`

Le domaine `shipping` décide la livraison possible et son estimation. Il ne remplace ni `cart`, ni `pricing`, ni `fulfillment`.

## Sous-domaines

- `methods` : méthodes de livraison disponibles
- `zones` : zones géographiques ou logiques de livraison
- `quotes` : calcul ou lecture des estimations de livraison
- `selection` : choix d’une méthode de livraison pour un contexte donné
- `pickup-points` : logique spécifique aux points relais ou assimilés

## Entrées

Le domaine reçoit principalement :

- un contexte panier
- un contexte boutique
- un contexte géographique
- les capabilities actives de la boutique
- éventuellement des données client ou adresse
- des demandes de lecture des méthodes disponibles
- des demandes de calcul de quote
- des demandes de sélection de méthode

## Sorties

Le domaine expose principalement :

- une liste de méthodes de livraison éligibles
- une ou plusieurs quotes monétaires de livraison
- une décision de sélection de méthode
- des raisons explicites de refus ou d’inéligibilité
- une lecture exploitable par `checkout`, `pricing`, `orders` et `documents`

## Dépendances vers autres domaines

Le domaine `shipping` peut dépendre de :

- `cart` pour le contexte panier runtime
- `products` pour certaines contraintes produit utiles à la livraison
- `sales-policy` pour vérifier certaines conditions de vente si nécessaire
- `store` pour le contexte boutique et les capabilities actives
- `pricing` pour la représentation monétaire commune, sans lui déléguer la décision métier de shipping
- `audit` pour tracer certains changements sensibles
- `observability` pour expliquer l’inéligibilité d’une méthode ou l’absence de quote

Les domaines suivants peuvent dépendre de `shipping` :

- `pricing`
- `checkout`
- `orders`
- `documents`
- `analytics`
- `dashboarding`

## Capabilities activables liées

Le domaine `shipping` est directement lié à :

- `multiCarrier`
- `pickupPointDelivery`

### Effet si `multiCarrier` est activée

Le domaine peut exposer plusieurs transporteurs et plusieurs familles de méthodes.

### Effet si `multiCarrier` est désactivée

Le domaine reste structurellement présent, mais n’expose qu’un transporteur ou une famille de livraison par politique de boutique.

### Effet si `pickupPointDelivery` est activée

Le domaine peut exposer des méthodes de type point relais et les contraintes associées.

### Effet si `pickupPointDelivery` est désactivée

Aucune méthode de type point relais ne doit être proposée.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support` en lecture partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `shipping.read`
- `shipping.write`
- `orders.read`
- `orders.write`
- `pricing.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `shipping.method.selected`
- `shipping.quote.updated`
- `shipping.zone.updated`
- `shipping.method.availability.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `cart.updated`
- `store.capabilities.updated`
- `customer.updated` si certaines préférences ou données client impactent le shipping
- événements d’administration liés aux changements de zones ou de méthodes

Il doit toutefois rester maître de sa propre logique de livraison et d’éligibilité.

## Intégrations externes

Le domaine `shipping` ne parle pas directement aux systèmes externes.

Les appels vers :

- transporteurs
- providers de point relais
- systèmes logistiques externes

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `shipping` reste la source de vérité interne de la décision métier de livraison et de la quote interne.

## Données sensibles / sécurité

Le domaine `shipping` ne porte pas des secrets techniques par lui-même, mais il porte une logique métier sensible car elle impacte le coût et la faisabilité de la livraison.

Points de vigilance :

- contrôle strict des droits d’écriture sur zones et méthodes
- cohérence entre capabilities actives et méthodes proposées
- aucune confiance dans une quote envoyée par le client
- séparation nette entre décision métier de shipping et appel provider externe

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une méthode de livraison est éligible ou non
- pourquoi une quote est disponible, absente ou refusée
- quelle zone a été retenue
- quelle capability a influencé la décision
- si un problème vient de la logique métier ou d’une intégration externe

### Audit

Il faut tracer :

- les changements de zones de livraison
- les changements de méthodes de livraison
- les changements significatifs de règles de shipping
- certaines sélections ou corrections manuelles sensibles si elles résultent d’une action humaine importante

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ShippingMethod` : méthode de livraison
- `ShippingZone` : zone de livraison
- `ShippingQuote` : estimation monétaire de livraison
- `ShippingSelection` : sélection de méthode pour un contexte donné
- `PickupPoint` : point relais ou point de retrait si cette capacité est active
- `ShippingRejectionReason` : raison explicite d’inéligibilité ou d’absence de quote

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une méthode de livraison est explicite
- une quote de livraison est monétaire et porte une devise explicite
- l’éligibilité d’une méthode dépend d’un contexte explicite
- le domaine `shipping` ne dépend pas directement du provider externe comme source de vérité
- les autres domaines consomment `shipping` au lieu de reconstruire localement leurs propres règles de livraison
- le domaine `shipping` reste distinct de `fulfillment`

## Cas d’usage principaux

1. Lister les méthodes de livraison disponibles pour un panier donné
2. Déterminer la zone de livraison applicable
3. Calculer ou exposer une quote de livraison
4. Sélectionner une méthode de livraison
5. Proposer un point relais si la capability correspondante est active
6. Exposer au checkout une lecture fiable des choix de livraison disponibles
7. Exposer au pricing une quote de livraison monétaire cohérente

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- méthode de livraison introuvable
- zone introuvable
- contexte géographique non supporté
- capability transport ou point relais désactivée
- quote impossible à calculer
- sélection de méthode invalide pour le contexte courant
- conflit entre contexte panier et contraintes d’une méthode de livraison

## Décisions d’architecture

Les choix structurants du domaine sont :

- `shipping` porte la logique métier de livraison
- `shipping` est distinct de `cart`
- `shipping` est distinct de `pricing`
- `shipping` est distinct de `integrations`
- `shipping` expose une décision métier et une quote interne, puis `integrations` parle aux systèmes externes si nécessaire
- `shipping` reste distinct de `fulfillment`, qui porte l’exécution logistique réelle
- les décisions de shipping doivent être explicables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la logique de livraison relève de `shipping`
- les zones de livraison relèvent de `shipping`
- les points relais relèvent de `shipping` tant que l’on parle de choix de livraison, pas d’intégration provider brute
- l’appel réel aux providers externes relève de `integrations`
- `shipping` ne remplace ni `cart`, ni `pricing`, ni `fulfillment`, ni `integrations`
