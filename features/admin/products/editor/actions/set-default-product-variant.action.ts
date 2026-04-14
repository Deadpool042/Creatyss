"use server";

import { refresh } from "next/cache";
import {
  AdminProductEditorServiceError,
  setDefaultProductVariant,
} from "../services";
import type {
  SetDefaultProductVariantInput,
  SetDefaultProductVariantResult,
} from "../types";

export async function setDefaultProductVariantAction(
  input: SetDefaultProductVariantInput
): Promise<SetDefaultProductVariantResult> {
  try {
    await setDefaultProductVariant({
      productId: input.productId,
      variantId: input.variantId,
    });

    refresh();

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
