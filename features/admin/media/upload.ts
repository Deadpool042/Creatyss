import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { createAdminMediaAsset, type AdminMediaAsset } from "@/db/admin-media";
import { ensureUploadsDirectory } from "@/lib/uploads";

const MAX_MEDIA_FILE_SIZE_BYTES = 10 * 1024 * 1024;

type SupportedMimeType = "image/jpeg" | "image/png" | "image/webp";

type DetectedImageMetadata = {
  extension: "jpg" | "png" | "webp";
  imageHeight: number | null;
  imageWidth: number | null;
  mimeType: SupportedMimeType;
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

  return basename.length > 0 ? basename : "upload";
}

function isPng(buffer: Buffer): boolean {
  return (
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
}

function readPngDimensions(buffer: Buffer) {
  if (
    buffer.length < 24 ||
    buffer.toString("ascii", 12, 16) !== "IHDR"
  ) {
    return null;
  }

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);

  if (width === 0 || height === 0) {
    return null;
  }

  return { width, height };
}

function isJpeg(buffer: Buffer): boolean {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  );
}

function isJpegSofMarker(marker: number): boolean {
  return (
    marker >= 0xc0 &&
    marker <= 0xcf &&
    marker !== 0xc4 &&
    marker !== 0xc8 &&
    marker !== 0xcc
  );
}

function readJpegDimensions(buffer: Buffer) {
  if (!isJpeg(buffer)) {
    return null;
  }

  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      return null;
    }

    while (buffer[offset] === 0xff) {
      offset += 1;
    }

    if (offset >= buffer.length) {
      return null;
    }

    const marker = buffer[offset];

    if (marker === undefined) {
      return null;
    }

    offset += 1;

    if (marker === 0xd9 || marker === 0xda) {
      return null;
    }

    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      continue;
    }

    if (offset + 1 >= buffer.length) {
      return null;
    }

    const segmentLength = buffer.readUInt16BE(offset);

    if (segmentLength < 2 || offset + segmentLength > buffer.length) {
      return null;
    }

    if (isJpegSofMarker(marker)) {
      if (segmentLength < 7) {
        return null;
      }

      const height = buffer.readUInt16BE(offset + 3);
      const width = buffer.readUInt16BE(offset + 5);

      if (width === 0 || height === 0) {
        return null;
      }

      return { width, height };
    }

    offset += segmentLength;
  }

  return null;
}

function isWebp(buffer: Buffer): boolean {
  return (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  );
}

function detectImageMetadata(buffer: Buffer): DetectedImageMetadata | null {
  if (isPng(buffer)) {
    const dimensions = readPngDimensions(buffer);

    if (dimensions === null) {
      return null;
    }

    return {
      extension: "png",
      imageHeight: dimensions.height,
      imageWidth: dimensions.width,
      mimeType: "image/png"
    };
  }

  if (isJpeg(buffer)) {
    const dimensions = readJpegDimensions(buffer);

    if (dimensions === null) {
      return null;
    }

    return {
      extension: "jpg",
      imageHeight: dimensions.height,
      imageWidth: dimensions.width,
      mimeType: "image/jpeg"
    };
  }

  if (isWebp(buffer)) {
    return {
      extension: "webp",
      imageHeight: null,
      imageWidth: null,
      mimeType: "image/webp"
    };
  }

  return null;
}

function buildStoredRelativePath(extension: DetectedImageMetadata["extension"]) {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  return `media/${year}/${month}/${randomUUID()}.${extension}`;
}

export async function uploadAdminMedia(
  input: UploadAdminMediaInput
): Promise<AdminMediaAsset> {
  if (!isFile(input.file)) {
    throw new MediaUploadError("missing_file", "A media file is required.");
  }

  const fileBuffer = Buffer.from(await input.file.arrayBuffer());

  if (fileBuffer.length === 0) {
    throw new MediaUploadError("empty_file", "The uploaded file is empty.");
  }

  if (fileBuffer.length > MAX_MEDIA_FILE_SIZE_BYTES) {
    throw new MediaUploadError(
      "file_too_large",
      "The uploaded file exceeds the 10 MB limit."
    );
  }

  const detectedImage = detectImageMetadata(fileBuffer);

  if (detectedImage === null) {
    throw new MediaUploadError(
      "unsupported_file",
      "Only JPEG, PNG, and WebP images are supported."
    );
  }

  const relativeFilePath = buildStoredRelativePath(detectedImage.extension);
  const uploadsDirectory = await ensureUploadsDirectory();
  const absoluteFilePath = path.join(uploadsDirectory, relativeFilePath);

  await mkdir(path.dirname(absoluteFilePath), { recursive: true });

  try {
    await writeFile(absoluteFilePath, fileBuffer, { flag: "wx" });
  } catch (error) {
    throw new MediaUploadError(
      "write_failed",
      error instanceof Error ? error.message : "Failed to write media file."
    );
  }

  try {
    return await createAdminMediaAsset({
      byteSize: String(fileBuffer.length),
      filePath: relativeFilePath,
      imageHeight: detectedImage.imageHeight,
      imageWidth: detectedImage.imageWidth,
      mimeType: detectedImage.mimeType,
      originalName: normalizeOriginalName(input.file.name),
      uploadedByAdminUserId: input.adminUserId
    });
  } catch (error) {
    await unlink(absoluteFilePath).catch(() => undefined);

    throw new MediaUploadError(
      "database_insert_failed",
      error instanceof Error
        ? error.message
        : "Failed to persist media asset metadata."
    );
  }
}
