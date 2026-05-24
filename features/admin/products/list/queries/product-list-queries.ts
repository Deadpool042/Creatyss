import "server-only";

import { ProductStatus } from "@/prisma-generated/client";
import { db } from "@/core/db";
import { mapAdminProductFeedItem } from "@/features/admin/products/list/mappers";
import { mapProductStatusToPrismaStatus } from "@/features/admin/products/services";
import type { AdminProductFeedItem } from "@/features/admin/products/list/types/product-feed.types";
import type {
  ProductFeaturedFilterValue,
  ProductSortOption,
  ProductStatusCounts,
  ProductTableStatus,
} from "@/features/admin/products/list/types/product-table.types";
import type {
  GetAdminProductsFeedPageInput,
  GetAdminProductsFeedPageResult,
  ProductFilterCategoryOption,
} from "../types";

// ─── listAdminProducts ───────────────────────────────────────────────────────

export type AdminProductsListView = "active" | "trash";

export type ProductListQueryFilters = {
  view?: AdminProductsListView;
  search?: string;
  status?: ProductTableStatus[];
  sort?: ProductSortOption;
  page?: number;
  perPage?: number;
  categoryIds?: string[];
  featured?: ProductFeaturedFilterValue[];
};

export type ProductListResult = {
  items: AdminProductFeedItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  statusCounts: ProductStatusCounts;
};

const DEFAULT_PER_PAGE = 24;

const PRODUCT_SELECT = {
  id: true,
  slug: true,
  name: true,
  shortDescription: true,
  description: true,
  status: true,
  isFeatured: true,
  updatedAt: true,
  primaryImage: {
    select: {
      publicUrl: true,
      altText: true,
    },
  },
  productType: {
    select: {
      name: true,
    },
  },
  variants: {
    where: {
      archivedAt: null as null,
    },
    select: {
      inventoryItems: {
        where: {
          archivedAt: null as null,
          status: "ACTIVE" as const,
        },
        select: {
          onHandQuantity: true,
          reservedQuantity: true,
        },
      },
      prices: {
        where: {
          archivedAt: null as null,
          isActive: true,
        },
        orderBy: [{ createdAt: "asc" as const }],
        take: 1,
        select: {
          amount: true,
          compareAtAmount: true,
        },
      },
    },
  },
  _count: {
    select: {
      variants: true,
    },
  },
  productCategories: {
    orderBy: [{ sortOrder: "asc" as const }],
    select: {
      category: {
        select: {
          id: true,
          slug: true,
          name: true,
          parent: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },
};

export async function listAdminProducts(
  filters: ProductListQueryFilters = {}
): Promise<ProductListResult> {
  const {
    view = "active",
    search = "",
    status = [],
    sort = "updated-desc",
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    categoryIds = [],
    featured = [],
  } = filters;

  const normalizedSearch = search.trim();

  const viewWhere =
    view === "trash"
      ? { archivedAt: { not: null } }
      : { archivedAt: null };

  const statusWhere =
    view === "trash"
      ? {}
      : status.length > 0
        ? { status: { in: status.map(mapProductStatusToPrismaStatus) } }
        : { status: { not: mapProductStatusToPrismaStatus("archived") } };

  const searchWhere =
    normalizedSearch.length > 0
      ? {
          OR: [
            { name: { contains: normalizedSearch, mode: "insensitive" as const } },
            { slug: { contains: normalizedSearch, mode: "insensitive" as const } },
          ],
        }
      : {};

  const featuredWhere =
    featured.length === 1
      ? featured[0] === "featured"
        ? { isFeatured: true }
        : { isFeatured: false }
      : {};

  const categoryWhere =
    categoryIds.length > 0
      ? {
          productCategories: {
            some: {
              OR: [
                {
                  category: {
                    id: { in: categoryIds },
                  },
                },
                {
                  category: {
                    parentId: { in: categoryIds },
                  },
                },
              ],
            },
          },
        }
      : {};

  const where = {
    ...viewWhere,
    ...statusWhere,
    ...searchWhere,
    ...featuredWhere,
    ...categoryWhere,
  };

  const whereWithoutStatus = {
    ...viewWhere,
    ...searchWhere,
    ...featuredWhere,
    ...categoryWhere,
  };

  const orderBy = (() => {
    switch (sort) {
      case "name-asc":
        return [{ name: "asc" as const }, { id: "asc" as const }];
      case "name-desc":
        return [{ name: "desc" as const }, { id: "desc" as const }];
      case "updated-asc":
        return [{ updatedAt: "asc" as const }, { id: "asc" as const }];
      case "updated-desc":
      default:
        return [{ updatedAt: "desc" as const }, { id: "desc" as const }];
    }
  })();

  const safePage = Math.max(1, page);
  const safePerPage = Math.max(1, Math.min(200, perPage));
  const skip = (safePage - 1) * safePerPage;

  const [rawProducts, total, rawStatusCounts] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip,
      take: safePerPage,
      select: PRODUCT_SELECT,
    }),
    db.product.count({ where }),
    view === "trash"
      ? Promise.resolve([] as { status: ProductStatus; _count: { id: number } }[])
      : db.product.groupBy({
          by: ["status"],
          where: whereWithoutStatus,
          _count: { id: true },
        }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / safePerPage));

  const statusCounts: ProductStatusCounts = {
    all: 0,
    active: 0,
    draft: 0,
    inactive: 0,
  };

  for (const row of rawStatusCounts) {
    if (row.status === ProductStatus.ACTIVE) statusCounts.active = row._count.id;
    else if (row.status === ProductStatus.DRAFT) statusCounts.draft = row._count.id;
    else if (row.status === ProductStatus.INACTIVE) statusCounts.inactive = row._count.id;
  }

  statusCounts.all = statusCounts.active + statusCounts.draft + statusCounts.inactive;

  return {
    items: rawProducts.map(mapAdminProductFeedItem),
    total,
    totalPages,
    currentPage: Math.min(safePage, totalPages),
    statusCounts,
  };
}

// ─── listProductFilterCategories ─────────────────────────────────────────────

export async function listProductFilterCategories(): Promise<ProductFilterCategoryOption[]> {
  const categories = await db.category.findMany({
    where: {
      archivedAt: null,
      status: {
        in: ["ACTIVE", "DRAFT", "INACTIVE"],
      },
    },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true,
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentId: category.parentId,
    productCount: 0,
  }));
}

// ─── getAdminProductsFeedPage ─────────────────────────────────────────────────

export async function getAdminProductsFeedPage(
  input: GetAdminProductsFeedPageInput
): Promise<GetAdminProductsFeedPageResult> {
  const { items: products } = await listAdminProducts({
    ...(input.search !== null ? { search: input.search } : {}),
    status: input.status,
    ...(input.categoryIds.length > 0 ? { categoryIds: input.categoryIds } : {}),
    featured: input.featured,
  });

  const filtered = products.filter((product) => {
    if (input.search && !product.name.toLowerCase().includes(input.search.toLowerCase())) {
      return false;
    }

    if (input.status.length > 0 && !input.status.includes(product.status)) {
      return false;
    }

    if (input.featured.length === 1 && input.featured[0] === "featured" && !product.isFeatured) {
      return false;
    }

    if (input.featured.length === 1 && input.featured[0] === "standard" && product.isFeatured) {
      return false;
    }

    return true;
  });

  const items = filtered.slice(0, input.limit);
  const lastItem = items.at(-1) ?? null;

  return {
    items,
    nextCursor: lastItem
      ? {
          updatedAt: lastItem.updatedAt,
          id: lastItem.id,
        }
      : null,
    hasMore: filtered.length > input.limit,
  };
}
