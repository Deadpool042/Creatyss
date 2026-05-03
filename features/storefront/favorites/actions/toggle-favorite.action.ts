"use server";

import { toggleFavoriteProductId } from "@/core/sessions/favorites";

export async function toggleFavoriteAction(
  productId: string
): Promise<{ productIds: string[]; isFavorite: boolean }> {
  if (typeof productId !== "string" || productId.trim() === "") {
    return { productIds: [], isFavorite: false };
  }
  return toggleFavoriteProductId(productId.trim());
}
