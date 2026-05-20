import { CategoryStatus } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { mapCategoryListItem } from "@/features/admin/categories/list/mappers/map-category-list-item";
import type {
  AdminCategoryCardItem,
  AdminCategoryStatus,
} from "@/features/admin/categories/list/types/admin-category-card-item.types";

const STATUS_MAP: Record<AdminCategoryStatus, CategoryStatus> = {
  draft: CategoryStatus.DRAFT,
  active: CategoryStatus.ACTIVE,
  inactive: CategoryStatus.INACTIVE,
  archived: CategoryStatus.ARCHIVED,
};

export type CategorySortOption = "name-asc" | "name-desc" | "updated-asc" | "updated-desc";
export type CategoryFeaturedFilter = "all" | "featured" | "not-featured";

export type CategoryListFilters = {
  search?: string;
  status?: AdminCategoryStatus | "all";
  featured?: CategoryFeaturedFilter;
  sort?: CategorySortOption;
  page?: number;
  perPage?: number;
};

export type CategoryStatusCounts = Partial<Record<AdminCategoryStatus, number>>;

export type CategoryListResult = {
  items: AdminCategoryCardItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  statusCounts: CategoryStatusCounts;
};

const DEFAULT_PER_PAGE = 10;

export async function listAdminCategories(
  filters: CategoryListFilters = {}
): Promise<CategoryListResult> {
  const {
    search = "",
    status = "all",
    featured = "all",
    sort = "name-asc",
    page = 1,
    perPage = DEFAULT_PER_PAGE,
  } = filters;

  const normalizedSearch = search.trim();

  const where = {
    ...(normalizedSearch.length > 0
      ? {
          OR: [
            { name: { contains: normalizedSearch, mode: "insensitive" as const } },
            { slug: { contains: normalizedSearch, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status !== "all" ? { status: STATUS_MAP[status] } : {}),
    ...(featured === "featured" ? { isFeatured: true } : {}),
    ...(featured === "not-featured" ? { isFeatured: false } : {}),
  };

  const orderBy = (() => {
    switch (sort) {
      case "name-desc":
        return { name: "desc" as const };
      case "updated-asc":
        return { updatedAt: "asc" as const };
      case "updated-desc":
        return { updatedAt: "desc" as const };
      case "name-asc":
      default:
        return { name: "asc" as const };
    }
  })();

  const safePage = Math.max(1, page);
  const safePerPage = Math.max(1, Math.min(100, perPage));
  const skip = (safePage - 1) * safePerPage;

  // `whereWithoutStatus` for per-status counts (respects search + featured but not status filter)
  const whereWithoutStatus = {
    ...(normalizedSearch.length > 0
      ? {
          OR: [
            { name: { contains: normalizedSearch, mode: "insensitive" as const } },
            { slug: { contains: normalizedSearch, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(featured === "featured" ? { isFeatured: true } : {}),
    ...(featured === "not-featured" ? { isFeatured: false } : {}),
  };

  const [rawCategories, total, rawStatusCounts] = await Promise.all([
    db.category.findMany({
      where,
      orderBy,
      skip,
      take: safePerPage,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isFeatured: true,
        status: true,
        primaryImage: {
          select: {
            publicUrl: true,
            altText: true,
          },
        },
      },
    }),
    db.category.count({ where }),
    db.category.groupBy({
      by: ["status"],
      where: whereWithoutStatus,
      _count: { id: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / safePerPage));

  // Reverse-map Prisma enum → AdminCategoryStatus for the counts
  const REVERSE_STATUS_MAP: Record<CategoryStatus, AdminCategoryStatus> = {
    [CategoryStatus.DRAFT]: "draft",
    [CategoryStatus.ACTIVE]: "active",
    [CategoryStatus.INACTIVE]: "inactive",
    [CategoryStatus.ARCHIVED]: "archived",
  };

  const statusCounts: CategoryStatusCounts = {};
  for (const row of rawStatusCounts) {
    const key = REVERSE_STATUS_MAP[row.status];
    if (key) statusCounts[key] = row._count.id;
  }

  return {
    items: rawCategories.map(mapCategoryListItem),
    total,
    totalPages,
    currentPage: Math.min(safePage, totalPages),
    statusCounts,
  };
}
