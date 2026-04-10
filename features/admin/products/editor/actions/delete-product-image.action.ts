"use server";

import {
  AdminProductEditorServiceError,
  deleteProductImage,
} from "../services";
import type { DeleteProductImageInput, DeleteProductImageResult } from "../types";

export async function deleteProductImageAction(
  input: DeleteProductImageInput
): Promise<DeleteProductImageResult> {
  try {
    await deleteProductImage({
      productId: input.productId,
      imageId: input.imageId,
    });

    return {
      status: "success",
      message: "Suppression effectuée.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        status: "error",
        message: "Suppression impossible.",
      };
    }

    return {
      status: "error",
      message: "Erreur inattendue.",
    };
  }
}
