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
