<!-- docs/lots/2026-06-15-engagement-automations-archived-definition-activity-badges-link-jobs-cadrage.md -->

# Cadrage — `engagement.automations` badges d'activité sur définition archivée

## Objectif

Permettre, depuis une définition archivée visible dans
`/admin/marketing/automations`, d'ouvrir directement la sous-section
`Jobs archivés` sur un statut précis.

## Périmètre

- affichage de badges d'activité jobs sur une ligne de définition archivée ;
- navigation locale vers `Jobs archivés` avec focus définition + filtre statut ;
- réutilisation des compteurs déjà connus sur la définition archivée.

## Hors périmètre

- nouvelle route dédiée ;
- nouvelle requête de compteurs ;
- refonte de la liste des automations archivées ;
- changement des actions de restauration.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- la navigation reste locale à la même page ;
- les badges réutilisent seulement les données déjà chargées ;
- aucun nouveau contrat public n'est introduit.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- une automation archivée avec jobs liés expose des badges par statut ;
- cliquer un badge ouvre `Jobs archivés` sur le bon statut pour cette
  automation ;
- aucun comportement opératoire existant n'est modifié.

## Statut — déjà implémenté

Tous les critères de fin sont déjà satisfaits par le code existant, vérifié le
2026-06-15 :

- `formatArchivedActivityBadges` (`admin-archived-automations-list.tsx`)
  génère un badge cliquable par statut présent (`pending`, `running`,
  `failed`, `succeeded`, `cancelled`, total).
- Chaque badge est un `Link` vers `buildAutomationsPageHref({
  archivedAutomationId: automation.id, archivedStatus: item.status,
  hash: "archived-jobs" })`, ouvrant `Jobs archivés` focalisé sur cette
  automation et ce statut.
- Aucune nouvelle requête ni action : les badges réutilisent
  `automation.jobActivity` déjà chargé.

Aucun code à écrire pour ce lot.
