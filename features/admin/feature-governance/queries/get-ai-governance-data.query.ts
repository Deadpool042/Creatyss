import "server-only";

import { db } from "@/core/db";

export type AiGovernanceData = Readonly<{
  total: number;
  succeeded: number;
  failed: number;
}>;

export async function getAiGovernanceData(): Promise<AiGovernanceData | null> {
  try {
    const [total, succeeded, failed] = await Promise.all([
      db.aiTask.count(),
      db.aiTask.count({
        where: { status: "SUCCEEDED" },
      }),
      db.aiTask.count({
        where: { status: "FAILED" },
      }),
    ]);

    return {
      total,
      succeeded,
      failed,
    };
  } catch {
    return null;
  }
}
