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
    <section className="space-y-2.5 rounded-xl border border-surface-border bg-surface-panel-soft p-3.5 [@media(max-height:480px)]:space-y-2 [@media(max-height:480px)]:p-3">
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
          value={state.status}
          onValueChange={(value) => state.setStatus(value as ProductTableStatusFilter)}
        >
          <SelectTrigger className="w-full text-sm">
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

      <div className="min-w-0 xl:min-w-[20rem] xl:flex-1">
        <AdminProductsCategoryFilter
          categories={categoryOptions}
          selectedParentCategoryId={state.parentCategoryId}
          selectedCategoryId={state.categoryId}
          onParentCategoryChange={state.setParentCategoryId}
          onCategoryChange={state.setCategoryId}
        />
      </div>

      <div className="xl:w-52 xl:flex-none">
        <Select
          value={state.featured}
          onValueChange={(value) => state.setFeatured(value as ProductFilterFeaturedOption)}
        >
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Mise en avant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les produits</SelectItem>
            <SelectItem value="featured">Mis en avant</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
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
        value={state.image}
        onValueChange={(value) => state.setImage(value as ProductFilterImageOption)}
      >
        <SelectTrigger className={cn("w-full text-sm", triggerClassName)}>
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
        <SelectTrigger className={cn("w-full text-sm", triggerClassName)}>
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
        <SelectTrigger className={cn("w-full text-sm", triggerClassName)}>
          <SelectValue placeholder="Disponibilité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les disponibilités</SelectItem>
          <SelectItem value="in-stock">En stock</SelectItem>
          <SelectItem value="out-of-stock">Rupture</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={state.sort}
        onValueChange={(value) => state.setSort(value as ProductSortOption)}
      >
        <SelectTrigger className={cn("w-full text-sm", triggerClassName)}>
          <SelectValue placeholder="Tri" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updated-desc">Plus récents</SelectItem>
          <SelectItem value="updated-asc">Plus anciens</SelectItem>
          <SelectItem value="name-asc">Nom A → Z</SelectItem>
          <SelectItem value="name-desc">Nom Z → A</SelectItem>
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
    </FilterSection>
  );
}

function MobileAdvancedFilters({ state }: SecondaryFiltersProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const activeAdvancedFiltersCount = useMemo(
    () =>
      [state.featured !== "all", state.image !== "all", state.variant !== "all", state.stock !== "all"].filter(Boolean)
        .length,
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
        className="flex w-full items-center justify-between gap-3 px-3.5 py-3.5 text-left transition-colors hover:bg-background/20 [@media(max-height:480px)]:px-3 [@media(max-height:480px)]:py-3"
        aria-expanded={open}
      >
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-tight text-foreground">Filtres secondaires</p>
          <p className="text-xs leading-5 text-muted-foreground [@media(max-height:480px)]:hidden">
            Mise en avant, images, variantes et disponibilité.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-surface-border bg-card px-2 py-1 text-[11px] font-medium text-muted-foreground">
            {summaryLabel}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
          />
        </div>
      </button>

      {open ? (
        <div className="border-t border-surface-border px-3.5 py-3.5 [@media(max-height:480px)]:px-3 [@media(max-height:480px)]:py-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <SecondaryFilters state={state} triggerClassName={MOBILE_SELECT_TRIGGER_CLASS_NAME} />
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
    <div className="space-y-3">
      <MobilePrimaryFilters categoryOptions={categoryOptions} state={state} />
      <MobileAdvancedFilters state={state} />
    </div>
  );
}
