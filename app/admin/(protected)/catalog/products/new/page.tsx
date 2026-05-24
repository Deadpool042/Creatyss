import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { FullWidthPageFrame } from "@/components/shared/layout/full-width-page-frame";
import { FullWidthStack } from "@/components/shared/layout/full-width-stack";
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
      pageTitleNavigation={{ label: PRODUCT_EDITOR_NAV_COPY.navLabel, href: "/admin/products" }}
      scrollMode="area"
      headerDensity="compact"
      compactMobileTitle
      hideDescriptionOnMobile
      headerVisibility="desktop"
    >
      <FullWidthPageFrame>
        <FullWidthStack>
          <ProductCreatePanel action={createProductAction} productTypeOptions={productTypeOptions} />
        </FullWidthStack>
      </FullWidthPageFrame>
    </AdminPageShell>
  );
}
