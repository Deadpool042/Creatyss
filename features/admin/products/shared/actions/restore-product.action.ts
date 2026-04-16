"use server";

import { refresh } from "next/cache";

import { restoreProduct } from "../services/restore-product.service";

type ProductRestoreActionResult = {
  status: "success" | "error";
  message: string;
};

export async function restoreProductBySlugAction(
  productSlug: string
): Promise<ProductRestoreActionResult> {
  const normalizedProductSlug = productSlug.trim();

  if (normalizedProductSlug.length === 0) {
    return {
      status: "error",
      message: "Produit introuvable.",
    };
  }

  try {
    await restoreProduct({
      productSlug: normalizedProductSlug,
    });

    refresh();

    return {
      status: "success",
      message: "Produit restauré.",
    };
  } catch {
    return {
      status: "error",
      message: "Restauration impossible.",
    };
  }
}
