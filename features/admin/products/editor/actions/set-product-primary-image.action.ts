//features/admin/products/editor/actions/set-product-primary-image.action.ts
"use server";

import { revalidatePath } from "next/cache";
import { MediaReferenceRole, MediaReferenceSubjectType } from "@/prisma-generated/client";

import { db, withTransaction } from "@/core/db";
import { setProductPrimaryImageSchema } from "@/features/admin/products/editor/schemas/set-product-primary-image.schema";
import type {
  SetProductPrimaryImageInput,
  SetProductPrimaryImageResult,
} from "@/features/admin/products/editor/types/product-image-primary.types";

export async function setProductPrimaryImageAction(
  input: SetProductPrimaryImageInput
): Promise<SetProductPrimaryImageResult> {
  const parsed = setProductPrimaryImageSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Paramètres invalides pour définir l’image principale.",
    };
  }

  const { productId, assetId } = parsed.data;

  const product = await db.product.findUnique({
    where: { id: productId },
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

  const targetReference = await db.mediaReference.findFirst({
    where: {
      subjectType: MediaReferenceSubjectType.PRODUCT,
      subjectId: productId,
      assetId,
      archivedAt: null,
    },
    select: {
      id: true,
      assetId: true,
    },
  });

  if (!targetReference) {
    return {
      status: "error",
      message: "Cette image n’est pas liée au produit demandé.",
    };
  }

  await withTransaction(async (tx) => {
    await tx.mediaReference.updateMany({
      where: {
        subjectType: MediaReferenceSubjectType.PRODUCT,
        subjectId: productId,
        archivedAt: null,
      },
      data: {
        isPrimary: false,
        role: MediaReferenceRole.GALLERY,
      },
    });

    await tx.mediaReference.update({
      where: {
        id: targetReference.id,
      },
      data: {
        isPrimary: true,
        role: MediaReferenceRole.PRIMARY,
      },
    });

    await tx.product.update({
      where: {
        id: productId,
      },
      data: {
        primaryImageId: targetReference.assetId,
      },
    });
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${product.slug}/edit`);

  return {
    status: "success",
    message: "L’image principale a été mise à jour.",
  };
}
