//features/admin/products/list/services/toggle-product-featured.service.ts
import { withTransaction } from "@/core/db";

type ToggleProductFeaturedServiceInput = {
  productId: string;
};

type ToggleProductFeaturedServiceResult = {
  id: string;
  isFeatured: boolean;
};

export async function toggleProductFeatured(
  input: ToggleProductFeaturedServiceInput
): Promise<ToggleProductFeaturedServiceResult> {
  return withTransaction(async (tx) => {
    const currentProduct = await tx.product.findFirst({
      where: {
        id: input.productId,
        archivedAt: null,
      },
      select: {
        id: true,
        isFeatured: true,
      },
    });

    if (currentProduct === null) {
      throw new Error("product_not_found");
    }

    return tx.product.update({
      where: {
        id: input.productId,
      },
      data: {
        isFeatured: !currentProduct.isFeatured,
      },
      select: {
        id: true,
        isFeatured: true,
      },
    });
  });
}
