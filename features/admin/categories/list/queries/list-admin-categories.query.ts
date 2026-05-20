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

export type CategoryListResult = {
  items: AdminCategoryCardItem[];
  total: number;
  totalPages: number;
  currentPage: number;
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

  const [rawCategories, total] = await Promise.all([
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
  ]);

  const totalPages = Math.max(1, Math.ceil(total / safePerPage));

  return {
    items: rawCategories.map(mapCategoryListItem),
    total,
    totalPages,
    currentPage: Math.min(safePage, totalPages),
  };
}
