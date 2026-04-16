"use server";

import { refresh } from "next/cache";

import { archiveProduct } from "../services/archive-product.service";

type ProductArchiveActionResult = {
  status: "success" | "error";
  message: string;
};

export async function archiveProductBySlugAction(
  productSlug: string
): Promise<ProductArchiveActionResult> {
  const normalizedProductSlug = productSlug.trim();

  if (normalizedProductSlug.length === 0) {
    return {
      status: "error",
      message: "Produit introuvable.",
    };
  }

  try {
    await archiveProduct({
      productSlug: normalizedProductSlug,
    });

    refresh();

    return {
      status: "success",
      message: "Produit mis à la corbeille.",
    };
  } catch {
    return {
      status: "error",
      message: "Archivage impossible.",
    };
  }
}
