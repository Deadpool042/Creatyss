import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
  className?: string;
}>;

export function AdminSortableTableHead<TSort extends string>({
  column,
  currentSort,
  onSort,
  className,
}: AdminSortableTableHeadProps<TSort>) {
  const isAsc = currentSort === column.asc;
  const isDesc = currentSort === column.desc;
  const isActive = isAsc || isDesc;
  const alignClassName =
    column.align === "center"
      ? "justify-center text-center"
      : column.align === "right"
        ? "justify-end text-right"
        : "justify-start text-left";
  const toneClassName = isActive ? "text-foreground" : "text-muted-foreground";

  const ariaLabel = isAsc
    ? `${String(column.label)} trié par ordre croissant`
    : isDesc
      ? `${String(column.label)} trié par ordre décroissant`
      : `Trier ${String(column.label)}`;
  const sortIcon = isAsc ? (
    <ArrowUp className="h-3 w-3 shrink-0" aria-hidden="true" />
  ) : isDesc ? (
    <ArrowDown className="h-3 w-3 shrink-0" aria-hidden="true" />
  ) : (
    <ArrowUpDown className="h-3 w-3 shrink-0 opacity-30" aria-hidden="true" />
  );

  function handleClick() {
    onSort(isAsc ? column.desc : column.asc);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={cn(
        "flex h-full w-full items-center gap-1 px-4 py-3",
        "transition-colors hover:text-foreground",
        alignClassName,
        toneClassName,
        column.className,
        column.buttonClassName,
        className
      )}
    >
      <span>{column.label}</span>
      {sortIcon}
    </button>
  );
}
