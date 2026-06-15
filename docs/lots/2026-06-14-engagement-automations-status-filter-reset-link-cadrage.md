# Cadrage — `engagement.automations` retrait rapide du filtre statut

## Objectif

Permettre à un opérateur de retirer explicitement le filtre `status` actif dans
la section jobs sans perdre le reste du contexte local utile.

## Périmètre

- afficher un rappel visuel du statut actif ;
- proposer un lien local pour retirer ce filtre ;
- conserver les autres contextes déjà actifs (`automation`, `definition`).

## Hors périmètre

- nouveau filtre métier ;
- nouvelle page ;
- refonte large du header jobs ;
- modification des règles d'exécution.

## Invariants

- la navigation reste locale à `/admin/marketing/automations` ;
- le retrait du filtre statut ne supprime pas les autres contextes utiles ;
- aucun cockpit transverse `jobs` n'est ajouté.

## Risques

- légère redondance avec les boutons de filtre statut déjà présents ;
- surcharge visuelle mineure si plusieurs rappels de filtres sont actifs.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- l'opérateur voit clairement qu'un statut est actif ;
- il peut retirer ce filtre dans la même zone sans réinterprétation ;
- aucun nouvel écran n'est introduit.
