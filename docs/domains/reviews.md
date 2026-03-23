# Domaine `reviews`

## Objectif

Ce document décrit le domaine `reviews` dans la doctrine courante du socle.

Il porte les avis clients ou évaluations structurées liés aux produits, commandes ou expériences si le projet les active.

---

## Position dans la doctrine de modularité

Le domaine `reviews` est classé comme :

- `domaine optionnel toggleable`

### Capabilities activables liées

- `reviews`
- `verifiedReviews`
- `reviewModeration`
- `reviewReplies`
- `reviewRatings`
- `reviewMedia`

---

## Rôle

Le domaine `reviews` porte la vérité interne des avis publiés, modérés ou rejetés par le système.

Il constitue la source de vérité pour :

- l’existence d’un avis ;
- sa note ;
- son texte ;
- son statut de modération ;
- son rattachement à un objet source (souvent produit, parfois commande).

Il reste distinct de :

- `products`
- `orders`
- `customers`
- `blog`

---

## Objets métier principaux

- `Review`
- `ReviewStatus`
- `ReviewRating`
- `ReviewModerationDecision`
- `ReviewReply`

---

## Invariants métier

- un avis est rattaché à une source explicite ;
- un avis publié a passé une validation ou une modération cohérente avec la politique retenue ;
- un avis rejeté ou archivé reste traçable selon la politique du projet ;
- un avis vérifié ne l’est que selon une règle explicite.

---

## Lifecycle et gouvernance des données

### États principaux

- `PENDING`
- `PUBLISHED`
- `REJECTED`
- `ARCHIVED`

### Règles principales

- la modération est explicite ;
- la suppression implicite des avis structurants est évitée ;
- les décisions de modération restent auditables.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

- création d’un avis ;
- décision de modération ;
- publication ;
- réponse structurante ;
- écriture des événements `review.*`.

### Ce qui peut être eventual consistency

- notifications ;
- analytics ;
- indexation search ;
- synchronisations externes.

### Idempotence

- `create-review` : `(reviewSourceRef, authorRef, createIntentId)`
- `moderate-review` : `(reviewId, moderationIntentId)`
- `reply-review` : `(reviewId, replyIntentId)`

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M2` dès activation ;
- `M3` si modération, réponses et média sont actifs.

### Impact coût / complexité

Le coût monte principalement avec :

- `verifiedReviews`
- `reviewModeration`
- `reviewReplies`
- `reviewMedia`

Lecture relative :

- `C1` à `C3`

---

## Décisions d’architecture

- `reviews` est un domaine optionnel toggleable ;
- il reste distinct des produits et commandes ;
- la modération et la vérification sont des capabilities, pas des présupposés ;
- les plateformes externes d’avis restent des intégrations si utilisées.
