# Repository `payment`

## Rôle

`payment.repository.ts` gère le cycle de paiement Stripe lié à une commande :

- préparation du contexte de paiement
- enregistrement de la session checkout Stripe
- finalisation succès / échec par webhook

Le domaine est volontairement étroit. Il ne cherche pas à généraliser plusieurs providers ni plusieurs méthodes.

## Structure actuelle

Fichiers actuels :

- `payment.repository.ts`
- `payment.types.ts`

Contrats publics principaux :

- `PaymentStartContext`
- `PaymentStatus`
- `SaveStripeCheckoutSessionForOrderInput`
- `MarkPaymentSucceededByCheckoutSessionIdInput`
- `MarkPaymentFailedByCheckoutSessionIdInput`

## Fonctions publiques actuelles

- `findPaymentStartContextByOrderReference(reference)`
- `saveStripeCheckoutSessionForOrder(input)`
- `markPaymentSucceededByCheckoutSessionId(input)`
- `markPaymentFailedByCheckoutSessionId(input)`

## Flux principaux

### Préparation du paiement

`findPaymentStartContextByOrderReference()` :

- valide le format de référence
- lit le paiement via la relation `orders`
- retourne le contexte nécessaire au démarrage du paiement

### Création / mise à jour de session Stripe

`saveStripeCheckoutSessionForOrder()` :

- relit la commande
- `upsert` la ligne `payments`
- force `provider = "stripe"` et `method = "card"`

### Webhook succès

`markPaymentSucceededByCheckoutSessionId()` :

- transaction `Serializable`
- lit le paiement par `stripe_checkout_session_id`
- passe le paiement à `succeeded` si nécessaire
- met la commande à `paid` si elle est encore `pending`
- retourne l'id de commande concerné

### Webhook échec

`markPaymentFailedByCheckoutSessionId()` :

- transaction `Serializable`
- passe le paiement à `failed` seulement s'il n'est pas déjà `succeeded`

## Points complexes réels

- idempotence des webhooks gérée localement
- isolement `Serializable` pour éviter les doubles mises à jour concurrentes
- comportement volontairement spécifique à Stripe

## Limites actuelles

- le domaine ne porte pas d'erreur publique dédiée
- le type `OrderStatus` reste redéfini localement dans `payment.types.ts`
- aucune séparation interne `queries` / `helpers`

## Lecture V20

Le domaine `payment` n'est pas un problème de taille, mais il constitue un bon modèle de repository compact :

- façade publique courte
- transactions locales
- `select` ciblés
- aucun mapping superflu

Si V20 introduit `queries`, ce domaine peut rester monolithique tant qu'il garde cette taille.
