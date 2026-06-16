<!-- docs/lots/2026-06-15-engagement-automations-archived-jobs-status-filter-cadrage.md -->

# Cadrage — `engagement.automations` filtre local des jobs archivés par statut

## Objectif

Permettre, dans la section locale des jobs archivés de
`/admin/marketing/automations`, de se concentrer sur un sous-ensemble de
statut sans ouvrir de cockpit transverse `jobs`.

## Périmètre

- filtre local des jobs archivés par statut ;
- conservation du même écran canonique ;
- comptage visible du sous-ensemble filtré ;
- état vide contextuel quand le filtre ne renvoie aucun job archivé visible ;
- conservation du focus sur la section d'archives concernée ;
- retrait explicite du filtre dans la même section.

## Hors périmètre

- nouvelle route dédiée aux archives jobs ;
- nouveau filtre transverse global ;
- recherche texte multi-critères ;
- changement de la sémantique de restauration des jobs archivés.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- le filtre reste local à la section des jobs archivés ;
- la restauration simple et batch continue de porter seulement sur les jobs
  archivés actuellement visibles ;
- aucun cockpit transverse `jobs` n'est introduit.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- un opérateur peut filtrer les jobs archivés par statut ;
- la section explicite le volume visible vs total ;
- la section explicite aussi quand le vide vient du filtre statut actif ;
- un lien permet de retirer ce filtre sans perdre les autres contextes de page ;
- la restauration simple ou batch continue de fonctionner sur la vue filtrée.

## Statut — déjà implémenté

Tous les critères de fin sont déjà satisfaits par le code existant, vérifié le
2026-06-15 :

- `AdminArchivedAutomationJobsSection` affiche les chips
  `JOB_STATUS_FILTERS` (liens `buildAutomationsPageHref({ ...,
  archivedStatus: filter.value, hash: "archived-jobs" })`), avec état actif
  (`variant="secondary"`) selon `selectedArchivedJobStatus`.
- `archivedJobsCountSummary` (`getArchivedJobsCountSummary`) explicite
  « N visibles sur M ... pour le filtre `<label>` » ; quand le filtre rend la
  vue vide, `archivedJobsEmptyStateMessage`
  (`getArchivedJobsEmptyStateMessage`) adapte le message au statut et/ou à
  l'automation focalisée.
- Quand `selectedArchivedJobStatusLabel` est défini, un bloc « Filtre
  archives jobs : `<label>` » avec lien « Retirer filtre archives jobs »
  (sans `archivedStatus`, autres paramètres conservés) est affiché.
- `AdminArchivedAutomationJobsList` reçoit `jobs` déjà filtrés par
  `listAdminArchivedAutomationJobs(25, selectedArchivedAutomationId,
  selectedArchivedJobStatus)` ; `restoreAutomationJobAction` et
  `restoreAutomationJobsBatchAction` opèrent sur ces jobs visibles.

Aucun code à écrire pour ce lot.
