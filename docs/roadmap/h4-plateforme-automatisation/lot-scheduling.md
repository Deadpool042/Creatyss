# Lot — Scheduling

## Statut

A faire

## Objectif

Formaliser le domaine `platform.scheduling` : planification métier temporelle (fenêtres, occurrences, dates d'effet, activations différées). Le modèle Prisma est posé et le domaine est documenté comme `cross-cutting` / `activable: non` (structurel dès qu'une sémantique temporelle métier gouvernée existe), mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/platform/scheduling.prisma` — modèles `SchedulePlan`, `ScheduleWindow`, `ScheduleOccurrence` déjà posés (observés)
- Définition d'un plan de planification (fenêtre de validité, occurrence, date d'effet) rattaché à un objet ou une action métier
- Exécution ou déclenchement effectif d'une occurrence planifiée
- Admin : consultation des plans de planification et de leurs occurrences

Ce lot est positionné en H4 (plateforme/automatisation) plutôt qu'en H3, car il est fonctionnellement proche des webhooks sortants (`docs/roadmap/h4-plateforme-automatisation/lot-webhooks-sortants.md`) et du worker d'automatisation général (`docs/roadmap/h3-administration-avancee/lot-automations-worker-general.md`), tous deux relevant de l'exécution différée/déclenchée du système.

## Hors périmètre

- L'exécution asynchrone elle-même (relève de `jobs`, hors périmètre de ce lot — `scheduling` porte l'intention temporelle, pas l'exécution technique)
- L'orchestration multi-étapes (relève de `platform.workflow`, cf. lot distinct)
- Les événements publics de marché déjà livrés (`engagement.public-events`) — domaine fonctionnel différent, ne pas confondre

## Dépendances

- Décision produit : quels objets/actions du système ont réellement besoin d'une planification temporelle gouvernée au-delà de ce qui existe déjà (ex. dates d'effet ponctuelles gérées localement par certains domaines) ? — à trancher avant tout cadrage détaillé
- `docs/roadmap/h3-administration-avancee/lot-automations-worker-general.md` comme socle d'automatisation existant à ne pas dupliquer côté exécution
- `docs/domains/cross-cutting/scheduling.md` comme référence doctrinale du domaine (distinction avec `jobs`, `workflow`, `events`)

## Invariants

- Le système reste maître de la vérité sur les intentions temporelles métier planifiées
- Distinction stricte entre planification (`scheduling`) et exécution asynchrone (`jobs`) — cf. `docs/domains/cross-cutting/scheduling.md`
- Une occurrence déjà exécutée ne doit pas pouvoir être redéclenchée silencieusement

## Risques

- Duplication avec des mécanismes de planification déjà gérés localement dans d'autres domaines (ex. dates d'effet de promotions ou de campagnes) si le périmètre n'est pas clarifié
- Complexité d'un socle générique sans cas d'usage concret validé en amont

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur la résolution d'une fenêtre/occurrence planifiée et son déclenchement

## Critères de fin

- Un plan de planification peut être défini, avec fenêtre et occurrence, et déclenché de façon traçable
- La frontière avec `jobs` et `platform.workflow` est explicitement tranchée
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la cible fonctionnelle prioritaire et la frontière avec `jobs`/`workflow`, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
