import { prisma } from "@/db/prisma-client";
import { pageDetailSelect, pageListSelect } from "../types/rows";

export async function findPublishedPageRowBySlug(slug: string) {
  return prisma.page.findFirst({
    where: {
      slug,
      status: "published",
    },
    select: pageDetailSelect,
  });
}

export async function findPublishedHomepageRow() {
  return prisma.page.findFirst({
    where: {
      pageType: "homepage",
      status: "published",
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: pageDetailSelect,
  });
}

export async function listPublishedPageRowsByType(
  pageType: "homepage" | "standard" | "legal" | "landing"
) {
  return prisma.page.findMany({
    where: {
      pageType,
      status: "published",
    },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    select: pageListSelect,
  });
}
