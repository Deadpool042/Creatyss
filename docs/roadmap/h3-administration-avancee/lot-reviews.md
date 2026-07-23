# Lot — Avis (reviews)

## Statut

A faire

## Objectif

Activer le domaine `reviews` : publication, modification, retrait et modération d'avis client. Le domaine est documenté (`docs/domains/optional/reviews.md`, `optional` / `activable: oui`), mais aucun modèle Prisma ni aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé.

## Périmètre

Proposition — aucun modèle Prisma existant à ce jour, la modélisation elle-même fait partie du lot (contrairement aux domaines catégorie A où le schéma est déjà posé) :

- Modélisation Prisma du domaine (`Review`, `ReviewRating`, `ReviewTarget`, `ReviewStatus`, `ReviewModerationDecision` — objets conceptuels cités par `docs/domains/optional/reviews.md`, non observés dans `prisma/**`)
- Publication d'un avis par un client (éventuellement restreint aux acheteurs vérifiés — à trancher en cadrage)
- Modération (validation, retrait) d'un avis
- Exposition storefront des avis sur une fiche produit
- Gating via `meetsFeatureLevel` — niveau(x) à définir en cadrage, cohérent avec `docs/domains/optional/reviews.md`

## Hors périmètre

- Le contenu éditorial générique (hors doctrine du domaine `reviews`)
- Le support client (relève de `support`, cf. `docs/roadmap/h3-administration-avancee/lot-support-tickets.md`)
- Le CRM et le marketing (hors périmètre)
- Toute intégration avec un provider tiers de collecte d'avis (relèverait de `integrations`, hors périmètre initial)

## Dépendances

- Décision produit sur la priorité, en l'absence de tout socle technique — aucun schéma Prisma n'existe, la fonctionnalité n'a jamais été cadrée ni esquissée techniquement
- `catalog.products` actif comme cible des avis
- `docs/domains/optional/reviews.md` comme référence doctrinale du domaine (distinction avec `products`, `support`, `crm`, `marketing`)

## Invariants

- Le système reste maître de la vérité sur le statut de modération d'un avis
- Distinction stricte avec le contenu éditorial et le support — cf. `docs/domains/optional/reviews.md`
- Un avis retiré ne doit plus être exposé côté storefront

## Risques

- Modélisation Prisma à créer entièrement, sans retour d'expérience d'un schéma déjà posé — risque de sous-estimation de l'effort de cadrage
- Risque de modération insuffisante (contenu abusif) si le workflow de validation n'est pas défini avant mise en production

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `db:validate` après toute évolution du schéma Prisma
- Tests unitaires sur la publication et la modération d'un avis

## Critères de fin

- Un client peut publier un avis, modéré avant ou après publication selon la règle retenue
- L'avis est exposé côté storefront sur la fiche produit concernée
- `typecheck`, `lint` et `db:validate` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la priorité produit et cadrer la modélisation initiale, avant `prisma-architect` (modélisation du schéma, inexistant à ce jour) et `next-feature-builder`.
