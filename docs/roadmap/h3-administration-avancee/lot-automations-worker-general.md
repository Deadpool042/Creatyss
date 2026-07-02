# Lot — Automations : worker général

## Statut

Livré côté code — Lots A/B/C livrés 2026-07-01, activation production et retry `ORDER_PLACED` conditionnels. Cadrage : `docs/lots/2026-07-01-automations-worker-general-cadrage.md`

## Observé comme implémenté

- Route `POST /api/cron/run-automation-jobs` — protégée par `CRON_SECRET` (Bearer token)
- Service `runAutomationJobsBatch(batchSize)` — recovery RUNNING bloqués → FAILED, auto-retry FAILED retryables, exécution des PENDING échus
- Architecture décidée : route Next.js appelée par un cron externe (cron VPS ou scheduler), pas de processus long
- `SUPPORTED_JOB_TYPE_CODES` étendu via `AUTOMATION_JOB_TYPE_CODES` (`NEWSLETTER_SUBSCRIBED` + `ORDER_PLACED`) — batch, exécution (`execute-automation-job.service.ts` dispatch par `subjectType`/`subjectId`), 5 services admin (`restore/reschedule/archive/cancel/retry`) et l'écran `marketing/automations` (queries/actions liste + compteurs) traitent désormais les deux types
- Template email `order-placed-confirmation` ajouté (`features/email/automation/automation-email-templates.ts`), déclenché après le `delayMinutes` configuré sur l'automation — distinct de l'email de confirmation transactionnel instantané (`sendOrderTransactionalEmail`, événement `order_created`)
- Monitoring : `/admin/maintenance/logs` et `/admin/maintenance/observability` étaient déjà agnostiques au `typeCode` — aucune modification requise, les jobs `ORDER_PLACED` y apparaissent automatiquement

## Restant hors code applicatif

- Activation production : `CRON_SECRET` dans `.env` + cron externe configuré sur le VPS
- Lot D conditionnel : `maxAttempts` fixé à `1` pour les deux types de jobs → aucun retry automatique n'a lieu aujourd'hui. Passer `ORDER_PLACED` à `maxAttempts > 1` nécessite une validation produit et une vérification préalable de l'idempotence de l'envoi email en cas de retry

## Objectif

Étendre le worker aux types de jobs automations observés et préparer son activation production via un cron VPS appelant la route existante.

## Périmètre

Implémentation observée :

- `prisma/cross-cutting/jobs.prisma` — modèle `Job` existant (observé) comme source des jobs à traiter
- Route `POST /api/cron/run-automation-jobs` protégée par `CRON_SECRET`
- Batch `runAutomationJobsBatch` qui consomme les jobs `PENDING` échus et récupère les jobs `RUNNING` bloqués
- Déclencheurs automations observés : `NEWSLETTER_SUBSCRIBED` et `ORDER_PLACED`
- Action observée : `EMAIL_MESSAGE`
- Retry automatique techniquement présent dans le batch si `attemptCount < maxAttempts`, mais inactif en pratique car les jobs sont créés avec `maxAttempts: 1`
- Monitoring admin existant via `/admin/maintenance/logs` et `/admin/maintenance/observability`

## Hors périmètre

- Orchestration distribuée (queues Redis, BullMQ, Temporal)
- Workflows multi-étapes avec conditions (`WorkflowDefinition`)
- Retry policies complexes ou hausse de `maxAttempts` sans validation produit préalable
- Worker multi-instances (contexte boutique artisanale single-instance)

## Dépendances

- H2 suffisamment stabilisé côté commandes pour les déclencheurs `ORDER_PLACED`
- `engagement.automations` L3 borné existant comme base (ne pas réécrire le CRUD admin des définitions)
- Décision d'architecture observée : cron externe VPS appelant la route Next.js `POST /api/cron/run-automation-jobs`

## Invariants

- Le worker ne doit pas exécuter un job déjà en statut `RUNNING`, `SUCCEEDED` ou `CANCELLED` — vérification atomique obligatoire (SELECT FOR UPDATE ou équivalent)
- La transition `PENDING → RUNNING → SUCCEEDED/FAILED` doit être atomique pour éviter le double traitement
- Le worker reste appelé par route HTTP bornée ; le batch doit rester court et observable
- Les automations `INACTIVE` ne doivent pas générer de nouveaux jobs

## Risques

- Worker appelé par cron sur un VPS single-instance : un crash doit laisser les jobs dans un état récupérable (pas de `RUNNING` bloqués)
- Double exécution : si le cron se chevauche avec une exécution précédente non terminée, un job peut être exécuté deux fois — verrou nécessaire
- Monitoring : un worker silencieux en échec est indétectable sans alertes — prévoir au minimum un compteur visible dans l'observabilité existante

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests ciblés automations si le batch ou les services de queue changent
- Recette intégration : souscription newsletter ou commande → job `PENDING` créé → cron route appelée → job `SUCCEEDED`

## Critères de fin

- Les jobs `PENDING` échus sont exécutables automatiquement via la route cron
- Le déclencheur `ORDER_PLACED` est fonctionnel (job créé à la création d'une commande)
- Un job échoué passe en `FAILED` avec un message d'erreur lisible, sans bloquer les autres jobs
- L'état du worker est visible dans l'observabilité admin existante
- L'activation production est documentée comme opération VPS distincte

## Agent recommandé

`architect-review` uniquement si la politique de retry `ORDER_PLACED` est validée ou si le mode cron VPS doit être remplacé.
