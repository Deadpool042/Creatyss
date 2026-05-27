"use client";

import {
  type ColumnDef,
  type Row,
  type RowData,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "./admin-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
    stopRowClick?: boolean;
  }
}

type AdminConfigDataTableProps<TData> = Readonly<{
  data: TData[];
  columns: ColumnDef<TData>[];
  ariaLabel?: string;
  getRowId?: (row: TData, index: number) => string;
  wrapperClassName?: string;
  viewportClassName?: string;
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  bodyClassName?: string;
  rowClassName?: (row: Row<TData>) => string | undefined;
  getRowHref?: (row: TData) => string;
  onToggleRowSelection?: (row: TData) => void;
  onRowClick?: (row: TData) => void;
  onRowKeyDown?: (event: KeyboardEvent<HTMLTableRowElement>, row: TData) => void;
}>;

function withOptionalClassName(className?: string) {
  return className ? { className } : {};
}

export function AdminConfigDataTable<TData>({
  data,
  columns,
  ariaLabel,
  getRowId,
  wrapperClassName,
  viewportClassName,
  tableClassName,
  headerClassName,
  headerRowClassName,
  bodyClassName,
  rowClassName,
  getRowHref,
  onToggleRowSelection,
  onRowClick,
  onRowKeyDown,
}: AdminConfigDataTableProps<TData>) {
  "use no memo";

  const router = useRouter();
  const handleRowClick =
    onRowClick ??
    (getRowHref
      ? (row: TData) => {
          router.push(getRowHref(row));
        }
      : undefined);
  const handleRowKeyDown =
    onRowKeyDown ??
    ((event: KeyboardEvent<HTMLTableRowElement>, row: TData) => {
      if (event.key === "Enter" && handleRowClick) {
        handleRowClick(row);
        return;
      }

      if (event.key === " " && onToggleRowSelection) {
        event.preventDefault();
        onToggleRowSelection(row);
      }
    });
  const hasInteractiveRows = Boolean(handleRowClick || getRowHref || onToggleRowSelection);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(getRowId ? { getRowId } : {}),
  });

  return (
    <AdminTable
      aria-label={ariaLabel}
      role="grid"
      {...(wrapperClassName ? { wrapperClassName } : {})}
      {...(viewportClassName ? { viewportClassName } : {})}
      {...withOptionalClassName(tableClassName)}
    >
      <AdminTableHeader {...withOptionalClassName(headerClassName)}>
        {table.getHeaderGroups().map((headerGroup) => (
          <AdminTableRow
            key={headerGroup.id}
            className={cn("border-b border-surface-border/50", headerRowClassName)}
          >
            {headerGroup.headers.map((header) => (
              <AdminTableHead
                key={header.id}
                {...withOptionalClassName(header.column.columnDef.meta?.headerClassName)}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </AdminTableHead>
            ))}
          </AdminTableRow>
        ))}
      </AdminTableHeader>

      <AdminTableBody {...withOptionalClassName(bodyClassName)}>
        {table.getRowModel().rows.map((row) => (
          <AdminTableRow
            key={row.id}
            tabIndex={hasInteractiveRows || onRowKeyDown ? 0 : undefined}
            className={cn(
              hasInteractiveRows &&
                "group cursor-pointer border-b border-surface-border/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/50 hover:bg-surface-subtle/40",
              rowClassName?.(row)
            )}
            onClick={() => handleRowClick?.(row.original)}
            onKeyDown={(event) => handleRowKeyDown(event, row.original)}
          >
            {row.getVisibleCells().map((cell) => (
              <AdminTableCell
                key={cell.id}
                {...withOptionalClassName(cell.column.columnDef.meta?.cellClassName)}
                onClick={
                  cell.column.columnDef.meta?.stopRowClick
                    ? (event) => event.stopPropagation()
                    : undefined
                }
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </AdminTableCell>
            ))}
          </AdminTableRow>
        ))}
      </AdminTableBody>
    </AdminTable>
  );
}
