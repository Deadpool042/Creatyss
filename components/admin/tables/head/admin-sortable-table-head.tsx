import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { AdminTableHead } from "@/components/admin/tables/admin-table";
import { cn } from "@/lib/utils";
import { ADMIN_TABLE_HEAD_CLASSNAME } from "@/components/admin/tables/styles/admin-table-head.styles";
export type SortableColumnAlign = "left" | "center" | "right";

export type SortableColumnConfig<TSort extends string> = Readonly<{
  label: ReactNode;
  asc: TSort;
  desc: TSort;
  className?: string;
  buttonClassName?: string;
  align?: SortableColumnAlign;
}>;

type AdminSortableTableHeadProps<TSort extends string> = Readonly<{
  column: SortableColumnConfig<TSort>;
  currentSort: TSort;
  onSort: (sort: TSort) => void;
}>;

export function AdminSortableTableHead<TSort extends string>({
  column,
  currentSort,
  onSort,
}: AdminSortableTableHeadProps<TSort>) {
  const isAsc = currentSort === column.asc;
  const isDesc = currentSort === column.desc;
  const isActive = isAsc || isDesc;

  const ariaSort: "ascending" | "descending" | undefined = isAsc
    ? "ascending"
    : isDesc
      ? "descending"
      : undefined;

  function handleClick() {
    onSort(isAsc ? column.desc : column.asc);
  }

  return (
    <AdminTableHead
      className={cn(ADMIN_TABLE_HEAD_CLASSNAME, column.className)}
      aria-sort={ariaSort}
    >
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex h-full w-full items-center gap-1 px-4 py-3",
          "transition-colors hover:text-foreground",
          column.align === "center" && "justify-center text-center",
          column.align === "right" && "justify-end text-right",
          (!column.align || column.align === "left") && "justify-start text-left",
          isActive ? "text-foreground" : "text-muted-foreground",
          column.buttonClassName
        )}
      >
        <span>{column.label}</span>

        {isAsc ? (
          <ArrowUp className="h-3 w-3 shrink-0" aria-hidden="true" />
        ) : isDesc ? (
          <ArrowDown className="h-3 w-3 shrink-0" aria-hidden="true" />
        ) : (
          <ArrowUpDown className="h-3 w-3 shrink-0 opacity-30" aria-hidden="true" />
        )}
      </button>
    </AdminTableHead>
  );
}
