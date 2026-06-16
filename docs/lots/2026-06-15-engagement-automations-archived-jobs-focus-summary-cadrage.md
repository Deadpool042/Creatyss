<!-- docs/lots/2026-06-15-engagement-automations-archived-jobs-focus-summary-cadrage.md -->

# Cadrage — `engagement.automations` résumé local du focus dans jobs archivés

## Objectif

Rendre plus lisible, dans `Jobs archivés`, ce qu'implique un focus local sur une
automation archivée en rappelant le volume global de jobs liés.

## Périmètre

- affichage d'un résumé local du total de jobs archivés liés à l'automation
  focalisée ;
- rappel des statuts présents quand ils existent déjà dans le résumé chargé ;
- aucune modification des actions ni de la requête de lecture.

## Hors périmètre

- nouvelle statistique transverse ;
- refonte de la liste des jobs archivés ;
- changement des filtres existants ;
- nouvelle route dédiée.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- le résumé reste purement local à la section `Jobs archivés` ;
- il réutilise uniquement les informations déjà connues du focus automation ;
- aucun nouveau contrat public n'est introduit.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- quand un focus automation archivée est actif, `Jobs archivés` rappelle le
  volume global de jobs liés ;
- la lecture du filtre statut devient plus explicite ;
- aucun comportement opératoire existant n'est modifié.

## Statut — déjà implémenté

Tous les critères de fin sont déjà satisfaits par le code existant, vérifié le
2026-06-15 :

- `AdminArchivedAutomationJobsSection` affiche, quand
  `normalizedSelectedArchivedAutomation` est défini,
  `getArchivedAutomationJobActivitySummary(normalizedSelectedArchivedAutomation)`
  — le même résumé global déjà utilisé sur la ligne de définition archivée
  (`archived-definition-job-visibility`).
- Cette information est purement locale (réutilise `jobActivity` déjà
  chargé), sans nouvelle requête ni changement de la lecture des jobs
  archivés.
- Les filtres de statut (`JOB_STATUS_FILTERS`) et les actions de restauration
  ne sont pas modifiés.

Aucun code à écrire pour ce lot.
