import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import type { AdminDiscountSummary } from "@/features/admin/marketing/discounts/types/admin-discount.types";

/**
 * Liste les `Discount` du store courant (non archivés), pour la page admin
 * `/admin/marketing/discounts` — niveau `simple`
 * (cf. `docs/lots/2026-06-13-commerce-discounts-cadrage.md`).
 */
export async function listAdminDiscounts(): Promise<AdminDiscountSummary[]> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return [];
  }

  const discounts = await db.discount.findMany({
    where: { storeId, archivedAt: null },
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      status: true,
      type: true,
      isAutomatic: true,
      priority: true,
      percentageValue: true,
      fixedAmountValue: true,
      currencyCode: true,
      startsAt: true,
      endsAt: true,
      maxRedemptions: true,
      maxRedemptionsPerCode: true,
      maxRedemptionsPerUser: true,
      _count: {
        select: {
          redemptions: true,
          codes: true,
        },
      },
      createdAt: true,
    },
  });

  return discounts.map((discount) => ({
    ...discount,
    percentageValue: discount.percentageValue?.toNumber() ?? null,
    fixedAmountValue: discount.fixedAmountValue?.toNumber() ?? null,
    redemptionsCount: discount._count.redemptions,
    codesCount: discount._count.codes,
  }));
}
