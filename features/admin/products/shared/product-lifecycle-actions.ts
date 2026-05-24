"use server";

import { refresh } from "next/cache";

import type { AdminProductActionResult } from "@/features/admin/products/types";
import {
  archiveProduct,
  deleteProductPermanently,
  restoreProduct,
} from "./product-lifecycle-services";

// ---------------------------------------------------------------------------
// archiveProductBySlugAction
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// deleteProductPermanentlyBySlugAction
// ---------------------------------------------------------------------------

type DeleteProductPermanentlyActionInput = {
  productSlug: string;
};

export async function deleteProductPermanentlyBySlugAction(
  input: DeleteProductPermanentlyActionInput
): Promise<AdminProductActionResult> {
  const normalizedProductSlug = input.productSlug.trim();

  if (normalizedProductSlug.length === 0) {
    return {
      status: "error",
      message: "Produit invalide.",
    };
  }

  try {
    await deleteProductPermanently({
      productSlug: normalizedProductSlug,
    });

    refresh();

    return {
      status: "success",
      message: "Produit supprimé définitivement.",
    };
  } catch {
    return {
      status: "error",
      message: "Suppression définitive impossible.",
    };
  }
}

// ---------------------------------------------------------------------------
// restoreProductBySlugAction
// ---------------------------------------------------------------------------

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
