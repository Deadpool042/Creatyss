import type { ReactNode } from "react";

import { AdminSplitView } from "@/components/admin/layout/admin-split-view";
import { AdminRouteBreadcrumbs } from "@/components/admin/navigation/admin-route-breadcrumbs";

type OrdersLayoutProps = {
  children: ReactNode;
  detail: ReactNode;
};

export default function OrdersLayout({ children, detail }: OrdersLayoutProps) {
  return (
    <AdminSplitView
      list={children}
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
