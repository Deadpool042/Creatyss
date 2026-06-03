import type { ReactNode } from "react";

import { AdminSplitView } from "@/components/admin/layout/admin-split-view";
import { AdminRouteBreadcrumbs } from "@/components/admin/navigation/admin-route-breadcrumbs";

type CategoriesLayoutProps = {
  children: ReactNode;
  detail: ReactNode;
};

export default function CategoriesLayout({ children, detail }: CategoriesLayoutProps) {
  return (
    <AdminSplitView
      list={children}
      detail={detail}
      header={<AdminRouteBreadcrumbs />}
      listRootPath="/admin/catalog/categories"
      detailClassName="lg:overflow-visible"
      desktopCollapsible
      desktopStorageKey="catalog-categories"
      defaultDesktopListWidth={360}
      minDesktopListWidth={296}
      maxDesktopListWidth={480}
    />
  );
}
