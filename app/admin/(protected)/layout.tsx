import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { adminNavigationGroupDefinitions, adminNavigationItems } from "@/features/admin/navigation";
import {
  buildAdminMobileMoreNavigationItems,
  buildAdminMobilePrimaryNavigationItems,
  buildAdminNavigation,
  getAdminNavigationContext,
} from "@/features/admin/navigation/server";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAuthenticatedAdmin();

  const navigationContext = await getAdminNavigationContext({
    db,
    admin: {
      id: admin.id,
      email: admin.email,
    },
  });

  const allGroups = buildAdminNavigation({
    groupDefinitions: adminNavigationGroupDefinitions,
    items: adminNavigationItems,
    context: navigationContext,
  });

  const rootItems = allGroups.find((group) => group.key === "main")?.items ?? [];
  const groups = allGroups.filter((group) => group.key !== "main");

  const mobilePrimaryItems = buildAdminMobilePrimaryNavigationItems(
    adminNavigationItems,
    navigationContext
  );

  const mobileMoreItems = buildAdminMobileMoreNavigationItems(
    adminNavigationItems,
    navigationContext
  );

  return (
    <AdminShell
      displayName={admin.displayName ?? "Admin"}
      email={admin.email}
      rootItems={rootItems}
      groups={groups}
      mobilePrimaryItems={mobilePrimaryItems}
      mobileMoreItems={mobileMoreItems}
    >
      {children}
    </AdminShell>
  );
}
