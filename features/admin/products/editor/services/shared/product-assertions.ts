import type { DbExecutor } from "@/core/db";

import { AdminProductEditorServiceError } from "./error";

export async function assertProductExists(
  executor: DbExecutor,
  productId: string
): Promise<{
  id: string;
  storeId: string;
  primaryImageId: string | null;
}> {
  const product = await executor.product.findFirst({
    where: {
      id: productId,
      archivedAt: null,
    },
    select: {
      id: true,
      storeId: true,
      primaryImageId: true,
    },
  });

  if (product === null) {
    throw new AdminProductEditorServiceError("product_missing");
  }

  return product;
}

export async function assertMediaAssetExists(
  executor: DbExecutor,
  assetId: string
): Promise<void> {
  const asset = await executor.mediaAsset.findFirst({
    where: {
      id: assetId,
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (asset === null) {
    throw new AdminProductEditorServiceError("media_asset_missing");
  }
}

export async function assertProductTypeExists(
  executor: DbExecutor,
  productTypeId: string
): Promise<void> {
  const productType = await executor.productType.findFirst({
    where: {
      id: productTypeId,
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (productType === null) {
    throw new AdminProductEditorServiceError("product_type_missing");
  }
}

export async function assertCategoriesExist(
  executor: DbExecutor,
  categoryIds: readonly string[]
): Promise<void> {
  if (categoryIds.length === 0) {
    return;
  }

  const categories = await executor.category.findMany({
    where: {
      id: {
        in: [...categoryIds],
      },
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (categories.length !== categoryIds.length) {
    throw new AdminProductEditorServiceError("category_missing");
  }
}
