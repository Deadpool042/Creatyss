"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

import { AdminConfigDataTableToolbar } from "@/components/admin/tables/admin-config-data-table-toolbar";
import { AdminSelectFilterControl } from "@/components/admin/tables/filters/admin-select-filter-control";
import type { AdminDataTableActiveFilterItem } from "@/components/admin/tables/filters/panel/admin-data-table-active-filters";
import { Button } from "@/components/ui/button";
import {
  CUSTOMER_DEFAULT_SORT,
  CUSTOMER_SORT_LABEL_OPTIONS,
  CUSTOMER_STATUS_FILTER_ALL,
  CUSTOMER_STATUS_FILTER_OPTIONS,
  type CustomerSortOption,
  type CustomerStatusFilterValue,
} from "@/entities/customer";
import { cn } from "@/lib/utils";

import { CustomerMobileFiltersDrawer } from "./customer-mobile-filters-drawer";

type CustomerListFiltersProps = Readonly<{
  search?: string;
  status?: CustomerStatusFilterValue;
  sort: CustomerSortOption;
  totalItems: number;
}>;

const SEARCH_DEBOUNCE_MS = 250;

export function CustomerListFilters({
  search,
  status,
  sort,
  totalItems,
}: CustomerListFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [draftSearch, setDraftSearch] = useState(search ?? "");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeStatus = status ?? CUSTOMER_STATUS_FILTER_ALL;
  const currentSearch = search ?? "";

  useEffect(() => {
    setDraftSearch(currentSearch);
  }, [currentSearch]);

  function buildParams(
    nextSearch: string,
    nextStatus: CustomerStatusFilterValue,
    nextSort: CustomerSortOption
  ): string {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedSearch = nextSearch.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    } else {
      params.delete("search");
    }

    if (nextStatus !== CUSTOMER_STATUS_FILTER_ALL) {
      params.set("status", nextStatus);
    } else {
      params.delete("status");
    }

    if (nextSort !== CUSTOMER_DEFAULT_SORT) {
      params.set("sort", nextSort);
    } else {
      params.delete("sort");
    }

    params.delete("page");

    return params.toString();
  }

  function navigate(
    nextSearch: string,
    nextStatus: CustomerStatusFilterValue,
    nextSort: CustomerSortOption
  ) {
    const queryString = buildParams(nextSearch, nextStatus, nextSort);

    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    });
  }

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (draftSearch === currentSearch) {
        return;
      }

      navigate(draftSearch, activeStatus, sort);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(handle);
  }, [activeStatus, currentSearch, draftSearch, sort]);

  const activeFilters = useMemo<AdminDataTableActiveFilterItem[]>(() => {
    const items: AdminDataTableActiveFilterItem[] = [];

    if (activeStatus !== CUSTOMER_STATUS_FILTER_ALL) {
      const option = CUSTOMER_STATUS_FILTER_OPTIONS.find((item) => item.value === activeStatus);

      if (option) {
        items.push({
          key: "status",
          label: `Statut : ${option.label}`,
          onRemove: () => navigate(draftSearch, CUSTOMER_STATUS_FILTER_ALL, sort),
        });
      }
    }

    return items;
  }, [activeStatus, draftSearch, sort]);

  const hasActiveFilters = activeStatus !== CUSTOMER_STATUS_FILTER_ALL || sort !== CUSTOMER_DEFAULT_SORT;
  const activeFiltersCount = activeFilters.length + (sort !== CUSTOMER_DEFAULT_SORT ? 1 : 0);

  return (
    <>
      <AdminConfigDataTableToolbar
        search={draftSearch}
        onSearchChange={setDraftSearch}
        mobileSearchPlaceholder="Rechercher un client…"
        desktopSearchPlaceholder="Rechercher un client…"
        mobileControls={
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={hasActiveFilters ? `${activeFiltersCount} filtres actifs` : "Ouvrir les filtres"}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs [@media(max-height:480px)]:h-8 [@media(max-height:480px)]:gap-1 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:text-[11px]",
              hasActiveFilters
                ? "border-surface-border-strong bg-interactive-selected text-foreground hover:bg-interactive-selected"
                : "text-muted-foreground"
            )}
          >
            <Filter className="h-4 w-4" />
            <span>{hasActiveFilters ? `Filtres · ${activeFiltersCount}` : "Filtres"}</span>
          </Button>
        }
        desktopFilters={
          <AdminSelectFilterControl
            value={activeStatus}
            onValueChange={(value) => navigate(draftSearch, value, sort)}
            options={CUSTOMER_STATUS_FILTER_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            triggerClassName="h-8 w-36 text-xs text-foreground/65"
          />
        }
        desktopTrailing={
          <AdminSelectFilterControl
            value={sort}
            onValueChange={(value) => navigate(draftSearch, activeStatus, value)}
            options={[...CUSTOMER_SORT_LABEL_OPTIONS]}
            triggerClassName="h-8 w-40 text-xs text-foreground/65"
          />
        }
        activeFilters={activeFilters}
        onClearActiveFilters={() => navigate(draftSearch, CUSTOMER_STATUS_FILTER_ALL, sort)}
        clearActiveFiltersLabel="Effacer les filtres"
        resultsCount={totalItems}
        resultsFullLabel={(count) => `${count} client${count > 1 ? "s" : ""}`}
        resultsShortLabel={(count) => `${count} client${count > 1 ? "s" : ""}`}
      />

      <CustomerMobileFiltersDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        status={activeStatus}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        activeFilterItems={activeFilters}
        onStatusChange={(value) => navigate(draftSearch, value, sort)}
        onSortChange={(value) => navigate(draftSearch, activeStatus, value)}
        onReset={() => navigate(draftSearch, CUSTOMER_STATUS_FILTER_ALL, CUSTOMER_DEFAULT_SORT)}
      />
    </>
  );
}
