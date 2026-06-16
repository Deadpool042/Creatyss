<!-- docs/lots/2026-06-15-engagement-automations-archived-definition-filter-counts-cadrage.md -->

# Cadrage — `engagement.automations` volumes sur filtres des définitions archivées

## Objectif

Rendre les filtres de `Automations archivées` plus informatifs en affichant
leurs volumes connus directement dans les chips.

## Périmètre

- comptage local des définitions archivées pour `Toutes`, `Code libéré` et
  `Restauration directe` ;
- affichage de ces volumes dans les filtres déjà présents ;
- aucune nouvelle route, action ou query.

## Hors périmètre

- nouvelle statistique transverse ;
- changement du comportement des filtres ;
- refonte de la section archives ;
- ajout de nouvelles catégories de filtres.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- les volumes réutilisent uniquement les définitions archivées déjà chargées ;
- les filtres existants gardent le même contrat fonctionnel ;
- aucun nouveau contrat public n'est introduit.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- les filtres de `Automations archivées` affichent leurs volumes connus ;
- l'opérateur distingue immédiatement la répartition de la corbeille locale ;
- aucun comportement opératoire existant n'est modifié.

## Statut — déjà implémenté

Tous les critères de fin sont déjà satisfaits par le code existant, vérifié le
2026-06-15 :

- `getArchivedDefinitionsFilterLabel` (`admin-automations-archives-filters.ts`)
  ajoute `(${count})` à chaque libellé de `ARCHIVED_DEFINITION_FILTERS`
  (`Toutes`, `Code libéré`, `Restauration directe`) via
  `getArchivedDefinitionsFilterCount`.
- `AdminArchivedAutomationsSection` applique cette fonction sur chaque chip,
  en réutilisant uniquement `archivedAutomations` déjà chargé.
- Aucune nouvelle route, action ou query introduite ; le comportement de
  filtrage (`matchesArchivedDefinitionFilter`) reste inchangé.

Aucun code à écrire pour ce lot.
