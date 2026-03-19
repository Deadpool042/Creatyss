import { describe, expect, it } from "vitest";
import { validateCartItemInput } from "@/entities/cart/cart-item-input";

describe("validateCartItemInput", () => {
  it("valide une ligne panier nominale", () => {
    expect(
      validateCartItemInput({
        variantId: " 12 ",
        quantity: " 3 ",
      })
    ).toEqual({
      ok: true,
      data: {
        variantId: "12",
        quantity: 3,
      },
    });
  });

  it("rejette un identifiant de variante manquant", () => {
    expect(
      validateCartItemInput({
        variantId: "",
        quantity: "1",
      })
    ).toEqual({
      ok: false,
      code: "missing_variant_id",
    });
  });

  it("rejette un identifiant de variante invalide", () => {
    expect(
      validateCartItemInput({
        variantId: "abc",
        quantity: "1",
      })
    ).toEqual({
      ok: false,
      code: "invalid_variant_id",
    });
  });

  it("rejette une quantite manquante", () => {
    expect(
      validateCartItemInput({
        variantId: "1",
        quantity: "",
      })
    ).toEqual({
      ok: false,
      code: "missing_quantity",
    });
  });

  it("rejette une quantite nulle, negative ou decimale", () => {
    expect(
      validateCartItemInput({
        variantId: "1",
        quantity: "0",
      })
    ).toEqual({
      ok: false,
      code: "invalid_quantity",
    });

    expect(
      validateCartItemInput({
        variantId: "1",
        quantity: "-1",
      })
    ).toEqual({
      ok: false,
      code: "invalid_quantity",
    });

    expect(
      validateCartItemInput({
        variantId: "1",
        quantity: "1.5",
      })
    ).toEqual({
      ok: false,
      code: "invalid_quantity",
    });
  });
});
