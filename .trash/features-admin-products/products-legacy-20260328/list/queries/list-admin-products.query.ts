import { ProductStatus, type Prisma } from "@/prisma-generated/client";

import { db } from "@/core/db";
import type { ProductsPageParams } from "@/features/admin/products/navigation";
import { mapProductListItem } from "../mappers/map-product-list-item";
import type { AdminProductListItem } from "../types/product-list.types";

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
  const category = input.category.trim();

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

  if (category.length > 0) {
    where.productCategories = {
      some: {
        category: {
          OR: [
            {
              id: category,
            },
            {
              slug: category,
            },
          ],
        },
      },
    };
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
        take: 1,
        select: {
          category: {
            select: {
              id: true,
              slug: true,
              name: true,
            },
          },
        },
      },
      prices: {
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          amount: true,
          compareAtAmount: true,
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
