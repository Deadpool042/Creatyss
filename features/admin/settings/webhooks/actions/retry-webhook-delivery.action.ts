"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { deliverWebhook } from "@/features/webhooks/services/deliver-webhook.service";

const DEFAULT_TIMEOUT_MS = 10_000;
const RETRYABLE_STATUSES = new Set(["FAILED", "EXPIRED", "CANCELLED"]);

export type RetryWebhookDeliveryResult = { ok: true } | { ok: false; error: string };

export async function retryWebhookDeliveryAction(
  deliveryId: string
): Promise<RetryWebhookDeliveryResult> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();
  if (!storeId) {
    return { ok: false, error: "Boutique introuvable." };
  }

  const delivery = await db.webhookDelivery.findUnique({
    where: { id: deliveryId },
    select: {
      id: true,
      status: true,
      eventType: true,
      requestBodyJson: true,
      webhookEndpoint: {
        select: {
          id: true,
          storeId: true,
          targetUrl: true,
          secretHash: true,
          timeoutMs: true,
          archivedAt: true,
        },
      },
    },
  });

  if (!delivery) {
    return { ok: false, error: "Delivery introuvable." };
  }

  // Vérifier que la delivery appartient au store courant (global ou store-spécifique)
  const endpoint = delivery.webhookEndpoint;
  if (endpoint.storeId !== null && endpoint.storeId !== storeId) {
    return { ok: false, error: "Accès non autorisé." };
  }

  if (endpoint.archivedAt !== null) {
    return { ok: false, error: "L'endpoint associé est archivé." };
  }

  if (!RETRYABLE_STATUSES.has(delivery.status)) {
    return {
      ok: false,
      error: `Cette delivery (statut ${delivery.status}) ne peut pas être relancée.`,
    };
  }

  // Désérialiser le body original — fallback à {} si absent ou malformé
  let body: Record<string, unknown> = {};
  if (delivery.requestBodyJson) {
    try {
      const parsed = JSON.parse(delivery.requestBodyJson) as unknown;
      if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
        body = parsed as Record<string, unknown>;
      }
    } catch {
      // body reste {}
    }
  }

  const now = new Date();

  const outcome = await deliverWebhook({
    endpointId: endpoint.id,
    targetUrl: endpoint.targetUrl,
    secret: endpoint.secretHash,
    timeoutMs: endpoint.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    eventType: delivery.eventType,
    body,
  });

  const finishedAt = new Date();

  // Créer une nouvelle delivery — ne pas modifier la delivery originale
  await db.webhookDelivery.create({
    data: {
      webhookEndpointId: endpoint.id,
      eventType: delivery.eventType,
      requestUrl: endpoint.targetUrl,
      requestMethod: "POST",
      requestBodyJson: JSON.stringify(body),
      status: outcome.ok ? "SUCCEEDED" : "FAILED",
      attemptCount: 1,
      startedAt: now,
      finishedAt,
      responseStatusCode: outcome.statusCode,
      responseBodyText: outcome.responseBody,
      errorCode: outcome.errorCode,
      errorMessage: outcome.errorMessage,
    },
  });

  // Mettre à jour les timestamps de l'endpoint
  await db.webhookEndpoint.update({
    where: { id: endpoint.id },
    data: {
      lastTriggeredAt: now,
      ...(outcome.ok ? { lastSucceededAt: finishedAt } : { lastFailedAt: finishedAt }),
    },
  });

  revalidatePath("/admin/settings/webhooks");

  return { ok: true };
}
