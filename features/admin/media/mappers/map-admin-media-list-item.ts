import type { AdminMediaListItem } from "@/features/admin/media/types/admin-media-list-item.types";

type MediaAssetListSource = {
  id: string;
  originalFilename: string;
  storageKey: string;
  publicUrl: string | null;
  slug?: string | null;
  title?: string | null;
  altText?: string | null;
  caption?: string | null;
  description?: string | null;
  mimeType: string;
  createdAt: Date;
  archivedAt?: Date | null;
  sizeBytes: number | null;
  widthPx: number | null;
  heightPx: number | null;
};

function normalizePreviewUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeOriginalName(input: { originalFilename: string; storageKey: string }): string {
  const trimmedName = input.originalFilename.trim();

  if (trimmedName.length > 0) {
    return trimmedName;
  }

  return input.storageKey;
}

export function mapAdminMediaListItem(asset: MediaAssetListSource): AdminMediaListItem {
  return {
    id: asset.id,
    originalName: normalizeOriginalName({
      originalFilename: asset.originalFilename,
      storageKey: asset.storageKey,
    }),
    filePath: asset.storageKey,
    previewUrl: normalizePreviewUrl(asset.publicUrl),
    slug: asset.slug ?? null,
    title: asset.title ?? null,
    altText: asset.altText ?? null,
    caption: asset.caption ?? null,
    description: asset.description ?? null,
    mimeType: asset.mimeType,
    createdAt: asset.createdAt.toISOString(),
    archivedAt: asset.archivedAt?.toISOString() ?? null,
    byteSize: asset.sizeBytes,
    imageWidth: asset.widthPx,
    imageHeight: asset.heightPx,
  };
}
