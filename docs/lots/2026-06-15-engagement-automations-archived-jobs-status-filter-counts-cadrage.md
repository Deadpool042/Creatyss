<!-- docs/lots/2026-06-15-engagement-automations-archived-jobs-status-filter-counts-cadrage.md -->

# Cadrage — `engagement.automations` volumes sur filtres de statut des jobs archivés

## Objectif

Rendre plus explicites les filtres de statut de `Jobs archivés` quand une
automation archivée est focalisée.

## Périmètre

- affichage des volumes connus sur les chips de statut de `Jobs archivés` ;
- activation uniquement dans le contexte d'un focus automation archivée ;
- réutilisation du résumé déjà chargé sur cette automation.

## Hors périmètre

- nouvelle requête dédiée aux compteurs ;
- changement du comportement de filtrage ;
- ajout de statistiques transverses globales ;
- refonte visuelle complète de la section.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- les volumes affichés réutilisent uniquement les données déjà connues du focus ;
- les libellés restent lisibles sans changer le contrat des filtres ;
- aucun nouveau contrat public n'est introduit.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- quand une automation archivée est focalisée, les filtres de statut de
  `Jobs archivés` affichent les volumes connus ;
- la lecture des statuts disponibles devient immédiate ;
- aucun comportement opératoire existant n'est modifié.
