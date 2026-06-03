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
      contentClassName="flex min-h-full min-w-0 flex-col space-y-4 overflow-x-hidden px-4 pt-14 pb-[calc(3.5rem+env(safe-area-inset-bottom)+1rem)] md:space-y-6 md:px-6 md:pt-14 md:pb-[calc(3.5rem+env(safe-area-inset-bottom)+1rem)] lg:space-y-6 lg:px-6 lg:pt-0 lg:pb-0 [@media(max-height:480px)]:px-3 [@media(max-height:480px)]:pt-12 [@media(max-height:480px)]:pb-[calc(2.75rem+env(safe-area-inset-bottom)+0.75rem)]"
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
