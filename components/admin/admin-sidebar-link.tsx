"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type AdminSidebarLinkProps = { href: string; children: React.ReactNode };

export function AdminSidebarLink({ href, children }: AdminSidebarLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-[rgba(143,93,45,0.1)] font-semibold text-[#8f5d2d]"
          : "text-sidebar-foreground hover:bg-black/5"
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
