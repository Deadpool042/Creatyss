"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { buildAdminColumnMeta } from "./admin-column-meta";

type AdminTextColumnOptions<TData> = Readonly<{
  id: string;
  header: string;
  value: (row: TData) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  textClassName?: string;
}>;

export function createAdminTextColumn<TData>({
  id,
  header,
  value,
  headerClassName,
  cellClassName,
  textClassName,
}: AdminTextColumnOptions<TData>): ColumnDef<TData> {
  return {
    id,
    header,
    cell: ({ row }) => (
      <span
        className={cn("line-clamp-1 tabular-nums font-medium text-foreground/85", textClassName)}
      >
        {value(row.original)}
      </span>
    ),
    meta: buildAdminColumnMeta({ headerClassName, cellClassName }),
  };
}
