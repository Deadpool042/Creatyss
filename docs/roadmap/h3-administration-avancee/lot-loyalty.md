# Lot — Fidélité

## Statut

A faire

## Objectif

Activer le domaine `loyalty` (fidélité) : accumulation de points/droits, paliers, consommation de récompenses. Les modèles Prisma sont posés et documentés comme activables, mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/commerce/loyalty.prisma` — modèles `LoyaltyAccount`, `LoyaltyTransaction` déjà posés (observés)
- Accumulation de points/droits à la commande (règle de gain à définir en cadrage)
- Consommation de récompenses ou paliers (à définir : réduction, cadeau, accès anticipé — dépend de la décision produit)
- Admin : consultation du compte fidélité d'un client, historique des transactions
- Storefront : affichage du solde/statut fidélité côté client (`/compte`)
- Gating via `meetsFeatureLevel` — niveau(x) à définir en cadrage, cohérent avec `docs/domains/optional/loyalty.md`

## Hors périmètre

- Programme de parrainage (distinct de la fidélité au sens strict)
- Paliers avec avantages tiers (partenariats externes)
- Notifications automatiques de changement de palier (dépend de `engagement.automations` si retenu)

## Dépendances

- Décision produit : la fonctionnalité fidélité est-elle réellement prioritaire, ou le schéma Prisma a-t-il été posé par anticipation sans règle métier confirmée (barème de points, paliers, récompenses) ? — à trancher avant tout cadrage détaillé
- `commerce.customers` observé comme base (le compte fidélité est rattaché à un `Customer`)
- `docs/domains/optional/loyalty.md` comme référence doctrinale du domaine (statuts, invariants de solde et droits)

## Invariants

- Le système reste maître de la vérité sur les points/droits — aucune double attribution ou double consommation possible
- Distinction stricte avec une remise (`Discount`) ou une carte cadeau (`gift-cards`) — cf. `docs/domains/optional/loyalty.md`
- Une commande annulée ou remboursée ne doit pas laisser des points déjà crédités de façon incohérente

## Risques

- Complexité du barème : sans règle métier tranchée en amont, le risque est de coder une logique de gain/consommation qui devra être entièrement revue
- Cohérence comptable : annulation/remboursement d'une commande ayant généré des points

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur l'attribution et la consommation transactionnelle des points

## Critères de fin

- Un compte fidélité accumule des points à la commande selon une règle définie
- L'admin et le client peuvent consulter le solde et l'historique
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la priorité produit et le barème de gain/consommation, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
