import { describe, expect, it } from "vitest";
import { validateSimpleProductOfferInput } from "@/entities/product/simple-product-offer-input";

describe("validateSimpleProductOfferInput", () => {
  it("valide une offre simple native nominale", () => {
    expect(
      validateSimpleProductOfferInput({
        sku: "  SIMPLE-001  ",
        price: "49",
        compareAtPrice: "59",
        stockQuantity: "3",
      })
    ).toEqual({
      ok: true,
      data: {
        sku: "SIMPLE-001",
        price: "49.00",
        compareAtPrice: "59.00",
        stockQuantity: 3,
      },
    });
  });

  it("accepte un prix compare vide", () => {
    expect(
      validateSimpleProductOfferInput({
        sku: "SIMPLE-002",
        price: "89.90",
        compareAtPrice: " ",
        stockQuantity: "0",
      })
    ).toEqual({
      ok: true,
      data: {
        sku: "SIMPLE-002",
        price: "89.90",
        compareAtPrice: null,
        stockQuantity: 0,
      },
    });
  });

  it("rejette un prix invalide", () => {
    expect(
      validateSimpleProductOfferInput({
        sku: "SIMPLE-003",
        price: "-10",
        compareAtPrice: null,
        stockQuantity: "1",
      })
    ).toEqual({
      ok: false,
      code: "invalid_price",
    });
  });

  it("rejette un prix compare inferieur au prix", () => {
    expect(
      validateSimpleProductOfferInput({
        sku: "SIMPLE-004",
        price: "49",
        compareAtPrice: "39",
        stockQuantity: "1",
      })
    ).toEqual({
      ok: false,
      code: "compare_at_price_below_price",
    });
  });

  it("rejette un stock invalide", () => {
    expect(
      validateSimpleProductOfferInput({
        sku: "SIMPLE-005",
        price: "49",
        compareAtPrice: null,
        stockQuantity: "-1",
      })
    ).toEqual({
      ok: false,
      code: "invalid_stock_quantity",
    });
  });
});
