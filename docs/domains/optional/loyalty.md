# Domaine `loyalty`

## Objectif

Ce document décrit le domaine `loyalty` dans la doctrine courante du socle.

Il porte la logique de fidélité si le projet décide de l’activer.

---

## Position dans la doctrine de modularité

Le domaine `loyalty` est classé comme :

- `domaine optionnel toggleable`

### Capabilities activables liées

- `loyalty`
- `pointsLoyalty`
- `tieredLoyalty`
- `loyaltyRewards`
- `loyaltyLedger`

---

## Rôle

Le domaine `loyalty` porte la vérité interne de la fidélité.

Il constitue la source de vérité pour :

- le compte fidélité ;
- les points ou avantages ;
- les niveaux de fidélité ;
- les récompenses disponibles ou consommées.

Il reste distinct de :

- `customers`
- `pricing`
- `payments`
- `gift-cards`

---

## Objets métier principaux

- `LoyaltyAccount`
- `LoyaltyPointsLedger`
- `LoyaltyTier`
- `LoyaltyReward`
- `LoyaltyTransaction`

---

## Invariants métier

- un compte fidélité est rattaché à un client explicite ;
- une transaction fidélité est traçable ;
- un niveau fidélité suit des règles explicites ;
- la fidélité ne redéfinit ni le paiement ni la carte cadeau.

---

## Lifecycle et gouvernance des données

### États principaux

- `ACTIVE`
- `DISABLED`
- `ARCHIVED`

### Règles principales

- les mouvements de points restent auditables ;
- les récompenses consommées restent traçables.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

- crédit ou débit de points ;
- changement de tier ;
- consommation d’une récompense ;
- écriture des événements `loyalty.*`.

### Ce qui peut être eventual consistency

- notifications ;
- analytics ;
- synchronisation CRM ;
- recommandations marketing.

### Idempotence

- `credit-loyalty-points` : `(loyaltyAccountId, sourceRef, creditIntentId)`
- `debit-loyalty-points` : `(loyaltyAccountId, sourceRef, debitIntentId)`
- `consume-loyalty-reward` : `(loyaltyAccountId, rewardId, consumeIntentId)`

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M2`
- `M3` si ledger ou tiers riches.

### Impact coût / complexité

Le coût monte principalement avec :

- `pointsLoyalty`
- `tieredLoyalty`
- `loyaltyRewards`
- `loyaltyLedger`

Lecture relative :

- `C2` à `C4`

---

## Décisions d’architecture

- `loyalty` est un domaine optionnel toggleable ;
- il porte une vraie vérité métier s’il est activé ;
- il reste distinct de `pricing`, `payments` et `gift-cards`.
