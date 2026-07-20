import { describe, expect, it } from "vitest";

import {
  simulateStripeCheckoutSessionCreate,
  simulateStripeCheckoutSessionRetrieve,
} from "@/features/commerce/payment/services/simulate-stripe-checkout.service";

describe("simulateStripeCheckoutSessionRetrieve", () => {
  it("retourne toujours status: expired, url: null (force la branche replace existante)", async () => {
    const result = await simulateStripeCheckoutSessionRetrieve({ sessionId: "cs_any" });

    expect(result).toEqual({ status: "expired", url: null });
  });

  it("ne lève jamais d'exception", async () => {
    await expect(simulateStripeCheckoutSessionRetrieve({ sessionId: "" })).resolves.toBeDefined();
  });
});

const CREATE_INPUT = {
  orderId: "order_1",
  reference: "REF-1",
  totalAmountCents: 12900,
  currencyCode: "eur",
};

describe("simulateStripeCheckoutSessionCreate", () => {
  it("retourne un id et un payment_intent préfixés simulated_ et une url de confirmation locale", async () => {
    const result = await simulateStripeCheckoutSessionCreate(CREATE_INPUT);

    expect(result.id).toMatch(/^simulated_cs_[0-9a-f]{16}$/);
    expect(result.payment_intent).toMatch(/^simulated_pi_[0-9a-f]{16}$/);
    expect(result.url).toBe("/checkout/confirmation/REF-1?payment=return");
  });

  it("est déterministe : même input → même id", async () => {
    const first = await simulateStripeCheckoutSessionCreate(CREATE_INPUT);
    const second = await simulateStripeCheckoutSessionCreate(CREATE_INPUT);

    expect(first.id).toBe(second.id);
    expect(first.payment_intent).toBe(second.payment_intent);
  });

  it("produit un id différent pour un montant différent", async () => {
    const first = await simulateStripeCheckoutSessionCreate(CREATE_INPUT);
    const second = await simulateStripeCheckoutSessionCreate({
      ...CREATE_INPUT,
      totalAmountCents: 5000,
    });

    expect(first.id).not.toBe(second.id);
  });

  it("ne lève jamais d'exception", async () => {
    await expect(
      simulateStripeCheckoutSessionCreate({
        orderId: "",
        reference: "",
        totalAmountCents: 0,
        currencyCode: "",
      })
    ).resolves.toBeDefined();
  });
});
