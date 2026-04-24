import type { DbExecutor } from "@/core/db";

import { AdminProductEditorServiceError } from "./error";

export async function assertRelatedProductsExist(
  executor: DbExecutor,
  productId: string,
  storeId: string,
  relatedProductIds: readonly string[]
): Promise<void> {
  if (relatedProductIds.length === 0) {
    return;
  }

  if (relatedProductIds.includes(productId)) {
    throw new AdminProductEditorServiceError("related_product_missing");
  }

  const products = await executor.product.findMany({
    where: {
      id: {
        in: [...relatedProductIds],
      },
      storeId,
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (products.length !== relatedProductIds.length) {
    throw new AdminProductEditorServiceError("related_product_missing");
  }
}
