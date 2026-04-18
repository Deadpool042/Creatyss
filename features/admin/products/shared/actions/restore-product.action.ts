"use server";

import { refresh } from "next/cache";

import type { AdminProductActionResult } from "@/features/admin/products/types";
import { restoreProduct } from "../services/restore-product.service";

export async function restoreProductBySlugAction(
  productSlug: string
): Promise<AdminProductActionResult> {
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
