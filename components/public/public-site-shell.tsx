"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  HouseIcon,
  MailIcon,
  NewspaperIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UserIcon
} from "lucide-react";
import { ModeToggle } from "../shared/mode-toggle";

const publicLinksLeft = [
  { href: "/", label: "Accueil", icon: HouseIcon },
  { href: "/boutique", label: "Collections", icon: ShoppingBagIcon },
  { href: "/blog", label: "Blog", icon: NewspaperIcon }
] as const;

const publicLinksRight = [
  { href: "/contact", label: "", icon: MailIcon },
  { href: "/mon-compte", label: "", icon: UserIcon },
  { href: "/panier", label: "", icon: ShoppingCartIcon }
] as const;

type PublicSiteShellProps = Readonly<{
  children: ReactNode;
}>;

function isPublicLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicSiteShell({ children }: PublicSiteShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return children;
  }

  return (
    <div className="min-h-screen">
      <header className="site-header-blur sticky top-0 z-30 border-b border-shell-border">
        <div className="mx-auto grid min-h-16 w-full max-w-430 grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 xl:px-12">
          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-4 md:flex">
            {publicLinksLeft.map(link => (
              <Link
                className={`px-1.5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.28em] transition-colors ${
                  isPublicLinkActive(pathname, link.href)
                    ? "text-foreground"
                    : "text-foreground/72 hover:text-foreground"
                }`}
                href={link.href}
                key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            className="mx-auto hidden min-w-0 items-center gap-2.5 text-foreground md:flex"
            href="/">
            <Image
              src="/uploads/logo.svg"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              className="hidden h-5 w-auto shrink-0 object-contain opacity-90 md:block"
            />
            <span className="truncate text-[1.05rem] font-medium uppercase tracking-[0.38em] sm:text-[1.18rem]">
              Creatyss
            </span>
          </Link>

          <div className="hidden items-center justify-self-end md:flex md:gap-1.5">
            {publicLinksRight.map(link => {
              const isActive = isPublicLinkActive(pathname, link.href);

              if (link.icon) {
                const Icon = link.icon;

                return (
                  <Link
                    aria-label={
                      link.href === "/contact"
                        ? "Contact"
                        : link.href === "/mon-compte"
                          ? "Mon compte"
                          : "Panier"
                    }
                    className={`inline-flex h-8.5 w-8.5 items-center justify-center rounded-full transition-colors ${
                      isActive
                        ? "bg-surface-subtle text-foreground"
                        : "text-foreground/72 hover:bg-surface-subtle hover:text-foreground"
                    }`}
                    href={link.href}
                    key={link.href}>
                    <Icon className="size-[0.95rem]" />
                  </Link>
                );
              }

              return (
                <Link
                  className={`px-1.5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.28em] transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground/72 hover:text-foreground"
                  }`}
                  href={link.href}
                  key={link.href}>
                  {link.label}
                </Link>
              );
            })}
            <ModeToggle />
          </div>

          <div className="col-span-3 flex min-h-16 items-center justify-between md:hidden">
            <Link
              className="flex min-w-0 items-center gap-2 text-foreground"
              href="/">
              <Image
                src="/uploads/logo.svg"
                alt=""
                aria-hidden="true"
                width={28}
                height={28}
                className="h-6 w-auto shrink-0 object-contain"
              />
              <span className="truncate text-sm font-semibold uppercase tracking-[0.24em]">
                Creatyss
              </span>
            </Link>

            <div className="flex items-center gap-1.5">
              <Link
                aria-label="Contact"
                className={`inline-flex h-8.5 w-8.5 items-center justify-center rounded-full transition-colors ${
                  isPublicLinkActive(pathname, "/contact")
                    ? "bg-surface-subtle text-foreground"
                    : "text-foreground/72 hover:bg-surface-subtle hover:text-foreground"
                }`}
                href="/contact">
                <MailIcon className="size-[0.95rem]" />
              </Link>

              <Link
                aria-label="Mon compte"
                className={`inline-flex h-8.5 w-8.5 items-center justify-center rounded-full transition-colors ${
                  isPublicLinkActive(pathname, "/mon-compte")
                    ? "bg-surface-subtle text-foreground"
                    : "text-foreground/72 hover:bg-surface-subtle hover:text-foreground"
                }`}
                href="/mon-compte">
                <UserIcon className="size-[0.95rem]" />
              </Link>

              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      <nav
        aria-label="Navigation principale mobile"
        className="site-header-blur fixed inset-x-0 bottom-0 z-30 border-t border-shell-border md:hidden">
        <div className="mx-auto grid w-full max-w-430 grid-cols-3 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {publicLinksLeft.map(link => {
            const Icon = link.icon;
            const isActive = isPublicLinkActive(pathname, link.href);

            return (
              <Link
                className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[0.66rem] font-medium transition-colors ${
                  isActive
                    ? "bg-surface-subtle text-foreground"
                    : "text-foreground/70 hover:bg-surface-subtle hover:text-foreground"
                }`}
                href={link.href}
                key={link.href}>
                <Icon className="size-[1.05rem]" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-full overflow-x-clip px-4 pb-28 pt-8 md:px-6 md:pb-20 xl:px-12">
        {children}
      </main>
    </div>
  );
}
