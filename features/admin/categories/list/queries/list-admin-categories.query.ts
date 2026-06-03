import { db } from "@/core/db";
import {
  mapCategoryLifecycleStatusToPrismaStatus,
  mapPrismaCategoryStatusToLifecycleStatus,
} from "@/entities/category";
import { mapCategoryListItem } from "@/features/admin/categories/list/mappers/map-category-list-item";
import type {
  CategoryListFilters,
  CategoryListResult,
  CategoryPickerItem,
  CategoryStatusCounts,
} from "../types";

const DEFAULT_PER_PAGE = 10;

type CategoryBaseWhereInput = {
  normalizedSearch: string;
  featured: CategoryListFilters["featured"];
  categorySlugs: CategoryListFilters["categorySlugs"];
};

function buildCategoryBaseWhere(input: CategoryBaseWhereInput) {
  const featuredWhere =
    input.featured && input.featured.length === 1
      ? { isFeatured: input.featured[0] === "featured" }
      : {};

  return {
    ...(input.normalizedSearch.length > 0
      ? {
          OR: [
            { name: { contains: input.normalizedSearch, mode: "insensitive" as const } },
            { slug: { contains: input.normalizedSearch, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...featuredWhere,
    ...(input.categorySlugs && input.categorySlugs.length > 0
      ? { slug: { in: input.categorySlugs } }
      : {}),
  };
}

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

  const baseWhere = buildCategoryBaseWhere({
    normalizedSearch,
    featured,
    categorySlugs,
  });

  const where = {
    ...baseWhere,
    ...(status.length > 0
      ? {
          status: {
            in: status.map((value) => mapCategoryLifecycleStatusToPrismaStatus(value)),
          },
        }
      : {
          status: {
            not: mapCategoryLifecycleStatusToPrismaStatus("archived"),
          },
        }),
  };

  const orderBy = (() => {
    switch (sort) {
      case "name-desc":
        return [{ name: "desc" as const }, { id: "desc" as const }];
      case "updated-asc":
        return [{ updatedAt: "asc" as const }, { id: "asc" as const }];
      case "updated-desc":
        return [{ updatedAt: "desc" as const }, { id: "desc" as const }];
      case "name-asc":
      default:
        return [{ name: "asc" as const }, { id: "asc" as const }];
    }
  })();

  const safePage = Math.max(1, page);
  const safePerPage = Math.max(1, Math.min(100, perPage));
  const skip = (safePage - 1) * safePerPage;

  const whereWithoutStatus = {
    ...baseWhere,
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

  const statusCounts: CategoryStatusCounts = {};
  for (const row of rawStatusCounts) {
    const key = mapPrismaCategoryStatusToLifecycleStatus(row.status);
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
