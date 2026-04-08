import { PriceListStatus } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { mapAdminPriceListOption } from "@/features/admin/products/editor/mappers";
import type { AdminPriceListOption } from "@/features/admin/products/editor/types";

export async function readAdminPriceLists(): Promise<AdminPriceListOption[]> {
  const priceLists = await db.priceList.findMany({
    where: {
      status: PriceListStatus.ACTIVE,
      archivedAt: null,
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      isDefault: true,
    },
  });

  return priceLists.map(mapAdminPriceListOption);
}
