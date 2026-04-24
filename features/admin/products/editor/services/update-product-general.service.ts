//features/admin/products/editor/services/update-product-general.service.ts
import { withTransaction } from "@/core/db";
import {
  AdminProductEditorServiceError,
  assertProductExists,
  assertProductTypeExists,
  mapEditorStatusToPrismaStatus,
} from "./shared";

type UpdateProductGeneralServiceInput = {
  productId: string;
  name: string;
  slug: string;
  skuRoot: string | null;
  marketingHook: string | null;
  shortDescription: string | null;
  description: string | null;
  status: "draft" | "active" | "inactive" | "archived";
  isFeatured: boolean;
  productTypeId: string | null;
};

function mapProductTypeCodeToIsStandalone(code: string): boolean | null {
  if (code === "simple") return true;
  if (code === "variable") return false;
  return null;
}

export async function updateProductGeneral(
  input: UpdateProductGeneralServiceInput
): Promise<{ id: string; wasConvertedToVariable: boolean }> {
  return withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    const currentProduct = await tx.product.findFirst({
      where: {
        id: input.productId,
        archivedAt: null,
      },
      select: {
        isStandalone: true,
        publishedAt: true,
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

    if (!currentProduct.isStandalone && resolvedIsStandalone) {
      const activeVariantCount = await tx.productVariant.count({
        where: {
          productId: input.productId,
          archivedAt: null,
        },
      });

      if (activeVariantCount > 1) {
        throw new AdminProductEditorServiceError("product_has_multiple_variants");
      }
    }

    const wasConvertedToVariable = currentProduct.isStandalone && !resolvedIsStandalone;

    if (resolvedIsStandalone) {
      const skuRoot = input.skuRoot?.trim() ?? "";
      if (skuRoot.length === 0) {
        throw new AdminProductEditorServiceError("missing_product_sku_root");
      }
    }

    try {
      const updated = await tx.product.update({
        where: {
          id: input.productId,
        },
        data: {
          name: input.name,
          slug: input.slug,
          skuRoot: input.skuRoot?.trim() ?? null,
          marketingHook: input.marketingHook,
          shortDescription: input.shortDescription,
          description: input.description,
          status: mapEditorStatusToPrismaStatus(input.status),
          isFeatured: input.isFeatured,
          isStandalone: resolvedIsStandalone,
          productTypeId: input.productTypeId,
          publishedAt: input.status === "active" && currentProduct.publishedAt === null
            ? new Date()
            : currentProduct.publishedAt,
        },
        select: {
          id: true,
        },
      });

      return { id: updated.id, wasConvertedToVariable };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "update_failed";
      throw new AdminProductEditorServiceError("product_missing", message);
    }
  });
}
