import {
  parseAdminListArrayParam,
  parseAdminListPageParam,
  parseAdminListPerPageParam,
  parseAdminListSortParam,
  parseAdminListStringArrayParam,
} from "@/components/admin/tables/state/admin-list-search-params";
import { AdminDataTablePageShell } from "@/components/admin/tables";
import {
  ADMIN_CATEGORIES_LIST_PATH,
  CategoriesTableProvider,
  CategoryCreateTopbarMenu,
  CategoryTable,
  listAdminCategories,
  listCategoriesForPicker,
  type CategoryFeaturedFilter,
  type CategorySortOption,
  type AdminCategoryStatus,
} from "@/features/admin/categories";
import {
  CATEGORY_FILTER_VALID_VALUES,
  CATEGORY_LIST_PAGE_COPY,
  CATEGORY_NAVIGATION_COPY,
} from "@/features/admin/categories/config";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  search?: string;
  status?: string;
  featured?: string;
  categories?: string;
  sort?: string;
  page?: string;
  perPage?: string;
}>;

const VALID_STATUSES = CATEGORY_FILTER_VALID_VALUES.statuses as AdminCategoryStatus[];
const VALID_FEATURED = CATEGORY_FILTER_VALID_VALUES.featured as CategoryFeaturedFilter[];
const VALID_SORTS = CATEGORY_FILTER_VALID_VALUES.sorts as CategorySortOption[];
const VALID_PER_PAGE = CATEGORY_FILTER_VALID_VALUES.perPage as readonly number[];

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const status = parseAdminListArrayParam(params.status, VALID_STATUSES);
  const featured = parseAdminListArrayParam(params.featured, VALID_FEATURED);
  const categorySlugs = parseAdminListStringArrayParam(params.categories);
  const sort = parseAdminListSortParam(params.sort, VALID_SORTS, "updated-asc");
  const page = parseAdminListPageParam(params.page);
  const perPage = parseAdminListPerPageParam(
    params.perPage,
    VALID_PER_PAGE,
    CATEGORY_FILTER_VALID_VALUES.perPageDefault
  );

  const [{ items, total, totalPages, statusCounts }, categoriesForPicker] = await Promise.all([
    listAdminCategories({
      search,
      status,
      featured,
      categorySlugs,
      sort,
      page,
      perPage,
    }),
    listCategoriesForPicker(),
  ]);

  return (
    <AdminDataTablePageShell
      eyebrow={CATEGORY_LIST_PAGE_COPY.eyebrow}
      title={CATEGORY_LIST_PAGE_COPY.title}
      description={CATEGORY_LIST_PAGE_COPY.description}
      topbarAction={<CategoryCreateTopbarMenu />}
      navigation={{ label: CATEGORY_NAVIGATION_COPY.homeLabel, href: "/admin" }}
      breadcrumbs={[
        { label: CATEGORY_NAVIGATION_COPY.homeLabel, href: "/admin" },
        { label: CATEGORY_NAVIGATION_COPY.categoriesLabel, href: ADMIN_CATEGORIES_LIST_PATH },
      ]}
    >
      <CategoriesTableProvider
        categories={items}
        categoriesForPicker={categoriesForPicker}
        total={total}
        totalPages={totalPages}
        currentPage={page}
        perPage={perPage}
        statusCounts={statusCounts}
      >
        <CategoryTable />
      </CategoriesTableProvider>
    </AdminDataTablePageShell>
  );
}
