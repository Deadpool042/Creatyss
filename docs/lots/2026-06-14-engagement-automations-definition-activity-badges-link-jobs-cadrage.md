# Cadrage — `engagement.automations` badges d'activité actionnables sur les définitions

## Objectif

Transformer le résumé d'activité jobs affiché sur chaque définition
`Automation` en point d'entrée opératoire vers la section jobs déjà filtrable.

## Périmètre

- rendre les badges d'activité cliquables dans la liste des définitions ;
- ouvrir la même section jobs avec le filtre automation et, selon le badge,
  le filtre statut adéquat ;
- rester dans `/admin/marketing/automations`.

## Hors périmètre

- nouvelle page détail ;
- nouveaux contrôles runtime ;
- refonte visuelle large ;
- cockpit transverse de file.

## Invariants

- la navigation reste locale au module `automations` ;
- les badges réutilisent les filtres déjà existants ;
- aucune route canonique hors module n'est modifiée ;
- le résumé reste lisible même sans navigation.

## Risques

- surcharge visuelle si trop de badges sont interactifs ;
- confusion entre badge de résumé et donnée exhaustive globale.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- un badge d'activité permet d'ouvrir la section jobs cohérente ;
- l'opérateur garde le contexte automation + statut dans la même page ;
- aucune surface transverse supplémentaire n'est ajoutée.
