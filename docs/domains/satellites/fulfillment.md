# Domaine fulfillment

## Rôle

Le domaine `fulfillment` porte l’exécution logistique métier post-commande du socle.

Il organise la préparation, l’allocation, le picking, le packing, l’expédition, la remise ou la mise à disposition d’une commande ou de ses lignes, sans absorber la commande durable, le choix des méthodes de livraison, le paiement, les retours ou les intégrations transporteurs providers externes.

## Responsabilités

Le domaine `fulfillment` prend en charge :

- la préparation logistique d’une commande
- l’allocation des lignes à exécuter
- le picking et le packing au niveau métier
- les états d’exécution logistique
- les expéditions ou remises au niveau métier
- la mise à disposition pour retrait si le modèle retenu le prévoit
- la lecture gouvernée de l’état de fulfillment d’une commande ou de ses lignes
- la base logistique consommable par `orders`, `returns`, `documents`, `notifications`, `dashboarding`, `observability` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `fulfillment` ne doit pas :

- porter la commande durable, qui relève de `orders`
- porter le choix des méthodes, tarifs ou zones de livraison, qui relève de `shipping`
- porter le paiement, qui relève de `payments`
- porter les retours, qui relèvent de `returns`
- porter les intégrations transporteurs ou points relais providers externes, qui relèvent de `integrations`
- devenir un simple reflet technique des statuts transporteurs externes sans langage métier interne clair
- absorber la gestion globale d’inventaire si celle-ci relève de `inventory`

Le domaine `fulfillment` porte l’exécution logistique métier. Il ne remplace ni `orders`, ni `shipping`, ni `payments`, ni `returns`, ni `integrations`.

## Sous-domaines

- `preparation` : préparation des commandes ou lignes à exécuter
- `allocation` : allocation des lignes ou quantités à un flux d’exécution
- `shipment` : expédition, remise ou mise à disposition au niveau métier
- `status` : états de fulfillment et transitions d’exécution logistique
- `policies` : règles de regroupement, de découpage, d’exécution ou de remise

## Entrées

Le domaine reçoit principalement :

- des commandes durables issues de `orders`
- des lignes de commande à exécuter
- des informations de livraison retenues issues de `shipping` ou du snapshot de commande
- des demandes de préparation, d’expédition, de remise ou de mise à disposition
- des demandes de lecture de l’état de fulfillment d’une commande, d’un lot ou d’une ligne
- des événements ou signaux internes utiles à la progression logistique

## Sorties

Le domaine expose principalement :

- des objets de fulfillment structurés
- des états de préparation et d’expédition au niveau métier
- des regroupements ou découpages d’exécution logistique
- des lectures exploitables par `orders`, `returns`, `documents`, `notifications`, `dashboarding`, `observability` et certaines couches d’administration
- des signaux logiques indiquant qu’une commande ou certaines lignes sont prêtes, expédiées, remises, partielles ou bloquées

## Dépendances vers autres domaines

Le domaine `fulfillment` peut dépendre de :

- `orders` pour la commande durable et les lignes à exécuter
- `shipping` pour les modalités logistiques retenues au moment de la commande
- `inventory` pour certaines disponibilités ou allocations si ce domaine existe séparément
- `documents` pour certains documents logistiques ou états documentaires utiles sans absorber leur responsabilité
- `notifications` pour informer des changements d’état, sans absorber sa responsabilité
- `audit` pour tracer certaines interventions logistiques sensibles
- `observability` pour expliquer pourquoi une exécution logistique progresse, bloque ou reste partielle
- `stores` pour le contexte boutique et certaines politiques locales d’exécution

Les domaines suivants peuvent dépendre de `fulfillment` :

- `orders`
- `returns`
- `documents`
- `notifications`
- `dashboarding`
- `analytics`
- certaines couches d’administration boutique et plateforme

## Capabilities activables liées

Le domaine `fulfillment` est directement ou indirectement lié à :

- `pickupPointDelivery`
- `multiCarrier`
- `returns`
- `notifications`

Le domaine `fulfillment` lui-même est structurellement présent dès qu’une commande doit être exécutée physiquement ou remise via un mode logistique.

### Effet si `pickupPointDelivery` est activée

Le domaine peut gérer la mise à disposition ou certains états de retrait liés aux commandes concernées.

### Effet si `multiCarrier` est activée

Le domaine peut devoir gérer plus de cas d’exécution ou de découpage logistique, sans absorber les connecteurs providers eux-mêmes.

### Effet si `returns` est activée

