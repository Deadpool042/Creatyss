# Lot — Workflow d'approbation

## Statut

A faire

## Objectif

Formaliser le domaine `platform.approval` : demandes d'approbation, décisions d'acceptation/refus/révision et statuts de validation préalable gouvernée. Le modèle Prisma est posé et le domaine est documenté comme `cross-cutting` / `activable: non` (structurel dès que certaines actions sensibles ne doivent pas être exécutées sans contrôle préalable), mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/platform/approval.prisma` — modèles `ApprovalRequest`, `ApprovalDecision` déjà posés (observés)
- Création d'une demande d'approbation rattachée à une action ou un objet source (publication, action admin sensible)
- Décision d'acceptation, de refus ou de renvoi en révision, avec motif
- Blocage de l'action source tant qu'aucune décision valide n'a été rendue
- Admin : liste des demandes d'approbation en cours, historique des décisions

## Hors périmètre

- Le workflow complet d'exécution multi-étapes (relève de `platform.workflow`, cf. `docs/roadmap/h3-administration-avancee/lot-workflow-multi-etapes.md` — domaine distinct)
- L'audit sensible (relève de `audit`, hors périmètre de ce lot)
- Les permissions fines (relève de `roles`/`permissions`, hors périmètre de ce lot)
- Délégation d'approbation avancée entre acteurs (à cadrer séparément si retenu)

## Dépendances

- Décision produit : quelles actions sensibles du système nécessitent réellement une approbation préalable gouvernée (publication, action admin critique) ? — à trancher avant tout cadrage détaillé, le domaine étant générique et sans cible fonctionnelle assignée à ce jour
- `core.roles`/`core.permissions` comme base pour distinguer demandeur et approbateur
- `docs/domains/cross-cutting/approval.md` comme référence doctrinale du domaine (distinction explicite avec `workflow`, `audit`, `permissions` — cette distinction est un point d'attention documenté comme question ouverte dans le domaine lui-même)

## Invariants

- Le système reste maître de la vérité sur le statut d'une demande d'approbation
- Une décision invalide pour le statut courant ne doit pas être acceptée silencieusement
- Distinction stricte avec `workflow`, `audit` et `permissions` — cf. `docs/domains/cross-cutting/approval.md` (frontière exacte listée comme question ouverte dans la doctrine, à trancher explicitement en cadrage)

## Risques

- Confusion structurelle avec `platform.workflow` si les deux domaines sont cadrés indépendamment sans clarifier leur articulation
- Action sensible bloquée de façon incohérente si le mécanisme de blocage n'est pas rigoureusement testé

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur les transitions de statut d'une demande d'approbation (acceptation, refus, révision)

## Critères de fin

- Une demande d'approbation peut être créée, décidée (acceptée/refusée/renvoyée en révision) avec motif
- Une action source reste bloquée tant qu'aucune décision valide n'est rendue
- La frontière avec `platform.workflow` est explicitement tranchée et documentée
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la cible fonctionnelle prioritaire et la frontière avec `platform.workflow`, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
