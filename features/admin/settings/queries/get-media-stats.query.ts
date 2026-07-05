import "server-only";

import { MediaAssetKind } from "@/prisma-generated/client";

import { db } from "@/core/db";

export type AdminMediaStats = {
  activeAssetCount: number;
  totalImageBytes: number;
  latestImageCreatedAt: Date | null;
};

export async function getAdminMediaStats(): Promise<AdminMediaStats> {
  const [activeAssetCount, imageAggregates] = await Promise.all([
    db.mediaAsset.count({
      where: {
        status: "ACTIVE",
        kind: MediaAssetKind.IMAGE,
        archivedAt: null,
      },
    }),
    db.mediaAsset.aggregate({
      where: {
        status: "ACTIVE",
        kind: MediaAssetKind.IMAGE,
        archivedAt: null,
      },
      _sum: {
        sizeBytes: true,
      },
      _max: {
        createdAt: true,
      },
    }),
  ]);

  return {
    activeAssetCount,
    totalImageBytes: imageAggregates._sum.sizeBytes ?? 0,
    latestImageCreatedAt: imageAggregates._max.createdAt ?? null,
  };
}
