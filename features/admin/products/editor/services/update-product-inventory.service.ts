import { InventoryItemStatus } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db";
import { AdminProductEditorServiceError, assertProductExists } from "./shared";

type UpdateProductInventoryRowInput = {
  variantId: string;
  onHandQuantity: number;
  reservedQuantity: number;
};

type UpdateProductInventoryServiceInput = {
  productId: string;
  rows: readonly UpdateProductInventoryRowInput[];
};

export async function updateProductInventory(
  input: UpdateProductInventoryServiceInput
): Promise<{ productId: string }> {
  return withTransaction(async (tx) => {
    const product = await assertProductExists(tx, input.productId);
    const uniqueVariantIds = Array.from(new Set(input.rows.map((row) => row.variantId)));

    const variants = await tx.productVariant.findMany({
      where: {
        id: {
          in: uniqueVariantIds,
        },
        productId: input.productId,
        archivedAt: null,
      },
      select: {
        id: true,
        sku: true,
      },
    });

    if (variants.length !== uniqueVariantIds.length) {
      throw new AdminProductEditorServiceError("variant_missing");
    }

    const skuByVariantId = new Map(variants.map((variant) => [variant.id, variant.sku]));

    for (const row of input.rows) {
      if (
        row.onHandQuantity < 0 ||
        row.reservedQuantity < 0 ||
        row.reservedQuantity > row.onHandQuantity
      ) {
        throw new AdminProductEditorServiceError("inventory_invalid");
      }

      const sku = skuByVariantId.get(row.variantId);

      if (typeof sku !== "string" || sku.length === 0) {
        throw new AdminProductEditorServiceError("variant_missing");
      }

      await tx.inventoryItem.upsert({
        where: {
          storeId_variantId: {
            storeId: product.storeId,
            variantId: row.variantId,
          },
        },
        update: {
          sku,
          status: InventoryItemStatus.ACTIVE,
          archivedAt: null,
          onHandQuantity: row.onHandQuantity,
          reservedQuantity: row.reservedQuantity,
        },
        create: {
          storeId: product.storeId,
          variantId: row.variantId,
          sku,
          status: InventoryItemStatus.ACTIVE,
          onHandQuantity: row.onHandQuantity,
          reservedQuantity: row.reservedQuantity,
        },
      });
    }

    return { productId: input.productId };
  });
}
