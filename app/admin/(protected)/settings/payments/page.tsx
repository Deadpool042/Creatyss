import { redirect } from "next/navigation";

import { ADMIN_PAYMENTS_SETTINGS_PATH } from "@/features/admin/commerce/payments/shared/admin-payments-routes";

export default function AdminSettingsPaymentsPage() {
  redirect(ADMIN_PAYMENTS_SETTINGS_PATH);
}
