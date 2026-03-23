# Domaine `cart`

## Rôle

Le domaine `cart` porte le panier runtime du socle.
Il constitue la source de vérité interne des intentions d’achat avant validation finale par `checkout` et avant figement en `orders`.

## Responsabilités

Le domaine `cart` prend en charge :

- la création et la récupération du panier
- l’ownership du panier invité ou client
- les lignes de panier
- les quantités demandées
- la fusion de lignes identiques
- le merge guest → customer
- les transitions de statut du panier
- la détection, la reprise et la traçabilité du panier abandonné
- la lecture du panier exploitable par `checkout`, `pricing`, `shipping` et `inventory`

## Capabilities activables liées

Le domaine `cart` est lié à :

- `guestCart`
- `persistentCart`
- `cartMerge`
- `abandonedCartDetection`
- `abandonedCartRecovery`
- `abandonedCartRelaunch`
- `giftOptions`

### Effet si `guestCart` est activée

Le panier invité est supporté et fusionnable avec un panier client.

### Effet si `guestCart` est désactivée

Les parcours invités sont rejetés côté serveur.

### Effet si `cartMerge` est activée

Le merge guest → customer est disponible, transactionnel et idempotent.

### Effet si `abandonedCartDetection` est activée

Le domaine détecte et marque explicitement les paniers abandonnés selon une politique d’inactivité déterminée.

### Effet si `abandonedCartRecovery` est activée

Un panier abandonné peut être réactivé via un flux serveur explicite et revalidé.

### Effet si `abandonedCartRelaunch` est activée

Les relances marketing liées à l’abandon sont déclenchées après commit via événements et jobs.

## Événements émis

Le domaine émet les domain events internes suivants :

- `cart.created`
- `cart.line.added`
- `cart.line.updated`
- `cart.line.removed`
- `cart.merged`
- `cart.abandoned`
- `cart.reactivated`
- `cart.converted`
- `cart.expired`

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Cart`
- `CartLine`
- `CartOwnerKind`
- `CartStatus` : `ACTIVE`, `ABANDONED`, `CONVERTED`, `EXPIRED`
- `CartMergeResult`
- `CartAbandonmentPolicy`

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un panier possède un statut explicite
- un panier `ACTIVE` est le seul état modifiable librement
- un panier `ABANDONED` reste lisible et traçable
- un panier `CONVERTED` ne redevient jamais actif
- un panier `EXPIRED` ne redevient jamais actif
- un panier abandonné ne peut être réactivé que par un flux serveur explicite
- la conversion d’un panier abandonné exige une revalidation serveur explicite

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’un panier et de ses métadonnées initiales
- ajout d’une ligne avec fusion éventuelle
- mise à jour d’une ligne
- suppression d’une ligne
- merge guest → customer
- transition `ACTIVE -> ABANDONED`
- transition `ABANDONED -> ACTIVE`
- transition `ACTIVE -> CONVERTED`
- transition `ACTIVE -> EXPIRED`
- écriture des events `cart.*` correspondants

### Ce qui peut être eventual consistency

Les traitements suivants ont lieu après commit :

- analytics
- relance marketing d’abandon
- projections secondaires
- webhooks sortants
- synchronisations externes

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- unicité d’une variante par panier
- garde sur le statut avant mutation
- transaction applicative sur les mutations critiques
- ordre stable des écritures lors du merge
- refus de conversion si le panier n’est plus `ACTIVE`
- refus de reprise si le panier est `CONVERTED` ou `EXPIRED`

### Idempotence

Les commandes métier suivantes sont idempotentes :

- `add-cart-line` : clé `(cartId, variantId, clientIntentId)`
- `merge-cart` : clé `(sourceCartId, targetCartId)`
- `abandon-cart` : clé `(cartId, abandonmentIntentId)`
- `reactivate-cart` : clé `(cartId, reactivationIntentId)`
- `convert-cart` : clé identité du panier source + référence métier de conversion

### Domain events écrits dans la même transaction

- `cart.created`
- `cart.line.added`
- `cart.line.updated`
- `cart.line.removed`
- `cart.merged`
- `cart.abandoned`
- `cart.reactivated`
- `cart.converted`
- `cart.expired`

### Effets secondaires après commit

- notification marketing
- analytics
- webhook sortant
- synchronisation externe
- tracking
