# Cadrage — `engagement.automations` libellés trigger et action sur une ligne job

## Objectif

Rendre une ligne job plus lisible en exposant les libellés métier du
déclencheur et de l'action, plutôt que les seuls codes bruts ou implicites.

## Périmètre

- afficher le déclencheur avec son libellé métier ;
- afficher aussi l'action associée avec son libellé métier ;
- conserver le reste de la ligne inchangé.

## Hors périmètre

- nouvelle colonne ;
- nouvelles actions opératoires ;
- enrichissement provider ;
- refonte large de la liste jobs.

## Invariants

- aucune logique d'exécution n'est modifiée ;
- la ligne reste bornée au cockpit `automations` ;
- les codes inconnus gardent un fallback lisible.

## Risques

- densification légère de la ligne ;
- attente possible de détails métier plus complets que ce lot n'apporte pas.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- l'opérateur lit clairement le déclencheur et l'action d'un job ;
- aucun nouvel écran ni nouvelle donnée métier n'est introduit.
