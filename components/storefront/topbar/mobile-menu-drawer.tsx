"use client";

import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  BookOpenTextIcon,
  Grid2X2Icon,
  HeartIcon,
  HomeIcon,
  MailIcon,
  MenuIcon,
  NewspaperIcon,
  ShoppingBagIcon,
  StoreIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

import { ModeToggle } from "@/components/shared/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const DRAWER_PRIMARY_LINKS = [
  { href: "/", label: "Accueil", icon: HomeIcon },
  { href: "/boutique", label: "Boutique", icon: ShoppingBagIcon },
  { href: "/categories", label: "Catégories", icon: Grid2X2Icon },
  { href: "/les-marches", label: "Les marchés", icon: StoreIcon },
] as const;

const DRAWER_SECONDARY_LINKS = [
  { href: "/blog", label: "Blog", icon: NewspaperIcon },
  { href: "/a-propos", label: "À propos", icon: BookOpenTextIcon },
  { href: "/contact", label: "Contact", icon: MailIcon },
] as const;

const DRAWER_SPACE_LINKS = [
  { href: "/favoris", label: "Favoris", icon: HeartIcon, className: "" },
  { href: "/compte", label: "Mon compte", icon: UserIcon, className: "min-[390px]:hidden" },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type MobileMenuDrawerVariant = "bottomNav" | "topbar";

type MobileMenuDrawerProps = Readonly<{
  variant?: MobileMenuDrawerVariant;
}>;

type DrawerNavItem = Readonly<{
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
}>;

type DrawerLinkGroupProps = Readonly<{
  label?: string | undefined;
  items: readonly DrawerNavItem[];
}>;

// ─── Styles ───────────────────────────────────────────────────────────────────

const BOTTOM_NAV_TRIGGER_CLS = [
  "flex min-h-14 w-full flex-col items-center justify-center gap-1 py-2",
  "text-[0.65rem] font-medium tracking-[0.02em] transition-colors",
  "text-text-muted-strong hover:text-brand",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
].join(" ");

const TOPBAR_TRIGGER_CLS = [
  "inline-flex size-8 items-center justify-center rounded-full transition-all duration-200 ease-out",
  "text-text-muted-strong hover:bg-interactive-hover hover:text-foreground",
  "focus-visible:outline-none focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50",
].join(" ");

const GROUP_CLS = [
  "overflow-hidden rounded-2xl border border-shell-border/75",
  "bg-background/45 shadow-soft backdrop-blur-md",
  "divide-y divide-shell-border/70",
].join(" ");

const GROUP_ITEM_CLS = [
  "group flex min-h-12 items-center gap-3 px-3.5 py-3",
  "text-sm font-medium text-foreground/88 transition-colors",
  "hover:bg-surface-subtle hover:text-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
].join(" ");

const SECTION_LABEL_CLS =
  "mb-2 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand/80";

// ─── Local components ─────────────────────────────────────────────────────────

function DrawerLinkGroup({ label, items }: DrawerLinkGroupProps) {
  return (
    <div className="flex flex-col">
      {label !== undefined && <p className={SECTION_LABEL_CLS}>{label}</p>}
      <div className={GROUP_CLS}>
        {items.map(({ href, label: itemLabel, icon: Icon, className }) => (
          <DrawerClose key={href} asChild>
            <Link href={href} className={cn(GROUP_ITEM_CLS, className)}>
              <Icon
                className="size-4 shrink-0 text-brand/65 transition-colors group-hover:text-brand"
                aria-hidden="true"
              />
              {itemLabel}
            </Link>
          </DrawerClose>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MobileMenuDrawer({ variant = "bottomNav" }: MobileMenuDrawerProps) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        {variant === "topbar" ? (
          <button
            type="button"
            aria-label="Ouvrir le menu principal"
            className={TOPBAR_TRIGGER_CLS}
            onClick={(event) => {
              event.currentTarget.blur();
            }}
          >
            <MenuIcon className="size-4" aria-hidden="true" />
            <span className="sr-only">Menu</span>
          </button>
        ) : (
          <button
            type="button"
            aria-label="Ouvrir le menu principal"
            className={BOTTOM_NAV_TRIGGER_CLS}
            onClick={(event) => {
              event.currentTarget.blur();
            }}
          >
            <MenuIcon className="size-6 stroke-[1.5]" aria-hidden="true" />
            <span className="max-w-full truncate" aria-hidden="true">
              Menu
            </span>
          </button>
        )}
      </DrawerTrigger>

      <DrawerContent
        className="inset-y-0 right-0 mt-0 h-dvh w-[min(20rem,calc(100vw-2rem))] border-l border-shell-border/80 bg-background/78 shadow-floating backdrop-blur-2xl backdrop-saturate-150"
        data-testid="mobile-menu-drawer"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-brand/10 via-transparent to-background/20"
        />

        <div className="relative z-10 flex flex-1 min-h-0 flex-col">
          <DrawerHeader className="relative border-b border-shell-border/70 px-4 pb-4 pt-5 text-left">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-shell-border bg-background/45 shadow-soft backdrop-blur-md">
                <Image
                  src="/uploads/logo.svg"
                  alt=""
                  aria-hidden="true"
                  width={24}
                  height={24}
                  className="h-6 w-auto object-contain opacity-90"
                />
              </div>
              <div className="min-w-0 pt-0.5">
                <DrawerTitle className="font-semibold tracking-tight text-foreground">
                  Creatyss
                </DrawerTitle>
                <DrawerDescription className="mt-0.5 text-sm leading-relaxed text-text-muted-strong">
                  Sacs artisanaux faits main à Saint-Étienne.
                </DrawerDescription>
              </div>
            </div>

            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute right-3 top-3 text-foreground/65 hover:bg-surface-subtle hover:text-foreground"
                aria-label="Fermer le menu"
              >
                <XIcon aria-hidden="true" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-4">
            <DrawerLinkGroup label="Boutique" items={DRAWER_PRIMARY_LINKS} />

            <DrawerLinkGroup label="Découvrir" items={DRAWER_SECONDARY_LINKS} />

            <DrawerLinkGroup label="Espace" items={DRAWER_SPACE_LINKS} />

            <section className="flex flex-col min-[390px]:hidden">
              <p className={SECTION_LABEL_CLS}>Préférences</p>
              <div className={GROUP_CLS}>
                <div className="flex min-h-12 items-center justify-between px-3.5 py-3">
                  <span className="text-sm font-medium text-foreground/88">Apparence</span>
                  <ModeToggle />
                </div>
              </div>
            </section>

            <div className="mt-auto pt-1">
              <div className="rounded-2xl border border-shell-border/75 bg-background/45 p-3.5 shadow-soft backdrop-blur-md">
                <p className="text-xs font-semibold text-foreground">Fait main à Saint-Étienne</p>
                <p className="mt-1 text-xs leading-relaxed text-text-muted-strong">
                  Des pièces uniques, sans cuir, cousues avec soin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
