import "server-only";

import type { DbTx } from "@/core/db/transactions/with-transaction";
import {
  AUTOMATION_ORDER_PLACED_JOB_TYPE,
  AUTOMATION_ORDER_PLACED_PAYLOAD_SCHEMA,
  AUTOMATION_ORDER_SUBJECT_TYPE,
} from "@/features/automations/shared/automation-job.constants";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

type QueueOrderPlacedAutomationJobsInput = {
  storeId: string;
  orderId: string;
  occurredAt: Date;
};

function buildScheduledAt(occurredAt: Date, delayMinutes: number): Date {
  return new Date(occurredAt.getTime() + delayMinutes * 60_000);
}

function buildIdempotencyKey(input: {
  automationId: string;
  orderId: string;
  occurredAt: Date;
}): string {
  return [
    "automation",
    input.automationId,
    "order-placed",
    input.orderId,
    input.occurredAt.toISOString(),
  ].join(":");
}

function buildDeduplicationKey(input: { automationId: string; orderId: string }): string {
  return ["automation", input.automationId, "order-placed", input.orderId].join(":");
}

export async function queueOrderPlacedAutomationJobs(
  tx: DbTx,
  input: QueueOrderPlacedAutomationJobsInput
): Promise<number> {
  const automationsFeatureActive = await meetsFeatureLevel("engagement.automations", "basic", {
    storeId: input.storeId,
  });

  if (!automationsFeatureActive) {
    return 0;
  }

  const automations = await tx.automation.findMany({
    where: {
      storeId: input.storeId,
      status: "ACTIVE",
      triggerType: "ORDER_PLACED",
      archivedAt: null,
    },
    select: {
      id: true,
      code: true,
      actionType: true,
      delayMinutes: true,
      templateCode: true,
    },
  });

  if (automations.length === 0) {
    return 0;
  }

  await tx.job.createMany({
    data: automations.map((automation) => ({
      storeId: input.storeId,
      typeCode: AUTOMATION_ORDER_PLACED_JOB_TYPE,
      status: "PENDING",
      priority: "NORMAL",
      subjectType: AUTOMATION_ORDER_SUBJECT_TYPE,
      subjectId: input.orderId,
      idempotencyKey: buildIdempotencyKey({
        automationId: automation.id,
        orderId: input.orderId,
        occurredAt: input.occurredAt,
      }),
      deduplicationKey: buildDeduplicationKey({
        automationId: automation.id,
        orderId: input.orderId,
      }),
      payloadJson: JSON.stringify({
        schema: AUTOMATION_ORDER_PLACED_PAYLOAD_SCHEMA,
        automationId: automation.id,
        automationCode: automation.code,
        triggerType: "ORDER_PLACED",
        actionType: automation.actionType,
        templateCode: automation.templateCode,
        orderId: input.orderId,
        occurredAt: input.occurredAt.toISOString(),
        scheduledAt: buildScheduledAt(input.occurredAt, automation.delayMinutes).toISOString(),
      }),
      scheduledAt: buildScheduledAt(input.occurredAt, automation.delayMinutes),
      maxAttempts: 1,
      attemptCount: 0,
    })),
  });

  return automations.length;
}
