import { describe, expect, it } from "vitest";
import {
  resolveStripeCheckoutSessionState,
  type StripeCheckoutSessionStateInput
} from "@/features/payment/stripe-checkout-session-state";

function resolve(input: StripeCheckoutSessionStateInput) {
  return resolveStripeCheckoutSessionState(input);
}

describe("resolveStripeCheckoutSessionState", () => {
  it("reuses an open hosted checkout session when a url is available", () => {
    expect(
      resolve({
        status: "open",
        url: "https://checkout.stripe.com/c/pay/cs_test_123"
      })
    ).toEqual({
      kind: "reuse",
      url: "https://checkout.stripe.com/c/pay/cs_test_123"
    });
  });

  it("waits for confirmation when the checkout session is already complete", () => {
    expect(
      resolve({
        status: "complete",
        url: null
      })
    ).toEqual({
      kind: "await_confirmation"
    });
  });

  it("replaces an expired checkout session", () => {
    expect(
      resolve({
        status: "expired",
        url: null
      })
    ).toEqual({
      kind: "replace"
    });
  });

  it("marks an open session without url as unavailable", () => {
    expect(
      resolve({
        status: "open",
        url: null
      })
    ).toEqual({
      kind: "unavailable"
    });
  });
});
