"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { AdminNavigationGroup } from "@/features/admin/navigation";
import { isAdminNavigationItemActive, renderAdminNavigationIcon } from "../shared";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { AdminSidebarLink } from "./admin-sidebar-link";

const GROUP_CLASSNAMES = {
  root: "group/collapsible",
  sidebarGroup: "p-0",
  label: "p-0",
  content:
    "ml-2 overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
  groupContent: "pt-1",
  menu: "gap-px desktop:gap-0.5",
  icon: "size-4 shrink-0",
} as const;

const TRIGGER_CLASSNAMES = {
  base: "flex w-full items-center gap-2 rounded-l-none rounded-r-sm px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-2",
  desktop: "desktop:py-2 desktop:text-[11px] desktop:tracking-[0.18em]",
  inactive:
    "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  open: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:shadow-raised data-[state=open]:border-l-4 data-[state=open]:border-brand",
  focus: "focus-visible:ring-sidebar-ring",
} as const;

const CHEVRON_CLASSNAMES = {
  base: "size-4 shrink-0 transition-transform duration-200 ease-out",
  open: "group-data-[state=open]/collapsible:rotate-90",
} as const;

type AdminSidebarGroupProps = Readonly<{
  group: AdminNavigationGroup;
}>;

export function AdminSidebarGroup({ group }: AdminSidebarGroupProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(group.defaultOpen ?? false);

  const isGroupActive = group.items.some((item) =>
    isAdminNavigationItemActive(pathname, item.href)
  );

  return (
    <Collapsible
      open={isGroupActive || isOpen}
      onOpenChange={setIsOpen}
      className={GROUP_CLASSNAMES.root}
    >
      <SidebarGroup className={GROUP_CLASSNAMES.sidebarGroup}>
        <SidebarGroupLabel asChild className={GROUP_CLASSNAMES.label}>
          <CollapsibleTrigger
            className={cn(
              TRIGGER_CLASSNAMES.base,
              TRIGGER_CLASSNAMES.desktop,
              TRIGGER_CLASSNAMES.inactive,
              TRIGGER_CLASSNAMES.open,
              TRIGGER_CLASSNAMES.focus
            )}
          >
            <ChevronRight className={cn(CHEVRON_CLASSNAMES.base, CHEVRON_CLASSNAMES.open)} />
            <span>{group.label}</span>
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent className={GROUP_CLASSNAMES.content}>
          <SidebarGroupContent className={GROUP_CLASSNAMES.groupContent}>
            <SidebarMenu className={GROUP_CLASSNAMES.menu}>
              {group.items.map((item) => (
                <AdminSidebarLink
                  key={item.key}
                  href={item.href}
                  tooltip={item.label}
                  {...(item.exact !== undefined ? { exact: item.exact } : {})}
                  iconContent={renderAdminNavigationIcon(item.iconKey, {
                    className: GROUP_CLASSNAMES.icon,
                  })}
                >
                  {item.label}
                </AdminSidebarLink>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
