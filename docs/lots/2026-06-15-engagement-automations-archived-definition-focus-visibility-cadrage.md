<!-- docs/lots/2026-06-15-engagement-automations-archived-definition-focus-visibility-cadrage.md -->

# Cadrage — `engagement.automations` visibilité du focus définition archivée

## Objectif

Rendre immédiatement lisible, dans la section `Automations archivées` de
`/admin/marketing/automations`, quand un focus local par définition archivée est
actif.

## Périmètre

- rappel local du focus actif dans la section `Automations archivées` ;
- identification visuelle de la ligne archivée ciblée ;
- conservation du comportement de navigation déjà en place.

## Hors périmètre

- nouveau filtre fonctionnel ;
- refonte de la liste des automations archivées ;
- nouvelle route dédiée ;
- changement des restaurations existantes.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- le focus reste purement local à la même page ;
- la distinction entre définition archivée ciblée et simple filtre d'archives
  reste compréhensible ;
- aucun contrat public n'est modifié.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- la section `Automations archivées` explicite quand un focus définition est
  actif ;
- la ligne correspondante reste identifiable visuellement ;
- la navigation croisée `job archivé -> définition archivée` gagne en lisibilité
  sans élargir le périmètre du cockpit.

## Statut — déjà implémenté

Tous les critères de fin sont déjà satisfaits par le code existant, vérifié le
2026-06-15 :

- `AdminArchivedAutomationsSection` affiche un bloc « Focus automation
  archivée : `<code>` » dès que `normalizedSelectedArchivedAutomation` est
  défini.
- `ArchivedAutomationRow` (`admin-archived-automations-list.tsx`) applique un
  fond distinct (`bg-surface-subtle/30 px-3`) et un badge « Focus actif » sur
  la ligne dont `isArchivedAutomationFocused` est vrai.
- La navigation croisée `job archivé -> définition archivée`
  (`archived-definition-focus-from-job`) aboutit donc à une ligne identifiable
  sans aucun nouveau filtre ni route.

Aucun code à écrire pour ce lot.
