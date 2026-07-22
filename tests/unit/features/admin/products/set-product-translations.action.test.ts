import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockMeetsFeatureLevel, mockGetCurrentStoreId, mockRevalidatePath, mockDb } = vi.hoisted(
  () => ({
    mockMeetsFeatureLevel: vi.fn(),
    mockGetCurrentStoreId: vi.fn(),
    mockRevalidatePath: vi.fn(),
    mockDb: {
      product: { findFirst: vi.fn() },
      localizationLocale: { findFirst: vi.fn() },
      $transaction: vi.fn(),
      localizedValue: { upsert: vi.fn() },
    },
  })
);

vi.mock("next/cache", () => ({ revalidatePath: mockRevalidatePath }));
vi.mock("@/core/db", () => ({ db: mockDb }));
vi.mock("@/features/admin/store/queries/get-current-store-id.query", () => ({
  getCurrentStoreId: mockGetCurrentStoreId,
}));
vi.mock("@/features/feature-flags/queries/get-feature-level-state.query", () => ({
  meetsFeatureLevel: mockMeetsFeatureLevel,
}));

import { setProductTranslationsAction } from "@/features/admin/products/actions/set-product-translations.action";

const STORE_ID = "store_1";

function buildFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockMeetsFeatureLevel.mockResolvedValue(true);
  mockGetCurrentStoreId.mockResolvedValue(STORE_ID);
  mockDb.$transaction.mockImplementation(async (ops: unknown[]) => Promise.all(ops));
});

describe("setProductTranslationsAction", () => {
  it("refuse l'écriture si la fonctionnalité multilingue n'est pas active", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(false);

    const result = await setProductTranslationsAction(
      { status: "idle", message: "" },
      buildFormData({ productId: "product_1", name: "Nom EN" })
    );

    expect(result.status).toBe("error");
    expect(mockDb.product.findFirst).not.toHaveBeenCalled();
  });

  it("refuse l'écriture pour un produit appartenant à une autre boutique", async () => {
    // Le produit existe mais pas dans la boutique courante : le
    // `where: { id, storeId, archivedAt: null }` ne le trouve pas.
    mockDb.product.findFirst.mockResolvedValue(null);

    const result = await setProductTranslationsAction(
      { status: "idle", message: "" },
      buildFormData({ productId: "product_from_other_store", name: "Nom EN" })
    );

    expect(result.status).toBe("error");
    expect(result.message).toBe("Produit introuvable.");
    expect(mockDb.product.findFirst).toHaveBeenCalledWith({
      where: { id: "product_from_other_store", storeId: STORE_ID, archivedAt: null },
      select: { id: true, slug: true },
    });
    expect(mockDb.$transaction).not.toHaveBeenCalled();
  });

  it("refuse l'écriture si la boutique n'a pas de langue secondaire active", async () => {
    mockDb.product.findFirst.mockResolvedValue({ id: "product_1", slug: "produit-1" });
    mockDb.localizationLocale.findFirst.mockResolvedValue(null);

    const result = await setProductTranslationsAction(
      { status: "idle", message: "" },
      buildFormData({ productId: "product_1", name: "Nom EN" })
    );

    expect(result.status).toBe("error");
    expect(mockDb.$transaction).not.toHaveBeenCalled();
  });

  it("enregistre les traductions ACTIVE pour un produit de la boutique courante", async () => {
    mockDb.product.findFirst.mockResolvedValue({ id: "product_1", slug: "produit-1" });
    mockDb.localizationLocale.findFirst.mockResolvedValue({ id: "locale_en" });
    mockDb.localizedValue.upsert.mockImplementation(
      async (args: { create: { fieldName: string; status: string; valueText: string } }) => args
    );

    const result = await setProductTranslationsAction(
      { status: "idle", message: "" },
      buildFormData({
        productId: "product_1",
        name: "Name EN",
        shortDescription: "",
        description: "Long description EN",
      })
    );

    expect(result.status).toBe("success");
    expect(mockDb.localizedValue.upsert).toHaveBeenCalledTimes(3);

    const upsertArgs = mockDb.localizedValue.upsert.mock.calls.map(
      ([args]: [{ create: { fieldName: string; status: string; valueText: string } }]) =>
        args.create
    );

    const byField = new Map(upsertArgs.map((entry) => [entry.fieldName, entry]));

    expect(byField.get("name")).toEqual(
      expect.objectContaining({ valueText: "Name EN", status: "ACTIVE" })
    );
    expect(byField.get("shortDescription")).toEqual(
      expect.objectContaining({ valueText: "", status: "INACTIVE" })
    );
    expect(byField.get("description")).toEqual(
      expect.objectContaining({ valueText: "Long description EN", status: "ACTIVE" })
    );
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/catalog/products/produit-1/edit");
  });
});
