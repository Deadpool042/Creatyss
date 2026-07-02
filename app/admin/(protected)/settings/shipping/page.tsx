import { redirect } from "next/navigation";

import { ADMIN_SHIPPING_SETTINGS_PATH } from "@/features/admin/commerce/shipping/shared/admin-shipping-routes";

export default function AdminSettingsShippingPage() {
  redirect(ADMIN_SHIPPING_SETTINGS_PATH);
}
