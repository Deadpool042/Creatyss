//app/admin/(protected)/catalog/categories/layout.tsx
import type { ReactNode } from "react";

import { AdminSplitView } from "@/components/admin/layout/admin-split-view";
import { CATEGORY_LAYOUT_CONFIG } from "@/features/admin/categories/config";
import { AdminSplitPageShell } from "@/components/admin/layout/admin-split-page-shell";
import { CatalogRouteNav } from "@/features/admin/catalog/components/catalog-route-nav";

type CategoriesLayoutProps = {
  list: ReactNode;
  detail: ReactNode;
};

export default function CategoriesLayout({ list, detail }: CategoriesLayoutProps) {
  return (
    <AdminSplitPageShell
      title="Catégories"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue", href: "/admin/catalog/overview" },
        { label: "Catégories" },
      ]}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <CatalogRouteNav />
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
      </div>
    </AdminSplitPageShell>
  );
}
