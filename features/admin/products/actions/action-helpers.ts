import {
  listAdminMediaAssets,
  type AdminMediaAsset
} from "@/db/admin-media";

export function normalizeNumericIdFromForm(
  value: FormDataEntryValue | null
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  if (!/^[0-9]+$/.test(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

export function normalizeImageScopeFromForm(
  value: FormDataEntryValue | null
): "product" | "variant" | null {
  if (value !== "product" && value !== "variant") {
    return null;
  }

  return value;
}

export function appendImageScope(
  path: string,
  imageScope: "product" | "variant" | null
): string {
  if (imageScope === null) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";

  return `${path}${separator}image_scope=${imageScope}`;
}

export async function findAdminMediaAssetById(
  mediaAssetId: string
): Promise<AdminMediaAsset | null> {
  const mediaAssets = await listAdminMediaAssets();

  return mediaAssets.find((asset) => asset.id === mediaAssetId) ?? null;
}
