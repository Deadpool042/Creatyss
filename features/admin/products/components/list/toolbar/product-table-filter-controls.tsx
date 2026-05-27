"use client";

import type { JSX } from "react";

import {
  AdminCheckboxFilterList,
  AdminConfigHierarchicalCheckboxFilter,
  AdminFilterPopovers,
  AdminSelectFilterControl,
  type AdminFilterPopoverItem,
} from "@/components/admin/tables/filters";
import {
  PRODUCT_FEATURED_OPTIONS,
  PRODUCT_IMAGE_OPTIONS,
  PRODUCT_LIST_COPY,
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_STOCK_OPTIONS,
  PRODUCT_VARIANT_OPTIONS,
} from "@/features/admin/products/config";
import type {
  ProductFeaturedFilterValue,
  ProductFilterCategoryOption,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductTableStatus,
} from "@/features/admin/products/list/types";

const PRODUCT_STATUS_FILTER_OPTIONS = PRODUCT_STATUS_OPTIONS.filter(
  (option): option is { value: ProductTableStatus; label: string } => option.value !== "all"
);

const PRODUCT_FEATURED_FILTER_OPTIONS = PRODUCT_FEATURED_OPTIONS.filter(
  (option): option is { value: ProductFeaturedFilterValue; label: string } => option.value !== "all"
);

type ProductTableFilterControlsProps = Readonly<{
  categoryOptions: ProductFilterCategoryOption[];
  status: ProductTableStatus[];
  featured: ProductFeaturedFilterValue[];
  image: ProductFilterImageOption;
  variant: ProductFilterVariantOption;
  stock: ProductFilterStockOption;
  categoryIds: string[];
  onStatusChange: (next: ProductTableStatus[]) => void;
  onFeaturedChange: (next: ProductFeaturedFilterValue[]) => void;
  onImageChange: (next: ProductFilterImageOption) => void;
  onVariantChange: (next: ProductFilterVariantOption) => void;
  onStockChange: (next: ProductFilterStockOption) => void;
  onCategoryIdsChange: (next: string[]) => void;
}>;

export function ProductStatusFilterControl({
  status,
  onStatusChange,
}: Readonly<{
  status: ProductTableStatus[];
  onStatusChange: (next: ProductTableStatus[]) => void;
}>): JSX.Element {
  return (
    <AdminCheckboxFilterList
      options={PRODUCT_STATUS_FILTER_OPTIONS}
      selected={status}
      onChange={onStatusChange}
    />
  );
}

export function ProductCategoryFilterControl({
  categoryOptions,
  categoryIds,
  onCategoryIdsChange,
}: Readonly<{
  categoryOptions: ProductFilterCategoryOption[];
  categoryIds: string[];
  onCategoryIdsChange: (next: string[]) => void;
}>): JSX.Element {
  return (
    <AdminConfigHierarchicalCheckboxFilter
      items={categoryOptions}
      selected={categoryIds}
      emptyLabel={PRODUCT_LIST_COPY.filterCategoryAllLabel}
      onChange={onCategoryIdsChange}
      getId={(category) => category.id}
      getLabel={(category) => category.name}
      getParentId={(category) => category.parentId}
      getValue={(category) => category.id}
    />
  );
}

export function ProductFeaturedFilterControl({
  featured,
  onFeaturedChange,
}: Readonly<{
  featured: ProductFeaturedFilterValue[];
  onFeaturedChange: (next: ProductFeaturedFilterValue[]) => void;
}>): JSX.Element {
  return (
    <AdminCheckboxFilterList
      options={PRODUCT_FEATURED_FILTER_OPTIONS}
      selected={featured}
      onChange={onFeaturedChange}
    />
  );
}

export function ProductAdvancedFiltersControl({
  featured,
  image,
  variant,
  stock,
  onFeaturedChange,
  onImageChange,
  onVariantChange,
  onStockChange,
  triggerClassName,
}: Readonly<{
  featured: ProductFeaturedFilterValue[];
  image: ProductFilterImageOption;
  variant: ProductFilterVariantOption;
  stock: ProductFilterStockOption;
  onFeaturedChange: (next: ProductFeaturedFilterValue[]) => void;
  onImageChange: (next: ProductFilterImageOption) => void;
  onVariantChange: (next: ProductFilterVariantOption) => void;
  onStockChange: (next: ProductFilterStockOption) => void;
  triggerClassName?: string;
}>): JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {PRODUCT_LIST_COPY.filterAdvancedFeaturedLabel}
        </p>
        <ProductFeaturedFilterControl
          featured={featured}
          onFeaturedChange={onFeaturedChange}
        />
      </div>

      <AdminSelectFilterControl
        value={image}
        onValueChange={(value) => onImageChange(value as ProductFilterImageOption)}
        options={PRODUCT_IMAGE_OPTIONS}
        label={PRODUCT_LIST_COPY.filterAdvancedImagesLabel}
        placeholder={PRODUCT_LIST_COPY.filterAdvancedImagesLabel}
        triggerClassName={triggerClassName ?? "h-8 text-xs"}
      />

      <AdminSelectFilterControl
        value={variant}
        onValueChange={(value) => onVariantChange(value as ProductFilterVariantOption)}
        options={PRODUCT_VARIANT_OPTIONS}
        label={PRODUCT_LIST_COPY.filterAdvancedVariantsLabel}
        placeholder={PRODUCT_LIST_COPY.filterAdvancedVariantsLabel}
        triggerClassName={triggerClassName ?? "h-8 text-xs"}
      />

      <AdminSelectFilterControl
        value={stock}
        onValueChange={(value) => onStockChange(value as ProductFilterStockOption)}
        options={PRODUCT_STOCK_OPTIONS}
        label={PRODUCT_LIST_COPY.filterAdvancedStockLabel}
        placeholder={PRODUCT_LIST_COPY.filterAdvancedStockLabel}
        triggerClassName={triggerClassName ?? "h-8 text-xs"}
      />
    </div>
  );
}

export function ProductTableFilterControls({
  categoryOptions,
  status,
  featured,
  image,
  variant,
  stock,
  categoryIds,
  onStatusChange,
  onFeaturedChange,
  onImageChange,
  onVariantChange,
  onStockChange,
  onCategoryIdsChange,
}: ProductTableFilterControlsProps): JSX.Element {
  const advancedCount = [
    featured.length > 0,
    image !== "all",
    variant !== "all",
    stock !== "all",
  ].filter(Boolean).length;

  const items: AdminFilterPopoverItem[] = [
    {
      key: "status",
      label: PRODUCT_LIST_COPY.filterStatutLabel,
      count: status.length,
      content: <ProductStatusFilterControl status={status} onStatusChange={onStatusChange} />,
    },
    {
      key: "categories",
      label: PRODUCT_LIST_COPY.filterCategoryLabel,
      count: categoryIds.length,
      contentClassName: "w-80 p-3",
      content: (
        <ProductCategoryFilterControl
          categoryOptions={categoryOptions}
          categoryIds={categoryIds}
          onCategoryIdsChange={onCategoryIdsChange}
        />
      ),
    },
    {
      key: "advanced",
      label: PRODUCT_LIST_COPY.filterAdvancedLabel,
      count: advancedCount,
      content: (
        <ProductAdvancedFiltersControl
          featured={featured}
          image={image}
          variant={variant}
          stock={stock}
          onFeaturedChange={onFeaturedChange}
          onImageChange={onImageChange}
          onVariantChange={onVariantChange}
          onStockChange={onStockChange}
        />
      ),
    },
  ];

  return <AdminFilterPopovers items={items} className="hidden lg:flex lg:items-center lg:gap-2" />;
}
