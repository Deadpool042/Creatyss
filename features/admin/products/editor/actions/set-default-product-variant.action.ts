//features/admin/products/editor/actions/set-default-product-variant.action.ts
"use server";

import { revalidatePath } from "next/cache";

import { db, withTransaction } from "@/core/db";
import { setDefaultProductVariantSchema } from "@/features/admin/products/editor/schemas/set-default-product-variant.schema";
import type {
  SetDefaultProductVariantInput,
  SetDefaultProductVariantResult,
} from "@/features/admin/products/editor/types/product-variant-default.types";

export async function setDefaultProductVariantAction(
  input: SetDefaultProductVariantInput
): Promise<SetDefaultProductVariantResult> {
  const parsed = setDefaultProductVariantSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Paramètres invalides pour la mise à jour de la variante par défaut.",
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

  await withTransaction(async (tx) => {
    await tx.productVariant.updateMany({
      where: {
        productId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    await tx.productVariant.update({
      where: {
        id: variantId,
      },
      data: {
        isDefault: true,
      },
    });
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${variant.product.slug}/edit`);

  return {
    status: "success",
    message: "La variante par défaut a été mise à jour.",
  };
}
