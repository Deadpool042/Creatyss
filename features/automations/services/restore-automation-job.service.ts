import "server-only";

import { db } from "@/core/db";
import { AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE } from "@/features/automations/shared/automation-job.constants";

type RestoreAutomationJobInput = {
  jobId: string;
  storeId: string;
};

export type RestoreAutomationJobMode = "rearmed_pending" | "unarchived_only";

export class RestoreAutomationJobError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "RestoreAutomationJobError";
    this.code = code;
  }
}

function parseAutomationId(payloadJson: string | null): string | null {
  if (!payloadJson) {
    return null;
  }

  try {
    const payload = JSON.parse(payloadJson) as { automationId?: unknown };
    return typeof payload.automationId === "string" && payload.automationId.length > 0
      ? payload.automationId
      : null;
  } catch {
    return null;
  }
}

export async function restoreAutomationJob(
  input: RestoreAutomationJobInput
): Promise<RestoreAutomationJobMode> {
  const job = await db.job.findFirst({
    where: {
      id: input.jobId,
      storeId: input.storeId,
      typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
      archivedAt: { not: null },
    },
    select: {
      id: true,
      status: true,
      errorCode: true,
      payloadJson: true,
    },
  });

  if (!job) {
    throw new RestoreAutomationJobError("job_not_found", "Job archivé introuvable.");
  }

  const shouldRearmPending =
    job.status === "CANCELLED" && job.errorCode === "archived_by_admin";

  if (shouldRearmPending) {
    const automationId = parseAutomationId(job.payloadJson);

    if (automationId) {
      const automation = await db.automation.findFirst({
        where: {
          id: automationId,
          storeId: input.storeId,
          archivedAt: null,
          status: "ACTIVE",
        },
        select: { id: true },
      });

      if (automation) {
        const restored = await db.job.updateMany({
          where: {
            id: input.jobId,
            storeId: input.storeId,
            typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
            status: "CANCELLED",
            errorCode: "archived_by_admin",
            archivedAt: { not: null },
          },
          data: {
            status: "PENDING",
            startedAt: null,
            finishedAt: null,
            errorCode: null,
            errorMessage: null,
            archivedAt: null,
          },
        });

        if (restored.count !== 1) {
          throw new RestoreAutomationJobError(
            "job_restore_failed",
            "Le job n'est plus disponible pour restauration."
          );
        }

        return "rearmed_pending";
      }
    }
  }

  const restored = await db.job.updateMany({
    where: {
      id: input.jobId,
      storeId: input.storeId,
      typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
      archivedAt: { not: null },
    },
    data: {
      archivedAt: null,
    },
  });

  if (restored.count !== 1) {
    throw new RestoreAutomationJobError(
      "job_restore_failed",
      "Le job n'est plus disponible pour restauration."
    );
  }

  return "unarchived_only";
}
