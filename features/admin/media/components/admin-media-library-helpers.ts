import type { AdminMediaListItem } from "@/features/admin/media/types/admin-media-list-item.types";
import { ADMIN_CATALOG_MEDIA_PATH } from "@/features/admin/catalog/shared/admin-catalog-routes";

export const ADMIN_MEDIA_PAGE_SIZE = 24;

export const mediaDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const integerFormatter = new Intl.NumberFormat("fr-FR");

export type MediaLibrarySearchParams = {
  assetId?: string;
  error?: string;
  page?: number;
  status?: string;
};

export function getSingleSearchParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parsePositiveInt(value: FormDataEntryValue | string | null | undefined): number {
  const rawValue = typeof value === "string" ? value : null;
  const parsed = rawValue ? Number.parseInt(rawValue, 10) : Number.NaN;

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function buildMediaLibraryHref({
  assetId,
  error,
  page,
  status,
}: MediaLibrarySearchParams): string {
  const params = new URLSearchParams();

  if (assetId) params.set("assetId", assetId);
  if (error) params.set("error", error);
  if (page && page > 1) params.set("page", String(page));
  if (status) params.set("status", status);

  const query = params.toString();

  return query.length > 0 ? `${ADMIN_CATALOG_MEDIA_PATH}?${query}` : ADMIN_CATALOG_MEDIA_PATH;
}

export function formatByteSize(byteSize: number | null): string {
  if (byteSize === null || !Number.isFinite(byteSize) || byteSize <= 0) {
    return "Indisponible";
  }

  if (byteSize >= 1024 * 1024 * 1024) {
    return `${(byteSize / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  if (byteSize >= 1024 * 1024) {
    return `${(byteSize / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (byteSize >= 1024) {
    return `${Math.round(byteSize / 1024)} KB`;
  }

  return `${byteSize} o`;
}

export function formatDimensions(
  asset: Pick<AdminMediaListItem, "imageWidth" | "imageHeight">
): string {
  return asset.imageWidth !== null && asset.imageHeight !== null
    ? `${asset.imageWidth} × ${asset.imageHeight}`
    : "Indisponibles";
}

export function getErrorMessage(errorCode: string | undefined): string | null {
  switch (errorCode) {
    case "missing_file":
      return "Sélectionnez une image à importer.";
    case "empty_file":
      return "Le fichier sélectionné est vide.";
    case "file_too_large":
      return "Le fichier dépasse la limite de 10 MB.";
    case "unsupported_file":
      return "Seules les images JPEG, PNG, WebP et AVIF sont acceptées.";
    case "write_failed":
      return "Le fichier n'a pas pu être enregistré localement.";
    case "database_insert_failed":
      return "Le fichier a été refusé lors de l'enregistrement en base.";
    case "upload_failed":
      return "L'import du média a échoué.";
    default:
      return null;
  }
}
