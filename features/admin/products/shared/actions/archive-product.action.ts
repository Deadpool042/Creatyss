"use server";

import { refresh } from "next/cache";

import type { AdminProductActionResult } from "@/features/admin/products/types";
import { archiveProduct } from "../services/archive-product.service";

export async function archiveProductBySlugAction(
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
