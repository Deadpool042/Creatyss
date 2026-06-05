import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { createProductAction } from "@/features/admin/products/create";
import { ProductCreatePanel } from "@/features/admin/products/components/create/product-create-panel";
import {
  PRODUCT_CREATE_PAGE_COPY,
  PRODUCT_EDITOR_NAV_COPY,
} from "@/features/admin/products/config";
import { ADMIN_PRODUCTS_LIST_PATH } from "@/features/admin/products/navigation";

export default async function ProductCreatePage() {
  return (
    <AdminPageShell
      title={PRODUCT_CREATE_PAGE_COPY.title}
      navigation={{ label: PRODUCT_EDITOR_NAV_COPY.navLabel, href: ADMIN_PRODUCTS_LIST_PATH }}
      scrollMode="area"
      contentPreset="form"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue", href: "/admin/catalog/overview" },
        { label: "Produits", href: ADMIN_PRODUCTS_LIST_PATH },
        { label: "Nouveau produit" },
      ]}
      header={
        <AdminPageHeader
          className="hidden lg:block"
          compact
          hideDescriptionOnMobile
          eyebrow={PRODUCT_EDITOR_NAV_COPY.eyebrow}
          title={PRODUCT_CREATE_PAGE_COPY.title}
          description={PRODUCT_CREATE_PAGE_COPY.description}
        />
      }
    >
      <ProductCreatePanel action={createProductAction} />
    </AdminPageShell>
  );
}
