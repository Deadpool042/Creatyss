//components/storefront/public-site-shell.tsx
"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { HeaderPublic } from "@/components/storefront/header/header-public";

type PublicSiteShellProps = Readonly<{
  children: ReactNode;
}>;

export function PublicSiteShell({ children }: PublicSiteShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isBoutiqueProductRoute = pathname.startsWith("/boutique/");

  if (isAdminRoute) {
    return children;
  }

  return (
    <div className="min-h-screen">
      <HeaderPublic pathname={pathname} />

      <main
        className={`mx-auto w-full max-w-full overflow-x-clip pb-24 min-[560px]:max-[1199px]:landscape:pb-18 ${
          isBoutiqueProductRoute ? "pt-0" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
