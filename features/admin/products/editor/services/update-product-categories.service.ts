import { withTransaction } from "@/core/db";
import {
  assertCategoriesExist,
  assertProductExists,
} from "./shared";

type CategoryLinkInput = {
  categoryId: string;
  isPrimary: boolean;
  sortOrder: number;
};

type UpdateProductCategoriesServiceInput = {
  productId: string;
  links: readonly CategoryLinkInput[];
};

export async function updateProductCategories(
  input: UpdateProductCategoriesServiceInput
): Promise<{ productId: string }> {
  return withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);
    await assertCategoriesExist(
      tx,
      input.links.map((link) => link.categoryId)
    );

    await tx.productCategory.deleteMany({
      where: {
        productId: input.productId,
      },
    });

    if (input.links.length > 0) {
      await tx.productCategory.createMany({
        data: input.links.map((link) => ({
          productId: input.productId,
          categoryId: link.categoryId,
          isPrimary: link.isPrimary,
          sortOrder: link.sortOrder,
        })),
      });
    }

    return {
      productId: input.productId,
    };
  });
}
