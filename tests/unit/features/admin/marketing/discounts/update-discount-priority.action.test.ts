import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    discount: {
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
import { updateDiscountPriorityAction } from "@/features/admin/marketing/discounts/actions/update-discount-priority.action";

const mockDb = db as {
  discount: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
};

const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;
const mockMeetsFeatureLevel = meetsFeatureLevel as ReturnType<typeof vi.fn>;
const mockRevalidatePath = revalidatePath as ReturnType<typeof vi.fn>;

describe("updateDiscountPriorityAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMeetsFeatureLevel.mockResolvedValue(true);
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.discount.findFirst.mockResolvedValue({
      id: "discount_1",
      isAutomatic: true,
      archivedAt: null,
    });
    mockDb.discount.update.mockResolvedValue({ id: "discount_1", priority: 4 });
  });

  it("refuse une priorité négative", async () => {
    await expect(updateDiscountPriorityAction("discount_1", -1)).resolves.toEqual({
      ok: false,
      error: "La priorité doit être un entier positif ou nul.",
    });

    expect(mockDb.discount.findFirst).not.toHaveBeenCalled();
  });

  it("refuse si le niveau automation n'est pas atteint", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(false);

    await expect(updateDiscountPriorityAction("discount_1", 4)).resolves.toEqual({
      ok: false,
      error: "Le niveau actuel n'autorise pas la priorite.",
    });

    expect(mockDb.discount.findFirst).not.toHaveBeenCalled();
  });

  it("refuse une remise non automatique", async () => {
    mockDb.discount.findFirst.mockResolvedValue({
      id: "discount_1",
      isAutomatic: false,
      archivedAt: null,
    });

    await expect(updateDiscountPriorityAction("discount_1", 4)).resolves.toEqual({
      ok: false,
      error: "La priorité ne peut être modifiée que pour les remises automatiques.",
    });

    expect(mockDb.discount.update).not.toHaveBeenCalled();
  });

  it("met à jour la priorité et invalide la page détail", async () => {
    await expect(updateDiscountPriorityAction("discount_1", 4)).resolves.toEqual({
      ok: true,
      newPriority: 4,
    });

    expect(mockDb.discount.findFirst).toHaveBeenCalledWith({
      where: { id: "discount_1", storeId: "store_1", archivedAt: null },
      select: { id: true, isAutomatic: true, archivedAt: true },
    });
    expect(mockDb.discount.update).toHaveBeenCalledWith({
      where: { id: "discount_1" },
      data: { priority: 4 },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/marketing/discounts/discount_1");
  });
});
