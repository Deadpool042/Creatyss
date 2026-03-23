import { prisma } from "@/db/prisma-client";
import { categorySummarySelect, type CategorySummaryRow } from "@db-categories/types/rows";

export async function listCategorySummaryRowsByStoreId(
  storeId: string
): Promise<CategorySummaryRow[]> {
  return prisma.category.findMany({
    where: {
      storeId,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: categorySummarySelect,
  });
}

export async function findCategorySummaryRowById(id: string): Promise<CategorySummaryRow | null> {
  return prisma.category.findUnique({
    where: {
      id,
    },
    select: categorySummarySelect,
  });
}
