import { MediaAssetKind } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { mapAdminMediaListItem } from "@/features/admin/media/mappers/map-admin-media-list-item";
import type { AdminMediaListItem } from "@/features/admin/media/types/admin-media-list-item.types";

type ListAdminMediaAssetsInput = {
  page: number;
  pageSize: number;
};

export type PaginatedAdminMediaAssets = {
  items: AdminMediaListItem[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
};

export async function listAdminMediaAssets(): Promise<AdminMediaListItem[]>;
export async function listAdminMediaAssets(
  input: ListAdminMediaAssetsInput
): Promise<PaginatedAdminMediaAssets>;
export async function listAdminMediaAssets(
  input?: ListAdminMediaAssetsInput
): Promise<AdminMediaListItem[] | PaginatedAdminMediaAssets> {
  const totalCount = await db.mediaAsset.count({
    where: {
      kind: MediaAssetKind.IMAGE,
      archivedAt: null,
    },
  });

  const totalPages = input ? Math.max(1, Math.ceil(totalCount / input.pageSize)) : 1;
  const currentPage = input ? Math.min(Math.max(1, input.page), totalPages) : 1;

  const assets = await db.mediaAsset.findMany({
    where: {
      kind: MediaAssetKind.IMAGE,
      archivedAt: null,
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
    orderBy: {
      createdAt: "desc",
    },
    ...(input
      ? {
          skip: (currentPage - 1) * input.pageSize,
          take: input.pageSize,
        }
      : {}),
  });

  const items = assets.map(mapAdminMediaListItem);

  if (!input) {
    return items;
  }

  return {
    items,
    currentPage,
    totalPages,
    pageSize: input.pageSize,
    totalCount,
  };
}
