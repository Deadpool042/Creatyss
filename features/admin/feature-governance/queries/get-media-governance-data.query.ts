import "server-only";

import { db } from "@/core/db";

export type MediaGovernanceData = Readonly<{
  totalAssets: number;
  activeAssets: number;
  missingAlt: number;
}>;

export async function getMediaGovernanceData(): Promise<MediaGovernanceData | null> {
  try {
    const [totalAssets, activeAssets, missingAlt] = await Promise.all([
      db.mediaAsset.count(),
      db.mediaAsset.count({
        where: { status: "ACTIVE" },
      }),
      db.mediaAsset.count({
        where: {
          status: "ACTIVE",
          altText: null,
        },
      }),
    ]);

    return {
      totalAssets,
      activeAssets,
      missingAlt,
    };
  } catch {
    return null;
  }
}
