# Cadrage — `engagement.automations` libellé explicite de la date job

## Objectif

Rendre la colonne date d'une ligne job plus lisible en explicitant si la date
affichée correspond à une planification, un démarrage, une fin ou une création.

## Périmètre

- conserver une seule colonne date ;
- ajouter un libellé court cohérent avec le timestamp réellement affiché ;
- rester strictement dans la liste jobs locale.

## Hors périmètre

- timeline détaillée ;
- historique complet d'exécution ;
- nouvelle colonne supplémentaire ;
- nouvel état métier.

## Invariants

- aucune logique runtime des jobs ne change ;
- le timestamp affiché continue de suivre l'ordre : `finishedAt`, `startedAt`,
  `scheduledAt`, `createdAt` ;
- la vue reste bornée au cockpit `automations`.

## Risques

- légère densification visuelle de la colonne date ;
- attente possible d'une timeline complète alors que seul le repère principal
  est ajouté.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- l'opérateur comprend immédiatement la nature de la date affichée ;
- aucun nouvel écran ni nouvelle donnée métier n'est introduit.
