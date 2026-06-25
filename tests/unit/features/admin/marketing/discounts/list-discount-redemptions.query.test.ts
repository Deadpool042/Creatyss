import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    discountRedemption: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/features/admin/store/queries/get-current-store-id.query", () => ({
  getCurrentStoreId: vi.fn(),
}));

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { listDiscountRedemptions } from "@/features/admin/marketing/discounts/queries/list-discount-redemptions.query";

const mockDb = db as {
  discountRedemption: {
    count: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
};

const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;

function decimalLike(value: number) {
  return { toNumber: () => value };
}

describe("listDiscountRedemptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne une page vide si aucune boutique courante n'est trouvée", async () => {
    mockGetCurrentStoreId.mockResolvedValue(null);

    await expect(listDiscountRedemptions("discount_1", 3)).resolves.toEqual({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    });

    expect(mockDb.discountRedemption.count).not.toHaveBeenCalled();
    expect(mockDb.discountRedemption.findMany).not.toHaveBeenCalled();
  });

  it("borne la page demandée au total réel disponible", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.discountRedemption.count.mockResolvedValue(21);
    mockDb.discountRedemption.findMany.mockResolvedValue([
      {
        id: "redemption_1",
        discountId: "discount_1",
        discountCodeId: null,
        discountCode: null,
        orderId: "order_1",
        order: { orderNumber: "CMD-001", status: "CONFIRMED" },
        customerId: "customer_1",
        customer: { email: "client@example.com", displayName: "Client Test" },
        redeemedAt: new Date("2026-06-25T09:00:00.000Z"),
        amountApplied: decimalLike(12.5),
        currencyCode: "EUR",
      },
    ]);

    await expect(listDiscountRedemptions("discount_1", 999)).resolves.toEqual({
      items: [
        {
          id: "redemption_1",
          discountId: "discount_1",
          discountCodeId: null,
          discountCode: null,
          orderId: "order_1",
          orderNumber: "CMD-001",
          customerId: "customer_1",
          customerEmail: "client@example.com",
          customerDisplayName: "Client Test",
          redeemedAt: new Date("2026-06-25T09:00:00.000Z"),
          amountApplied: 12.5,
          currencyCode: "EUR",
        },
      ],
      total: 21,
      page: 2,
      pageSize: 20,
      totalPages: 2,
    });

    expect(mockDb.discountRedemption.count).toHaveBeenCalledWith({
      where: { discountId: "discount_1", discount: { storeId: "store_1" } },
    });
    expect(mockDb.discountRedemption.findMany).toHaveBeenCalledWith({
      where: { discountId: "discount_1", discount: { storeId: "store_1" } },
      orderBy: { redeemedAt: "desc" },
      skip: 20,
      take: 20,
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
  });
});
