import { withTransaction } from "@/core/db";
import { deleteProductCatalogByIdInTx } from "./delete-product-permanently.helpers";

type DeleteProductPermanentlyInput = {
  productSlug: string;
};

type DeleteProductPermanentlyServiceResult = {
  id: string;
};

export async function deleteProductPermanently(
  input: DeleteProductPermanentlyInput
): Promise<DeleteProductPermanentlyServiceResult> {
  return withTransaction(async (tx) => {
    const product = await tx.product.findFirst({
      where: {
        slug: input.productSlug,
        archivedAt: {
          not: null,
        },
      },
      select: {
        id: true,
      },
    });

    if (product === null) {
      throw new Error("product_not_found");
    }

    await deleteProductCatalogByIdInTx(tx, product.id);

    return {
      id: product.id,
    };
  });
}
