"use client";

import type { ReactNode } from "react";

import { AdminToolbar } from "@/components/admin/shared/admin-toolbar";
import {
  AdminDataTableActiveFilters,
  type AdminDataTableActiveFilterItem,
} from "./filters/panel/admin-data-table-active-filters";
import { AdminDataTableFilterControlsRow } from "./filters/panel/admin-data-table-filter-controls-row";
import { AdminDataTableMobileTopbar } from "./layout/admin-data-table-mobile-topbar";
import { AdminDataTableResultsCount } from "./layout/admin-data-table-results-count";
import { AdminDataTableToolbarLayout } from "./layout/admin-data-table-toolbar-layout";

type AdminConfigDataTableToolbarProps = Readonly<{
  search: string;
  onSearchChange: (value: string) => void;
  mobileSearchPlaceholder?: string;
  desktopSearchPlaceholder?: string;
  feedback?: ReactNode;
  mobileControls?: ReactNode;
  mobileTrailing?: ReactNode;
  desktopFilters?: ReactNode;
  desktopTrailing?: ReactNode;
  activeFilters?: AdminDataTableActiveFilterItem[];
  onClearActiveFilters?: () => void;
  clearActiveFiltersLabel?: string;
  resultsCount?: number;
  resultsFullLabel?: (count: number) => string;
  resultsShortLabel?: (count: number) => string;
}>;

export function AdminConfigDataTableToolbar({
  search,
  onSearchChange,
  mobileSearchPlaceholder,
  desktopSearchPlaceholder,
  feedback,
  mobileControls,
  mobileTrailing,
  desktopFilters,
  desktopTrailing,
  activeFilters = [],
  onClearActiveFilters,
  clearActiveFiltersLabel,
  resultsCount,
  resultsFullLabel,
  resultsShortLabel,
}: AdminConfigDataTableToolbarProps) {
  const hasDesktopControls = Boolean(desktopFilters);

  return (
    <AdminDataTableToolbarLayout
      feedback={feedback}
      toolbar={
        <>
          <div className="lg:hidden">
            <AdminDataTableMobileTopbar
              search={search}
              onSearchChange={onSearchChange}
              {...(mobileSearchPlaceholder ? { placeholder: mobileSearchPlaceholder } : {})}
              {...(mobileControls ? { controls: mobileControls } : {})}
              {...(mobileTrailing ? { trailing: mobileTrailing } : {})}
            />
          </div>

          <AdminToolbar
            search={search}
            onSearchChange={onSearchChange}
            {...(desktopSearchPlaceholder ? { placeholder: desktopSearchPlaceholder } : {})}
            extraControls={
              hasDesktopControls ? (
                <AdminDataTableFilterControlsRow
                  filters={desktopFilters}
                  {...(desktopTrailing ? { trailing: desktopTrailing } : {})}
                />
              ) : undefined
            }
            className="mt-0"
            hideMobile
          />
        </>
      }
      activeFilters={
        activeFilters.length > 0 && onClearActiveFilters && clearActiveFiltersLabel ? (
          <AdminDataTableActiveFilters
            items={activeFilters}
            onClearAll={onClearActiveFilters}
            clearLabel={clearActiveFiltersLabel}
            className="hidden lg:flex"
          />
        ) : null
      }
      meta={
        typeof resultsCount === "number" && resultsFullLabel && resultsShortLabel ? (
          <AdminDataTableResultsCount
            count={resultsCount}
            fullLabel={resultsFullLabel}
            shortLabel={resultsShortLabel}
            className="text-xs not-italic"
          />
        ) : null
      }
    />
  );
}
