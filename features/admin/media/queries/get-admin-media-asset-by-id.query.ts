import { MediaAssetKind } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { mapAdminMediaListItem } from "@/features/admin/media/mappers/map-admin-media-list-item";
import type { AdminMediaListItem } from "@/features/admin/media/types/admin-media-list-item.types";

export async function getAdminMediaAssetById(id: string): Promise<AdminMediaListItem | null> {
  const asset = await db.mediaAsset.findFirst({
    where: {
      id,
      kind: MediaAssetKind.IMAGE,
    },
    select: {
      id: true,
      originalFilename: true,
      storageKey: true,
      publicUrl: true,
      mimeType: true,
      createdAt: true,
      sizeBytes: true,
      widthPx: true,
      heightPx: true,
    },
  });

  if (asset === null) {
    return null;
  }

  return mapAdminMediaListItem(asset);
}
