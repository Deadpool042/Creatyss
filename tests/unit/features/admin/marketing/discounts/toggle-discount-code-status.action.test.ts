import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    discountCode: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/core/auth/admin/guard", () => ({
  requireAuthenticatedAdmin: vi.fn(),
}));

vi.mock("@/features/admin/store/queries/get-current-store-id.query", () => ({
  getCurrentStoreId: vi.fn(),
}));

vi.mock("@/features/feature-flags/queries/get-feature-level-state.query", () => ({
  meetsFeatureLevel: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { toggleDiscountCodeStatusAction } from "@/features/admin/marketing/discounts/actions/toggle-discount-code-status.action";

const mockDb = db as {
  discountCode: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;
const mockMeetsFeatureLevel = meetsFeatureLevel as ReturnType<typeof vi.fn>;
const mockRevalidatePath = revalidatePath as ReturnType<typeof vi.fn>;

describe("toggleDiscountCodeStatusAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMeetsFeatureLevel.mockResolvedValue(true);
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.discountCode.findFirst.mockResolvedValue({
      id: "code_1",
      status: "ACTIVE",
      archivedAt: null,
    });
    mockDb.discountCode.update.mockResolvedValue({
      id: "code_1",
      status: "INACTIVE",
    });
  });

  it("refuse si le niveau rules n'est pas atteint", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(false);

    await expect(toggleDiscountCodeStatusAction("discount_1", "code_1")).resolves.toEqual({
      ok: false,
      error: "Le niveau actuel n'autorise pas les codes secondaires.",
    });

    expect(mockDb.discountCode.findFirst).not.toHaveBeenCalled();
  });

  it("refuse si aucune boutique courante n'est trouvée", async () => {
    mockGetCurrentStoreId.mockResolvedValue(null);

    await expect(toggleDiscountCodeStatusAction("discount_1", "code_1")).resolves.toEqual({
      ok: false,
      error: "Aucune boutique courante.",
    });

    expect(mockDb.discountCode.findFirst).not.toHaveBeenCalled();
  });

  it("refuse si le code secondaire est introuvable", async () => {
    mockDb.discountCode.findFirst.mockResolvedValue(null);

    await expect(toggleDiscountCodeStatusAction("discount_1", "code_1")).resolves.toEqual({
      ok: false,
      error: "Code secondaire introuvable.",
    });

    expect(mockDb.discountCode.update).not.toHaveBeenCalled();
  });

  it("bascule ACTIVE vers INACTIVE et invalide la page détail", async () => {
    await expect(toggleDiscountCodeStatusAction("discount_1", "code_1")).resolves.toEqual({
      ok: true,
      newStatus: "INACTIVE",
    });

    expect(mockDb.discountCode.findFirst).toHaveBeenCalledWith({
      where: {
        id: "code_1",
        discountId: "discount_1",
        archivedAt: null,
        discount: { storeId: "store_1" },
      },
      select: { id: true, status: true, archivedAt: true },
    });
    expect(mockDb.discountCode.update).toHaveBeenCalledWith({
      where: { id: "code_1" },
      data: { status: "INACTIVE" },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/marketing/discounts/discount_1");
  });
});
