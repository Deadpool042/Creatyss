# Lot — Cartes cadeaux

## Statut

A faire

## Objectif

Activer le domaine `gift-cards` (cartes cadeaux) : émission, attribution, consommation au paiement et suivi des soldes. Les modèles Prisma sont posés et documentés comme activables, mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/commerce/gift-cards.prisma` — modèles `GiftCard`, `GiftCardTransaction` déjà posés (observés)
- Émission d'une carte cadeau (génération de code, montant, statut, expiration éventuelle)
- Consommation au checkout : application d'une carte cadeau comme moyen de règlement partiel ou total, décrément transactionnel du solde
- Admin : liste et détail des cartes cadeaux, historique des transactions (`GiftCardTransaction`), création manuelle
- Gating via `meetsFeatureLevel` — niveau(x) à définir en cadrage, cohérent avec `docs/domains/optional/gift-cards.md`

## Hors périmètre

- Vente de cartes cadeaux comme produit du catalogue (à cadrer séparément si retenu)
- Cartes cadeaux physiques ou envoi automatisé par email (dépend de `commerce.gift-cards` + `engagement` si retenu)
- Remboursement partiel d'une carte cadeau déjà partiellement consommée (cf. invariants du domaine `docs/domains/optional/gift-cards.md`)

## Dépendances

- Décision produit : la fonctionnalité cartes cadeaux est-elle réellement prioritaire pour le business, ou le schéma Prisma a-t-il été posé par anticipation sans besoin confirmé ? — à trancher avant tout cadrage détaillé
- `commerce.payments` actif (la consommation d'une carte cadeau interagit avec le règlement de commande)
- `docs/domains/optional/gift-cards.md` comme référence doctrinale du domaine (statuts, invariants de solde)

## Invariants

- Le système reste maître de la vérité sur les soldes — aucune double consommation possible (contrainte transactionnelle)
- Une carte cadeau expirée ou désactivée ne peut plus être appliquée à un paiement
- Distinction stricte avec une remise (`Discount`) ou un moyen de paiement standard — cf. `docs/domains/optional/gift-cards.md`

## Risques

- Fraude : génération de codes prévisibles ou réutilisation d'un code déjà consommé
- Cohérence comptable : une carte cadeau appliquée puis une commande annulée doit restituer le solde de façon fiable

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur la consommation transactionnelle du solde (concurrence, double consommation)

## Critères de fin

- Une carte cadeau peut être émise, consultée en admin, et appliquée au paiement d'une commande
- Le solde est décrémenté de façon transactionnelle et cohérente
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la priorité produit et cadrer l'intégration avec `commerce.payments`, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
