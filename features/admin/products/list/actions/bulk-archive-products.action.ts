"use server";

import { refresh } from "next/cache";
import { bulkArchiveProductsSchema } from "../schemas/bulk-archive-products.schema";
import { bulkArchiveProducts } from "../services";
import type { BulkArchiveProductsInput, BulkArchiveProductsResult } from "../types";

function getSuccessMessage(updatedCount: number): string {
  return `${updatedCount} produit${updatedCount > 1 ? "s" : ""} mis à la corbeille.`;
}

export async function bulkArchiveProductsAction(
  input: BulkArchiveProductsInput
): Promise<BulkArchiveProductsResult> {
  const parsed = bulkArchiveProductsSchema.safeParse({
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
    const result = await bulkArchiveProducts(parsed.data);

    refresh();

    return {
      status: "success",
      message: getSuccessMessage(result.updatedCount),
      updatedCount: result.updatedCount,
    };
  } catch {
    return {
      status: "error",
      message: "Mise à la corbeille impossible.",
    };
  }
}
