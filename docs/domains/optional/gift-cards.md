# Domaine `gift-cards`

## Objectif

Ce document décrit le domaine `gift-cards` dans la doctrine courante du socle.

Il porte les cartes cadeaux si le projet décide de les activer.

---

## Position dans la doctrine de modularité

Le domaine `gift-cards` est classé comme :

- `domaine optionnel toggleable`

### Capabilities activables liées

- `giftCards`
- `digitalGiftCards`
- `giftCardBalance`
- `giftCardRedemption`
- `giftCardExpiration`

---

## Rôle

Le domaine `gift-cards` porte la vérité interne des cartes cadeaux.

Il constitue la source de vérité pour :

- l’existence d’une carte cadeau ;
- son solde ;
- son statut ;
- ses consommations ;
- son expiration si activée.

Il reste distinct de :

- `payments`
- `loyalty`
- `pricing`
- `documents`

---

## Objets métier principaux

- `GiftCard`
- `GiftCardStatus`
- `GiftCardBalance`
- `GiftCardRedemption`
- `GiftCardExpirationPolicy`

---

## Invariants métier

- une carte cadeau possède une identité stable ;
- son solde ne devient pas incohérent ;
- une consommation est traçable ;
- une carte expirée ou révoquée n’est plus traitée comme active.

---

## Lifecycle et gouvernance des données

### États principaux

- `ACTIVE`
- `REDEEMED`
- `EXPIRED`
- `REVOKED`
- `ARCHIVED`

### Règles principales

- le solde et les consommations restent auditables ;
- les expirations sont explicites ;
- la suppression implicite est évitée.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

- émission d’une carte cadeau ;
- consommation d’un montant ;
- changement de statut ;
- écriture des événements `gift_card.*`.

### Ce qui peut être eventual consistency

- notifications ;
- documents ;
- analytics ;
- diffusion externe.

### Idempotence

- `issue-gift-card` : `(giftCardRef, issueIntentId)`
- `redeem-gift-card` : `(giftCardId, redemptionIntentId)`
- `expire-gift-card` : `(giftCardId, expirationIntentId)`

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M2`
- `M3` si forte volumétrie ou cartes digitales riches.

### Impact coût / complexité

Le coût monte principalement avec :

- `digitalGiftCards`
- `giftCardBalance`
- `giftCardRedemption`
- `giftCardExpiration`

Lecture relative :

- `C2` à `C4`

---

## Décisions d’architecture

- `gift-cards` est un domaine optionnel toggleable ;
- il reste distinct de `payments` et `loyalty` ;
- une carte cadeau est un objet métier à part entière ;
- son solde et ses usages sont transactionnels et auditables.
