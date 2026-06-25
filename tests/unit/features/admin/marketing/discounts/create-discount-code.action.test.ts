import { beforeEach, describe, expect, it, vi } from "vitest";

class RedirectError extends Error {
  constructor(readonly destination: string) {
    super(`Redirect to ${destination}`);
  }
}

vi.mock("@/core/db", () => ({
  db: {
    discount: {
      findFirst: vi.fn(),
    },
    discountCode: {
      create: vi.fn(),
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

vi.mock("next/navigation", () => ({
  redirect: vi.fn((destination: string) => {
    throw new RedirectError(destination);
  }),
}));

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { createDiscountCodeAction } from "@/features/admin/marketing/discounts/actions/create-discount-code.action";

const mockDb = db as {
  discount: {
    findFirst: ReturnType<typeof vi.fn>;
  };
  discountCode: {
    create: ReturnType<typeof vi.fn>;
  };
};

const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;
const mockMeetsFeatureLevel = meetsFeatureLevel as ReturnType<typeof vi.fn>;
const mockRevalidatePath = revalidatePath as ReturnType<typeof vi.fn>;
const mockRedirect = redirect as ReturnType<typeof vi.fn>;

function buildFormData(values: Readonly<Record<string, string>>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}

describe("createDiscountCodeAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMeetsFeatureLevel.mockResolvedValue(true);
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.discount.findFirst.mockResolvedValue({ id: "discount_1", archivedAt: null });
    mockDb.discountCode.create.mockResolvedValue({ id: "code_1" });
  });

  it("redirige vers le détail si le niveau rules n'est pas disponible", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(false);

    await expect(
      createDiscountCodeAction(
        "discount_1",
        buildFormData({
          code: "PROMO-10",
          maxRedemptions: "",
          startsAt: "",
          endsAt: "",
        })
      )
    ).rejects.toMatchObject({
      destination: "/admin/marketing/discounts/discount_1?code_error=rules_unavailable",
    });

    expect(mockDb.discountCode.create).not.toHaveBeenCalled();
  });

  it("crée un code secondaire puis invalide la page détail", async () => {
    await expect(
      createDiscountCodeAction(
        "discount_1",
        buildFormData({
          code: "promo-10",
          maxRedemptions: "5",
          startsAt: "",
          endsAt: "",
        })
      )
    ).rejects.toMatchObject({
      destination: "/admin/marketing/discounts/discount_1?code_created=1",
    });

    expect(mockDb.discount.findFirst).toHaveBeenCalledWith({
      where: { id: "discount_1", storeId: "store_1", archivedAt: null },
      select: { id: true, archivedAt: true },
    });
    expect(mockDb.discountCode.create).toHaveBeenCalledWith({
      data: {
        discountId: "discount_1",
        code: "PROMO-10",
        maxRedemptions: 5,
        startsAt: null,
        endsAt: null,
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/marketing/discounts/discount_1");
  });

  it("redirige avec duplicate_code si Prisma remonte une contrainte d'unicité", async () => {
    mockDb.discountCode.create.mockRejectedValue({ code: "P2002" });

    await expect(
      createDiscountCodeAction(
        "discount_1",
        buildFormData({
          code: "PROMO-10",
          maxRedemptions: "",
          startsAt: "",
          endsAt: "",
        })
      )
    ).rejects.toMatchObject({
      destination: "/admin/marketing/discounts/discount_1?code_error=duplicate_code",
    });

    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("redirige vers la liste si aucune boutique courante n'est trouvée", async () => {
    mockGetCurrentStoreId.mockResolvedValue(null);

    await expect(
      createDiscountCodeAction(
        "discount_1",
        buildFormData({
          code: "PROMO-10",
          maxRedemptions: "",
          startsAt: "",
          endsAt: "",
        })
      )
    ).rejects.toMatchObject({
      destination: "/admin/marketing/discounts?discount_error=missing_store",
    });

    expect(mockDb.discount.findFirst).not.toHaveBeenCalled();
  });

  it("redirige avec invalid_input si la fenêtre de validité est incohérente", async () => {
    await expect(
      createDiscountCodeAction(
        "discount_1",
        buildFormData({
          code: "PROMO-10",
          maxRedemptions: "",
          startsAt: "2026-06-30T10:00",
          endsAt: "2026-06-29T10:00",
        })
      )
    ).rejects.toMatchObject({
      destination: "/admin/marketing/discounts/discount_1?code_error=invalid_input",
    });

    expect(mockDb.discount.findFirst).not.toHaveBeenCalled();
    expect(mockDb.discountCode.create).not.toHaveBeenCalled();
  });

  it("déclenche bien les redirections Next attendues", () => {
    expect(mockRedirect).toBeDefined();
  });
});
