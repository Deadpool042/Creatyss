"use client";

import Link from "next/link";
import type { JSX, ReactNode } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AdminNavigationLinkItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
};

type ItemInnerProps = {
  label: string;
  icon: LucideIcon;
  active: boolean;
  disabled: boolean;
  badge?: string;
  children?: ReactNode;
};

function ItemBadge({ label }: { label: string }): JSX.Element {
  return (
    <span className="inline-flex h-5 items-center rounded-full border border-surface-border bg-surface-panel-soft px-2 text-[10px] font-medium leading-none text-muted-foreground">
      {label}
    </span>
  );
}

function ItemInner({
  label,
  icon: Icon,
  active,
  disabled,
  badge,
  children,
}: ItemInnerProps): JSX.Element {
  return (
    <>
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
          active
            ? "border-surface-border-strong bg-interactive-selected text-foreground"
            : "border-surface-border bg-surface-panel text-muted-foreground",
          disabled && "opacity-80"
        )}
      >
        <Icon className="h-4 w-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium leading-5">{label}</span>
      </span>

      {badge ? <ItemBadge label={badge} /> : null}

      {!disabled ? <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" /> : null}

      {children}
    </>
  );
}

export function AdminNavigationLinkItem({
  href,
  label,
  icon,
  active = false,
  badge,
  disabled = false,
  onClick,
  className,
  children,
}: AdminNavigationLinkItemProps): JSX.Element {
  if (disabled) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-[1.1rem] border border-surface-border bg-surface-panel-soft px-3.5 py-3 text-sm text-muted-foreground opacity-70",
          className
        )}
        aria-disabled="true"
      >
        <ItemInner
          label={label}
          icon={icon}
          active={active}
          disabled={true}
          {...(badge ? { badge } : {})}
        >
          {children}
        </ItemInner>
      </div>
    );
  }

  return (
    <Link
      href={href}
      {...(onClick ? { onClick } : {})}
      {...(active ? { "aria-current": "page" as const } : {})}
      className={cn(
        "flex items-center gap-3 rounded-[1.1rem] border px-3.5 py-3 outline-none transition-colors focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50",
        active
          ? "border-surface-border-strong bg-surface-panel text-foreground shadow-card"
          : "border-surface-border bg-card text-foreground hover:border-surface-border-strong hover:bg-interactive-hover",
        className
      )}
    >
      <ItemInner
        label={label}
        icon={icon}
        active={active}
        disabled={false}
        {...(badge ? { badge } : {})}
      >
        {children}
      </ItemInner>
    </Link>
  );
}
