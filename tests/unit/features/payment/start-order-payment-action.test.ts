import { beforeEach, describe, expect, it, vi } from "vitest";

class RedirectError extends Error {
  constructor(readonly destination: string) {
    super(`Redirect to ${destination}`);
  }
}

vi.mock("next/navigation", () => ({
  redirect: vi.fn((destination: string) => {
    throw new RedirectError(destination);
  }),
}));

vi.mock("@/core/config/env/server", () => ({
  serverEnv: {
    appUrl: "https://creatyss.test",
  },
}));

vi.mock("@/core/db", () => ({
  db: {
    store: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/core/runtime/resolve-store-execution-policy", () => ({
  resolveStoreExecutionPolicy: vi.fn(),
}));

vi.mock("@/core/payments/stripe/server", () => ({
  stripe: {
    checkout: {
      sessions: {
        retrieve: vi.fn(),
        create: vi.fn(),
      },
    },
  },
}));

vi.mock("@/features/commerce/payment/services/simulate-stripe-checkout.service", () => ({
  simulateStripeCheckoutSessionRetrieve: vi.fn(),
  simulateStripeCheckoutSessionCreate: vi.fn(),
}));

vi.mock("@/features/commerce/payment/lib/payment.repository", () => ({
  findPaymentStartContextByOrderReference: vi.fn(),
  markPaymentFailedByCheckoutSessionId: vi.fn(),
  saveStripeCheckoutSessionForOrder: vi.fn(),
}));

import { redirect } from "next/navigation";
import { db } from "@/core/db";
import { resolveStoreExecutionPolicy } from "@/core/runtime/resolve-store-execution-policy";
import { stripe } from "@/core/payments/stripe/server";
import {
  simulateStripeCheckoutSessionCreate,
  simulateStripeCheckoutSessionRetrieve,
} from "@/features/commerce/payment/services/simulate-stripe-checkout.service";
import {
  findPaymentStartContextByOrderReference,
  saveStripeCheckoutSessionForOrder,
} from "@/features/commerce/payment/lib/payment.repository";
import { startOrderPaymentAction } from "@/features/commerce/payment/actions/start-order-payment-action";

const mockRedirect = redirect as unknown as ReturnType<typeof vi.fn>;
const mockDb = db as unknown as { store: { findFirst: ReturnType<typeof vi.fn> } };
const mockResolveStoreExecutionPolicy = resolveStoreExecutionPolicy as ReturnType<typeof vi.fn>;
const mockStripeSessionsCreate = stripe.checkout.sessions.create as ReturnType<typeof vi.fn>;
const mockStripeSessionsRetrieve = stripe.checkout.sessions.retrieve as ReturnType<typeof vi.fn>;
const mockSimulateRetrieve = simulateStripeCheckoutSessionRetrieve as ReturnType<typeof vi.fn>;
const mockSimulateCreate = simulateStripeCheckoutSessionCreate as ReturnType<typeof vi.fn>;
const mockFindPaymentStartContext = findPaymentStartContextByOrderReference as ReturnType<
  typeof vi.fn
>;
const mockSaveStripeCheckoutSession = saveStripeCheckoutSessionForOrder as ReturnType<typeof vi.fn>;

const PAYMENT_CONTEXT = {
  orderId: "order_1",
  reference: "REF-1",
  totalAmount: "129.00",
  currencyCode: "eur",
  customerEmail: "client@example.com",
  orderStatus: "pending" as const,
  paymentStatus: null,
  paymentMethodType: null,
  stripeCheckoutSessionId: null,
  stripePaymentIntentId: null,
};

function buildFormData(reference: string): FormData {
  const formData = new FormData();
  formData.set("reference", reference);
  return formData;
}

describe("startOrderPaymentAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.store.findFirst.mockResolvedValue({ isProduction: true });
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "LIVE" });
    mockFindPaymentStartContext.mockResolvedValue(PAYMENT_CONTEXT);
    mockSaveStripeCheckoutSession.mockResolvedValue(undefined);
  });

  it("mode LIVE : appelle stripe.checkout.sessions.create et jamais la simulation", async () => {
    mockStripeSessionsCreate.mockResolvedValue({
      id: "cs_live_1",
      url: "https://checkout.stripe.com/session/cs_live_1",
      payment_intent: "pi_live_1",
    });

    await expect(startOrderPaymentAction(buildFormData("REF-1"))).rejects.toBeInstanceOf(
      RedirectError
    );

    expect(mockStripeSessionsCreate).toHaveBeenCalledTimes(1);
    expect(mockSimulateCreate).not.toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("https://checkout.stripe.com/session/cs_live_1");
  });

  it("mode TEST : appelle la simulation et jamais stripe.checkout.sessions.create, aucune requête réseau", async () => {
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "TEST" });
    mockSimulateCreate.mockResolvedValue({
      id: "simulated_cs_abc",
      url: "/checkout/confirmation/REF-1?payment=return",
      payment_intent: "simulated_pi_abc",
    });

    await expect(startOrderPaymentAction(buildFormData("REF-1"))).rejects.toBeInstanceOf(
      RedirectError
    );

    expect(mockSimulateCreate).toHaveBeenCalledTimes(1);
    expect(mockStripeSessionsCreate).not.toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/checkout/confirmation/REF-1?payment=return");
  });

  it("mode TEST : persiste la session simulée comme une session réelle (comportement métier identique)", async () => {
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "TEST" });
    mockSimulateCreate.mockResolvedValue({
      id: "simulated_cs_abc",
      url: "/checkout/confirmation/REF-1?payment=return",
      payment_intent: "simulated_pi_abc",
    });

    await expect(startOrderPaymentAction(buildFormData("REF-1"))).rejects.toBeInstanceOf(
      RedirectError
    );

    expect(mockSaveStripeCheckoutSession).toHaveBeenCalledWith({
      orderId: "order_1",
      stripeCheckoutSessionId: "simulated_cs_abc",
      stripePaymentIntentId: "simulated_pi_abc",
    });
  });

  it("mode TEST avec session existante : appelle la simulation de retrieve et jamais stripe.checkout.sessions.retrieve", async () => {
    mockFindPaymentStartContext.mockResolvedValue({
      ...PAYMENT_CONTEXT,
      paymentStatus: "pending",
      stripeCheckoutSessionId: "cs_existing",
    });
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "TEST" });
    mockSimulateRetrieve.mockResolvedValue({ status: "expired", url: null });
    mockSimulateCreate.mockResolvedValue({
      id: "simulated_cs_new",
      url: "/checkout/confirmation/REF-1?payment=return",
      payment_intent: "simulated_pi_new",
    });

    await expect(startOrderPaymentAction(buildFormData("REF-1"))).rejects.toBeInstanceOf(
      RedirectError
    );

    expect(mockSimulateRetrieve).toHaveBeenCalledTimes(1);
    expect(mockStripeSessionsRetrieve).not.toHaveBeenCalled();
    expect(mockSimulateCreate).toHaveBeenCalledTimes(1);
  });

  it("ne lève jamais d'exception non gérée : une erreur de simulation redirige vers l'état d'échec existant", async () => {
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "TEST" });
    mockSimulateCreate.mockResolvedValue({ id: "", url: "", payment_intent: null });

    await expect(startOrderPaymentAction(buildFormData("REF-1"))).rejects.toBeInstanceOf(
      RedirectError
    );

    expect(mockRedirect).toHaveBeenCalledWith("/checkout/confirmation/REF-1?payment=failed");
  });
});