Le domaine peut être plus fortement corrélé aux états amont ou aval de retour, sans absorber leur responsabilité.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support` en lecture partielle selon la politique retenue
- certains opérateurs logistiques dédiés selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `fulfillment.read`
- `fulfillment.write`
- `orders.read`
- `shipping.read`
- `returns.read`
- `documents.read`
- `notifications.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `fulfillment.created`
- `fulfillment.preparation.started`
- `fulfillment.prepared`
- `fulfillment.shipped`
- `fulfillment.delivered`
- `fulfillment.ready_for_pickup`
- `fulfillment.status.changed`
- `fulfillment.blocked`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `order.created`
- `order.cancelled`
- `payment.captured` si certaines exécutions dépendent d’un état de paiement
- `shipping.selection.confirmed` si ce langage interne est stabilisé
- `inventory.allocation.changed` si ce langage interne est stabilisé
- `store.capabilities.updated`
- certaines actions administratives structurées de préparation, remise ou expédition

Il doit toutefois rester maître de sa propre logique d’exécution logistique métier.

## Intégrations externes

Le domaine `fulfillment` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être corrélé à des transporteurs, points relais ou systèmes logistiques externes via `integrations`, mais :

- la vérité du fulfillment métier interne reste dans `fulfillment`
- les DTO transporteurs ou providers restent dans `integrations`
- les méthodes et options de livraison restent dans `shipping`

## Données sensibles / sécurité

Le domaine `fulfillment` manipule des informations logistiques et opérationnelles sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre état logistique métier interne et statut provider externe
- protection des changements sensibles de statut, d’allocation ou de remise
- limitation de l’exposition selon le rôle, le scope et le besoin métier
- audit des interventions logistiques manuelles importantes

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel état de fulfillment est en vigueur
- quelles lignes ou quantités sont concernées
- pourquoi une commande est prête, partielle, bloquée, expédiée ou remise
- quel événement ou quelle précondition a déclenché une transition logistique
- si une exécution n’avance pas à cause d’un blocage de stock, de paiement, de configuration ou d’une règle applicable

### Audit

Il faut tracer :

- la création d’un lot ou objet de fulfillment sensible
- les changements significatifs de statut logistique
- les remises, expéditions ou validations manuelles importantes
- les blocages et déblocages sensibles
- certaines consultations sensibles si le modèle final les retient explicitement

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `FulfillmentOrder` : exécution logistique structurée liée à une commande ou à une partie de commande
- `FulfillmentLine` : ligne ou quantité exécutée dans le cadre du fulfillment
- `FulfillmentStatus` : état logistique métier
- `FulfillmentShipment` : expédition, remise ou mise à disposition au niveau métier
- `FulfillmentPolicy` : règle de regroupement, découpage ou exécution
- `FulfillmentSubjectRef` : référence vers la commande ou les lignes source concernées

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un objet de fulfillment est rattaché à une commande ou à des lignes explicites
- un état de fulfillment possède une signification métier explicite
- `fulfillment` ne se confond pas avec `orders`
- `fulfillment` ne se confond pas avec `shipping`
- `fulfillment` ne se confond pas avec `returns`
- `fulfillment` ne se confond pas avec `integrations`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente d’exécution logistique quand le cadre commun `fulfillment` existe
- un statut provider externe ne doit pas devenir directement la vérité métier interne sans traduction explicite

## Cas d’usage principaux

1. Préparer une commande pour exécution logistique
2. Découper une commande en exécutions partielles si nécessaire
3. Marquer une commande ou certaines lignes comme expédiées
4. Marquer une commande comme prête au retrait si le modèle le prévoit
5. Fournir à `orders`, `notifications` ou `returns` une lecture fiable de l’état logistique
6. Exposer à l’admin une lecture claire des commandes à préparer, expédier, remettre ou débloquer

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- objet de fulfillment introuvable
- ligne source introuvable ou incohérente
- transition logistique invalide pour l’état courant
- exécution impossible à cause d’un prérequis non satisfait
- tentative de remise ou d’expédition non autorisée
- permission ou scope insuffisant
- tentative d’exposition d’un détail logistique sensible dans un contexte non autorisé

## Décisions d’architecture

Les choix structurants du domaine sont :

- `fulfillment` porte l’exécution logistique métier du socle
- `fulfillment` est distinct de `orders`
- `fulfillment` est distinct de `shipping`
- `fulfillment` est distinct de `returns`
- `fulfillment` est distinct de `integrations`
- les domaines consommateurs lisent la vérité logistique via `fulfillment`, sans la recréer localement
- les statuts, préparations, remises et blocages sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- l’exécution logistique métier relève de `fulfillment`
- la commande durable relève de `orders`
- les méthodes et options de livraison relèvent de `shipping`
- les retours relèvent de `returns`
- les connecteurs transporteurs ou points relais relèvent de `integrations`
- `fulfillment` ne remplace ni `orders`, ni `shipping`, ni `returns`, ni `integrations`, ni `payments`
