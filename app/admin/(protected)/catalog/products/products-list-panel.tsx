import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { ProductCreateTopbarMenu } from "@/features/admin/products/components/create/product-create-topbar-menu";
import { ProductTableProvider } from "@/features/admin/products/components/list/desktop/product-table-context";
import { ProductTable } from "@/features/admin/products/components/list/table/product-table";
import { PRODUCT_LIST_PAGE_COPY } from "@/features/admin/products/config";
import { mapProductTableItem } from "@/features/admin/products/list/mappers";
import {
  listAdminProducts,
  listProductFilterCategories,
  type AdminProductsListView,
} from "@/features/admin/products/list/queries";
import type {
  ProductFeaturedFilterValue,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductSortOption,
  ProductTableStatus,
} from "@/features/admin/products/list/types/product-table.types";

type ProductsListPanelProps = {
  view: AdminProductsListView;
  search: string;
  status: ProductTableStatus[];
  sort: ProductSortOption;
  page: number;
  perPage: number;
  featured: ProductFeaturedFilterValue[];
  categorySlugs: string[];
  image: ProductFilterImageOption;
  stock: ProductFilterStockOption;
  variant: ProductFilterVariantOption;
};

export async function ProductsListPanel({
  view,
  search,
  status,
  sort,
  page,
  perPage,
  featured,
  categorySlugs,
  image,
  stock,
  variant,
}: ProductsListPanelProps) {
  const [{ items, total, totalPages, currentPage, statusCounts }, categoryOptions] =
    await Promise.all([
      listAdminProducts({
        view,
        search,
        status,
        sort,
        page,
        perPage,
        featured,
        categorySlugs,
        image,
        stock,
        variant,
      }),
      listProductFilterCategories(),
    ]);

  const products = items.map(mapProductTableItem);
  const isTrashView = view === "trash";

  return (
    <AdminPageShell
      title={isTrashView ? PRODUCT_LIST_PAGE_COPY.titleTrash : PRODUCT_LIST_PAGE_COPY.title}
      topbarAction={isTrashView ? undefined : <ProductCreateTopbarMenu />}
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue", href: "/admin/catalog/overview" },
        { label: "Produits" },
      ]}
      contentPreset="table"
      showBreadcrumbsInContent={false}
      scrollBehavior="external"
    >
      <ProductTableProvider
        products={products}
        categoryOptions={categoryOptions}
        view={view}
        total={total}
        totalPages={totalPages}
        currentPage={currentPage}
        perPage={perPage}
        statusCounts={statusCounts}
      >
        <ProductTable />
      </ProductTableProvider>
    </AdminPageShell>
  );
}
