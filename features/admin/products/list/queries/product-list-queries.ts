import "server-only";

import { db } from "@/core/db";
import {
  mapPrismaProductStatusToLifecycleStatus,
  mapProductLifecycleStatusToPrismaStatus,
} from "@/entities/product";
import { mapAdminProductFeedItem } from "@/features/admin/products/list/mappers";
// import type {
//   ProductFeaturedFilterValue,
//   ProductSortOption,
//   ProductStatusCounts,
//   ProductTableStatus,
// } from "@/features/admin/products/list/types/product-table.types";
import type { ProductFilterCategoryOption } from "../types";
import type {
  AdminProductsListView,
  ProductListFilters,
  ProductListResult,
  ProductPickerItem,
  ProductStatusCounts,
} from "../types/product-list-query.types";
import type { AdminProductFeedItem } from "../types/product-feed.types";

export type ProductListQueryFilters = ProductListFilters;
export type { ProductListResult };
export type { AdminProductsListView };

type PrismaProductStatus = Parameters<typeof mapPrismaProductStatusToLifecycleStatus>[0];

// ─── listAdminProducts ───────────────────────────────────────────────────────

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

function createEmptyProductStatusCounts(): ProductStatusCounts {
  return {
    all: 0,
    active: 0,
    draft: 0,
    inactive: 0,
  };
}

function buildProductStatusCounts(items: AdminProductFeedItem[]): ProductStatusCounts {
  const statusCounts = createEmptyProductStatusCounts();

  for (const item of items) {
    if (item.status === "active") statusCounts.active += 1;
    else if (item.status === "draft") statusCounts.draft += 1;
    else if (item.status === "inactive") statusCounts.inactive += 1;
  }

  statusCounts.all = statusCounts.active + statusCounts.draft + statusCounts.inactive;
  return statusCounts;
}

function applyProductListPostFilters(
  items: AdminProductFeedItem[],
  filters: Pick<ProductListFilters, "stock" | "variant">
): AdminProductFeedItem[] {
  return items.filter((product) => {
    if (filters.stock === "in-stock" && product.stockState !== "in-stock") {
      return false;
    }

    if (filters.stock === "out-of-stock" && product.stockState !== "out-of-stock") {
      return false;
    }

    if (filters.variant === "single" && product.variantCount > 1) {
      return false;
    }

    if (filters.variant === "multiple" && product.variantCount <= 1) {
      return false;
    }

    return true;
  });
}

export async function listProductsCategoryForPicker(): Promise<ProductPickerItem[]> {
  return db.category.findMany({
    select: { id: true, name: true, slug: true, parentId: true },
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
  });
}

export async function listAdminProducts(
  filters: ProductListFilters = {}
): Promise<ProductListResult> {
  const {
    view = "active",
    search = "",
    status = [],
    sort = "updated-desc",
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    categorySlugs = [],
    featured = [],
    image = "all",
    stock = "all",
    variant = "all",
  } = filters;

  const normalizedSearch = search.trim();

  const viewWhere = view === "trash" ? { archivedAt: { not: null } } : { archivedAt: null };
  const categoryIds = categorySlugs.length
    ? await db.category
        .findMany({
          where: { slug: { in: categorySlugs } },
          select: { id: true },
        })
        .then((categories) => categories.map((c) => c.id))
    : [];

  const statusWhere =
    view === "trash"
      ? {}
      : status.length > 0
        ? { status: { in: status.map(mapProductLifecycleStatusToPrismaStatus) } }
        : { status: { not: mapProductLifecycleStatusToPrismaStatus("archived") } };

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

  const imageWhere =
    image === "with-image"
      ? { primaryImageId: { not: null } }
      : image === "without-image"
        ? { primaryImageId: null }
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
    ...imageWhere,
  };

  const whereWithoutStatus = {
    ...viewWhere,
    ...searchWhere,
    ...featuredWhere,
    ...categoryWhere,
    ...imageWhere,
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
  const hasPostQueryFilters = stock !== "all" || variant !== "all";

  if (hasPostQueryFilters) {
    const [rawProducts, rawStatusProducts] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        select: PRODUCT_SELECT,
      }),
      view === "trash"
        ? Promise.resolve([])
        : db.product.findMany({
            where: whereWithoutStatus,
            orderBy,
            select: PRODUCT_SELECT,
          }),
    ]);

    const filteredItems = applyProductListPostFilters(rawProducts.map(mapAdminProductFeedItem), {
      stock,
      variant,
    });
    const total = filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(total / safePerPage));
    const currentPage = Math.min(safePage, totalPages);
    const paginatedItems = filteredItems.slice(
      (currentPage - 1) * safePerPage,
      currentPage * safePerPage
    );
    const statusCounts =
      view === "trash"
        ? createEmptyProductStatusCounts()
        : buildProductStatusCounts(
            applyProductListPostFilters(rawStatusProducts.map(mapAdminProductFeedItem), {
              stock,
              variant,
            })
          );

    return {
      items: paginatedItems,
      total,
      totalPages,
      currentPage,
      statusCounts,
    };
  }

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
      ? Promise.resolve([] as { status: PrismaProductStatus; _count: { id: number } }[])
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
    const status = mapPrismaProductStatusToLifecycleStatus(row.status);

    if (status === "active") statusCounts.active = row._count.id;
    else if (status === "draft") statusCounts.draft = row._count.id;
    else if (status === "inactive") statusCounts.inactive = row._count.id;
  }

  statusCounts.all =
    (statusCounts.active ?? 0) + (statusCounts.draft ?? 0) + (statusCounts.inactive ?? 0);

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
