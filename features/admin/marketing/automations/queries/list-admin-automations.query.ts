import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE } from "@/features/automations/shared/automation-job.constants";
import type {
  AdminAutomationExecutionStatus,
  AdminAutomationJobActivitySummary,
  AdminAutomationSummary,
} from "@/features/admin/marketing/automations/types/admin-automation.types";

type AutomationJobPayload = {
  automationId?: unknown;
};

type AutomationJobActivity = {
  counts: AdminAutomationJobActivitySummary;
  latestJobStatus: AdminAutomationExecutionStatus | null;
  latestJobAt: Date | null;
  latestJobError: string | null;
};

function parseAutomationId(payloadJson: string | null): string | null {
  if (!payloadJson) {
    return null;
  }

  try {
    const payload = JSON.parse(payloadJson) as AutomationJobPayload;
    return typeof payload.automationId === "string" && payload.automationId.length > 0
      ? payload.automationId
      : null;
  } catch {
    return null;
  }
}

function createEmptyJobActivity(): AutomationJobActivity {
  return {
    counts: {
      pending: 0,
      running: 0,
      failed: 0,
      succeeded: 0,
      cancelled: 0,
      total: 0,
    },
    latestJobStatus: null,
    latestJobAt: null,
    latestJobError: null,
  };
}

function getLatestJobTimestamp(input: {
  finishedAt: Date | null;
  startedAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
}): Date {
  return input.finishedAt ?? input.startedAt ?? input.scheduledAt ?? input.createdAt;
}

/**
 * Liste les définitions `Automation` du store courant (non archivées)
 * pour `/admin/marketing/automations`.
 */
export async function listAdminAutomations(): Promise<AdminAutomationSummary[]> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return [];
  }

  const [automations, jobs] = await Promise.all([
    db.automation.findMany({
      where: { storeId, archivedAt: null },
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        status: true,
        triggerType: true,
        actionType: true,
        delayMinutes: true,
        templateCode: true,
        createdAt: true,
        archivedAt: true,
      },
    }),
    db.job.findMany({
      where: {
        storeId,
        typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
        archivedAt: null,
      },
      select: {
        status: true,
        payloadJson: true,
        createdAt: true,
        scheduledAt: true,
        startedAt: true,
        finishedAt: true,
        errorMessage: true,
      },
    }),
  ]);

  const activityByAutomationId = new Map<string, AutomationJobActivity>();

  for (const job of jobs) {
    const automationId = parseAutomationId(job.payloadJson);

    if (automationId === null) {
      continue;
    }

    const current = activityByAutomationId.get(automationId) ?? createEmptyJobActivity();
    current.counts.total += 1;

    if (job.status === "PENDING") current.counts.pending += 1;
    else if (job.status === "RUNNING") current.counts.running += 1;
    else if (job.status === "FAILED") current.counts.failed += 1;
    else if (job.status === "SUCCEEDED") current.counts.succeeded += 1;
    else if (job.status === "CANCELLED") current.counts.cancelled += 1;

    const latestJobAt = getLatestJobTimestamp(job);
    if (current.latestJobAt === null || latestJobAt.getTime() > current.latestJobAt.getTime()) {
      current.latestJobStatus = job.status as AdminAutomationExecutionStatus;
      current.latestJobAt = latestJobAt;
      current.latestJobError = job.errorMessage;
    }

    activityByAutomationId.set(automationId, current);
  }

  return automations.map((automation) => {
    const activity = activityByAutomationId.get(automation.id) ?? createEmptyJobActivity();

    return {
      ...automation,
      jobActivity: activity.counts,
      latestJobStatus: activity.latestJobStatus,
      latestJobAt: activity.latestJobAt,
      latestJobError: activity.latestJobError,
    };
  });
}
