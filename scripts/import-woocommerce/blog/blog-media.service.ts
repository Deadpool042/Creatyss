import type { ImportWooCommerceEnv } from "../env";
import { toNullableText } from "../normalizers/text";
import type { WooImage } from "../schemas";
import type { DbClient } from "../shared/db";
import { logWarn } from "../shared/logging";
import { downloadImage } from "../media/download-image";
import { transformImageToWebp } from "../media/image-transform";
import { findMediaAssetByStorageKey, upsertMediaAsset } from "../media/media-asset.repository";
import { attachBlogPostPrimaryImageReference } from "../media/media-reference.repository";
import {
  buildOriginalFilenameFromUrl,
  buildPublicUrl,
  writeStoredMedia,
} from "../media/media-storage";

export type BlogPrimaryImageImportResult = {
  primaryImageId: string | null;
  importedImages: number;
  reusedImages: number;
  skippedImages: number;
  failedImages: number;
};

export async function importBlogPostPrimaryImage(
  prisma: DbClient,
  input: {
    env: ImportWooCommerceEnv;
    storeId: string;
    blogPostId: string;
    blogPostSlug: string;
    image: WooImage | null;
  }
): Promise<BlogPrimaryImageImportResult> {
  if (!input.image?.src) {
    return {
      primaryImageId: null,
      importedImages: 0,
      reusedImages: 0,
      skippedImages: 1,
      failedImages: 0,
    };
  }

  const storageKey = `imports/wordpress/blog/${input.blogPostSlug}/primary.webp`;

  const existing = await findMediaAssetByStorageKey(prisma, {
    storeId: input.storeId,
    storageKey,
  });

  if (existing) {
    await attachBlogPostPrimaryImageReference(prisma, {
      assetId: existing.id,
      blogPostId: input.blogPostId,
    });

    return {
      primaryImageId: existing.id,
      importedImages: 0,
      reusedImages: 1,
      skippedImages: 0,
      failedImages: 0,
    };
  }

  try {
    const buffer = await downloadImage(input.image.src);
    const transformed = await transformImageToWebp(buffer);

    await writeStoredMedia(input.env, storageKey, transformed.data);

    const mediaAsset = await upsertMediaAsset(prisma, {
      storeId: input.storeId,
      storageKey,
      publicUrl: buildPublicUrl(input.env, storageKey),
      originalFilename: buildOriginalFilenameFromUrl(input.image.src),
      altText: toNullableText(input.image.alt),
      mimeType: transformed.mimeType,
      extension: transformed.extension,
      widthPx: transformed.widthPx,
      heightPx: transformed.heightPx,
      sizeBytes: transformed.sizeBytes,
    });

    await attachBlogPostPrimaryImageReference(prisma, {
      assetId: mediaAsset.id,
      blogPostId: input.blogPostId,
    });

    return {
      primaryImageId: mediaAsset.id,
      importedImages: 1,
      reusedImages: 0,
      skippedImages: 0,
      failedImages: 0,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown blog image import error";
    logWarn(`blog image ${input.blogPostSlug}: ${message}`);

    return {
      primaryImageId: null,
      importedImages: 0,
      reusedImages: 0,
      skippedImages: 0,
      failedImages: 1,
    };
  }
}
