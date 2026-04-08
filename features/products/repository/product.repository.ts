import { db } from "@/core/db";
import type { Prisma, Product } from "@/prisma-generated/client";
import type {
  ProductFeedCursor,
  ProductFeedPageResult,
  ProductFeedQuery,
} from "@/features/products/types";

type ProductCreateData = Prisma.ProductUncheckedCreateInput;
type ProductUpdateData = Prisma.ProductUncheckedUpdateInput;

type ProductPageRow = Product;

function buildProductsPageWhereClause(input: ProductFeedQuery): Prisma.ProductWhereInput {
  const trimmedSearch = input.search?.trim();

  if (!trimmedSearch) {
    return {};
  }

  return {
    OR: [
      {
        name: {
          contains: trimmedSearch,
          mode: "insensitive",
        },
      },
      {
        slug: {
          contains: trimmedSearch,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: trimmedSearch,
          mode: "insensitive",
        },
      },
    ],
  };
}

function buildProductsCursorWhereClause(
  cursor: ProductFeedCursor | null | undefined
): Prisma.ProductWhereInput | undefined {
  if (!cursor) {
    return undefined;
  }

  const cursorUpdatedAt = new Date(cursor.updatedAt);

  return {
    OR: [
      {
        updatedAt: {
          lt: cursorUpdatedAt,
        },
      },
      {
        updatedAt: cursorUpdatedAt,
        id: {
          lt: cursor.id,
        },
      },
    ],
  };
}

export async function findManyProducts(): Promise<Product[]> {
  return db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findProductsPage(
  input: ProductFeedQuery
): Promise<ProductFeedPageResult<ProductPageRow>> {
  const limit = input.limit;
  const baseWhere = buildProductsPageWhereClause(input);
  const cursorWhere = buildProductsCursorWhereClause(input.cursor);

  const rows = await db.product.findMany({
    where: cursorWhere
      ? {
          AND: [baseWhere, cursorWhere],
        }
      : baseWhere,
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    take: limit + 1,
  });

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;

  const lastItem = items[items.length - 1] ?? null;

  return {
    items,
    nextCursor:
      hasMore && lastItem
        ? {
            updatedAt: lastItem.updatedAt.toISOString(),
            id: lastItem.id,
          }
        : null,
    hasMore,
  };
}

export async function findProductById(id: string): Promise<Product | null> {
  return db.product.findUnique({
    where: { id },
  });
}

export async function findProductBySlug(storeId: string, slug: string): Promise<Product | null> {
  return db.product.findUnique({
    where: {
      storeId_slug: {
        storeId,
        slug,
      },
    },
  });
}

export async function createProduct(data: ProductCreateData): Promise<Product> {
  return db.product.create({
    data,
  });
}

export async function updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
  return db.product.update({
    where: { id },
    data,
  });
}
