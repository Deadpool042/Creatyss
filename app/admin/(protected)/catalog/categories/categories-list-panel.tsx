//app/admin/(protected)/catalog/categories/categories-list-panel.tsx
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import {
  CategoriesPanelList,
  CategoryCreateTopbarMenu,
  listAdminCategories,
} from "@/features/admin/categories";
import { CATEGORY_LIST_PAGE_COPY } from "@/features/admin/categories/config";
import { parseAdminCategoryListSearchParams } from "@/features/admin/categories/list/schemas/parse-admin-category-list-search-params";

type CategoriesListPanelProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export async function CategoriesListPanel({ searchParams }: CategoriesListPanelProps) {
  const filters = parseAdminCategoryListSearchParams(searchParams ?? {});
  // const { items } = await listAdminCategories(filters);

  let items: Awaited<ReturnType<typeof listAdminCategories>>["items"] = [];

  try {
    const result = await listAdminCategories(filters);
    items = result.items;
  } catch (err) {
    console.error("[categories] listAdminCategories failed:", err);
  }

  return (
    <AdminPageShell
      title={CATEGORY_LIST_PAGE_COPY.title}
      topbarAction={<CategoryCreateTopbarMenu />}
      contentPreset="split-panel"
      showBreadcrumbsInContent={false}
      scrollMode="area"
    >
      <CategoriesPanelList categories={items} />
    </AdminPageShell>
  );
}
