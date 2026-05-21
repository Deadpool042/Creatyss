import { AdminCreateTopbarMenu } from "@/components/admin/shared/admin-create-topbar-menu";
import { PRODUCT_CREATE_MENU_COPY } from "@/features/admin/products/config";

type ProductCreateTopbarMenuProps = {
  productId: string;
};

export function ProductCreateTopbarMenu({ productId: _productId }: ProductCreateTopbarMenuProps) {
  return (
    <AdminCreateTopbarMenu
      triggerLabel={PRODUCT_CREATE_MENU_COPY.triggerLabel}
      createLabel={PRODUCT_CREATE_MENU_COPY.createProductLabel}
      createHref="/admin/products/new"
    />
  );
}
