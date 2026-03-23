import { prisma } from "@/db/prisma-client";
import { pageSummarySelect, type PageSummaryRow } from "@db-pages/types/rows";

export async function listPageSummaryRowsByStoreId(storeId: string): Promise<PageSummaryRow[]> {
  return prisma.page.findMany({
    where: {
      storeId,
    },
    orderBy: [{ isHomepage: "desc" }, { updatedAt: "desc" }, { title: "asc" }],
    select: pageSummarySelect,
  });
}

export async function findPageSummaryRowById(id: string): Promise<PageSummaryRow | null> {
  return prisma.page.findUnique({
    where: {
      id,
    },
    select: pageSummarySelect,
  });
}
