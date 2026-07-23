# Lot — Export de masse

## Statut

A faire

## Objectif

Formaliser le domaine `platform.export` : extraction structurée et gouvernée de données internes (fichier, flux). Le modèle Prisma est posé et le domaine est documenté comme `cross-cutting` / `activable: non` (structurel dès qu'une extraction gouvernée existe), mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/platform/export.prisma` — modèles `ExportDefinition`, `ExportRequest`, `ExportArtifact` déjà posés (observés)
- Définition d'un export disponible (catalogue, clients, commandes — cible à cadrer)
- Soumission d'une demande d'export, génération d'un artefact, mise à disposition, expiration
- Admin : suivi des exports demandés et historique

**Distinction importante avec l'existant** : ce socle générique `platform.export` est distinct de l'export RGPD ad-hoc déjà en production sur `app/api/admin/customers/[customerId]/export/route.ts` (observé). Cet export RGPD existant est spécifique au droit d'accès d'un client et ne réutilise pas les modèles `ExportDefinition`/`ExportRequest`/`ExportArtifact`. Ce lot ne doit pas migrer ou dupliquer l'export RGPD existant sans décision explicite ; il vise un mécanisme d'export de masse générique et gouverné (catalogue, commandes, etc.), à périmètre distinct.

## Hors périmètre

- Migration de l'export RGPD ad-hoc existant vers ce socle générique — décision produit séparée, non présumée par ce lot
- Synchronisation continue avec un provider externe (relève de `integrations`)
- Planification récurrente automatique d'export (dépend de `platform.scheduling` si retenu)

## Dépendances

- Décision produit : quel(s) export(s) de masse sont réellement prioritaires ? — à trancher avant tout cadrage détaillé, le domaine Prisma étant générique et sans cible fonctionnelle assignée à ce jour
- `docs/domains/cross-cutting/export.md` comme référence doctrinale du domaine (distinction avec `documents`, `integrations`, `analytics`)
- Confirmation que l'export RGPD existant (`app/api/admin/customers/[customerId]/export/route.ts`) reste hors périmètre de ce lot

## Invariants

- Le système reste maître de la vérité sur le statut d'un export et son artefact produit
- Distinction stricte avec les documents métier durables (`documents`) et l'export RGPD ad-hoc déjà en production
- Un artefact d'export expiré ne doit plus être accessible

## Risques

- Confusion avec l'export RGPD existant si la distinction n'est pas maintenue explicitement dans le code et la documentation
- Exposition de données sensibles si les règles de rétention et d'accès à l'artefact ne sont pas strictement définies

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur la génération et l'expiration d'un artefact d'export

## Critères de fin

- Un export de masse peut être demandé, généré, mis à disposition puis expiré
- La distinction avec l'export RGPD ad-hoc existant est documentée et respectée
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la cible fonctionnelle prioritaire et la frontière avec l'export RGPD existant, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
