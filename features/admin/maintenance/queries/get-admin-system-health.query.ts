import { db } from "@/core/db";

export type AdminAuditLogEntry = {
  id: string;
  actorType: string;
  actorUserId: string | null;
  actionCode: string;
  entityType: string;
  entityId: string | null;
  level: "INFO" | "WARNING" | "CRITICAL";
  message: string | null;
  createdAt: string;
  changesCount: number;
};

export type AdminSystemHealth = {
  audit: {
    total: number;
    critical: number;
    warning: number;
    recent: AdminAuditLogEntry[];
  };
  events: {
    total: number;
    pending: number;
    failed: number;
  };
  jobs: {
    pending: number;
    running: number;
    failed: number;
  };
};

export async function getAdminSystemHealth(): Promise<AdminSystemHealth> {
  const [
    auditStats,
    auditRecent,
    eventStats,
    jobStats,
  ] = await Promise.all([
    // Audit stats
    db.auditLog.groupBy({ by: ["level"], _count: { level: true } }),

    // Recent critical + warning audit logs
    db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        actorType: true,
        actorUserId: true,
        actionCode: true,
        entityType: true,
        entityId: true,
        level: true,
        message: true,
        createdAt: true,
        _count: { select: { changes: true } },
      },
    }),

    // DomainEvent stats
    db.domainEvent.groupBy({ by: ["status"], _count: { status: true } }),

    // Job stats
    db.job.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  // Compute audit totals
  const auditTotals = { total: 0, critical: 0, warning: 0 };
  for (const row of auditStats) {
    auditTotals.total += row._count.level;
    if (row.level === "CRITICAL") auditTotals.critical = row._count.level;
    if (row.level === "WARNING") auditTotals.warning = row._count.level;
  }

  // DomainEvent totals
  const events = { total: 0, pending: 0, failed: 0 };
  for (const row of eventStats) {
    events.total += row._count.status;
    if (row.status === "PENDING") events.pending = row._count.status;
    if (row.status === "FAILED") events.failed = row._count.status;
  }

  // Job totals
  const jobs = { pending: 0, running: 0, failed: 0 };
  for (const row of jobStats) {
    if (row.status === "PENDING") jobs.pending = row._count.status;
    if (row.status === "RUNNING") jobs.running = row._count.status;
    if (row.status === "FAILED") jobs.failed = row._count.status;
  }

  return {
    audit: {
      ...auditTotals,
      recent: auditRecent.map((log) => ({
        id: log.id,
        actorType: log.actorType as string,
        actorUserId: log.actorUserId,
        actionCode: log.actionCode,
        entityType: log.entityType,
        entityId: log.entityId,
        level: log.level as AdminAuditLogEntry["level"],
        message: log.message,
        createdAt: log.createdAt.toISOString(),
        changesCount: log._count.changes,
      })),
    },
    events,
    jobs,
  };
}
