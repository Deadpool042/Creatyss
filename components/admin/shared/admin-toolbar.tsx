"use client";

import { SlidersHorizontal } from "lucide-react";
import { type JSX, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminSearchInput } from "./admin-search-input";

export type AdminToolbarTab<T extends string = string> = {
  key: T;
  label: string;
  count?: number;
  dot?: string; // Tailwind bg-* class e.g. "bg-green-500"
  icon?: ReactNode;
};

type AdminToolbarProps<T extends string = string> = {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  tabs?: AdminToolbarTab<T>[];
  activeTab?: T;
  onTabChange?: (key: T) => void;
  filterCount?: number;
  onFiltersOpen?: () => void;
  filtersLabel?: string;
  /** Slot pour des contrôles additionnels (ex : dropdown de tri) — visible mobile et desktop */
  extraControls?: ReactNode;
  className?: string;
  hideMobile?: boolean;
};

export function AdminToolbar<T extends string = string>({
  search,
  onSearchChange,
  placeholder = "Rechercher…",
  tabs,
  activeTab,
  onTabChange,
  filterCount = 0,
  onFiltersOpen,
  filtersLabel = "Filtres",
  extraControls,
  className,
  hideMobile = false,
}: AdminToolbarProps<T>): JSX.Element {
  const tabPills =
    tabs && tabs.length > 0 ? (
      <div className="flex flex-wrap items-center gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange?.(tab.key)}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[13px] font-medium transition-colors",
                isActive
                  ? "border-surface-border-strong bg-interactive-selected text-foreground"
                  : "border-surface-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.icon ? (
                <span className="flex h-3 w-3 items-center justify-center">{tab.icon}</span>
              ) : tab.dot ? (
                <span className={cn("h-1.5 w-1.5 rounded-full", tab.dot)} />
              ) : null}
              {tab.label}
              {tab.count !== undefined ? (
                <span className="ml-0.5 tabular-nums text-muted-foreground">{tab.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    ) : null;

  const filtersButton = onFiltersOpen ? (
    <Button
      variant="outline"
      size="sm"
      onClick={onFiltersOpen}
      className="relative shrink-0 gap-1.5"
    >
      <SlidersHorizontal className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{filtersLabel}</span>
      {filterCount > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {filterCount}
        </span>
      ) : null}
    </Button>
  ) : null;

  return (
    <div className={cn("flex flex-col gap-2 mt-2", className)}>
      {/*
       * < lg  → Row 1: search + extraControls + filter button | Row 2: tabs
       * ≥ lg  → Single row: search | tabs (flex-1) | extraControls + filter button
       */}

      {/* Mobile only: row 1 (search + extraControls + filter button) */}
      {!hideMobile ? (
        <div className="flex items-center justify-between gap-2 lg:hidden ">
          <AdminSearchInput
            value={search}
            onChange={onSearchChange}
            placeholder={placeholder}
            className="min-w-0 max-w-sm flex-1"
          />
          {extraControls ? (
            <div className="flex shrink-0 items-center gap-2">{extraControls}</div>
          ) : null}
          {filtersButton}
        </div>
      ) : null}

      {/* Mobile only: row 2 (tabs) */}
      {!hideMobile && tabPills ? <div className="lg:hidden">{tabPills}</div> : null}

      {/* Desktop only: single row */}
      <div className="hidden items-center gap-2 lg:flex lg:justify-between">
        <AdminSearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={placeholder}
          className="min-w-0 max-w-sm flex-1"
        />
        {tabPills ? <div className="min-w-0 flex-1">{tabPills}</div> : null}
        {extraControls ? (
          <div className="flex shrink-0 items-center gap-2">{extraControls}</div>
        ) : null}
        {filtersButton}
      </div>
    </div>
  );
}
