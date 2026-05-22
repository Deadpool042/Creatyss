"use client";

import type { JSX } from "react";

import {
  AdminFilterBlocks,
  AdminSelectFilterControl,
  type AdminFilterBlock,
} from "@/components/admin/tables/filters";
import type {
  ProductFilterCategoryOption,
  ProductFilterFeaturedOption,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductSortOption,
  ProductTableFiltersState,
  ProductTableStatusFilter,
} from "@/features/admin/products/list/types";
import {
  PRODUCT_FEATURED_OPTIONS,
  PRODUCT_FILTERS_FORM_COPY,
  PRODUCT_IMAGE_OPTIONS,
  PRODUCT_SORT_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_STOCK_OPTIONS,
  PRODUCT_VARIANT_OPTIONS,
} from "@/features/admin/products/config";
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

function PrimaryFilters({ categoryOptions, state }: PrimaryFiltersProps): JSX.Element {
  return (
    <div className="grid grid-cols-[10rem_minmax(0,1fr)_10rem] gap-2">
      <div className="min-w-0">
        <AdminSelectFilterControl
          value={state.status}
          onValueChange={(value) => state.setStatus(value as ProductTableStatusFilter)}
          options={PRODUCT_STATUS_OPTIONS}
          placeholder={PRODUCT_FILTERS_FORM_COPY.statusPlaceholder}
          triggerClassName="h-8 text-xs"
        />
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
        <AdminSelectFilterControl
          value={state.sort}
          onValueChange={(value) => state.setSort(value as ProductSortOption)}
          options={PRODUCT_SORT_OPTIONS}
          placeholder={PRODUCT_FILTERS_FORM_COPY.sortPlaceholder}
          triggerClassName="h-8 text-xs"
        />
      </div>
    </div>
  );
}
function SecondaryFilters({ state, triggerClassName }: SecondaryFiltersProps): JSX.Element {
  return (
    <>
      <AdminSelectFilterControl
        value={state.featured}
        onValueChange={(value) => state.setFeatured(value as ProductFilterFeaturedOption)}
        options={PRODUCT_FEATURED_OPTIONS}
        label={PRODUCT_FILTERS_FORM_COPY.featuredLabel}
        placeholder={PRODUCT_FILTERS_FORM_COPY.featuredPlaceholder}
        triggerClassName={cn("h-8 text-xs", triggerClassName)}
      />

      <AdminSelectFilterControl
        value={state.image}
        onValueChange={(value) => state.setImage(value as ProductFilterImageOption)}
        options={PRODUCT_IMAGE_OPTIONS}
        label={PRODUCT_FILTERS_FORM_COPY.imagesLabel}
        placeholder={PRODUCT_FILTERS_FORM_COPY.imagesPlaceholder}
        triggerClassName={cn("h-8 text-xs", triggerClassName)}
      />

      <AdminSelectFilterControl
        value={state.variant}
        onValueChange={(value) => state.setVariant(value as ProductFilterVariantOption)}
        options={PRODUCT_VARIANT_OPTIONS}
        label={PRODUCT_FILTERS_FORM_COPY.variantsLabel}
        placeholder={PRODUCT_FILTERS_FORM_COPY.variantsPlaceholder}
        triggerClassName={cn("h-8 text-xs", triggerClassName)}
      />

      <AdminSelectFilterControl
        value={state.stock}
        onValueChange={(value) => state.setStock(value as ProductFilterStockOption)}
        options={PRODUCT_STOCK_OPTIONS}
        label={PRODUCT_FILTERS_FORM_COPY.stockLabel}
        placeholder={PRODUCT_FILTERS_FORM_COPY.stockPlaceholder}
        triggerClassName={cn("h-8 text-xs", triggerClassName)}
      />
    </>
  );
}

function MobilePrimaryFilters({ categoryOptions, state }: PrimaryFiltersProps): JSX.Element {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <AdminSelectFilterControl
        value={state.status}
        onValueChange={(value) => state.setStatus(value as ProductTableStatusFilter)}
        options={PRODUCT_STATUS_OPTIONS}
        placeholder={PRODUCT_FILTERS_FORM_COPY.statusPlaceholder}
        triggerClassName={cn("text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}
      />

      <AdminSelectFilterControl
        value={state.sort}
        onValueChange={(value) => state.setSort(value as ProductSortOption)}
        options={PRODUCT_SORT_OPTIONS}
        placeholder={PRODUCT_FILTERS_FORM_COPY.sortPlaceholder}
        triggerClassName={cn("text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}
      />

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
  );
}

function MobileAdvancedFiltersFields({ state }: { state: ProductTableFiltersState }): JSX.Element {
  return (
    <>
      <AdminSelectFilterControl
        value={state.featured}
        onValueChange={(value) => state.setFeatured(value as ProductFilterFeaturedOption)}
        options={PRODUCT_FEATURED_OPTIONS}
        placeholder={PRODUCT_FILTERS_FORM_COPY.featuredPlaceholder}
        triggerClassName={cn("text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}
      />

      <AdminSelectFilterControl
        value={state.image}
        onValueChange={(value) => state.setImage(value as ProductFilterImageOption)}
        options={PRODUCT_IMAGE_OPTIONS}
        placeholder={PRODUCT_FILTERS_FORM_COPY.imagesPlaceholder}
        triggerClassName={cn("text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}
      />

      <AdminSelectFilterControl
        value={state.variant}
        onValueChange={(value) => state.setVariant(value as ProductFilterVariantOption)}
        options={PRODUCT_VARIANT_OPTIONS}
        placeholder={PRODUCT_FILTERS_FORM_COPY.variantsPlaceholder}
        triggerClassName={cn("text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}
      />

      <AdminSelectFilterControl
        value={state.stock}
        onValueChange={(value) => state.setStock(value as ProductFilterStockOption)}
        options={PRODUCT_STOCK_OPTIONS}
        placeholder={PRODUCT_FILTERS_FORM_COPY.stockPlaceholder}
        triggerClassName={cn("text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}
      />
    </>
  );
}

function MobileAdvancedFilters({ state }: SecondaryFiltersProps): JSX.Element {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <MobileAdvancedFiltersFields state={state} />
    </div>
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

  const mobileBlocks: AdminFilterBlock[] = [
    {
      key: "primary",
      kind: "panel",
      title: PRODUCT_FILTERS_FORM_COPY.primarySectionTitle,
      content: <MobilePrimaryFilters categoryOptions={categoryOptions} state={state} />,
    },
    {
      key: "advanced",
      kind: "collapsible",
      title: PRODUCT_FILTERS_FORM_COPY.advancedSectionTitle,
      description: PRODUCT_FILTERS_FORM_COPY.advancedSectionDescription,
      summary:
        [
          state.featured !== "all",
          state.image !== "all",
          state.variant !== "all",
          state.stock !== "all",
        ].filter(Boolean).length > 0
          ? PRODUCT_FILTERS_FORM_COPY.advancedSummaryActive(
              [
                state.featured !== "all",
                state.image !== "all",
                state.variant !== "all",
                state.stock !== "all",
              ].filter(Boolean).length,
            )
          : PRODUCT_FILTERS_FORM_COPY.advancedSummaryShow,
      content: <MobileAdvancedFilters state={state} />,
    },
  ];

  return <AdminFilterBlocks blocks={mobileBlocks} className="space-y-2.5" />;
}
