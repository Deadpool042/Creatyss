# Cadrage — `engagement.automations` état vide contextuel des jobs

## Objectif

Rendre l'état vide de la section jobs plus opératoire quand les filtres locaux
ne renvoient aucun résultat visible.

## Périmètre

- adapter le message vide selon le filtre statut et/ou automation actif ;
- proposer un raccourci local pour retirer les filtres jobs ;
- rester strictement dans `/admin/marketing/automations`.

## Hors périmètre

- nouvelle page dédiée ;
- recherche libre ;
- filtres supplémentaires ;
- refonte large de la section jobs.

## Invariants

- la logique métier des jobs ne change pas ;
- l'état vide reste local au cockpit `automations` ;
- la remise à zéro des filtres jobs conserve le contexte `definition` ;
- aucun cockpit transverse `jobs` n'est ajouté.

## Risques

- confusion possible entre absence de résultat filtré et absence absolue de jobs ;
- surcharge légère de l'état vide si trop d'actions y sont ajoutées.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- l'opérateur comprend immédiatement pourquoi la liste est vide ;
- il peut revenir à une vue plus large sans quitter la page ;
- aucun nouveau comportement runtime des jobs n'est introduit.
