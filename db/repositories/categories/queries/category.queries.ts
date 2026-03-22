import { prisma } from "@/db/prisma-client";
import { categorySelect } from "../types/rows";

export async function findCategoryRowById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    select: categorySelect,
  });
}

export async function findCategoryRowBySlug(slug: string) {
  return prisma.category.findFirst({
    where: {
      slug,
      status: "active",
    },
    select: categorySelect,
  });
}

export async function listActiveCategoryRows() {
  return prisma.category.findMany({
    where: {
      status: "active",
    },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    select: categorySelect,
  });
}

export async function listFeaturedCategoryRows() {
  return prisma.category.findMany({
    where: {
      status: "active",
      isFeatured: true,
    },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    select: categorySelect,
  });
}
