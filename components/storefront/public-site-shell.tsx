//components/storefront/public-site-shell.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  BadgeCheckIcon,
  BookOpenTextIcon,
  CreditCardIcon,
  GemIcon,
  Grid2X2Icon,
  HouseIcon,
  MailIcon,
  MapPinIcon,
  MenuIcon,
  // MoonStarIcon,
  NewspaperIcon,
  SearchIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  SparklesIcon,
  StoreIcon,
  UserIcon,
} from "lucide-react";

import { ModeToggle } from "../shared/mode-toggle";
import { CustomLink } from "../shared";

type PublicNavIcon = ComponentType<SVGProps<SVGSVGElement>>;

type PublicNavItem = Readonly<{
  href: string;
  label: string;
  icon: PublicNavIcon;
}>;

type MarketingHeaderItem = Readonly<{
  icon: PublicNavIcon;
  label: string;
}>;

const DESKTOP_NAV_ITEMS = [
  { href: "/boutique", label: "Boutique", icon: ShoppingBagIcon },
  { href: "/nouveautes", label: "Nouveautés", icon: SparklesIcon },
  { href: "/categories", label: "Catégories", icon: Grid2X2Icon },
  { href: "/les-marches", label: "Les marchés", icon: StoreIcon },
  { href: "/a-propos", label: "À propos", icon: BookOpenTextIcon },
  { href: "/blog", label: "Blog", icon: NewspaperIcon },
  { href: "/contact", label: "Contact", icon: MailIcon },
] as const satisfies readonly PublicNavItem[];

const TOUCH_NAV_ITEMS = [
  { href: "/", label: "Accueil", icon: HouseIcon },
  { href: "/boutique", label: "Boutique", icon: ShoppingBagIcon },
  { href: "/categories", label: "Catégories", icon: Grid2X2Icon },
  { href: "/les-marches", label: "Marchés", icon: StoreIcon },
  { href: "/compte", label: "Compte", icon: UserIcon },
] as const satisfies readonly PublicNavItem[];

const HEADER_ACTIONS = [
  { href: "/recherche", label: "Rechercher", icon: SearchIcon },
  { href: "/compte", label: "Mon compte", icon: UserIcon },
  { href: "/panier", label: "Panier", icon: ShoppingCartIcon },
] as const satisfies readonly PublicNavItem[];

const TOUCH_HEADER_ACTIONS = [
  { href: "/panier", label: "Panier", icon: ShoppingCartIcon },
] as const satisfies readonly PublicNavItem[];

const MARKETING_HEADER_ITEMS = [
  {
    label: "Artisan des Métiers d’Art",
    icon: BadgeCheckIcon,
  },
  {
    label: "Fabrication française",
    icon: MapPinIcon,
  },
  {
    label: "Chaque sac est unique",
    icon: GemIcon,
  },
  {
    label: "Paiement sécurisé",
    icon: CreditCardIcon,
  },
] as const satisfies readonly MarketingHeaderItem[];

type PublicSiteShellProps = Readonly<{
  children: ReactNode;
}>;

function isPublicLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function PublicLogo() {
  return (
    <Link className="flex min-w-0 items-center gap-2.5 text-foreground" href="/">
      <Image
        src="/uploads/logo.svg"
        alt=""
        aria-hidden="true"
        width={36}
        height={36}
        className="h-7 w-auto shrink-0 object-contain opacity-90"
      />
      <span className="truncate text-[1.05rem] font-medium uppercase tracking-[0.36em]">
        Creatyss
      </span>
    </Link>
  );
}

function PublicTouchLogo() {
  return (
    <Link className="grid justify-items-center text-center text-foreground" href="/">
      <span className="text-[0.95rem] font-medium uppercase tracking-[0.3em] min-[560px]:max-[1199px]:landscape:text-[0.83rem] min-[560px]:max-[1199px]:landscape:tracking-[0.24em]">
        Creatyss
      </span>
      <span className="text-[0.55rem] uppercase tracking-[0.14em] text-text-muted-strong min-[560px]:max-[1199px]:landscape:text-[0.48rem] min-[560px]:max-[1199px]:landscape:tracking-[0.11em]">
        Artisan des Métiers d’Art
      </span>
    </Link>
  );
}

