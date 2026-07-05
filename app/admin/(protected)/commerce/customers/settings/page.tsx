import { redirect } from "next/navigation";

import { ADMIN_COMMERCE_SETTINGS_PATH } from "@/features/admin/commerce/shared/admin-commerce-routes";

export default function AdminCommerceCustomersSettingsPage() {
  redirect(ADMIN_COMMERCE_SETTINGS_PATH);
}
