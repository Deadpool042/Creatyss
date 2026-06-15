<!-- docs/lots/2026-06-14-engagement-automations-jobs-visibility-cadrage.md -->

# Cadrage — `engagement.automations` visibilité admin des jobs planifiés

## Objectif

Rendre lisible depuis `/admin/marketing/automations` le premier runtime borné
déjà atteint : les `Job` planifiés sur `NEWSLETTER_SUBSCRIBED`.

## Périmètre

- lister les jobs d'automation du store courant ;
- exposer compteurs simples (`pending`, `running`, `failed`, `succeeded`) ;
- relier chaque job à son `automationCode` via le `payloadJson` existant ;
- garder la lecture bornée à `AUTOMATION_NEWSLETTER_SUBSCRIBED`.

## Hors périmètre

- admin générique de tous les jobs ;
- filtres, pagination, reprise, annulation ;
- lecture détaillée du `payloadJson` brut ;
- exécution worker.

## Invariants

- la page `marketing/automations` reste la vue métier locale ;
- `maintenance/logs` reste la vue transverse globale de la file de jobs ;
- aucune mutation de job n'est ajoutée ;
- aucun nouveau modèle Prisma n'est introduit.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- un opérateur voit si les souscriptions newsletter planifient bien des jobs ;
- la frontière avec l'exécution reste explicite ;
- aucune dérive vers un cockpit de worker n'est introduite.
