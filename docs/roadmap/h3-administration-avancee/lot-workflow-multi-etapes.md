# Lot — Workflow multi-étapes

## Statut

A faire

## Objectif

Formaliser le domaine `platform.workflow` : orchestration structurée de processus métier multi-étapes (définitions, instances, transitions, blocages). Le modèle Prisma est posé et le domaine est documenté comme `cross-cutting` / `activable: non` (structurel dès que plusieurs processus métier nécessitent une coordination explicite entre étapes), mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/platform/workflow.prisma` — modèles `WorkflowDefinition`, `WorkflowDefinitionStep`, `WorkflowInstance`, `WorkflowStepInstance` déjà posés (observés)
- Définition d'un workflow multi-étapes (séquence d'étapes, transitions autorisées, préconditions)
- Instanciation et suivi d'exécution d'un workflow pour une action ou un objet métier donné
- Admin : consultation de l'état d'une instance de workflow, blocages en cours

**Positionnement par rapport à l'existant** : ce lot se présente comme une extension logique de `docs/roadmap/h3-administration-avancee/lot-automations-worker-general.md` (déjà livré). Le worker d'automatisation général exécute des actions déclenchées par événement de façon largement unitaire ; `platform.workflow` ajouterait une couche d'orchestration multi-étapes explicite (séquencement, blocages, préconditions inter-étapes) qui n'existe pas dans le socle automations actuel. Le cadrage doit vérifier si le besoin métier concret justifie cette couche supplémentaire avant d'investir dans son implémentation, plutôt que d'étendre le worker existant de façon ad hoc.

## Hors périmètre

- Approbations explicites au sein d'un workflow (relève de `platform.approval`, cf. `docs/roadmap/h3-administration-avancee/lot-workflow-approbation.md` — domaine distinct documenté)
- Interface de conception visuelle de workflow (no-code) — hors périmètre technique de ce lot
- Migration des automatisations existantes (`lot-automations-worker-general.md`) vers ce moteur — décision produit séparée, non présumée par ce lot

## Dépendances

- Décision produit : un moteur d'orchestration multi-étapes est-il réellement nécessaire au-delà du worker d'automatisation général déjà livré ? — à trancher avant tout cadrage détaillé
- `docs/roadmap/h3-administration-avancee/lot-automations-worker-general.md` comme référence du socle d'automatisation existant à ne pas dupliquer
- `docs/domains/cross-cutting/workflow.md` comme référence doctrinale du domaine (distinction avec `approval`, `jobs`, domain events)

## Invariants

- Le système reste maître de la vérité sur l'état d'avancement d'une instance de workflow
- Distinction stricte avec les approbations (`approval`), les jobs asynchrones (`jobs`) et les domain events internes — cf. `docs/domains/cross-cutting/workflow.md`
- Une transition non autorisée par la définition de workflow ne doit jamais être acceptée silencieusement

## Risques

- Duplication avec le worker d'automatisation général si la frontière fonctionnelle n'est pas tranchée avant l'implémentation
- Complexité d'exploitation d'un moteur d'orchestration générique sans cas d'usage concret validé en amont

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur les transitions autorisées/refusées d'une instance de workflow

## Critères de fin

- Un workflow multi-étapes peut être défini et instancié, avec suivi d'état par étape
- La frontière avec le worker d'automatisation général est documentée et respectée
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la nécessité réelle du moteur et sa frontière avec l'automatisation existante, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
