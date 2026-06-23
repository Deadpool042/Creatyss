import { db } from "@/core/db";
import type { AdminPaymentActionInput } from "@/features/admin/commerce/payments/shared/schemas/admin-payment-action.schema";
import { sendOrderTransactionalEmail } from "@/features/email/order/send-order-transactional-email";
import { AdminPaymentServiceError } from "./admin-payment-service.errors";

export async function captureAdminPayment(
  input: AdminPaymentActionInput,
  currentStoreId: string
): Promise<void> {
  const payment = await db.payment.findUnique({
    where: { id: input.paymentId },
    select: { id: true, storeId: true, status: true, amountAuthorized: true, orderId: true },
  });

  if (payment === null) {
    throw new AdminPaymentServiceError("missing_payment", "Paiement introuvable.");
  }

  if (payment.storeId !== currentStoreId) {
    throw new AdminPaymentServiceError("forbidden", "Accès non autorisé.");
  }

  if (payment.status !== "PENDING") {
    throw new AdminPaymentServiceError(
      "invalid_status_transition",
      "Seul un paiement en attente peut être marqué comme reçu."
    );
  }

  await db.$transaction([
    db.payment.update({
      where: { id: payment.id },
      data: {
        status: "CAPTURED",
        amountCaptured: payment.amountAuthorized,
        capturedAt: new Date(),
      },
    }),
    db.order.update({
      where: { id: payment.orderId },
      data: {
        status: "CONFIRMED",
        updatedAt: new Date(),
      },
    }),
  ]);

  try {
    await sendOrderTransactionalEmail({ orderId: payment.orderId, eventType: "payment_succeeded" });
  } catch {
    console.error("[captureAdminPayment] email payment_succeeded non envoyé (non fatal).");
  }
}
