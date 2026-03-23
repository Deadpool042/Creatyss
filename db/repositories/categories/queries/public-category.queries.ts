import { prisma } from "@/db/prisma-client";
import {
  categoryDetailSelect,
  categorySummarySelect,
  type CategoryDetailRow,
  type CategorySummaryRow,
} from "@db-categories/types/rows";

export async function findCategoryDetailRowById(id: string): Promise<CategoryDetailRow | null> {
  return prisma.category.findUnique({
    where: {
      id,
    },
    select: categoryDetailSelect,
  });
}

export async function findActiveCategoryDetailRowBySlug(
  storeId: string,
  slug: string
): Promise<CategoryDetailRow | null> {
  return prisma.category.findFirst({
    where: {
      storeId,
      slug,
      status: "ACTIVE",
    },
    select: categoryDetailSelect,
  });
}

export async function listActiveCategorySummaryRowsByStoreId(
  storeId: string
): Promise<CategorySummaryRow[]> {
  return prisma.category.findMany({
    where: {
      storeId,
      status: "ACTIVE",
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: categorySummarySelect,
  });
}
