import { redirect } from "next/navigation";

import { ADMIN_CUSTOMERS_SETTINGS_PATH } from "@/features/admin/customers/shared";

export default function AdminSettingsCustomersPage() {
  redirect(ADMIN_CUSTOMERS_SETTINGS_PATH);
}
