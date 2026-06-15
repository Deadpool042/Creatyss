# Cadrage — `engagement.automations` résumé d'activité jobs sur les définitions

## Objectif

Faire remonter dans la liste des définitions `Automation` un résumé local de
l'activité de leurs jobs liés, sans obliger l'opérateur à descendre
immédiatement dans le cockpit détaillé des jobs.

## Périmètre

- enrichir la lecture admin des définitions `Automation` ;
- afficher localement un résumé des jobs liés :
  volumes utiles et dernier état connu ;
- rester borné au flux `NEWSLETTER_SUBSCRIBED` déjà ouvert.

## Hors périmètre

- vue transverse de file ;
- nouvelle page analytics d'automation ;
- filtres avancés ou pagination des jobs ;
- second déclencheur ou seconde action runtime.

## Invariants

- le résumé reste local au cockpit `automations` ;
- `jobs` reste la source technique sous-jacente ;
- aucune route admin canonique n'est modifiée ;
- aucun nouveau contrôle opératoire n'est ajouté dans ce lot.

## Risques

- confusion entre résumé local et vérité exhaustive de toute la file ;
- parsing incomplet si un job local n'embarque pas d'`automationId`.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- chaque définition affiche un résumé lisible de son activité jobs locale ;
- le dernier état connu reste visible depuis la liste des définitions ;
- aucune surface transverse supplémentaire n'est ouverte.
