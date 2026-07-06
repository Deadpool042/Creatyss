import "server-only";

import { db } from "@/core/db";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export type ObservabilityGovernanceData = Readonly<{
  totalSignals: number;
  recentSignals: number;
}>;

export type LogsGovernanceData = Readonly<{
  total: number;
  recentLogs: number;
}>;

export async function getObservabilityGovernanceData(): Promise<ObservabilityGovernanceData | null> {
  try {
    const oneDayAgo = new Date(Date.now() - ONE_DAY_IN_MS);

    const [totalSignals, recentSignals] = await Promise.all([
      db.observabilitySignal.count(),
      db.observabilitySignal.count({
        where: { createdAt: { gte: oneDayAgo } },
      }),
    ]);

    return {
      totalSignals,
      recentSignals,
    };
  } catch {
    return null;
  }
}

export async function getLogsGovernanceData(): Promise<LogsGovernanceData | null> {
  try {
    const oneDayAgo = new Date(Date.now() - ONE_DAY_IN_MS);

    const [total, recentLogs] = await Promise.all([
      db.auditLog.count(),
      db.auditLog.count({
        where: { createdAt: { gte: oneDayAgo } },
      }),
    ]);

    return {
      total,
      recentLogs,
    };
  } catch {
    return null;
  }
}
