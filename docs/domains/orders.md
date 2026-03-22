# Domaine orders

## Rôle

Le domaine `orders` porte la commande figée du socle.

Il représente l’état officiel et durable d’un achat validé, après consolidation par `checkout` et création de la commande dans un cadre transactionnel sûr.

Il constitue la source de vérité interne de la commande métier, distincte du panier runtime, des estimations monétaires préalables et des intégrations externes.

## Responsabilités

Le domaine `orders` prend en charge :

- la création de commande à partir d’un contexte validé
- le figement des lignes de commande
- le figement des montants retenus
- le figement des données client utiles à la commande
- le figement des données de livraison utiles à la commande
- le statut métier de la commande
- les transitions métier de la commande
- la lecture durable de la commande côté boutique, support et pilotage
- la base métier utilisée par `payments`, `documents`, `returns`, `fulfillment`, `analytics` et certaines `integrations`

## Ce que le domaine ne doit pas faire

Le domaine `orders` ne doit pas :

- porter le panier runtime, qui relève de `cart`
- recalculer librement le pricing, qui relève de `pricing`
- recalculer les remises, qui relèvent de `discounts`
- recalculer la fiscalité, qui relève de `taxation`
- décider quelles méthodes de livraison sont disponibles, ce qui relève de `shipping`
- valider à lui seul la readiness avant commande, ce qui relève de `checkout`
- parler directement aux providers externes, ce qui relève de `integrations`
- devenir un domaine fourre-tout mélangeant paiement, documents, fulfillment et SAV

Le domaine `orders` fige et porte la commande métier. Il ne remplace ni `checkout`, ni `payments`, ni `documents`, ni `fulfillment`.

## Sous-domaines

Le domaine peut rester simple au départ, avec :

- `lifecycle` : cycle de vie métier de la commande

## Entrées

Le domaine reçoit principalement :

- un contexte de checkout validé issu de `checkout`
- un breakdown monétaire validé issu de `pricing`
- un contexte client validé
- une sélection de livraison validée
- des lignes panier validées et transformables en lignes de commande
- des demandes de lecture ou de transition de statut métier

## Sorties

Le domaine expose principalement :

- une commande durable
- des lignes de commande figées
- des montants figés
- un statut métier de commande
- un snapshot exploitable par `payments`, `documents`, `returns`, `fulfillment`, `analytics` et l’admin

## Dépendances vers autres domaines

Le domaine `orders` peut dépendre de :

- `checkout` pour n’accepter qu’un contexte validé et préparé
- `pricing` pour les montants figés retenus
- `customers` pour certaines lectures client utiles au snapshot de commande
- `shipping` pour les éléments de livraison retenus
- `store` pour le contexte boutique
- `audit` pour tracer les transitions sensibles
- `observability` pour expliquer certains refus ou transitions métier

Les domaines suivants peuvent dépendre de `orders` :

- `payments`
- `documents`
- `returns`
- `fulfillment`
- `notifications`
- `crm`
- `analytics`
- `dashboarding`
- `integrations`

## Capabilities activables liées

Le domaine `orders` n’est pas une capability optionnelle au sens du noyau, mais il est impacté par plusieurs capabilities amont.

Exemples :

- `guestCheckout`
- `customerCheckout`
- `discounts`
- `taxation`
- `exciseTax`
- `pickupPointDelivery`
- `electronicInvoicing`

### Effet si `guestCheckout` est activée

Le domaine doit supporter des commandes issues d’un contexte invité.

### Effet si `guestCheckout` est désactivée

Le domaine ne doit recevoir que des contextes compatibles avec un compte requis.

### Effet si `discounts`, `taxation` ou `exciseTax` est activée

Le domaine doit figer correctement les montants produits par les domaines amont concernés.

### Effet si `electronicInvoicing` est activée

La commande peut devoir alimenter ensuite des flux documentaires ou d’intégration renforcés, sans que `orders` parle directement au provider externe.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support`
- `customer` pour ses propres commandes selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `orders.read`
- `orders.write`
- `payments.read`
- `documents.read`
- `returns.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `order.created`
- `order.updated`
- `order.cancelled`
- `order.status.changed`
- `order.ready_for_payment`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `checkout.prepared`
- `payment.*` via un langage interne stabilisé si certaines transitions de commande en dépendent
- `fulfillment.*` via un langage interne stabilisé si certaines lectures de statut de commande doivent évoluer

Il doit toutefois rester maître de son propre cycle de vie métier.

## Intégrations externes

Le domaine `orders` ne doit pas parler directement aux systèmes externes.

Les synchronisations vers :

- ERP
- EBP
- outils logistiques
- systèmes comptables
- providers divers

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `orders` reste la source de vérité interne de la commande métier.

## Données sensibles / sécurité

Le domaine `orders` porte une donnée métier critique.

Points de vigilance :

- création de commande protégée par validation serveur stricte
- figement atomique des données critiques
- protection des transitions de statut sensibles
- aucune confiance dans des montants ou statuts envoyés par le client
- contrôle strict des droits de lecture et d’écriture selon le rôle et le scope

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une commande a été créée ou refusée
- quel contexte validé a servi à la création
- quel statut métier est en vigueur
- pourquoi une transition de statut a été acceptée ou refusée
- si un problème provient du contexte checkout, du pricing, du paiement ou d’un processus aval

### Audit

Il faut tracer :

- la création de commande
- les transitions de statut sensibles
- les annulations
- certaines interventions support ou administratives importantes
- les changements manuels impactant durablement la commande

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Order` : commande métier durable
- `OrderLine` : ligne de commande figée
- `OrderStatus` : statut métier de la commande
- `OrderTotalsSnapshot` : snapshot monétaire figé
- `OrderCustomerSnapshot` : snapshot client utile à la commande
- `OrderShippingSnapshot` : snapshot livraison utile à la commande

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une commande possède un identifiant stable
- une commande n’est créée qu’à partir d’un contexte checkout validé
- les montants de commande sont figés au moment de la création
- les lignes de commande sont figées au moment de la création
- `orders` ne recalcule pas librement les montants validés par les domaines amont
- le cycle de vie métier de la commande est explicite
- les autres domaines ne doivent pas recréer leur propre vérité divergente de la commande

## Cas d’usage principaux

1. Créer une commande à partir d’un checkout validé
2. Lire une commande et ses lignes figées
3. Lire les montants figés de la commande
4. Faire évoluer le statut métier de la commande selon les règles autorisées
5. Exposer une base fiable à `payments`, `documents`, `returns` et `fulfillment`
6. Permettre aux interfaces admin et support de consulter la commande durable

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- commande introuvable
- contexte checkout invalide ou incomplet
- tentative de création concurrente ou dupliquée
- transition de statut invalide
- modification interdite d’une commande figée
- incohérence entre snapshot de commande et données amont attendues

## Décisions d’architecture

Les choix structurants du domaine sont :

- `orders` porte la commande durable du socle
- `orders` est distinct de `cart`
- `orders` est distinct de `checkout`
- `orders` est distinct de `payments`
- `orders` est distinct de `documents`
- la création de commande repose sur un contexte préparé par `checkout`
- les montants et snapshots sont figés au moment de la création dans un cadre transactionnel adapté
- les systèmes externes consomment la commande via `integrations`, sans redéfinir la vérité interne

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la commande durable relève de `orders`
- le panier runtime relève de `cart`
- la validation finale relève de `checkout`
- les paiements relèvent de `payments`
- les documents relèvent de `documents`
- `orders` ne remplace ni `cart`, ni `checkout`, ni `payments`, ni `documents`, ni `integrations`
