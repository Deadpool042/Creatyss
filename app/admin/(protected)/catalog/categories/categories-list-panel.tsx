//app/admin/(protected)/catalog/categories/categories-list-panel.tsx
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminSplitPanelHeader } from "@/components/admin/layout/admin-split-panel-header";
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
  const { items } = await listAdminCategories(filters);

  return (
    <AdminPageShell
      title={CATEGORY_LIST_PAGE_COPY.title}
      topbarAction={<CategoryCreateTopbarMenu />}
      contentPreset="split-panel"
      showBreadcrumbsInContent={false}
      header={
        <AdminSplitPanelHeader
          eyebrow={CATEGORY_LIST_PAGE_COPY.eyebrow}
          title={CATEGORY_LIST_PAGE_COPY.title}
          description={CATEGORY_LIST_PAGE_COPY.description}
        />
      }
      scrollMode="area"
    >
      <CategoriesPanelList categories={items} />
    </AdminPageShell>
  );
}
