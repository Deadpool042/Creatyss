import { MediaAssetKind } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { mapAdminMediaListItem } from "@/features/admin/media/mappers/map-admin-media-list-item";
import {
  DEFAULT_ADMIN_MEDIA_FORMAT,
  DEFAULT_ADMIN_MEDIA_SORT,
  DEFAULT_ADMIN_MEDIA_USAGE,
  DEFAULT_ADMIN_MEDIA_VIEW,
} from "@/features/admin/media/components/admin-media-library-helpers";
import type {
  AdminMediaFormatFilter,
  AdminMediaLibraryView,
  AdminMediaListItem,
  AdminMediaSortOption,
  AdminMediaUsageFilter,
} from "@/features/admin/media/types/admin-media-list-item.types";

type ListAdminMediaAssetsInput = {
  page: number;
  pageSize: number;
  query?: string;
  sort?: AdminMediaSortOption;
  format?: AdminMediaFormatFilter;
  usage?: AdminMediaUsageFilter;
  view?: AdminMediaLibraryView;
};

export type PaginatedAdminMediaAssets = {
  items: AdminMediaListItem[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
};

export async function listAdminMediaAssets(): Promise<AdminMediaListItem[]>;
export async function listAdminMediaAssets(
  input: ListAdminMediaAssetsInput
): Promise<PaginatedAdminMediaAssets>;
export async function listAdminMediaAssets(
  input?: ListAdminMediaAssetsInput
): Promise<AdminMediaListItem[] | PaginatedAdminMediaAssets> {
  const trimmedQuery = input?.query?.trim();
  const selectedSort = input?.sort ?? DEFAULT_ADMIN_MEDIA_SORT;
  const selectedFormat = input?.format ?? DEFAULT_ADMIN_MEDIA_FORMAT;
  const selectedUsage = input?.usage ?? DEFAULT_ADMIN_MEDIA_USAGE;
  const selectedView = input?.view ?? DEFAULT_ADMIN_MEDIA_VIEW;
  const where = {
    kind: MediaAssetKind.IMAGE,
    ...(selectedView === "trash" ? { archivedAt: { not: null } } : { archivedAt: null }),
    ...(selectedFormat !== "all"
      ? { mimeType: getMimeTypeFilter(selectedFormat) }
      : {}),
    ...getUsageWhere(selectedUsage),
    ...(trimmedQuery
      ? {
          OR: [
            { originalFilename: { contains: trimmedQuery, mode: "insensitive" as const } },
            { storageKey: { contains: trimmedQuery, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const totalCount = await db.mediaAsset.count({
    where,
  });

  const totalPages = input ? Math.max(1, Math.ceil(totalCount / input.pageSize)) : 1;
  const currentPage = input ? Math.min(Math.max(1, input.page), totalPages) : 1;

  const assets = await db.mediaAsset.findMany({
    where,
    select: {
      id: true,
      originalFilename: true,
      storageKey: true,
      publicUrl: true,
      slug: true,
      title: true,
      altText: true,
      caption: true,
      description: true,
      mimeType: true,
      createdAt: true,
      archivedAt: true,
      sizeBytes: true,
      widthPx: true,
      heightPx: true,
    },
    orderBy: getOrderBy(selectedSort),
    ...(input
      ? {
          skip: (currentPage - 1) * input.pageSize,
          take: input.pageSize,
        }
      : {}),
  });

  const items = assets.map(mapAdminMediaListItem);

  if (!input) {
    return items;
  }

  return {
    items,
    currentPage,
    totalPages,
    pageSize: input.pageSize,
    totalCount,
  };
}

function getMimeTypeFilter(format: Exclude<AdminMediaFormatFilter, "all">): string {
  switch (format) {
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
  }
}

function getOrderBy(sort: AdminMediaSortOption) {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" as const }, { id: "asc" as const }];
    case "name-asc":
      return [{ originalFilename: "asc" as const }, { createdAt: "desc" as const }];
    case "size-desc":
      return [{ sizeBytes: "desc" as const }, { createdAt: "desc" as const }];
    case "newest":
    default:
      return [{ createdAt: "desc" as const }, { id: "desc" as const }];
  }
}

function getUsageWhere(usage: AdminMediaUsageFilter) {
  if (usage === "all") {
    return {};
  }

  const relationKeys = [
    "productsAsPrimaryImage",
    "productVariantsAsPrimaryImage",
    "bundlesAsPrimaryImage",
    "categoriesAsPrimaryImage",
    "categoriesAsCoverImage",
    "pagesAsPrimaryImage",
    "pagesAsCoverImage",
    "pageSectionsAsPrimaryImage",
    "pageSectionsAsCoverImage",
    "pageBlocksAsPrimaryImage",
    "pageBlocksAsSecondaryImage",
    "blogCategoriesAsPrimaryImage",
    "blogCategoriesAsCoverImage",
    "blogPostsAsPrimaryImage",
    "blogPostsAsCoverImage",
    "homepageSectionsAsPrimaryImage",
    "homepageSectionsAsSecondaryImage",
    "publicEventsAsPrimaryImage",
    "publicEventsAsCoverImage",
    "storesAsLogo",
    "seoOpenGraphFor",
    "seoTwitterFor",
    "references",
  ] as const;

  if (usage === "used") {
    return {
      OR: relationKeys.map((key) => ({ [key]: { some: {} as const } })),
    };
  }

  return {
    AND: relationKeys.map((key) => ({ [key]: { none: {} as const } })),
  };
}
