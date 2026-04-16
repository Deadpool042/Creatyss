import { withTransaction } from "@/core/db";

export type RestoreProductInput = {
  productSlug: string;
};

export type RestoreProductResult = {
  id: string;
};

export async function restoreProduct(
  input: RestoreProductInput
): Promise<RestoreProductResult> {
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
