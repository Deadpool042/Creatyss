import { withTransaction } from "@/core/db";
import type { BulkUpdateProductFeaturedInput } from "../types";

type BulkUpdateProductFeaturedServiceResult = {
  updatedCount: number;
};

export async function bulkUpdateProductFeatured(
  input: BulkUpdateProductFeaturedInput
): Promise<BulkUpdateProductFeaturedServiceResult> {
  return withTransaction(async (tx) => {
    const result = await tx.product.updateMany({
      where: {
        id: {
          in: input.productIds,
        },
      },
      data: {
        isFeatured: input.isFeatured,
      },
    });

    return {
      updatedCount: result.count,
    };
  });
}
