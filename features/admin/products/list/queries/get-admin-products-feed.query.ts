import { db } from "@/core/db";
import { mapAdminProductFeedItem } from "@/features/admin/products/list/mappers/server";
import type {
  AdminProductFeedPageResult,
  AdminProductFeedQuery,
} from "@/features/admin/products/list/types/admin-product-feed.types";

function buildWhereClause(input: AdminProductFeedQuery) {
  const trimmedSearch = input.search?.trim();

  if (!trimmedSearch) {
    return {};
  }

  return {
    OR: [
      {
        name: {
          contains: trimmedSearch,
          mode: "insensitive" as const,
        },
      },
      {
        slug: {
          contains: trimmedSearch,
          mode: "insensitive" as const,
        },
      },
      {
        shortDescription: {
          contains: trimmedSearch,
          mode: "insensitive" as const,
        },
      },
      {
        description: {
          contains: trimmedSearch,
          mode: "insensitive" as const,
        },
      },
    ],
  };
}

function buildCursorWhereClause(cursor: AdminProductFeedQuery["cursor"]) {
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

export async function getAdminProductsFeed(
  input: AdminProductFeedQuery
): Promise<AdminProductFeedPageResult> {
  const limit = input.limit;
  const baseWhere = buildWhereClause(input);
  const cursorWhere = buildCursorWhereClause(input.cursor);

  const rows = await db.product.findMany({
    where: cursorWhere
      ? {
          AND: [baseWhere, cursorWhere],
        }
      : baseWhere,
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    select: {
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
  });

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const lastItem = items[items.length - 1] ?? null;

  return {
    items: items.map(mapAdminProductFeedItem),
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
