"use server";

import { AdminProductEditorServiceError, updateProductImageAltText } from "../services";
import type { UpdateProductImageAltTextInput, UpdateProductImageAltTextResult } from "../types";

export async function updateProductImageAltTextAction(
  input: UpdateProductImageAltTextInput
): Promise<UpdateProductImageAltTextResult> {
  try {
    await updateProductImageAltText({
      productId: input.productId,
      imageId: input.imageId,
      altText: input.altText,
    });

    return {
      status: "success",
      message: "Texte alternatif mis à jour.",
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
