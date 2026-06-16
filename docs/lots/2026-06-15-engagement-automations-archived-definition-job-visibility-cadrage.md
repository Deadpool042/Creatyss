<!-- docs/lots/2026-06-15-engagement-automations-archived-definition-job-visibility-cadrage.md -->

# Cadrage — `engagement.automations` lisibilité des jobs liés sur une définition archivée

## Objectif

Éviter, dans `/admin/marketing/automations`, la confusion entre une définition
archivée et les jobs archivés éventuellement liés à cette définition.

## Périmètre

- lecture locale du volume de jobs archivés liés à chaque `Automation`
  archivée ;
- affichage d'un résumé simple directement dans la ligne de définition
  archivée ;
- détail local par statut quand des jobs archivés existent déjà.

## Hors périmètre

- nouveau filtre des jobs archivés par automation ;
- nouvelle route archives dédiée ;
- refonte de la section `Jobs archivés` ;
- restauration croisée automatique définition + jobs.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- la distinction entre définition et exécution reste explicite ;
- aucune nouvelle action opératoire n'est ajoutée ;
- aucun cockpit transverse `jobs` n'est introduit.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- une automation archivée sans job lié l'explicite localement ;
- une automation archivée avec jobs liés affiche un résumé lisible ;
- ce résumé n'altère ni la restauration des définitions ni la section
  `Jobs archivés`.

## Statut — déjà implémenté

Tous les critères de fin sont déjà satisfaits par le code existant, vérifié le
2026-06-15 :

- `getArchivedAutomationJobActivitySummary`
  (`admin-automations-archives-filters.ts`) retourne « Aucun job archivé
  lié. » si `jobActivity.total === 0`, sinon une phrase agrégée
  (`"N jobs archivés liés · M en attente · ..."`).
- `ArchivedAutomationRow` affiche ce résumé sous chaque ligne de définition
  archivée, indépendamment des badges cliquables
  (`formatArchivedActivityBadges`).
- Lecture purement locale de `automation.jobActivity` déjà chargé : aucune
  action de restauration ni la section `Jobs archivés` ne sont modifiées.

Aucun code à écrire pour ce lot.
