import { prisma } from "@/db/prisma-client";
import { productPatternDetailSelect } from "@db-products/types/rows";

export async function findAdminProductPatternDetailRowByProductId(productId: string) {
  return prisma.productPatternDetail.findUnique({
    where: { productId },
    select: productPatternDetailSelect,
  });
}
