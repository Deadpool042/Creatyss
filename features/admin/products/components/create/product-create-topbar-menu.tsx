import { AdminCreateTopbarMenu } from "@/components/admin/shared/admin-create-topbar-menu";
import { PRODUCT_CREATE_MENU_COPY } from "@/features/admin/products/config";
import { ADMIN_PRODUCTS_CREATE_PATH } from "@/features/admin/products/navigation";

export function ProductCreateTopbarMenu() {
  return (
    <AdminCreateTopbarMenu
      triggerLabel={PRODUCT_CREATE_MENU_COPY.triggerLabel}
      createLabel={PRODUCT_CREATE_MENU_COPY.createProductLabel}
      createHref={ADMIN_PRODUCTS_CREATE_PATH}
    />
  );
}
