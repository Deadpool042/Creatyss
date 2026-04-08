"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  type AdminSidebarNavGroup,
  isAdminNavigationItemActive,
} from "@/components/admin/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { AdminSidebarLink } from "./admin-sidebar-link";

type AdminSidebarGroupProps = {
  group: AdminSidebarNavGroup;
};

export function AdminSidebarGroup({ group }: AdminSidebarGroupProps) {
  const pathname = usePathname();

  const isGroupActive = group.items.some(
    (item) => !item.disabled && isAdminNavigationItemActive(pathname, item.url)
  );

  const firstEnabledItem = group.items.find((item) => !item.disabled) ?? null;
  const GroupIcon = group.icon;

  return (
    <Collapsible defaultOpen={group.defaultOpen ?? false} className="group/collapsible">
      <SidebarGroup className="p-0">
        <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
          <SidebarMenuItem>
            {firstEnabledItem ? (
              <SidebarMenuButton
                asChild
                tooltip={group.title}
                isActive={isGroupActive}
                className={cn(
                  "h-9 rounded-lg transition-colors duration-150",
                  isGroupActive
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Link href={firstEnabledItem.url}>
                  <GroupIcon className={cn("size-4 shrink-0", isGroupActive && "text-brand")} />
                </Link>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                tooltip={group.title}
                disabled
                className="h-9 rounded-lg opacity-45"
              >
                <GroupIcon className="size-4 shrink-0" />
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarGroupLabel asChild className="p-0">
          <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-all hover:bg-sidebar-accent/40 hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden data-[state=open]:text-brand">
            <ChevronRight className="size-4 shrink-0 transition-transform duration-200 ease-out group-data-[state=open]/collapsible:rotate-90" />
            <span>{group.title}</span>
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent className="ml-2 overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent className="pt-1">
            <SidebarMenu className="gap-1">
              {group.items.map((item) =>
                item.disabled ? (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      disabled
                      tooltip={`${item.title} — bientôt disponible`}
                      className="h-10 rounded-xl border border-transparent opacity-65 transition-all hover:bg-sidebar-accent/40"
                    >
                      <item.icon className="size-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge ? (
                        <span className="rounded-md border border-sidebar-border/80 bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {item.badge}
                        </span>
                      ) : null}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <AdminSidebarLink
                    key={item.url}
                    href={item.url}
                    icon={item.icon}
                    tooltip={item.title}
                    {...(item.exact !== undefined ? { exact: item.exact } : {})}
                  >
                    <span className="flex-1">{item.title}</span>
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
