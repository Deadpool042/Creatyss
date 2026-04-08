"use client";

import { useMemo, useState } from "react";

import type { AdminDataTableActiveFilterItem } from "@/components/admin/tables/admin-data-table-active-filters";
import {
  getFeaturedLabel,
  getImageLabel,
  getSortLabel,
  getStatusLabel,
  getStockLabel,
  getVariantLabel,
} from "@/features/admin/products/list/utils/product-table-filter-labels";
import {
  parsePriceValue,
  stripHtml,
} from "@/features/admin/products/list/utils/product-table-utils";
import {
  productTableFiltersSchema,
  type ProductTableFeaturedFilter,
  type ProductTableFiltersInput,
  type ProductTableImageFilter,
  type ProductTableSortOption,
  type ProductTableStatusFilter,
  type ProductTableStockFilter,
  type ProductTableVariantFilter,
} from "../schemas/product-table-filters.schema";
import type { ProductFilterCategoryOption, ProductTableItem } from "../types/product-table.types";

const PAGE_SIZE = 20;

type UseProductTableFiltersInput = {
  products: ProductTableItem[];
  categoryOptions: ProductFilterCategoryOption[];
  initialFilters?: Partial<ProductTableFiltersInput>;
};

export type ProductTableFiltersState = {
  search: string;
  statusFilter: ProductTableStatusFilter;
  parentCategoryFilter: string;
  categoryFilter: string;
  featuredFilter: ProductTableFeaturedFilter;
  imageFilter: ProductTableImageFilter;
  variantFilter: ProductTableVariantFilter;
  stockFilter: ProductTableStockFilter;
  sortOption: ProductTableSortOption;
  showAdvancedFilters: boolean;
  mobileFiltersOpen: boolean;
  filteredCount: number;
  paginated: ProductTableItem[];
  currentPage: number;
  totalPages: number;
  activeFilters: AdminDataTableActiveFilterItem[];
  setStatusFilter: (value: ProductTableStatusFilter) => void;
  setParentCategoryFilter: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setFeaturedFilter: (value: ProductTableFeaturedFilter) => void;
  setImageFilter: (value: ProductTableImageFilter) => void;
  setVariantFilter: (value: ProductTableVariantFilter) => void;
  setStockFilter: (value: ProductTableStockFilter) => void;
  setSortOption: (value: ProductTableSortOption) => void;
  setShowAdvancedFilters: (value: boolean) => void;
  setMobileFiltersOpen: (value: boolean) => void;
  handleSearchChange: (value: string) => void;
  reset: () => void;
  goPrevious: () => void;
  goNext: () => void;
};

