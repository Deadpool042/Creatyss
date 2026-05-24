import { CategoryStatus } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { mapCategoryListItem } from "@/features/admin/categories/list/mappers/map-category-list-item";
import type { AdminCategoryStatus } from "@/features/admin/categories/types";
import type {
  CategoryListFilters,
  CategoryListResult,
  CategoryPickerItem,
  CategoryStatusCounts,
} from "../types";

const STATUS_MAP: Record<AdminCategoryStatus, CategoryStatus> = {
  draft: CategoryStatus.DRAFT,
  active: CategoryStatus.ACTIVE,
  inactive: CategoryStatus.INACTIVE,
  archived: CategoryStatus.ARCHIVED,
};

const DEFAULT_PER_PAGE = 10;

export async function listCategoriesForPicker(): Promise<CategoryPickerItem[]> {
  return db.category.findMany({
    select: { id: true, name: true, slug: true, parentId: true },
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
  });
}

export async function listAdminCategories(
  filters: CategoryListFilters = {}
): Promise<CategoryListResult> {
  const {
    search = "",
    status = [],
    featured = [],
    categorySlugs = [],
    sort = "name-asc",
    page = 1,
    perPage = DEFAULT_PER_PAGE,
  } = filters;

  const normalizedSearch = search.trim();

  const featuredWhere = featured.length === 1 ? { isFeatured: featured[0] === "featured" } : {};

  const where = {
    ...(normalizedSearch.length > 0
      ? {
          OR: [
            { name: { contains: normalizedSearch, mode: "insensitive" as const } },
            { slug: { contains: normalizedSearch, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status.length > 0
      ? { status: { in: status.map((s) => STATUS_MAP[s]) } }
      : { status: { not: CategoryStatus.ARCHIVED } }),
    ...featuredWhere,
    ...(categorySlugs.length > 0 ? { slug: { in: categorySlugs } } : {}),
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

  const whereWithoutStatus = {
    ...(normalizedSearch.length > 0
      ? {
          OR: [
            { name: { contains: normalizedSearch, mode: "insensitive" as const } },
            { slug: { contains: normalizedSearch, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...featuredWhere,
    ...(categorySlugs.length > 0 ? { slug: { in: categorySlugs } } : {}),
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
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
        parent: {
          select: { name: true },
        },
        primaryImage: {
          select: {
            publicUrl: true,
            altText: true,
          },
        },
        _count: {
          select: {
            productLinks: true,
            children: true,
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
