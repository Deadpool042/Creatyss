"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { deleteProductSchema } from "@/features/admin/products/editor/schemas/delete-product.schema";
import type {
  DeleteProductInput,
  DeleteProductResult,
} from "@/features/admin/products/editor/types/product-delete.types";
import { archiveProduct } from "@/features/admin/products/shared/services/archive-product.service";

export async function deleteProductAction(input: DeleteProductInput): Promise<DeleteProductResult> {
  const parsed = deleteProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Paramètres invalides pour la suppression du produit.",
    };
  }

  const product = await db.product.findFirst({
    where: {
      id: parsed.data.productId,
      archivedAt: null,
    },
    select: {
      slug: true,
    },
  });

  if (product === null) {
    return {
      status: "error",
      message: "Produit introuvable.",
    };
  }

  try {
    await archiveProduct({
      productSlug: product.slug,
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${product.slug}/edit`);

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
