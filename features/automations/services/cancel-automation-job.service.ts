import "server-only";

import { db } from "@/core/db";
import { AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE } from "@/features/automations/shared/automation-job.constants";

type CancelAutomationJobInput = {
  jobId: string;
  storeId: string;
};

export class CancelAutomationJobError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "CancelAutomationJobError";
    this.code = code;
  }
}

export async function cancelAutomationJob(
  input: CancelAutomationJobInput
): Promise<void> {
  const job = await db.job.findFirst({
    where: {
      id: input.jobId,
      storeId: input.storeId,
      typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
      archivedAt: null,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!job) {
    throw new CancelAutomationJobError("job_not_found", "Job introuvable.");
  }

  if (job.status !== "PENDING") {
    throw new CancelAutomationJobError(
      "job_not_pending",
      "Seuls les jobs en attente peuvent être annulés."
    );
  }

  const cancelled = await db.job.updateMany({
    where: {
      id: input.jobId,
      storeId: input.storeId,
      typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
      status: "PENDING",
      archivedAt: null,
    },
    data: {
      status: "CANCELLED",
      finishedAt: new Date(),
      errorCode: "cancelled_by_admin",
      errorMessage: "Job annulé manuellement depuis l'admin.",
    },
  });

  if (cancelled.count !== 1) {
    throw new CancelAutomationJobError(
      "job_already_claimed",
      "Le job n'est plus disponible pour annulation."
    );
  }
}
