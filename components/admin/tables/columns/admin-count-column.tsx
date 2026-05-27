"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { buildAdminColumnMeta } from "./admin-column-meta";
import { AdminCountValue } from "./admin-count-value";

type AdminCountColumnOptions<TData> = Readonly<{
  id: string;
  header: string;
  value: (row: TData) => number;
  headerClassName?: string;
  cellClassName?: string;
  valueClassName?: string;
  zeroClassName?: string;
}>;

export function createAdminCountColumn<TData>({
  id,
  header,
  value,
  headerClassName,
  cellClassName,
  valueClassName,
  zeroClassName = "text-muted-foreground/35",
}: AdminCountColumnOptions<TData>): ColumnDef<TData> {
  return {
    id,
    header,
    cell: ({ row }) => {
      const count = value(row.original);
      const toneClassName = count === 0 ? zeroClassName : "text-foreground/90";

      return (
        <AdminCountValue
          value={count}
          className={cn("inline-block min-w-4 text-right", toneClassName, valueClassName)}
        />
      );
    },
    meta: buildAdminColumnMeta({ headerClassName, cellClassName }),
  };
}
