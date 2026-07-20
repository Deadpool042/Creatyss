import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    payment: {
      findFirst: vi.fn(),
    },
    returnItem: {
      findMany: vi.fn(),
    },
    store: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/core/db/transactions/with-transaction", () => ({
  withTransaction: vi.fn(),
}));

vi.mock("@/core/runtime/resolve-store-execution-policy", () => ({
  resolveStoreExecutionPolicy: vi.fn(),
}));

vi.mock("@/core/payments/stripe/server", () => ({
  stripe: {
    refunds: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/features/admin/commerce/returns/services/simulate-stripe-refund.service", () => ({
  simulateStripeRefund: vi.fn(),
}));

import { db } from "@/core/db";
import { withTransaction } from "@/core/db/transactions/with-transaction";
import { resolveStoreExecutionPolicy } from "@/core/runtime/resolve-store-execution-policy";
import { stripe } from "@/core/payments/stripe/server";
import { simulateStripeRefund } from "@/features/admin/commerce/returns/services/simulate-stripe-refund.service";
import { processStripeRefund } from "@/features/admin/commerce/returns/services/process-stripe-refund.service";

const mockDb = db as unknown as {
  payment: { findFirst: ReturnType<typeof vi.fn> };
  returnItem: { findMany: ReturnType<typeof vi.fn> };
  store: { findFirst: ReturnType<typeof vi.fn> };
};
const mockWithTransaction = withTransaction as ReturnType<typeof vi.fn>;
const mockResolveStoreExecutionPolicy = resolveStoreExecutionPolicy as ReturnType<typeof vi.fn>;
const mockStripeRefundsCreate = stripe.refunds.create as ReturnType<typeof vi.fn>;
const mockSimulateStripeRefund = simulateStripeRefund as ReturnType<typeof vi.fn>;

const PAYMENT = {
  id: "pay_1",
  providerPaymentId: "pi_1",
  amountCaptured: 129,
  amountRefunded: 0,
  currencyCode: "eur",
};

const RETURN_ITEMS = [
  {
    quantity: 1,
    orderLine: { quantity: 1, lineTotalAmount: 129 },
  },
];

describe("processStripeRefund", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.payment.findFirst.mockResolvedValue(PAYMENT);
    mockDb.returnItem.findMany.mockResolvedValue(RETURN_ITEMS);
    mockDb.store.findFirst.mockResolvedValue({ isProduction: true });
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "LIVE" });
    mockWithTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<void>) => {
      const tx = {
        paymentRefund: { create: vi.fn() },
        payment: { update: vi.fn() },
      };
      await fn(tx);
    });
  });

  it("mode LIVE : appelle stripe.refunds.create et jamais la simulation", async () => {
    mockStripeRefundsCreate.mockResolvedValue({ id: "re_live_1" });

    await processStripeRefund({
      orderId: "order_1",
      storeId: "store_1",
      returnRequestId: "ret_1",
    });

    expect(mockStripeRefundsCreate).toHaveBeenCalledTimes(1);
    expect(mockStripeRefundsCreate).toHaveBeenCalledWith({
      payment_intent: "pi_1",
      amount: 12900,
    });
    expect(mockSimulateStripeRefund).not.toHaveBeenCalled();
  });

  it("mode TEST : appelle la simulation et jamais stripe.refunds.create, aucune requête réseau", async () => {
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "TEST" });
    mockSimulateStripeRefund.mockResolvedValue({ id: "simulated_re_abc" });

    await processStripeRefund({
      orderId: "order_1",
      storeId: "store_1",
      returnRequestId: "ret_1",
    });

    expect(mockSimulateStripeRefund).toHaveBeenCalledTimes(1);
    expect(mockSimulateStripeRefund).toHaveBeenCalledWith({
      paymentIntentId: "pi_1",
      amountCents: 12900,
    });
    expect(mockStripeRefundsCreate).not.toHaveBeenCalled();
  });

  it("mode TEST : persiste le remboursement simulé exactement comme un remboursement réel", async () => {
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "TEST" });
    mockSimulateStripeRefund.mockResolvedValue({ id: "simulated_re_abc" });

    let capturedRefundCreate: Record<string, unknown> | undefined;
    let capturedPaymentUpdate: Record<string, unknown> | undefined;
    mockWithTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<void>) => {
      const tx = {
        paymentRefund: {
          create: vi.fn((args: { data: Record<string, unknown> }) => {
            capturedRefundCreate = args.data;
          }),
        },
        payment: {
          update: vi.fn((args: { data: Record<string, unknown> }) => {
            capturedPaymentUpdate = args.data;
          }),
        },
      };
      await fn(tx);
    });

    await processStripeRefund({
      orderId: "order_1",
      storeId: "store_1",
      returnRequestId: "ret_1",
    });

    expect(capturedRefundCreate).toMatchObject({
      providerReference: "simulated_re_abc",
      provider: "stripe",
      amount: 129,
    });
    expect(capturedPaymentUpdate).toMatchObject({ status: "REFUNDED", amountRefunded: 129 });
  });

  it("ne propage jamais d'exception issue de la simulation elle-même (contrat jamais-throw respecté)", async () => {
    mockResolveStoreExecutionPolicy.mockReturnValue({ mode: "TEST" });
    mockSimulateStripeRefund.mockResolvedValue({ id: "simulated_re_xyz" });

    await expect(
      processStripeRefund({ orderId: "order_1", storeId: "store_1", returnRequestId: "ret_1" })
    ).resolves.toBeUndefined();
  });
});
