# Lot — Fraud risk

## Statut

A faire

## Objectif

Formaliser le domaine `platform.fraud-risk` : évaluation structurée du risque de fraude (signaux, niveaux de risque, revues, décisions antifraude). Le modèle Prisma est posé et le domaine est documenté comme `cross-cutting` / `activable: non` (structurel dès qu'un flux transactionnel, financier ou sensible existe dans le système — ce qui est déjà le cas via `commerce.payments`/`commerce.orders`), mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/platform/fraud-risk.prisma` — modèles `FraudRiskAssessment`, `FraudRiskDecision`, `FraudRiskReview` déjà posés (observés)
- Évaluation consolidée de risque rattachée à une opération sensible (paiement, commande)
- Décision métier associée (acceptation, blocage, revue manuelle)
- Revue/investigation d'un cas signalé
- Admin : consultation des évaluations et décisions antifraude

Ce lot est positionné en H2 (commerce fiable), proche du runbook Stripe déjà livré (`docs/roadmap/h2-commerce-fiable` — capture virement, webhook `payment_failed`) et des retours/remboursements, car le risque de fraude s'évalue au plus près du flux transactionnel.

## Hors périmètre

- Intégration avec un provider antifraude tiers spécialisé (relèverait de `integrations`, hors périmètre initial)
- Scoring automatique par apprentissage/IA (hors doctrine actuelle, à cadrer séparément si retenu)
- Blocage automatique sans revue humaine pour les cas à risque élevé (décision produit à trancher explicitement, l'automatisation intégrale d'un refus pouvant avoir un impact commercial fort)

## Dépendances

- Décision produit : le volume et le contexte commercial actuels justifient-ils un module antifraude structuré, ou le risque est-il aujourd'hui géré de façon suffisante par Stripe côté paiement ? — à trancher avant tout cadrage détaillé
- `commerce.payments`/`commerce.orders` comme source des opérations évaluées
- `docs/domains/cross-cutting/fraud-risk.md` comme référence doctrinale du domaine (distinction avec `payments`, `orders`, `permissions`, `audit`, `tracking`)

## Invariants

- Le système reste maître de la vérité sur les évaluations et décisions antifraude internes
- Distinction stricte avec les paiements (`payments`), les commandes (`orders`), les permissions (`permissions`) et l'audit (`audit`) — cf. `docs/domains/cross-cutting/fraud-risk.md`
- Une décision antifraude doit rester explicable (signal déclencheur, niveau de risque, motif)

## Risques

- Blocage abusif de commandes légitimes si les seuils/règles ne sont pas calibrés avec prudence
- Redondance avec les mécanismes antifraude déjà fournis nativement par Stripe (Radar) si le périmètre n'est pas clarifié en amont

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur la résolution d'un niveau de risque et la décision associée

## Critères de fin

- Une opération sensible peut faire l'objet d'une évaluation de risque et d'une décision explicable
- La frontière avec l'antifraude déjà fournie par Stripe est explicitement tranchée
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la nécessité réelle du module face à l'antifraude Stripe existante, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
