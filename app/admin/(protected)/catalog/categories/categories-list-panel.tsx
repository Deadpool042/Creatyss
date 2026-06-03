import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminSplitPanelHeader } from "@/components/admin/layout/admin-split-panel-header";
import {
  CategoriesPanelList,
  CategoryCreateTopbarMenu,
  listAdminCategories,
} from "@/features/admin/categories";
import {
  CATEGORY_LIST_PAGE_COPY,
} from "@/features/admin/categories/config";

export async function CategoriesListPanel() {
  const { items } = await listAdminCategories({});

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
