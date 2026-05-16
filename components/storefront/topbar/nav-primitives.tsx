import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

export const TOPBAR_NAV_ITEM_CLASS_NAME = cn(
  "relative inline-flex h-9 items-center px-1 lg:px-1.5",
  "font-medium uppercase leading-none",
  "text-[0.72rem] wide:text-[0.78rem]",
  "tracking-[0.18em] wide:tracking-[0.2em]",
  "text-text-muted-strong hover:text-brand focus-visible:text-brand",
  "bg-transparent hover:bg-transparent focus-visible:bg-transparent",
  "rounded-none outline-none transition-colors",
  "after:absolute after:bottom-1 after:left-0 after:h-px after:w-full",
  "after:origin-left after:scale-x-0 after:bg-brand",
  "after:transition-transform after:duration-300 after:ease-out",
  "hover:after:scale-x-100 focus-visible:after:scale-x-100"
);

type TopbarNavLinkProps = Readonly<{
  href: string;
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}>;

export function TopbarNavLink({ href, children, isActive = false, className }: TopbarNavLinkProps) {
  return (
    <NavigationMenuPrimitive.Link asChild active={isActive}>
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          TOPBAR_NAV_ITEM_CLASS_NAME,
          isActive && "text-brand after:scale-x-100",
          className
        )}
      >
        {children}
      </Link>
    </NavigationMenuPrimitive.Link>
  );
}

type TopbarNavTriggerProps = Readonly<{
  children: ReactNode;
  isActive?: boolean;
  showChevron?: boolean;
  className?: string;
}>;

export function TopbarNavTrigger({
  children,
  isActive = false,
  showChevron = false,
  className,
}: TopbarNavTriggerProps) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(
        TOPBAR_NAV_ITEM_CLASS_NAME,
        showChevron && "group gap-1",
        "data-[state=open]:text-brand data-[state=open]:after:scale-x-100",
        isActive && "text-brand after:scale-x-100",
        className
      )}
    >
      <span>{children}</span>

      {showChevron ? (
        <ChevronDownIcon
          aria-hidden="true"
          className="size-3 shrink-0 opacity-70 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180"
        />
      ) : null}
    </NavigationMenuPrimitive.Trigger>
  );
}
