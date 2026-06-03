import type { ReactNode } from "react";

import { AdminSplitView } from "@/components/admin/layout/admin-split-view";
import { AdminRouteBreadcrumbs } from "@/components/admin/navigation/admin-route-breadcrumbs";

import { OrdersListPanel } from "./orders-list-panel";

type OrdersLayoutProps = {
  detail: ReactNode;
};

export default function OrdersLayout({ detail }: OrdersLayoutProps) {
  return (
    <AdminSplitView
      list={<OrdersListPanel />}
      detail={detail}
      header={<AdminRouteBreadcrumbs />}
      listRootPath="/admin/commerce/orders"
      desktopCollapsible
      desktopStorageKey="commerce-orders"
      defaultDesktopListWidth={380}
      minDesktopListWidth={300}
      maxDesktopListWidth={520}
    />
  );
}
