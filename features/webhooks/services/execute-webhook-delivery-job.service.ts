import "server-only";

import { db } from "@/core/db";
import { resolveStoreExecutionPolicy } from "@/core/runtime/resolve-store-execution-policy";
import { deliverWebhook } from "./deliver-webhook.service";
import { simulateWebhookDelivery } from "./simulate-webhook-delivery.service";
import { WEBHOOK_DELIVERY_JOB_TYPE } from "@/features/webhooks/shared/webhook-job.constants";

const DEFAULT_TIMEOUT_MS = 10_000;

type ExecuteWebhookDeliveryJobInput = {
  jobId: string;
  storeId: string;
};

export class ExecuteWebhookDeliveryJobError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ExecuteWebhookDeliveryJobError";
    this.code = code;
  }
}

function formatDeliveryError(error: unknown): string {
  if (error instanceof Error) {
    return error.message.slice(0, 500);
  }

  return "Erreur inattendue d'exécution.";
}

export async function executeWebhookDeliveryJob(
  input: ExecuteWebhookDeliveryJobInput
): Promise<void> {
  const job = await db.job.findFirst({
    where: {
      id: input.jobId,
      storeId: input.storeId,
      typeCode: WEBHOOK_DELIVERY_JOB_TYPE,
      archivedAt: null,
    },
    select: {
      id: true,
      status: true,
      scheduledAt: true,
      subjectId: true,
    },
  });

  if (!job) {
    throw new ExecuteWebhookDeliveryJobError("job_not_found", "Job introuvable.");
  }

  if (job.status !== "PENDING") {
    throw new ExecuteWebhookDeliveryJobError(
      "job_not_pending",
      "Seuls les jobs en attente peuvent être exécutés."
    );
  }

  if (job.scheduledAt && job.scheduledAt.getTime() > Date.now()) {
    throw new ExecuteWebhookDeliveryJobError("job_not_due", "Ce job n'est pas encore exécutable.");
  }

  if (!job.subjectId) {
    throw new ExecuteWebhookDeliveryJobError(
      "missing_subject_id",
      "Livraison webhook absente du job."
    );
  }

  const claimed = await db.job.updateMany({
    where: {
      id: input.jobId,
      storeId: input.storeId,
      status: "PENDING",
      archivedAt: null,
    },
    data: {
      status: "RUNNING",
      startedAt: new Date(),
      errorCode: null,
      errorMessage: null,
      attemptCount: { increment: 1 },
    },
  });

  if (claimed.count !== 1) {
    throw new ExecuteWebhookDeliveryJobError(
      "job_already_claimed",
      "Le job n'est plus disponible pour exécution."
    );
  }

  try {
    const delivery = await db.webhookDelivery.findFirst({
      where: {
        id: job.subjectId,
        status: { in: ["PENDING", "FAILED"] },
      },
      select: {
        id: true,
        eventType: true,
        requestUrl: true,
        requestBodyJson: true,
        webhookEndpoint: {
          select: {
            id: true,
            secretHash: true,
            timeoutMs: true,
            isEnabled: true,
            status: true,
            archivedAt: true,
          },
        },
      },
    });

    if (!delivery) {
      throw new ExecuteWebhookDeliveryJobError(
        "delivery_not_found",
        "Livraison webhook introuvable ou déjà traitée."
      );
    }

    const endpoint = delivery.webhookEndpoint;

    if (endpoint.status !== "ACTIVE" || !endpoint.isEnabled || endpoint.archivedAt !== null) {
      await db.webhookDelivery.update({
        where: { id: delivery.id },
        data: {
          status: "CANCELLED",
          finishedAt: new Date(),
          errorCode: "endpoint_inactive",
          errorMessage: "Endpoint désactivé ou archivé — livraison annulée.",
        },
      });

      await db.job.update({
        where: { id: input.jobId },
        data: {
          status: "CANCELLED",
          finishedAt: new Date(),
          errorCode: "endpoint_inactive",
          errorMessage: "Endpoint désactivé ou archivé — livraison annulée.",
        },
      });

      return;
    }

    let body: Record<string, unknown>;

    try {
      body = JSON.parse(delivery.requestBodyJson ?? "") as Record<string, unknown>;
    } catch {
      throw new ExecuteWebhookDeliveryJobError(
        "invalid_request_body",
        "Corps de requête webhook invalide."
      );
    }

    const startedAt = new Date();

    await db.webhookDelivery.update({
      where: { id: delivery.id },
      data: {
        status: "RUNNING",
        startedAt,
        attemptCount: { increment: 1 },
        errorCode: null,
        errorMessage: null,
      },
    });

    const store = await db.store.findFirst({
      orderBy: { createdAt: "asc" },
      select: { isProduction: true },
    });
    const policy = resolveStoreExecutionPolicy({ isProduction: store?.isProduction ?? false });
    const deliver = policy.mode === "LIVE" ? deliverWebhook : simulateWebhookDelivery;

    const outcome = await deliver({
      endpointId: endpoint.id,
      targetUrl: delivery.requestUrl,
      secret: endpoint.secretHash,
      timeoutMs: endpoint.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      eventType: delivery.eventType,
      body,
    });

    const finishedAt = new Date();

    await db.webhookDelivery.update({
      where: { id: delivery.id },
      data: {
        status: outcome.ok ? "SUCCEEDED" : "FAILED",
        finishedAt,
        responseStatusCode: outcome.statusCode,
        responseBodyText: outcome.responseBody,
        errorCode: outcome.errorCode,
        errorMessage: outcome.errorMessage,
      },
    });

    await db.webhookEndpoint.update({
      where: { id: endpoint.id },
      data: {
        lastTriggeredAt: finishedAt,
        ...(outcome.ok ? { lastSucceededAt: finishedAt } : { lastFailedAt: finishedAt }),
      },
    });

    if (!outcome.ok) {
      throw new ExecuteWebhookDeliveryJobError(
        outcome.errorCode ?? "delivery_failed",
        outcome.errorMessage ?? "Livraison webhook échouée."
      );
    }

    await db.job.update({
      where: { id: input.jobId },
      data: {
        status: "SUCCEEDED",
        finishedAt,
        errorCode: null,
        errorMessage: null,
        resultJson: JSON.stringify({
          schema: "creatyss.webhook.delivery-result.v1",
          deliveryId: delivery.id,
          statusCode: outcome.statusCode,
        }),
      },
    });
  } catch (error) {
    await db.job.update({
      where: { id: input.jobId },
      data: {
        status: "FAILED",
        finishedAt: new Date(),
        errorCode:
          error instanceof ExecuteWebhookDeliveryJobError ? error.code : "execution_failed",
        errorMessage: formatDeliveryError(error),
      },
    });

    throw error;
  }
}
