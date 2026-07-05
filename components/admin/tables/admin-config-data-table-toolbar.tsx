"use client";

import type { ReactNode } from "react";

import { AdminSearchInput } from "@/components/admin/shared/admin-search-input";
import {
  AdminDataTableActiveFilters,
  type AdminDataTableActiveFilterItem,
} from "./filters/panel/admin-data-table-active-filters";

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
    <div className="flex flex-col gap-2">
      {feedback}

      <div className="lg:hidden">
        <div className="flex w-full flex-col gap-2 [@media(max-height:480px)]:gap-1.5">
          <div className="flex min-w-0 flex-1 items-center gap-2 [@media(max-height:480px)]:gap-1.5">
            <AdminSearchInput
              value={search}
              onChange={onSearchChange}
              placeholder={mobileSearchPlaceholder ?? "Rechercher…"}
              className="min-w-0 flex-1"
            />
            {mobileControls}
          </div>
          {mobileTrailing ? <div className="min-w-0">{mobileTrailing}</div> : null}
        </div>
      </div>

      <div className="mt-0 hidden items-center gap-2 lg:flex lg:justify-between">
        <AdminSearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={desktopSearchPlaceholder ?? "Rechercher…"}
          className="min-w-0 max-w-sm flex-1"
        />

        {hasDesktopControls ? (
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex shrink-0 items-center gap-2">{desktopFilters}</div>
            {desktopTrailing}
          </div>
        ) : null}
      </div>

      {activeFilters.length > 0 && onClearActiveFilters && clearActiveFiltersLabel ? (
        <AdminDataTableActiveFilters
          items={activeFilters}
          onClearAll={onClearActiveFilters}
          clearLabel={clearActiveFiltersLabel}
          className="hidden lg:flex"
        />
      ) : null}

      {typeof resultsCount === "number" && resultsFullLabel && resultsShortLabel ? (
        <span className="inline-flex items-center text-xs not-italic text-muted-foreground sm:text-[11px]">
          <span className="[@media(max-height:480px)]:hidden">{resultsFullLabel(resultsCount)}</span>
          <span className="hidden [@media(max-height:480px)]:inline">
            {resultsShortLabel(resultsCount)}
          </span>
        </span>
      ) : null}
    </div>
  );
}
