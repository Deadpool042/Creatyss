// Consolidated: attach-product-images, delete-product-image, reorder-product-image,
// set-product-primary-image, update-product-image-alt-text, upload-product-images

import { unlink } from "node:fs/promises";

import {
  MediaAssetKind,
  MediaAssetStatus,
  MediaReferenceRole,
  MediaReferenceSubjectType,
} from "@/prisma-generated/client";

import { db, withTransaction } from "@/core/db";
import {
  buildStorageKeyFromPublicUrl,
  buildProductUploadRelativeDirectory,
  ensureUploadsDirectory,
  saveUploadedImage,
  type SavedImageResult,
} from "@/core/uploads";

import {
  AdminProductEditorServiceError,
  assertMediaAssetExists,
  assertProductExists,
  assertVariantExists,
  mapEditorRoleToPrismaRole,
  mapEditorSubjectTypeToPrismaSubjectType,
} from "./shared";

// ---------------------------------------------------------------------------
// attachProductImages
// ---------------------------------------------------------------------------

type AttachProductImageInput = {
  productId: string;
  mediaAssetId: string;
  subjectType: "product" | "product_variant";
  subjectId: string;
  role: "gallery" | "thumbnail" | "other";
  sortOrder: number;
};

type AttachProductImagesServiceInput = {
  images: readonly AttachProductImageInput[];
};

export async function attachProductImages(
  input: AttachProductImagesServiceInput
): Promise<{ count: number }> {
  return withTransaction(async (tx) => {
    for (const image of input.images) {
      await assertProductExists(tx, image.productId);
      await assertMediaAssetExists(tx, image.mediaAssetId);

      if (image.subjectType === "product_variant") {
        await assertVariantExists(tx, image.productId, image.subjectId);
      }
    }

    for (const image of input.images) {
      await tx.mediaReference.create({
        data: {
          assetId: image.mediaAssetId,
          subjectType: mapEditorSubjectTypeToPrismaSubjectType(image.subjectType),
          subjectId: image.subjectId,
          role: mapEditorRoleToPrismaRole(image.role),
          sortOrder: image.sortOrder,
          isPrimary: false,
          isActive: true,
        },
      });
    }

    return {
      count: input.images.length,
    };
  });
}

// ---------------------------------------------------------------------------
// deleteProductImage
// ---------------------------------------------------------------------------

type DeleteProductImageServiceInput = {
  productId: string;
  imageId: string;
};

export async function deleteProductImage(
  input: DeleteProductImageServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    const product = await assertProductExists(tx, input.productId);

    const image = await tx.mediaReference.findFirst({
      where: {
        id: input.imageId,
        archivedAt: null,
      },
      select: {
        id: true,
        assetId: true,
      },
    });

    if (image === null) {
      throw new AdminProductEditorServiceError("image_missing");
    }

    const archived = await tx.mediaReference.update({
      where: {
        id: input.imageId,
      },
      data: {
        archivedAt: new Date(),
        isActive: false,
      },
      select: {
        id: true,
      },
    });

    if (product.primaryImageId === image.assetId) {
      await tx.product.update({
        where: { id: input.productId },
        data: { primaryImageId: null },
      });
    }

    return archived;
  });
}

// ---------------------------------------------------------------------------
// reorderProductImage
// ---------------------------------------------------------------------------

type ReorderProductImageServiceInput = {
  productId: string;
  imageId: string;
  sortOrder: number;
};

export async function reorderProductImage(
  input: ReorderProductImageServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    const image = await tx.mediaReference.findFirst({
      where: {
        id: input.imageId,
        archivedAt: null,
        OR: [
          {
            subjectType: "PRODUCT",
            subjectId: input.productId,
          },
          {
            subjectType: "PRODUCT_VARIANT",
            subjectId: {
              in: (
                await tx.productVariant.findMany({
                  where: {
                    productId: input.productId,
                    archivedAt: null,
                  },
                  select: {
                    id: true,
                  },
                })
              ).map((variant) => variant.id),
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (image === null) {
      throw new AdminProductEditorServiceError("image_missing");
    }

    return tx.mediaReference.update({
      where: {
        id: input.imageId,
      },
      data: {
        sortOrder: input.sortOrder,
      },
      select: {
        id: true,
      },
    });
  });
}

// ---------------------------------------------------------------------------
// setProductPrimaryImage
// ---------------------------------------------------------------------------

type SetProductPrimaryImageServiceInput = {
  productId: string;
  mediaAssetId: string | null;
};

export async function setProductPrimaryImage(
  input: SetProductPrimaryImageServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    if (input.mediaAssetId !== null) {
      await assertMediaAssetExists(tx, input.mediaAssetId);
    }

    return tx.product.update({
      where: {
        id: input.productId,
      },
      data: {
        primaryImageId: input.mediaAssetId,
      },
      select: {
        id: true,
      },
    });
  });
}

// ---------------------------------------------------------------------------
// updateProductImageAltText
// ---------------------------------------------------------------------------

type UpdateProductImageAltTextServiceInput = {
  productId: string;
  imageId: string;
  altText: string;
};

export async function updateProductImageAltText(
  input: UpdateProductImageAltTextServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    const image = await tx.mediaReference.findFirst({
      where: {
        id: input.imageId,
        archivedAt: null,
      },
      select: {
        id: true,
        assetId: true,
      },
    });

    if (image === null) {
      throw new AdminProductEditorServiceError("image_missing");
    }

    await tx.mediaAsset.update({
      where: { id: image.assetId },
      data: { altText: input.altText || null },
    });

    return { id: image.id };
  });
}

// ---------------------------------------------------------------------------
// uploadProductImages
// ---------------------------------------------------------------------------

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
            storageKey: buildStorageKeyFromPublicUrl(saved.publicUrl),
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
