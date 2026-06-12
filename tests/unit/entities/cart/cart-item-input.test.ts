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

  // Contrat actuel : l'identifiant de variante est une chaîne libre non vide
  // (plus de contrainte de format — la validation d'existence se fait en DB).
  it("accepte un identifiant de variante libre non vide", () => {
    expect(
      validateCartItemInput({
        variantId: "abc",
        quantity: "1",
      })
    ).toEqual({
      ok: true,
      data: {
        variantId: "abc",
        quantity: 1,
      },
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
