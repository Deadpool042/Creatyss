"use server";

import { refresh } from "next/cache";

import { deleteProductPermanently } from "../services/delete-product-permanently.service";

type DeleteProductPermanentlyActionInput = {
  productSlug: string;
};

type DeleteProductPermanentlyActionResult = {
  status: "success" | "error";
  message: string;
};

export async function deleteProductPermanentlyBySlugAction(
  input: DeleteProductPermanentlyActionInput
): Promise<DeleteProductPermanentlyActionResult> {
  const normalizedProductSlug = input.productSlug.trim();

  if (normalizedProductSlug.length === 0) {
    return {
      status: "error",
      message: "Produit invalide.",
    };
  }

  try {
    await deleteProductPermanently({
      productSlug: normalizedProductSlug,
    });

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
