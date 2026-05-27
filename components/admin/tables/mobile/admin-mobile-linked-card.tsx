"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminMobileLinkedCardProps = Readonly<{
  href: string;
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  linkClassName?: string;
}>;

export function AdminMobileLinkedCard({
  href,
  ariaLabel,
  children,
  className,
  linkClassName,
}: AdminMobileLinkedCardProps) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-lg border border-surface-border/70 bg-surface-panel/40 p-3 transition-colors",
        className
      )}
    >
      <Link
        href={href}
        className={cn(
          "absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
          linkClassName
        )}
        aria-label={ariaLabel}
      />

      {children}
    </article>
  );
}
