"use client";

import type { ColumnDef } from "@tanstack/react-table";

import {
  AdminStatusBadge,
  type AdminStatusVariant,
} from "@/components/admin/shared/admin-status-badge";
import { buildAdminColumnMeta } from "./admin-column-meta";

type AdminStatusColumnOptions<TData> = Readonly<{
  header: string;
  status: (row: TData) => AdminStatusVariant;
  label?: (row: TData) => string;
  id?: string;
  headerClassName?: string;
  cellClassName?: string;
  badgeClassName?: string;
}>;

export function createAdminStatusColumn<TData>({
  header,
  status,
  label,
  id = "status",
  headerClassName,
  cellClassName,
  badgeClassName,
}: AdminStatusColumnOptions<TData>): ColumnDef<TData> {
  return {
    id,
    header,
    cell: ({ row }) => (
      <AdminStatusBadge
        status={status(row.original)}
        {...(label ? { label: label(row.original) } : {})}
        {...(badgeClassName ? { className: badgeClassName } : {})}
      />
    ),
    meta: buildAdminColumnMeta({ headerClassName, cellClassName }),
  };
}
