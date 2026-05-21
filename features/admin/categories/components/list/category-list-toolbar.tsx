"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

import { AdminSearchInput } from "@/components/admin/tables/admin-search-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCategoriesTableContext } from "@/features/admin/categories/context/categories-data-provider";
import { useCategoryFilters } from "@/features/admin/categories/list/hooks/use-category-filters";
import type { AdminCategoryStatus } from "@/features/admin/categories/list/types/admin-category-card-item.types";
import type {
  CategoryFeaturedFilter,
  CategoryPickerItem,
} from "@/features/admin/categories/list/queries/list-admin-categories.query";

// ─── Options statiques ─────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: AdminCategoryStatus; label: string }[] = [
  { value: "active", label: "Publiée" },
  { value: "draft", label: "Brouillon" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archivée" },
];

const FEATURED_OPTIONS: { value: CategoryFeaturedFilter; label: string }[] = [
  { value: "featured", label: "⭐ Mis en avant" },
  { value: "not-featured", label: "Non mis en avant" },
];

// ─── Checkbox list générique ────────────────────────────────────────────────

function CheckboxList<T extends string>({
  options,
  selected,
  onChange,
}: {
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (next: T[]) => void;
}) {
  function toggle(value: T) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  }
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => (
        <label key={opt.value} className="flex cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox
            checked={selected.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

// ─── Picker hiérarchique catégories ────────────────────────────────────────

function CategoryHierarchyPicker({
  items,
  selected,
  onChange,
}: {
  items: CategoryPickerItem[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const roots = items.filter((c) => c.parentId === null);
  const childrenByParentId: Record<string, CategoryPickerItem[]> = {};
  for (const c of items) {
    if (c.parentId) {
      (childrenByParentId[c.parentId] ??= []).push(c);
    }
  }
  const orphans = roots.filter((r) => !childrenByParentId[r.id]);
  const parents = roots.filter((r) => childrenByParentId[r.id]);

  function toggle(slug: string) {
    onChange(selected.includes(slug) ? selected.filter((v) => v !== slug) : [...selected, slug]);
  }

  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">Aucune catégorie disponible</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {parents.map((parent) => (
        <div key={parent.id}>
          <label className="flex cursor-pointer items-center gap-2.5 rounded px-1 py-1.5 text-sm font-medium hover:bg-muted/50">
            <Checkbox
              checked={selected.includes(parent.slug)}
              onCheckedChange={() => toggle(parent.slug)}
            />
            {parent.name}
          </label>
          {childrenByParentId[parent.id]?.map((child) => (
            <label
              key={child.id}
              className="flex cursor-pointer items-center gap-2.5 rounded py-1.5 pl-7 pr-1 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <Checkbox
                checked={selected.includes(child.slug)}
                onCheckedChange={() => toggle(child.slug)}
              />
              <span className="text-[0.7rem] text-brand/60 mr-0.5">›</span>
              {child.name}
            </label>
          ))}
        </div>
      ))}
      {orphans.length > 0 && parents.length > 0 && (
        <div className="my-1 border-t border-surface-border" />
      )}
      {orphans.map((cat) => (
        <label
          key={cat.id}
          className="flex cursor-pointer items-center gap-2.5 rounded px-1 py-1.5 text-sm hover:bg-muted/50"
        >
          <Checkbox
            checked={selected.includes(cat.slug)}
            onCheckedChange={() => toggle(cat.slug)}
          />
          {cat.name}
        </label>
      ))}
    </div>
  );
}

// ─── Popover desktop générique ──────────────────────────────────────────────

function FilterPopover({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className={cn(
            "h-9 gap-1.5 text-sm",
            count > 0
              ? "border-surface-border-strong bg-interactive-selected text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
          {count > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
              {count}
            </span>
          )}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        {children}
      </PopoverContent>
    </Popover>
  );
}

// ─── Active chips ───────────────────────────────────────────────────────────

type Chip = { key: string; label: string; onRemove: () => void };

function ActiveChips({ chips, onReset }: { chips: Chip[]; onReset: () => void }) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex h-6 items-center gap-1 rounded-full border border-surface-border-strong bg-interactive-selected px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          {chip.label}
          <X className="h-3 w-3 shrink-0 opacity-60" />
        </button>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        Réinitialiser
      </button>
    </div>
  );
}

