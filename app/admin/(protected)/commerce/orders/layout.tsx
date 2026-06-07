//app/admin/(protected)/commerce/orders/layout.tsx
import type { ReactNode } from "react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminSplitView } from "@/components/admin/layout/admin-split-view";

type OrdersLayoutProps = {
  list: ReactNode;
  detail: ReactNode;
};

export default function OrdersLayout({ list, detail }: OrdersLayoutProps) {
  return (
    <AdminPageShell
      className="admin-split-page-shell min-h-0 lg:h-dvh lg:overflow-hidden lg:overscroll-contain"
      scrollMode="area"
      title="Commandes"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce", href: "/admin/commerce/overview" },
        { label: "Commandes" },
      ]}
      contentPreset="split-panel"
      contentClassName="admin-split-page-content min-h-0 lg:h-full lg:overflow-hidden"
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminSplitView
        list={list}
        detail={detail}
        listRootPath="/admin/commerce/orders"
        overviewPath="/admin/commerce/orders/overview"
        compactLandscapeMode="detailFocus"
        desktopResizable={false}
        desktopCollapsible={true}
        defaultDesktopListWidth={280}
        minDesktopListWidth={240}
        maxDesktopListWidth={460}
        mobileBackToListLabel="Toutes les commandes"
      />
    </AdminPageShell>
  );
}
