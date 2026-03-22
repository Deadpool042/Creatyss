# Domaine cart

## Rôle

Le domaine `cart` porte le panier du socle.

Il représente l’état courant des lignes qu’un visiteur invité ou un client souhaite acheter, avant validation finale par `checkout` et avant figement en `orders`.

Il constitue la source de vérité du panier runtime, distincte des domaines qui gèrent :

- la vendabilité contextuelle
- la disponibilité quantitative
- le calcul monétaire global
- la validation finale avant commande

## Responsabilités

Le domaine `cart` prend en charge :

- le panier invité
- le panier client
- l’ownership du panier (`guest` / `customer`)
- les lignes du panier
- les quantités demandées
- l’identité stable d’une ligne panier
- la fusion de lignes identiques
- le merge guest → customer
- la lecture et l’écriture du panier runtime
- la restitution d’un état de panier exploitable par `checkout`

## Ce que le domaine ne doit pas faire

Le domaine `cart` ne doit pas :

- décider seul de la vendabilité, qui relève de `sales-policy`
- porter la disponibilité quantitative, qui relève de `inventory`
- calculer tout le pricing transverse, qui relève de `pricing`
- calculer les remises, taxes ou accises, qui relèvent de `discounts` et `taxation`
- porter toute la logique shipping, qui relève de `shipping`
- valider la préparation finale à la commande, qui relève de `checkout`
- figer les montants et snapshots finaux, qui relèvent de `orders`

Le domaine `cart` porte le panier runtime. Il ne doit pas devenir le domaine fourre-tout de tout le commerce.

## Sous-domaines

- `core` : panier central et façade principale
- `guest` : comportement panier invité
- `customer` : comportement panier client
- `merge` : fusion guest → customer

## Entrées

Le domaine reçoit principalement :

- des demandes de création ou récupération de panier
- des demandes d’ajout de ligne
- des demandes de modification de quantité
- des demandes de suppression de ligne
- des demandes de fusion guest → customer
- des lectures de contexte venant d’autres domaines au moment où le panier doit être évalué

## Sorties

Le domaine expose principalement :

- un panier runtime
- des lignes panier
- un état d’ownership (`guest` / `customer`)
- une lecture des quantités demandées
- une représentation exploitable par `checkout`, `pricing`, `shipping`, `discounts` et `taxation`

## Dépendances vers autres domaines

Le domaine `cart` peut dépendre de :

- `products` pour la lecture catalogue minimale utile aux lignes panier
- `inventory` pour la disponibilité quantitative
- `sales-policy` pour la vendabilité contextuelle
- `customers` pour le contexte client lorsqu’il existe
- `store` pour le contexte boutique et les capabilities
- `audit` pour tracer certaines opérations critiques si nécessaire
- `observability` pour expliquer pourquoi une ligne est invalide ou bloquante

Les domaines suivants peuvent dépendre de `cart` :

- `pricing`
- `shipping`
- `discounts`
- `taxation`
- `checkout`
- `analytics`
- `orders`

## Capabilities activables liées

Le domaine `cart` est particulièrement lié à :

- `guestCheckout`
- `customerCheckout`
- `backorders`
- `preorders`
- `giftOptions`

### Effet si `guestCheckout` est activée

Le panier invité est supporté et peut être fusionné ensuite avec un panier client.

### Effet si `guestCheckout` est désactivée

Le domaine reste présent, mais les parcours invités sont neutralisés au runtime.

### Effet si `customerCheckout` est activée

Le panier client connecté est pleinement supporté.

### Effet si `backorders` ou `preorders` est activée

Le panier peut accepter certaines lignes selon les politiques retournées par `inventory` et `sales-policy`.

### Effet si `giftOptions` est activée

Certaines options cadeau peuvent enrichir les lignes ou le contexte de panier, sans transformer `cart` en domaine gifting complet.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support`
- `customer` pour son propre panier

### Permissions

Exemples de permissions concernées :

- `cart.read`
- `orders.read`
- `orders.write`
- `customers.read`
- `inventory.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `cart.created`
- `cart.updated`
- `cart.line.added`
- `cart.line.updated`
- `cart.line.removed`
- `cart.merged`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `product.updated`
- `product.published`
- `inventory.stock.updated`
- `sales_policy.item.sellability.changed`
- `customer.created`
- `store.capabilities.updated`

Le domaine doit toutefois rester maître de son propre état runtime.

## Intégrations externes

Le domaine `cart` ne doit pas parler directement à des systèmes externes.

Les usages externes éventuels passent par :

- `integrations`
- `tracking`
- `jobs`
- `analytics`

Le domaine `cart` reste la source de vérité interne du panier runtime.

## Données sensibles / sécurité

Le domaine `cart` ne porte pas des secrets, mais il porte une donnée runtime critique du parcours d’achat.

Points de vigilance :

- validation stricte des entrées
- aucune confiance dans les prix ou états envoyés par le client
- contrôle du contexte guest vs customer
- gestion sûre du merge guest → customer
- traçabilité des opérations sensibles si nécessaire

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une ligne a été acceptée, fusionnée, refusée ou invalidée
- quelle règle de vendabilité a bloqué une ligne
- quelle lecture de stock a été utilisée
- pourquoi un panier n’est pas prêt pour le checkout

### Audit

Le domaine `cart` n’a pas vocation à auditer chaque changement mineur comme un domaine de gouvernance pure.

En revanche, certaines opérations sensibles peuvent être tracées, notamment :

- un merge guest → customer
- certaines corrections manuelles ou interventions support
- certains changements de comportement administrés côté plateforme

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Cart` : panier runtime
- `CartOwnerKind` : nature du propriétaire (`guest` / `customer`)
- `CartLine` : ligne panier
- `CartLineIdentity` : identité stable logique d’une ligne
- `CartMergeResult` : résultat de fusion de paniers

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un panier a un propriétaire logique explicite
- une ligne panier a une identité stable
- la quantité demandée est explicite et contrôlée
- le panier runtime ne porte pas la vérité finale de pricing ou de commande
- le merge guest → customer est atomique
- les autres domaines ne doivent pas recréer leur propre modèle de panier divergent

## Cas d’usage principaux

1. Créer ou récupérer un panier invité
2. Créer ou récupérer un panier client
3. Ajouter une ligne au panier
4. Modifier la quantité d’une ligne
5. Supprimer une ligne
6. Fusionner un panier invité dans un panier client
7. Exposer un panier runtime exploitable par `checkout`

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- panier introuvable
- ligne introuvable
- quantité invalide
- produit ou variante non vendable dans le contexte courant
- quantité non disponible selon `inventory`
- merge impossible ou conflictuel
- capability checkout incompatible avec le contexte panier

## Décisions d’architecture

Les choix structurants du domaine sont :

- `cart` porte le panier runtime du socle
- `cart` est distinct de `pricing`
- `cart` est distinct de `shipping`
- `cart` est distinct de `discounts` et `taxation`
- `cart` consomme `sales-policy` et `inventory` au lieu de redéfinir localement leurs règles
- les écritures critiques du panier doivent être protégées par des transactions adaptées
- le merge guest → customer est une responsabilité native du domaine

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- le panier runtime relève de `cart`
- `cart` ne porte pas tout le pricing transverse
- `cart` ne porte pas toute la logique shipping
- `cart` ne décide pas seul de la vendabilité ni du stock
- `cart` ne remplace ni `checkout`, ni `orders`, ni `pricing`, ni `inventory`, ni `sales-policy`
