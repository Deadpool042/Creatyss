import { db } from "@/core/db";
import type { AdminPriceListOption } from "../types";

export async function readAdminPriceLists(): Promise<readonly AdminPriceListOption[]> {
  const priceLists = await db.priceList.findMany({
    where: {
      archivedAt: null,
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      isDefault: true,
      currencyCode: true,
    },
  });

  return priceLists.map((priceList) => ({
    id: priceList.id,
    code: priceList.code,
    name: priceList.name,
    isDefault: priceList.isDefault,
    currencyCode: priceList.currencyCode,
  }));
}
