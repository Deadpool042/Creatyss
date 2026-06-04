"use client";

import type { ReactNode } from "react";

import type { AdminNavigationGroup, AdminNavigationItem } from "@/features/admin/navigation";
import { AdminSidebar, AdminMobileBottomNav, AdminTopbar } from "@/components/admin/navigation";
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
    <>
      {/* mobileBreakpoint=1024 aligns with --breakpoint-laptop (theme.css),
          ensuring SidebarProvider renders a Sheet (not a persistent sidebar)
          on tablet (768–1023px), where the desktop sidebar is hidden (lg:block). */}
      <SidebarProvider
        mobileBreakpoint={1024}
        className="min-h-svh overflow-visible bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--shell-surface)_82%,white)_0%,color-mix(in_srgb,var(--shell-surface)_34%,var(--page-background))_36%,var(--page-background)_100%)] text-page-foreground supports-[height:100dvh]:min-h-dvh lg:h-svh lg:min-h-0 lg:overflow-hidden lg:supports-[height:100dvh]:h-dvh"
      >
        <div className="flex min-h-svh w-full flex-col overflow-visible supports-[height:100dvh]:min-h-dvh lg:h-svh lg:min-h-0 lg:overflow-hidden lg:supports-[height:100dvh]:h-dvh">
          <AdminTopbar displayName={displayName} email={email} />

          <div className="flex min-h-0 flex-1 flex-col overflow-visible lg:flex-row lg:overflow-hidden">
            <div className="hidden lg:block [@media(max-height:480px)]:hidden">
              <AdminSidebar
                displayName={displayName}
                email={email}
                rootItems={rootItems}
                groups={groups}
              />
            </div>

            <SidebarInset className="relative min-h-0 min-w-0 overflow-visible bg-[linear-gradient(180deg,color-mix(in_srgb,var(--page-background)_84%,var(--shell-surface))_0%,var(--page-background)_100%)] text-page-foreground lg:overflow-hidden">
              {children}
              <div
                aria-hidden
                className="h-[calc(3.5rem+env(safe-area-inset-bottom)+1.5rem)] shrink-0 lg:hidden [@media(max-height:480px)]:hidden"
              />
              <AdminMobileBottomNav
                primaryItems={mobilePrimaryItems}
                moreItems={mobileMoreItems}
              />
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
