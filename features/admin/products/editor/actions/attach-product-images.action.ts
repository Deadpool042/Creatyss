"use server";

import { revalidatePath } from "next/cache";
import { MediaReferenceRole, MediaReferenceSubjectType } from "@/prisma-generated/client";

import { db, withTransaction } from "@/core/db";
import { attachProductImagesSchema } from "@/features/admin/products/editor/schemas/attach-product-images.schema";
import type {
  AttachProductImagesInput,
  AttachProductImagesResult,
} from "@/features/admin/products/editor/types/product-image-attach.types";

export async function attachProductImagesAction(
  input: AttachProductImagesInput
): Promise<AttachProductImagesResult> {
  const parsed = attachProductImagesSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Paramètres invalides pour l’association des images.",
    };
  }

  const { productId, assetIds } = parsed.data;

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

  const uniqueAssetIds = [...new Set(assetIds)];

  const assets = await db.mediaAsset.findMany({
    where: {
      id: {
        in: uniqueAssetIds,
      },
      publicUrl: {
        not: null,
      },
    },
    select: {
      id: true,
    },
  });

  if (assets.length === 0) {
    return {
      status: "error",
      message: "Aucune image valide n’a été sélectionnée.",
    };
  }

  await withTransaction(async (tx) => {
    const existingReferences = await tx.mediaReference.findMany({
      where: {
        subjectType: MediaReferenceSubjectType.PRODUCT,
        subjectId: product.id,
        archivedAt: null,
      },
      orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        assetId: true,
        sortOrder: true,
      },
    });

    const existingAssetIds = new Set(existingReferences.map((reference) => reference.assetId));
    let nextSortOrder = (existingReferences[0]?.sortOrder ?? -1) + 1;

    const attachableAssets = assets.filter((asset) => !existingAssetIds.has(asset.id));

    for (const asset of attachableAssets) {
      await tx.mediaReference.create({
        data: {
          assetId: asset.id,
          subjectType: MediaReferenceSubjectType.PRODUCT,
          subjectId: product.id,
          role: MediaReferenceRole.GALLERY,
          isPrimary: false,
          sortOrder: nextSortOrder,
        },
      });

      nextSortOrder += 1;
    }

    if (!product.primaryImageId && attachableAssets.length > 0) {
      const firstAssetId = attachableAssets[0]?.id;

      if (firstAssetId) {
        await tx.mediaReference.updateMany({
          where: {
            subjectType: MediaReferenceSubjectType.PRODUCT,
            subjectId: product.id,
            assetId: firstAssetId,
            archivedAt: null,
          },
          data: {
            isPrimary: true,
            role: MediaReferenceRole.PRIMARY,
          },
        });

        await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            primaryImageId: firstAssetId,
          },
        });
      }
    }
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${product.slug}/edit`);

  return {
    status: "success",
    message: "Les images sélectionnées ont été associées au produit.",
  };
}
