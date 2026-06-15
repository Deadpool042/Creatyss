import "server-only";

import { db } from "@/core/db";
import { AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE } from "@/features/automations/shared/automation-job.constants";

type ArchiveAutomationJobInput = {
  jobId: string;
  storeId: string;
};

export class ArchiveAutomationJobError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ArchiveAutomationJobError";
    this.code = code;
  }
}

export async function archiveAutomationJob(
  input: ArchiveAutomationJobInput
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
    throw new ArchiveAutomationJobError("job_not_found", "Job introuvable.");
  }

  if (job.status === "RUNNING") {
    throw new ArchiveAutomationJobError(
      "job_running",
      "Un job en cours ne peut pas être supprimé."
    );
  }

  const now = new Date();

  if (job.status === "PENDING") {
    const archived = await db.job.updateMany({
      where: {
        id: input.jobId,
        storeId: input.storeId,
        typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
        status: "PENDING",
        archivedAt: null,
      },
      data: {
        status: "CANCELLED",
        finishedAt: now,
        errorCode: "archived_by_admin",
        errorMessage: "Job supprimé depuis l'admin.",
        archivedAt: now,
      },
    });

    if (archived.count !== 1) {
      throw new ArchiveAutomationJobError(
        "job_archive_failed",
        "Le job n'est plus disponible pour suppression."
      );
    }

    return;
  }

  const archived = await db.job.updateMany({
    where: {
      id: input.jobId,
      storeId: input.storeId,
      typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
      archivedAt: null,
    },
    data: {
      archivedAt: now,
    },
  });

  if (archived.count !== 1) {
    throw new ArchiveAutomationJobError(
      "job_archive_failed",
      "Le job n'est plus disponible pour suppression."
    );
  }
}
