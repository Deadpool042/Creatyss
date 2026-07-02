import { redirect } from "next/navigation";

import { ADMIN_CATALOG_MEDIA_SETTINGS_PATH } from "@/features/admin/catalog/shared/admin-catalog-routes";

export default function AdminSettingsMediaPage() {
  redirect(ADMIN_CATALOG_MEDIA_SETTINGS_PATH);
}
