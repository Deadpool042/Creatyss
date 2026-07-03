import type { ReactNode } from "react";

import { AdminSplitPageShell } from "@/components/admin/layout/admin-split-page-shell";
import { AdminSplitView } from "@/components/admin/layout/admin-split-view";
import { requireInternalAdminCapability } from "@/core/auth/admin/require-internal-admin-capability";

type AdvancedSettingsLayoutProps = {
  list: ReactNode;
  detail: ReactNode;
};

export default async function AdvancedSettingsLayout({
  list,
  detail,
}: AdvancedSettingsLayoutProps) {
  await requireInternalAdminCapability("admin.settings.advanced.read");
  return (
    <AdminSplitPageShell
      title="Modules & fonctionnalités"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Réglages" },
        { label: "Modules & fonctionnalités" },
      ]}
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
