import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { ProductTable } from "@/features/admin/products/components/list/product-table";
import { ProductCreateTopbarMenu } from "@/features/admin/products/components";
import { mapProductTableItem } from "@/features/admin/products/list/mappers/server";
import {
  listAdminProducts,
  type AdminProductsListView,
} from "@/features/admin/products/list/queries/list-admin-products.query";
import { listProductFilterCategories } from "@/features/admin/products/list/queries/list-product-filter-categories.query";
import { PRODUCT_LIST_PAGE_COPY } from "@/features/admin/products/config";

type AdminProductsPageProps = {
  searchParams?: Promise<{
    view?: string;
  }>;
};

function resolveProductsView(rawView: string | undefined): AdminProductsListView {
  return rawView === "trash" ? "trash" : "active";
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const view = resolveProductsView(resolvedSearchParams?.view);

  const [rawProducts, categoryOptions] = await Promise.all([
    listAdminProducts(view),
    listProductFilterCategories(),
  ]);

  const products = rawProducts.map(mapProductTableItem);

  return (
    <AdminPageShell
      headerVisibility="desktop"
      headerDensity="compact"
      eyebrow={PRODUCT_LIST_PAGE_COPY.eyebrow}
      title={view === "trash" ? PRODUCT_LIST_PAGE_COPY.titleTrash : PRODUCT_LIST_PAGE_COPY.title}
      description={
        view === "trash" ? PRODUCT_LIST_PAGE_COPY.descriptionTrash : PRODUCT_LIST_PAGE_COPY.description
      }
      topbarAction={view === "active" ? <ProductCreateTopbarMenu productId="" /> : undefined}
      navigation={{ label: PRODUCT_LIST_PAGE_COPY.navHomeLabel, href: "/admin" }}
      breadcrumbs={[
        { label: PRODUCT_LIST_PAGE_COPY.navHomeLabel, href: "/admin" },
        { label: PRODUCT_LIST_PAGE_COPY.navProductsLabel, href: "/admin/products" },
      ]}
      viewportClassName="!h-full"
      scrollMode="nested"
      contentClassName="min-h-0 flex-1 overflow-hidden px-3 pt-14 pb-0 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:pt-12 [@media(max-height:480px)]:pb-0 lg:px-6 lg:pb-4 lg:pt-0"
    >
      <ProductTable products={products} categoryOptions={categoryOptions} view={view} />
    </AdminPageShell>
  );
}
