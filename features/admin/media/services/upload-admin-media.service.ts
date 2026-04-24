import { unlink } from "node:fs/promises";

import { MediaAssetKind, MediaAssetStatus } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { buildStorageKeyFromPublicUrl, ensureUploadsDirectory, saveUploadedImage } from "@/core/uploads";
import { buildAdminMediaUploadRelativeDirectory } from "@/features/admin/media/helpers/build-admin-media-upload-relative-directory";
import { mapAdminMediaListItem } from "@/features/admin/media/mappers/map-admin-media-list-item";
import type { AdminMediaListItem } from "@/features/admin/media/types/admin-media-list-item.types";

const MAX_MEDIA_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MEDIA_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type UploadAdminMediaInput = {
  file: FormDataEntryValue | null;
};

export class MediaUploadError extends Error {
  code:
    | "database_insert_failed"
    | "empty_file"
    | "missing_file"
    | "unsupported_file"
    | "write_failed"
    | "file_too_large";

  constructor(code: MediaUploadError["code"], message: string) {
    super(message);
    this.code = code;
    this.name = "MediaUploadError";
  }
}

function isFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function normalizeOriginalFilename(name: string): string {
  const trimmedName = name.trim();
  return trimmedName.length > 0 ? trimmedName : "image";
}

function normalizeUploadBaseName(name: string): string {
  const trimmedName = normalizeOriginalFilename(name);
  const baseName = trimmedName.split(/[/\\]/).pop()?.trim() ?? trimmedName;

  return baseName.replace(/\.[^.]+$/, "") || "image";
}

function getUploadErrorCode(error: unknown): "unsupported_file" | "write_failed" {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  ) {
    return "write_failed";
  }

  return "unsupported_file";
}

export async function uploadAdminMedia(
  input: UploadAdminMediaInput
): Promise<AdminMediaListItem> {
  if (!isFile(input.file)) {
    throw new MediaUploadError("missing_file", "A media file is required.");
  }

  if (input.file.size <= 0) {
    throw new MediaUploadError("empty_file", "The uploaded file is empty.");
  }

  if (input.file.size > MAX_MEDIA_FILE_SIZE_BYTES) {
    throw new MediaUploadError("file_too_large", "The uploaded file exceeds the 10 MB limit.");
  }

  if (!ALLOWED_MEDIA_MIME_TYPES.has(input.file.type)) {
    throw new MediaUploadError(
      "unsupported_file",
      "Only JPEG, PNG, and WebP images are supported."
    );
  }

  await ensureUploadsDirectory();

  let savedImage: Awaited<ReturnType<typeof saveUploadedImage>>;

  try {
    savedImage = await saveUploadedImage({
      file: input.file,
      relativeDirectory: buildAdminMediaUploadRelativeDirectory(),
      baseName: normalizeUploadBaseName(input.file.name),
    });
  } catch (error) {
    const code = getUploadErrorCode(error);

    throw new MediaUploadError(
      code,
      error instanceof Error
        ? error.message
        : code === "unsupported_file"
          ? "The uploaded file could not be processed as an image."
          : "Failed to write media file."
    );
  }

  try {
    const asset = await db.mediaAsset.create({
      data: {
        kind: MediaAssetKind.IMAGE,
        status: MediaAssetStatus.ACTIVE,
        originalFilename: normalizeOriginalFilename(input.file.name),
        mimeType: savedImage.mimeType,
        extension: "webp",
        storageKey: buildStorageKeyFromPublicUrl(savedImage.publicUrl),
        publicUrl: savedImage.publicUrl,
        widthPx: savedImage.width > 0 ? savedImage.width : null,
        heightPx: savedImage.height > 0 ? savedImage.height : null,
        sizeBytes: savedImage.size,
        isPublic: true,
        publishedAt: new Date(),
      },
      select: {
        id: true,
        originalFilename: true,
        storageKey: true,
        publicUrl: true,
        mimeType: true,
        createdAt: true,
        sizeBytes: true,
        widthPx: true,
        heightPx: true,
      },
    });

    return mapAdminMediaListItem(asset);
  } catch (error) {
    await unlink(savedImage.storagePath).catch(() => undefined);

    throw new MediaUploadError(
      "database_insert_failed",
      error instanceof Error ? error.message : "Failed to persist media asset metadata."
    );
  }
}
