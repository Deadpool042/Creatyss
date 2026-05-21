import { AdminCreateTopbarMenu } from "@/components/admin/shared/admin-create-topbar-menu";
import { CATEGORY_CREATE_MENU_COPY } from "@/features/admin/categories/config";
import { ADMIN_CATEGORIES_NEW_PATH } from "@/features/admin/categories/shared/admin-categories-routes";

export function CategorieCreateTopbarMenu() {
  return (
    <AdminCreateTopbarMenu
      triggerLabel={CATEGORY_CREATE_MENU_COPY.triggerLabel}
      createLabel={CATEGORY_CREATE_MENU_COPY.createCategoryLabel}
      createHref={ADMIN_CATEGORIES_NEW_PATH}
    />
  );
}
