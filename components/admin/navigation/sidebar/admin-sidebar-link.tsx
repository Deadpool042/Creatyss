"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

import { isAdminNavigationItemActive } from "@/components/admin/navigation";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import {
  ADMIN_SIDEBAR_ITEM_CLASSNAME,
  ADMIN_SIDEBAR_ITEM_ICON_CLASSNAME,
  ADMIN_SIDEBAR_ITEM_LABEL_CLASSNAME,
} from "./admin-sidebar.styles";

type AdminSidebarLinkProps = {
  href: string;
  tooltip: string;
  children: ReactNode;
  exact?: boolean;
  iconContent?: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function AdminSidebarLink({
  href,
  tooltip,
  children,
  exact = false,
  iconContent,
  onClick,
}: AdminSidebarLinkProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const isActive = isAdminNavigationItemActive(pathname, href, exact);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (!event.defaultPrevented && isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={tooltip}
        isActive={isActive}
        className={ADMIN_SIDEBAR_ITEM_CLASSNAME}
      >
        <Link href={href} onClick={handleClick}>
          {iconContent ? (
            <span
              className={cn(
                ADMIN_SIDEBAR_ITEM_ICON_CLASSNAME,
                isActive && "text-brand"
              )}
            >
              {iconContent}
            </span>
          ) : null}
          <span className={ADMIN_SIDEBAR_ITEM_LABEL_CLASSNAME}>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
