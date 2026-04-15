"use server";

import { refresh } from "next/cache";
import { bulkDeleteProductsPermanentlySchema } from "../schemas/bulk-delete-products-permanently.schema";
import { bulkDeleteProductsPermanently } from "../services/bulk-delete-products-permanently.service";
import type {
  BulkDeleteProductsPermanentlyInput,
  BulkDeleteProductsPermanentlyResult,
} from "../types";

function getSuccessMessage(deletedCount: number): string {
  if (deletedCount <= 1) {
    return "1 produit supprimé définitivement.";
  }

  return `${deletedCount} produits supprimés définitivement.`;
}

export async function bulkDeleteProductsPermanentlyAction(
  input: BulkDeleteProductsPermanentlyInput
): Promise<BulkDeleteProductsPermanentlyResult> {
  const parsed = bulkDeleteProductsPermanentlySchema.safeParse({
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
    const result = await bulkDeleteProductsPermanently(parsed.data);

    refresh();

    return {
      status: "success",
      message: getSuccessMessage(result.deletedCount),
      deletedCount: result.deletedCount,
    };
  } catch {
    return {
      status: "error",
      message: "Suppression définitive groupée impossible.",
    };
  }
}
