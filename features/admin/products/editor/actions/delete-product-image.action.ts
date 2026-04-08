"use server";

import { revalidatePath } from "next/cache";
import { MediaReferenceRole, MediaReferenceSubjectType } from "@/prisma-generated/client";

import { db, withTransaction } from "@/core/db";
import { deleteProductImageSchema } from "@/features/admin/products/editor/schemas/delete-product-image.schema";
import type {
  DeleteProductImageInput,
  DeleteProductImageResult,
} from "@/features/admin/products/editor/types/product-image-delete.types";

export async function deleteProductImageAction(
  input: DeleteProductImageInput
): Promise<DeleteProductImageResult> {
  const parsed = deleteProductImageSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Paramètres invalides pour la suppression de l’image.",
    };
  }

  const { productId, assetId } = parsed.data;

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      slug: true,
      primaryImageId: true,
    },
  });

  if (!product) {
    return {
      status: "error",
      message: "Produit introuvable.",
    };
  }

  const referenceToDelete = await db.mediaReference.findFirst({
    where: {
      subjectType: MediaReferenceSubjectType.PRODUCT,
      subjectId: productId,
      assetId,
      archivedAt: null,
    },
    select: {
      id: true,
      assetId: true,
      isPrimary: true,
    },
  });

  if (!referenceToDelete) {
    return {
      status: "error",
      message: "Cette image n’est pas liée au produit demandé.",
    };
  }

  await withTransaction(async (tx) => {
    await tx.mediaReference.delete({
      where: {
        id: referenceToDelete.id,
      },
    });

    const remainingProductReferences = await tx.mediaReference.findMany({
      where: {
        subjectType: MediaReferenceSubjectType.PRODUCT,
        subjectId: productId,
        archivedAt: null,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        assetId: true,
      },
    });

    if (product.primaryImageId === assetId || referenceToDelete.isPrimary) {
      const nextPrimary = remainingProductReferences[0] ?? null;

      if (nextPrimary) {
        await tx.mediaReference.update({
          where: {
            id: nextPrimary.id,
          },
          data: {
            isPrimary: true,
            role: MediaReferenceRole.PRIMARY,
          },
        });

        await tx.mediaReference.updateMany({
          where: {
            subjectType: MediaReferenceSubjectType.PRODUCT,
            subjectId: productId,
            archivedAt: null,
            NOT: {
              id: nextPrimary.id,
            },
          },
          data: {
            isPrimary: false,
            role: MediaReferenceRole.GALLERY,
          },
        });

        await tx.product.update({
          where: {
            id: productId,
          },
          data: {
            primaryImageId: nextPrimary.assetId,
          },
        });
      } else {
        await tx.product.update({
          where: {
            id: productId,
          },
          data: {
            primaryImageId: null,
          },
        });
      }
    }

    const remainingAssetReferencesCount = await tx.mediaReference.count({
      where: {
        assetId,
        archivedAt: null,
      },
    });

    if (remainingAssetReferencesCount === 0) {
      await tx.mediaAsset.delete({
        where: {
          id: assetId,
        },
      });
    }
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${product.slug}/edit`);

  return {
    status: "success",
    message: "L’image a été supprimée de la galerie produit.",
  };
}
