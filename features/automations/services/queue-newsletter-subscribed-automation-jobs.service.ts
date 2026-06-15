import "server-only";

import type { DbTx } from "@/core/db/transactions/with-transaction";
import {
  AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
  AUTOMATION_NEWSLETTER_SUBSCRIBED_PAYLOAD_SCHEMA,
  AUTOMATION_NEWSLETTER_SUBSCRIBER_SUBJECT_TYPE,
} from "@/features/automations/shared/automation-job.constants";

type QueueNewsletterSubscribedAutomationJobsInput = {
  storeId: string;
  newsletterSubscriberId: string;
  occurredAt: Date;
};

type FeatureFlagRow = {
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  isEnabledByDefault: boolean;
  storeId: string | null;
  overrides: Array<{
    scopeType: string;
    scopeId: string;
    isEnabled: boolean;
    startsAt: Date | null;
    endsAt: Date | null;
    archivedAt: Date | null;
  }>;
};

function isOverrideActive(
  override: FeatureFlagRow["overrides"][number],
  now: Date
): boolean {
  if (override.archivedAt !== null) return false;
  if (override.startsAt !== null && override.startsAt > now) return false;
  if (override.endsAt !== null && override.endsAt < now) return false;
  return true;
}

async function isAutomationsFeatureActive(tx: DbTx, storeId: string): Promise<boolean> {
  const flags: FeatureFlagRow[] = await tx.featureFlag.findMany({
    where: {
      code: "engagement.automations",
      archivedAt: null,
      OR: [{ storeId }, { storeId: null }],
    },
    select: {
      status: true,
      isEnabledByDefault: true,
      storeId: true,
      overrides: {
        where: {
          archivedAt: null,
          scopeType: "STORE",
          scopeId: storeId,
        },
        select: {
          scopeType: true,
          scopeId: true,
          isEnabled: true,
          startsAt: true,
          endsAt: true,
          archivedAt: true,
        },
      },
    },
  });

  if (flags.length === 0) {
    return false;
  }

  const selectedFlag =
    flags.find((flag) => flag.storeId === storeId) ??
    flags.find((flag) => flag.storeId === null) ??
    null;

  if (selectedFlag === null) {
    return false;
  }

  const now = new Date();
  const storeOverride =
    selectedFlag.overrides.find(
      (override) =>
        override.scopeType === "STORE" &&
        override.scopeId === storeId &&
        isOverrideActive(override, now)
    ) ?? null;

  if (storeOverride !== null) {
    return storeOverride.isEnabled;
  }

  return selectedFlag.status === "ACTIVE" && selectedFlag.isEnabledByDefault;
}

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
  const featureActive = await isAutomationsFeatureActive(tx, input.storeId);

  if (!featureActive) {
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
