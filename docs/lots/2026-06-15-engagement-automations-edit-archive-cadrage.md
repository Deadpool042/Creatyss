<!-- docs/lots/2026-06-15-engagement-automations-edit-archive-cadrage.md -->

# Cadrage — `engagement.automations` édition et suppression locale des définitions

## Objectif

Permettre à un opérateur de corriger ou retirer une définition
`Automation` déjà créée depuis `/admin/marketing/automations`, sans ouvrir de
nouvel écran ni casser la lecture locale des jobs liés.

## Périmètre

- édition inline d'une définition existante ;
- archivage depuis la liste active ;
- annulation des jobs `PENDING` liés lors de l'archivage ;
- conservation des liens canoniques existants de la page.

## Hors périmètre

- édition d'un job planifié ;
- restauration d'une automation archivée ;
- écran détail dédié ;
- suppression physique des traces historiques.

## Invariants

- la page reste le cockpit canonique `/admin/marketing/automations` ;
- l'archivage ne doit pas orpheliner les jobs encore en attente ;
- les jobs passés restent lisibles localement si déjà présents ;
- aucun worker, aucune orchestration transverse, aucun nouveau contrat public.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- une définition existante peut être modifiée depuis sa ligne ;
- une définition test peut être retirée de la liste active ;
- les jobs `PENDING` liés sont annulés lors de cette suppression locale ;
- la navigation canonique et les filtres existants restent compatibles.
