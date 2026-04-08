"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { deleteProductVariantSchema } from "@/features/admin/products/editor/schemas/delete-product-variant.schema";
import type {
  DeleteProductVariantInput,
  DeleteProductVariantResult,
} from "@/features/admin/products/editor/types/product-variant-delete.types";

export async function deleteProductVariantAction(
  input: DeleteProductVariantInput
): Promise<DeleteProductVariantResult> {
  const parsed = deleteProductVariantSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Paramètres invalides pour la suppression de la variante.",
    };
  }

  const { productId, variantId } = parsed.data;

  const variant = await db.productVariant.findUnique({
    where: {
      id: variantId,
    },
    select: {
      id: true,
      productId: true,
      product: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!variant || variant.productId !== productId) {
    return {
      status: "error",
      message: "La variante demandée est introuvable.",
    };
  }

  const variantCount = await db.productVariant.count({
    where: {
      productId,
    },
  });

  if (variantCount <= 1) {
    return {
      status: "error",
      message: "Le produit doit conserver au moins une variante.",
    };
  }

  try {
    await db.productVariant.delete({
      where: {
        id: variantId,
      },
    });
  } catch {
    return {
      status: "error",
      message:
        "Impossible de supprimer cette variante. Elle est peut-être liée à un panier, un checkout ou un stock actif.",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${variant.product.slug}/edit`);

  return {
    status: "success",
    message: "La variante a été supprimée.",
  };
}
