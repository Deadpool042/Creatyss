import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { CategorieCreateTopbarMenu } from "@/features/admin/categories/components/create/categorie-create-topbar-menu";
import { CategoryTable } from "@/features/admin/categories/components";
import { CategoriesTableProvider } from "@/features/admin/categories/context/categories-data-provider";
import {
  CATEGORY_LIST_PAGE_COPY,
  CATEGORY_NAVIGATION_COPY,
} from "@/features/admin/categories/config";
import { ADMIN_CATEGORIES_LIST_PATH } from "@/features/admin/categories/shared/admin-categories-routes";
import {
  listAdminCategories,
  listCategoriesForPicker,
  type CategoryFeaturedFilter,
  type CategorySortOption,
} from "@/features/admin/categories/list/queries/list-admin-categories.query";
import type { AdminCategoryStatus } from "@/features/admin/categories/list/types/admin-category-card-item.types";

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

const VALID_STATUSES: AdminCategoryStatus[] = ["draft", "active", "inactive", "archived"];
const VALID_FEATURED: CategoryFeaturedFilter[] = ["featured", "not-featured"];
const VALID_SORTS: CategorySortOption[] = ["name-asc", "name-desc", "updated-asc", "updated-desc"];

function parseArrayParam<T extends string>(value: string | undefined, valid: T[]): T[] {
  if (!value) return [];
  return value.split(",").filter((v): v is T => valid.includes(v as T));
}

function parseCategoryIds(value: string | undefined): string[] {
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
  const categorySlugs = parseCategoryIds(params.categories);
  const sort = parseSort(params.sort);
  const page = Math.max(1, Number(params.page) || 1);
  const perPage = [5, 10, 25, 50].includes(Number(params.perPage)) ? Number(params.perPage) : 10;

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
      topbarAction={<CategorieCreateTopbarMenu />}
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
