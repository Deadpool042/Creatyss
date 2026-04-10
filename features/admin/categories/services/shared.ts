import type { DbExecutor } from "@/core/db";
import { AdminCategoryServiceError } from "../types";

export async function assertCategoryExists(executor: DbExecutor, categoryId: string): Promise<void> {
  const category = await executor.category.findFirst({
    where: {
      id: categoryId,
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (category === null) {
    throw new AdminCategoryServiceError("category_missing");
  }
}

export async function assertParentCategoryExists(
  executor: DbExecutor,
  parentId: string | null
): Promise<void> {
  if (parentId === null) {
    return;
  }

  const category = await executor.category.findFirst({
    where: {
      id: parentId,
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (category === null) {
    throw new AdminCategoryServiceError("parent_category_missing");
  }
}

export async function assertMediaAssetExists(
  executor: DbExecutor,
  mediaAssetId: string | null
): Promise<void> {
  if (mediaAssetId === null) {
    return;
  }

  const asset = await executor.mediaAsset.findFirst({
    where: {
      id: mediaAssetId,
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (asset === null) {
    throw new AdminCategoryServiceError("media_asset_missing");
  }
}
