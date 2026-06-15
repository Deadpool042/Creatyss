<!-- docs/lots/2026-06-14-engagement-automations-batch-execution-cadrage.md -->

# Cadrage — `engagement.automations` exécution batch des jobs visibles

## Objectif

Accélérer l'opération manuelle déjà disponible sans ouvrir de worker :
permettre d'exécuter en une fois les jobs d'automation prêts déjà visibles dans
`/admin/marketing/automations`.

## Périmètre

- réutiliser l'exécuteur unitaire existant ;
- exécuter uniquement les jobs visibles et prêts dans la page ;
- borner le lot à un batch limité (`<= 25`) ;
- retourner un bilan simple succès/échecs.

## Hors périmètre

- exécution de tous les jobs du store ;
- pagination serveur dédiée ;
- retry automatique ;
- parallélisation agressive ;
- worker ou cron.

## Invariants

- même règle métier que l'exécution unitaire ;
- aucune exécution d'un job non prêt ;
- la page reste un cockpit local d'appoint, pas une file d'orchestration.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- un opérateur peut lancer les jobs prêts visibles en une action ;
- le bilan de batch reste lisible ;
- aucun worker générique n'est introduit.
