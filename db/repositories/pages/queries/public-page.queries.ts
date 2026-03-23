import { prisma } from "@/db/prisma-client";
import {
  pageDetailSelect,
  pageSummarySelect,
  type PageDetailRow,
  type PageSummaryRow,
} from "@db-pages/types/rows";

export async function findPageDetailRowById(id: string): Promise<PageDetailRow | null> {
  return prisma.page.findUnique({
    where: {
      id,
    },
    select: pageDetailSelect,
  });
}

export async function findActivePageDetailRowBySlug(
  storeId: string,
  slug: string
): Promise<PageDetailRow | null> {
  return prisma.page.findFirst({
    where: {
      storeId,
      slug,
      status: "ACTIVE",
    },
    select: pageDetailSelect,
  });
}

export async function findActiveHomepageRowByStoreId(
  storeId: string
): Promise<PageDetailRow | null> {
  return prisma.page.findFirst({
    where: {
      storeId,
      status: "ACTIVE",
      isHomepage: true,
    },
    orderBy: [{ updatedAt: "desc" }],
    select: pageDetailSelect,
  });
}

export async function listActivePageSummaryRowsByStoreId(
  storeId: string
): Promise<PageSummaryRow[]> {
  return prisma.page.findMany({
    where: {
      storeId,
      status: "ACTIVE",
    },
    orderBy: [{ isHomepage: "desc" }, { title: "asc" }],
    select: pageSummarySelect,
  });
}
