import { describe, expect, it } from "vitest";

import { simulateStripeRefund } from "@/features/admin/commerce/returns/services/simulate-stripe-refund.service";

const INPUT = { paymentIntentId: "pi_1", amountCents: 12900 };

describe("simulateStripeRefund", () => {
  it("retourne un id préfixé simulated_re_", async () => {
    const result = await simulateStripeRefund(INPUT);

    expect(result.id).toMatch(/^simulated_re_[0-9a-f]{16}$/);
  });

  it("est déterministe : même input → même id", async () => {
    const first = await simulateStripeRefund(INPUT);
    const second = await simulateStripeRefund(INPUT);

    expect(first.id).toBe(second.id);
  });

  it("produit un id différent pour un montant différent", async () => {
    const first = await simulateStripeRefund(INPUT);
    const second = await simulateStripeRefund({ ...INPUT, amountCents: 5000 });

    expect(first.id).not.toBe(second.id);
  });

  it("ne lève jamais d'exception", async () => {
    await expect(
      simulateStripeRefund({ paymentIntentId: "", amountCents: 0 })
    ).resolves.toBeDefined();
  });
});
