# Lot — Support (tickets)

## Statut

A faire

## Objectif

Formaliser le domaine `platform.support` : ticket, conversation, assignation, résolution et clôture d'une demande d'assistance. Le modèle Prisma est posé et le domaine est documenté comme `cross-cutting` / `activable: non` (structurel dès qu'un traitement gouverné des demandes d'assistance existe), mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/engagement/support.prisma` — modèles `SupportTicket`, `SupportMessage` déjà posés (observés)
- Création d'un ticket support (client ou admin), statuts explicites (ouvert, en cours, résolu, clos)
- Échanges de messages rattachés à un ticket
- Assignation d'un ticket à un agent/rôle
- Admin : liste, détail, traitement des tickets

**Note doctrinale** : contrairement aux domaines `optional` (gift-cards, loyalty, subscriptions), `platform.support` est documenté `cross-cutting` avec `Activable: non` — c'est-à-dire structurel dès lors qu'un traitement gouverné des demandes d'assistance existe, et non un module optionnel activable par palier de feature flag. Le cadrage doit donc trancher en amont si un gating `meetsFeatureLevel` reste pertinent ici, ou si l'activation se fait par simple mise en production du module sans niveau de gradation dédié.

## Hors périmètre

- Base de connaissances / FAQ self-service (hors doctrine actuelle du domaine `support`)
- Chat en temps réel (dépend d'une décision d'outillage tiers, hors périmètre Prisma actuel)
- Intégration avec un outil de support tiers (relèverait de `integrations`, pas de ce domaine)

## Dépendances

- Décision produit : le support structuré interne est-il réellement prioritaire, ou une solution tierce (helpdesk externe) est-elle privilégiée à la place de ce socle Prisma ? — à trancher avant tout cadrage détaillé
- `core.users`/`core.customers` comme rattachement des demandeurs
- `docs/domains/cross-cutting/support.md` comme référence doctrinale du domaine (statuts, distinction avec CRM/retours/notifications)

## Invariants

- Le système reste maître de la vérité sur le statut et l'historique d'un ticket
- Distinction stricte avec le CRM (`crm`), les retours (`returns`) et les notifications transactionnelles (`notifications`) — cf. `docs/domains/cross-cutting/support.md`
- Un ticket clos ne doit pas pouvoir recevoir de nouveaux messages sans réouverture explicite

## Risques

- Confusion fonctionnelle avec le futur domaine `returns` déjà implémenté (gestion retours) si la frontière n'est pas clarifiée
- Charge opérationnelle si aucun outillage d'assignation/priorisation n'est prévu dès le cadrage

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur les transitions de statut d'un ticket

## Critères de fin

- Un ticket peut être créé, suivi de messages, assigné et clos
- L'admin dispose d'une vue de traitement des tickets
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la priorité produit et le mode d'activation (structurel vs gating par niveau), avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
