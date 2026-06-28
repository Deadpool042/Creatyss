# Lot — Automations : worker général

## Statut

En cours

## Observé comme implémenté

- Route `POST /api/cron/run-automation-jobs` — protégée par `CRON_SECRET` (Bearer token)
- Service `runAutomationJobsBatch(batchSize)` — recovery RUNNING bloqués → FAILED, auto-retry FAILED retryables, exécution des PENDING échus
- Architecture décidée : route Next.js appelée par un cron externe (cron VPS ou scheduler), pas de processus long

## Restant

- Extension de `SUPPORTED_JOB_TYPE_CODES` à `ORDER_PLACED` et autres types (scope actuel : `NEWSLETTER_SUBSCRIBED` uniquement)
- Activation production : `CRON_SECRET` dans `.env` + cron externe configuré sur le VPS
- Monitoring : état du worker visible dans l'observabilité admin existante

## Objectif

Étendre le worker à tous les types de jobs et l'activer en production via un cron VPS appelant la route existante.

## Périmètre

Implémentation partielle observée — reste à faire :

- `prisma/cross-cutting/jobs.prisma` — modèle `Job` existant (observé) comme source des jobs à traiter
- Worker/scheduler : processus ou route de traitement périodique qui consomme les jobs `PENDING` dont `scheduledAt` est échu
- Nouveaux types de déclencheurs à ajouter : `order_created`, `order_shipped` (en plus de `NEWSLETTER_SUBSCRIBED` existant)
- Nouveaux types d'action à ajouter selon les besoins validés (ex. `SMS_MESSAGE`, `PUSH_NOTIFICATION`)
- Gestion des erreurs : retry automatique sur échec, politique de `maxAttempts`
- Monitoring du worker : état visible dans `/admin/maintenance/logs` ou `/admin/maintenance/observability`

## Hors périmètre

- Orchestration distribuée (queues Redis, BullMQ, Temporal)
- Workflows multi-étapes avec conditions (`WorkflowDefinition`)
- Retry policies complexes avec backoff exponentiel (peut suivre si besoin validé)
- Worker multi-instances (contexte boutique artisanale single-instance)

## Dépendances

- H2 suffisamment stabilisé côté commandes pour les déclencheurs `order_created` et `order_shipped`
- `engagement.automations` L3 borné existant comme base (ne pas réécrire le CRUD admin des définitions)
- Décision d'architecture sur le mode d'exécution du worker : cron Next.js (`route.ts` appelée par un cron VPS), Edge Function, ou processus séparé — à trancher en `architect-review`

## Invariants

- Le worker ne doit pas exécuter un job déjà en statut `RUNNING`, `SUCCEEDED` ou `CANCELLED` — vérification atomique obligatoire (SELECT FOR UPDATE ou équivalent)
- La transition `PENDING → RUNNING → SUCCEEDED/FAILED` doit être atomique pour éviter le double traitement
- Le worker ne doit pas bloquer la réponse HTTP s'il est implémenté comme route Next.js
- Les automations `INACTIVE` ne doivent pas générer de nouveaux jobs

## Risques

- Worker = processus potentiellement long sur un VPS single-instance : un crash du worker doit laisser les jobs dans un état récupérable (pas de `RUNNING` bloqués)
- Double exécution : si le cron se chevauche avec une exécution précédente non terminée, un job peut être exécuté deux fois — verrou nécessaire
- Monitoring : un worker silencieux en échec est indétectable sans alertes — prévoir au minimum un compteur visible dans l'observabilité existante

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` — tests unitaires sur la logique de sélection et de transition des jobs
- Test d'intégration : souscription newsletter → job PENDING créé → worker tourne → job SUCCEEDED

## Critères de fin

- Les jobs `PENDING` échus sont exécutés automatiquement sans intervention manuelle
- Le déclencheur `order_created` est fonctionnel (job créé à la création d'une commande)
- Un job échoué passe en `FAILED` avec un message d'erreur lisible, sans bloquer les autres jobs
- L'état du worker est visible dans l'observabilité admin existante
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour la décision d'architecture du mode d'exécution et la politique de retry, puis `next-feature-builder` pour l'implémentation.
