"use client";

import { SlidersHorizontal } from "lucide-react";
import { type JSX, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { AdminSearchInput } from "../tables/admin-search-input";

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
  className?: string;
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
  className,
}: AdminToolbarProps<T>): JSX.Element {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Row 1: search + filters button */}
      <div className="flex items-center gap-2">
        <AdminSearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={placeholder}
          className="min-w-0 flex-1 md:max-w-xs"
        />

        {onFiltersOpen ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onFiltersOpen}
            className="relative shrink-0 gap-1.5"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filtres</span>
            {filterCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {filterCount}
              </span>
            ) : null}
          </Button>
        ) : null}
      </div>

      {/* Row 2: status tabs (hidden on mobile if desired by parent) */}
      {tabs && tabs.length > 0 ? (
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
      ) : null}
    </div>
  );
}
