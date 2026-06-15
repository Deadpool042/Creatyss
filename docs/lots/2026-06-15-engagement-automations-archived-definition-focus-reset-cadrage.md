<!-- docs/lots/2026-06-15-engagement-automations-archived-definition-focus-reset-cadrage.md -->

# Cadrage — `engagement.automations` retrait local du focus définition archivée

## Objectif

Permettre, depuis la section `Automations archivées` de
`/admin/marketing/automations`, de retirer directement le focus local sur une
définition archivée ciblée.

## Périmètre

- ajout d'un retrait explicite du focus définition dans la section
  `Automations archivées` ;
- conservation des autres filtres d'archives encore actifs ;
- maintien du retour local sur la même sous-section.

## Hors périmètre

- retrait global de tous les filtres d'archives ;
- refonte de la navigation croisée existante ;
- nouvelle route dédiée ;
- modification des restaurations.

## Invariants

- la route canonique reste `/admin/marketing/automations` ;
- le retrait reste local à la même sous-section ;
- les éventuels filtres de statut archivé ou de type d'archives restent
  conservés ;
- aucun nouveau contrat public n'est introduit.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- quand un focus définition archivée est actif, la section
  `Automations archivées` permet de le retirer directement ;
- ce retrait conserve les autres filtres d'archives encore utiles ;
- l'opérateur n'a plus besoin de passer par `Jobs archivés` pour supprimer ce
  focus précis.
