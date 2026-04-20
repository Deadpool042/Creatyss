import { db } from "@/core/db";
import type { AttachableMediaAssetItem, AttachableMediaAssetsData } from "../types";

export async function listAttachableMediaAssets(
  productId: string
): Promise<AttachableMediaAssetsData> {
  const assets = await db.mediaAsset.findMany({
    where: {
      archivedAt: null,
    },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      publicUrl: true,
      altText: true,
      originalFilename: true,
      createdAt: true,
    },
  });

  const items: AttachableMediaAssetItem[] = assets
    .filter((asset) => typeof asset.publicUrl === "string" && asset.publicUrl.length > 0)
    .map((asset) => ({
      id: asset.id,
      publicUrl: asset.publicUrl as string,
      altText: asset.altText,
      originalFilename: asset.originalFilename,
      createdAt: asset.createdAt.toISOString(),
    }));

  return {
    productId,
    items,
  };
}
