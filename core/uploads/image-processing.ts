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

const ACCEPTED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export function isSupportedImageMimeType(value: string): boolean {
  return ACCEPTED_IMAGE_MIME_TYPES.has(value);
}

export async function processImageToWebp(input: { buffer: Buffer }): Promise<ProcessedImageResult> {
  const pipeline = sharp(input.buffer, { failOn: "error" })
    .rotate()
    .resize({
      width: 2000,
      height: 2000,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 82,
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
