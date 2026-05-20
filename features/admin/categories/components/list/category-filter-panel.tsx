"use client";

import { useState } from "react";

import { AdminDataTableFiltersSheet } from "@/components/admin/tables/admin-data-table-filters-sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CategoryFeaturedFilter,
  CategorySortOption,
} from "@/features/admin/categories/list/queries/list-admin-categories.query";
import type {
  CategoryFiltersState,
  CategoryStatusFilter,
} from "@/features/admin/categories/list/hooks/use-category-filters";

type CategoryFilterPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Pick<
    CategoryFiltersState,
    "status" | "featured" | "sort" | "perPage" | "applyFilters" | "reset"
  >;
};

const STATUS_OPTIONS: { value: CategoryStatusFilter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "active", label: "Actives" },
  { value: "draft", label: "Brouillons" },
  { value: "inactive", label: "Inactives" },
  { value: "archived", label: "Archivées" },
];

const FEATURED_OPTIONS: { value: CategoryFeaturedFilter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "featured", label: "Mises en avant" },
  { value: "not-featured", label: "Non mises en avant" },
];

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
  const [draftStatus, setDraftStatus] = useState<CategoryStatusFilter>(filters.status);
  const [draftFeatured, setDraftFeatured] = useState<CategoryFeaturedFilter>(filters.featured);
  const [draftSort, setDraftSort] = useState<CategorySortOption>(filters.sort);
  const [draftPerPage, setDraftPerPage] = useState<number>(filters.perPage);

  function handleApply() {
    filters.applyFilters({
      status: draftStatus,
      featured: draftFeatured,
      sort: draftSort,
      perPage: draftPerPage,
    });
    onOpenChange(false);
  }

  function handleReset() {
    setDraftStatus("all");
    setDraftFeatured("all");
    setDraftSort("name-asc");
    setDraftPerPage(10);
    filters.reset();
    onOpenChange(false);
  }

  return (
    <AdminDataTableFiltersSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Filtres"
      description="Affinez la liste des catégories."
      footer={
        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button size="sm" onClick={handleApply}>
            Appliquer les filtres
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Statut */}
        <section>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Statut
          </p>
          <div className="flex flex-col gap-2">
            {STATUS_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={draftStatus === option.value}
                  onCheckedChange={() => setDraftStatus(option.value)}
                />
                <Label htmlFor={`status-${option.value}`} className="cursor-pointer text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </section>

        {/* Mise en avant */}
        <section>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Mise en avant
          </p>
          <div className="flex flex-col gap-2">
            {FEATURED_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`featured-${option.value}`}
                  checked={draftFeatured === option.value}
                  onCheckedChange={() => setDraftFeatured(option.value)}
                />
                <Label htmlFor={`featured-${option.value}`} className="cursor-pointer text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </section>

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
