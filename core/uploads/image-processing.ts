//core/uploads/image-processing.ts
import sharp from "sharp";

export type ProcessedImageResult = {
  buffer: Buffer;
  width: number;
  height: number;
  mimeType: "image/webp";
  extension: "webp";
  size: number;
};

export const MAX_IMAGE_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const IMAGE_MAX_DIMENSION_PX = 2000;
export const IMAGE_WEBP_QUALITY = 82;
export const IMAGE_OUTPUT_FORMAT = "WebP" as const;

export const ACCEPTED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export function isSupportedImageMimeType(value: string): boolean {
  return ACCEPTED_IMAGE_MIME_TYPES.has(value);
}

export type NormalizedCropRegion = {
  /** Fractions de l'image source, dans [0,1]. */
  x: number;
  y: number;
  width: number;
  height: number;
};

function isValidCropRegion(region: NormalizedCropRegion): boolean {
  return (
    region.x >= 0 &&
    region.y >= 0 &&
    region.width > 0 &&
    region.height > 0 &&
    region.x + region.width <= 1.0001 &&
    region.y + region.height <= 1.0001
  );
}

/**
 * Recadre puis repasse par le pipeline WebP commun (mêmes limites/qualité que l'upload).
 * La région est exprimée en fractions de l'image source pour être indépendante de la
 * résolution affichée côté client.
 */
export async function cropImageToWebp(input: {
  buffer: Buffer;
  region: NormalizedCropRegion;
}): Promise<ProcessedImageResult> {
  if (!isValidCropRegion(input.region)) {
    throw new Error("Invalid crop region.");
  }

  const source = sharp(input.buffer, { failOn: "error" }).rotate();
  const metadata = await source.metadata();
  const sourceWidth = metadata.width ?? 0;
  const sourceHeight = metadata.height ?? 0;

  if (sourceWidth <= 0 || sourceHeight <= 0) {
    throw new Error("Unable to read source image dimensions.");
  }

  const left = Math.round(input.region.x * sourceWidth);
  const top = Math.round(input.region.y * sourceHeight);
  const width = Math.max(1, Math.min(Math.round(input.region.width * sourceWidth), sourceWidth - left));
  const height = Math.max(1, Math.min(Math.round(input.region.height * sourceHeight), sourceHeight - top));

  const croppedBuffer = await source.extract({ left, top, width, height }).toBuffer();

  return processImageToWebp({ buffer: croppedBuffer });
}

export async function processImageToWebp(input: { buffer: Buffer }): Promise<ProcessedImageResult> {
  const pipeline = sharp(input.buffer, { failOn: "error" })
    .rotate()
    .resize({
      width: IMAGE_MAX_DIMENSION_PX,
      height: IMAGE_MAX_DIMENSION_PX,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: IMAGE_WEBP_QUALITY,
      effort: 4,
    });

  const metadata = await pipeline.metadata();
  const outputBuffer = await pipeline.toBuffer();

  return {
    buffer: outputBuffer,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    mimeType: "image/webp",
    extension: "webp",
    size: outputBuffer.byteLength,
  };
}
