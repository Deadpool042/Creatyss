import Image from "next/image";

import Link from "next/link";

import type { ComponentType, SVGProps } from "react";

import {
  BadgeCheckIcon,
  BookOpenTextIcon,
  CreditCardIcon,
  GemIcon,
  Grid2X2Icon,
  HomeIcon,
  MailIcon,
  MapPinIcon,
  NewspaperIcon,
  SearchIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  StoreIcon,
  UserIcon,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { cn } from "@/lib/utils";

import { MobileMenuDrawer } from "./mobile-menu-drawer";
import { TopbarNavLink, TopbarNavTrigger } from "./nav-primitives";

type PublicNavIcon = ComponentType<SVGProps<SVGSVGElement>>;

type PublicNavItem = Readonly<{
  href: string;

  label: string;

  icon?: PublicNavIcon;
  description?: string;
}>;

type MarketingHeaderItem = Readonly<{
  icon: PublicNavIcon;

  label: string;
}>;

type TopbarPublicProps = Readonly<{
  pathname: string;
}>;

const DESKTOP_NAV_ITEMS = [
  { href: "/boutique", label: "Boutique", icon: ShoppingBagIcon },

  { href: "/categories", label: "Catégories", icon: Grid2X2Icon },

  { href: "/les-marches", label: "Les marchés", icon: StoreIcon },

  { href: "/a-propos", label: "À propos", icon: BookOpenTextIcon },

  { href: "/blog", label: "Blog", icon: NewspaperIcon },

  { href: "/contact", label: "Contact", icon: MailIcon },
] as const satisfies readonly PublicNavItem[];

const DESKTOP_CATEGORY_LINKS = [
  { href: "/boutique?category=sacs", label: "Sacs", description: "Sacs artisanaux faits main." },
  {
    href: "/boutique?category=accessoires",
    label: "Accessoires",
    description: "Petites créations et pièces utiles.",
  },
] as const satisfies readonly PublicNavItem[];

const TOUCH_NAV_ITEMS = [
  { href: "/", label: "Accueil", icon: HomeIcon },

  { href: "/boutique", label: "Boutique", icon: ShoppingBagIcon },

  { href: "/categories", label: "Catégories", icon: Grid2X2Icon },

  { href: "/les-marches", label: "Marchés", icon: StoreIcon },
] as const satisfies readonly PublicNavItem[];

const MOBILE_COMPACT_HEADER_ACTIONS = [
  { href: "/recherche", label: "Rechercher", icon: SearchIcon },
  { href: "/panier", label: "Panier", icon: ShoppingCartIcon },
] as const satisfies readonly PublicNavItem[];

const TOUCH_LARGE_HEADER_ACTIONS = [
  { href: "/recherche", label: "Rechercher", icon: SearchIcon },

  { href: "/compte", label: "Mon compte", icon: UserIcon },

  { href: "/panier", label: "Panier", icon: ShoppingCartIcon },
] as const satisfies readonly PublicNavItem[];

const BOUTIQUE_REASSURANCE_ITEMS = [
  { label: "Artisan des Métiers d'Art", icon: BadgeCheckIcon },

  { label: "Fabrication française", icon: MapPinIcon },

  { label: "Chaque sac est unique", icon: GemIcon },

  { label: "Paiement sécurisé", icon: CreditCardIcon },
] as const satisfies readonly MarketingHeaderItem[];

function isPublicLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getIsBoutiqueRoute(pathname: string): boolean {
  return pathname === "/boutique" || pathname.startsWith("/boutique/");
}

function PublicLogo({
  prominent = false,
  compactDesktop = false,
}: {
  prominent?: boolean;
  compactDesktop?: boolean;
}) {
  return (
    <Link className="flex min-w-0 items-center gap-2.5 text-foreground" href="/">
      <Image
        src="/uploads/logo.svg"
        alt=""
        aria-hidden="true"
        width={36}
        height={36}
        className={[
          "w-auto shrink-0 object-contain",

          prominent ? "h-8 opacity-100" : "h-7 opacity-90",
        ].join(" ")}
      />

      <span
        className={[
          "truncate font-medium uppercase",

          compactDesktop ? "hidden wide:inline" : "inline",

          prominent ? "text-[1.1rem] tracking-[0.38em]" : "text-[1.05rem] tracking-[0.36em]",
        ].join(" ")}
      >
        Creatyss
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
    <Button
      asChild
      variant="ghost"
      size="icon"
      className={cn("rounded-full", isActive && "bg-surface-subtle text-brand")}
    >
      <Link
        href={href}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
      >
        {Icon && <Icon className="size-4" aria-hidden="true" />}
      </Link>
    </Button>
  );
}

function HeaderActions({
  pathname,
  variant = "desktop",
}: {
  pathname: string;
  variant?: "mobile" | "desktop";
}) {
  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-0.5">
        <div className="flex min-[390px]:hidden">
          {MOBILE_COMPACT_HEADER_ACTIONS.map((link) => (
            <HeaderIconLink key={link.href} {...link} pathname={pathname} />
          ))}
        </div>

        <div className="hidden items-center gap-0.5 min-[390px]:flex">
          {TOUCH_LARGE_HEADER_ACTIONS.map((link) => (
            <HeaderIconLink key={link.href} {...link} pathname={pathname} />
          ))}
          <ModeToggle />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {TOUCH_LARGE_HEADER_ACTIONS.map((link) => (
        <HeaderIconLink key={link.href} {...link} pathname={pathname} />
      ))}
    </div>
  );
}

