# Lot — Paiement en ligne (Stripe)

## Statut

Implémenté — recette production non exécutée (VPS et domaine HTTPS requis)

## Objectif

Intégrer Stripe pour permettre aux clientes de payer par carte bancaire lors du checkout. Remplacer le mode unique "Virement bancaire" par un vrai flux de paiement en ligne sécurisé.

## Périmètre

Implémenté (2026-06-22) :

- `app/api/stripe/webhook/route.ts` — webhook Stripe, signature vérifiée, idempotent
- `features/commerce/payment/lib/payment.repository.ts` — `markPaymentSucceededByCheckoutSessionId` (idempotent), `markPaymentFailedByCheckoutSessionId`, `saveStripeCheckoutSessionForOrder`
- Événements gérés : `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`
- Email `payment_succeeded` déclenché depuis le webhook (non fatal)
- Configuration `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` documentée dans `docs/exploitation/01-variables-d-environnement.md`
- Runbook de recette : `docs/exploitation/06-recette-commerce-complete.md`

Non recetté en production — bloqué par l'absence de VPS et de domaine HTTPS public.

## Hors périmètre

- Apple Pay, Google Pay
- Paiement en plusieurs fois (BNPL)
- 3DS avancé (géré automatiquement par Stripe)
- Multi-devises
- Remboursements Stripe automatiques (couverts dans H2 `lot-retours-remboursement-complets`)
- Stripe Connect ou marketplace

## Dépendances

- Compte Stripe marchand réel avec clés API (prérequis externe)
- HTTPS en production (`lot-deploiement-vps-prod` doit être terminé avant le test en production)
- Pour le développement local : tunnel ngrok ou Stripe CLI pour recevoir les webhooks

## Invariants

- Les numéros de carte ne doivent jamais transiter par le serveur applicatif — Stripe.js obligatoire côté client
- Le statut de commande ne doit être mis à jour que sur confirmation du webhook Stripe, pas sur retour de page
- Le flux virement bancaire existant ne doit pas être cassé avant que le paiement en ligne soit validé
- Les modèles Prisma `Payment`/`PaymentAttempt` déjà posés ne doivent pas être redessinés sans validation `architect-review`

## Risques

- Webhooks Stripe requièrent HTTPS — impossible de tester le flux complet en local sans tunnel
- Email transactionnel avec provider réel : si `resend`/`postmark` n'est pas configuré, la confirmation email échouera silencieusement (non fatal selon la doctrine, mais à vérifier)
- Conformité PCI-DSS : tout contournement de Stripe.js qui ferait transiter un numéro de carte en clair est une violation
- Double validation risquée : ne pas confirmer la commande à la fois sur le retour de page ET sur le webhook

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` — tests unitaires sur la logique de résolution de statut
- Test E2E local avec Stripe CLI en mode webhook forwarding
- Recette manuelle : parcours complet carte test Stripe → confirmation commande → admin commande avec statut payé

## Critères de fin

- Une cliente peut payer par carte bancaire en production
- Le statut de paiement dans l'admin reflète la réalité Stripe (confirmé / échoué)
- Le webhook Stripe est reçu, la signature est vérifiée, la commande est mise à jour
- `typecheck` et `lint` passent sans erreur
- La méthode virement bancaire reste disponible en parallèle (pas de régression)

## Agent recommandé

`architect-review` pour le cadrage du flux Payment Intent et de la gestion des webhooks, puis `next-feature-builder` pour l'implémentation.