export function useProductTableFilters({
  products,
  categoryOptions,
  initialFilters,
}: UseProductTableFiltersInput): ProductTableFiltersState {
  const parsedInitialFilters = productTableFiltersSchema.parse(initialFilters ?? {});

  const [search, setSearch] = useState(parsedInitialFilters.search);
  const [statusFilter, setStatusFilterState] = useState<ProductTableStatusFilter>(
    parsedInitialFilters.status
  );
  const [parentCategoryFilter, setParentCategoryFilterState] = useState(
    parsedInitialFilters.parentCategory
  );
  const [categoryFilter, setCategoryFilterState] = useState(parsedInitialFilters.category);
  const [featuredFilter, setFeaturedFilterState] = useState<ProductTableFeaturedFilter>(
    parsedInitialFilters.featured
  );
  const [imageFilter, setImageFilterState] = useState<ProductTableImageFilter>(
    parsedInitialFilters.image
  );
  const [variantFilter, setVariantFilterState] = useState<ProductTableVariantFilter>(
    parsedInitialFilters.variant
  );
  const [stockFilter, setStockFilterState] = useState<ProductTableStockFilter>(
    parsedInitialFilters.stock
  );
  const [sortOption, setSortOptionState] = useState<ProductTableSortOption>(
    parsedInitialFilters.sort
  );
  const [page, setPage] = useState(parsedInitialFilters.page);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const base = products.filter((product) => {
      const normalizedShortDescription = product.shortDescription
        ? stripHtml(product.shortDescription).toLowerCase()
        : "";

      const matchesSearch =
        q.length === 0 ||
        product.name.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q) ||
        normalizedShortDescription.includes(q);

      const matchesStatus = statusFilter === "all" || product.status === statusFilter;

      const matchesCategory =
        categoryFilter !== "all"
          ? product.categoryId === categoryFilter
          : parentCategoryFilter !== "all"
            ? product.categoryId === parentCategoryFilter ||
              categoryOptions.some(
                (category) =>
                  category.id === product.categoryId && category.parentId === parentCategoryFilter
              )
            : true;

      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && product.isFeatured) ||
        (featuredFilter === "standard" && !product.isFeatured);

      const matchesImage =
        imageFilter === "all" ||
        (imageFilter === "with-image" && product.primaryImageUrl !== null) ||
        (imageFilter === "without-image" && product.primaryImageUrl === null);

      const matchesVariants =
        variantFilter === "all" ||
        (variantFilter === "with-variants" && product.variantCount > 0) ||
        (variantFilter === "without-variants" && product.variantCount === 0) ||
        (variantFilter === "single-variant" && product.variantCount === 1) ||
        (variantFilter === "multi-variant" && product.variantCount > 1);

      const matchesStock = stockFilter === "all" || product.stockState === stockFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesFeatured &&
        matchesImage &&
        matchesVariants &&
        matchesStock
      );
    });

    const sorted = [...base];

    if (sortOption === "name-asc") {
      sorted.sort((left, right) => left.name.localeCompare(right.name, "fr"));
      return sorted;
    }

    if (sortOption === "name-desc") {
      sorted.sort((left, right) => right.name.localeCompare(left.name, "fr"));
      return sorted;
    }

    if (sortOption === "price-asc") {
      sorted.sort(
        (left, right) =>
          parsePriceValue(left.priceValue ?? undefined) -
          parsePriceValue(right.priceValue ?? undefined)
      );
      return sorted;
    }

    if (sortOption === "price-desc") {
      sorted.sort(
        (left, right) =>
          parsePriceValue(right.priceValue ?? undefined) -
          parsePriceValue(left.priceValue ?? undefined)
      );
      return sorted;
    }

    return sorted;
  }, [
    products,
    search,
    statusFilter,
    parentCategoryFilter,
    categoryFilter,
    featuredFilter,
    imageFilter,
    variantFilter,
    stockFilter,
    sortOption,
    categoryOptions,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const currentParentCategory = categoryOptions.find(
    (category) => category.id === parentCategoryFilter
  );
  const currentCategory = categoryOptions.find((category) => category.id === categoryFilter);

  const activeFilters: AdminDataTableActiveFilterItem[] = [
    ...(statusFilter !== "all"
      ? [
          {
            key: "status",
            label: getStatusLabel(statusFilter),
            onRemove: () => {
              setStatusFilterState("all");
              setPage(1);
            },
          },
        ]
      : []),
    ...(parentCategoryFilter !== "all"
      ? [
          {
            key: "parentCategory",
            label: currentParentCategory?.name ?? "Catégorie",
            onRemove: () => {
              setParentCategoryFilterState("all");
              setCategoryFilterState("all");
              setPage(1);
            },
          },
        ]
      : []),
    ...(categoryFilter !== "all"
      ? [
          {
            key: "category",
            label: currentCategory?.name ?? "Sous-catégorie",
            onRemove: () => {
              setCategoryFilterState("all");
              setPage(1);
            },
          },
        ]
      : []),
    ...(featuredFilter !== "all"
      ? [
          {
            key: "featured",
            label: getFeaturedLabel(featuredFilter),
            onRemove: () => {
              setFeaturedFilterState("all");
              setPage(1);
            },
          },
        ]
      : []),
    ...(imageFilter !== "all"
      ? [
          {
            key: "image",
            label: getImageLabel(imageFilter),
            onRemove: () => {
              setImageFilterState("all");
              setPage(1);
            },
          },
        ]
      : []),
    ...(variantFilter !== "all"
      ? [
          {
            key: "variants",
            label: getVariantLabel(variantFilter),
            onRemove: () => {
              setVariantFilterState("all");
              setPage(1);
            },
          },
        ]
      : []),
    ...(stockFilter !== "all"
      ? [
          {
            key: "stock",
            label: getStockLabel(stockFilter),
            onRemove: () => {
              setStockFilterState("all");
              setPage(1);
            },
          },
        ]
      : []),
    ...(sortOption !== "updated-desc"
      ? [
          {
            key: "sort",
            label: getSortLabel(sortOption),
            onRemove: () => {
              setSortOptionState("updated-desc");
              setPage(1);
            },
          },
        ]
      : []),
  ];

  function reset(): void {
    const defaults = productTableFiltersSchema.parse({});

    setSearch(defaults.search);
    setStatusFilterState(defaults.status);
    setParentCategoryFilterState(defaults.parentCategory);
    setCategoryFilterState(defaults.category);
    setFeaturedFilterState(defaults.featured);
    setImageFilterState(defaults.image);
    setVariantFilterState(defaults.variant);
    setStockFilterState(defaults.stock);
    setSortOptionState(defaults.sort);
    setShowAdvancedFilters(false);
    setMobileFiltersOpen(false);
    setPage(defaults.page);
  }

  function handleSearchChange(value: string): void {
    setSearch(value);
    setPage(1);
  }

  function goPrevious(): void {
    setPage((current) => Math.max(1, current - 1));
  }

  function goNext(): void {
    setPage((current) => Math.min(totalPages, current + 1));
  }

  return {
    search,
    statusFilter,
    parentCategoryFilter,
    categoryFilter,
    featuredFilter,
    imageFilter,
    variantFilter,
    stockFilter,
    sortOption,
    showAdvancedFilters,
    mobileFiltersOpen,
    filteredCount: filtered.length,
    paginated,
    currentPage,
    totalPages,
    activeFilters,
    setStatusFilter: (value) => {
      setStatusFilterState(value);
      setPage(1);
    },
    setParentCategoryFilter: (value) => {
      setParentCategoryFilterState(value);
      setCategoryFilterState("all");
      setPage(1);
    },
    setCategoryFilter: (value) => {
      setCategoryFilterState(value);
      setPage(1);
    },
    setFeaturedFilter: (value) => {
      setFeaturedFilterState(value);
      setPage(1);
    },
    setImageFilter: (value) => {
      setImageFilterState(value);
      setPage(1);
    },
    setVariantFilter: (value) => {
      setVariantFilterState(value);
      setPage(1);
    },
    setStockFilter: (value) => {
      setStockFilterState(value);
      setPage(1);
    },
    setSortOption: (value) => {
      setSortOptionState(value);
      setPage(1);
    },
    setShowAdvancedFilters,
    setMobileFiltersOpen,
    handleSearchChange,
    reset,
    goPrevious,
    goNext,
  };
}
