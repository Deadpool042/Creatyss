"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState, type JSX, type ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductTableFiltersState } from "@/features/admin/products/list/hooks/use-product-table-filters";
import type { ProductFilterCategoryOption } from "@/features/admin/products/list/types/product-table.types";
import type {
  ProductTableFeaturedFilter,
  ProductTableImageFilter,
  ProductTableSortOption,
  ProductTableStatusFilter,
  ProductTableStockFilter,
  ProductTableVariantFilter,
} from "@/features/admin/products/list/schemas/product-table-filters.schema";
import { cn } from "@/lib/utils";
import { AdminProductsCategoryFilter } from "./admin-products-category-filter";

type ProductTableFiltersFormProps = {
  categoryOptions: ProductFilterCategoryOption[];
  state: ProductTableFiltersState;
  mode: "primary" | "secondary" | "mobile";
};

type PrimaryFiltersProps = Omit<ProductTableFiltersFormProps, "mode">;
type SecondaryFiltersProps = Pick<ProductTableFiltersFormProps, "state">;

function FilterSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <section className="space-y-3 rounded-xl border border-surface-border bg-surface-panel-soft p-4 [@media(max-height:480px)]:space-y-2.5 [@media(max-height:480px)]:p-3">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        {description ? (
          <p className="text-xs leading-5 text-muted-foreground [@media(max-height:480px)]:hidden">
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </section>
  );
}

