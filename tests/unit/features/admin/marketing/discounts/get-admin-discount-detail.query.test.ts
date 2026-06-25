import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    discount: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/features/admin/store/queries/get-current-store-id.query", () => ({
  getCurrentStoreId: vi.fn(),
}));

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { getAdminDiscountDetail } from "@/features/admin/marketing/discounts/queries/get-admin-discount-detail.query";

const mockDb = db as {
  discount: {
    findUnique: ReturnType<typeof vi.fn>;
  };
};

const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;

function decimalLike(value: number) {
  return { toNumber: () => value };
}

describe("getAdminDiscountDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne null si aucune boutique courante n'est trouvée", async () => {
    mockGetCurrentStoreId.mockResolvedValue(null);

    await expect(getAdminDiscountDetail("discount_1")).resolves.toBeNull();
    expect(mockDb.discount.findUnique).not.toHaveBeenCalled();
  });

  it("mappe les décimaux et les compteurs pour la page détail", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.discount.findUnique.mockResolvedValue({
      id: "discount_1",
      code: "PROMO-10",
      name: "Promo été",
      description: "10% sur la commande",
      status: "ACTIVE",
      type: "PERCENTAGE",
      scopeType: "ORDER",
      isAutomatic: false,
      priority: 0,
      percentageValue: decimalLike(10),
      fixedAmountValue: null,
      currencyCode: "EUR",
      startsAt: null,
      endsAt: null,
      maxRedemptions: 50,
      maxRedemptionsPerCode: 10,
      maxRedemptionsPerUser: 1,
      createdAt: new Date("2026-06-25T08:00:00.000Z"),
      _count: {
        redemptions: 3,
        codes: 2,
      },
      codes: [
        {
          id: "code_1",
          code: "PROMO-10-A",
          status: "ACTIVE",
          maxRedemptions: 5,
          redeemedCount: 2,
          startsAt: null,
          endsAt: null,
          createdAt: new Date("2026-06-25T08:30:00.000Z"),
        },
      ],
    });

    await expect(getAdminDiscountDetail("discount_1")).resolves.toEqual({
      id: "discount_1",
      code: "PROMO-10",
      name: "Promo été",
      description: "10% sur la commande",
      status: "ACTIVE",
      type: "PERCENTAGE",
      scopeType: "ORDER",
      isAutomatic: false,
      priority: 0,
      percentageValue: 10,
      fixedAmountValue: null,
      currencyCode: "EUR",
      startsAt: null,
      endsAt: null,
      maxRedemptions: 50,
      maxRedemptionsPerCode: 10,
      maxRedemptionsPerUser: 1,
      createdAt: new Date("2026-06-25T08:00:00.000Z"),
      redemptionsCount: 3,
      codesCount: 2,
      codes: [
        {
          id: "code_1",
          code: "PROMO-10-A",
          status: "ACTIVE",
          maxRedemptions: 5,
          redeemedCount: 2,
          startsAt: null,
          endsAt: null,
          createdAt: new Date("2026-06-25T08:30:00.000Z"),
        },
      ],
      _count: {
        redemptions: 3,
        codes: 2,
      },
    });
  });

  it("retourne null si la remise n'existe pas", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.discount.findUnique.mockResolvedValue(null);

    await expect(getAdminDiscountDetail("discount_1")).resolves.toBeNull();
  });
});
