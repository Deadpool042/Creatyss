import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE } from "@/features/automations/shared/automation-job.constants";
import type {
  AdminArchivedAutomationSummary,
  AdminAutomationJobActivitySummary,
} from "@/features/admin/marketing/automations/types/admin-automation.types";

type AutomationJobPayload = {
  automationId?: unknown;
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

function createEmptyJobActivity(): AdminAutomationJobActivitySummary {
  return {
    pending: 0,
    running: 0,
    failed: 0,
    succeeded: 0,
    cancelled: 0,
    total: 0,
  };
}

export async function listAdminArchivedAutomations(): Promise<
  AdminArchivedAutomationSummary[]
> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return [];
  }

  const [automations, archivedJobs] = await Promise.all([
    db.automation.findMany({
      where: {
        storeId,
        archivedAt: { not: null },
      },
      orderBy: [{ archivedAt: "desc" }],
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
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
        archivedAt: { not: null },
      },
      select: {
        status: true,
        payloadJson: true,
      },
    }),
  ]);

  const activityByAutomationId = new Map<string, AdminAutomationJobActivitySummary>();

  for (const job of archivedJobs) {
    const automationId = parseAutomationId(job.payloadJson);

    if (automationId === null) {
      continue;
    }

    const counts = activityByAutomationId.get(automationId) ?? createEmptyJobActivity();
    counts.total += 1;

    if (job.status === "PENDING") counts.pending += 1;
    else if (job.status === "RUNNING") counts.running += 1;
    else if (job.status === "FAILED") counts.failed += 1;
    else if (job.status === "SUCCEEDED") counts.succeeded += 1;
    else if (job.status === "CANCELLED") counts.cancelled += 1;

    activityByAutomationId.set(automationId, counts);
  }

  return automations.flatMap((automation) =>
    automation.archivedAt === null
      ? []
      : [
          {
            ...automation,
            archivedAt: automation.archivedAt,
            jobActivity: activityByAutomationId.get(automation.id) ?? createEmptyJobActivity(),
          },
        ]
  );
}
