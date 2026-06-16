import "server-only";

import type { DbTx } from "@/core/db/transactions/with-transaction";
import {
  AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
  AUTOMATION_NEWSLETTER_SUBSCRIBED_PAYLOAD_SCHEMA,
  AUTOMATION_NEWSLETTER_SUBSCRIBER_SUBJECT_TYPE,
} from "@/features/automations/shared/automation-job.constants";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

type QueueNewsletterSubscribedAutomationJobsInput = {
  storeId: string;
  newsletterSubscriberId: string;
  occurredAt: Date;
};

function buildScheduledAt(occurredAt: Date, delayMinutes: number): Date {
  return new Date(occurredAt.getTime() + delayMinutes * 60_000);
}

function buildIdempotencyKey(input: {
  automationId: string;
  newsletterSubscriberId: string;
  occurredAt: Date;
}): string {
  return [
    "automation",
    input.automationId,
    "newsletter-subscribed",
    input.newsletterSubscriberId,
    input.occurredAt.toISOString(),
  ].join(":");
}

function buildDeduplicationKey(input: {
  automationId: string;
  newsletterSubscriberId: string;
}): string {
  return [
    "automation",
    input.automationId,
    "newsletter-subscribed",
    input.newsletterSubscriberId,
  ].join(":");
}

/**
 * Premier branchement runtime borne :
 * chaque automation ACTIVE `NEWSLETTER_SUBSCRIBED` planifie un `Job`
 * traçable. Aucun worker ni exécution provider n'est ajouté ici.
 */
export async function queueNewsletterSubscribedAutomationJobs(
  tx: DbTx,
  input: QueueNewsletterSubscribedAutomationJobsInput
): Promise<number> {
  const [newsletterAutomationLevelMet, automationsFeatureActive] = await Promise.all([
    meetsFeatureLevel("engagement.newsletter", "automation", { storeId: input.storeId }),
    queryFeatureFlagActive("engagement.automations", { storeId: input.storeId }),
  ]);

  if (!newsletterAutomationLevelMet || !automationsFeatureActive) {
    return 0;
  }

  const automations = await tx.automation.findMany({
    where: {
      storeId: input.storeId,
      status: "ACTIVE",
      triggerType: "NEWSLETTER_SUBSCRIBED",
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
      typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
      status: "PENDING",
      priority: "NORMAL",
      subjectType: AUTOMATION_NEWSLETTER_SUBSCRIBER_SUBJECT_TYPE,
      subjectId: input.newsletterSubscriberId,
      idempotencyKey: buildIdempotencyKey({
        automationId: automation.id,
        newsletterSubscriberId: input.newsletterSubscriberId,
        occurredAt: input.occurredAt,
      }),
      deduplicationKey: buildDeduplicationKey({
        automationId: automation.id,
        newsletterSubscriberId: input.newsletterSubscriberId,
      }),
      payloadJson: JSON.stringify({
        schema: AUTOMATION_NEWSLETTER_SUBSCRIBED_PAYLOAD_SCHEMA,
        automationId: automation.id,
        automationCode: automation.code,
        triggerType: "NEWSLETTER_SUBSCRIBED",
        actionType: automation.actionType,
        templateCode: automation.templateCode,
        newsletterSubscriberId: input.newsletterSubscriberId,
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
