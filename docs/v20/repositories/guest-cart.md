# Repository `guest-cart`

## Rôle

`guest-cart.repository.ts` gère le panier invité et son brouillon de checkout.

Le domaine couvre :

- création et recherche de panier par token
- gestion des lignes panier
- lecture du panier enrichi
- lecture et écriture du brouillon checkout
- composition du contexte checkout invité

## Structure actuelle

Fichiers actuels :

- `guest-cart.repository.ts`
- `guest-cart.types.ts`

Contrats publics principaux :

- `GuestCart`
- `GuestCartLine`
- `GuestCartVariant`
- `GuestCheckoutDetails`
- `GuestCheckoutContext`
- inputs nommés pour add / update / remove / upsert draft

## Fonctions publiques actuelles

- `findGuestCartIdByToken(token)`
- `createGuestCart(token)`
- `findGuestCartVariantById(variantId)`
- `findGuestCartItemByVariant(cartId, variantId)`
- `findGuestCartItemById(cartId, itemId)`
- `addGuestCartItemQuantity(input)`
- `updateGuestCartItemQuantity(input)`
- `removeGuestCartItem(input)`
- `readGuestCartByToken(token)`
- `readGuestCheckoutDetailsByCartId(cartId)`
- `upsertGuestCheckoutDetails(input)`
- `readGuestCheckoutContextByToken(token)`

## Flux principaux

### Écriture panier

- `addGuestCartItemQuantity()` utilise `upsert` pour reproduire un `INSERT ... ON CONFLICT DO UPDATE`
- `updateGuestCartItemQuantity()` utilise `updateMany`
- `removeGuestCartItem()` utilise `deleteMany`

### Lecture panier

`readGuestCartByToken()` :

- lit le panier et ses lignes
- charge les variantes et produits nécessaires
- reconstruit `GuestCart`
- calcule `itemCount` et `subtotal`

### Brouillon checkout

`upsertGuestCheckoutDetails()` :

- expose un contrat d'input public explicite
- écrit toutes les colonnes du brouillon checkout via `upsert`

### Contexte checkout

`readGuestCheckoutContextByToken()` :

- résout d'abord `cartId`
- charge en parallèle :
  - le panier
  - le brouillon checkout
- dérive les `issues`

## Points complexes réels

- disponibilité locale calculée à partir de :
  - statut produit
  - statut déclinaison
  - stock
  - quantité demandée
- conversions monétaires via `lib/money.ts`
- reconstruction du panier public en mémoire

## Limites actuelles

- disponibilité et calcul monétaire restent mêlés au repository
- le domaine reste gros pour un flux panier
- il n'existe pas encore de séparation claire entre :
  - queries panier
  - helpers d'assemblage
  - façade publique

## Lecture V20

Le domaine `guest-cart` n'a pas de dette technologique Prisma. Sa dette est structurelle :

- sortir les queries réutilisables
- garder les conversions monétaires et les helpers d'assemblage explicitement isolés
- préserver strictement les contrats publics `GuestCart*`
