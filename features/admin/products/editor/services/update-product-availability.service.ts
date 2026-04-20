import { withTransaction } from "@/core/db";
import {
  AdminProductEditorServiceError,
  assertProductExists,
  mapEditorAvailabilityStatusToPrismaStatus,
} from "./shared";

type UpdateProductAvailabilityRowInput = {
  variantId: string;
  status: "available" | "unavailable" | "preorder" | "backorder" | "discontinued" | "archived";
  isSellable: boolean;
  backorderAllowed: boolean;
  sellableFrom: Date | null;
  sellableUntil: Date | null;
  preorderStartsAt: Date | null;
  preorderEndsAt: Date | null;
};

type UpdateProductAvailabilityServiceInput = {
  productId: string;
  rows: readonly UpdateProductAvailabilityRowInput[];
};

export async function updateProductAvailability(
  input: UpdateProductAvailabilityServiceInput
): Promise<{ productId: string }> {
  return withTransaction(async (tx) => {
    const product = await assertProductExists(tx, input.productId);

    const variantIds = Array.from(new Set(input.rows.map((row) => row.variantId)));

    const variants = await tx.productVariant.findMany({
      where: {
        id: {
          in: variantIds,
        },
        productId: input.productId,
        archivedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (variants.length !== variantIds.length) {
      throw new AdminProductEditorServiceError("variant_missing");
    }

    for (const row of input.rows) {
      const effectiveIsSellable =
        row.status === "unavailable" || row.status === "discontinued" || row.status === "archived"
          ? false
          : row.isSellable;

      await tx.availabilityRecord.upsert({
        where: {
          storeId_variantId: {
            storeId: product.storeId,
            variantId: row.variantId,
          },
        },
        update: {
          status: mapEditorAvailabilityStatusToPrismaStatus(row.status),
          isSellable: effectiveIsSellable,
          backorderAllowed: row.backorderAllowed,
          sellableFrom: row.sellableFrom,
          sellableUntil: row.sellableUntil,
          preorderStartsAt: row.preorderStartsAt,
          preorderEndsAt: row.preorderEndsAt,
          archivedAt: null,
        },
        create: {
          storeId: product.storeId,
          variantId: row.variantId,
          status: mapEditorAvailabilityStatusToPrismaStatus(row.status),
          isSellable: effectiveIsSellable,
          backorderAllowed: row.backorderAllowed,
          sellableFrom: row.sellableFrom,
          sellableUntil: row.sellableUntil,
          preorderStartsAt: row.preorderStartsAt,
          preorderEndsAt: row.preorderEndsAt,
        },
      });
    }

    return { productId: input.productId };
  });
}
