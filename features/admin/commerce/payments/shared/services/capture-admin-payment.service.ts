import { db } from "@/core/db";
import type { AdminPaymentActionInput } from "@/features/admin/commerce/payments/shared/schemas/admin-payment-action.schema";
import { AdminPaymentServiceError } from "./admin-payment-service.errors";

export async function captureAdminPayment(
  input: AdminPaymentActionInput,
  currentStoreId: string
): Promise<void> {
  const payment = await db.payment.findUnique({
    where: { id: input.paymentId },
    select: { id: true, storeId: true, status: true, amountAuthorized: true },
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

  await db.payment.update({
    where: { id: payment.id },
    data: {
      status: "CAPTURED",
      amountCaptured: payment.amountAuthorized,
      capturedAt: new Date(),
    },
  });
}
