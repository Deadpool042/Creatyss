# Cadrage — `engagement.automations` cartes de synthèse jobs actionnables

## Objectif

Permettre à un opérateur d'utiliser directement les cartes de synthèse de la
section jobs comme point d'entrée vers le filtre statut déjà présent.

## Périmètre

- rendre cliquables les cartes `Total`, `En attente`, `En cours`, `Échoués` ;
- réutiliser le filtre local de statut existant ;
- conserver les autres contextes locaux de la page (`automation`,
  `definition`).

## Hors périmètre

- nouvelle vue analytics ;
- nouvelle route dédiée ;
- nouveaux statuts métier ;
- refonte visuelle large.

## Invariants

- la navigation reste locale à `/admin/marketing/automations` ;
- les cartes réutilisent le filtre statut existant au lieu d'en créer un
  nouveau ;
- aucun cockpit transverse `jobs` n'est ajouté ;
- aucun worker ni contrôle runtime supplémentaire n'est introduit.

## Risques

- redondance visuelle avec les boutons de filtre statut déjà présents ;
- ambiguïté possible entre carte de synthèse et donnée exhaustive globale.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- cliquer une carte de synthèse focalise la section jobs sur le statut attendu ;
- la carte active reste lisible quand le filtre correspondant est déjà en
  place ;
- les autres contextes locaux de page restent conservés.
