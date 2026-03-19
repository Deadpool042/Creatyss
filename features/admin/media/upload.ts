import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { createAdminMediaAsset, type AdminMediaAsset } from "@/db/admin-media";
import { ensureUploadsDirectory } from "@/lib/uploads";

const MAX_MEDIA_FILE_SIZE_BYTES = 10 * 1024 * 1024;

// Formats accepted as input — anything else is rejected before conversion.
const ALLOWED_INPUT_FORMATS = new Set(["jpeg", "png", "webp"]);

// WebP encoding settings applied to every upload.
const WEBP_OPTIONS: sharp.WebpOptions = {
  quality: 85,
  effort: 4,
};

type UploadAdminMediaInput = {
  adminUserId: string;
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

function normalizeOriginalName(name: string): string {
  const trimmedName = name.trim();
  const basename = trimmedName.split(/[/\\]/).pop()?.trim() ?? "";
  const withoutExt = basename.replace(/\.[^.]+$/, "") || "upload";

  return `${withoutExt}.webp`;
}

function buildStoredRelativePath() {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  return `media/${year}/${month}/${randomUUID()}.webp`;
}

export async function uploadAdminMedia(input: UploadAdminMediaInput): Promise<AdminMediaAsset> {
  if (!isFile(input.file)) {
    throw new MediaUploadError("missing_file", "A media file is required.");
  }

  const inputBuffer = Buffer.from(await input.file.arrayBuffer());

  if (inputBuffer.length === 0) {
    throw new MediaUploadError("empty_file", "The uploaded file is empty.");
  }

  if (inputBuffer.length > MAX_MEDIA_FILE_SIZE_BYTES) {
    throw new MediaUploadError("file_too_large", "The uploaded file exceeds the 10 MB limit.");
  }

  // Detect format and validate before any conversion.
  let metadata: sharp.Metadata;

  try {
    metadata = await sharp(inputBuffer).metadata();
  } catch {
    throw new MediaUploadError(
      "unsupported_file",
      "Only JPEG, PNG, and WebP images are supported."
    );
  }

  if (!metadata.format || !ALLOWED_INPUT_FORMATS.has(metadata.format)) {
    throw new MediaUploadError(
      "unsupported_file",
      "Only JPEG, PNG, and WebP images are supported."
    );
  }

  // Convert to WebP.
  let outputBuffer: Buffer;
  let outputWidth: number | null = null;
  let outputHeight: number | null = null;

  try {
    const result = await sharp(inputBuffer)
      .webp(WEBP_OPTIONS)
      .toBuffer({ resolveWithObject: true });

    outputBuffer = result.data;
    outputWidth = result.info.width ?? null;
    outputHeight = result.info.height ?? null;
  } catch {
    throw new MediaUploadError("unsupported_file", "The image could not be converted to WebP.");
  }

  const relativeFilePath = buildStoredRelativePath();
  const uploadsDirectory = await ensureUploadsDirectory();
  const absoluteFilePath = path.join(uploadsDirectory, relativeFilePath);

  await mkdir(path.dirname(absoluteFilePath), { recursive: true });

  try {
    await writeFile(absoluteFilePath, outputBuffer, { flag: "wx" });
  } catch (error) {
    throw new MediaUploadError(
      "write_failed",
      error instanceof Error ? error.message : "Failed to write media file."
    );
  }

  try {
    return await createAdminMediaAsset({
      byteSize: String(outputBuffer.length),
      filePath: relativeFilePath,
      imageHeight: outputHeight,
      imageWidth: outputWidth,
      mimeType: "image/webp",
      originalName: normalizeOriginalName(input.file.name),
      uploadedByAdminUserId: input.adminUserId,
    });
  } catch (error) {
    await unlink(absoluteFilePath).catch(() => undefined);

    throw new MediaUploadError(
      "database_insert_failed",
      error instanceof Error ? error.message : "Failed to persist media asset metadata."
    );
  }
}
