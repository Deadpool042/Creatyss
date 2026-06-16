<!-- docs/lots/2026-06-15-engagement-automations-archived-jobs-hidden-by-status-cadrage.md -->

# Cadrage — `engagement.automations` jobs archivés masqués par filtre statut

## Objectif

Éviter, dans `Jobs archivés`, qu'un focus sur une automation archivée semble
vide sans explication quand le filtre de statut courant masque en réalité tous
ses jobs.

## Périmètre

- détection locale d'une automation archivée focalisée qui possède des jobs
  archivés mais aucun dans le statut filtré ;
- message explicite dans la section `Jobs archivés` ;
- raccourci local pour retirer le filtre statut tout en conservant le focus
  automation.

## Hors périmètre

- refonte du modèle de filtrage des jobs archivés ;
- changement de la query métier ;
- retrait automatique du filtre ;
- nouvelle route ou vue dédiée.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- le focus automation archivée reste conservé ;
- le retrait du filtre statut reste explicite et déclenché par l'opérateur ;
- aucun nouveau contrat public n'est introduit.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- si une automation archivée focalisée possède des jobs archivés mais aucun
  dans le statut choisi, la section l'explicite ;
- l'opérateur peut retirer le filtre statut sans perdre le focus automation ;
- la zone ne reste plus silencieusement vide dans ce cas précis.

## Statut — déjà implémenté

Tous les critères de fin sont déjà satisfaits par le code existant, vérifié le
2026-06-15 :

- `page.tsx` calcule `isArchivedJobsStatusMaskingFocusedAutomation`
  (`normalizedSelectedArchivedAutomation !== null &&
  selectedArchivedJobStatus !== null && jobActivity.total > 0 &&
  getArchivedAutomationStatusCount(automation, selectedArchivedJobStatus)
  === 0`).
- `AdminArchivedAutomationJobsSection` affiche alors un message « L'automation
  `<code>` a bien des jobs archivés, mais aucun pour le statut `<label>`. »
  avec un lien « Retirer filtre archives jobs ».
- Ce lien pointe vers `buildAutomationsPageHref({ ...,
  archivedAutomationId: normalizedSelectedArchivedAutomation.id,
  archivedDefinition: selectedArchivedDefinitionFilter,
  hash: "archived-jobs" })` (sans `archivedStatus`), conservant le focus
  automation.

Aucun code à écrire pour ce lot.
