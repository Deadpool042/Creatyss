import { prisma } from "@/db/prisma-client";
import { adminProductImageSelect, adminProductVariantImageSelect } from "@db-products/types/rows";

export async function findAdminProductImageRowById(id: string) {
  return prisma.productImage.findUnique({
    where: { id },
    select: adminProductImageSelect,
  });
}

export async function findAdminProductVariantImageRowById(id: string) {
  return prisma.productVariantImage.findUnique({
    where: { id },
    select: adminProductVariantImageSelect,
  });
}

export async function listAdminProductImageRowsByProductId(productId: string) {
  return prisma.productImage.findMany({
    where: { productId },
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    select: adminProductImageSelect,
  });
}

export async function listAdminVariantImageRowsByVariantId(productVariantId: string) {
  return prisma.productVariantImage.findMany({
    where: { productVariantId },
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    select: adminProductVariantImageSelect,
  });
}
