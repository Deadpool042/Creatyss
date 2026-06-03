import { db } from "@/core/db";

export type AdminJobSummary = {
  id: string;
  typeCode: string;
  status: "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED";
  priority: "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
  subjectType: string | null;
  subjectId: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  scheduledAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  attemptsCount: number;
};

export type AdminJobsStats = {
  pending: number;
  running: number;
  failed: number;
  succeeded: number;
  cancelled: number;
  total: number;
};

export async function listAdminJobs(limit = 100): Promise<{
  jobs: AdminJobSummary[];
  stats: AdminJobsStats;
}> {
  const [jobs, counts] = await Promise.all([
    db.job.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: limit,
      select: {
        id: true,
        typeCode: true,
        status: true,
        priority: true,
        subjectType: true,
        subjectId: true,
        errorCode: true,
        errorMessage: true,
        scheduledAt: true,
        startedAt: true,
        finishedAt: true,
        createdAt: true,
        _count: { select: { attempts: true } },
      },
    }),
    db.job.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const stats: AdminJobsStats = {
    pending: 0, running: 0, failed: 0, succeeded: 0, cancelled: 0, total: 0,
  };

  for (const row of counts) {
    const count = row._count.status;
    stats.total += count;
    if (row.status === "PENDING") stats.pending = count;
    else if (row.status === "RUNNING") stats.running = count;
    else if (row.status === "FAILED") stats.failed = count;
    else if (row.status === "SUCCEEDED") stats.succeeded = count;
    else if (row.status === "CANCELLED") stats.cancelled = count;
  }

  return {
    stats,
    jobs: jobs.map((j) => ({
      id: j.id,
      typeCode: j.typeCode,
      status: j.status as AdminJobSummary["status"],
      priority: j.priority as AdminJobSummary["priority"],
      subjectType: j.subjectType,
      subjectId: j.subjectId,
      errorCode: j.errorCode,
      errorMessage: j.errorMessage,
      scheduledAt: j.scheduledAt?.toISOString() ?? null,
      startedAt: j.startedAt?.toISOString() ?? null,
      finishedAt: j.finishedAt?.toISOString() ?? null,
      createdAt: j.createdAt.toISOString(),
      attemptsCount: j._count.attempts,
    })),
  };
}
