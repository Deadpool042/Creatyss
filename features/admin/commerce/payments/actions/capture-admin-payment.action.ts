"use server";

import { revalidatePath } from "next/cache";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { adminPaymentActionSchema } from "@/features/admin/commerce/payments/shared/schemas/admin-payment-action.schema";
import { captureAdminPayment } from "@/features/admin/commerce/payments/shared/services/capture-admin-payment.service";
import { AdminPaymentServiceError } from "@/features/admin/commerce/payments/shared/services/admin-payment-service.errors";
import { ADMIN_PAYMENTS_LIST_PATH } from "@/features/admin/commerce/payments/shared/admin-payments-routes";

type CapturePaymentResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export async function captureAdminPaymentAction(
  formData: FormData
): Promise<CapturePaymentResult> {
  await requireAdminCapability("admin.commerce.payments.capture");

  const parsed = adminPaymentActionSchema.safeParse({
    paymentId: String(formData.get("paymentId") ?? ""),
  });

  if (!parsed.success) {
    return { status: "error", message: "Identifiant de paiement invalide." };
  }

  const storeId = await getCurrentStoreId();
  if (!storeId) {
    return { status: "error", message: "Boutique introuvable." };
  }

  try {
    await captureAdminPayment(parsed.data, storeId);
  } catch (error) {
    if (error instanceof AdminPaymentServiceError) {
      return { status: "error", message: error.message };
    }
    console.error("[capture-admin-payment]", error);
    return { status: "error", message: "Erreur lors de la mise à jour du paiement." };
  }

  revalidatePath(ADMIN_PAYMENTS_LIST_PATH);
  return { status: "success", message: "Paiement marqué comme reçu." };
}
