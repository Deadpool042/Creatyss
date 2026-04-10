"use server";

import {
  AdminProductEditorServiceError,
  setProductPrimaryImage,
} from "../services";
import type {
  SetProductPrimaryImageInput,
  SetProductPrimaryImageResult,
} from "../types";

export async function setProductPrimaryImageAction(
  input: SetProductPrimaryImageInput
): Promise<SetProductPrimaryImageResult> {
  try {
    await setProductPrimaryImage({
      productId: input.productId,
      mediaAssetId: input.mediaAssetId,
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
