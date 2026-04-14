import { withTransaction } from "@/core/db";

type RestoreProductServiceInput = {
  productSlug: string;
};

type RestoreProductServiceResult = {
  id: string;
};

export async function restoreProduct(
  input: RestoreProductServiceInput
): Promise<RestoreProductServiceResult> {
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

    return tx.product.update({
      where: {
        id: product.id,
      },
      data: {
        archivedAt: null,
      },
      select: {
        id: true,
      },
    });
  });
}
