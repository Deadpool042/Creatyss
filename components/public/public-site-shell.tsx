"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { ModeToggle } from "../shared/mode-toggle";

const publicLinks = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/blog", label: "Blog" },
  { href: "/panier", label: "Panier" }
] as const;

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
    <div className="min-h-screen">
      <header className="site-header-blur sticky top-0 z-30 border-b border-shell-border">
        <div className="mx-auto flex min-h-18 w-full max-w-7xl flex-col items-start justify-between gap-4 px-4 md:min-h-16 md:flex-row md:items-center md:px-6">
          <Link
            className="flex min-w-0 items-center gap-2 text-foreground"
            href="/">
            <Image
              src="/uploads/logo.svg"
              alt=""
              aria-hidden="true"
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 object-contain"
            />
            <span className="truncate text-sm font-semibold uppercase tracking-[0.18em] sm:text-[0.95rem]">
              Creatyss
            </span>
          </Link>

          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-1 md:flex">
            {publicLinks.map(link => (
              <Link
                className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-surface-subtle hover:text-foreground"
                href={link.href}
                key={link.href}>
                {link.label}
              </Link>
            ))}

            <Link
              className="ml-1 rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-foreground/60 transition-colors hover:bg-surface-subtle hover:text-foreground"
              href="/admin/login">
              Admin
            </Link>

            <ModeToggle />
          </nav>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  aria-label="Ouvrir le menu"
                  size="icon-sm"
                  variant="ghost">
                  <MenuIcon />
                </Button>
              </SheetTrigger>

              <SheetContent
                className="shell-drawer w-[min(22rem,100vw)] border-l border-shell-border p-0 shadow-soft"
                side="right">
                <SheetHeader className="px-4 pb-2 pt-4">
                  <SheetTitle className="text-left text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                    Creatyss V2
                  </SheetTitle>
                </SheetHeader>

                <nav
                  aria-label="Navigation principale mobile"
                  className="flex flex-col gap-1 px-4 pb-6">
                  {publicLinks.map(link => (
                    <SheetClose
                      asChild
                      key={link.href}>
                      <Link
                        className="rounded-xl px-3 py-3 text-base font-medium text-foreground/85 transition-colors hover:bg-surface-subtle hover:text-foreground"
                        href={link.href}>
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}

                  <div className="mt-3 border-t border-shell-border pt-3">
                    <SheetClose asChild>
                      <Link
                        className="rounded-xl px-3 py-3 text-sm font-medium uppercase tracking-[0.14em] text-foreground/60 transition-colors hover:bg-surface-subtle hover:text-foreground"
                        href="/admin/login">
                        Admin
                      </Link>
                    </SheetClose>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full pb-16 pt-8">{children}</main>
    </div>
  );
}
