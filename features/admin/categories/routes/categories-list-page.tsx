import { AdminSplitPaneShell } from "@/components/admin/layout/admin-split-pane-shell";
import { CategoriesPanelList, listAdminCategories } from "@/features/admin/categories";
import { CATEGORY_LIST_PAGE_COPY } from "@/features/admin/categories/config";
import { parseAdminCategoryListSearchParams } from "@/features/admin/categories/list/schemas/parse-admin-category-list-search-params";

type CategoriesListPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export async function CategoriesListPage({ searchParams }: CategoriesListPageProps) {
  const filters = parseAdminCategoryListSearchParams(searchParams ?? {});

  let items: Awaited<ReturnType<typeof listAdminCategories>>["items"] = [];

  try {
    const result = await listAdminCategories(filters);
    items = result.items;
  } catch (err) {
    console.error("[categories] listAdminCategories failed:", err);
  }

  return (
    <AdminSplitPaneShell title={CATEGORY_LIST_PAGE_COPY.title}>
      <CategoriesPanelList categories={items} />
    </AdminSplitPaneShell>
  );
}
