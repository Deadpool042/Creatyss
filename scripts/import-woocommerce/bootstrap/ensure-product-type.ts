import type { PrismaClient } from "../../../src/generated/prisma/client";

export async function ensureWooImportedProductType(prisma: PrismaClient, storeId: string) {
  const existing = await prisma.productType.findFirst({
    where: {
      storeId,
      code: "woo-imported",
    },
    select: {
      id: true,
      code: true,
      slug: true,
      name: true,
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.productType.create({
    data: {
      storeId,
      code: "woo-imported",
      slug: "woo-imported",
      name: "Woo Imported",
      description: "Type technique utilisé pour l'import WooCommerce.",
      isActive: true,
    },
    select: {
      id: true,
      code: true,
      slug: true,
      name: true,
    },
  });
}
