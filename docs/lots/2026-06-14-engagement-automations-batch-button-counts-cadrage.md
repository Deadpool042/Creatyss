<!-- docs/lots/2026-06-14-engagement-automations-batch-button-counts-cadrage.md -->

# Cadrage — `engagement.automations` comptage visible dans les actions batch

## Objectif

Rendre les actions batch de `/admin/marketing/automations` plus explicites en
affichant directement dans chaque bouton combien de jobs visibles seront
concernés.

## Périmètre

- libellés des trois actions batch locales ;
- comptage des jobs déjà calculés dans la page ;
- adaptation purement UI, sans changement de handlers.

## Hors périmètre

- nouvelle action batch ;
- changement de requête ;
- changement de filtres ou de routes ;
- changement de limite de visibilité locale.

## Invariants

- conserver les routes canoniques existantes ;
- conserver strictement les lots batch déjà disponibles ;
- ne pas modifier les règles de sélection des jobs exécutables, annulables ou
  relançables.

## Risques

- surcharge visuelle si le libellé devient trop long ;
- incohérence si le comptage affiché diverge du résumé batch voisin.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- chaque bouton batch annonce explicitement son volume visible ;
- l'absence de jobs garde un libellé neutre et un bouton désactivé ;
- aucun comportement métier ni contrat d'URL n'est modifié.
