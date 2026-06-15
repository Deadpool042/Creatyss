# Cadrage — `engagement.automations` lien statut depuis une ligne job

## Objectif

Permettre à un opérateur de refocaliser la vue jobs sur le statut d'une ligne
directement depuis son badge, sans quitter le cockpit local.

## Périmètre

- rendre le badge statut d'une ligne job cliquable ;
- réutiliser le filtre `status` déjà existant ;
- conserver le contexte `automation` si actif, sinon reprendre celui de la
  ligne ;
- conserver aussi le contexte `definition`.

## Hors périmètre

- nouveau filtre métier ;
- nouvelle page détail ;
- refonte visuelle large ;
- nouvelle action runtime.

## Invariants

- la navigation reste locale à `/admin/marketing/automations` ;
- le badge réutilise le filtre `status` existant au lieu d'en créer un autre ;
- aucun cockpit transverse `jobs` n'est ajouté ;
- la logique d'exécution des jobs reste inchangée.

## Risques

- légère redondance avec les cartes de synthèse et boutons de filtre statut ;
- ambiguïté possible si la ligne est lue comme simple indicateur et non comme
  raccourci.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- cliquer le badge statut d'une ligne focalise la vue sur ce statut ;
- le contexte local utile reste préservé ;
- aucun nouvel écran n'est introduit.
