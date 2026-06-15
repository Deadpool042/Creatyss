# Cadrage — `engagement.automations` retrait rapide du filtre définitions

## Objectif

Permettre à un opérateur de retirer explicitement le filtre `definition` actif
depuis la section définitions, sans perdre les autres contextes locaux utiles.

## Périmètre

- afficher un rappel visuel du filtre `definition` actif ;
- proposer un lien local pour le retirer ;
- conserver si nécessaire les contextes `automation` et `status`.

## Hors périmètre

- nouveaux filtres ;
- nouvelle vue dédiée ;
- refonte large du cockpit ;
- modification des règles runtime.

## Invariants

- la navigation reste locale à `/admin/marketing/automations` ;
- le retrait du filtre définitions ne casse pas les autres contextes locaux ;
- aucun cockpit transverse n'est ajouté.

## Risques

- légère redondance avec les boutons de filtre déjà présents ;
- surcharge visuelle mineure si plusieurs rappels de filtres sont actifs.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- l'opérateur voit clairement quel filtre définitions est actif ;
- il peut le retirer depuis la même zone sans réinterprétation ;
- aucun nouvel écran n'est introduit.
