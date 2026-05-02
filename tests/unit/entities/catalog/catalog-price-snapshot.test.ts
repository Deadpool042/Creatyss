import { describe, expect, it } from "vitest";
import { computeCatalogPriceSnapshot } from "@/entities/catalog/catalog-price-snapshot";

type PriceListInput = {
  id?: string;
  isDefault?: boolean;
  status?: "ACTIVE" | "DRAFT" | "INACTIVE" | "ARCHIVED";
  archivedAt?: Date | null;
  currencyCode?: "EUR" | "USD";
};

function buildPriceList(input: PriceListInput = {}) {
  return {
    id: input.id ?? "pl-default",
    isDefault: input.isDefault ?? true,
    status: input.status ?? "ACTIVE",
    archivedAt: input.archivedAt ?? null,
    currencyCode: input.currencyCode ?? "EUR",
  } as const;
}

describe("computeCatalogPriceSnapshot", () => {
  it("priorise un prix produit valide sur la price list par defaut active", () => {
    const snapshot = computeCatalogPriceSnapshot({
      prices: [
        {
          amount: { toString: () => "64.00" },
          isActive: true,
          archivedAt: null,
          priceList: buildPriceList(),
        },
      ],
      variants: [
        {
          status: "ACTIVE",
          archivedAt: null,
          prices: [
            {
              amount: { toString: () => "57.00" },
              isActive: true,
              archivedAt: null,
              priceList: buildPriceList(),
            },
          ],
        },
      ],
    });

    expect(snapshot).toEqual({
      catalogPriceCents: 6400,
      catalogPriceCurrencyCode: "EUR",
      catalogPriceSource: "PRODUCT",
    });
  });

  it("prend le minimum des prix variantes si aucun prix produit valide", () => {
    const snapshot = computeCatalogPriceSnapshot({
      prices: [],
      variants: [
        {
          status: "ACTIVE",
          archivedAt: null,
          prices: [
            {
              amount: { toString: () => "70.00" },
              isActive: true,
              archivedAt: null,
              priceList: buildPriceList(),
            },
          ],
        },
        {
          status: "ACTIVE",
          archivedAt: null,
          prices: [
            {
              amount: { toString: () => "57.00" },
              isActive: true,
              archivedAt: null,
              priceList: buildPriceList(),
            },
          ],
        },
      ],
    });

    expect(snapshot).toEqual({
      catalogPriceCents: 5700,
      catalogPriceCurrencyCode: "EUR",
      catalogPriceSource: "PRODUCT_VARIANT",
    });
  });

  it("retourne des nulls quand aucune source de prix valide n'existe", () => {
    const snapshot = computeCatalogPriceSnapshot({
      prices: [
        {
          amount: { toString: () => "64.00" },
          isActive: false,
          archivedAt: null,
          priceList: buildPriceList(),
        },
      ],
      variants: [
        {
          status: "INACTIVE",
          archivedAt: null,
          prices: [
            {
              amount: { toString: () => "57.00" },
              isActive: true,
              archivedAt: null,
              priceList: buildPriceList(),
            },
          ],
        },
      ],
    });

    expect(snapshot).toEqual({
      catalogPriceCents: null,
      catalogPriceCurrencyCode: null,
      catalogPriceSource: null,
    });
  });

  it("ignore les prix archives et les price lists non default ou non actives", () => {
    const snapshot = computeCatalogPriceSnapshot({
      prices: [
        {
          amount: { toString: () => "64.00" },
          isActive: true,
          archivedAt: new Date("2026-01-01T00:00:00.000Z"),
          priceList: buildPriceList(),
        },
        {
          amount: { toString: () => "59.00" },
          isActive: true,
          archivedAt: null,
          priceList: buildPriceList({ isDefault: false }),
        },
        {
          amount: { toString: () => "58.00" },
          isActive: true,
          archivedAt: null,
          priceList: buildPriceList({ status: "DRAFT" }),
        },
      ],
      variants: [],
    });

    expect(snapshot).toEqual({
      catalogPriceCents: null,
      catalogPriceCurrencyCode: null,
      catalogPriceSource: null,
    });
  });

  it("convertit Decimal vers centimes et ignore les formats invalides", () => {
    const snapshot = computeCatalogPriceSnapshot({
      prices: [
        {
          amount: { toString: () => "12" },
          isActive: true,
          archivedAt: null,
          priceList: buildPriceList(),
        },
        {
          amount: { toString: () => "12.345" },
          isActive: true,
          archivedAt: null,
          priceList: buildPriceList(),
        },
      ],
      variants: [],
    });

    expect(snapshot).toEqual({
      catalogPriceCents: 1200,
      catalogPriceCurrencyCode: "EUR",
      catalogPriceSource: "PRODUCT",
    });
  });
});
