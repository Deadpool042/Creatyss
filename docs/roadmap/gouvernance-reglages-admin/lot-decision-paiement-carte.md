# Lot — Décision : exposer le paiement carte (Stripe) dans l'admin

## Statut

À faire. Ce lot n'est explicitement PAS un lot de code — aucune implémentation ne doit démarrer sur la base de ce document sans validation humaine préalable.

## Objectif

Trancher si le paiement carte (Stripe) doit devenir pilotable depuis l'admin (visibilité du statut, activation/désactivation, éventuels réglages), au même titre que le virement et le paiement à la livraison qui ont chacun un toggle dans `payment-settings-form.tsx`.

## Contexte technique observé

- `prisma/core/foundation/store.prisma` (lignes 52-54) : `bankTransferEnabled` et `cashOnDeliveryEnabled` sont deux booléens plats sur `Store`, chacun avec un champ instructions texte, pilotables depuis `/admin/commerce/payments/settings`.
- `prisma/optional/commerce/payments.prisma` (lignes 25-31) : l'enum `PaymentMethodType` inclut déjà `CARD`.
- Du code Stripe existe côté checkout : `features/commerce/payment/stripe-checkout-session-state.ts`, `features/commerce/checkout/queries/get-available-payment-methods.query.ts`.
- **Aucun écran admin** ne permet aujourd'hui de voir si Stripe est actif, de le désactiver, ou de consulter son statut de connexion.
- Mécanisme d'activation actuel de Stripe : **non vérifié dans l'audit** (variable d'environnement ? toujours actif ? feature flag ?) — à investiguer en phase 1 de ce lot si la décision est de poursuivre.

## Options à trancher

1. **Exposer un toggle simple** (statut actif/inactif, visible mais non configurable en détail) — cohérent avec le pattern existant `bankTransferEnabled`/`cashOnDeliveryEnabled`, changement minimal.
2. **Exposer une configuration complète** (clés API, mode test/live, webhooks) — réplique une partie de ce que Stripe Dashboard offre déjà nativement ; à évaluer si la duplication a de la valeur ou si le Dashboard Stripe suffit.
3. **Ne rien exposer**, documenter explicitement ce choix pour couper court à la confusion future (ex. note dans `docs/domains/core/commerce/payments.md` si ce fichier existe, ou équivalent) — le pilotage de Stripe resterait entièrement dans le Dashboard Stripe et la configuration d'environnement.

## Périmètre de ce lot

- Présenter les 3 options avec leurs implications (risque, effort, valeur) au propriétaire produit.
- Documenter le mécanisme d'activation actuel de Stripe (investigation technique légère, lecture seule) pour éclairer la décision.
- Consigner la décision actée avec sa date.

## Hors périmètre

- Toute implémentation de code, quelle que soit l'option retenue — objet d'un lot séparé une fois la décision prise.
- Toute modification de la configuration Stripe existante (webhooks, clés) en production.

## Invariants

- Aucun changement de comportement du paiement carte actuel tant que ce lot n'est pas suivi d'une décision explicite et d'un lot de code dédié.

## Risques

- Risque de dupliquer inutilement des fonctionnalités déjà couvertes par le Dashboard Stripe (option 2) — à peser explicitement dans la présentation des options.

## Critères de fin

- Une option est actée avec validation humaine explicite, datée.
- Si une option nécessite du code, un lot séparé est référencé ici une fois cadré.

## Agent recommandé

`architect-review` pour la présentation des options et l'investigation technique du mécanisme d'activation actuel. Validation humaine ensuite, obligatoire avant toute suite.
