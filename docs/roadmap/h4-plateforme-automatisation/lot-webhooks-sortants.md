# Lot — Webhooks sortants

## Statut

Terminé — 2026-07-05, branche `feature/platform-webhooks-delivery`. Sémantique tranchée (sortants, cf. `docs/lots/2026-07-05-platform-webhooks-semantique.md`), doctrine réécrite. Livré : enqueue transactionnel `order.created` via jobs (`queue-webhook-delivery-jobs.service.ts`, dédup par idempotencyKey), worker cron batch (`/api/cron/run-webhook-delivery-jobs` : claim atomique, recovery RUNNING > 15 min, auto-retry sous `maxAttempts`), livraison HMAC (`deliver-webhook.service.ts`), gestion admin des endpoints (création, toggle, relance manuelle) et tests unitaires des quatre services (42 tests).

## Objectif

Implémenter la livraison webhook sortante avec signature HMAC et retry automatique. Le modèle `WebhookEndpoint`/`WebhookDelivery` était déjà observé en Prisma et la page admin de lecture existait ; le lot est désormais livré avec sémantique tranchée en sortants.

## Périmètre

Livré et observé :

- `prisma/optional/platform/webhooks.prisma` — modèles `WebhookEndpoint` et `WebhookDelivery` déjà posés (observés)
- `features/admin/settings/webhooks/` — extension de la page lecture existante :
  - Création et gestion des endpoints (URL cible, événements souscrits, secret HMAC)
  - Historique des livraisons par endpoint avec statut et payload
  - Relance manuelle d'une livraison échouée
- Service de livraison : envoi HTTP POST avec signature HMAC sur l'en-tête `X-Webhook-Signature`
- Retry automatique sur échec (politique à définir : 3 tentatives avec délai exponentiel)
- Intégration avec le système de jobs (`prisma/cross-cutting/jobs.prisma`) pour la livraison asynchrone

## Hors périmètre

- Webhooks entrants (réception et traitement d'événements depuis des tiers — ex. Stripe, différent des webhooks sortants)
- Marketplace webhooks
- Transformation de payload (filtrage de champs, versioning de format)

## Dépendances

- Clarification sémantique tranchée : `docs/lots/2026-07-05-platform-webhooks-semantique.md`
- H1/H2 : catalogue et commandes stables pour définir les événements à émettre (ex. `order.created`, `order.shipped`)
- Système de jobs existant pour la livraison asynchrone

## Invariants

- La signature HMAC doit être calculée côté serveur avec le secret de l'endpoint — jamais exposée en clair dans l'UI
- Un `WebhookDelivery` doit toujours être créé, même en cas d'échec, pour permettre l'audit
- La livraison ne doit pas bloquer le flux applicatif qui émet l'événement (asynchrone obligatoire)

## Risques

- Sécurité : le secret HMAC est stocké en clair en V1 (aucun service de chiffrement réversible n'existe dans le repo — le pattern `IntegrationCredential` observé est un hash one-way, inutilisable pour un secret à récupérer) ; chiffrement AES à cadrer dans un lot séparé
- Retry sur endpoint mort : sans circuit-breaker, un endpoint en erreur permanente génère un volume de tentatives inutiles

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` — tests unitaires sur la génération de la signature HMAC
- Test manuel : création d'un endpoint, déclenchement d'un événement, vérification de la livraison dans l'historique admin et sur le serveur cible (ex. webhook.site)

## Critères de fin

- Un endpoint peut être créé avec une URL cible, des événements souscrits et un secret HMAC
- Un événement déclenche une livraison asynchrone avec signature HMAC vérifiable
- L'historique des livraisons est visible dans l'admin avec statut et payload
- Les livraisons échouées sont retentées automatiquement selon la politique définie
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la sémantique entrants/sortants et concevoir la politique de retry, puis `next-feature-builder` pour l'implémentation.
