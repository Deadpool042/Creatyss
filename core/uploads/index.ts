//core/uploads/index.ts
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { serverEnv } from "@/core/config/env/server";

export async function ensureUploadsDirectory() {
  const directory = getUploadsDirectory();

  await mkdir(directory, { recursive: true });

  return directory;
}

export function getUploadsDirectory() {
  return path.resolve(process.cwd(), serverEnv.uploadsDir);
}

export function getUploadsPublicPath() {
  return `/${serverEnv.uploadsDir.replace(/^public\//, "").replaceAll("\\", "/")}`;
}

export {
  buildImageFilename,
  buildProductUploadRelativeDirectory,
  buildStorageKeyFromPublicUrl,
} from "./paths";
export { isSupportedImageMimeType, processImageToWebp } from "./image-processing";
export { saveUploadedImage } from "./save-image";
export type { SavedImageResult } from "./save-image";
