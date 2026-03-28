import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { WOOCOMMERCE_MEDIA_ROOT } from "../constants";
import type { ImportWooCommerceEnv } from "../env";

function stripExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

export function buildProductImageStorageKey(productSlug: string, index: number): string {
  return `${WOOCOMMERCE_MEDIA_ROOT}/products/${productSlug}/${String(index + 1).padStart(2, "0")}.webp`;
}

export function buildVariantImageStorageKey(
  productSlug: string,
  imageId: number | null,
  sortOrder: number
): string {
  const suffix = imageId && imageId > 0 ? String(imageId) : String(sortOrder + 1).padStart(2, "0");

  return `${WOOCOMMERCE_MEDIA_ROOT}/products/${productSlug}/variants/${suffix}.webp`;
}

export function buildOriginalFilenameFromUrl(imageUrl: string): string {
  return `${stripExtension(path.basename(imageUrl))}.webp`;
}

export function buildPublicUrl(env: ImportWooCommerceEnv, storageKey: string): string {
  const uploadsPrefix = env.uploadsDir.replace(/^public\//, "");
  return `/${uploadsPrefix}/${storageKey}`;
}

export async function writeStoredMedia(
  env: ImportWooCommerceEnv,
  storageKey: string,
  data: Buffer
): Promise<void> {
  const absolutePath = path.join(env.uploadsAbsoluteDir, storageKey);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, data);
}
