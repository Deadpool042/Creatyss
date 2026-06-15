# Cadrage — `engagement.automations` retrait global des filtres jobs

## Objectif

Permettre à un opérateur de revenir en une action à la vue jobs globale du
cockpit, sans perdre le contexte `definition`.

## Périmètre

- afficher un lien unique de remise à zéro quand un filtre jobs est actif ;
- retirer ensemble les filtres `automation` et `status` ;
- conserver le contexte `definition` de la page.

## Hors périmètre

- nouveaux filtres ;
- nouvelle vue transverse ;
- refonte large du header jobs ;
- modification des règles runtime.

## Invariants

- la navigation reste locale à `/admin/marketing/automations` ;
- la remise à zéro ne touche pas le filtre `definition` ;
- aucun cockpit transverse `jobs` n'est ajouté.

## Risques

- redondance partielle avec les retraits individuels déjà présents ;
- surcharge mineure du header si trop de rappels sont empilés.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- l'opérateur peut retirer tous les filtres jobs actifs en une action ;
- le contexte `definition` reste conservé ;
- aucun nouvel écran n'est introduit.
