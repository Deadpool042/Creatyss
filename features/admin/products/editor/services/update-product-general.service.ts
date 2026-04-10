import { withTransaction } from "@/core/db";
import {
  AdminProductEditorServiceError,
  assertMediaAssetExists,
  assertProductExists,
  assertProductTypeExists,
  mapEditorStatusToPrismaStatus,
} from "./shared";

type UpdateProductGeneralServiceInput = {
  productId: string;
  name: string;
  slug: string;
  skuRoot: string | null;
  shortDescription: string | null;
  description: string | null;
  status: "draft" | "active" | "inactive" | "archived";
  isFeatured: boolean;
  isStandalone: boolean;
  productTypeId: string | null;
  primaryImageId: string | null;
};

export async function updateProductGeneral(
  input: UpdateProductGeneralServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    if (input.productTypeId !== null) {
      await assertProductTypeExists(tx, input.productTypeId);
    }

    if (input.primaryImageId !== null) {
      await assertMediaAssetExists(tx, input.primaryImageId);
    }

    try {
      return await tx.product.update({
        where: {
          id: input.productId,
        },
        data: {
          name: input.name,
          slug: input.slug,
          skuRoot: input.skuRoot,
          shortDescription: input.shortDescription,
          description: input.description,
          status: mapEditorStatusToPrismaStatus(input.status),
          isFeatured: input.isFeatured,
          isStandalone: input.isStandalone,
          productTypeId: input.productTypeId,
          primaryImageId: input.primaryImageId,
          publishedAt: input.status === "active" ? new Date() : null,
        },
        select: {
          id: true,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "update_failed";
      throw new AdminProductEditorServiceError("product_missing", message);
    }
  });
}
