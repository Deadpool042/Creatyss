import type { ReactNode } from "react";

import { AdminSplitView } from "@/components/admin/layout/admin-split-view";
import { AdminRouteBreadcrumbs } from "@/components/admin/navigation/admin-route-breadcrumbs";

type OrdersLayoutProps = {
  list: ReactNode;
  detail: ReactNode;
};

export default function OrdersLayout({ list, detail }: OrdersLayoutProps) {
  return (
    <AdminSplitView
      list={list}
      detail={detail}
      header={<AdminRouteBreadcrumbs />}
      listRootPath="/admin/commerce/orders"
      desktopResizable
      desktopCollapsible
      desktopStorageKey="commerce-orders"
      defaultDesktopListWidth={320}
      minDesktopListWidth={280}
      maxDesktopListWidth={460}
      mobileBackToListLabel="Toutes les commandes"
    />
  );
}
