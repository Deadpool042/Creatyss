import { prisma } from "@/db/prisma-client";
import { pageDetailSelect, pageListSelect } from "../types/rows";

export async function listAdminPageRows() {
  return prisma.page.findMany({
    orderBy: [{ pageType: "asc" }, { updatedAt: "desc" }],
    select: pageListSelect,
  });
}

export async function findAdminPageRowById(id: string) {
  return prisma.page.findUnique({
    where: { id },
    select: pageDetailSelect,
  });
}

export async function findAdminPageRowBySlug(slug: string) {
  return prisma.page.findFirst({
    where: { slug },
    select: pageDetailSelect,
  });
}
