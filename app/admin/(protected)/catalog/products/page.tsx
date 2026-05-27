import {
  parseAdminListArrayParam,
  parseAdminListPageParam,
  parseAdminListPerPageParam,
  parseAdminListSortParam,
  parseAdminListStringArrayParam,
} from "@/components/admin/tables/state/admin-list-search-params";
import { AdminDataTablePageShell } from "@/components/admin/tables";
import { ProductCreateTopbarMenu } from "@/features/admin/products/components";
import { ProductTable, ProductTableProvider } from "@/features/admin/products/components/list";
import { mapProductTableItem } from "@/features/admin/products/list/mappers";
import {
  listAdminProducts,
  listProductFilterCategories,
  type AdminProductsListView,
} from "@/features/admin/products/list/queries";
import {
  PRODUCT_FILTER_VALID_VALUES,
  PRODUCT_LIST_PAGE_COPY,
} from "@/features/admin/products/config";
import type {
  ProductFeaturedFilterValue,
  ProductSortOption,
  ProductTableStatus,
} from "@/features/admin/products/list/types/product-table.types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  view?: string;
  search?: string;
  status?: string;
  sort?: string;
  page?: string;
  perPage?: string;
  categories?: string;
  categoryId?: string;
  featured?: string;
}>;

const VALID_STATUSES = PRODUCT_FILTER_VALID_VALUES.statuses as ProductTableStatus[];
const VALID_FEATURED = PRODUCT_FILTER_VALID_VALUES.featured.filter(
  (value): value is ProductFeaturedFilterValue => value !== "all"
);
const VALID_SORTS = PRODUCT_FILTER_VALID_VALUES.sorts as ProductSortOption[];
const VALID_PER_PAGE = PRODUCT_FILTER_VALID_VALUES.perPage as readonly number[];

function resolveProductsView(rawView: string | undefined): AdminProductsListView {
  return rawView === "trash" ? "trash" : "active";
}

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const view = resolveProductsView(params.view);
  const search = params.search ?? "";
  const status = parseAdminListArrayParam(params.status, VALID_STATUSES);
  const sort = parseAdminListSortParam(params.sort, VALID_SORTS, "updated-desc");
  const featured = parseAdminListArrayParam(params.featured, VALID_FEATURED);
  const productSlugs = parseAdminListStringArrayParam(params.categories);
  const page = parseAdminListPageParam(params.page);
  const perPage = parseAdminListPerPageParam(
    params.perPage,
    VALID_PER_PAGE,
    PRODUCT_FILTER_VALID_VALUES.perPageDefault
  );

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
        productSlugs,
      }),
      listProductFilterCategories(),
    ]);

  const products = items.map(mapProductTableItem);

  return (
    <AdminDataTablePageShell
      eyebrow={PRODUCT_LIST_PAGE_COPY.eyebrow}
      title={view === "trash" ? PRODUCT_LIST_PAGE_COPY.titleTrash : PRODUCT_LIST_PAGE_COPY.title}
      description={
        view === "trash"
          ? PRODUCT_LIST_PAGE_COPY.descriptionTrash
          : PRODUCT_LIST_PAGE_COPY.description
      }
      topbarAction={view === "active" ? <ProductCreateTopbarMenu /> : undefined}
      navigation={{ label: PRODUCT_LIST_PAGE_COPY.navHomeLabel, href: "/admin" }}
      breadcrumbs={[
        { label: PRODUCT_LIST_PAGE_COPY.navHomeLabel, href: "/admin" },
        { label: PRODUCT_LIST_PAGE_COPY.navProductsLabel, href: "/admin/products" },
      ]}
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
    </AdminDataTablePageShell>
  );
}
