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
import {
  ADMIN_SIDEBAR_GROUP_CONTENT_CLASSNAME,
  ADMIN_SIDEBAR_GROUP_TRIGGER_CLASSNAME,
} from "./admin-sidebar.styles";

const GROUP_CLASSNAMES = {
  root: "group/collapsible",
  sidebarGroup: "p-0",
  label: "p-0",
  content: ADMIN_SIDEBAR_GROUP_CONTENT_CLASSNAME,
  groupContent: "pt-1.5",
  menu: "gap-px desktop:gap-0.5",
  icon: "size-4 shrink-0",
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
          <CollapsibleTrigger className={cn(ADMIN_SIDEBAR_GROUP_TRIGGER_CLASSNAME)}>
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
