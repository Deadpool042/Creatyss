//features/admin/products/list/hooks/use-product-table-filters.ts
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  formatAdminListArrayParam,
  formatAdminListDefaultParam,
  formatAdminListPageParam,
  parseAdminListArrayParam,
  parseAdminListPageParam,
  parseAdminListSortParam,
  parseAdminListStringArrayParam,
} from "@/components/admin/tables/state/admin-list-search-params";
import { useAdminListUrlState } from "@/components/admin/tables";
import { PRODUCT_FILTER_VALID_VALUES } from "@/features/admin/products/config";
import type {
  ProductFilterCategoryOption,
  ProductFeaturedFilterValue,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductSortOption,
  ProductTableFiltersState,
  ProductTableItem,
  ProductTableStatus,
} from "../types";

type UseProductTableFiltersInput = {
  products: ProductTableItem[];
  categoryOptions: ProductFilterCategoryOption[];
  // Server-side pagination context
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
};

// ── URL param helpers ─────────────────────────────────────────────────────────

const VALID_SORTS = PRODUCT_FILTER_VALID_VALUES.sorts as readonly ProductSortOption[];
const DEFAULT_SORT: ProductSortOption = "updated-desc";

const VALID_STATUSES = PRODUCT_FILTER_VALID_VALUES.statuses as readonly ProductTableStatus[];
const VALID_FEATURED = PRODUCT_FILTER_VALID_VALUES.featured.filter(
  (value): value is ProductFeaturedFilterValue => value !== "all"
);

