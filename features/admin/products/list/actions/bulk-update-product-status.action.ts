//features/admin/products/list/actions/bulk-update-product-status.action.ts
"use server";

import { refresh } from "next/cache";
import { bulkUpdateProductStatusSchema } from "../schemas/bulk-update-product-status.schema";
import { bulkUpdateProductStatus } from "../services";
import type { BulkUpdateProductStatusInput, BulkUpdateProductStatusResult } from "../types";

function getSuccessMessage(
  updatedCount: number,
  status: BulkUpdateProductStatusInput["status"]
): string {
  const countLabel = `${updatedCount} produit${updatedCount > 1 ? "s" : ""}`;

  switch (status) {
    case "draft":
      return `${countLabel} mis en brouillon.`;
    case "active":
      return `${countLabel} activé${updatedCount > 1 ? "s" : ""}.`;
    case "inactive":
      return `${countLabel} désactivé${updatedCount > 1 ? "s" : ""}.`;
    case "archived":
      return `${countLabel} archivé${updatedCount > 1 ? "s" : ""}.`;
  }
}

export async function bulkUpdateProductStatusAction(
  input: BulkUpdateProductStatusInput
): Promise<BulkUpdateProductStatusResult> {
  const parsed = bulkUpdateProductStatusSchema.safeParse({
    productIds: input.productIds
      .map((productId) => productId.trim())
      .filter((productId) => productId.length > 0),
    status: input.status,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Sélection ou statut invalide.",
    };
  }

  try {
    const result = await bulkUpdateProductStatus(parsed.data);

    refresh();

    return {
      status: "success",
      message: getSuccessMessage(result.updatedCount, parsed.data.status),
      updatedCount: result.updatedCount,
    };
  } catch {
    return {
      status: "error",
      message: "Mise à jour groupée impossible.",
    };
  }
}
