# Domaine `subscriptions`

## Objectif

Ce document décrit le domaine `subscriptions` dans la doctrine courante du socle.

Il porte les abonnements récurrents si le projet les active.

---

## Position dans la doctrine de modularité

Le domaine `subscriptions` est classé comme :

- `domaine optionnel toggleable`

### Capabilities activables liées

- `subscriptions`
- `recurringBilling`
- `subscriptionPlans`
- `subscriptionPausing`
- `subscriptionTrials`
- `subscriptionRenewals`

---

## Rôle

Le domaine `subscriptions` porte la vérité interne des abonnements.

Il constitue la source de vérité pour :

- l’existence d’un abonnement ;
- son plan ;
- son statut ;
- ses renouvellements ;
- ses pauses ou reprises ;
- ses échéances internes.

Il reste distinct de :

- `payments`, qui porte le paiement ;
- `orders`, qui porte les commandes durables ponctuelles ;
- `products`, qui porte l’offre ;
- `customers`, qui porte le client.

---

## Objets métier principaux

- `Subscription`
- `SubscriptionPlan`
- `SubscriptionStatus`
- `SubscriptionRenewal`
- `SubscriptionTrial`
- `SubscriptionPause`

---

## Invariants métier

- un abonnement est rattaché à un client et à un plan ;
- son statut est explicite ;
- une échéance de renouvellement reste traçable ;
- les flux de paiement récurrent restent cohérents avec `payments`.

---

## Lifecycle et gouvernance des données

### États principaux

- `ACTIVE`
- `PAUSED`
- `CANCELLED`
- `EXPIRED`
- `TRIALING`

### Règles principales

- le cycle de vie est explicite ;
- les pauses et reprises sont traçables ;
- les renouvellements restent auditables.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

- création d’abonnement ;
- changement de plan ;
- changement de statut ;
- enregistrement d’une échéance ;
- écriture des événements `subscription.*`.

### Ce qui peut être eventual consistency

- paiement récurrent ;
- notifications ;
- génération documentaire ;
- analytics ;
- intégrations externes.

### Idempotence

- `create-subscription` : `(subscriptionRef, createIntentId)`
- `renew-subscription` : `(subscriptionId, renewalCycleRef, renewalIntentId)`
- `pause-subscription` : `(subscriptionId, pauseIntentId)`
- `cancel-subscription` : `(subscriptionId, cancelIntentId)`

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M3`
- `M4` si forte criticité ou multiples scénarios d’abonnement.

### Impact coût / complexité

Le coût monte principalement avec :

- `recurringBilling`
- `subscriptionPlans`
- `subscriptionPausing`
- `subscriptionTrials`
- `subscriptionRenewals`

Lecture relative :

- `C3` à `C4`

---

## Décisions d’architecture

- `subscriptions` est un domaine optionnel toggleable ;
- il porte une vérité récurrente propre ;
- il reste distinct d’`orders` et de `payments` ;
- il implique un niveau de maintenance plus élevé.
