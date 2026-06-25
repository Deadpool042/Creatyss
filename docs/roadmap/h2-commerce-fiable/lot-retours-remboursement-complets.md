# Lot — Retours et remboursements complets

## Statut

Terminé (admin) — implémenté 2026-06-24. Sélection lignes/quantités, restock transactionnel RECEIVED (skip DAMAGED), remboursement Stripe-first REFUNDED, PaymentRefund enregistré. Typecheck et lint verts. Formulaire storefront client différé (périmètre séparé).

## Objectif

Compléter le module retours pour couvrir la sélection de lignes, le remboursement Stripe réel, le restock automatique de l'inventaire et la possibilité pour la cliente de faire une demande depuis le storefront. La V1 observée (`commerce.returns` L3) couvre uniquement la demande de retour commande entière avec `REFUNDED` déclaratif.

## Périmètre

Livré au 2026-06-24 :

- `features/admin/commerce/returns/` — sélection de lignes et quantités dans la demande de retour admin
- Remboursement Stripe réel : appel Stripe Refunds API, mise à jour du `Payment`/`PaymentAttempt` correspondant, enregistrement `PaymentRefund`
- Restock inventaire transactionnel à la réception des articles en état `RECEIVED`, avec skip des lignes `DAMAGED`

Reste hors de ce lot :

- formulaire storefront de demande de retour côté client
- intégration de cette demande storefront dans le workflow retours admin

## Hors périmètre

- Retours partiels complexes (articles endommagés, litiges)
- Garanties légales et SAV étendu
- Échanges produits (remplacement d'un article par un autre)
- Remboursements en avoir uniquement sans retour physique (couvert par `lot-factures-legales-facturx`)

## Dépendances

- Paiement Stripe opérationnel — le remboursement Stripe nécessite un `PaymentIntent` existant
- `commerce.returns` V1 observée comme base de départ (ne pas réécrire le workflow existant)
- `commerce.payments` actif avec les clés Stripe configurées

## Invariants

- `REFUNDED` déclaratif actuel doit être remplacé sans casser les retours déjà enregistrés en DB
- Le workflow REQUESTED→…→CLOSED existant ne doit pas être redessiné — l'ajout de la sélection lignes s'y greffe
- Un remboursement Stripe ne doit être déclenché que lorsque le statut passe à un état approprié (à définir dans le cadrage `architect-review`)
- Le décrément d'inventaire lors du retour doit être transactionnel pour éviter les incohérences

## Risques

- Remboursement Stripe : une erreur API Stripe après mise à jour du statut en DB crée une incohérence — la gestion de l'erreur doit être explicite (rollback ou compensation)
- `REFUNDED` déclaratif existant : si des retours ont déjà été marqués `REFUNDED` en production sans remboursement réel, il faudra une procédure de réconciliation manuelle
- Restock : si un article retourné est endommagé, le restock automatique n'est pas toujours souhaitable — la logique doit être gatable

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur la logique de restock et sur la résolution du remboursement
- Test manuel : retour admin → approbation → remboursement Stripe → stock mis à jour

## Critères de fin

- L'admin peut sélectionner les lignes concernées dans la demande de retour
- La validation du retour déclenche un remboursement réel via Stripe
- L'inventaire est réajusté transactionnellement selon l'état retourné
- `typecheck` et `lint` passent sans erreur
- Les retours existants en DB ne sont pas impactés par la migration

## Agent recommandé

`next-feature-builder` pour l'implémentation, après cadrage préalable avec `architect-review` sur la gestion des erreurs Stripe et la politique de restock.
