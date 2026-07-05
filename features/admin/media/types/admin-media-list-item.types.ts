export type AdminMediaListItem = {
  id: string;
  originalName: string;
  filePath: string;
  previewUrl: string | null;
  slug: string | null;
  title: string | null;
  altText: string | null;
  caption: string | null;
  description: string | null;
  mimeType: string;
  createdAt: string;
  archivedAt: string | null;
  byteSize: number | null;
  imageWidth: number | null;
  imageHeight: number | null;
};

export type AdminMediaSortOption = "newest" | "oldest" | "name-asc" | "size-desc";

export type AdminMediaFormatFilter = "all" | "jpeg" | "png" | "webp" | "avif";

export type AdminMediaUsageFilter = "all" | "used" | "unused";

export type AdminMediaLibraryView = "active" | "trash";

export type AdminMediaUsageSummary = {
  productsCount: number;
  categoriesCount: number;
  contentCount: number;
  brandingCount: number;
  seoCount: number;
};