function sortCategories(
  left: ProductFilterCategoryOption,
  right: ProductFilterCategoryOption
): number {
  return left.name.localeCompare(right.name, "fr");
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useProductTableFilters({
  products,
  categoryOptions,
  total,
  totalPages,
  currentPage,
  perPage,
}: UseProductTableFiltersInput): ProductTableFiltersState {
  const searchParams = useSearchParams();
  const { pushParams, resetUrl } = useAdminListUrlState();

  // ── URL-based filter state ────────────────────────────────────────────────

  const search = searchParams.get("search") ?? "";
  const status = parseAdminListArrayParam(searchParams.get("status"), VALID_STATUSES);
  const sort = parseAdminListSortParam(searchParams.get("sort"), VALID_SORTS, DEFAULT_SORT);
  const featured = parseAdminListArrayParam(searchParams.get("featured"), VALID_FEATURED);
  const categoryIds = parseAdminListStringArrayParam(
    searchParams.get("categories") ?? searchParams.get("categoryId")
  );

  // page / perPage come from server via props (already parsed & validated)
  // but we still read from URL for the setters
  const urlPage = parseAdminListPageParam(searchParams.get("page"));

  // ── Local UI-only state (not in URL) ─────────────────────────────────────

  const [image, setImage] = useState<ProductFilterImageOption>("all");
  const [stock, setStock] = useState<ProductFilterStockOption>("all");
  const [variant, setVariant] = useState<ProductFilterVariantOption>("all");
  // ── URL setters ───────────────────────────────────────────────────────────

  const setSearch = useCallback(
    (value: string) => pushParams({ search: value || null }),
    [pushParams]
  );

  const setStatus = useCallback(
    (value: ProductTableStatus[]) => pushParams({ status: formatAdminListArrayParam(value) }),
    [pushParams]
  );

  const setSort = useCallback(
    (value: ProductSortOption) =>
      pushParams({ sort: formatAdminListDefaultParam(value, DEFAULT_SORT) }),
    [pushParams]
  );

  const setFeatured = useCallback(
    (value: ProductFeaturedFilterValue[]) =>
      pushParams({ featured: formatAdminListArrayParam(value) }),
    [pushParams]
  );

  const setCategoryIds = useCallback(
    (value: string[]) =>
      pushParams({ categories: formatAdminListArrayParam(value), categoryId: null }),
    [pushParams]
  );

  const setPage = useCallback(
    (value: number) => pushParams({ page: formatAdminListPageParam(value) }),
    [pushParams]
  );

  const setPerPage = useCallback(
    (value: number) =>
      pushParams({
        perPage: formatAdminListDefaultParam(value, PRODUCT_FILTER_VALID_VALUES.perPageDefault),
        page: null,
      }),
    [pushParams]
  );

  // ── Client-side filtering on top of server results ────────────────────────
  // The server handles: search, status, sort, featured, categoryId, page, perPage.
  // The client applies residual filters: image, stock, variant.

  const filtered = useMemo(() => {
    let result = [...products];

    if (image === "with-image") {
      result = result.filter((product) => Boolean(product.primaryImageUrl));
    } else if (image === "without-image") {
      result = result.filter((product) => !product.primaryImageUrl);
    }

    if (stock === "in-stock") {
      result = result.filter((product) => product.stockState === "in-stock");
    } else if (stock === "out-of-stock") {
      result = result.filter((product) => product.stockState === "out-of-stock");
    }

    if (variant === "single") {
      result = result.filter((product) => product.variantCount <= 1);
    } else if (variant === "multiple") {
      result = result.filter((product) => product.variantCount > 1);
    }

    return result;
  }, [image, products, stock, variant]);

  // ── Pagination — server-driven ────────────────────────────────────────────
  // paginated = the server-filtered page of products, after client residual filters
  // allFilteredProducts = same (mobile infinite scroll receives this)

  const safeCurrentPage = currentPage;
  const safeTotalPages = totalPages;

  // ── Active filters for UI chips ───────────────────────────────────────────

  const activeFilters = useMemo(
    () => [
      ...status.map((value) => ({
        key: `status-${value}`,
        label: `Statut · ${value}`,
        onRemove: () => setStatus(status.filter((item) => item !== value)),
      })),
      ...categoryIds.map((value) => ({
        key: `category-${value}`,
        label: `Catégorie · ${categoryOptions.find((cat) => cat.id === value)?.name ?? value}`,
        onRemove: () => setCategoryIds(categoryIds.filter((item) => item !== value)),
      })),
      ...featured.map((value) => ({
        key: `featured-${value}`,
        label: value === "featured" ? "Mis en avant" : "Standard",
        onRemove: () => setFeatured(featured.filter((item) => item !== value)),
      })),
      ...(image !== "all"
        ? [
            {
              key: "image",
              label: image === "with-image" ? "Avec image" : "Sans image",
              onRemove: () => setImage("all"),
            },
          ]
        : []),
      ...(stock !== "all"
        ? [
            {
              key: "stock",
              label: stock === "in-stock" ? "En stock" : "Rupture",
              onRemove: () => setStock("all"),
            },
          ]
        : []),
      ...(variant !== "all"
        ? [
            {
              key: "variant",
              label: variant === "single" ? "Simple" : "Multi-variantes",
              onRemove: () => setVariant("all"),
            },
          ]
        : []),
      ...(search.trim().length > 0
        ? [{ key: "search", label: `Recherche · ${search.trim()}`, onRemove: () => setSearch("") }]
        : []),
    ],
    [
      status,
      categoryIds,
      featured,
      image,
      stock,
      variant,
      search,
      categoryOptions,
      setStatus,
      setCategoryIds,
      setFeatured,
      setSearch,
      setImage,
      setStock,
      setVariant,
    ]
  );

  // ── Reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setImage("all");
    setStock("all");
    setVariant("all");
    resetUrl();
  }, [resetUrl]);

  // ── Expose same interface as before ───────────────────────────────────────

  return {
    search,
    setSearch,
    handleSearchChange: setSearch,

    status,
    setStatus,

    categoryIds,
    setCategoryIds,

    featured,
    setFeatured,

    image,
    setImage,

    stock,
    setStock,

    variant,
    setVariant,

    sort,
    setSort,

    categoryOptions: [...categoryOptions].sort(sortCategories),
    allFilteredProducts: filtered,
    paginated: filtered,
    currentPage: safeCurrentPage,
    totalPages: safeTotalPages,
    perPage,
    setPage,
    setPerPage,
    goPrevious: () => setPage(Math.max(1, urlPage - 1)),
    goNext: () => setPage(Math.min(safeTotalPages, urlPage + 1)),

    filteredCount: total,
    activeFilters,
    reset,
  };
}

export type { ProductTableFiltersState } from "../types/product-table.types";
