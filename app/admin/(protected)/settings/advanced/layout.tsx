import type { ReactNode } from "react";

import { AdminSplitPageShell } from "@/components/admin/layout/admin-split-page-shell";
import { AdminSplitView } from "@/components/admin/layout/admin-split-view";

type AdvancedSettingsLayoutProps = {
  list: ReactNode;
  detail: ReactNode;
};

export default function AdvancedSettingsLayout({ list, detail }: AdvancedSettingsLayoutProps) {
  return (
    <AdminSplitPageShell
      title="Avancé"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Réglages" }, { label: "Avancé" }]}
    >
      <AdminSplitView
        list={list}
        detail={detail}
        listRootPath="/admin/settings/advanced"
        overviewPath="/admin/settings/advanced/overview"
        compactSplit
        mobileBackToListLabel="Familles"
        defaultDesktopListWidth={288}
        minDesktopListWidth={272}
        maxDesktopListWidth={384}
        desktopResizable={false}
        desktopCollapsible={true}
      />
    </AdminSplitPageShell>
  );
}
