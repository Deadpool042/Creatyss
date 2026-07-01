import "server-only";

import { db } from "@/core/db";
import { AUTOMATION_JOB_TYPE_CODES } from "@/features/automations/shared/automation-job.constants";

type RescheduleAutomationJobInput = {
  jobId: string;
  storeId: string;
  scheduledAt: Date | null;
};

export class RescheduleAutomationJobError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "RescheduleAutomationJobError";
    this.code = code;
  }
}

export async function rescheduleAutomationJob(
  input: RescheduleAutomationJobInput
): Promise<void> {
  const job = await db.job.findFirst({
    where: {
      id: input.jobId,
      storeId: input.storeId,
      typeCode: { in: [...AUTOMATION_JOB_TYPE_CODES] },
      archivedAt: null,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!job) {
    throw new RescheduleAutomationJobError("job_not_found", "Job introuvable.");
  }

  if (job.status !== "PENDING") {
    throw new RescheduleAutomationJobError(
      "job_not_pending",
      "Seuls les jobs en attente peuvent être modifiés."
    );
  }

  const updated = await db.job.updateMany({
    where: {
      id: input.jobId,
      storeId: input.storeId,
      typeCode: { in: [...AUTOMATION_JOB_TYPE_CODES] },
      status: "PENDING",
      archivedAt: null,
    },
    data: {
      scheduledAt: input.scheduledAt,
      errorCode: null,
      errorMessage: null,
    },
  });

  if (updated.count !== 1) {
    throw new RescheduleAutomationJobError(
      "job_reschedule_failed",
      "Le job n'est plus disponible pour modification."
    );
  }
}
