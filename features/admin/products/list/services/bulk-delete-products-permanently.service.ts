import { withTransaction } from "@/core/db";
import type { BulkDeleteProductsPermanentlyInput } from "../types";
import { deleteProductCatalogByIdInTx } from "@/features/admin/products/shared/services/delete-product-permanently.helpers";
type BulkDeleteProductsPermanentlyServiceResult = {
  deletedCount: number;
};

export async function bulkDeleteProductsPermanently(
  input: BulkDeleteProductsPermanentlyInput
): Promise<BulkDeleteProductsPermanentlyServiceResult> {
  return withTransaction(async (tx) => {
    const products = await tx.product.findMany({
      where: {
        id: {
          in: input.productIds,
        },
        archivedAt: {
          not: null,
        },
      },
      select: {
        id: true,
      },
    });

    if (products.length === 0) {
      throw new Error("products_not_found");
    }

    for (const product of products) {
      await deleteProductCatalogByIdInTx(tx, product.id);
    }

    return {
      deletedCount: products.length,
    };
  });
}
