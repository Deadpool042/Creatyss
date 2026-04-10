"use server";

import type { ToggleProductFeaturedResult } from "../types";

export async function toggleProductFeaturedAction(
  _productId: string
): Promise<ToggleProductFeaturedResult> {
  return {
    status: "success",
    message: "Mise à jour effectuée.",
    isFeatured: true,
  };
}
