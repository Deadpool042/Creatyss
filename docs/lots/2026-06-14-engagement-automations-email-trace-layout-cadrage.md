<!-- docs/lots/2026-06-14-engagement-automations-email-trace-layout-cadrage.md -->

# Cadrage — `engagement.automations` lisibilité locale de la trace email

## Objectif

Rendre la trace `EmailMessage` déjà visible dans `/admin/marketing/automations`
plus lisible pour l'opérateur, sans changer les données exposées ni ouvrir de
cockpit transverse.

## Périmètre

- rendu local de la trace email dans chaque ligne job ;
- structuration visuelle de l'identifiant de trace, du statut, du destinataire,
  du provider, de la référence provider et de l'erreur éventuelle ;
- réutilisation exclusive des champs déjà chargés par la query existante.

## Hors périmètre

- nouvelle query Prisma ;
- nouvelle page email dédiée ;
- mutation `EmailMessage` ;
- copie presse-papiers ;
- recherche ou filtre par statut email.

## Invariants

- conserver le même périmètre métier de lecture locale ;
- ne pas modifier la logique d'exécution ni de retry ;
- ne pas changer les routes, ancres ou paramètres d'URL ;
- ne pas exposer plus de données que celles déjà lues dans la page.

## Risques

- surcharger la ligne job si le bloc devient trop dominant ;
- créer une hiérarchie visuelle confuse avec le statut principal du job.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- vérification manuelle de `/admin/marketing/automations` avec jobs
  `SUCCEEDED` et `FAILED` disposant d'une trace email

## Critères de fin

- la trace email locale reste sur la même page ;
- son rendu devient plus structuré et plus rapide à lire ;
- aucune donnée, action ou navigation métier n'est modifiée.
