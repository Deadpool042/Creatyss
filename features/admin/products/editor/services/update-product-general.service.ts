//features/admin/products/editor/services/update-product-general.service.ts
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
  productTypeId: string | null;
  primaryImageId: string | null;
};

function mapProductTypeCodeToIsStandalone(code: string): boolean | null {
  if (code === "simple") return true;
  if (code === "variable") return false;
  return null;
}

export async function updateProductGeneral(
  input: UpdateProductGeneralServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    const currentProduct = await tx.product.findFirst({
      where: {
        id: input.productId,
        archivedAt: null,
      },
      select: {
        isStandalone: true,
        productType: {
          select: {
            code: true,
          },
        },
      },
    });

    if (currentProduct === null) {
      throw new AdminProductEditorServiceError("product_missing");
    }

    let resolvedIsStandalone = currentProduct.isStandalone;

    if (input.productTypeId !== null) {
      await assertProductTypeExists(tx, input.productTypeId);

      const selectedType = await tx.productType.findFirst({
        where: {
          id: input.productTypeId,
          archivedAt: null,
        },
        select: {
          code: true,
        },
      });

      if (selectedType !== null) {
        const computed = mapProductTypeCodeToIsStandalone(selectedType.code);

        if (computed !== null) {
          resolvedIsStandalone = computed;
        }
      }
    } else {
      const currentTypeCode = currentProduct.productType?.code ?? null;
      const computed = currentTypeCode ? mapProductTypeCodeToIsStandalone(currentTypeCode) : null;

      if (computed !== null) {
        resolvedIsStandalone = computed;
      }
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
          isStandalone: resolvedIsStandalone,
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
