import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockMeetsFeatureLevel, mockDb } = vi.hoisted(() => ({
  mockMeetsFeatureLevel: vi.fn(),
  mockDb: {
    store: { findUnique: vi.fn() },
    localizationLocale: { findMany: vi.fn() },
    localizedValue: { findMany: vi.fn() },
  },
}));

vi.mock("@/core/db", () => ({ db: mockDb }));
vi.mock("@/features/feature-flags/queries/get-feature-level-state.query", () => ({
  meetsFeatureLevel: mockMeetsFeatureLevel,
}));

import { resolveLocalizedOrderEmailCopy } from "@/features/email/order/resolve-localized-order-email-copy";

const STORE_ID = "store_1";
const LOCALE_FR = "locale_fr";
const LOCALE_EN = "locale_en";

function stubTwoLocalesStore(): void {
  mockDb.store.findUnique.mockResolvedValue({ defaultLocaleCode: "fr" });
  mockDb.localizationLocale.findMany.mockResolvedValue([
    { id: LOCALE_FR, code: "fr", isDefault: true },
    { id: LOCALE_EN, code: "en", isDefault: false },
  ]);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockMeetsFeatureLevel.mockResolvedValue(true);
  mockDb.localizedValue.findMany.mockResolvedValue([]);
});

describe("resolveLocalizedOrderEmailCopy", () => {
  it("applique l'override si une LocalizedValue ACTIVE existe pour la locale demandée", async () => {
    stubTwoLocalesStore();
    mockDb.localizedValue.findMany.mockResolvedValue([
      {
        fieldName: "title",
        localeId: LOCALE_EN,
        valueText: "Order created",
        status: "ACTIVE",
      },
    ]);

    const overrides = await resolveLocalizedOrderEmailCopy({
      storeId: STORE_ID,
      eventType: "order_created",
      localeCode: "en",
    });

    expect(overrides.title).toBe("Order created");
  });

  it("ne modifie rien (littéraux en dur) si aucune traduction n'existe", async () => {
    stubTwoLocalesStore();

    const overrides = await resolveLocalizedOrderEmailCopy({
      storeId: STORE_ID,
      eventType: "order_created",
      localeCode: "en",
    });

    expect(overrides).toEqual({});
  });

  it("ne modifie rien si le localeCode demandé correspond à la locale par défaut", async () => {
    stubTwoLocalesStore();
    mockDb.localizedValue.findMany.mockResolvedValue([
      {
        fieldName: "title",
        localeId: LOCALE_FR,
        valueText: "Ne doit jamais être exposé",
        status: "ACTIVE",
      },
    ]);

    const overrides = await resolveLocalizedOrderEmailCopy({
      storeId: STORE_ID,
      eventType: "order_created",
      localeCode: "fr",
    });

    expect(overrides).toEqual({});
    expect(mockDb.localizedValue.findMany).not.toHaveBeenCalled();
  });

  it("ne modifie rien si la fonctionnalité multilingue n'est pas active", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(false);

    const overrides = await resolveLocalizedOrderEmailCopy({
      storeId: STORE_ID,
      eventType: "order_created",
      localeCode: "en",
    });

    expect(overrides).toEqual({});
    expect(mockDb.localizationLocale.findMany).not.toHaveBeenCalled();
  });

  it("ne modifie rien si le store a moins de deux locales actives", async () => {
    mockDb.store.findUnique.mockResolvedValue({ defaultLocaleCode: "fr" });
    mockDb.localizationLocale.findMany.mockResolvedValue([
      { id: LOCALE_FR, code: "fr", isDefault: true },
    ]);

    const overrides = await resolveLocalizedOrderEmailCopy({
      storeId: STORE_ID,
      eventType: "order_created",
      localeCode: "en",
    });

    expect(overrides).toEqual({});
  });

  it("ne remonte pas une LocalizedValue INACTIVE", async () => {
    stubTwoLocalesStore();
    mockDb.localizedValue.findMany.mockResolvedValue([
      {
        fieldName: "title",
        localeId: LOCALE_EN,
        valueText: "Order created",
        status: "INACTIVE",
      },
    ]);

    const overrides = await resolveLocalizedOrderEmailCopy({
      storeId: STORE_ID,
      eventType: "order_created",
      localeCode: "en",
    });

    expect(overrides).toEqual({});
  });

  it("résout un catalogue distinct par eventType (payment_succeeded)", async () => {
    stubTwoLocalesStore();
    mockDb.localizedValue.findMany.mockResolvedValue([
      {
        fieldName: "title",
        localeId: LOCALE_EN,
        valueText: "Payment confirmed",
        status: "ACTIVE",
      },
    ]);

    const overrides = await resolveLocalizedOrderEmailCopy({
      storeId: STORE_ID,
      eventType: "payment_succeeded",
      localeCode: "en",
    });

    expect(overrides.title).toBe("Payment confirmed");
    expect(mockDb.localizedValue.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ subjectId: "payment_succeeded" }),
      })
    );
  });
});
