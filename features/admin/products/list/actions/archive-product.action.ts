"use server";

import { refresh } from "next/cache";
import { archiveProduct } from "../services";
import type { ArchiveProductResult } from "../types";

export async function archiveProductAction(productSlug: string): Promise<ArchiveProductResult> {
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
