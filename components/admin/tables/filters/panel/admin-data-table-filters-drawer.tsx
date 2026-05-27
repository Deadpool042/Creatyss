"use client";

import type { ReactNode } from "react";

import { AdminDataTableActiveFiltersPanel } from "./admin-data-table-active-filters-panel";
import type { AdminDataTableActiveFilterItem } from "./admin-data-table-active-filters";
import { AdminDataTableFiltersFooter } from "./admin-data-table-filters-footer";
import { AdminDataTableFiltersSheet } from "./admin-data-table-filters-sheet";

type AdminDataTableFiltersDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  activeFiltersTitle?: string;
  activeFilterItems?: AdminDataTableActiveFilterItem[];
  activeFiltersCount?: number;
  clearActiveFiltersLabel?: string;
  onClearActiveFilters?: () => void;
  resetLabel: string;
  applyLabel: string;
  onReset: () => void;
  onApply: () => void;
  resetDisabled?: boolean;
  stackedFooter?: boolean;
  contentClassName?: string;
};

export function AdminDataTableFiltersDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  activeFiltersTitle,
  activeFilterItems = [],
  activeFiltersCount,
  clearActiveFiltersLabel,
  onClearActiveFilters,
  resetLabel,
  applyLabel,
  onReset,
  onApply,
  resetDisabled = false,
  stackedFooter = false,
  contentClassName,
}: AdminDataTableFiltersDrawerProps) {
  return (
    <AdminDataTableFiltersSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      {...(description ? { description } : {})}
      footer={
        <AdminDataTableFiltersFooter
          stacked={stackedFooter}
          resetLabel={resetLabel}
          applyLabel={applyLabel}
          resetDisabled={resetDisabled}
          onReset={onReset}
          onApply={onApply}
        />
      }
    >
      <div className={contentClassName ?? "space-y-3.5 [@media(max-height:480px)]:space-y-3"}>
        {activeFiltersTitle ? (
          <AdminDataTableActiveFiltersPanel
            title={activeFiltersTitle}
            items={activeFilterItems}
            {...(activeFiltersCount !== undefined ? { count: activeFiltersCount } : {})}
            {...(onClearActiveFilters ? { onClearAll: onClearActiveFilters } : {})}
            {...(clearActiveFiltersLabel ? { clearLabel: clearActiveFiltersLabel } : {})}
          />
        ) : null}
        {children}
      </div>
    </AdminDataTableFiltersSheet>
  );
}
