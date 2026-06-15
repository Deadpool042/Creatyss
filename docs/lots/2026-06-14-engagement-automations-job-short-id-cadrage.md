<!-- docs/lots/2026-06-14-engagement-automations-job-short-id-cadrage.md -->

# Cadrage — `engagement.automations` référence courte par job

## Objectif

Permettre à l'opérateur d'identifier rapidement un job précis depuis la page
`/admin/marketing/automations` sans devoir ouvrir une vue transverse ou copier
l'identifiant complet.

## Périmètre

- affichage d'une référence courte locale sur chaque ligne job ;
- dérivation depuis `job.id` déjà chargé ;
- aucune mutation, aucun nouveau filtre, aucun nouveau lien.

## Hors périmètre

- recherche par identifiant ;
- copy button ;
- exposition de l'identifiant complet ;
- changement de requête Prisma ;
- synchronisation avec `maintenance/logs`.

## Invariants

- ne pas modifier les routes ni les paramètres d'URL existants ;
- ne pas changer l'ordre ou la pagination locale des jobs ;
- rester purement dans la lecture opératoire du cockpit.

## Risques

- surcharger visuellement la ligne si le badge est trop dominant ;
- laisser croire qu'il s'agit d'un identifiant métier stable alors que c'est une
  référence courte locale dérivée de l'identifiant technique.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- vérification manuelle de lisibilité sur `/admin/marketing/automations`

## Critères de fin

- chaque ligne job expose une référence courte discrète ;
- cette référence reste clairement secondaire à `automationCode` et au statut ;
- aucun contrat public ni comportement métier n'est modifié.
