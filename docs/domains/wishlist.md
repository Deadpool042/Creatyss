# Domaine `wishlist`

## Objectif

Ce document décrit le domaine `wishlist` dans la doctrine courante du socle.

Il porte la liste d’envies ou de favoris du client quand cette capability est activée.

---

## Position dans la doctrine de modularité

Le domaine `wishlist` est classé comme :

- `domaine optionnel toggleable`

### Capabilities activables liées

- `wishlist`
- `sharedWishlist`
- `wishlistNotifications`
- `wishlistCollections`

---

## Rôle

Le domaine `wishlist` porte la vérité interne des listes d’envies d’un client.

Il constitue la source de vérité pour :

- l’existence d’une wishlist ;
- ses items ;
- son owner ;
- son éventuel statut de partage.

Il reste distinct de :

- `cart`, qui porte l’intention d’achat active ;
- `customers`, qui porte le client ;
- `products`, qui porte le catalogue.

---

## Objets métier principaux

- `Wishlist`
- `WishlistItem`
- `WishlistStatus`
- `WishlistShareToken`

---

## Invariants métier

- une wishlist a un owner explicite ;
- un item wishlist référence une offre existante ;
- la wishlist n’est pas un panier ;
- un partage ou token éventuel suit une politique explicite.

---

## Lifecycle et gouvernance des données

### États principaux

- `ACTIVE`
- `ARCHIVED`
- `SHARED` si le modèle l’explicite ainsi

### Règles principales

- une wishlist archivée reste traçable selon la politique du projet ;
- la suppression physique reste contrôlée.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

- création de wishlist ;
- ajout ou suppression d’item ;
- partage ou retrait de partage ;
- écriture des événements `wishlist.*`.

### Ce qui peut être eventual consistency

- notifications ;
- analytics ;
- suggestions dérivées.

### Idempotence

- `add-wishlist-item` : `(wishlistId, offerRef, addIntentId)`
- `remove-wishlist-item` : `(wishlistId, offerRef, removeIntentId)`

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` à `M2`

### Impact coût / complexité

Le coût monte principalement avec :

- `sharedWishlist`
- `wishlistNotifications`
- `wishlistCollections`

Lecture relative :

- `C1` à `C2`

---

## Décisions d’architecture

- `wishlist` est un domaine optionnel toggleable ;
- il reste distinct de `cart` ;
- il peut alimenter du marketing ou des notifications après commit, sans devenir un workflow d’achat.
