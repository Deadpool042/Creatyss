<!-- docs/lots/2026-06-15-engagement-automations-archives-reset-filters-cadrage.md -->

# Cadrage — `engagement.automations` retrait global des filtres archives

## Objectif

Permettre, depuis la carte `Archives` de `/admin/marketing/automations`, de
retirer d'un seul geste tous les filtres locaux d'archives déjà actifs.

## Périmètre

- ajout d'un retrait global local des filtres de la carte `Archives` ;
- conservation des éventuels filtres actifs sur les définitions et jobs non
  archivés ;
- retour au conteneur `Archives` après retrait.

## Hors périmètre

- retrait global de tous les filtres de page ;
- refonte des filtres unitaires déjà présents ;
- nouvelle route dédiée aux archives ;
- modification des actions de restauration.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- le retrait reste local à la carte `Archives` ;
- les filtres des sections actives restent inchangés ;
- aucun nouveau contrat public n'est introduit.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- si au moins un filtre d'archives est actif, la carte `Archives` propose un
  retrait global explicite ;
- ce retrait supprime le focus automation archivée, le filtre statut archivé et
  le filtre de définitions archivées ;
- les filtres des sections non archivées restent conservés.

## Statut — déjà implémenté

Tous les critères de fin sont déjà satisfaits par le code existant, vérifié le
2026-06-15 :

- `page.tsx` calcule `hasActiveArchivesFilters`
  (`normalizedSelectedArchivedAutomation !== null ||
  selectedArchivedJobStatus !== null ||
  selectedArchivedDefinitionFilter !== null`).
- Quand vrai, la `section#archives` affiche un lien « Retirer tous les
  filtres archives » vers `buildAutomationsPageHref({ automationId:
  selectedAutomationId, status: selectedJobStatus, definition:
  selectedDefinitionFilter, hash: "archives" })` — donc sans
  `archivedAutomation`, `archivedStatus` ni `archivedDefinition`.
- Les paramètres `automation`, `status` et `definition` (sections
  non archivées) sont explicitement conservés dans ce lien.

Aucun code à écrire pour ce lot.
