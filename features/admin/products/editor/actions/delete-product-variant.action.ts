"use server";

import { refresh } from "next/cache";
import { deleteProductVariant, AdminProductEditorServiceError } from "../services";
import type { DeleteProductVariantInput, DeleteProductVariantResult } from "../types";

export async function deleteProductVariantAction(
  input: DeleteProductVariantInput
): Promise<DeleteProductVariantResult> {
  try {
    await deleteProductVariant({
      productId: input.productId,
      variantId: input.variantId,
    });

    refresh();

    return {
      status: "success",
      message: "Suppression effectuée.",
    };
  } catch (error: unknown) {
    if (
      error instanceof AdminProductEditorServiceError &&
      error.code === "cannot_delete_default_variant"
    ) {
      return {
        status: "error",
        message: "Choisissez d'abord une autre variante par défaut avant de supprimer celle-ci.",
      };
    }

    return {
      status: "error",
      message: "Suppression impossible.",
    };
  }
}
