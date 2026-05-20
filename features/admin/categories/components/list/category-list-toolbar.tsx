"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { AdminToolbar } from "@/components/admin/shared/admin-toolbar";
import type { AdminToolbarTab } from "@/components/admin/shared/admin-toolbar";
import { AdminDataTablePagination } from "@/components/admin/tables/admin-data-table-pagination";
import { CategoryFilterPanel } from "@/features/admin/categories/components/list/category-filter-panel";
import { useCategoryFilters } from "@/features/admin/categories/list/hooks/use-category-filters";
import type { CategoryStatusFilter } from "@/features/admin/categories/list/hooks/use-category-filters";

type CategoryListToolbarProps = {
  total: number;
  totalPages: number;
};

const STATUS_TABS: AdminToolbarTab<CategoryStatusFilter>[] = [
  { key: "all", label: "Toutes" },
  { key: "active", label: "Actives", dot: "bg-green-500" },
  { key: "draft", label: "Brouillons", dot: "bg-amber-400" },
  { key: "inactive", label: "Inactives", dot: "bg-muted-foreground" },
  {
    key: "archived",
    label: "Archivées",
    dot: "bg-destructive",
  },
];

const FEATURED_TAB: AdminToolbarTab<"featured"> = {
  key: "featured",
  label: "Mises en avant",
  icon: <Star className="h-3 w-3 fill-amber-400 text-amber-400" />,
};

export function CategoryListToolbar({ total, totalPages }: CategoryListToolbarProps) {
  const filters = useCategoryFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Build tabs: status tabs + featured tab
  const activeFeaturedTab = filters.featured === "featured" ? "featured" : undefined;
  const activeStatusTab = filters.featured === "featured" ? undefined : filters.status;

  function handleTabChange(key: CategoryStatusFilter | "featured") {
    if (key === "featured") {
      filters.applyFilters({ featured: "featured", status: "all" });
    } else {
      filters.applyFilters({ status: key as CategoryStatusFilter, featured: "all" });
    }
  }

  const allTabs = [...STATUS_TABS, FEATURED_TAB] as AdminToolbarTab<
    CategoryStatusFilter | "featured"
  >[];

  const activeTab = activeFeaturedTab ?? activeStatusTab ?? "all";

  return (
    <div className="flex flex-col gap-3">
      <AdminToolbar
        search={filters.search}
        onSearchChange={filters.setSearch}
        placeholder="Rechercher une catégorie…"
        tabs={allTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        filterCount={filters.activeFilterCount}
        onFiltersOpen={() => setFiltersOpen(true)}
      />

      {total > 0 ? (
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "catégorie trouvée" : "catégories trouvées"}
        </p>
      ) : null}

      <CategoryFilterPanel open={filtersOpen} onOpenChange={setFiltersOpen} filters={filters} />

      <AdminDataTablePagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPrevious={() => filters.setPage(filters.page - 1)}
        onNext={() => filters.setPage(filters.page + 1)}
        previousDisabled={filters.page <= 1}
        nextDisabled={filters.page >= totalPages}
      />
    </div>
  );
}
