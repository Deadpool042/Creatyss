import { ProductStatus } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db";
import type { BulkRestoreProductsInput } from "../types";

type BulkRestoreProductsServiceResult = {
  updatedCount: number;
};

export async function bulkRestoreProducts(
  input: BulkRestoreProductsInput
): Promise<BulkRestoreProductsServiceResult> {
  return withTransaction(async (tx) => {
    const result = await tx.product.updateMany({
      where: {
        id: {
          in: input.productIds,
        },
        archivedAt: {
          not: null,
        },
      },
      data: {
        archivedAt: null,
        status: ProductStatus.DRAFT,
        publishedAt: null,
      },
    });

    return {
      updatedCount: result.count,
    };
  });
}
