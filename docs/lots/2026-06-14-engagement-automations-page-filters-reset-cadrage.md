<!-- docs/lots/2026-06-14-engagement-automations-page-filters-reset-cadrage.md -->

# Cadrage — `engagement.automations` réinitialisation globale des filtres de page

## Objectif

Permettre à l'opérateur de revenir rapidement à la vue complète de
`/admin/marketing/automations` quand plusieurs filtres locaux se cumulent.

## Périmètre

- filtres `definition`, `automation`, `status` déjà portés par l'URL ;
- bandeau récapitulatif local sur la page ;
- lien unique de retour à la vue non filtrée.

## Hors périmètre

- nouveau filtre ;
- changement de hash ;
- suppression des retraits locaux déjà présents ;
- changement des sections ou du chargement des données.

## Invariants

- conserver les paramètres existants tant que l'opérateur ne demande pas le reset global ;
- ne pas modifier les routes canoniques ;
- garder les retraits fins par section ;
- rester strictement local au cockpit `automations`.

## Risques

- redondance visuelle avec les liens de retrait déjà présents ;
- résumé de filtres trop verbeux si plusieurs états sont actifs.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- vérification manuelle de `/admin/marketing/automations` avec :
  - `definition` seul
  - `automation` + `status`
  - `definition` + `automation` + `status`

## Critères de fin

- un bandeau n'apparaît que lorsqu'au moins un filtre de page est actif ;
- ce bandeau résume l'état courant ;
- un clic permet de revenir à la vue non filtrée complète ;
- les retraits locaux existants restent inchangés.
