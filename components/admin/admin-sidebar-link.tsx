"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

type AdminSidebarLinkProps = { href: string; children: React.ReactNode };

export function AdminSidebarLink({ href, children }: AdminSidebarLinkProps) {
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
      >
        <Link
          aria-current={isActive ? "page" : undefined}
          href={href}
          onClick={() => {
            if (isMobile) {
              setOpenMobile(false);
            }
          }}
        >
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
