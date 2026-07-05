# Décision — Sémantique platform.webhooks : sortants (delivery)

Date : 2026-07-05.
Contexte : dépendance bloquante du lot `docs/roadmap/h4-plateforme-automatisation/lot-webhooks-sortants.md` ; divergence documentée depuis le cadrage `docs/lots/2026-06-14-platform-webhooks-cadrage.md`.

## Décision

`platform.webhooks` est le domaine des **webhooks sortants** : déclaration d'endpoints, livraison HTTP signée HMAC, retry, historique. La doctrine `docs/domains/optional/platform/webhooks.md` (qui décrivait un pipeline entrant) est réécrite en conséquence.

La réception de webhooks émis par des tiers reste hors de ce domaine : elle est portée par les routes d'intégration dédiées par fournisseur (observé : `app/api/stripe/webhook`), sous la doctrine `integrations.md` et les domaines consommateurs.

## Justification (audit architect-review 2026-07-05)

Observé :

- `prisma/optional/platform/webhooks.prisma` : `WebhookEndpoint` (targetUrl, secret, eventType, timeoutMs, maxAttempts) et `WebhookDelivery` (request/response, attemptCount, scheduledAt, idempotencyKey) décrivent exclusivement une livraison sortante.
- Code livré et fonctionnel sur ce modèle : `features/webhooks/services/deliver-webhook.service.ts` (HMAC-SHA256, `X-Webhook-Signature`), CRUD partiel admin (`create/toggle/retry` actions), gradation `read`/`manage`/`retry` du flag `platform.webhooks`.
- Aucun code entrant n'a été produit sous ce domaine depuis la doctrine initiale ; le besoin entrant réel du système est couvert par les routes d'intégration.

Conséquences :

- aucun redesign Prisma requis ;
- le lot roadmap `lot-webhooks-sortants` est débloqué, avec un périmètre restant plus petit qu'annoncé (le service HMAC et le CRUD partiel existent déjà).

## Écarts relevés au passage (hors décision, à traiter dans les lots)

- Le secret d'endpoint est stocké en clair dans un champ nommé `secretHash` (V1 documentée ; aucun service de chiffrement réversible n'existe dans le repo — le claim « pattern IntegrationCredential chiffré en place » du lot roadmap était inexact). Chiffrement à cadrer séparément.
- Le secret transite dans l'URL à la création (`redirect(...?secret=...)`) — risque logs/historique navigateur, à corriger dans un lot UI.
- Le re-queue générique du runner de jobs n'applique aucun backoff : le délai exponentiel des livraisons devra être posé via `Job.scheduledAt` au moment de l'échec.
- `order.shipped` n'a aucun point d'émission observé — V1 limitée à `order.created`.
