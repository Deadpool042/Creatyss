import { MediaReferenceSubjectType } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { mapProductEditorData } from "../mappers/map-product-editor-data";
import type { AdminProductEditorData } from "../types/product-editor.types";

export async function readAdminProductEditorBySlug(
  slug: string
): Promise<AdminProductEditorData | null> {
  const normalizedSlug = slug.trim();

  if (normalizedSlug.length === 0) {
    return null;
  }

  const product = await db.product.findFirst({
    where: {
      slug: normalizedSlug,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      shortDescription: true,
      description: true,
      status: true,
      isFeatured: true,
      primaryImageId: true,
      productCategories: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          isPrimary: true,
          sortOrder: true,
          category: {
            select: {
              id: true,
              slug: true,
              name: true,
            },
          },
        },
      },
      variants: {
        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
        select: {
          id: true,
          slug: true,
          name: true,
          sku: true,
          status: true,
          primaryImage: {
            select: {
              publicUrl: true,
              altText: true,
            },
          },
          prices: {
            where: {
              isActive: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              amount: true,
              compareAtAmount: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  const mediaReferences = await db.mediaReference.findMany({
    where: {
      subjectType: MediaReferenceSubjectType.PRODUCT,
      subjectId: product.id,
    },
    orderBy: {
      sortOrder: "asc",
    },
    select: {
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

  return mapProductEditorData({
    product,
    mediaReferences,
  });
}
