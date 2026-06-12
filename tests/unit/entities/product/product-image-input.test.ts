import { describe, expect, it } from "vitest";
import {
  validateCreateProductImageInput,
  validateUpdateProductImageInput,
} from "@/entities/product/product-image-input";

describe("validateCreateProductImageInput", () => {
  it("valide une image produit nominale avec les valeurs par defaut utiles", () => {
    const result = validateCreateProductImageInput({
      mediaAssetId: " 12 ",
      variantId: " ",
      altText: "  Image principale  ",
      sortOrder: "",
      isPrimary: "on",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        mediaAssetId: "12",
        variantId: null,
        altText: "Image principale",
        sortOrder: 0,
        isPrimary: true,
      },
    });
  });

  // Contrat actuel : mediaAssetId et variantId sont des chaînes libres
  // (plus de contrainte de format — la validation d'existence se fait en DB).
  it("rejette un media asset manquant ou vide", () => {
    expect(
      validateCreateProductImageInput({
        mediaAssetId: "   ",
        variantId: null,
        altText: null,
        sortOrder: "0",
        isPrimary: null,
      })
    ).toEqual({
      ok: false,
      code: "missing_media_asset",
    });
  });

  it("accepte des identifiants libres pour le media asset et la variante", () => {
    expect(
      validateCreateProductImageInput({
        mediaAssetId: "abc",
        variantId: "variant-1",
        altText: null,
        sortOrder: "0",
        isPrimary: null,
      })
    ).toEqual({
      ok: true,
      data: {
        mediaAssetId: "abc",
        variantId: "variant-1",
        altText: null,
        sortOrder: 0,
        isPrimary: false,
      },
    });
  });
});

describe("validateUpdateProductImageInput", () => {
  it("valide une mise a jour d'image nominale", () => {
    const result = validateUpdateProductImageInput({
      altText: "  Detail produit  ",
      sortOrder: "4",
      isPrimary: "1",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        altText: "Detail produit",
        sortOrder: 4,
        isPrimary: true,
      },
    });
  });

  it("rejette un ordre invalide", () => {
    expect(
      validateUpdateProductImageInput({
        altText: null,
        sortOrder: "-1",
        isPrimary: null,
      })
    ).toEqual({
      ok: false,
      code: "invalid_sort_order",
    });
  });
});
