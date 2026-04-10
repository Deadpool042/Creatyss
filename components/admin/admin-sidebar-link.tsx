"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { isAdminNavigationItemActive } from "@/components/admin/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type AdminSidebarLinkProps = {
  href: string;
  tooltip: string;
  children: ReactNode;
  exact?: boolean;
  iconContent?: ReactNode;
};

export function AdminSidebarLink({
  href,
  tooltip,
  children,
  exact = false,
  iconContent,
}: AdminSidebarLinkProps) {
  const pathname = usePathname();
  const isActive = isAdminNavigationItemActive(pathname, href, exact);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={tooltip} isActive={isActive} className="h-9 rounded-xl">
        <Link href={href}>
          {iconContent ? (
            <span className={cn("shrink-0", isActive && "text-brand")}>{iconContent}</span>
          ) : null}
          <span className="truncate">{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
