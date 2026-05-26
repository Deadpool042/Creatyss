"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminCountValueProps = Readonly<{
  value: number;
  zeroLabel?: ReactNode;
  className?: string;
}>;

export function AdminCountValue({
  value,
  zeroLabel = "—",
  className,
}: AdminCountValueProps) {
  return (
    <span className={cn("tabular-nums", className)}>{value === 0 ? zeroLabel : value}</span>
  );
}
