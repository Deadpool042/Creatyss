import { redirect } from "next/navigation";

import { ADMIN_CATALOG_SETTINGS_PATH } from "@/features/admin/catalog/shared/admin-catalog-routes";

export default function AdminSettingsCatalogPage() {
  redirect(ADMIN_CATALOG_SETTINGS_PATH);
}
