"use client";

import { AdminFilterBlocks, type AdminFilterBlock } from "../admin-filter-blocks";
import type { AdminDataTableActiveFilterItem } from "./admin-data-table-active-filters";
import { AdminDataTableFiltersDrawer } from "./admin-data-table-filters-drawer";

type AdminConfigDataTableFiltersDrawerProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  resetLabel: string;
  applyLabel: string;
  blocks: AdminFilterBlock[];
  hasActiveFilters: boolean;
  onReset: () => void;
  description?: string;
  activeFiltersTitle?: string;
  activeFilterItems?: AdminDataTableActiveFilterItem[];
  clearActiveFiltersLabel?: string;
  onClearActiveFilters?: () => void;
  contentClassName?: string;
  blocksClassName?: string;
}>;

export function AdminConfigDataTableFiltersDrawer({
  open,
  onOpenChange,
  title,
  resetLabel,
  applyLabel,
  blocks,
  hasActiveFilters,
  onReset,
  description,
  activeFiltersTitle,
  activeFilterItems,
  clearActiveFiltersLabel,
  onClearActiveFilters,
  contentClassName = "flex flex-col gap-5",
  blocksClassName = "flex flex-col gap-5",
}: AdminConfigDataTableFiltersDrawerProps) {
  return (
    <AdminDataTableFiltersDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      resetLabel={resetLabel}
      applyLabel={applyLabel}
      resetDisabled={!hasActiveFilters}
      stackedFooter
      onReset={() => {
        onReset();
        onOpenChange(false);
      }}
      onApply={() => onOpenChange(false)}
      {...(description ? { description } : {})}
      {...(activeFiltersTitle ? { activeFiltersTitle } : {})}
      {...(activeFilterItems ? { activeFilterItems } : {})}
      {...(clearActiveFiltersLabel ? { clearActiveFiltersLabel } : {})}
      {...(onClearActiveFilters ? { onClearActiveFilters } : {})}
      contentClassName={contentClassName}
    >
      <AdminFilterBlocks blocks={blocks} className={blocksClassName} />
    </AdminDataTableFiltersDrawer>
  );
}
