import { prisma } from "@/db/prisma-client";
import { productDetailSelect, productSummarySelect } from "@db-products/types/rows";

export async function findAdminProductRowById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    select: productDetailSelect,
  });
}

export async function findAdminProductRowBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug },
    select: productDetailSelect,
  });
}

export async function listAdminProductRows() {
  return prisma.product.findMany({
    orderBy: [{ updatedAt: "desc" }],
    select: productSummarySelect,
  });
}
