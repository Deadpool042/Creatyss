import { MediaAssetKind, MediaAssetStatus } from "../../../src/generated/prisma/client";
import type { DbClient } from "../shared/db";

export async function findMediaAssetByStorageKey(
  prisma: DbClient,
  input: {
    storeId: string;
    storageKey: string;
  }
) {
  return prisma.mediaAsset.findFirst({
    where: {
      storeId: input.storeId,
      storageKey: input.storageKey,
    },
    select: {
      id: true,
      storageKey: true,
      publicUrl: true,
    },
  });
}

export async function upsertMediaAsset(
  prisma: DbClient,
  input: {
    storeId: string;
    storageKey: string;
    publicUrl: string;
    originalFilename: string;
    altText: string | null;
    mimeType: string;
    extension: string | null;
    widthPx: number | null;
    heightPx: number | null;
    sizeBytes: number;
  }
) {
  const existing = await prisma.mediaAsset.findFirst({
    where: {
      storeId: input.storeId,
      storageKey: input.storageKey,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return prisma.mediaAsset.update({
      where: {
        id: existing.id,
      },
      data: {
        kind: MediaAssetKind.IMAGE,
        status: MediaAssetStatus.ACTIVE,
        originalFilename: input.originalFilename,
        mimeType: input.mimeType,
        extension: input.extension,
        altText: input.altText,
        storageKey: input.storageKey,
        publicUrl: input.publicUrl,
        widthPx: input.widthPx,
        heightPx: input.heightPx,
        sizeBytes: input.sizeBytes,
        isPublic: true,
        publishedAt: new Date(),
      },
      select: {
        id: true,
      },
    });
  }

  return prisma.mediaAsset.create({
    data: {
      storeId: input.storeId,
      kind: MediaAssetKind.IMAGE,
      status: MediaAssetStatus.ACTIVE,
      originalFilename: input.originalFilename,
      mimeType: input.mimeType,
      extension: input.extension,
      altText: input.altText,
      storageKey: input.storageKey,
      publicUrl: input.publicUrl,
      widthPx: input.widthPx,
      heightPx: input.heightPx,
      sizeBytes: input.sizeBytes,
      isPublic: true,
      publishedAt: new Date(),
    },
    select: {
      id: true,
    },
  });
}

export async function deleteUnreferencedImportedMediaAssets(
  prisma: DbClient,
  input: {
    storeId: string;
  }
) {
  const orphanedAssets = await prisma.mediaAsset.findMany({
    where: {
      storeId: input.storeId,
      OR: [
        {
          storageKey: {
            startsWith: "imports/woocommerce",
          },
        },
        {
          storageKey: {
            startsWith: "imports/wordpress/blog",
          },
        },
      ],
      references: {
        none: {},
      },
    },
    select: {
      id: true,
    },
  });

  if (orphanedAssets.length === 0) {
    return { count: 0 };
  }

  interface OrphanedAsset {
    id: string;
  }

  const orphanedIds: string[] = (orphanedAssets as OrphanedAsset[]).map((asset) => asset.id);

  const deleted = await prisma.mediaAsset.deleteMany({
    where: {
      id: {
        in: orphanedIds,
      },
    },
  });

  return {
    count: deleted.count,
  };
}
