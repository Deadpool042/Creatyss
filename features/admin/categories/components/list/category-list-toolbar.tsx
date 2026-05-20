"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { AdminToolbar, type AdminToolbarTab } from "@/components/admin/shared/admin-toolbar";
import { CategoryFilterPanel } from "@/features/admin/categories/components/list/category-filter-panel";
import { useCategoriesTableContext } from "@/features/admin/categories/context/categories-data-provider";
import {
  useCategoryFilters,
  type CategoryStatusFilter,
} from "@/features/admin/categories/list/hooks/use-category-filters";

const STATUS_TABS: AdminToolbarTab<CategoryStatusFilter>[] = [
  { key: "all", label: "Toutes" },
  { key: "active", label: "Actives", dot: "bg-green-500" },
  { key: "draft", label: "Brouillons", dot: "bg-amber-400" },
  { key: "inactive", label: "Inactives", dot: "bg-muted-foreground" },
  { key: "archived", label: "Archivées", dot: "bg-destructive" },
];

const FEATURED_TAB: AdminToolbarTab<"featured"> = {
  key: "featured",
  label: "Mises en avant",
  icon: <Star className="h-3 w-3 fill-amber-400 text-amber-400" />,
};

export function CategoryListToolbar() {
  const { total } = useCategoriesTableContext();
  const filters = useCategoryFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFeaturedTab = filters.featured === "featured" ? "featured" : undefined;
  const activeStatusTab = filters.featured === "featured" ? undefined : filters.status;
  const allTabs = [...STATUS_TABS, FEATURED_TAB] as AdminToolbarTab<
    CategoryStatusFilter | "featured"
  >[];
  const activeTab = activeFeaturedTab ?? activeStatusTab ?? "all";

  function handleTabChange(key: CategoryStatusFilter | "featured") {
    if (key === "featured") {
      filters.applyFilters({ featured: "featured", status: "all" });
    } else {
      filters.applyFilters({ status: key as CategoryStatusFilter, featured: "all" });
    }
  }

  return (
    <div className="flex flex-col gap-2">
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
        <p className="text-xs text-muted-foreground">
          {total} {total === 1 ? "catégorie trouvée" : "catégories trouvées"}
        </p>
      ) : null}

      <CategoryFilterPanel open={filtersOpen} onOpenChange={setFiltersOpen} filters={filters} />
    </div>
  );
}
