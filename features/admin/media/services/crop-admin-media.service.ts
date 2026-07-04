import { readFile, unlink, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { MediaAssetKind } from "@/prisma-generated/client";

import { db } from "@/core/db";
import {
  buildImageFilename,
  buildStorageKeyFromPublicUrl,
  cropImageToWebp,
  ensureUploadsDirectory,
  getUploadsDirectory,
  getUploadsPublicPath,
  type NormalizedCropRegion,
} from "@/core/uploads";

type CropAdminMediaInput = {
  assetId: string;
  region: NormalizedCropRegion;
};

export type CropAdminMediaResult = {
  assetId: string;
  publicUrl: string;
  widthPx: number;
  heightPx: number;
};

export class MediaCropError extends Error {
  code: "asset_not_found" | "not_an_image" | "file_unreadable" | "invalid_region" | "write_failed";

  constructor(code: MediaCropError["code"], message: string) {
    super(message);
    this.code = code;
    this.name = "MediaCropError";
  }
}

/**
 * Recadre l'image d'un MediaAsset **in-place** (décision produit 2026-07-04) :
 * l'asset garde son identité (les références produit/catégorie/SEO suivent l'id),
 * seul le fichier change — nouveau nom de fichier pour invalider les caches,
 * ancien fichier supprimé en best effort.
 */
export async function cropAdminMedia(input: CropAdminMediaInput): Promise<CropAdminMediaResult> {
  const asset = await db.mediaAsset.findUnique({
    where: { id: input.assetId },
    select: {
      id: true,
      kind: true,
      storageKey: true,
      originalFilename: true,
    },
  });

  if (asset === null) {
    throw new MediaCropError("asset_not_found", "Media asset not found.");
  }

  if (asset.kind !== MediaAssetKind.IMAGE) {
    throw new MediaCropError("not_an_image", "Only image assets can be cropped.");
  }

  const uploadsDirectory = getUploadsDirectory();
  const sourcePath = path.join(uploadsDirectory, asset.storageKey);

  let sourceBuffer: Buffer;
  try {
    sourceBuffer = await readFile(sourcePath);
  } catch {
    throw new MediaCropError("file_unreadable", "The source image file could not be read.");
  }

  let cropped: Awaited<ReturnType<typeof cropImageToWebp>>;
  try {
    cropped = await cropImageToWebp({ buffer: sourceBuffer, region: input.region });
  } catch {
    throw new MediaCropError("invalid_region", "The crop region could not be applied.");
  }

  await ensureUploadsDirectory();

  const relativeDirectory = path.dirname(asset.storageKey);
  const filename = buildImageFilename({
    baseName: asset.originalFilename.replace(/\.[^.]+$/, ""),
  });
  const targetPath = path.join(uploadsDirectory, relativeDirectory, filename);
  const publicBasePath = getUploadsPublicPath().replace(/\/$/, "");
  const publicUrl = `${publicBasePath}/${path
    .join(relativeDirectory, filename)
    .replaceAll("\\", "/")}`;

  try {
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, cropped.buffer);
  } catch {
    throw new MediaCropError("write_failed", "Failed to write the cropped image file.");
  }

  await db.mediaAsset.update({
    where: { id: asset.id },
    data: {
      storageKey: buildStorageKeyFromPublicUrl(publicUrl),
      publicUrl,
      mimeType: cropped.mimeType,
      extension: cropped.extension,
      widthPx: cropped.width > 0 ? cropped.width : null,
      heightPx: cropped.height > 0 ? cropped.height : null,
      sizeBytes: cropped.size,
    },
  });

  // Suppression best effort de l'ancien fichier — l'asset pointe déjà vers le nouveau.
  if (sourcePath !== targetPath) {
    await unlink(sourcePath).catch(() => undefined);
  }

  return {
    assetId: asset.id,
    publicUrl,
    widthPx: cropped.width,
    heightPx: cropped.height,
  };
}
