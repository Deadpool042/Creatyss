"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

import type { AdminNavigationGroup, AdminNavigationItem } from "@/features/admin/navigation";
import { AdminSidebarNav } from "@/components/admin/navigation";
import { AdminLogoutButton } from "./admin-logout-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

type AdminSidebarProps = {
  displayName: string;
  email: string;
  rootItems: ReadonlyArray<AdminNavigationItem>;
  groups: ReadonlyArray<AdminNavigationGroup>;
};

export function AdminSidebar({ displayName, email, rootItems, groups }: AdminSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-2 group-data-[collapsible=icon]:hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="rounded-xl">
              <Link href="/admin" aria-label="Administration Creatyss">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-accent text-brand">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold text-sidebar-foreground">
                    Creatyss
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand">
                    Administration
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <AdminSidebarNav rootItems={rootItems} groups={groups} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="rounded-xl">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-accent text-sm font-semibold text-sidebar-foreground">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-sm font-medium text-sidebar-foreground">
                  {displayName}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/70">{email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <AdminLogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
