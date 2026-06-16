<!-- docs/lots/2026-06-15-engagement-automations-job-edit-delete-cadrage.md -->

# Cadrage — `engagement.automations` modification et suppression locale d'un job

## Objectif

Permettre, depuis `/admin/marketing/automations`, de corriger un job de test
déjà planifié ou de le retirer de la liste active sans ouvrir de cockpit
transverse `jobs`.

## Périmètre

- modification du `scheduledAt` d'un job `PENDING` ;
- possibilité de vider cette planification pour le rendre immédiatement
  exécutable ;
- suppression locale d'un job via archivage ;
- annulation implicite avant archivage si le job est encore `PENDING`.

## Hors périmètre

- édition du payload métier du job ;
- édition d'un job `RUNNING` ;
- restauration d'un job archivé ;
- cockpit transverse générique des jobs.

## Invariants

- la page canonique reste `/admin/marketing/automations` ;
- un job `RUNNING` reste non supprimable ;
- un job supprimé localement ne doit plus pouvoir s'exécuter ensuite ;
- aucun autre type de job que `AUTOMATION_NEWSLETTER_SUBSCRIBED` n'est inclus.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- un job `PENDING` peut être reprogrammé ou rendu immédiat depuis sa ligne ;
- un job visible peut être retiré de la liste active si son état le permet ;
- la suppression d'un `PENDING` l'annule avant archivage ;
- aucun contrat transverse `jobs` n'est introduit.

## Statut — déjà implémenté

Tous les critères de fin sont déjà satisfaits par le code existant, vérifié le
2026-06-15 :

- `AdminAutomationJobsList` (`admin-automation-jobs-list.tsx`) propose
  "Modifier" sur les jobs `PENDING`, formulaire `datetime-local` soumis via
  `rescheduleAutomationJobAction` → `rescheduleAutomationJob` ; champ vide ⇒
  `scheduledAt: null` (exécutable immédiatement). Le service rejette les jobs
  non `PENDING` (`job_not_pending`).
- "Supprimer" appelle `archiveAutomationJobAction` → `archiveAutomationJob` :
  rejette les jobs `RUNNING` (`job_running`), annule (`CANCELLED`) puis
  archive les `PENDING`, archive directement les autres états.
- Les deux services filtrent strictement sur
  `typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE`, aucun contrat
  transverse `jobs` introduit.

Aucun code à écrire pour ce lot.
