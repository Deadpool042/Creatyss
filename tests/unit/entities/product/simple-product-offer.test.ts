import { describe, expect, it } from "vitest";
import { resolveSimpleProductOffer } from "@/entities/product/simple-product-offer";

describe("resolveSimpleProductOffer", () => {
  it("prioritizes complete native simple fields", () => {
    expect(
      resolveSimpleProductOffer({
        native: {
          sku: "SIMPLE-001",
          price: "49",
          compareAtPrice: "59",
          stockQuantity: 3,
        },
        legacyOffers: [
          {
            sku: "LEGACY-001",
            price: "39.00",
            compareAtPrice: null,
            stockQuantity: 8,
          },
        ],
      })
    ).toEqual({
      sku: "SIMPLE-001",
      price: "49.00",
      compareAtPrice: "59.00",
      stockQuantity: 3,
      isAvailable: true,
    });
  });

  it("falls back to the only exploitable legacy offer when native fields are incomplete", () => {
    expect(
      resolveSimpleProductOffer({
        native: {
          sku: null,
          price: "49.00",
          compareAtPrice: null,
          stockQuantity: 3,
        },
        legacyOffers: [
          {
            sku: "LEGACY-001",
            price: "39.00",
            compareAtPrice: null,
            stockQuantity: 0,
          },
        ],
      })
    ).toEqual({
      sku: "LEGACY-001",
      price: "39.00",
      compareAtPrice: null,
      stockQuantity: 0,
      isAvailable: false,
    });
  });

  it("returns null when native fields are incomplete and no legacy offer is exploitable", () => {
    expect(
      resolveSimpleProductOffer({
        native: {
          sku: " ",
          price: "49.00",
          compareAtPrice: null,
          stockQuantity: 3,
        },
        legacyOffers: [
          {
            sku: " ",
            price: "39.00",
            compareAtPrice: null,
            stockQuantity: 4,
          },
        ],
      })
    ).toBeNull();
  });

  it("returns null when multiple legacy offers are exploitable", () => {
    expect(
      resolveSimpleProductOffer({
        native: {
          sku: null,
          price: null,
          compareAtPrice: null,
          stockQuantity: null,
        },
        legacyOffers: [
          {
            sku: "LEGACY-001",
            price: "39.00",
            compareAtPrice: null,
            stockQuantity: 4,
          },
          {
            sku: "LEGACY-002",
            price: "42.00",
            compareAtPrice: null,
            stockQuantity: 2,
          },
        ],
      })
    ).toBeNull();
  });
});
