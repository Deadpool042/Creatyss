"use server";

import { refresh } from "next/cache";
import { deleteProductPermanentlySchema } from "../schemas/delete-product-permanently.schema";
import { deleteProductPermanently } from "../services/delete-product-permanently.service";
import type { DeleteProductPermanentlyInput, DeleteProductPermanentlyResult } from "../types";

export async function deleteProductPermanentlyAction(
  input: DeleteProductPermanentlyInput
): Promise<DeleteProductPermanentlyResult> {
  const parsed = deleteProductPermanentlySchema.safeParse({
    productSlug: input.productSlug.trim(),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Produit invalide.",
    };
  }

  try {
    await deleteProductPermanently(parsed.data);

    refresh();

    return {
      status: "success",
      message: "Produit supprimé définitivement.",
    };
  } catch {
    return {
      status: "error",
      message: "Suppression définitive impossible.",
    };
  }
}
