import { prisma } from "@/db/prisma-client";
import { categorySelect } from "../types/rows";

export async function findAdminCategoryRowById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    select: categorySelect,
  });
}

export async function findAdminCategoryRowBySlug(slug: string) {
  return prisma.category.findFirst({
    where: { slug },
    select: categorySelect,
  });
}

export async function listAdminCategoryRows() {
  return prisma.category.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    select: categorySelect,
  });
}
