# Lot 8 — Behavior : segments comportementaux (cadrage)

## Statut

A faire

## Objectif

Activer le domaine `engagement.behavior` : lecture comportementale structurée (segments, états de parcours, profils comportementaux dérivés). Le modèle Prisma est posé et le domaine est documenté comme `cross-cutting` / `activable: oui`, mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/engagement/behavior.prisma` — modèles `BehaviorSegment`, `BehaviorProfile` déjà posés (observés)
- Dérivation de segments comportementaux à partir de signaux (tracking, parcours)
- Constitution d'un profil comportemental par acteur (client identifié)
- Exposition de lectures comportementales aux couches d'analyse (dashboarding, CRM le cas échéant)

## Hors périmètre

- Le tracking brut (relève de `tracking`, hors périmètre — `behavior` consomme des signaux dérivés, pas les événements bruts)
- L'attribution marketing (relève de `attribution`, déjà cadré — cf. `lot-4-attribution-cadrage.md`)
- L'analytics consolidée (relève de `analytics`/cockpit, déjà largement livré — cf. `lot-5-cockpit-consolide-cadrage.md`)
- Le CRM relationnel enrichi (relève de `crm`, hors périmètre)
- Le consentement (relève de `consent`, prérequis mais hors périmètre d'implémentation de ce lot)

## Dépendances

- Décision produit : quels segments comportementaux sont réellement exploitables pour le business, au-delà de ce que couvre déjà le cockpit analytique livré ? — à trancher avant tout cadrage détaillé
- `platform.consent` comme prérequis de conformité pour toute dérivation comportementale par acteur identifié
- Le socle tracking/attribution/cockpit déjà livré (`docs/roadmap/analyses-cockpit-analytique/lot-4-attribution-cadrage.md` à `lot-7-panier-abandonne-effet-bord-cadrage.md`) comme source de signaux
- `docs/domains/cross-cutting/behavior.md` comme référence doctrinale du domaine (distinction avec `tracking`, `attribution`, `analytics`, `crm`, `consent`)

## Invariants

- Le système reste maître de la vérité sur les segments et profils comportementaux dérivés
- Distinction stricte avec le tracking brut (`tracking`) et l'analytics consolidée (`analytics`) — cf. `docs/domains/cross-cutting/behavior.md`
- Aucune dérivation comportementale par acteur identifié sans consentement valide

## Risques

- Chevauchement fonctionnel avec le cockpit analytique déjà livré si la frontière n'est pas explicitement tranchée avant cadrage détaillé
- Risque de conformité (RGPD) si le consentement n'est pas vérifié avant toute constitution de profil comportemental

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur la dérivation d'un segment comportemental à partir de signaux donnés

## Critères de fin

- Un segment comportemental peut être dérivé et consulté, avec vérification du consentement pour tout profil par acteur identifié
- La frontière avec le cockpit analytique déjà livré est explicitement tranchée et documentée
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la priorité produit et la frontière avec le cockpit analytique déjà livré, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
