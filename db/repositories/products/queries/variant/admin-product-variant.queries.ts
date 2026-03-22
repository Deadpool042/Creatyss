import { prisma } from "@/db/prisma-client";
import { productVariantSelect } from "@db-products/types/rows";

export async function findAdminProductVariantRowById(id: string) {
  return prisma.productVariant.findUnique({
    where: { id },
    select: productVariantSelect,
  });
}

export async function listAdminProductVariantRowsByProductId(productId: string) {
  return prisma.productVariant.findMany({
    where: { productId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: productVariantSelect,
  });
}
