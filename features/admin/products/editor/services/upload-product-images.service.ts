import { unlink } from "node:fs/promises";

import {
  MediaAssetKind,
  MediaAssetStatus,
  MediaReferenceRole,
  MediaReferenceSubjectType,
} from "@/prisma-generated/client";

import { db, withTransaction } from "@/core/db";
import {
  buildProductUploadRelativeDirectory,
  ensureUploadsDirectory,
  saveUploadedImage,
} from "@/core/uploads";
import type { SavedImageResult } from "@/core/uploads";

import { AdminProductEditorServiceError, assertProductExists } from "./shared";

type SavedImageEntry = SavedImageResult & {
  originalFilename: string;
};

type UploadProductImagesServiceInput = {
  productId: string;
  altText: string;
  makePrimary: boolean;
  files: readonly File[];
};

function normalizeOriginalFilename(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : "image";
}

function normalizeBaseName(name: string): string {
  const trimmed = normalizeOriginalFilename(name);
  const base = trimmed.split(/[/\\]/).pop()?.trim() ?? trimmed;
  return base.replace(/\.[^.]+$/, "") || "image";
}

export async function uploadProductImages(
  input: UploadProductImagesServiceInput
): Promise<{ count: number }> {
  // 1. Verify product exists and retrieve slug for upload path construction.
  //    Done outside the transaction so file I/O can use the slug before the tx opens.
  const product = await db.product.findFirst({
    where: { id: input.productId, archivedAt: null },
    select: { id: true, slug: true },
  });

  if (product === null) {
    throw new AdminProductEditorServiceError("product_missing");
  }

  // 2. Ensure the uploads root directory exists.
  await ensureUploadsDirectory();

  // 3. Save each file to disk (webp conversion happens inside saveUploadedImage).
  const relativeDirectory = buildProductUploadRelativeDirectory(product.slug);
  const savedImages: SavedImageEntry[] = [];

  for (const file of input.files) {
    const saved = await saveUploadedImage({
      file,
      relativeDirectory,
      baseName: normalizeBaseName(file.name),
    });
    savedImages.push({ ...saved, originalFilename: normalizeOriginalFilename(file.name) });
  }

  // 4. Persist in a single transaction. On failure, remove the files already saved.
  try {
    return await withTransaction(async (tx) => {
      // Re-assert product existence inside tx for strict consistency.
      await assertProductExists(tx, input.productId);

      // Determine base sortOrder once, then increment per image.
      const lastRef = await tx.mediaReference.findFirst({
        where: {
          subjectId: input.productId,
          subjectType: MediaReferenceSubjectType.PRODUCT,
          archivedAt: null,
        },
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });

      const baseSortOrder = (lastRef?.sortOrder ?? -1) + 1;

      const createdAssetIds: string[] = [];

      const altTextValue = input.altText.length > 0 ? input.altText : null;

      for (const [i, saved] of savedImages.entries()) {
        const asset = await tx.mediaAsset.create({
          data: {
            kind: MediaAssetKind.IMAGE,
            status: MediaAssetStatus.ACTIVE,
            originalFilename: saved.originalFilename,
            mimeType: saved.mimeType,
            extension: "webp",
            storageKey: saved.publicUrl.replace(/^\/+/, ""),
            publicUrl: saved.publicUrl,
            altText: altTextValue,
            widthPx: saved.width > 0 ? saved.width : null,
            heightPx: saved.height > 0 ? saved.height : null,
            sizeBytes: saved.size,
            isPublic: true,
            publishedAt: new Date(),
          },
          select: { id: true },
        });

        await tx.mediaReference.create({
          data: {
            assetId: asset.id,
            subjectType: MediaReferenceSubjectType.PRODUCT,
            subjectId: input.productId,
            role: MediaReferenceRole.GALLERY,
            sortOrder: baseSortOrder + i,
            isPrimary: false,
            isActive: true,
          },
        });

        createdAssetIds.push(asset.id);
      }

      // Set primaryImageId only when explicitly requested and a single image was uploaded.
      if (input.makePrimary && createdAssetIds.length === 1) {
        const primaryImageId = createdAssetIds[0];
        if (primaryImageId !== undefined) {
          await tx.product.update({
            where: { id: input.productId },
            data: { primaryImageId },
          });
        }
      }

      return { count: savedImages.length };
    });
  } catch (error) {
    // 5. Clean up saved files if the transaction failed.
    await Promise.all(savedImages.map((s) => unlink(s.storagePath).catch(() => undefined)));
    throw error;
  }
}
