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

type PersistedMediaAssetResult = {
  assetId: string;
  imported: boolean;
};

async function persistImageAsMediaAsset(
  prisma: DbClient,
  input: {
    env: ImportWooCommerceEnv;
    storeId: string;
    storageKey: string;
    image: WooImage;
  }
): Promise<PersistedMediaAssetResult> {
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
    imported: true,
  };
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
): Promise<{ primaryImageId: string | null; importedImages: number }> {
  if (!input.image?.src) {
    return {
      primaryImageId: null,
      importedImages: 0,
    };
  }

  const storageKey = `imports/woocommerce/categories/${input.categorySlug}/primary.webp`;

  const mediaAsset = await persistImageAsMediaAsset(prisma, {
    env: input.env,
    storeId: input.storeId,
    storageKey,
    image: input.image,
  });

  await attachCategoryPrimaryImageReference(prisma, {
    assetId: mediaAsset.assetId,
    categoryId: input.categoryId,
  });

  return {
    primaryImageId: mediaAsset.assetId,
    importedImages: mediaAsset.imported ? 1 : 0,
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
): Promise<{ primaryImageId: string | null; importedImages: number }> {
  let primaryImageId: string | null = null;
  let importedImages = 0;

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

    importedImages += mediaAsset.imported ? 1 : 0;

    if (index === 0) {
      await attachProductPrimaryImageReference(prisma, {
        assetId: mediaAsset.assetId,
        productId: input.productId,
      });

      primaryImageId = mediaAsset.assetId;
      continue;
    }

    await attachProductGalleryImageReference(prisma, {
      assetId: mediaAsset.assetId,
      productId: input.productId,
      sortOrder: index,
    });
  }

  return {
    primaryImageId,
    importedImages,
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
): Promise<{ primaryImageId: string | null; importedImages: number }> {
  if (!input.image?.src) {
    return {
      primaryImageId: null,
      importedImages: 0,
    };
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
    assetId: mediaAsset.assetId,
    variantId: input.variantId,
    sortOrder: input.sortOrder,
  });

  return {
    primaryImageId: mediaAsset.assetId,
    importedImages: mediaAsset.imported ? 1 : 0,
  };
}
