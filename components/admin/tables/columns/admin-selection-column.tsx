"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { buildAdminColumnMeta } from "./admin-column-meta";

type AdminSelectionColumnCheckedState = boolean | "indeterminate";

type AdminSelectionColumnOptions<TData> = Readonly<{
  headerChecked: AdminSelectionColumnCheckedState;
  rowChecked: (row: TData) => boolean;
  onToggleAll: () => void;
  onToggleRow: (row: TData) => void;
  headerAriaLabel: string;
  rowAriaLabel: (row: TData) => string;
  id?: string;
  headerClassName?: string;
  cellClassName?: string;
  centered?: boolean;
}>;

export function createAdminSelectionColumn<TData>({
  headerChecked,
  rowChecked,
  onToggleAll,
  onToggleRow,
  headerAriaLabel,
  rowAriaLabel,
  id = "selection",
  headerClassName,
  cellClassName,
  centered = false,
}: AdminSelectionColumnOptions<TData>): ColumnDef<TData> {
  function wrapIfCentered(node: ReactNode): ReactNode {
    return centered ? <div className="flex items-center justify-center">{node}</div> : node;
  }

  const renderHeader = (
    <Checkbox checked={headerChecked} onCheckedChange={onToggleAll} aria-label={headerAriaLabel} />
  );

  return {
    id,
    header: () => wrapIfCentered(renderHeader),
    cell: ({ row }) => {
      const checkbox = (
        <Checkbox
          checked={rowChecked(row.original)}
          onCheckedChange={() => onToggleRow(row.original)}
          aria-label={rowAriaLabel(row.original)}
        />
      );

      return wrapIfCentered(checkbox);
    },
    meta: buildAdminColumnMeta({ headerClassName, cellClassName, stopRowClick: true }),
  };
}
