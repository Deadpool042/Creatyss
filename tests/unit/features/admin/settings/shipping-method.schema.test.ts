import { describe, expect, it } from "vitest";

import {
  createShippingMethodSchema,
  updateShippingMethodSchema,
} from "@/features/admin/settings/schemas/shipping-method.schema";

const VALID_CREATE_INPUT = {
  code: "EXPRESS",
  name: "Livraison express",
  shippingZoneId: "zone_1",
  amount: "9.90",
  currencyCode: "EUR",
  minSubtotalAmount: "",
  maxSubtotalAmount: "",
  isDefault: false,
};

describe("createShippingMethodSchema", () => {
  it("valide une entrée complète correcte", () => {
    const result = createShippingMethodSchema.safeParse(VALID_CREATE_INPUT);
    expect(result.success).toBe(true);
  });

  it("chaîne vide pour les seuils → null", () => {
    const result = createShippingMethodSchema.safeParse(VALID_CREATE_INPUT);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.minSubtotalAmount).toBeNull();
    expect(result.data.maxSubtotalAmount).toBeNull();
  });

  it("refuse un seuil minimum supérieur au seuil maximum", () => {
    const result = createShippingMethodSchema.safeParse({
      ...VALID_CREATE_INPUT,
      minSubtotalAmount: "100",
      maxSubtotalAmount: "50",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0]?.path).toEqual(["maxSubtotalAmount"]);
  });

  it("accepte un seuil minimum égal au seuil maximum", () => {
    const result = createShippingMethodSchema.safeParse({
      ...VALID_CREATE_INPUT,
      minSubtotalAmount: "50",
      maxSubtotalAmount: "50",
    });
    expect(result.success).toBe(true);
  });

  it("accepte une plage valide (min < max)", () => {
    const result = createShippingMethodSchema.safeParse({
      ...VALID_CREATE_INPUT,
      minSubtotalAmount: "20",
      maxSubtotalAmount: "80",
    });
    expect(result.success).toBe(true);
  });

  it("n'applique pas la contrainte de plage si un seul seuil est renseigné", () => {
    const result = createShippingMethodSchema.safeParse({
      ...VALID_CREATE_INPUT,
      minSubtotalAmount: "50",
      maxSubtotalAmount: "",
    });
    expect(result.success).toBe(true);
  });

  it("refuse un code invalide", () => {
    const result = createShippingMethodSchema.safeParse({
      ...VALID_CREATE_INPUT,
      code: "a",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateShippingMethodSchema", () => {
  it("refuse aussi un seuil minimum supérieur au seuil maximum", () => {
    const result = updateShippingMethodSchema.safeParse({
      name: "Livraison express",
      amount: "9.90",
      minSubtotalAmount: "100",
      maxSubtotalAmount: "50",
      isDefault: false,
    });
    expect(result.success).toBe(false);
  });
});
