//features/admin/products/list/queries/list-admin-products.query.ts
import { ProductStatus } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { mapAdminProductFeedItem } from "@/features/admin/products/list/mappers/server";
import type { AdminProductFeedItem } from "@/features/admin/products/list/types/product-feed.types";
import type {
  ProductSortOption,
  ProductStatusCounts,
  ProductTableStatus,
} from "@/features/admin/products/list/types/product-table.types";

export type AdminProductsListView = "active" | "trash";

export type ProductFeaturedFilter = "all" | "featured" | "standard";

export type ProductListFilters = {
  view?: AdminProductsListView;
  search?: string;
  status?: ProductTableStatus[];
  sort?: ProductSortOption;
  page?: number;
  perPage?: number;
  categoryId?: string;
  featured?: ProductFeaturedFilter;
};

export type ProductListResult = {
  items: AdminProductFeedItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  statusCounts: ProductStatusCounts;
};

const STATUS_MAP: Record<ProductTableStatus, ProductStatus> = {
  draft: ProductStatus.DRAFT,
  active: ProductStatus.ACTIVE,
  inactive: ProductStatus.INACTIVE,
  archived: ProductStatus.ARCHIVED,
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
  filters: ProductListFilters = {}
): Promise<ProductListResult> {
  const {
    view = "active",
    search = "",
    status = [],
    sort = "updated-desc",
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    categoryId,
    featured = "all",
  } = filters;

  const normalizedSearch = search.trim();

  // Base where for view (archived vs active)
  const viewWhere =
    view === "trash"
      ? { archivedAt: { not: null } }
      : { archivedAt: null };

  // Status filter — in trash view we ignore status filter
  const statusWhere =
    view === "trash"
      ? {}
      : status.length > 0
        ? { status: { in: status.map((s) => STATUS_MAP[s]) } }
        : { status: { not: ProductStatus.ARCHIVED } };

  // Search filter
  const searchWhere =
    normalizedSearch.length > 0
      ? {
          OR: [
            { name: { contains: normalizedSearch, mode: "insensitive" as const } },
            { slug: { contains: normalizedSearch, mode: "insensitive" as const } },
          ],
        }
      : {};

  // Featured filter
  const featuredWhere =
    featured === "featured"
      ? { isFeatured: true }
      : featured === "standard"
        ? { isFeatured: false }
        : {};

  // Category filter
  const categoryWhere =
    categoryId !== undefined && categoryId !== "" && categoryId !== "all"
      ? {
          productCategories: {
            some: {
              category: { id: categoryId },
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

  // For status counts: same filters but without the status constraint
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
