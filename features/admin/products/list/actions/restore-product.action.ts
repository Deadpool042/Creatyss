"use server";

import { refresh } from "next/cache";
import { restoreProduct } from "../services";
import type { RestoreProductResult } from "../types";

export async function restoreProductAction(productSlug: string): Promise<RestoreProductResult> {
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
