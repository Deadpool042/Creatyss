"use client";

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

import { AdminSidebarLink } from "./admin-sidebar-link";
import type { AdminNavGroup } from "./admin-sidebar";

type AdminSidebarGroupProps = {
  group: AdminNavGroup;
};

export function AdminSidebarGroup({ group }: AdminSidebarGroupProps) {
  return (
    <Collapsible
      defaultOpen={group.defaultOpen ?? false}
      className="group/collapsible">
      <SidebarGroup className="p-0">
        <SidebarGroupLabel
          asChild
          className="p-0">
          <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-all hover:bg-sidebar-accent/40 hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden data-[state=open]:text-brand">
            <ChevronRight className="size-4 shrink-0 transition-transform duration-200 ease-out group-data-[state=open]/collapsible:rotate-90" />
            <span>{group.label}</span>
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up group-data-[collapsible=icon]:hidden ">
          <SidebarGroupContent className="pt-1">
            <SidebarMenu className="gap-1">
              {group.items.map(item =>
                item.disabled ? (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      disabled
                      tooltip={`${item.label} — bientôt disponible`}
                      className="h-10 rounded-xl border border-transparent opacity-65 transition-all hover:bg-sidebar-accent/40">
                      <item.icon className="size-4" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge ? (
                        <span className="rounded-md border border-sidebar-border/80 bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {item.badge}
                        </span>
                      ) : null}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <AdminSidebarLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    tooltip={item.label}>
                    <span className="flex-1">{item.label}</span>
                  </AdminSidebarLink>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
