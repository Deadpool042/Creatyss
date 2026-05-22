"use client";

import type { JSX } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdminFilterBlocks,
  AdminFilterField,
  type AdminFilterBlock,
} from "@/components/admin/tables/filters";
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
        <Select
          value={state.status}
          onValueChange={(value) => state.setStatus(value as ProductTableStatusFilter)}
        >
          <SelectTrigger className="h-8 w-full text-xs">
            <SelectValue placeholder={PRODUCT_FILTERS_FORM_COPY.statusPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
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
            <SelectValue placeholder={PRODUCT_FILTERS_FORM_COPY.sortPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
function SecondaryFilters({ state, triggerClassName }: SecondaryFiltersProps): JSX.Element {
  return (
    <>
      <AdminFilterField label={PRODUCT_FILTERS_FORM_COPY.featuredLabel}>
        <Select
          value={state.featured}
          onValueChange={(value) => state.setFeatured(value as ProductFilterFeaturedOption)}
        >
          <SelectTrigger className={cn("h-8 w-full text-xs", triggerClassName)}>
            <SelectValue placeholder={PRODUCT_FILTERS_FORM_COPY.featuredPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_FEATURED_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AdminFilterField>

      <AdminFilterField label={PRODUCT_FILTERS_FORM_COPY.imagesLabel}>
        <Select
          value={state.image}
          onValueChange={(value) => state.setImage(value as ProductFilterImageOption)}
        >
          <SelectTrigger className={cn("h-8 w-full text-xs", triggerClassName)}>
            <SelectValue placeholder={PRODUCT_FILTERS_FORM_COPY.imagesPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_IMAGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AdminFilterField>

      <AdminFilterField label={PRODUCT_FILTERS_FORM_COPY.variantsLabel}>
        <Select
          value={state.variant}
          onValueChange={(value) => state.setVariant(value as ProductFilterVariantOption)}
        >
          <SelectTrigger className={cn("h-8 w-full text-xs", triggerClassName)}>
            <SelectValue placeholder={PRODUCT_FILTERS_FORM_COPY.variantsPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_VARIANT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AdminFilterField>

      <AdminFilterField label={PRODUCT_FILTERS_FORM_COPY.stockLabel}>
        <Select
          value={state.stock}
          onValueChange={(value) => state.setStock(value as ProductFilterStockOption)}
        >
          <SelectTrigger className={cn("h-8 w-full text-xs", triggerClassName)}>
            <SelectValue placeholder={PRODUCT_FILTERS_FORM_COPY.stockPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_STOCK_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AdminFilterField>
    </>
  );
}

function MobilePrimaryFilters({ categoryOptions, state }: PrimaryFiltersProps): JSX.Element {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Select
        value={state.status}
        onValueChange={(value) => state.setStatus(value as ProductTableStatusFilter)}
      >
        <SelectTrigger className={cn("w-full text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}>
          <SelectValue placeholder={PRODUCT_FILTERS_FORM_COPY.statusPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {PRODUCT_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={state.sort}
        onValueChange={(value) => state.setSort(value as ProductSortOption)}
      >
        <SelectTrigger className={cn("w-full text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}>
          <SelectValue placeholder={PRODUCT_FILTERS_FORM_COPY.sortPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {PRODUCT_SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
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
          <SelectValue placeholder={PRODUCT_FILTERS_FORM_COPY.featuredPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {PRODUCT_FEATURED_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={state.image}
        onValueChange={(value) => state.setImage(value as ProductFilterImageOption)}
      >
        <SelectTrigger className={cn("w-full text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}>
          <SelectValue placeholder={PRODUCT_FILTERS_FORM_COPY.imagesPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {PRODUCT_IMAGE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={state.variant}
        onValueChange={(value) => state.setVariant(value as ProductFilterVariantOption)}
      >
        <SelectTrigger className={cn("w-full text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}>
          <SelectValue placeholder={PRODUCT_FILTERS_FORM_COPY.variantsPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {PRODUCT_VARIANT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={state.stock}
        onValueChange={(value) => state.setStock(value as ProductFilterStockOption)}
      >
        <SelectTrigger className={cn("w-full text-sm", MOBILE_SELECT_TRIGGER_CLASS_NAME)}>
          <SelectValue placeholder={PRODUCT_FILTERS_FORM_COPY.stockPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {PRODUCT_STOCK_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
