import {
  MediaAssetKind,
  MediaAssetStatus,
  MediaReferenceSubjectType,
} from "@/prisma-generated/client";

import { db } from "@/core/db";
import { mapAttachableMediaAsset } from "@/features/admin/products/editor/mappers/map-attachable-media-asset";
import type { AttachableMediaAssetsData } from "@/features/admin/products/editor/types/product-image-library.types";

const DEFAULT_LIMIT = 48;

export async function listAttachableMediaAssets(
  productId: string,
  limit = DEFAULT_LIMIT
): Promise<AttachableMediaAssetsData | null> {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
    },
  });

  if (!product) {
    return null;
  }

  const assets = await db.mediaAsset.findMany({
    where: {
      kind: MediaAssetKind.IMAGE,
      status: MediaAssetStatus.ACTIVE,
      publicUrl: {
        not: null,
      },
      NOT: {
        references: {
          some: {
            subjectType: MediaReferenceSubjectType.PRODUCT,
            subjectId: product.id,
            archivedAt: null,
          },
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
    take: limit,
    select: {
      id: true,
      publicUrl: true,
      altText: true,
      originalFilename: true,
      createdAt: true,
    },
  });

  return {
    productId: product.id,
    items: assets
      .map(mapAttachableMediaAsset)
      .filter((item): item is NonNullable<typeof item> => item !== null),
  };
}
