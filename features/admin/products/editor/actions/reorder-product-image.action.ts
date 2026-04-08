"use server";

import { revalidatePath } from "next/cache";
import { MediaReferenceSubjectType } from "@/prisma-generated/client";

import { db, withTransaction } from "@/core/db";
import { reorderProductImageSchema } from "@/features/admin/products/editor/schemas/reorder-product-image.schema";
import type {
  ReorderProductImageInput,
  ReorderProductImageResult,
} from "@/features/admin/products/editor/types/product-image-reorder.types";

export async function reorderProductImageAction(
  input: ReorderProductImageInput
): Promise<ReorderProductImageResult> {
  const parsed = reorderProductImageSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Paramètres invalides pour le réordonnancement de l’image.",
    };
  }

  const { productId, assetId, direction } = parsed.data;

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

  const references = await db.mediaReference.findMany({
    where: {
      subjectType: MediaReferenceSubjectType.PRODUCT,
      subjectId: productId,
      archivedAt: null,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      assetId: true,
      sortOrder: true,
      createdAt: true,
    },
  });

  const currentIndex = references.findIndex((reference) => reference.assetId === assetId);

  if (currentIndex === -1) {
    return {
      status: "error",
      message: "Cette image n’est pas liée au produit demandé.",
    };
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= references.length) {
    return {
      status: "success",
      message:
        direction === "up"
          ? "L’image est déjà en première position."
          : "L’image est déjà en dernière position.",
    };
  }

  const currentReference = references[currentIndex];
  const targetReference = references[targetIndex];

  if (!currentReference || !targetReference) {
    return {
      status: "error",
      message: "Impossible de réordonner cette image.",
    };
  }

  await withTransaction(async (tx) => {
    await tx.mediaReference.update({
      where: {
        id: currentReference.id,
      },
      data: {
        sortOrder: targetReference.sortOrder,
      },
    });

    await tx.mediaReference.update({
      where: {
        id: targetReference.id,
      },
      data: {
        sortOrder: currentReference.sortOrder,
      },
    });
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${product.slug}/edit`);

  return {
    status: "success",
    message:
      direction === "up"
        ? "L’image a été déplacée vers le haut."
        : "L’image a été déplacée vers le bas.",
  };
}
