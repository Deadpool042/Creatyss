import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockMeetsFeatureLevel, mockReadLocalePreferenceCookie, mockDb } = vi.hoisted(() => ({
  mockMeetsFeatureLevel: vi.fn(),
  mockReadLocalePreferenceCookie: vi.fn(),
  mockDb: {
    store: { findUnique: vi.fn() },
    localizationLocale: { findMany: vi.fn() },
    localizedValue: { findMany: vi.fn() },
  },
}));

vi.mock("@/core/db", () => ({ db: mockDb }));
vi.mock("@/core/sessions/locale-preference", () => ({
  readLocalePreferenceCookie: mockReadLocalePreferenceCookie,
}));
vi.mock("@/features/feature-flags/queries/get-feature-level-state.query", () => ({
  meetsFeatureLevel: mockMeetsFeatureLevel,
}));

import { resolveLocalizedProductCopy } from "@/features/storefront/catalog/queries/resolve-localized-product-copy";

const STORE_FR_EN = "store_1";
const STORE_OTHER = "store_2";
const LOCALE_FR = "locale_fr";
const LOCALE_EN = "locale_en";

type ProductFixture = {
  id: string;
  storeId: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
};

function makeProduct(overrides: Partial<ProductFixture> & { id: string }): ProductFixture {
  return {
    storeId: STORE_FR_EN,
    name: "Nom FR",
    shortDescription: "Description courte FR",
    description: "Description longue FR",
    ...overrides,
  };
}

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
  mockReadLocalePreferenceCookie.mockResolvedValue("en");
  mockDb.localizedValue.findMany.mockResolvedValue([]);
});

describe("resolveLocalizedProductCopy", () => {
  it("retourne les champs traduits ACTIVE pour la locale visiteur", async () => {
    stubTwoLocalesStore();
    mockDb.localizedValue.findMany.mockResolvedValue([
      {
        subjectId: "product_1",
        fieldName: "name",
        localeId: LOCALE_EN,
        valueText: "Name EN",
        status: "ACTIVE",
      },
      {
        subjectId: "product_1",
        fieldName: "shortDescription",
        localeId: LOCALE_EN,
        valueText: "Short EN",
        status: "ACTIVE",
      },
    ]);

    const [result] = await resolveLocalizedProductCopy([makeProduct({ id: "product_1" })]);

    expect(result).toEqual({
      id: "product_1",
      storeId: STORE_FR_EN,
      name: "Name EN",
      shortDescription: "Short EN",
      description: "Description longue FR",
    });
  });

  it("retombe sur la valeur canonique si aucune traduction n'existe", async () => {
    stubTwoLocalesStore();

    const [result] = await resolveLocalizedProductCopy([makeProduct({ id: "product_1" })]);

    expect(result).toEqual(makeProduct({ id: "product_1" }));
  });

  it("n'expose pas une traduction vide ou INACTIVE", async () => {
    stubTwoLocalesStore();
    mockDb.localizedValue.findMany.mockResolvedValue([
      {
        subjectId: "product_1",
        fieldName: "name",
        localeId: LOCALE_EN,
        valueText: "",
        status: "INACTIVE",
      },
    ]);

    const [result] = await resolveLocalizedProductCopy([makeProduct({ id: "product_1" })]);

    expect(result?.name).toBe("Nom FR");
  });

  it("ne modifie rien si la fonctionnalité multilingue n'est pas active", async () => {
    mockMeetsFeatureLevel.mockResolvedValue(false);

    const source = makeProduct({ id: "product_1" });
    const [result] = await resolveLocalizedProductCopy([source]);

    expect(result).toEqual(source);
    expect(mockDb.localizedValue.findMany).not.toHaveBeenCalled();
  });

  it("isole les traductions par boutique (aucune fuite entre stores)", async () => {
    mockDb.store.findUnique.mockImplementation(async ({ where }: { where: { id: string } }) => {
      return where.id === STORE_FR_EN ? { defaultLocaleCode: "fr" } : { defaultLocaleCode: "fr" };
    });
    mockDb.localizationLocale.findMany.mockImplementation(
      async ({ where }: { where: { storeId: string } }) => {
        if (where.storeId === STORE_FR_EN) {
          return [
            { id: LOCALE_FR, code: "fr", isDefault: true },
            { id: LOCALE_EN, code: "en", isDefault: false },
          ];
        }
        // Boutique isolée : une seule locale active → pas de multilingue.
        return [{ id: "locale_other_default", code: "fr", isDefault: true }];
      }
    );
    mockDb.localizedValue.findMany.mockImplementation(
      async ({ where }: { where: { storeId: string; subjectId: { in: string[] } } }) => {
        expect(where.storeId).toBe(STORE_FR_EN);
        return [
          {
            subjectId: "product_1",
            fieldName: "name",
            localeId: LOCALE_EN,
            valueText: "Name EN",
            status: "ACTIVE",
          },
        ];
      }
    );

    const [productA, productB] = await resolveLocalizedProductCopy([
      makeProduct({ id: "product_1", storeId: STORE_FR_EN }),
      makeProduct({ id: "product_2", storeId: STORE_OTHER, name: "Nom autre boutique" }),
    ]);

    expect(productA?.name).toBe("Name EN");
    expect(productB?.name).toBe("Nom autre boutique");
    expect(mockDb.localizedValue.findMany).toHaveBeenCalledTimes(1);
  });

  it("préserve les valeurs canoniques inchangées quand la locale demandée est la locale par défaut", async () => {
    mockReadLocalePreferenceCookie.mockResolvedValue("fr");
    stubTwoLocalesStore();

    const source = makeProduct({ id: "product_1" });
    const [result] = await resolveLocalizedProductCopy([source]);

    expect(result).toEqual(source);
    expect(mockDb.localizedValue.findMany).not.toHaveBeenCalled();
  });
});
