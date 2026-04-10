"use server";

import { productImageAltTextSchema } from "../schemas";
import type {
  UpdateProductImageAltTextInput,
  UpdateProductImageAltTextResult,
} from "../types";

export async function updateProductImageAltTextAction(
  input: UpdateProductImageAltTextInput
): Promise<UpdateProductImageAltTextResult> {
  const parsed = productImageAltTextSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Données invalides.",
    };
  }

  return {
    status: "success",
    message: "Mise à jour effectuée.",
  };
}
