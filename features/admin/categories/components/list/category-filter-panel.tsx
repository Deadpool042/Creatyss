"use client";

import { useState } from "react";

import { AdminDataTableFiltersSheet } from "@/components/admin/tables/admin-data-table-filters-sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CategorySortOption,
} from "@/features/admin/categories/list/queries/list-admin-categories.query";
import type {
  CategoryFiltersState,
} from "@/features/admin/categories/list/hooks/use-category-filters";

type CategoryFilterPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Pick<
    CategoryFiltersState,
    "sort" | "perPage" | "applyFilters" | "reset"
  >;
};

const SORT_OPTIONS: { value: CategorySortOption; label: string }[] = [
  { value: "name-asc", label: "Nom A→Z" },
  { value: "name-desc", label: "Nom Z→A" },
  { value: "updated-desc", label: "Plus récentes" },
  { value: "updated-asc", label: "Plus anciennes" },
];

const PER_PAGE_OPTIONS = [
  { value: 5, label: "5 par page" },
  { value: 10, label: "10 par page" },
  { value: 25, label: "25 par page" },
  { value: 50, label: "50 par page" },
];

export function CategoryFilterPanel({ open, onOpenChange, filters }: CategoryFilterPanelProps) {
  // Local draft state — applied only on button click
  const [draftSort, setDraftSort] = useState<CategorySortOption>(filters.sort);
  const [draftPerPage, setDraftPerPage] = useState<number>(filters.perPage);

  function handleApply() {
    filters.applyFilters({
      sort: draftSort,
      perPage: draftPerPage,
    });
    onOpenChange(false);
  }

  function handleReset() {
    setDraftSort("name-asc");
    setDraftPerPage(10);
    filters.reset();
    onOpenChange(false);
  }

  return (
    <AdminDataTableFiltersSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Tri et affichage"
      description="Choisissez l'ordre et le nombre de résultats."
      footer={
        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button size="sm" onClick={handleApply}>
            Appliquer
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Trier par */}
        <section>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Trier par
          </p>
          <Select value={draftSort} onValueChange={(v) => setDraftSort(v as CategorySortOption)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {/* Affichage */}
        <section>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Affichage
          </p>
          <Select value={String(draftPerPage)} onValueChange={(v) => setDraftPerPage(Number(v))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>
      </div>
    </AdminDataTableFiltersSheet>
  );
}
