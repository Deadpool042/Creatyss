import { AdminPageShell } from "@/components/admin/admin-page-shell";
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

function parseArrayParam<T extends string>(value: string | undefined, valid: T[]): T[] {
  if (!value) return [];
  return value.split(",").filter((v): v is T => valid.includes(v as T));
}

function parseCategorySlugs(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

function parseSort(value: string | undefined): CategorySortOption {
  return VALID_SORTS.includes(value as CategorySortOption)
    ? (value as CategorySortOption)
    : "name-asc";
}

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const status = parseArrayParam(params.status, VALID_STATUSES);
  const featured = parseArrayParam(params.featured, VALID_FEATURED);
  const categorySlugs = parseCategorySlugs(params.categories);
  const sort = parseSort(params.sort);
  const page = Math.max(1, Number(params.page) || 1);
  const perPage = (CATEGORY_FILTER_VALID_VALUES.perPage as readonly number[]).includes(Number(params.perPage))
    ? Number(params.perPage)
    : CATEGORY_FILTER_VALID_VALUES.perPageDefault;

  const [{ items, total, totalPages, statusCounts }, categoriesForPicker] = await Promise.all([
    listAdminCategories({
      search: params.search ?? "",
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
    <AdminPageShell
      headerVisibility="desktop"
      headerDensity="compact"
      eyebrow={CATEGORY_LIST_PAGE_COPY.eyebrow}
      title={CATEGORY_LIST_PAGE_COPY.title}
      description={CATEGORY_LIST_PAGE_COPY.description}
      scrollMode="nested"
      topbarAction={<CategoryCreateTopbarMenu />}
      navigation={{ label: CATEGORY_NAVIGATION_COPY.homeLabel, href: "/admin" }}
      breadcrumbs={[
        { label: CATEGORY_NAVIGATION_COPY.homeLabel, href: "/admin" },
        { label: CATEGORY_NAVIGATION_COPY.categoriesLabel, href: ADMIN_CATEGORIES_LIST_PATH },
      ]}
      viewportClassName="!h-full"
      contentClassName="min-h-0 flex-1 overflow-hidden px-3 pt-14 pb-4 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:pt-12 lg:px-6 lg:pb-6 lg:pt-0"
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
    </AdminPageShell>
  );
}
