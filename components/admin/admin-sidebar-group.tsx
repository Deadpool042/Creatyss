"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  type AdminSidebarNavGroup,
  isAdminNavigationItemActive,
  renderAdminNavigationIcon,
} from "@/components/admin/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";

import { AdminSidebarLink } from "./admin-sidebar-link";

type AdminSidebarGroupProps = {
  group: AdminSidebarNavGroup;
};

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
      className="group/collapsible"
    >
      <SidebarGroup className="p-0">
        <SidebarGroupLabel asChild className="p-0">
          <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring desktop:rounded-xl desktop:py-2 desktop:text-[11px] desktop:tracking-[0.18em] data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <ChevronRight className="size-4 shrink-0 transition-transform duration-200 ease-out group-data-[state=open]/collapsible:rotate-90" />
            <span>{group.label}</span>
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent className="ml-2 overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <SidebarGroupContent className="pt-1">
            <SidebarMenu className="gap-0.5 desktop:gap-1">
              {group.items.map((item) => (
                <AdminSidebarLink
                  key={item.key}
                  href={item.href}
                  tooltip={item.label}
                  {...(item.exact !== undefined ? { exact: item.exact } : {})}
                  iconContent={renderAdminNavigationIcon(item.iconKey, {
                    className: "size-4 shrink-0",
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
