import {
  CurrencyCode,
  PriceListStatus,
  type PrismaClient,
} from "../../../src/generated/prisma/client";

export async function ensureDefaultPriceList(prisma: PrismaClient, storeId: string) {
  return prisma.priceList.upsert({
    where: {
      storeId_code: {
        storeId,
        code: "default-eur",
      },
    },
    update: {},
    create: {
      storeId,
      code: "default-eur",
      name: "Tarifs par défaut",
      currencyCode: CurrencyCode.EUR,
      status: PriceListStatus.ACTIVE,
      isDefault: true,
    },
    select: {
      id: true,
      code: true,
      name: true,
      currencyCode: true,
    },
  });
}
