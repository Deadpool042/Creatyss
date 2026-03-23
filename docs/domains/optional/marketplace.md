# Domaine `marketplace`

## Objectif

Ce document décrit le domaine `marketplace` dans la doctrine courante du socle.

Il porte la logique multi-vendeurs si le projet l’active.

---

## Position dans la doctrine de modularité

Le domaine `marketplace` est classé comme :

- `domaine optionnel toggleable`

### Capabilities activables liées

- `marketplace`
- `sellerAccounts`
- `sellerCatalogs`
- `sellerPayouts`
- `multiSellerOrders`
- `sellerModeration`

---

## Rôle

Le domaine `marketplace` porte la vérité interne du modèle vendeur tiers.

Il constitue la source de vérité pour :

- les sellers ;
- leur statut ;
- leur rattachement aux offres ;
- certaines découpes de commande ou de responsabilité marketplace.

Il reste distinct de :

- `products`
- `orders`
- `payments`
- `stores`

---

## Objets métier principaux

- `MarketplaceSeller`
- `MarketplaceSellerStatus`
- `SellerOfferRelation`
- `SellerPayoutReference`
- `SellerModerationDecision`

---

## Invariants métier

- un seller a une identité stable ;
- une offre vendeur est rattachée explicitement ;
- une commande multi-vendeurs reste cohérente avec la vérité `orders` ;
- les paiements vendeurs restent distincts du paiement client.

---

## Lifecycle et gouvernance des données

### États principaux

- `ACTIVE`
- `SUSPENDED`
- `DISABLED`
- `ARCHIVED`

### Règles principales

- la modération seller est explicite ;
- la suspension reste traçable ;
- la suppression implicite est évitée.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

- création / mise à jour seller ;
- suspension / réactivation ;
- rattachement seller / offre ;
- écriture des événements `marketplace.*`.

### Ce qui peut être eventual consistency

- payouts ;
- notifications ;
- analytics ;
- intégrations externes.

### Idempotence

- `upsert-seller` : `(sellerRef, changeIntentId)`
- `assign-seller-offer` : `(sellerId, offerRef, assignIntentId)`
- `suspend-seller` : `(sellerId, suspensionIntentId)`

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M3`
- `M4` pour marketplace riche ou réglementée.

### Impact coût / complexité

Le coût monte principalement avec :

- `sellerAccounts`
- `sellerCatalogs`
- `sellerPayouts`
- `multiSellerOrders`
- `sellerModeration`

Lecture relative :

- `C3` à `C4`

---

## Décisions d’architecture

- `marketplace` est un domaine optionnel toggleable ;
- il ne doit jamais être “simulé” via quelques champs rajoutés dans `products` ou `orders` ;
- s’il est activé, il devient une verticale métier propre.
