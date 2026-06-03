import type { ReactNode } from "react";

import { AdminSplitView } from "@/components/admin/layout/admin-split-view";
import { CategoriesListPanel } from "./categories-list-panel";

type CategoriesLayoutProps = { detail: ReactNode };

export default function CategoriesLayout({ detail }: CategoriesLayoutProps) {
  return (
    <AdminSplitView
      list={<CategoriesListPanel />}
      detail={detail}
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
