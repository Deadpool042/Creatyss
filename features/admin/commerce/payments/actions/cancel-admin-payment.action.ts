"use server";

import { revalidatePath } from "next/cache";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { adminPaymentActionSchema } from "@/features/admin/commerce/payments/shared/schemas/admin-payment-action.schema";
import { cancelAdminPayment } from "@/features/admin/commerce/payments/shared/services/cancel-admin-payment.service";
import { AdminPaymentServiceError } from "@/features/admin/commerce/payments/shared/services/admin-payment-service.errors";
import { ADMIN_PAYMENTS_LIST_PATH } from "@/features/admin/commerce/payments/shared/admin-payments-routes";

type CancelPaymentResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export async function cancelAdminPaymentAction(
  formData: FormData
): Promise<CancelPaymentResult> {
  await requireAdminCapability("admin.commerce.payments.cancel");

  if (!(await meetsFeatureLevel("commerce.payments", "manual"))) {
    return { status: "error", message: "Niveau paiements insuffisant pour cette action." };
  }

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
    await cancelAdminPayment(parsed.data, storeId);
  } catch (error) {
    if (error instanceof AdminPaymentServiceError) {
      return { status: "error", message: error.message };
    }
    console.error("[cancel-admin-payment]", error);
    return { status: "error", message: "Erreur lors de l'annulation du paiement." };
  }

  revalidatePath(ADMIN_PAYMENTS_LIST_PATH);
  return { status: "success", message: "Paiement annulé." };
}
