import "server-only";

import type { DbTx } from "@/core/db/transactions/with-transaction";
import {
  WEBHOOK_DELIVERY_JOB_TYPE,
  WEBHOOK_DELIVERY_PAYLOAD_SCHEMA,
  WEBHOOK_DELIVERY_SUBJECT_TYPE,
} from "@/features/webhooks/shared/webhook-job.constants";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

type QueueWebhookDeliveryJobsInput = {
  storeId: string;
  eventType: string;
  eventId: string;
  occurredAt: Date;
  eventBody: Record<string, unknown>;
};

function buildIdempotencyKey(input: {
  endpointId: string;
  eventType: string;
  eventId: string;
}): string {
  return ["webhook", input.endpointId, input.eventType, input.eventId].join(":");
}

export async function queueWebhookDeliveryJobs(
  tx: DbTx,
  input: QueueWebhookDeliveryJobsInput
): Promise<number> {
  const webhooksFeatureActive = await meetsFeatureLevel("platform.webhooks", "retry", {
    storeId: input.storeId,
  });

  if (!webhooksFeatureActive) {
    return 0;
  }

  const endpoints = await tx.webhookEndpoint.findMany({
    where: {
      storeId: input.storeId,
      status: "ACTIVE",
      isEnabled: true,
      eventType: input.eventType,
      archivedAt: null,
    },
    select: {
      id: true,
      targetUrl: true,
      maxAttempts: true,
    },
  });

  if (endpoints.length === 0) {
    return 0;
  }

  const bodyJson = JSON.stringify(input.eventBody);
  let queued = 0;

  for (const endpoint of endpoints) {
    const idempotencyKey = buildIdempotencyKey({
      endpointId: endpoint.id,
      eventType: input.eventType,
      eventId: input.eventId,
    });

    const existingJob = await tx.job.findUnique({
      where: { idempotencyKey },
      select: { id: true },
    });

    if (existingJob !== null) {
      continue;
    }

    const delivery = await tx.webhookDelivery.create({
      data: {
        webhookEndpointId: endpoint.id,
        status: "PENDING",
        eventType: input.eventType,
        eventId: input.eventId,
        idempotencyKey,
        requestUrl: endpoint.targetUrl,
        requestMethod: "POST",
        requestBodyJson: bodyJson,
        scheduledAt: input.occurredAt,
      },
      select: { id: true },
    });

    await tx.job.create({
      data: {
        storeId: input.storeId,
        typeCode: WEBHOOK_DELIVERY_JOB_TYPE,
        status: "PENDING",
        priority: "NORMAL",
        subjectType: WEBHOOK_DELIVERY_SUBJECT_TYPE,
        subjectId: delivery.id,
        idempotencyKey,
        deduplicationKey: idempotencyKey,
        payloadJson: JSON.stringify({
          schema: WEBHOOK_DELIVERY_PAYLOAD_SCHEMA,
          deliveryId: delivery.id,
          webhookEndpointId: endpoint.id,
          eventType: input.eventType,
          eventId: input.eventId,
          occurredAt: input.occurredAt.toISOString(),
        }),
        scheduledAt: input.occurredAt,
        maxAttempts: endpoint.maxAttempts,
        attemptCount: 0,
      },
    });

    queued += 1;
  }

  return queued;
}
