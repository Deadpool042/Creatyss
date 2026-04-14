//features/admin/products/list/actions/toggle-product-featured.action.ts
"use server";

import { refresh } from "next/cache";
import { toggleProductFeatured } from "../services";
import type { ToggleProductFeaturedResult } from "../types";

export async function toggleProductFeaturedAction(
  productId: string
): Promise<ToggleProductFeaturedResult> {
  const normalizedProductId = productId.trim();

  if (normalizedProductId.length === 0) {
    return {
      status: "error",
      message: "Produit introuvable.",
    };
  }

  try {
    const result = await toggleProductFeatured({
      productId: normalizedProductId,
    });

    refresh();

    return {
      status: "success",
      message: "Mise à jour effectuée.",
      isFeatured: result.isFeatured,
    };
  } catch {
    return {
      status: "error",
      message: "Mise à jour impossible.",
    };
  }
}
