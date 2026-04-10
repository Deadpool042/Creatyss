import { withTransaction } from "@/core/db";
import {
  assertProductExists,
  assertRelatedProductsExist,
  mapEditorRelatedTypeToPrismaType,
} from "./shared";

type RelatedProductInput = {
  targetProductId: string;
  type: "related" | "cross_sell" | "up_sell" | "accessory" | "similar";
  sortOrder: number;
};

type UpdateProductRelatedProductsServiceInput = {
  productId: string;
  relatedProducts: readonly RelatedProductInput[];
};

export async function updateProductRelatedProducts(
  input: UpdateProductRelatedProductsServiceInput
): Promise<{ productId: string }> {
  return withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);
    await assertRelatedProductsExist(
      tx,
      input.productId,
      input.relatedProducts.map((item) => item.targetProductId)
    );

    await tx.relatedProduct.deleteMany({
      where: {
        sourceProductId: input.productId,
      },
    });

    if (input.relatedProducts.length > 0) {
      await tx.relatedProduct.createMany({
        data: input.relatedProducts.map((item) => ({
          sourceProductId: input.productId,
          targetProductId: item.targetProductId,
          type: mapEditorRelatedTypeToPrismaType(item.type),
          sortOrder: item.sortOrder,
        })),
      });
    }

    return {
      productId: input.productId,
    };
  });
}
