"use server";

import {
  AdminProductEditorServiceError,
  reorderProductImage,
} from "../services";
import type { ReorderProductImageInput, ReorderProductImageResult } from "../types";

export async function reorderProductImageAction(
  input: ReorderProductImageInput
): Promise<ReorderProductImageResult> {
  try {
    await reorderProductImage({
      productId: input.productId,
      imageId: input.imageId,
      sortOrder: input.sortOrder,
    });

    return {
      status: "success",
      message: "Mise à jour effectuée.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        status: "error",
        message: "Mise à jour impossible.",
      };
    }

    return {
      status: "error",
      message: "Erreur inattendue.",
    };
  }
}
