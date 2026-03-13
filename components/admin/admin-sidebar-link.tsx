"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";

type AdminSidebarLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  tooltip?: string;
};

export function AdminSidebarLink({
  href,
  children,
  icon: Icon,
  tooltip
}: AdminSidebarLinkProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const isActive =
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className="h-9 rounded-lg px-4 text-sm"
        {...(tooltip !== undefined && { tooltip })}>
        <Link
          aria-current={isActive ? "page" : undefined}
          href={href}
          onClick={() => {
            if (isMobile) {
              setOpenMobile(false);
            }
          }}>
          {Icon && <Icon />}
          <span className="group-data-[collapsible=icon]:hidden">
            {children}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
