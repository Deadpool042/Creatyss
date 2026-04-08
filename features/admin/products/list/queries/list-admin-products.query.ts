import { ProductStatus, type Prisma } from "@/prisma-generated/client";

import { db } from "@/core/db";
import type { ProductsPageParams } from "@/features/admin/products/navigation";
import { mapProductListItem } from "@/features/admin/products/list/mappers";
import type { AdminProductListItem } from "@/features/admin/products/list/types";
import { buildAdminProductsCategoryFilter } from "@/features/admin/products/list/utils/build-admin-products-category-filter";

type ListAdminProductsQueryInput = Pick<
  ProductsPageParams,
  "search" | "status" | "category" | "featured"
>;

function normalizeStatusFilter(value: string): ProductStatus | null {
  switch (value) {
    case "published":
      return ProductStatus.ACTIVE;
    case "draft":
      return ProductStatus.DRAFT;
    case "archived":
      return ProductStatus.ARCHIVED;
    default:
      return null;
  }
}

function normalizeFeaturedFilter(value: string): boolean | null {
  switch (value) {
    case "true":
    case "1":
    case "featured":
      return true;
    case "false":
    case "0":
    case "standard":
      return false;
    default:
      return null;
  }
}

function buildProductsWhere(input: ListAdminProductsQueryInput): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  const search = input.search.trim();
  const status = normalizeStatusFilter(input.status);
  const featured = normalizeFeaturedFilter(input.featured);
  const productCategories = buildAdminProductsCategoryFilter({
    category: input.category,
  });

  if (search.length > 0) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        slug: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        shortDescription: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (status !== null) {
    where.status = status;
  }

  if (featured !== null) {
    where.isFeatured = featured;
  }

  if (productCategories) {
    where.productCategories = productCategories;
  }

  return where;
}

export async function listAdminProducts(
  input: ListAdminProductsQueryInput
): Promise<AdminProductListItem[]> {
  const products = await db.product.findMany({
    where: buildProductsWhere(input),
    select: {
      id: true,
      slug: true,
      name: true,
      shortDescription: true,
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
          code: true,
        },
      },
      variants: {
        select: {
          inventoryItems: {
            where: {
              status: "ACTIVE",
            },
            select: {
              onHandQuantity: true,
              reservedQuantity: true,
            },
          },
          prices: {
            where: {
              isActive: true,
            },
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
          productCategories: true,
        },
      },
      productCategories: {
        where: {
          isPrimary: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
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
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return products.map(mapProductListItem);
}
