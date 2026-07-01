import "server-only";

import { db } from "@/core/db";
import { executeAutomationJob } from "./execute-automation-job.service";
import { AUTOMATION_JOB_TYPE_CODES } from "../shared/automation-job.constants";

const SUPPORTED_JOB_TYPE_CODES = AUTOMATION_JOB_TYPE_CODES;

const RUNNING_STUCK_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

export type RunAutomationJobsBatchStats = {
  recovered: number;
  requeued: number;
  selected: number;
  succeeded: number;
  failed: number;
};

export async function runAutomationJobsBatch(
  batchSize: number = 50
): Promise<RunAutomationJobsBatchStats> {
  const now = new Date();
  const stuckThreshold = new Date(now.getTime() - RUNNING_STUCK_THRESHOLD_MS);

  // 1. Recovery : jobs RUNNING bloqués depuis >15min → FAILED
  const recoveryResult = await db.job.updateMany({
    where: {
      typeCode: { in: [...SUPPORTED_JOB_TYPE_CODES] },
      status: "RUNNING",
      startedAt: { lt: stuckThreshold },
      archivedAt: null,
    },
    data: {
      status: "FAILED",
      finishedAt: now,
      errorCode: "worker_timeout",
      errorMessage: "Job bloqué en RUNNING depuis plus de 15 minutes — récupération automatique.",
    },
  });

  // 2. Auto-retry : jobs FAILED avec attemptCount < maxAttempts → PENDING
  // Prisma ne supporte pas la comparaison de deux colonnes dans `where`,
  // on utilise donc deux passes : findMany pour filtrer, updateMany sur les ids retenus.
  const failedJobs = await db.job.findMany({
    where: {
      typeCode: { in: [...SUPPORTED_JOB_TYPE_CODES] },
      status: "FAILED",
      archivedAt: null,
    },
    select: { id: true, attemptCount: true, maxAttempts: true },
  });

  const retryableIds = failedJobs.filter((j) => j.attemptCount < j.maxAttempts).map((j) => j.id);

  let requeuedCount = 0;

  if (retryableIds.length > 0) {
    const { count } = await db.job.updateMany({
      where: { id: { in: retryableIds }, status: "FAILED", archivedAt: null },
      data: {
        status: "PENDING",
        errorCode: null,
        errorMessage: null,
        startedAt: null,
        finishedAt: null,
      },
    });
    requeuedCount = count;
  }

  // 3. Sélection des jobs PENDING dus
  const dueJobs = await db.job.findMany({
    where: {
      typeCode: { in: [...SUPPORTED_JOB_TYPE_CODES] },
      status: "PENDING",
      archivedAt: null,
      scheduledAt: { lte: now },
    },
    select: { id: true, storeId: true },
    orderBy: [{ priority: "desc" }, { scheduledAt: "asc" }],
    take: batchSize,
  });

  let succeeded = 0;
  let failed = 0;

  for (const job of dueJobs) {
    if (!job.storeId) {
      failed++;
      continue;
    }

    try {
      await executeAutomationJob({ jobId: job.id, storeId: job.storeId });
      succeeded++;
    } catch {
      failed++;
    }
  }

  return {
    recovered: recoveryResult.count,
    requeued: requeuedCount,
    selected: dueJobs.length,
    succeeded,
    failed,
  };
}
