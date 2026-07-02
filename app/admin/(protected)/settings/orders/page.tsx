import { redirect } from "next/navigation";

import { ADMIN_ORDERS_SETTINGS_PATH } from "@/features/admin/commerce/orders/shared/admin-orders-routes";

export default function AdminSettingsOrdersPage() {
  redirect(ADMIN_ORDERS_SETTINGS_PATH);
}
