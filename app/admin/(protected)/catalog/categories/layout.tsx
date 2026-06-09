//app/admin/(protected)/catalog/categories/layout.tsx
import type { ReactNode } from "react";

import { AdminSplitView } from "@/components/admin/layout/admin-split-view";
import { CATEGORY_LAYOUT_CONFIG } from "@/features/admin/categories/config";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";

type CategoriesLayoutProps = {
  list: ReactNode;
  detail: ReactNode;
};

export default function CategoriesLayout({ list, detail }: CategoriesLayoutProps) {
  return (
    <AdminPageShell
      className="admin-split-page-shell min-h-0 lg:h-dvh lg:overflow-hidden"
      scrollMode="area"
      title="Catégories"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue", href: "/admin/catalog/overview" },
        { label: "Catégories" },
      ]}
      contentPreset="split-panel"
      contentClassName="admin-split-page-content min-h-0 lg:h-full lg:overflow-hidden"
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminSplitView
        list={list}
        detail={detail}
        listRootPath={CATEGORY_LAYOUT_CONFIG.listRootPath}
        overviewPath="/admin/catalog/categories/overview"
        detailClassName={CATEGORY_LAYOUT_CONFIG.detailClassName}
        compactSplit={CATEGORY_LAYOUT_CONFIG.compactSplit}
        desktopResizable={CATEGORY_LAYOUT_CONFIG.desktopResizable}
        desktopCollapsible={CATEGORY_LAYOUT_CONFIG.desktopCollapsible}
        defaultDesktopListWidth={CATEGORY_LAYOUT_CONFIG.defaultDesktopListWidth}
        minDesktopListWidth={CATEGORY_LAYOUT_CONFIG.minDesktopListWidth}
        maxDesktopListWidth={CATEGORY_LAYOUT_CONFIG.maxDesktopListWidth}
        mobileBackToListLabel={CATEGORY_LAYOUT_CONFIG.mobileBackToListLabel}
      />
    </AdminPageShell>
  );
}
