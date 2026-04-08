"use client";

import type { JSX } from "react";

import { adminSidebarDesktopGroups, adminSidebarRootItems } from "@/components/admin/navigation";
import { SidebarMenu, SidebarSeparator } from "@/components/ui/sidebar";
import { AdminSidebarGroup } from "@/components/admin/admin-sidebar-group";
import { AdminSidebarLink } from "@/components/admin/admin-sidebar-link";

export function AdminSidebarNav(): JSX.Element {
  return (
    <nav aria-label="Navigation admin" className="flex flex-col gap-0">
      <SidebarMenu className="gap-0.5 py-1">
        {adminSidebarRootItems.map((item) => (
          <AdminSidebarLink
            key={item.url}
            href={item.url}
            icon={item.icon}
            tooltip={item.title}
            {...(item.exact !== undefined ? { exact: item.exact } : {})}
          >
            {item.title}
          </AdminSidebarLink>
        ))}
      </SidebarMenu>

      <SidebarSeparator className="mx-2 my-1 opacity-40" />

      {adminSidebarDesktopGroups.map((group) => (
        <AdminSidebarGroup key={group.key} group={group} />
      ))}
    </nav>
  );
}
