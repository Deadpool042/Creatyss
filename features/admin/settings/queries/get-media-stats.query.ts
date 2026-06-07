import { db } from "@/core/db";

export type AdminMediaStats = {
  activeAssetCount: number;
};

export async function getAdminMediaStats(): Promise<AdminMediaStats> {
  const activeAssetCount = await db.mediaAsset.count({
    where: { status: "ACTIVE" },
  });

  return { activeAssetCount };
}
