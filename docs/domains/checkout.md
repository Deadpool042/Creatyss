# Domaine checkout

## Rôle

Le domaine `checkout` porte la validation finale avant commande.

Il décide si un panier est prêt à être transformé en commande, en consolidant les blocages, avertissements, exigences manquantes et validations nécessaires avant le figement dans `orders`.

## Responsabilités

Le domaine `checkout` prend en charge :

- la readiness du checkout
- la validation finale avant création de commande
- la consolidation des blocages métier
- la consolidation des avertissements non bloquants
- la vérification de cohérence entre panier, client, livraison, pricing et fiscalité
- la préparation du contexte de création de commande
- la production d’un résultat exploitable par `orders`

## Ce que le domaine ne doit pas faire

Le domaine `checkout` ne doit pas :

- porter le panier, qui relève de `cart`
- porter le catalogue, qui relève de `products`
- décider seul de la vendabilité, qui relève de `sales-policy`
- porter le stock quantitatif, qui relève de `inventory`
- calculer les remises, taxes ou totaux, qui relèvent de `discounts`, `taxation` et `pricing`
- décider quelles méthodes de livraison existent, ce qui relève de `shipping`
- figer la commande elle-même, ce qui relève de `orders`
- devenir un simple écran UI ou une suite de validations côté client

Le domaine `checkout` valide et prépare. Il ne remplace pas les domaines amont, ni le domaine `orders`.

## Sous-domaines

- `readiness` : lecture de l’état prêt / non prêt au checkout
- `preparation` : préparation du contexte final exploitable pour la création de commande

## Entrées

Le domaine reçoit principalement :

- un panier runtime issu de `cart`
- un contexte client issu de `customers` si applicable
- une lecture de disponibilité issue de `inventory`
- une lecture de vendabilité issue de `sales-policy`
- une sélection ou une quote de livraison issue de `shipping`
- un breakdown monétaire issu de `pricing`
- les capabilities actives de la boutique
- les données nécessaires au passage de commande (adresse, choix de livraison, contexte ownership, etc.)

## Sorties

Le domaine expose principalement :

- un état de checkout prêt / non prêt
- une liste de blocages explicites
- une liste d’avertissements explicites
- un contexte préparé pour `orders`
- une lecture consolidée des validations effectuées

## Dépendances vers autres domaines

Le domaine `checkout` peut dépendre de :

- `cart`
- `customers`
- `inventory`
- `sales-policy`
- `shipping`
- `pricing`
- `store`
- `audit`
- `observability`

Les domaines suivants peuvent dépendre de `checkout` :

- `orders`
- `analytics`
- `dashboarding`

## Capabilities activables liées

Le domaine `checkout` est particulièrement lié à :

- `guestCheckout`
- `customerCheckout`
- `pickupPointDelivery`
- `discounts`
- `taxation`
- `exciseTax`

### Effet si `guestCheckout` est activée

Le domaine peut valider un panier invité dans les conditions prévues.

### Effet si `guestCheckout` est désactivée

Un contexte invité doit être bloqué si un compte est requis pour commander.

### Effet si `customerCheckout` est activée

Le checkout client connecté est pleinement supporté.

### Effet si `pickupPointDelivery` est activée

Le domaine peut exiger qu’un point relais valide soit sélectionné pour les méthodes concernées.

### Effet si `discounts`, `taxation` ou `exciseTax` est activée

Le domaine attend et consolide les composants monétaires produits par les domaines concernés.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support` en lecture partielle selon la politique retenue
- `customer` pour son propre parcours d’achat

### Permissions

Exemples de permissions concernées :

- `cart.read`
- `orders.read`
- `orders.write`
- `shipping.read`
- `pricing.read`
- `customers.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `checkout.readiness.changed`
- `checkout.blocked`
- `checkout.prepared`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `cart.updated`
- `shipping.method.selected`
- `shipping.quote.updated`
- `pricing.evaluated`
- `taxation.breakdown.changed`
- `discount.evaluation.changed`
- `store.capabilities.updated`
- `customer.updated`

Il doit toutefois rester maître de sa propre consolidation finale.

## Intégrations externes

Le domaine `checkout` ne doit pas parler directement aux systèmes externes.

Les appels vers :

- PSP
- systèmes de fraude
- systèmes logistiques
- providers externes divers

relèvent d’autres domaines comme `payments`, `fraud-risk`, `integrations` ou `jobs`.

Le domaine `checkout` reste la source de vérité interne de la validation finale avant commande.

## Données sensibles / sécurité

Le domaine `checkout` porte une donnée métier critique, car il détermine si une commande peut être créée.

Points de vigilance :

- aucune confiance dans les validations côté client
- consolidation côté serveur obligatoire
- cohérence stricte entre panier, shipping, pricing et contexte client
- validation stricte des entrées nécessaires à la commande
- protection contre les contournements de flux

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un checkout est prêt ou non
- quel blocage empêche la création de commande
- quel composant amont est invalide ou manquant
- quel capability ou contexte a influencé la décision

### Audit

Le domaine `checkout` n’a pas vocation à auditer chaque recalcul de readiness.

En revanche, certaines opérations sensibles peuvent être tracées, notamment :

- des changements administrés affectant les règles de validation
- certaines interventions support importantes sur un parcours de commande

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `CheckoutReadiness` : état consolidé prêt / non prêt
- `CheckoutBlockingIssue` : blocage empêchant la commande
- `CheckoutWarning` : avertissement non bloquant
- `CheckoutPreparation` : contexte final préparé pour la création de commande

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un checkout non prêt ne peut pas créer de commande
- les blocages sont explicites et structurés
- `checkout` ne recalcule pas localement des logiques métier qui appartiennent aux domaines amont ; il les consolide
- `checkout` ne remplace pas `orders`
- le résultat préparé pour `orders` doit être cohérent avec les données validées à l’instant du passage de commande

## Cas d’usage principaux

1. Vérifier si un panier est prêt à passer commande
2. Consolider les blocages liés au panier, au client, à la livraison et au pricing
3. Signaler les avertissements non bloquants
4. Exiger les données manquantes nécessaires à la commande
5. Préparer un contexte final exploitable par `orders`
6. Refuser la création de commande si un blocage subsiste

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- panier introuvable
- panier vide
- ligne non vendable ou non disponible
- méthode de livraison manquante ou invalide
- quote de livraison manquante ou incohérente
- contexte client incompatible avec les capabilities actives
- breakdown pricing ou fiscal incomplet
- données de commande requises manquantes

## Décisions d’architecture

Les choix structurants du domaine sont :

- `checkout` porte la validation finale avant commande
- `checkout` est distinct de `cart`
- `checkout` est distinct de `pricing`
- `checkout` est distinct de `shipping`
- `checkout` est distinct de `orders`
- `checkout` consolide les décisions amont au lieu de les redéfinir localement
- `orders` ne doit être appelé qu’avec un contexte validé et préparé par `checkout`

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la validation finale avant commande relève de `checkout`
- le panier runtime relève de `cart`
- le figement de la commande relève de `orders`
- `checkout` ne remplace ni `cart`, ni `pricing`, ni `shipping`, ni `orders`
- les validations critiques du parcours de commande doivent rester côté serveur et être explicitables
