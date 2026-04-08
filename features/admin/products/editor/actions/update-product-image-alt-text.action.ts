"use server";

import { revalidatePath } from "next/cache";
import { MediaReferenceSubjectType } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { updateProductImageAltTextSchema } from "@/features/admin/products/editor/schemas/update-product-image-alt-text.schema";
import type {
  UpdateProductImageAltTextInput,
  UpdateProductImageAltTextResult,
} from "@/features/admin/products/editor/types/product-image-alt-text.types";

export async function updateProductImageAltTextAction(
  input: UpdateProductImageAltTextInput
): Promise<UpdateProductImageAltTextResult> {
  const parsed = updateProductImageAltTextSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Paramètres invalides pour la mise à jour du texte alternatif.",
    };
  }

  const { productId, assetId } = parsed.data;
  const normalizedAltText = parsed.data.altText.trim();

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!product) {
    return {
      status: "error",
      message: "Produit introuvable.",
    };
  }

  const reference = await db.mediaReference.findFirst({
    where: {
      subjectType: MediaReferenceSubjectType.PRODUCT,
      subjectId: productId,
      assetId,
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!reference) {
    return {
      status: "error",
      message: "Cette image n’est pas liée au produit demandé.",
    };
  }

  await db.mediaAsset.update({
    where: {
      id: assetId,
    },
    data: {
      altText: normalizedAltText.length > 0 ? normalizedAltText : null,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${product.slug}/edit`);

  return {
    status: "success",
    message: "Le texte alternatif a été mis à jour.",
  };
}
