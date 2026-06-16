<!-- docs/lots/2026-06-15-engagement-automations-archived-jobs-focus-by-definition-cadrage.md -->

# Cadrage — `engagement.automations` focus local des jobs archivés par définition

## Objectif

Permettre, depuis une automation archivée visible dans
`/admin/marketing/automations`, d'ouvrir directement la sous-section
`Jobs archivés` sur les jobs liés à cette définition.

## Périmètre

- ajout d'un focus local par `Automation` archivée sur la section `Jobs archivés` ;
- lien direct depuis la ligne d'une définition archivée quand des jobs liés
  existent ;
- comptages et états vides cohérents avec ce focus local.

## Hors périmètre

- nouvelle route archives dédiée ;
- filtre transverse global des jobs ;
- refonte des restaurations existantes ;
- couplage automatique restauration définition + restauration jobs.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- le focus reste local à la même page ;
- la distinction entre définition archivée et jobs archivés reste explicite ;
- les autres filtres de page utiles restent conservés tant qu'ils ne sont pas
  retirés explicitement.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- une définition archivée avec jobs liés propose un accès direct aux jobs
  archivés correspondants ;
- la section `Jobs archivés` explicite quand le focus automation est actif ;
- les compteurs et états vides restent cohérents avec le focus courant.

## Statut — déjà implémenté

Tous les critères de fin sont déjà satisfaits par le code existant, vérifié le
2026-06-15 :

- `ArchivedAutomationRow` expose `archivedJobsHref` (« Voir les jobs archivés
  liés » / « Focus archives jobs actif » si déjà actif) vers
  `buildAutomationsPageHref({ archivedAutomationId: automation.id,
  archivedStatus: selectedArchivedJobStatus, hash: "archived-jobs" })`,
  affiché seulement si `jobActivity.total > 0`.
- `AdminArchivedAutomationJobsSection` affiche un bloc « Filtre automation
  archivée : `<code>` » dès que `normalizedSelectedArchivedAutomation` est
  défini, avec lien « Retirer filtre automation archivée ».
- `archivedJobsCountSummary` (`getArchivedJobsCountSummary`) et
  `archivedJobsEmptyStateMessage` (`getArchivedJobsEmptyStateMessage`)
  intègrent `selectedAutomationCode` issu du focus courant.

Aucun code à écrire pour ce lot.
