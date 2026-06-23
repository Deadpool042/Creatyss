import { beforeEach, describe, expect, it, vi } from "vitest";

// Mocks déclarés avant les imports qui en dépendent.
vi.mock("@/core/db", () => ({
  db: {
    payment: {
      findFirst: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    order: {
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { db } from "@/core/db";
import {
  markPaymentFailedByCheckoutSessionId,
  markPaymentSucceededByCheckoutSessionId,
} from "@/features/commerce/payment/lib/payment.repository";

const mockDb = db as {
  payment: {
    findFirst: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
  };
  order: { update: ReturnType<typeof vi.fn> };
  $transaction: ReturnType<typeof vi.fn>;
};

describe("markPaymentSucceededByCheckoutSessionId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne null si le paiement est introuvable", async () => {
    mockDb.payment.findFirst.mockResolvedValue(null);

    const result = await markPaymentSucceededByCheckoutSessionId({
      stripeCheckoutSessionId: "cs_test_notfound",
    });

    expect(result).toBeNull();
    expect(mockDb.$transaction).not.toHaveBeenCalled();
  });

  it("retourne null si le paiement est déjà CAPTURED (idempotence — double email bloqué)", async () => {
    mockDb.payment.findFirst.mockResolvedValue({
      id: "pay_1",
      orderId: "order_1",
      status: "CAPTURED",
    });

    const result = await markPaymentSucceededByCheckoutSessionId({
      stripeCheckoutSessionId: "cs_test_already_captured",
    });

    expect(result).toBeNull();
    expect(mockDb.$transaction).not.toHaveBeenCalled();
  });

  it("exécute payment CAPTURED et order CONFIRMED dans la même transaction", async () => {
    const fakePayment = { id: "pay_1", orderId: "order_1", status: "PENDING" };
    mockDb.payment.findFirst.mockResolvedValue(fakePayment);
    mockDb.$transaction.mockResolvedValue([undefined, undefined]);

    const result = await markPaymentSucceededByCheckoutSessionId({
      stripeCheckoutSessionId: "cs_test_abc",
      stripePaymentIntentId: "pi_test_abc",
    });

    expect(result).toBe("order_1");

    // La transaction doit avoir été appelée avec exactement 2 opérations.
    expect(mockDb.$transaction).toHaveBeenCalledOnce();
    const [ops] = mockDb.$transaction.mock.calls[0] as [unknown[]];
    expect(ops).toHaveLength(2);
  });

  it("met à jour payment.status à CAPTURED", async () => {
    const fakePayment = { id: "pay_2", orderId: "order_2", status: "PENDING" };
    mockDb.payment.findFirst.mockResolvedValue(fakePayment);
    mockDb.$transaction.mockResolvedValue([undefined, undefined]);

    await markPaymentSucceededByCheckoutSessionId({
      stripeCheckoutSessionId: "cs_test_xyz",
      stripePaymentIntentId: "pi_test_xyz",
    });

    expect(mockDb.payment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "pay_2" },
        data: expect.objectContaining({ status: "CAPTURED" }),
      })
    );
  });

  it("met à jour order.status à CONFIRMED", async () => {
    const fakePayment = { id: "pay_3", orderId: "order_3", status: "PENDING" };
    mockDb.payment.findFirst.mockResolvedValue(fakePayment);
    mockDb.$transaction.mockResolvedValue([undefined, undefined]);

    await markPaymentSucceededByCheckoutSessionId({
      stripeCheckoutSessionId: "cs_test_efg",
      stripePaymentIntentId: "pi_test_efg",
    });

    expect(mockDb.order.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "order_3" },
        data: expect.objectContaining({ status: "CONFIRMED" }),
      })
    );
  });
});

describe("markPaymentFailedByCheckoutSessionId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("n'écrase pas un paiement CAPTURED ou CANCELLED (guard notIn)", async () => {
    mockDb.payment.updateMany.mockResolvedValue({ count: 0 });

    await markPaymentFailedByCheckoutSessionId({
      stripeCheckoutSessionId: "cs_test_abc",
    });

    expect(mockDb.payment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: { notIn: ["CAPTURED", "CANCELLED"] },
        }),
      })
    );
  });

  it("met à jour le statut à FAILED pour un paiement PENDING", async () => {
    mockDb.payment.updateMany.mockResolvedValue({ count: 1 });

    await markPaymentFailedByCheckoutSessionId({
      stripeCheckoutSessionId: "cs_test_pending",
      stripePaymentIntentId: "pi_test_pending",
    });

    expect(mockDb.payment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "FAILED" }),
      })
    );
  });
});
