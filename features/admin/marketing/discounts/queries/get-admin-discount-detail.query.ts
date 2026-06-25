import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import type { AdminDiscountDetail } from "@/features/admin/marketing/discounts/types/admin-discount.types";

/**
 * Retourne le détail d'un `Discount` (avec ses codes secondaires) pour la
 * page admin `/admin/marketing/discounts/[id]` — niveau `simple`.
 *
 * Retourne `null` si le discount n'existe pas ou n'appartient pas au store.
 */
export async function getAdminDiscountDetail(
  discountId: string
): Promise<AdminDiscountDetail | null> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return null;
  }

  const discount = await db.discount.findUnique({
    where: { id: discountId, storeId, archivedAt: null },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      status: true,
      type: true,
      scopeType: true,
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
      createdAt: true,
      _count: {
        select: {
          redemptions: true,
          codes: true,
        },
      },
      codes: {
        where: { archivedAt: null },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          code: true,
          status: true,
          maxRedemptions: true,
          redeemedCount: true,
          startsAt: true,
          endsAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (discount === null) {
    return null;
  }

  return {
    ...discount,
    scopeType: discount.scopeType,
    percentageValue: discount.percentageValue?.toNumber() ?? null,
    fixedAmountValue: discount.fixedAmountValue?.toNumber() ?? null,
    redemptionsCount: discount._count.redemptions,
    codesCount: discount._count.codes,
    codes: discount.codes,
  };
}
