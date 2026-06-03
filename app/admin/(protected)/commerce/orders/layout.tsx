import type { ReactNode } from "react";

import { AdminSplitView } from "@/components/admin/layout/admin-split-view";

type OrdersLayoutProps = {
  children: ReactNode;
  detail: ReactNode;
};

export default function OrdersLayout({ children, detail }: OrdersLayoutProps) {
  return (
    <AdminSplitView
      list={children}
      detail={detail}
      listRootPath="/admin/commerce/orders"
      desktopCollapsible
      desktopStorageKey="commerce-orders"
      defaultDesktopListWidth={380}
      minDesktopListWidth={300}
      maxDesktopListWidth={520}
    />
  );
}
