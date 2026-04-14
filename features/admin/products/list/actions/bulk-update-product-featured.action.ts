"use server";

import { refresh } from "next/cache";
import { bulkUpdateProductFeaturedSchema } from "../schemas/bulk-update-product-featured.schema";
import { bulkUpdateProductFeatured } from "../services";
import type { BulkUpdateProductFeaturedInput, BulkUpdateProductFeaturedResult } from "../types";

function getSuccessMessage(
  updatedCount: number,
  isFeatured: BulkUpdateProductFeaturedInput["isFeatured"]
): string {
  const countLabel = `${updatedCount} produit${updatedCount > 1 ? "s" : ""}`;

  if (isFeatured) {
    return `${countLabel} mis en avant.`;
  }

  return `${countLabel} retiré${updatedCount > 1 ? "s" : ""} de la mise en avant.`;
}

export async function bulkUpdateProductFeaturedAction(
  input: BulkUpdateProductFeaturedInput
): Promise<BulkUpdateProductFeaturedResult> {
  const parsed = bulkUpdateProductFeaturedSchema.safeParse({
    productIds: input.productIds
      .map((productId) => productId.trim())
      .filter((productId) => productId.length > 0),
    isFeatured: input.isFeatured,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Sélection invalide.",
    };
  }

  try {
    const result = await bulkUpdateProductFeatured(parsed.data);

    refresh();

    return {
      status: "success",
      message: getSuccessMessage(result.updatedCount, parsed.data.isFeatured),
      updatedCount: result.updatedCount,
    };
  } catch {
    return {
      status: "error",
      message: "Mise à jour groupée impossible.",
    };
  }
}
