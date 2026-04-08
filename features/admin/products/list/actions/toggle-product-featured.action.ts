"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import type { ToggleProductFeaturedResult } from "@/features/admin/products/list/types";

export async function toggleProductFeaturedAction(
  productId: string
): Promise<ToggleProductFeaturedResult> {
  const normalizedProductId = productId.trim();

  if (normalizedProductId.length === 0) {
    return {
      status: "error",
      message: "Identifiant produit manquant.",
    };
  }

  const existingProduct = await db.product.findUnique({
    where: {
      id: normalizedProductId,
    },
    select: {
      id: true,
      slug: true,
      isFeatured: true,
    },
  });

  if (!existingProduct) {
    return {
      status: "error",
      message: "Produit introuvable.",
    };
  }

  const updatedProduct = await db.product.update({
    where: {
      id: existingProduct.id,
    },
    data: {
      isFeatured: !existingProduct.isFeatured,
    },
    select: {
      isFeatured: true,
      slug: true,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${updatedProduct.slug}/edit`);

  return {
    status: "success",
    message: updatedProduct.isFeatured
      ? "Le produit est maintenant mis en avant."
      : "Le produit n’est plus mis en avant.",
    isFeatured: updatedProduct.isFeatured,
  };
}
