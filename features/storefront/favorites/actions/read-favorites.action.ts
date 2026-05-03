"use server";

import { readFavoriteProductIds } from "@/core/sessions/favorites";

export async function readFavoritesAction(): Promise<{ productIds: string[] }> {
  const productIds = await readFavoriteProductIds();
  return { productIds };
}
