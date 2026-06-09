//app/admin/(protected)/commerce/orders/layout.tsx
import type { ReactNode } from "react";

import { AdminSplitPageShell } from "@/components/admin/layout/admin-split-page-shell";
import { AdminSplitView } from "@/components/admin/layout/admin-split-view";

type OrdersLayoutProps = {
  list: ReactNode;
  detail: ReactNode;
};

export default function OrdersLayout({ list, detail }: OrdersLayoutProps) {
  return (
    <AdminSplitPageShell
      title="Commandes"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce", href: "/admin/commerce/overview" },
        { label: "Commandes" },
      ]}
    >
      <AdminSplitView
        list={list}
        detail={detail}
        listRootPath="/admin/commerce/orders"
        overviewPath="/admin/commerce/orders/overview"
        desktopResizable={false}
        desktopCollapsible={true}
        defaultDesktopListWidth={280}
        minDesktopListWidth={240}
        maxDesktopListWidth={460}
        mobileBackToListLabel="Toutes les commandes"
        compactSplit
      />
    </AdminSplitPageShell>
  );
}
