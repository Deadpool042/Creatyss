# Pattern — Disponibilité

## Constats sur le code actuel

Il n'existe pas une seule implémentation unique de la disponibilité dans `db/`.

Le code actuel a trois formes principales de disponibilité :

- disponibilité catalogue public
- disponibilité panier invité
- disponibilité source lors de la création de commande

## Disponibilité catalogue public

Source de vérité actuelle :

- `resolvePublishedSimpleOffer`
- `getPublishedProductAvailability`

dans `db/repositories/catalog/catalog.mappers.ts`

### Produit simple

La disponibilité dépend de `simpleOffer`.

### Produit avec déclinaisons

La disponibilité dépend d'au moins une déclinaison disponible.

## Disponibilité panier invité

Dans `guest-cart.repository.ts`, la disponibilité est recalculée localement.

### Variante

Une variante est disponible si :

- le produit est `published`
- la déclinaison est `published`
- `stock_quantity > 0`

### Ligne panier

Une ligne est disponible si :

- le produit est `published`
- la déclinaison est `published`
- `stock_quantity >= quantity`
- `stock_quantity > 0`

## Disponibilité lors de la création de commande

Dans `order.repository.ts`, `sourceLineIsAvailable()` applique une règle proche du panier :

- produit `published`
- déclinaison `published`
- stock suffisant pour la quantité demandée
- stock strictement positif

## Dépendances réelles

La disponibilité actuelle dépend de :

- `product_type`
- `status` produit
- `status` déclinaison
- stock
- offre simple dérivée

## Ce que V20 doit préserver

- ne pas fusionner artificiellement ces trois usages si les contrats diffèrent
- ne pas déplacer la logique métier produit hors `entities/`
- documenter toute règle commune avant tentative d'extraction

## Lecture V20

V20 peut rationaliser la structure interne, mais pas supposer qu'un seul helper couvrira tous les cas sans travail de cadrage.

À ce stade, la bonne lecture est :

- un pattern commun existe
- il n'est pas encore factorisé globalement
- le catalogue public est la forme la plus centralisée
