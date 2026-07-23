# Lot — Abonnements

## Statut

A faire

## Objectif

Activer le domaine `subscriptions` : souscription, renouvellement, suspension, résiliation et réactivation d'un abonnement. Les modèles Prisma sont posés et le domaine est documenté comme `optional` / `activable: oui`, mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/commerce/subscriptions.prisma` — modèles `Subscription`, `SubscriptionItem` déjà posés (observés)
- Souscription à un plan récurrent, avec cycle de renouvellement et statut explicite
- Suspension, résiliation, réactivation d'un abonnement
- Facturation récurrente : génération périodique d'une commande ou d'un paiement rattaché à l'abonnement (interaction avec `commerce.orders` / `commerce.payments` à cadrer)
- Admin : liste et détail des abonnements, historique des cycles
- Gating via `meetsFeatureLevel` — niveau(x) à définir en cadrage, cohérent avec `docs/domains/optional/subscriptions.md`

## Hors périmètre

- Gestion fine de plans tarifaires multi-devises ou multi-paliers (dépend de `commerce.pricing`)
- Portail self-service client pour gérer son propre abonnement (à cadrer séparément si retenu)
- Distinction avec `platform.scheduling` : un abonnement porte un engagement commercial récurrent, pas une simple planification temporelle générique

## Dépendances

- Décision produit : la fonctionnalité abonnement est-elle réellement prioritaire pour le business, ou le schéma Prisma a-t-il été posé par anticipation sans besoin confirmé ? — à trancher avant tout cadrage détaillé
- `commerce.orders` et `commerce.payments` actifs (le renouvellement d'un abonnement génère une commande et un paiement)
- `docs/domains/optional/subscriptions.md` comme référence doctrinale du domaine (statuts, cycles, invariants d'engagement)

## Invariants

- Le système reste maître de la vérité sur le cycle et le statut d'un abonnement — pas de double renouvellement pour un même cycle
- Distinction stricte avec une commande ponctuelle (`orders`) ou la fidélité (`loyalty`) — cf. `docs/domains/optional/subscriptions.md`
- Une résiliation ne doit pas laisser un renouvellement déjà planifié s'exécuter silencieusement

## Risques

- Cohérence des renouvellements automatiques en cas d'échec de paiement (interaction avec le runbook Stripe déjà en place — cf. `docs/roadmap/h2-commerce-fiable`)
- Complexité de la facturation récurrente sans règle métier tranchée en amont (fréquence, proration, changements de plan en cours de cycle)

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur le cycle de renouvellement et les transitions de statut

## Critères de fin

- Un client peut souscrire à un plan récurrent, et l'abonnement suit un cycle de renouvellement explicite
- L'admin peut consulter la liste et l'historique des abonnements
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la priorité produit et cadrer l'intégration avec `commerce.orders`/`commerce.payments`, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
