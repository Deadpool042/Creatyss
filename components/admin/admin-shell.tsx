"use client";

import type { ReactNode } from "react";

import type { AdminNavigationGroup, AdminNavigationItem } from "@/features/admin/navigation";
import { AdminPageTitleProvider } from "@/components/admin/admin-page-title-context";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileBottomNav, AdminTopbar } from "@/components/admin/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type AdminShellProps = {
  children: ReactNode;
  displayName: string;
  email: string;
  rootItems: ReadonlyArray<AdminNavigationItem>;
  groups: ReadonlyArray<AdminNavigationGroup>;
  mobilePrimaryItems: ReadonlyArray<AdminNavigationItem>;
  mobileMoreItems: ReadonlyArray<AdminNavigationItem>;
};

export function AdminShell({
  children,
  displayName,
  email,
  rootItems,
  groups,
  mobilePrimaryItems,
  mobileMoreItems,
}: AdminShellProps) {
  return (
    <AdminPageTitleProvider>
      <SidebarProvider
        data-admin-shell="true"
        className="h-svh overflow-hidden supports-[height:100dvh]:h-dvh"
      >
        <div className="hidden lg:block [@media(max-height:480px)]:hidden">
          <AdminSidebar
            displayName={displayName}
            email={email}
            rootItems={rootItems}
            groups={groups}
          />
        </div>

        <SidebarInset className="relative min-w-0 bg-page-background text-page-foreground">
          <AdminTopbar />

          <div className="min-h-0 flex-1 overflow-hidden">
            <div className="flex min-h-0 h-full w-full flex-col overflow-hidden">{children}</div>
          </div>

          <AdminMobileBottomNav primaryItems={mobilePrimaryItems} moreItems={mobileMoreItems} />
        </SidebarInset>
      </SidebarProvider>
    </AdminPageTitleProvider>
  );
}
