"use client";

import { LogOut } from "lucide-react";

import type { AdminNavigationGroup, AdminNavigationItem } from "@/features/admin/navigation";
import { AdminSidebarNav } from "./admin-sidebar-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type AdminSidebarProps = {
  displayName: string;
  email: string;
  rootItems: ReadonlyArray<AdminNavigationItem>;
  groups: ReadonlyArray<AdminNavigationGroup>;
};

export function AdminSidebar({ displayName, email, rootItems, groups }: AdminSidebarProps) {
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Sidebar
      collapsible="icon"
      className={[
        // Visibilité : caché sur mobile (<768px) et landscape compact
        "md:hidden lg:block [@media(max-height:480px)]:hidden",
        // Position : commence sous la topbar (admin-topbar-height = 3.75rem)
        // Landscape compact : topbar = 3rem
        "top-[3.75rem] h-[calc(100svh-3.75rem)]",
        "[@media(max-height:480px)]:top-[3rem]",
        // Style
        "border-r border-sidebar-border/60 bg-sidebar",
      ].join(" ")}
    >
      {/* ── Contenu nav ────────────────────────────────────────────────── */}
      <SidebarContent className="bg-sidebar px-2.5 py-3">
        <AdminSidebarNav rootItems={rootItems} groups={groups} />
      </SidebarContent>

      {/* ── Footer : utilisateur + déconnexion + trigger ────────────────── */}
      <SidebarFooter className="border-t border-sidebar-border/50 bg-sidebar px-2.5 py-2.5">
        <SidebarMenu>
          {/* Utilisateur */}
          <SidebarMenuItem>
            <SidebarMenuButton
              size="default"
              className="h-10 rounded-xl px-2.5 text-sidebar-foreground hover:bg-sidebar-accent/50 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:px-0"
            >
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-sidebar-border/70 bg-surface-panel/80 text-[12px] font-semibold text-sidebar-foreground shadow-control group-data-[collapsible=icon]:mx-auto">
                {initial}
              </div>
              <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-[13px] font-medium text-sidebar-foreground">
                  {displayName}
                </span>
                <span className="truncate text-[11px] text-text-muted-soft">{email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Déconnexion + trigger */}
        <div className="mt-1.5 flex items-center justify-between gap-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center">
          {/* Logout — masqué en mode icon (accessible via topbar) */}
          <form action="/admin/logout" method="POST" className="group-data-[collapsible=icon]:hidden">
            <button
              type="submit"
              className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[12px] text-text-muted-soft transition-colors hover:bg-feedback-error-surface/40 hover:text-feedback-error-foreground"
            >
              <LogOut className="size-3.5 shrink-0" />
              Se déconnecter
            </button>
          </form>

          <SidebarTrigger className="size-8 shrink-0 rounded-lg border border-sidebar-border/60 bg-surface-panel/60 text-text-muted-soft shadow-control transition-colors hover:bg-surface-panel hover:text-sidebar-foreground" />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
