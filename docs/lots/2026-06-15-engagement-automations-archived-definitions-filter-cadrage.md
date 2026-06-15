<!-- docs/lots/2026-06-15-engagement-automations-archived-definitions-filter-cadrage.md -->

# Cadrage — `engagement.automations` filtre local des définitions archivées

## Objectif

Permettre, dans la section locale des automations archivées de
`/admin/marketing/automations`, de cibler soit les définitions dont le code a
été libéré pour recréation, soit celles qui restent restaurables directement.

## Périmètre

- filtre local des définitions archivées ;
- distinction entre `Code libéré` et `Restauration directe` ;
- comptage visible du sous-ensemble filtré ;
- état vide contextuel ;
- conservation du focus sur la section d'archives concernée ;
- retrait explicite du filtre dans la même section.

## Hors périmètre

- nouvelle route dédiée aux archives définitions ;
- filtre transverse global ;
- changement de la sémantique de restauration des définitions archivées ;
- refonte de la section jobs.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- le filtre reste local à la section des définitions archivées ;
- la restauration simple et batch continue de porter seulement sur les
  automations archivées actuellement visibles ;
- aucun cockpit transverse n'est introduit.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- un opérateur peut filtrer les automations archivées selon le mode de
  réutilisation du code ;
- la section explicite le volume visible vs total ;
- la section explicite aussi quand le vide vient du filtre actif ;
- un lien permet de retirer ce filtre sans perdre les autres contextes de page.
