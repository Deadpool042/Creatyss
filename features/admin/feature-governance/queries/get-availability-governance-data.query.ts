import "server-only";

import { db } from "@/core/db";

export type AvailabilityGovernanceData = Readonly<{
  totalRecords: number;
  totalPolicies: number;
}>;

export async function getAvailabilityGovernanceData(): Promise<AvailabilityGovernanceData | null> {
  try {
    const [totalRecords, totalPolicies] = await Promise.all([
      db.availabilityRecord.count(),
      db.availabilityPolicy.count(),
    ]);

    return {
      totalRecords,
      totalPolicies,
    };
  } catch {
    return null;
  }
}
