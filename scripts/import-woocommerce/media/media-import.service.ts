import type { ImportWooCommerceEnv } from "../env";
import { toNullableText } from "../normalizers/text";
import type { WooImage } from "../schemas";
import type { DbClient } from "../shared/db";
import { logWarn } from "../shared/logging";
import { downloadImage } from "./download-image";
import { transformImageToWebp } from "./image-transform";
import { upsertMediaAsset } from "./media-asset.repository";
import {
  attachCategoryPrimaryImageReference,
  attachProductGalleryImageReference,
  attachProductPrimaryImageReference,
  attachVariantPrimaryImageReference,
} from "./media-reference.repository";
import {
  buildOriginalFilenameFromUrl,
  buildProductImageStorageKey,
  buildPublicUrl,
  buildVariantImageStorageKey,
  writeStoredMedia,
} from "./media-storage";

type MediaImportSummary = {
  importedImages: number;
  skippedImages: number;
  failedImages: number;
};

type PersistedMediaAssetResult = MediaImportSummary & {
  assetId: string | null;
};

type PrimaryImageImportResult = MediaImportSummary & {
  primaryImageId: string | null;
};

function createEmptyMediaSummary(): MediaImportSummary {
  return {
    importedImages: 0,
    skippedImages: 0,
    failedImages: 0,
  };
}

function mergeMediaSummary(base: MediaImportSummary, next: MediaImportSummary): MediaImportSummary {
  return {
    importedImages: base.importedImages + next.importedImages,
    skippedImages: base.skippedImages + next.skippedImages,
    failedImages: base.failedImages + next.failedImages,
  };
}

async function persistImageAsMediaAsset(
  prisma: DbClient,
  input: {
    env: ImportWooCommerceEnv;
    storeId: string;
    storageKey: string;
    image: WooImage | null;
    contextLabel: string;
  }
): Promise<PersistedMediaAssetResult> {
  if (!input.image?.src) {
    return {
      assetId: null,
      importedImages: 0,
      skippedImages: 1,
      failedImages: 0,
    };
  }

  try {
    const buffer = await downloadImage(input.image.src);
    const transformed = await transformImageToWebp(buffer);

    await writeStoredMedia(input.env, input.storageKey, transformed.data);

    const mediaAsset = await upsertMediaAsset(prisma, {
      storeId: input.storeId,
      storageKey: input.storageKey,
      publicUrl: buildPublicUrl(input.env, input.storageKey),
      originalFilename: buildOriginalFilenameFromUrl(input.image.src),
      altText: toNullableText(input.image.alt),
      mimeType: transformed.mimeType,
      extension: transformed.extension,
      widthPx: transformed.widthPx,
      heightPx: transformed.heightPx,
      sizeBytes: transformed.sizeBytes,
    });

    return {
      assetId: mediaAsset.id,
      importedImages: 1,
      skippedImages: 0,
      failedImages: 0,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown image import error";
    logWarn(`${input.contextLabel}: ${message}`);

    return {
      assetId: null,
      importedImages: 0,
      skippedImages: 0,
      failedImages: 1,
    };
  }
}

export async function importCategoryPrimaryImage(
  prisma: DbClient,
  input: {
    env: ImportWooCommerceEnv;
    storeId: string;
    categoryId: string;
    categorySlug: string;
    image: WooImage | null;
  }
): Promise<PrimaryImageImportResult> {
  const result = await persistImageAsMediaAsset(prisma, {
    env: input.env,
    storeId: input.storeId,
    storageKey: `imports/woocommerce/categories/${input.categorySlug}/primary.webp`,
    image: input.image,
    contextLabel: `category image ${input.categorySlug}`,
  });

  if (result.assetId !== null) {
    await attachCategoryPrimaryImageReference(prisma, {
      assetId: result.assetId,
      categoryId: input.categoryId,
    });
  }

  return {
    primaryImageId: result.assetId,
    importedImages: result.importedImages,
    skippedImages: result.skippedImages,
    failedImages: result.failedImages,
  };
}

export async function importProductImages(
  prisma: DbClient,
  input: {
    env: ImportWooCommerceEnv;
    storeId: string;
    productId: string;
    productSlug: string;
    images: readonly WooImage[];
  }
): Promise<PrimaryImageImportResult> {
  let primaryImageId: string | null = null;
  let summary = createEmptyMediaSummary();

  if (input.images.length === 0) {
    return {
      primaryImageId: null,
      importedImages: 0,
      skippedImages: 1,
      failedImages: 0,
    };
  }

  for (const [index, image] of input.images.entries()) {
    const result = await persistImageAsMediaAsset(prisma, {
      env: input.env,
      storeId: input.storeId,
      storageKey: buildProductImageStorageKey(input.productSlug, index),
      image,
      contextLabel: `product image ${input.productSlug}#${index + 1}`,
    });

    summary = mergeMediaSummary(summary, result);

    if (result.assetId === null) {
      continue;
    }

    if (index === 0) {
      await attachProductPrimaryImageReference(prisma, {
        assetId: result.assetId,
        productId: input.productId,
      });

      primaryImageId = result.assetId;
      continue;
    }

    await attachProductGalleryImageReference(prisma, {
      assetId: result.assetId,
      productId: input.productId,
      sortOrder: index,
    });
  }

  return {
    primaryImageId,
    importedImages: summary.importedImages,
    skippedImages: summary.skippedImages,
    failedImages: summary.failedImages,
  };
}

export async function importVariantPrimaryImage(
  prisma: DbClient,
  input: {
    env: ImportWooCommerceEnv;
    storeId: string;
    variantId: string;
    productSlug: string;
    image: WooImage | null;
    sortOrder: number;
  }
): Promise<PrimaryImageImportResult> {
  const result = await persistImageAsMediaAsset(prisma, {
    env: input.env,
    storeId: input.storeId,
    storageKey: buildVariantImageStorageKey(
      input.productSlug,
      input.image?.id ?? null,
      input.sortOrder
    ),
    image: input.image,
    contextLabel: `variant image ${input.productSlug}#${input.sortOrder + 1}`,
  });

  if (result.assetId !== null) {
    await attachVariantPrimaryImageReference(prisma, {
      assetId: result.assetId,
      variantId: input.variantId,
      sortOrder: input.sortOrder,
    });
  }

  return {
    primaryImageId: result.assetId,
    importedImages: result.importedImages,
    skippedImages: result.skippedImages,
    failedImages: result.failedImages,
  };
}
