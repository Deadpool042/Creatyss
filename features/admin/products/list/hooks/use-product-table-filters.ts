//features/admin/products/list/hooks/use-product-table-filters.ts
import { useCallback, useMemo } from "react";
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
import { useAdminListUrlState } from "@/components/admin/tables/state/use-admin-list-url-state";
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
const VALID_IMAGES = PRODUCT_FILTER_VALID_VALUES.images as readonly ProductFilterImageOption[];
const VALID_STOCK = PRODUCT_FILTER_VALID_VALUES.stock as readonly ProductFilterStockOption[];
const VALID_VARIANTS = PRODUCT_FILTER_VALID_VALUES.variants as readonly ProductFilterVariantOption[];

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
  const categorySlugs = parseAdminListStringArrayParam(searchParams.get("categories"));
  const image = parseAdminListSortParam(searchParams.get("image"), VALID_IMAGES, "all");
  const stock = parseAdminListSortParam(searchParams.get("stock"), VALID_STOCK, "all");
  const variant = parseAdminListSortParam(searchParams.get("variant"), VALID_VARIANTS, "all");

  // page / perPage come from server via props (already parsed & validated)
  // but we still read from URL for the setters
  const urlPage = parseAdminListPageParam(searchParams.get("page"));

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

  const setCategorySlugs = useCallback(
    (value: string[]) => pushParams({ categories: formatAdminListArrayParam(value) }),
    [pushParams]
  );

  const setImage = useCallback(
    (value: ProductFilterImageOption) =>
      pushParams({ image: formatAdminListDefaultParam(value, "all") }),
    [pushParams]
  );

  const setStock = useCallback(
    (value: ProductFilterStockOption) =>
      pushParams({ stock: formatAdminListDefaultParam(value, "all") }),
    [pushParams]
  );

  const setVariant = useCallback(
    (value: ProductFilterVariantOption) =>
      pushParams({ variant: formatAdminListDefaultParam(value, "all") }),
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

  // ── Pagination — server-driven ────────────────────────────────────────────
  // paginated = the server-filtered page of products
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
      ...categorySlugs.map((value) => ({
        key: `category-${value}`,
        label: `Catégorie · ${categoryOptions.find((cat) => cat.slug === value)?.name ?? value}`,
        onRemove: () => setCategorySlugs(categorySlugs.filter((item) => item !== value)),
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
      categorySlugs,
      featured,
      image,
      stock,
      variant,
      search,
      categoryOptions,
      setStatus,
      setCategorySlugs,
      setFeatured,
      setSearch,
      setImage,
      setStock,
      setVariant,
    ]
  );

  // ── Reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    resetUrl();
  }, [resetUrl]);

  // ── Expose same interface as before ───────────────────────────────────────

  return {
    search,
    setSearch,
    handleSearchChange: setSearch,

    status,
    setStatus,

    categorySlugs,
    setCategorySlugs,

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
    allFilteredProducts: products,
    paginated: products,
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
