import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { CategoryTable } from "@/features/admin/categories/components";
import { CategoryListToolbar } from "@/features/admin/categories/components/list/category-list-toolbar";
import {
  listAdminCategories,
  type CategoryFeaturedFilter,
  type CategorySortOption,
} from "@/features/admin/categories/list/queries/list-admin-categories.query";
import { CategorieCreateTopbarMenu } from "@/features/admin/categories/components/create/categorie-create-topbar-menu";
import type { AdminCategoryStatus } from "@/features/admin/categories/list/types/admin-category-card-item.types";

export const dynamic = "force-dynamic";

type SearchParams = {
  search?: string;
  status?: string;
  featured?: string;
  sort?: string;
  page?: string;
  perPage?: string;
};

const VALID_STATUSES = ["all", "draft", "active", "inactive", "archived"] as const;
const VALID_SORTS = ["name-asc", "name-desc", "updated-asc", "updated-desc"] as const;

function parseStatus(value: string | undefined): AdminCategoryStatus | "all" {
  return VALID_STATUSES.includes(value as (typeof VALID_STATUSES)[number])
    ? (value as AdminCategoryStatus | "all")
    : "all";
}

function parseSort(value: string | undefined): CategorySortOption {
  return VALID_SORTS.includes(value as (typeof VALID_SORTS)[number])
    ? (value as CategorySortOption)
    : "name-asc";
}

function parseFeatured(value: string | undefined): CategoryFeaturedFilter {
  if (value === "featured" || value === "not-featured") return value;
  return "all";
}

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const status = parseStatus(searchParams.status);
  const featured = parseFeatured(searchParams.featured);
  const sort = parseSort(searchParams.sort);
  const page = Math.max(1, Number(searchParams.page) || 1);
  const perPage = [10, 25, 50].includes(Number(searchParams.perPage))
    ? Number(searchParams.perPage)
    : 10;

  const { items, total, totalPages } = await listAdminCategories({
    search: searchParams.search ?? "",
    status: status === "all" ? "all" : status,
    featured,
    sort,
    page,
    perPage,
  });

  return (
    <AdminPageShell
      headerVisibility="desktop"
      headerDensity="default"
      eyebrow="Catégories"
      title="Catégories"
      description="Structurez les collections visibles dans la boutique."
      hideDescriptionOnMobile
      topbarAction={<CategorieCreateTopbarMenu />}
      navigation={{ label: "Accueil", href: "/admin" }}
      breadcrumbs={[
        { label: "Accueil", href: "/admin" },
        { label: "Catégories", href: "/admin/categories" },
      ]}
      viewportClassName="!h-full"
      contentClassName="min-h-0 flex-1 overflow-hidden px-3 pt-14 pb-0 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:pt-12 [@media(max-height:480px)]:pb-0 lg:h-full lg:!min-h-0 lg:px-6 lg:pb-4 lg:pt-0"
    >
      <div className="flex flex-col gap-4">
        <CategoryListToolbar total={total} totalPages={totalPages} />
        <CategoryTable categories={items} />
      </div>
    </AdminPageShell>
  );
}
