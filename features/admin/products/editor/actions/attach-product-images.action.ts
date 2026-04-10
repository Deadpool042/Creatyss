"use server";

import {
  attachProductImages,
  AdminProductEditorServiceError,
} from "../services";
import type { AttachProductImagesInput, AttachProductImagesResult } from "../types";

export async function attachProductImagesAction(
  input: AttachProductImagesInput
): Promise<AttachProductImagesResult> {
  try {
    await attachProductImages({
      images: input.images,
    });

    return {
      status: "success",
      message: "Association effectuée.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        status: "error",
        message: "Association impossible.",
      };
    }

    return {
      status: "error",
      message: "Erreur inattendue.",
    };
  }
}
