import "server-only";

import { db } from "@/core/db";

export type PaymentsGovernanceData = Readonly<{
  total: number;
  captured: number;
  failed: number;
}>;

export async function getPaymentsGovernanceData(): Promise<PaymentsGovernanceData | null> {
  try {
    const [total, captured, failed] = await Promise.all([
      db.payment.count(),
      db.payment.count({
        where: { status: "CAPTURED" },
      }),
      db.payment.count({
        where: { status: "FAILED" },
      }),
    ]);

    return {
      total,
      captured,
      failed,
    };
  } catch {
    return null;
  }
}
