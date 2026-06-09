import type { ReactNode } from "react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminSplitView } from "@/components/admin/layout/admin-split-view";

type AdvancedSettingsLayoutProps = {
  list: ReactNode;
  detail: ReactNode;
};

export default function AdvancedSettingsLayout({ list, detail }: AdvancedSettingsLayoutProps) {
  return (
    <AdminPageShell
      className="admin-split-page-shell min-h-0 lg:h-dvh lg:overflow-hidden"
      scrollMode="nested"
      title="Avancé"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Réglages" }, { label: "Avancé" }]}
      contentPreset="split-panel"
      contentClassName="admin-split-page-content min-h-0 lg:h-full lg:overflow-hidden"
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
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
    </AdminPageShell>
  );
}
