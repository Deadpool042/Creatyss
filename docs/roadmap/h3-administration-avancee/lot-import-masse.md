# Lot — Import de masse

## Statut

A faire

## Objectif

Formaliser le domaine `platform.import` : ingestion structurée et gouvernée de données externes (fichier, flux) vers les modèles internes. Le modèle Prisma est posé et le domaine est documenté comme `cross-cutting` / `activable: non` (structurel dès qu'une ingestion gouvernée existe), mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/platform/import.prisma` — modèles `ImportDefinition`, `ImportRequest`, `ImportArtifact` déjà posés (observés)
- Définition d'un import disponible (catalogue produits, clients, etc. — cible à cadrer)
- Soumission d'une demande d'import avec artefact source (fichier), validation/pré-contrôle avant application
- Suivi de statut (validé, appliqué, partiellement appliqué, rejeté, annulé, expiré)
- Admin : suivi des imports en cours et historique

## Hors périmètre

- Synchronisation continue avec un provider externe (relève de `integrations`, pas de ce domaine)
- Webhooks entrants (domaine distinct)
- Mapping avancé de champs configurable en no-code (hors périmètre technique initial)

## Dépendances

- Décision produit : quel(s) import(s) de masse sont réellement prioritaires (catalogue, clients, stock) ? — à trancher avant tout cadrage détaillé, le domaine Prisma étant générique et sans cible fonctionnelle assignée à ce jour
- Domaines cible concernés (`catalog.products`, `commerce.customers`, etc.) selon le périmètre retenu
- `docs/domains/cross-cutting/import.md` comme référence doctrinale du domaine (distinction avec `integrations`, `documents`, webhooks)

## Invariants

- Le système reste maître de la vérité sur le statut d'un import et son résultat de validation
- Distinction stricte avec les intégrations provider-specific continues (`integrations`) — cf. `docs/domains/cross-cutting/import.md`
- Un import partiellement appliqué doit rester explicable (quelles lignes appliquées, lesquelles rejetées et pourquoi)

## Risques

- Corruption de données si l'application d'un import n'est pas transactionnelle ou n'a pas de mécanisme de rollback
- Absence de cible fonctionnelle claire en amont, menant à un socle générique jamais réellement exploité

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur la validation et l'application partielle d'un import

## Critères de fin

- Un import peut être soumis, validé, appliqué (totalement ou partiellement) avec traçabilité du résultat
- L'admin dispose d'un suivi des imports
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la cible fonctionnelle prioritaire, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
