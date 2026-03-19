# Repository `order`

## Rôle

`order.repository.ts` porte deux responsabilités publiques :

- lecture des commandes pour le storefront et l'admin
- mutations critiques du cycle de commande

Le domaine encapsule aussi :

- la création de commande depuis le panier invité
- la transition de statut
- l'expédition
- la lecture du contexte email d'une commande

## Structure actuelle

Fichiers actuels :

- `order.repository.ts`
- `order.types.ts`

Couplages directs observables :

- `order-email.repository.ts` pour la lecture des événements email
- `entities/order/*` pour la référence et les transitions de statut
- `lib/money.ts` pour les conversions monétaires

## Fonctions publiques actuelles

- `findPublicOrderByReference(reference)`
- `findOrderEmailContextById(id)`
- `listAdminOrders()`
- `findAdminOrderById(id)`
- `createOrderFromGuestCartToken(token)`
- `updateOrderStatus(input)`
- `shipOrder(input)`

## Contrats publics actuels

`order.types.ts` expose :

- `PublicOrderConfirmation`
- `AdminOrderSummary`
- `AdminOrderDetail`
- `OrderLine`
- `OrderPayment`
- `OrderEmailContext`
- `CreateOrderFromGuestCartResult`
- `UpdateOrderStatusInput`
- `ShipOrderInput`
- `OrderRepositoryError`

## Flux principal : création de commande

`createOrderFromGuestCartToken(token)` est le flux le plus sensible du domaine.

Séquence actuelle :

1. générer une référence de commande
2. démarrer une transaction `Serializable`
3. lire le panier par token
4. lire le brouillon checkout
5. valider que le brouillon est complet
6. lire les lignes panier avec variante + produit
7. vérifier disponibilité et cohérence des lignes
8. calculer le montant total
9. créer la commande
10. créer un paiement `pending`
11. créer les `order_items`
12. décrémenter le stock des variantes
13. supprimer le panier invité
14. retourner `{ id, reference }`

Le flux comporte en plus :

- une boucle de retry externe sur collision d'unicité de la référence
- un remapping vers `OrderRepositoryError`

## Flux de lecture

### Lecture publique

`findPublicOrderByReference()` :

- valide le format de référence
- charge la commande avec paiement et items
- fournit un paiement par défaut si aucune ligne `payments` n'existe encore

### Lecture admin

`listAdminOrders()` :

- lit les commandes avec `_count.order_items`
- projette le statut de paiement à partir de `payments`

`findAdminOrderById()` :

- lit la commande complète
- charge séparément les événements email
- retourne `AdminOrderDetail`

## Flux de mutation

### `updateOrderStatus()`

- transaction `Serializable`
- lecture du statut courant
- validation via `resolveOrderStatusTransition`
- restock éventuel via `restockOrderItemsInTx`
- update du statut

### `shipOrder()`

- transaction `Serializable`
- validation de la transition vers `shipped`
- update de `status`, `shipped_at`, `tracking_reference`

## Points complexes réels

- usage de `Serializable` pour reproduire l'ancien verrouillage SQL
- conversions monétaires normalisées avant exposition publique
- logique de restock groupée par `source_product_variant_id`
- combinaison lecture commande + paiement + lignes + événements email

## Limites actuelles

- `order.repository.ts` mélange lectures, mutations, mappings, validation technique et helpers transactionnels
- le fichier reste volumineux
- les selects internes (`ORDER_SELECT`) et les helpers privés ne sont pas encore sortis
- le domaine reste couplé à `order-email.repository.ts` pour compléter `AdminOrderDetail`

## Lecture V20

Le domaine `order` doit garder le repository comme façade publique, mais gagnerait à extraire :

- les queries de lecture commande
- les helpers transactionnels de checkout
- les mappers publics de commande

La zone la plus sensible à préserver est `createOrderFromGuestCartToken()`. Toute extraction doit rester purement interne.
