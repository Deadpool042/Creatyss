"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { FooterPublic } from "./footer/footer-public";
import { TopbarPublic } from "./topbar/topbar-public";

type PublicSiteShellProps = Readonly<{
  children: ReactNode;
}>;

export function PublicSiteShell({ children }: PublicSiteShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return children;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopbarPublic pathname={pathname} />

      <main className="mx-auto w-full max-w-full flex-1  ">{children}</main>

      <FooterPublic />
    </div>
  );
}
