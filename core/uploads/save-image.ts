//core/uploads/save-image.ts
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { buildImageFilename, buildUploadPublicUrl, buildUploadStoragePath } from "./paths";
import { isSupportedImageMimeType, processImageToWebp } from "./image-processing";

export type SavedImageResult = {
  filename: string;
  storagePath: string;
  publicUrl: string;
  mimeType: "image/webp";
  size: number;
  width: number;
  height: number;
};

export async function saveUploadedImage(input: {
  file: File;
  relativeDirectory: string;
  baseName?: string | null;
}): Promise<SavedImageResult> {
  if (!isSupportedImageMimeType(input.file.type)) {
    throw new Error("Unsupported image type.");
  }

  const arrayBuffer = await input.file.arrayBuffer();
  const sourceBuffer = Buffer.from(arrayBuffer);

  const processedImage = await processImageToWebp({
    buffer: sourceBuffer,
  });

  const filename = buildImageFilename(
    input.baseName !== undefined ? { baseName: input.baseName } : {}
  );

  const storagePath = buildUploadStoragePath({
    relativeDirectory: input.relativeDirectory,
    filename,
  });

  await mkdir(path.dirname(storagePath), { recursive: true });
  await writeFile(storagePath, processedImage.buffer);

  return {
    filename,
    storagePath,
    publicUrl: buildUploadPublicUrl({
      relativeDirectory: input.relativeDirectory,
      filename,
    }),
    mimeType: processedImage.mimeType,
    size: processedImage.size,
    width: processedImage.width,
    height: processedImage.height,
  };
}
