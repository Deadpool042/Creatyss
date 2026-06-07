//core/uploads/index.ts
import "server-only";

import { mkdir } from "node:fs/promises";

import { getUploadsDirectory } from "./runtime";

export { getUploadsDirectory, getUploadsPublicPath } from "./runtime";

export async function ensureUploadsDirectory() {
  const directory = getUploadsDirectory();

  await mkdir(directory, { recursive: true });

  return directory;
}

export {
  buildImageFilename,
  buildProductUploadRelativeDirectory,
  buildStorageKeyFromPublicUrl,
} from "./paths";
export {
  ACCEPTED_IMAGE_MIME_TYPES,
  IMAGE_MAX_DIMENSION_PX,
  IMAGE_OUTPUT_FORMAT,
  IMAGE_WEBP_QUALITY,
  isSupportedImageMimeType,
  MAX_IMAGE_FILE_SIZE_BYTES,
  processImageToWebp,
} from "./image-processing";
export { saveUploadedImage } from "./save-image";
export type { SavedImageResult } from "./save-image";
