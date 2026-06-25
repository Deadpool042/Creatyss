import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import type { AdminDiscountRedemptionPage } from "@/features/admin/marketing/discounts/types/admin-discount.types";

const DEFAULT_PAGE_SIZE = 20;

/**
 * Retourne une page paginée de `DiscountRedemption` pour un `Discount` donné.
 * Utilisé dans la page détail admin — visible si `simpleLevelMet`.
 */
export async function listDiscountRedemptions(
  discountId: string,
  page: number = 1
): Promise<AdminDiscountRedemptionPage> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { items: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 0 };
  }

  const requestedPage = Math.max(1, Math.floor(page));

  const total = await db.discountRedemption.count({
    where: { discountId, discount: { storeId } },
  });

  if (total === 0) {
    return { items: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 0 };
  }

  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);
  const safePage = Math.min(requestedPage, totalPages);
  const skip = (safePage - 1) * DEFAULT_PAGE_SIZE;

  const redemptions = await db.discountRedemption.findMany({
    where: { discountId, discount: { storeId } },
    orderBy: { redeemedAt: "desc" },
    skip,
    take: DEFAULT_PAGE_SIZE,
    select: {
      id: true,
      discountId: true,
      discountCodeId: true,
      discountCode: {
        select: { code: true },
      },
      orderId: true,
      order: {
        select: { orderNumber: true, status: true },
      },
      customerId: true,
      customer: {
        select: { email: true, displayName: true },
      },
      redeemedAt: true,
      amountApplied: true,
      currencyCode: true,
    },
  });

  return {
    items: redemptions.map((r) => ({
      id: r.id,
      discountId: r.discountId,
      discountCodeId: r.discountCodeId,
      discountCode: r.discountCode?.code ?? null,
      orderId: r.orderId,
      orderNumber: r.order?.orderNumber ?? null,
      customerId: r.customerId,
      customerEmail: r.customer?.email ?? null,
      customerDisplayName: r.customer?.displayName ?? null,
      redeemedAt: r.redeemedAt,
      amountApplied: r.amountApplied?.toNumber() ?? null,
      currencyCode: r.currencyCode ?? null,
    })),
    total,
    page: safePage,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages,
  };
}
