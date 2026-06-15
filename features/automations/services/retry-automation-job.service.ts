import "server-only";

import { db } from "@/core/db";
import { executeAutomationJob } from "@/features/automations/services/execute-automation-job.service";
import { AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE } from "@/features/automations/shared/automation-job.constants";

type RetryAutomationJobInput = {
  jobId: string;
  storeId: string;
};

export class RetryAutomationJobError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "RetryAutomationJobError";
    this.code = code;
  }
}

export async function retryAutomationJob(
  input: RetryAutomationJobInput
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
    throw new RetryAutomationJobError("job_not_found", "Job introuvable.");
  }

  if (job.status !== "FAILED") {
    throw new RetryAutomationJobError(
      "job_not_failed",
      "Seuls les jobs échoués peuvent être relancés."
    );
  }

  const rearmed = await db.job.updateMany({
    where: {
      id: input.jobId,
      storeId: input.storeId,
      typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
      status: "FAILED",
      archivedAt: null,
    },
    data: {
      status: "PENDING",
      startedAt: null,
      finishedAt: null,
      errorCode: null,
      errorMessage: null,
    },
  });

  if (rearmed.count !== 1) {
    throw new RetryAutomationJobError(
      "job_rearm_failed",
      "Le job n'est plus disponible pour relance."
    );
  }

  await executeAutomationJob({
    jobId: input.jobId,
    storeId: input.storeId,
  });
}