function HeaderIconLink({
  href,
  label,
  icon: Icon,
  pathname,
}: PublicNavItem & { pathname: string }) {
  const isActive = isPublicLinkActive(pathname, href);

  return (
    <Link
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
        isActive
          ? "bg-surface-subtle text-brand"
          : "text-foreground/72 hover:bg-surface-subtle hover:text-brand"
      }`}
      href={href}
    >
      <Icon className="size-[0.98rem]" />
    </Link>
  );
}

function MarketingHeader({ label, icon: Icon }: MarketingHeaderItem) {
  return (
    <div className="inline-flex items-center gap-2 text-text-muted-strong">
      <Icon className="size-[0.82rem] text-brand/80" aria-hidden="true" />
      <span className="text-[0.68rem] font-medium tracking-[0.08em]">{label}</span>
    </div>
  );
}

export function PublicSiteShell({ children }: PublicSiteShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isBoutiqueListingRoute = pathname === "/boutique";
  const isBoutiqueProductRoute = pathname.startsWith("/boutique/");

  if (isAdminRoute) {
    return children;
  }

  return (
    <div
      className={
        isBoutiqueListingRoute
          ? "min-h-screen min-[1200px]:grid min-[1200px]:h-dvh min-[1200px]:grid-rows-[auto_minmax(0,1fr)] min-[1200px]:overflow-hidden"
          : "min-h-screen"
      }
    >
      <header className="site-header-blur sticky top-0 z-30 border-b border-shell-border">
        <div className="hidden border-b border-shell-border/60 py-1.5 lg:flex items-center justify-center gap-7 text-text-muted-strong">
          {MARKETING_HEADER_ITEMS.map((item) => (
            <MarketingHeader key={item.label} {...item} />
          ))}
        </div>
        <div className="mx-auto min-h-18 w-full max-w-430 px-4 sm:px-6 xl:px-12 min-[560px]:max-[1199px]:landscape:min-h-13">
          <div className="grid min-h-16 grid-cols-[5.5rem_minmax(0,1fr)_5.5rem] items-center min-[1200px]:hidden min-[560px]:max-[1199px]:landscape:min-h-11 min-[560px]:max-[1199px]:landscape:grid-cols-[4.5rem_minmax(0,1fr)_4.5rem]">
            <button
              type="button"
              aria-label="Ouvrir le menu"
              className="inline-flex h-9 w-9 items-center justify-center justify-self-start rounded-full text-foreground/72 transition-colors hover:bg-surface-subtle hover:text-foreground min-[560px]:max-[1199px]:landscape:h-8 min-[560px]:max-[1199px]:landscape:w-8"
            >
              <MenuIcon className="size-4 min-[560px]:max-[1199px]:landscape:size-3.25" />
            </button>

            <div className="justify-self-center">
              <PublicTouchLogo />
            </div>

            <div className="flex items-center justify-self-end gap-0.5">
              {TOUCH_HEADER_ACTIONS.map((link) => (
                <HeaderIconLink
                  href={link.href}
                  icon={link.icon}
                  key={link.href}
                  label={link.label}
                  pathname={pathname}
                />
              ))}
              <ModeToggle size="compact" />
            </div>
          </div>

          <div className="hidden min-h-18 items-center justify-between gap-4 min-[1200px]:flex">
            <div className="flex min-w-0 items-center gap-3">
              <PublicLogo />
            </div>

            <nav
              aria-label="Navigation principale"
              className="items-center gap-4 min-[1200px]:flex"
            >
              {DESKTOP_NAV_ITEMS.map((link) => {
                const isActive = isPublicLinkActive(pathname, link.href);

                return (
                  <CustomLink
                    href={link.href}
                    isActive={isActive}
                    key={link.href}
                    size="sm"
                    variant="navUnderline"
                    className="px-1.5 py-2 text-[0.68rem]"
                  >
                    {link.label}
                  </CustomLink>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-1.5">
              {HEADER_ACTIONS.map((link) => (
                <HeaderIconLink
                  href={link.href}
                  icon={link.icon}
                  key={link.href}
                  label={link.label}
                  pathname={pathname}
                />
              ))}
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      <nav
        aria-label="Navigation tactile"
        className="site-header-blur fixed inset-x-0 bottom-0 z-30 border-t border-shell-border p-1 min-[1200px]:hidden min-[560px]:max-[1199px]:landscape:p-0.5"
      >
        <div className="mx-auto grid w-full max-w-430 grid-cols-5 gap-1">
          {TOUCH_NAV_ITEMS.map((link) => {
            const Icon = link.icon;
            const isActive = isPublicLinkActive(pathname, link.href);

            return (
              <Link
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[0.68rem] font-medium transition-colors min-[560px]:max-[1199px]:landscape:min-h-10 min-[560px]:max-[1199px]:landscape:gap-0.5 min-[560px]:max-[1199px]:landscape:rounded-xl min-[560px]:max-[1199px]:landscape:py-0.5 min-[560px]:max-[1199px]:landscape:text-[0.56rem] ${
                  isActive
                    ? " text-brand"
                    : "text-foreground/70 hover:bg-surface-subtle hover:text-brand "
                }`}
                href={link.href}
                key={link.href}
              >
                <Icon className="size-[0.95rem] min-[560px]:max-[1199px]:landscape:size-[0.76rem]" />
                <span className="max-w-full truncate">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <main
        className={`mx-auto w-full max-w-full overflow-x-clip pb-24 min-[560px]:max-[1199px]:landscape:pb-18 ${
          isBoutiqueListingRoute
            ? "min-[1200px]:h-[calc(100dvh-4.5rem)] min-[1200px]:overflow-hidden min-[1200px]:pb-0"
            : ""
        } ${
          isBoutiqueProductRoute
            ? "pt-0"
            : isBoutiqueListingRoute
              ? // ? "px-4 pt-8 sm:px-6 xl:px-12 min-[1200px]:pt-0"
                // : "px-4 pt-8 sm:px-6 xl:px-12"
                "min-[1200px]:h-full"
              : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}
