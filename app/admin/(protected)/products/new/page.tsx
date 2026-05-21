import { AdminPageShell } from "@/components/admin/admin-page-shell";
import {
  createProductAction,
  listAdminCreatableProductTypeOptions,
} from "@/features/admin/products/create";
import { ProductCreatePanel } from "@/features/admin/products/components";
import {
  PRODUCT_CREATE_PAGE_COPY,
  PRODUCT_EDITOR_NAV_COPY,
} from "@/features/admin/products/config";

export default async function ProductCreatePage() {
  const productTypeOptions = await listAdminCreatableProductTypeOptions();

  return (
    <AdminPageShell
      title={PRODUCT_CREATE_PAGE_COPY.title}
      eyebrow={PRODUCT_EDITOR_NAV_COPY.eyebrow}
      description={PRODUCT_CREATE_PAGE_COPY.description}
      viewportClassName="!h-full"
      navigation={{ label: PRODUCT_EDITOR_NAV_COPY.navLabel, href: "/admin/products" }}
      breadcrumbs={[
        { label: PRODUCT_EDITOR_NAV_COPY.breadcrumbHome, href: "/admin" },
        { label: PRODUCT_EDITOR_NAV_COPY.breadcrumbProducts, href: "/admin/products" },
        { label: PRODUCT_CREATE_PAGE_COPY.title },
      ]}
      contentClassName="min-h-0 flex-1 overflow-hidden px-3 pt-16 pb-0 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:pt-12 lg:px-6 lg:pb-4 lg:pt-0"
      headerDensity="compact"
      compactMobileTitle
      hideDescriptionOnMobile
      headerVisibility="desktop"
    >
      <ProductCreatePanel action={createProductAction} productTypeOptions={productTypeOptions} />
    </AdminPageShell>
  );
}
