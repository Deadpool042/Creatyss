"use server";

import { refresh } from "next/cache";
import { bulkRestoreProductsSchema } from "../schemas/bulk-restore-products.schema";
import { bulkRestoreProducts } from "../services";
import type { BulkRestoreProductsInput, BulkRestoreProductsResult } from "../types";

function getSuccessMessage(updatedCount: number): string {
  return `${updatedCount} produit${updatedCount > 1 ? "s" : ""} restauré${updatedCount > 1 ? "s" : ""}.`;
}

export async function bulkRestoreProductsAction(
  input: BulkRestoreProductsInput
): Promise<BulkRestoreProductsResult> {
  const parsed = bulkRestoreProductsSchema.safeParse({
    productIds: input.productIds
      .map((productId) => productId.trim())
      .filter((productId) => productId.length > 0),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Sélection invalide.",
    };
  }

  try {
    const result = await bulkRestoreProducts(parsed.data);

    refresh();

    return {
      status: "success",
      message: getSuccessMessage(result.updatedCount),
      updatedCount: result.updatedCount,
    };
  } catch {
    return {
      status: "error",
      message: "Restauration groupée impossible.",
    };
  }
}
