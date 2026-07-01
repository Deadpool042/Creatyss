import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    payment: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    order: {
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/features/email/order/send-order-transactional-email", () => ({
  sendOrderTransactionalEmail: vi.fn(),
}));

import { db } from "@/core/db";
import { sendOrderTransactionalEmail } from "@/features/email/order/send-order-transactional-email";
import { captureAdminPayment } from "@/features/admin/commerce/payments/shared/services/capture-admin-payment.service";
import { AdminPaymentServiceError } from "@/features/admin/commerce/payments/shared/services/admin-payment-service.errors";

const mockDb = db as {
  payment: { findUnique: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
  order: { update: ReturnType<typeof vi.fn> };
  $transaction: ReturnType<typeof vi.fn>;
};

const mockSendEmail = sendOrderTransactionalEmail as ReturnType<typeof vi.fn>;

const STORE_ID = "store_1";
const PAYMENT_ID = "pay_1";
const ORDER_ID = "order_1";

const validInput = { paymentId: PAYMENT_ID };
const pendingPayment = {
  id: PAYMENT_ID,
  storeId: STORE_ID,
  status: "PENDING",
  amountAuthorized: 12900,
  orderId: ORDER_ID,
};

describe("captureAdminPayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lance AdminPaymentServiceError si le paiement est introuvable", async () => {
    mockDb.payment.findUnique.mockResolvedValue(null);

    await expect(captureAdminPayment(validInput, STORE_ID)).rejects.toThrow(
      AdminPaymentServiceError
    );
    expect(mockDb.$transaction).not.toHaveBeenCalled();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("lance AdminPaymentServiceError si le storeId ne correspond pas", async () => {
    mockDb.payment.findUnique.mockResolvedValue({ ...pendingPayment, storeId: "autre_store" });

    await expect(captureAdminPayment(validInput, STORE_ID)).rejects.toThrow(
      AdminPaymentServiceError
    );
    expect(mockDb.$transaction).not.toHaveBeenCalled();
  });

  it("lance AdminPaymentServiceError si le statut n'est pas PENDING", async () => {
    mockDb.payment.findUnique.mockResolvedValue({ ...pendingPayment, status: "CAPTURED" });

    await expect(captureAdminPayment(validInput, STORE_ID)).rejects.toThrow(
      AdminPaymentServiceError
    );
    expect(mockDb.$transaction).not.toHaveBeenCalled();
  });

  it("exécute la transaction et envoie l'email payment_succeeded après capture", async () => {
    mockDb.payment.findUnique.mockResolvedValue(pendingPayment);
    mockDb.$transaction.mockResolvedValue([undefined, undefined]);
    mockSendEmail.mockResolvedValue(undefined);

    await captureAdminPayment(validInput, STORE_ID);

    expect(mockDb.$transaction).toHaveBeenCalledOnce();
    expect(mockSendEmail).toHaveBeenCalledOnce();
    expect(mockSendEmail).toHaveBeenCalledWith({
      orderId: ORDER_ID,
      eventType: "payment_succeeded",
    });
  });

  it("ne propage pas une erreur d'email — la capture reste validée", async () => {
    mockDb.payment.findUnique.mockResolvedValue(pendingPayment);
    mockDb.$transaction.mockResolvedValue([undefined, undefined]);
    mockSendEmail.mockRejectedValue(new Error("SMTP timeout"));

    await expect(captureAdminPayment(validInput, STORE_ID)).resolves.toEqual({
      orderId: ORDER_ID,
    });
    expect(mockDb.$transaction).toHaveBeenCalledOnce();
  });
});