// ─── Section drawer avec titre ──────────────────────────────────────────────

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-[0.68rem] font-semibold uppercase tracking-widest text-muted-foreground/60">
        {title}
      </p>
      {children}
    </div>
  );
}

// ─── Main toolbar ───────────────────────────────────────────────────────────

export function CategoryListToolbar() {
  const { total, categoriesForPicker } = useCategoriesTableContext();
  const filters = useCategoryFilters();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mobileFilterCount =
    filters.status.length + filters.featured.length + filters.categorySlugs.length;

  // Chips actifs
  const chips: Chip[] = [
    ...filters.categorySlugs.map((slug) => ({
      key: `cat-${slug}`,
      label: categoriesForPicker.find((c) => c.slug === slug)?.name ?? slug,
      onRemove: () => filters.setCategorySlugs(filters.categorySlugs.filter((v) => v !== slug)),
    })),
    ...filters.status.map((s) => ({
      key: `status-${s}`,
      label: STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s,
      onRemove: () => filters.setStatus(filters.status.filter((v) => v !== s)),
    })),
    ...filters.featured.map((f) => ({
      key: `featured-${f}`,
      label: FEATURED_OPTIONS.find((o) => o.value === f)?.label ?? f,
      onRemove: () => filters.setFeatured(filters.featured.filter((v) => v !== f)),
    })),
  ];

  function handleReset() {
    filters.resetFilters();
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar row */}
      <div className="flex items-center gap-2">
        <AdminSearchInput
          value={filters.search}
          onChange={filters.setSearch}
          placeholder="Rechercher…"
          className="min-w-0 flex-1 max-w-56 lg:max-w-xs"
        />

        {/* Mobile : bouton Filtres → drawer */}
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={cn(
            "lg:hidden inline-flex h-9 shrink-0 items-center gap-1.5 px-3 text-sm",
            mobileFilterCount > 0
              ? "border-surface-border-strong bg-interactive-selected text-foreground"
              : "text-muted-foreground"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {mobileFilterCount > 0 ? `Filtres · ${mobileFilterCount}` : "Filtres"}
        </Button>

        {/* Desktop : Popovers inline */}
        <div className="hidden lg:flex lg:items-center lg:gap-2">
          <FilterPopover label="Catégories" count={filters.categorySlugs.length}>
            <CategoryHierarchyPicker
              items={categoriesForPicker}
              selected={filters.categorySlugs}
              onChange={filters.setCategorySlugs}
            />
          </FilterPopover>
          <FilterPopover label="Statut" count={filters.status.length}>
            <CheckboxList
              options={STATUS_OPTIONS}
              selected={filters.status}
              onChange={filters.setStatus}
            />
          </FilterPopover>
          <FilterPopover label="Mise en avant" count={filters.featured.length}>
            <CheckboxList
              options={FEATURED_OPTIONS}
              selected={filters.featured}
              onChange={filters.setFeatured}
            />
          </FilterPopover>
        </div>
      </div>

      {/* Active chips — tous viewports */}
      <ActiveChips chips={chips} onReset={handleReset} />

      {/* Drawer mobile */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-6 pt-4">
          <SheetHeader className="mb-5 text-left">
            <SheetTitle className="text-base">Filtres</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-5 overflow-y-auto max-h-[60dvh]">
            <DrawerSection title="Catégories">
              <CategoryHierarchyPicker
                items={categoriesForPicker}
                selected={filters.categorySlugs}
                onChange={filters.setCategorySlugs}
              />
            </DrawerSection>
            <DrawerSection title="Statut">
              <CheckboxList
                options={STATUS_OPTIONS}
                selected={filters.status}
                onChange={filters.setStatus}
              />
            </DrawerSection>
            <DrawerSection title="Mise en avant">
              <CheckboxList
                options={FEATURED_OPTIONS}
                selected={filters.featured}
                onChange={filters.setFeatured}
              />
            </DrawerSection>
          </div>

          <SheetFooter className="mt-6">
            {mobileFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => {
                  handleReset();
                  setDrawerOpen(false);
                }}
                className="w-full text-muted-foreground"
              >
                Réinitialiser les filtres
              </Button>
            )}
            <Button size="sm" type="button" onClick={() => setDrawerOpen(false)} className="w-full">
              Voir les résultats
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {total > 0 ? (
        <p className="text-xs text-muted-foreground">
          {total} {total === 1 ? "catégorie trouvée" : "catégories trouvées"}
        </p>
      ) : null}
    </div>
  );
}
