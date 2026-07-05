import { MediaAssetKind } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { mapAdminMediaListItem } from "@/features/admin/media/mappers/map-admin-media-list-item";
import type {
  AdminMediaLibraryView,
  AdminMediaListItem,
} from "@/features/admin/media/types/admin-media-list-item.types";

type GetAdminMediaAssetByIdInput = {
  id: string;
  view?: AdminMediaLibraryView;
};

export async function getAdminMediaAssetById(
  input: string | GetAdminMediaAssetByIdInput
): Promise<AdminMediaListItem | null> {
  const id = typeof input === "string" ? input : input.id;
  const view = typeof input === "string" ? "active" : (input.view ?? "active");
  const asset = await db.mediaAsset.findFirst({
    where: {
      id,
      kind: MediaAssetKind.IMAGE,
      ...(view === "trash" ? { archivedAt: { not: null } } : { archivedAt: null }),
    },
    select: {
      id: true,
      originalFilename: true,
      storageKey: true,
      publicUrl: true,
      slug: true,
      title: true,
      altText: true,
      caption: true,
      description: true,
      mimeType: true,
      createdAt: true,
      archivedAt: true,
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
