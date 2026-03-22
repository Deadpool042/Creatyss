import { prisma } from "@/db/prisma-client";
import { productDeliverableSelect } from "@db-products/types/rows";

export async function findAdminProductDeliverableRowById(id: string) {
  return prisma.productDeliverable.findUnique({
    where: { id },
    select: productDeliverableSelect,
  });
}

export async function listAdminProductDeliverableRowsByProductId(productId: string) {
  return prisma.productDeliverable.findMany({
    where: { productId },
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    select: productDeliverableSelect,
  });
}