function PrimaryFilters({ categoryOptions, state }: PrimaryFiltersProps): JSX.Element {
  return (
    <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center">
      <div className="xl:w-48 xl:flex-none">
        <Select
          value={state.statusFilter}
          onValueChange={(value) => state.setStatusFilter(value as ProductTableStatusFilter)}
        >
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="published">Publié</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0 xl:min-w-[20rem] xl:flex-1">
        <AdminProductsCategoryFilter
          categories={categoryOptions}
          selectedParentCategoryId={state.parentCategoryFilter}
          selectedCategoryId={state.categoryFilter}
          onParentCategoryChange={state.setParentCategoryFilter}
          onCategoryChange={state.setCategoryFilter}
        />
      </div>

      <div className="xl:w-52 xl:flex-none">
        <Select
          value={state.featuredFilter}
          onValueChange={(value) => state.setFeaturedFilter(value as ProductTableFeaturedFilter)}
        >
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Mise en avant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les produits</SelectItem>
            <SelectItem value="featured">Mis en avant</SelectItem>
            <SelectItem value="standard">Produits standards</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function SecondaryFilters({ state }: SecondaryFiltersProps): JSX.Element {
  return (
    <>
      <Select
        value={state.imageFilter}
        onValueChange={(value) => state.setImageFilter(value as ProductTableImageFilter)}
      >
        <SelectTrigger className="w-full text-sm">
          <SelectValue placeholder="Images" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les images</SelectItem>
          <SelectItem value="with-image">Avec image</SelectItem>
          <SelectItem value="without-image">Sans image</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={state.variantFilter}
        onValueChange={(value) => state.setVariantFilter(value as ProductTableVariantFilter)}
      >
        <SelectTrigger className="w-full text-sm">
          <SelectValue placeholder="Variantes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les variantes</SelectItem>
          <SelectItem value="with-variants">Avec variantes</SelectItem>
          <SelectItem value="without-variants">Sans variantes</SelectItem>
          <SelectItem value="single-variant">1 variante</SelectItem>
          <SelectItem value="multi-variant">Plusieurs variantes</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={state.stockFilter}
        onValueChange={(value) => state.setStockFilter(value as ProductTableStockFilter)}
      >
        <SelectTrigger className="w-full text-sm">
          <SelectValue placeholder="Stock" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les stocks</SelectItem>
          <SelectItem value="in-stock">En stock</SelectItem>
          <SelectItem value="low-stock">Stock faible</SelectItem>
          <SelectItem value="out-of-stock">Rupture</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={state.sortOption}
        onValueChange={(value) => state.setSortOption(value as ProductTableSortOption)}
      >
        <SelectTrigger className="w-full text-sm">
          <SelectValue placeholder="Tri" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updated-desc">Plus récents</SelectItem>
          <SelectItem value="name-asc">Nom A → Z</SelectItem>
          <SelectItem value="name-desc">Nom Z → A</SelectItem>
          <SelectItem value="price-asc">Prix croissant</SelectItem>
          <SelectItem value="price-desc">Prix décroissant</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}

function MobilePrimaryFilters({ categoryOptions, state }: PrimaryFiltersProps): JSX.Element {
  return (
    <FilterSection
      title="Filtres principaux"
      description="Les réglages les plus utiles pour affiner rapidement la liste."
    >
      <div className="grid gap-2.5 sm:grid-cols-2">
        <Select
          value={state.statusFilter}
          onValueChange={(value) => state.setStatusFilter(value as ProductTableStatusFilter)}
        >
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="published">Publié</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={state.sortOption}
          onValueChange={(value) => state.setSortOption(value as ProductTableSortOption)}
        >
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Tri" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated-desc">Plus récents</SelectItem>
            <SelectItem value="name-asc">Nom A → Z</SelectItem>
            <SelectItem value="name-desc">Nom Z → A</SelectItem>
            <SelectItem value="price-asc">Prix croissant</SelectItem>
            <SelectItem value="price-desc">Prix décroissant</SelectItem>
          </SelectContent>
        </Select>

        <div className="sm:col-span-2">
          <AdminProductsCategoryFilter
            categories={categoryOptions}
            selectedParentCategoryId={state.parentCategoryFilter}
            selectedCategoryId={state.categoryFilter}
            onParentCategoryChange={state.setParentCategoryFilter}
            onCategoryChange={state.setCategoryFilter}
          />
        </div>
      </div>
    </FilterSection>
  );
}

function MobileAdvancedFilters({ state }: SecondaryFiltersProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const activeAdvancedFiltersCount = useMemo(
    () =>
      [
        state.featuredFilter !== "all",
        state.imageFilter !== "all",
        state.variantFilter !== "all",
        state.stockFilter !== "all",
      ].filter(Boolean).length,
    [state.featuredFilter, state.imageFilter, state.variantFilter, state.stockFilter]
  );

  const summaryLabel =
    activeAdvancedFiltersCount > 0
      ? `${activeAdvancedFiltersCount} actif${activeAdvancedFiltersCount > 1 ? "s" : ""}`
      : open
        ? "Masquer"
        : "Afficher";

  return (
    <section className="overflow-hidden rounded-xl border border-surface-border bg-surface-panel-soft">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-background/20 [@media(max-height:480px)]:px-3.5 [@media(max-height:480px)]:py-3"
        aria-expanded={open}
      >
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-tight text-foreground">Filtres avancés</p>
          <p className="text-xs leading-5 text-muted-foreground [@media(max-height:480px)]:hidden">
            Mise en avant, images, variantes et stock.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-surface-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {summaryLabel}
          </span>

          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-surface-border bg-card text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </button>

      {open ? (
        <div className="border-t border-surface-border px-4 py-4 [@media(max-height:480px)]:px-3.5 [@media(max-height:480px)]:py-3">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Select
              value={state.featuredFilter}
              onValueChange={(value) =>
                state.setFeaturedFilter(value as ProductTableFeaturedFilter)
              }
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Mise en avant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les produits</SelectItem>
                <SelectItem value="featured">Mis en avant</SelectItem>
                <SelectItem value="standard">Produits standards</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={state.imageFilter}
              onValueChange={(value) => state.setImageFilter(value as ProductTableImageFilter)}
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Images" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les images</SelectItem>
                <SelectItem value="with-image">Avec image</SelectItem>
                <SelectItem value="without-image">Sans image</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={state.variantFilter}
              onValueChange={(value) => state.setVariantFilter(value as ProductTableVariantFilter)}
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Variantes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les variantes</SelectItem>
                <SelectItem value="with-variants">Avec variantes</SelectItem>
                <SelectItem value="without-variants">Sans variantes</SelectItem>
                <SelectItem value="single-variant">1 variante</SelectItem>
                <SelectItem value="multi-variant">Plusieurs variantes</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={state.stockFilter}
              onValueChange={(value) => state.setStockFilter(value as ProductTableStockFilter)}
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les stocks</SelectItem>
                <SelectItem value="in-stock">En stock</SelectItem>
                <SelectItem value="low-stock">Stock faible</SelectItem>
                <SelectItem value="out-of-stock">Rupture</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function ProductTableFiltersForm({
  categoryOptions,
  state,
  mode,
}: ProductTableFiltersFormProps): JSX.Element {
  if (mode === "primary") {
    return <PrimaryFilters categoryOptions={categoryOptions} state={state} />;
  }

  if (mode === "secondary") {
    return <SecondaryFilters state={state} />;
  }

  return (
    <div className="space-y-4">
      <MobilePrimaryFilters categoryOptions={categoryOptions} state={state} />
      <MobileAdvancedFilters state={state} />
    </div>
  );
}
