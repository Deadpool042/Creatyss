import { prisma } from "@/db/prisma-client";
import { productDetailSelect, productSummarySelect } from "@db-products/types/rows";

export async function findProductRowById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    select: productDetailSelect,
  });
}

export async function findProductRowBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      status: "published",
    },
    select: productDetailSelect,
  });
}

export async function listPublishedProductRows() {
  return prisma.product.findMany({
    where: {
      status: "published",
    },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    select: productSummarySelect,
  });
}

export async function listFeaturedProductRows() {
  return prisma.product.findMany({
    where: {
      status: "published",
      isFeatured: true,
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: productSummarySelect,
  });
}
