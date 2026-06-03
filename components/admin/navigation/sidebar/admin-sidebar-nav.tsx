"use client";

import type { JSX } from "react";

import type { AdminNavigationGroup, AdminNavigationItem } from "@/features/admin/navigation";
import { renderAdminNavigationIcon } from "../shared/admin-navigation-icons";
import { AdminSidebarGroup } from "./admin-sidebar-group";
import { AdminSidebarLink } from "./admin-sidebar-link";
import { SidebarMenu, SidebarSeparator } from "@/components/ui/sidebar";

type AdminSidebarNavProps = {
  rootItems: ReadonlyArray<AdminNavigationItem>;
  groups: ReadonlyArray<AdminNavigationGroup>;
};

export function AdminSidebarNav({ rootItems, groups }: AdminSidebarNavProps): JSX.Element {
  return (
    <nav aria-label="Navigation admin" className="flex flex-col gap-1">
      <SidebarMenu className="gap-1 py-0.5">
        {rootItems.map((item) => (
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

      <SidebarSeparator className="mx-2 my-0.5 bg-sidebar-border/40" />

      {groups.map((group) => (
        <AdminSidebarGroup key={group.key} group={group} />
      ))}
    </nav>
  );
}