function BoutiqueReassuranceItem({ label, icon: Icon }: MarketingHeaderItem) {
  return (
    <div className="inline-flex shrink-0 items-center gap-1.5 text-text-muted-strong">
      <Icon className="size-[0.78rem] shrink-0 text-brand/80" aria-hidden="true" />

      <span className="text-[0.62rem] font-medium tracking-[0.04em] min-[900px]:text-[0.68rem] lg:text-[0.75rem] lg:tracking-[0.08em]">
        {label}
      </span>
    </div>
  );
}

function BoutiqueReassuranceBar() {
  return (
    <div
      aria-hidden="true"
      className="hidden items-center justify-center gap-4 bg-background-secondary py-1.5 md:flex lg:gap-7"
      data-testid="public-reassurance-bar"
    >
      {BOUTIQUE_REASSURANCE_ITEMS.map((item) => (
        <BoutiqueReassuranceItem key={item.label} {...item} />
      ))}
    </div>
  );
}

function MobileTopbar({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-14 items-center justify-between desktop:hidden">
      <PublicLogo />

      <div className="flex items-center gap-0.5">
        <HeaderActions pathname={pathname} variant="mobile" />
        <div className="hidden md:flex desktop:hidden">
          <MobileMenuDrawer variant="topbar" />
        </div>
      </div>
    </div>
  );
}

function DesktopNavigation({ pathname }: { pathname: string }) {
  return (
    <NavigationMenu className="hidden desktop:flex" aria-label="Navigation principale">
      <NavigationMenuList className="gap-3 lg:gap-4">
        {DESKTOP_NAV_ITEMS.map((link) => {
          const isCategories = link.href === "/categories";
          const isActive = isPublicLinkActive(pathname, link.href);

          if (isCategories) {
            return (
              <NavigationMenuItem key={link.href}>
                <TopbarNavTrigger isActive={isActive} showChevron>
                  {link.label}
                </TopbarNavTrigger>

                <NavigationMenuContent>
                  <div className="grid w-88 gap-2 border border-shell-border bg-background/95 p-3 shadow-floating backdrop-blur-md">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/categories"
                        className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-subtle hover:text-brand"
                      >
                        Toutes les catégories
                      </Link>
                    </NavigationMenuLink>

                    <div className="h-px bg-shell-border" />

                    {DESKTOP_CATEGORY_LINKS.map((category) => (
                      <NavigationMenuLink key={category.href} asChild>
                        <Link
                          href={category.href}
                          className="rounded-md px-3 py-2 transition-colors hover:bg-surface-subtle"
                        >
                          <span className="block text-sm font-medium text-foreground">
                            {category.label}
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-text-muted-strong">
                            {category.description}
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={link.href}>
              <TopbarNavLink href={link.href} isActive={isActive}>
                {link.label}
              </TopbarNavLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function DesktopTopbar({
  pathname,

  isBoutiqueRoute,
}: {
  pathname: string;

  isBoutiqueRoute: boolean;
}) {
  return (
    <div
      className={[
        "hidden items-center justify-between gap-3 desktop:flex lg:gap-4",

        isBoutiqueRoute ? "min-h-16" : "min-h-18",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-3">
        <PublicLogo prominent={isBoutiqueRoute} compactDesktop />
      </div>

      <DesktopNavigation pathname={pathname} />

      <div className="flex shrink-0 items-center gap-1.5">
        <HeaderActions pathname={pathname} />

        <ModeToggle />
      </div>
    </div>
  );
}

function TouchNavItem({ href, label, icon: Icon, pathname }: PublicNavItem & { pathname: string }) {
  const isActive = isPublicLinkActive(pathname, href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={[
        "flex min-h-14 flex-col items-center justify-center gap-1 py-2 text-[0.62rem] font-medium tracking-[0.01em] transition-colors min-[390px]:text-[0.65rem]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
        isActive ? "text-brand" : "text-text-muted-strong hover:text-brand",
      ].join(" ")}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          className={[
            "size-5 min-[390px]:size-6",
            isActive ? "stroke-2" : "stroke-[1.5]",
          ].join(" ")}
        />
      )}

      <span className="max-w-full truncate">{label}</span>
    </Link>
  );
}

function TouchNavigation({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Navigation tactile"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-shell-border bg-background/35 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md backdrop-saturate-150 md:hidden"
    >
      <div className="mx-auto grid w-full max-w-430 grid-cols-5">
        {TOUCH_NAV_ITEMS.map((link) => (
          <TouchNavItem key={link.href} {...link} pathname={pathname} />
        ))}
        <MobileMenuDrawer />
      </div>
    </nav>
  );
}

export function TopbarPublic({ pathname }: TopbarPublicProps) {
  const isBoutiqueRoute = getIsBoutiqueRoute(pathname);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-shell-border bg-background/35 backdrop-blur-md backdrop-saturate-150">
        {isBoutiqueRoute ? <BoutiqueReassuranceBar /> : null}

        <div className="mx-auto w-full max-w-430 px-4 sm:px-6 xl:px-12">
          <MobileTopbar pathname={pathname} />

          <DesktopTopbar pathname={pathname} isBoutiqueRoute={isBoutiqueRoute} />
        </div>
      </header>

      <TouchNavigation pathname={pathname} />
    </>
  );
}
