import { afterEach, beforeEach, describe, expect, it } from "vitest";

// isStripeConfigured est dans un module dédié sans parse Zod strict,
// ce qui permet de l'importer directement dans Vitest (avec stub server-only).
import { isStripeConfigured } from "@/core/config/env/stripe";

describe("isStripeConfigured", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("retourne true quand les deux clés sont présentes et non-placeholder", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_real_key";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_real_secret";

    expect(isStripeConfigured()).toBe(true);
  });

  it("retourne false quand STRIPE_SECRET_KEY est absent", () => {
    delete process.env.STRIPE_SECRET_KEY;
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_real_secret";

    expect(isStripeConfigured()).toBe(false);
  });

  it("retourne false quand STRIPE_WEBHOOK_SECRET est absent", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_real_key";
    delete process.env.STRIPE_WEBHOOK_SECRET;

    expect(isStripeConfigured()).toBe(false);
  });

  it("retourne false quand STRIPE_SECRET_KEY est le placeholder", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_change_me";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_real_secret";

    expect(isStripeConfigured()).toBe(false);
  });

  it("retourne false quand STRIPE_WEBHOOK_SECRET est le placeholder", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_real_key";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_change_me";

    expect(isStripeConfigured()).toBe(false);
  });

  it("retourne false quand les deux clés sont des chaînes vides", () => {
    process.env.STRIPE_SECRET_KEY = "";
    process.env.STRIPE_WEBHOOK_SECRET = "";

    expect(isStripeConfigured()).toBe(false);
  });
});
