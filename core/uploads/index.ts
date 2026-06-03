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
export { isSupportedImageMimeType, processImageToWebp } from "./image-processing";
export { saveUploadedImage } from "./save-image";
export type { SavedImageResult } from "./save-image";
