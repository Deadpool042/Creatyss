import type { ReactNode } from "react";

import { AdminSplitView } from "@/components/admin/layout/admin-split-view";
import { AdminRouteBreadcrumbs } from "@/components/admin/navigation/admin-route-breadcrumbs";

type CategoriesLayoutProps = {
  list: ReactNode;
  detail: ReactNode;
};

export default function CategoriesLayout({ list, detail }: CategoriesLayoutProps) {
  return (
    <AdminSplitView
      list={list}
      detail={detail}
      header={<AdminRouteBreadcrumbs />}
      listRootPath="/admin/catalog/categories"
      detailClassName="lg:overflow-visible"
      desktopResizable
      desktopCollapsible
      desktopStorageKey="catalog-categories"
      defaultDesktopListWidth={280}
      minDesktopListWidth={240}
      maxDesktopListWidth={380}
      mobileBackToListLabel="Toutes les catégories"
    />
  );
}
