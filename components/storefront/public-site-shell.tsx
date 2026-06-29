"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { FooterPublic } from "./footer/footer-public";
import { OrientationGuard } from "./orientation/orientation-guard";
import { TopbarPublic } from "./topbar/topbar-public";

type PublicSiteShellProps = Readonly<{
  children: ReactNode;
  localeSelector?: ReactNode;
  logoUrl?: string | null;
}>;

export function PublicSiteShell({
  children,
  localeSelector,
  logoUrl = null,
}: PublicSiteShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return children;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <OrientationGuard />
      <TopbarPublic pathname={pathname} localeSelector={localeSelector} logoUrl={logoUrl} />

      <main id="main-content" className="mx-auto w-full max-w-full flex-1">
        {children}
      </main>

      <FooterPublic logoUrl={logoUrl} />
    </div>
  );
}
