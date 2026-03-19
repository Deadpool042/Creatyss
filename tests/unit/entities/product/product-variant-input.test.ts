import { describe, expect, it } from "vitest";
import { validateProductVariantInput } from "@/entities/product/product-variant-input";

describe("validateProductVariantInput", () => {
  it("valide une variante nominale et normalise les montants", () => {
    const result = validateProductVariantInput({
      name: "  Variante Camel  ",
      colorName: "  Camel  ",
      colorHex: "#c19a6b",
      sku: "  SAC-CAMEL-001  ",
      price: "129,9",
      compareAtPrice: "149.00",
      stockQuantity: " 12 ",
      isDefault: "true",
      status: "published",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        name: "Variante Camel",
        colorName: "Camel",
        colorHex: "#C19A6B",
        sku: "SAC-CAMEL-001",
        price: "129.90",
        compareAtPrice: "149.00",
        stockQuantity: 12,
        isDefault: true,
        status: "published",
      },
    });
  });

  it("accepte une couleur vide et un prix compare absent", () => {
    const result = validateProductVariantInput({
      name: "Variante",
      colorName: "Noir",
      colorHex: " ",
      sku: "SKU-1",
      price: "10",
      compareAtPrice: "",
      stockQuantity: "0",
      isDefault: null,
      status: "draft",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        name: "Variante",
        colorName: "Noir",
        colorHex: null,
        sku: "SKU-1",
        price: "10.00",
        compareAtPrice: null,
        stockQuantity: 0,
        isDefault: false,
        status: "draft",
      },
    });
  });

  it("rejette un code couleur invalide", () => {
    expect(
      validateProductVariantInput({
        name: "Variante",
        colorName: "Noir",
        colorHex: "blue",
        sku: "SKU-1",
        price: "10",
        compareAtPrice: "",
        stockQuantity: "1",
        isDefault: null,
        status: "draft",
      })
    ).toEqual({
      ok: false,
      code: "invalid_color_hex",
    });
  });

  it("rejette un prix compare inferieur au prix", () => {
    expect(
      validateProductVariantInput({
        name: "Variante",
        colorName: "Noir",
        colorHex: "#000",
        sku: "SKU-1",
        price: "10",
        compareAtPrice: "9.99",
        stockQuantity: "1",
        isDefault: null,
        status: "draft",
      })
    ).toEqual({
      ok: false,
      code: "compare_at_price_below_price",
    });
  });

  it("rejette un stock manquant", () => {
    expect(
      validateProductVariantInput({
        name: "Variante",
        colorName: "Noir",
        colorHex: "#000",
        sku: "SKU-1",
        price: "10",
        compareAtPrice: "",
        stockQuantity: "",
        isDefault: null,
        status: "draft",
      })
    ).toEqual({
      ok: false,
      code: "missing_stock_quantity",
    });
  });

  it("rejette un stock negatif ou decimal", () => {
    expect(
      validateProductVariantInput({
        name: "Variante",
        colorName: "Noir",
        colorHex: "#000",
        sku: "SKU-1",
        price: "10",
        compareAtPrice: "",
        stockQuantity: "-1",
        isDefault: null,
        status: "draft",
      })
    ).toEqual({
      ok: false,
      code: "invalid_stock_quantity",
    });

    expect(
      validateProductVariantInput({
        name: "Variante",
        colorName: "Noir",
        colorHex: "#000",
        sku: "SKU-1",
        price: "10",
        compareAtPrice: "",
        stockQuantity: "1.5",
        isDefault: null,
        status: "draft",
      })
    ).toEqual({
      ok: false,
      code: "invalid_stock_quantity",
    });
  });
});
