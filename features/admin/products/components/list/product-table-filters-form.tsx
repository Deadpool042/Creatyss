"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState, type JSX } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductTableFiltersState } from "@/features/admin/products/list/hooks/use-product-table-filters";
import type {
  ProductFilterCategoryOption,
  ProductFilterFeaturedOption,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductSortOption,
  ProductTableStatusFilter,
} from "@/features/admin/products/list/types/product-table.types";
import { cn } from "@/lib/utils";
import { AdminProductsCategoryFilter } from "./admin-products-category-filter";

type ProductTableFiltersFormProps = {
  categoryOptions: ProductFilterCategoryOption[];
  state: ProductTableFiltersState;
  mode: "primary" | "secondary" | "mobile";
};

type PrimaryFiltersProps = Omit<ProductTableFiltersFormProps, "mode">;
type SecondaryFiltersProps = {
  state: ProductTableFiltersState;
  triggerClassName?: string;
};

const MOBILE_SELECT_TRIGGER_CLASS_NAME =
  "h-10 rounded-xl bg-card text-sm [@media(max-height:480px)]:h-9";

function MobileFilterSectionTitle({ children }: { children: string }): JSX.Element {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </p>
  );
}

function PrimaryFilters({ categoryOptions, state }: PrimaryFiltersProps): JSX.Element {
  return (
    <div className="grid grid-cols-[10rem_minmax(0,1fr)_10rem] gap-2">
      <div className="min-w-0">
        <Select
          value={state.status}
          onValueChange={(value) => state.setStatus(value as ProductTableStatusFilter)}
        >
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0">
        <AdminProductsCategoryFilter
          categories={categoryOptions}
          selectedParentCategoryId={state.parentCategoryId}
          selectedCategoryId={state.categoryId}
          onParentCategoryChange={state.setParentCategoryId}
          onCategoryChange={state.setCategoryId}
          triggerClassName="h-8 text-xs"
          className="gap-2"
        />
      </div>

      <div className="min-w-0">
        <Select
          value={state.sort}
          onValueChange={(value) => state.setSort(value as ProductSortOption)}
        >
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue placeholder="Tri" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated-desc">Plus récents</SelectItem>
            <SelectItem value="updated-asc">Plus anciens</SelectItem>
            <SelectItem value="name-asc">Nom A → Z</SelectItem>
            <SelectItem value="name-desc">Nom Z → A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
function SecondaryFilters({ state, triggerClassName }: SecondaryFiltersProps): JSX.Element {
  return (
    <>
      <Select
        value={state.featured}
        onValueChange={(value) => state.setFeatured(value as ProductFilterFeaturedOption)}
      >
        <SelectTrigger className={cn("h-8 w-full text-xs", triggerClassName)}>
          <SelectValue placeholder="Mise en avant" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les produits</SelectItem>
          <SelectItem value="featured">Mis en avant</SelectItem>
          <SelectItem value="standard">Standard</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={state.image}
        onValueChange={(value) => state.setImage(value as ProductFilterImageOption)}
      >
        <SelectTrigger className={cn("h-8 w-full text-xs", triggerClassName)}>
          <SelectValue placeholder="Images" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les images</SelectItem>
          <SelectItem value="with-image">Avec image</SelectItem>
          <SelectItem value="without-image">Sans image</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={state.variant}
        onValueChange={(value) => state.setVariant(value as ProductFilterVariantOption)}
      >
        <SelectTrigger className={cn("h-8 w-full text-xs", triggerClassName)}>
          <SelectValue placeholder="Variantes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les produits</SelectItem>
          <SelectItem value="single">Simple</SelectItem>
          <SelectItem value="multiple">Multi-variantes</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={state.stock}
        onValueChange={(value) => state.setStock(value as ProductFilterStockOption)}
      >
        <SelectTrigger className={cn("h-8 w-full text-xs", triggerClassName)}>
          <SelectValue placeholder="Disponibilité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les disponibilités</SelectItem>
          <SelectItem value="in-stock">En stock</SelectItem>
          <SelectItem value="out-of-stock">Rupture</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}

function MobilePrimaryFilters({ categoryOptions, state }: PrimaryFiltersProps): JSX.Element {
  return (
    <section className="space-y-2.5 rounded-xl border border-surface-border bg-surface-panel-soft p-3 [@media(max-height:480px)]:space-y-2">
      <MobileFilterSectionTitle>Principaux</MobileFilterSectionTitle>

      <div className="grid gap-2 sm:grid-cols-2">
        <Select
          value={state.status}
          onValueChange={(value) => state.setStatus(value as ProductTableStatusFilter)}
        >
          <SelectTrigger className={cn("w-full text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={state.sort}
          onValueChange={(value) => state.setSort(value as ProductSortOption)}
        >
          <SelectTrigger className={cn("w-full text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}>
            <SelectValue placeholder="Tri" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated-desc">Plus récents</SelectItem>
            <SelectItem value="updated-asc">Plus anciens</SelectItem>
            <SelectItem value="name-asc">Nom A → Z</SelectItem>
            <SelectItem value="name-desc">Nom Z → A</SelectItem>
          </SelectContent>
        </Select>

        <div className="sm:col-span-2">
          <AdminProductsCategoryFilter
            categories={categoryOptions}
            selectedParentCategoryId={state.parentCategoryId}
            selectedCategoryId={state.categoryId}
            onParentCategoryChange={state.setParentCategoryId}
            onCategoryChange={state.setCategoryId}
            className="gap-2"
            triggerClassName={MOBILE_SELECT_TRIGGER_CLASS_NAME}
          />
        </div>
      </div>
    </section>
  );
}

function MobileAdvancedFiltersFields({ state }: { state: ProductTableFiltersState }): JSX.Element {
  return (
    <>
      <Select
        value={state.featured}
        onValueChange={(value) => state.setFeatured(value as ProductFilterFeaturedOption)}
      >
        <SelectTrigger className={cn("w-full text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}>
          <SelectValue placeholder="Mise en avant" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les produits</SelectItem>
          <SelectItem value="featured">Mis en avant</SelectItem>
          <SelectItem value="standard">Standard</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={state.image}
        onValueChange={(value) => state.setImage(value as ProductFilterImageOption)}
      >
        <SelectTrigger className={cn("w-full text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}>
          <SelectValue placeholder="Images" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les images</SelectItem>
          <SelectItem value="with-image">Avec image</SelectItem>
          <SelectItem value="without-image">Sans image</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={state.variant}
        onValueChange={(value) => state.setVariant(value as ProductFilterVariantOption)}
      >
        <SelectTrigger className={cn("w-full text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}>
          <SelectValue placeholder="Variantes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les produits</SelectItem>
          <SelectItem value="single">Simple</SelectItem>
          <SelectItem value="multiple">Multi-variantes</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={state.stock}
        onValueChange={(value) => state.setStock(value as ProductFilterStockOption)}
      >
        <SelectTrigger className={cn("w-full text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}>
          <SelectValue placeholder="Disponibilité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les disponibilités</SelectItem>
          <SelectItem value="in-stock">En stock</SelectItem>
          <SelectItem value="out-of-stock">Rupture</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}

function MobileAdvancedFilters({ state }: SecondaryFiltersProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const activeAdvancedFiltersCount = useMemo(
    () =>
      [
        state.featured !== "all",
        state.image !== "all",
        state.variant !== "all",
        state.stock !== "all",
      ].filter(Boolean).length,
    [state.featured, state.image, state.stock, state.variant]
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
        className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors hover:bg-interactive-hover"
        aria-expanded={open}
      >
        <div className="space-y-0.5">
          <MobileFilterSectionTitle>Avancés</MobileFilterSectionTitle>
          <p className="text-xs text-foreground">Mise en avant, images, variantes, stock</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-surface-border bg-card px-2 py-1 text-[11px] font-medium text-muted-foreground">
            {summaryLabel}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </div>
      </button>

      {open ? (
        <div className="border-t border-surface-border px-3 py-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <MobileAdvancedFiltersFields state={state} />
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
    <div className="space-y-2.5">
      <MobilePrimaryFilters categoryOptions={categoryOptions} state={state} />
      <MobileAdvancedFilters state={state} />
    </div>
  );
}
