import { toNullableText } from "../normalizers/text";
import type { WooImage } from "../schemas";
import type { DbClient } from "../shared/db";
import type { ImportWooCommerceEnv } from "../env";
import { downloadImage } from "./download-image";
import { transformImageToWebp } from "./image-transform";
import {
  buildOriginalFilenameFromUrl,
  buildProductImageStorageKey,
  buildPublicUrl,
  buildVariantImageStorageKey,
  writeStoredMedia,
} from "./media-storage";
import { upsertMediaAsset } from "./media-asset.repository";
import {
  attachCategoryPrimaryImageReference,
  attachProductGalleryImageReference,
  attachProductPrimaryImageReference,
  attachVariantPrimaryImageReference,
} from "./media-reference.repository";

async function persistImageAsMediaAsset(
  prisma: DbClient,
  input: {
    env: ImportWooCommerceEnv;
    storeId: string;
    storageKey: string;
    image: WooImage;
  }
) {
  const buffer = await downloadImage(input.image.src);
  const transformed = await transformImageToWebp(buffer);

  await writeStoredMedia(input.env, input.storageKey, transformed.data);

  return upsertMediaAsset(prisma, {
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
): Promise<string | null> {
  if (!input.image?.src) {
    return null;
  }

  const storageKey = `imports/woocommerce/categories/${input.categorySlug}/primary.webp`;

  const mediaAsset = await persistImageAsMediaAsset(prisma, {
    env: input.env,
    storeId: input.storeId,
    storageKey,
    image: input.image,
  });

  await attachCategoryPrimaryImageReference(prisma, {
    assetId: mediaAsset.id,
    categoryId: input.categoryId,
  });

  return mediaAsset.id;
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
): Promise<string | null> {
  let primaryImageId: string | null = null;

  for (const [index, image] of input.images.entries()) {
    if (!image.src) {
      continue;
    }

    const storageKey = buildProductImageStorageKey(input.productSlug, index);

    const mediaAsset = await persistImageAsMediaAsset(prisma, {
      env: input.env,
      storeId: input.storeId,
      storageKey,
      image,
    });

    if (index === 0) {
      await attachProductPrimaryImageReference(prisma, {
        assetId: mediaAsset.id,
        productId: input.productId,
      });

      primaryImageId = mediaAsset.id;
      continue;
    }

    await attachProductGalleryImageReference(prisma, {
      assetId: mediaAsset.id,
      productId: input.productId,
      sortOrder: index,
    });
  }

  return primaryImageId;
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
): Promise<string | null> {
  if (!input.image?.src) {
    return null;
  }

  const storageKey = buildVariantImageStorageKey(
    input.productSlug,
    input.image.id ?? null,
    input.sortOrder
  );

  const mediaAsset = await persistImageAsMediaAsset(prisma, {
    env: input.env,
    storeId: input.storeId,
    storageKey,
    image: input.image,
  });

  await attachVariantPrimaryImageReference(prisma, {
    assetId: mediaAsset.id,
    variantId: input.variantId,
    sortOrder: input.sortOrder,
  });

  return mediaAsset.id;
}
