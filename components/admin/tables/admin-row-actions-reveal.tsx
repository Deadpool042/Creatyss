"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminRowActionsRevealProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function AdminRowActionsReveal({
  children,
  className,
}: AdminRowActionsRevealProps) {
  return (
    <div
      className={cn(
        "opacity-0 pointer-events-none transition-opacity duration-150 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
