<!-- docs/lots/2026-06-14-engagement-automations-latest-job-shortcut-active-state-cadrage.md -->

# Cadrage — `engagement.automations` état actif du raccourci dernier job

## Objectif

Rendre plus lisible, dans la liste des définitions d'automation, le fait que le
raccourci « dernier job » pointe déjà vers la vue jobs actuellement ouverte.

## Périmètre

- style du raccourci « dernier job » dans la liste des définitions ;
- comparaison locale entre automation sélectionnée et statut jobs actif ;
- aucun changement d'URL ni de cible de navigation.

## Hors périmètre

- nouveau filtre ;
- nouveau badge ;
- changement de wording du résumé ;
- modification des requêtes ou handlers.

## Invariants

- conserver les liens canoniques existants vers `/admin/marketing/automations` ;
- conserver la même cible de raccourci qu'avant ce lot ;
- ne pas modifier la logique de sélection des jobs visibles.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- le raccourci « dernier job » est visuellement actif lorsqu'il correspond à la
  combinaison déjà sélectionnée ;
- en dehors de ce cas, son comportement et son rendu restent inchangés ;
- aucun contrat public ni paramètre canonique n'est modifié.
