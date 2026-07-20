"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { resolveStoreExecutionPolicy } from "@/core/runtime/resolve-store-execution-policy";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { deliverWebhook } from "@/features/webhooks/services/deliver-webhook.service";
import { simulateWebhookDelivery } from "@/features/webhooks/services/simulate-webhook-delivery.service";

const DEFAULT_TIMEOUT_MS = 10_000;
const RETRYABLE_STATUS_VALUES = ["FAILED", "EXPIRED", "CANCELLED"] as const;
const RETRYABLE_STATUSES = new Set<string>(RETRYABLE_STATUS_VALUES);

export type RetryWebhookDeliveryResult = { ok: true } | { ok: false; error: string };

export async function retryWebhookDeliveryAction(
  deliveryId: string
): Promise<RetryWebhookDeliveryResult> {
  await requireAuthenticatedAdmin();

  if (!(await meetsFeatureLevel("platform.webhooks", "retry"))) {
    return { ok: false, error: "Niveau webhooks insuffisant pour relancer une delivery." };
  }

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

  // Garde préalable — message clair uniquement ; la sécurité de concurrence
  // repose exclusivement sur l'updateMany atomique ci-dessous.
  if (!RETRYABLE_STATUSES.has(delivery.status)) {
    return {
      ok: false,
      error: `Cette delivery (statut ${delivery.status}) ne peut pas être relancée.`,
    };
  }

  // Réservation atomique — même pattern que le claim de Job dans
  // execute-webhook-delivery-job.service.ts. La delivery existante est
  // réutilisée (pas de nouvelle ligne) : status FAILED/EXPIRED/CANCELLED →
  // RUNNING, attemptCount incrémenté, détails de la tentative précédente
  // nettoyés. count !== 1 signifie qu'un autre appel a déjà pris le verrou.
  const startedAt = new Date();
  const reserved = await db.webhookDelivery.updateMany({
    where: {
      id: deliveryId,
      status: { in: [...RETRYABLE_STATUS_VALUES] },
    },
    data: {
      status: "RUNNING",
      startedAt,
      finishedAt: null,
      attemptCount: { increment: 1 },
      responseStatusCode: null,
      responseBodyText: null,
      errorCode: null,
      errorMessage: null,
    },
  });

  if (reserved.count !== 1) {
    return { ok: false, error: "Cette delivery est déjà en cours de relance." };
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

  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: { isProduction: true },
  });
  const policy = resolveStoreExecutionPolicy({ isProduction: store?.isProduction ?? false });
  const deliver = policy.mode === "LIVE" ? deliverWebhook : simulateWebhookDelivery;

  let outcome: Awaited<ReturnType<typeof deliverWebhook>>;
  try {
    outcome = await deliver({
      endpointId: endpoint.id,
      targetUrl: endpoint.targetUrl,
      secret: endpoint.secretHash,
      timeoutMs: endpoint.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      eventType: delivery.eventType,
      body,
    });
  } catch (error) {
    // Issue ambiguë : deliverWebhook ne lève normalement jamais (il capture
    // ses propres erreurs réseau/timeout). Une exception ici est un
    // événement inattendu — on ne laisse jamais la delivery bloquée en
    // RUNNING.
    await db.webhookDelivery.update({
      where: { id: deliveryId },
      data: {
        status: "FAILED",
        finishedAt: new Date(),
        errorCode: "retry_execution_failed",
        errorMessage:
          error instanceof Error
            ? error.message.slice(0, 500)
            : "Erreur inattendue lors de la relance.",
      },
    });

    return { ok: false, error: "La relance du webhook a échoué." };
  }

  const finishedAt = new Date();

  // Finalisation de la même delivery — aligné sur
  // execute-webhook-delivery-job.service.ts. Aucune nouvelle ligne créée.
  await db.webhookDelivery.update({
    where: { id: deliveryId },
    data: {
      status: outcome.ok ? "SUCCEEDED" : "FAILED",
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
      lastTriggeredAt: finishedAt,
      ...(outcome.ok ? { lastSucceededAt: finishedAt } : { lastFailedAt: finishedAt }),
    },
  });

  revalidatePath("/admin/settings/webhooks");

  return { ok: true };
}
