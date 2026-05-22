import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { ProductCreateTopbarMenu } from "@/features/admin/products/components";
import {
  ProductTable,
  ProductTableProvider,
} from "@/features/admin/products/components/list";
import { mapAdminProductFeedItemToTableItem } from "@/features/admin/products/list/mappers/shared/map-admin-product-feed-item-to-table-item";
import {
  listAdminProducts,
  listProductFilterCategories,
  type AdminProductsListView,
  type ProductFeaturedFilter,
} from "@/features/admin/products/list/queries";
import {
  PRODUCT_FILTER_VALID_VALUES,
  PRODUCT_LIST_PAGE_COPY,
} from "@/features/admin/products/config";
import type { ProductSortOption, ProductTableStatus } from "@/features/admin/products/list/types/product-table.types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  view?: string;
  search?: string;
  status?: string;
  sort?: string;
  page?: string;
  perPage?: string;
  categoryId?: string;
  featured?: string;
}>;

const VALID_STATUSES = PRODUCT_FILTER_VALID_VALUES.statuses as readonly ProductTableStatus[];
const VALID_FEATURED = PRODUCT_FILTER_VALID_VALUES.featured as readonly ProductFeaturedFilter[];
const VALID_SORTS = PRODUCT_FILTER_VALID_VALUES.sorts as readonly ProductSortOption[];

function resolveProductsView(rawView: string | undefined): AdminProductsListView {
  return rawView === "trash" ? "trash" : "active";
}

function parseStatus(value: string | undefined): ProductTableStatus[] {
  if (!value) return [];
  return value
    .split(",")
    .filter((v): v is ProductTableStatus => VALID_STATUSES.includes(v as ProductTableStatus));
}

function parseSort(value: string | undefined): ProductSortOption {
  return VALID_SORTS.includes(value as ProductSortOption)
    ? (value as ProductSortOption)
    : "updated-desc";
}

function parseFeatured(value: string | undefined): ProductFeaturedFilter {
  return VALID_FEATURED.includes(value as ProductFeaturedFilter)
    ? (value as ProductFeaturedFilter)
    : "all";
}

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const view = resolveProductsView(params.view);
  const search = params.search ?? "";
  const status = parseStatus(params.status);
  const sort = parseSort(params.sort);
  const featured = parseFeatured(params.featured);
  const categoryId = params.categoryId;
  const page = Math.max(1, Number(params.page) || 1);
  const perPage = (PRODUCT_FILTER_VALID_VALUES.perPage as readonly number[]).includes(
    Number(params.perPage)
  )
    ? Number(params.perPage)
    : PRODUCT_FILTER_VALID_VALUES.perPageDefault;

  const [{ items, total, totalPages, currentPage, statusCounts }, categoryOptions] =
    await Promise.all([
      listAdminProducts({
        view,
        search,
        status,
        sort,
        page,
        perPage,
        ...(categoryId !== undefined ? { categoryId } : {}),
        featured,
      }),
      listProductFilterCategories(),
    ]);

  const products = items.map(mapAdminProductFeedItemToTableItem);

  return (
    <AdminPageShell
      headerVisibility="desktop"
      headerDensity="compact"
      eyebrow={PRODUCT_LIST_PAGE_COPY.eyebrow}
      title={view === "trash" ? PRODUCT_LIST_PAGE_COPY.titleTrash : PRODUCT_LIST_PAGE_COPY.title}
      description={
        view === "trash"
          ? PRODUCT_LIST_PAGE_COPY.descriptionTrash
          : PRODUCT_LIST_PAGE_COPY.description
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
