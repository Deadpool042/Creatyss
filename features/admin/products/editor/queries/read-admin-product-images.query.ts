import { MediaReferenceSubjectType } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { mapAdminProductImageItem } from "@/features/admin/products/editor/mappers";
import type { AdminProductImagesData } from "@/features/admin/products/editor/types";

export async function readAdminProductImages(
  productId: string
): Promise<AdminProductImagesData | null> {
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
    return null;
  }

  const references = await db.mediaReference.findMany({
    where: {
      subjectType: MediaReferenceSubjectType.PRODUCT,
      subjectId: product.id,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      role: true,
      sortOrder: true,
      isPrimary: true,
      asset: {
        select: {
          id: true,
          publicUrl: true,
          altText: true,
        },
      },
    },
  });

  return {
    productId: product.id,
    productSlug: product.slug,
    primaryImageId: product.primaryImageId,
    images: references
      .map(mapAdminProductImageItem)
      .filter((item): item is NonNullable<typeof item> => item !== null),
  };
}
