import "server-only";
import { createHash } from "node:crypto";

import type { WebhookDeliveryOutcome, WebhookDeliveryPayload } from "./deliver-webhook.service";

/**
 * Livraison webhook neutralisée : ne produit aucun trafic HTTP. Utilisée à
 * la place de deliverWebhook quand la politique d'exécution résout hors
 * LIVE (cf. core/runtime/resolve-store-execution-policy). Même contrat que
 * deliverWebhook : ne lève jamais d'exception, même type de retour,
 * déterministe (aucun aléatoire, aucune horloge dans le calcul).
 *
 * Aucune colonne dédiée n'existe pour marquer une delivery simulée (décision
 * du lot : pas de migration Prisma) — le résultat doit donc rester lisible
 * uniquement à travers les champs existants de WebhookDeliveryOutcome.
 */
export function simulateWebhookDelivery(
  payload: WebhookDeliveryPayload
): Promise<WebhookDeliveryOutcome> {
  const fingerprint = createHash("sha256")
    .update(`${payload.endpointId}|${payload.eventType}|${JSON.stringify(payload.body)}`)
    .digest("hex")
    .slice(0, 16);

  return Promise.resolve({
    ok: true,
    statusCode: null,
    responseBody: `Livraison simulée (mode TEST) — aucune requête HTTP envoyée. fingerprint=${fingerprint}`,
    errorCode: null,
    errorMessage: null,
  });
}
