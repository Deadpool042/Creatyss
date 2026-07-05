import type {
  AdminMediaFormatFilter,
  AdminMediaLibraryView,
  AdminMediaListItem,
  AdminMediaSortOption,
  AdminMediaUsageFilter,
} from "@/features/admin/media/types/admin-media-list-item.types";
import { ADMIN_CATALOG_MEDIA_PATH } from "@/features/admin/catalog/shared/admin-catalog-routes";

export const ADMIN_MEDIA_PAGE_SIZE = 24;
export const ADMIN_MEDIA_PER_PAGE_OPTIONS = [12, 24, 48, 96] as const;
export const ADMIN_MEDIA_SORT_OPTIONS: {
  value: AdminMediaSortOption;
  label: string;
}[] = [
  { value: "newest", label: "Plus récents" },
  { value: "oldest", label: "Plus anciens" },
  { value: "name-asc", label: "Nom A-Z" },
  { value: "size-desc", label: "Plus lourds" },
];
export const ADMIN_MEDIA_FORMAT_OPTIONS: {
  value: AdminMediaFormatFilter;
  label: string;
}[] = [
  { value: "all", label: "Tous formats" },
  { value: "jpeg", label: "JPEG" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WebP" },
  { value: "avif", label: "AVIF" },
];
export const ADMIN_MEDIA_USAGE_OPTIONS: {
  value: AdminMediaUsageFilter;
  label: string;
}[] = [
  { value: "all", label: "Tous usages" },
  { value: "used", label: "Utilisés" },
  { value: "unused", label: "Non utilisés" },
];
export const ADMIN_MEDIA_VIEW_OPTIONS: {
  value: AdminMediaLibraryView;
  label: string;
}[] = [
  { value: "active", label: "Actifs" },
  { value: "trash", label: "Corbeille" },
];

export const mediaDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const integerFormatter = new Intl.NumberFormat("fr-FR");

export type MediaLibrarySearchParams = {
  assetId?: string;
  error?: string;
  format?: AdminMediaFormatFilter;
  page?: number;
  perPage?: number;
  q?: string;
  sort?: AdminMediaSortOption;
  status?: string;
  usage?: AdminMediaUsageFilter;
  view?: AdminMediaLibraryView;
};

export const DEFAULT_ADMIN_MEDIA_SORT: AdminMediaSortOption = "newest";
export const DEFAULT_ADMIN_MEDIA_FORMAT: AdminMediaFormatFilter = "all";
export const DEFAULT_ADMIN_MEDIA_USAGE: AdminMediaUsageFilter = "all";
export const DEFAULT_ADMIN_MEDIA_VIEW: AdminMediaLibraryView = "active";

export function getSingleSearchParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parsePositiveInt(value: FormDataEntryValue | string | null | undefined): number {
  const rawValue = typeof value === "string" ? value : null;
  const parsed = rawValue ? Number.parseInt(rawValue, 10) : Number.NaN;

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function parseOptionalPositiveInt(
  value: FormDataEntryValue | string | null | undefined
): number | undefined {
  const rawValue = typeof value === "string" ? value : null;
  const parsed = rawValue ? Number.parseInt(rawValue, 10) : Number.NaN;

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function buildMediaLibraryHref({
  assetId,
  error,
  format,
  page,
  perPage,
  q,
  sort,
  status,
  usage,
  view,
}: MediaLibrarySearchParams): string {
  const params = new URLSearchParams();

  if (assetId) params.set("assetId", assetId);
  if (error) params.set("error", error);
  if (format && format !== DEFAULT_ADMIN_MEDIA_FORMAT) params.set("format", format);
  if (page && page > 1) params.set("page", String(page));
  if (perPage && perPage !== ADMIN_MEDIA_PAGE_SIZE) params.set("perPage", String(perPage));
  if (q && q.trim().length > 0) params.set("q", q.trim());
  if (sort && sort !== DEFAULT_ADMIN_MEDIA_SORT) params.set("sort", sort);
  if (status) params.set("status", status);
  if (usage && usage !== DEFAULT_ADMIN_MEDIA_USAGE) params.set("usage", usage);
  if (view && view !== DEFAULT_ADMIN_MEDIA_VIEW) params.set("view", view);

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

export function parseAdminMediaSortOption(
  value: string | undefined
): AdminMediaSortOption {
  return ADMIN_MEDIA_SORT_OPTIONS.some((option) => option.value === value)
    ? (value as AdminMediaSortOption)
    : DEFAULT_ADMIN_MEDIA_SORT;
}

export function parseAdminMediaFormatFilter(
  value: string | undefined
): AdminMediaFormatFilter {
  return ADMIN_MEDIA_FORMAT_OPTIONS.some((option) => option.value === value)
    ? (value as AdminMediaFormatFilter)
    : DEFAULT_ADMIN_MEDIA_FORMAT;
}

export function parseAdminMediaUsageFilter(
  value: string | undefined
): AdminMediaUsageFilter {
  return ADMIN_MEDIA_USAGE_OPTIONS.some((option) => option.value === value)
    ? (value as AdminMediaUsageFilter)
    : DEFAULT_ADMIN_MEDIA_USAGE;
}

export function parseAdminMediaLibraryView(
  value: string | undefined
): AdminMediaLibraryView {
  return ADMIN_MEDIA_VIEW_OPTIONS.some((option) => option.value === value)
    ? (value as AdminMediaLibraryView)
    : DEFAULT_ADMIN_MEDIA_VIEW;
}

export function formatMimeLabel(mimeType: string): string {
  return mimeType.replace("image/", "").toUpperCase();
}

export function getMediaOrientationLabel(
  asset: Pick<AdminMediaListItem, "imageWidth" | "imageHeight">
): string {
  if (asset.imageWidth === null || asset.imageHeight === null) {
    return "Orientation inconnue";
  }

  if (asset.imageWidth === asset.imageHeight) {
    return "Carré";
  }

  return asset.imageWidth > asset.imageHeight ? "Paysage" : "Portrait";
}

export function getErrorMessage(errorCode: string | undefined): string | null {
  switch (errorCode) {
    case "delete_failed":
      return "La suppression définitive du média a échoué.";
    case "restore_failed":
      return "La restauration du média a échoué.";
    case "save_failed":
      return "La mise à jour du média a échoué.";
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
