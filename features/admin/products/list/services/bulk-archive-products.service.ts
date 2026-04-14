import { withTransaction } from "@/core/db";
import type { BulkArchiveProductsInput } from "../types";

type BulkArchiveProductsServiceResult = {
  updatedCount: number;
};

export async function bulkArchiveProducts(
  input: BulkArchiveProductsInput
): Promise<BulkArchiveProductsServiceResult> {
  return withTransaction(async (tx) => {
    const result = await tx.product.updateMany({
      where: {
        id: {
          in: input.productIds,
        },
        archivedAt: null,
      },
      data: {
        archivedAt: new Date(),
      },
    });

    return {
      updatedCount: result.count,
    };
  });
}
