"use server";

import { captureAdminPaymentAction } from "@/features/admin/commerce/payments/actions/capture-admin-payment.action";
import { cancelAdminPaymentAction } from "@/features/admin/commerce/payments/actions/cancel-admin-payment.action";

export async function captureFormAction(formData: FormData): Promise<void> {
  await captureAdminPaymentAction(formData);
}

export async function cancelFormAction(formData: FormData): Promise<void> {
  await cancelAdminPaymentAction(formData);
}
