//features/admin/products/list/hooks/use-product-table-filters.ts
import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

function parseSort(value: string | null): ProductSortOption {
  return VALID_SORTS.includes(value as ProductSortOption)
    ? (value as ProductSortOption)
    : DEFAULT_SORT;
}

function parsePage(value: string | null): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

const VALID_STATUSES = PRODUCT_FILTER_VALID_VALUES.statuses as readonly ProductTableStatus[];
const VALID_FEATURED = PRODUCT_FILTER_VALID_VALUES.featured.filter(
  (value): value is ProductFeaturedFilterValue => value !== "all"
);

function parseArray<T extends string>(value: string | null, valid: readonly T[]): T[] {
  if (!value) return [];
  return value.split(",").filter((item): item is T => valid.includes(item as T));
}

function parseCategoryIds(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── URL-based filter state ────────────────────────────────────────────────

  const search = searchParams.get("search") ?? "";
  const status = parseArray(searchParams.get("status"), VALID_STATUSES);
  const sort = parseSort(searchParams.get("sort"));
  const featured = parseArray(searchParams.get("featured"), VALID_FEATURED);
  const categoryIds = parseCategoryIds(searchParams.get("categories") ?? searchParams.get("categoryId"));

  // page / perPage come from server via props (already parsed & validated)
  // but we still read from URL for the setters
  const urlPage = parsePage(searchParams.get("page"));

  // ── Local UI-only state (not in URL) ─────────────────────────────────────

  const [image, setImage] = useState<ProductFilterImageOption>("all");
  const [stock, setStock] = useState<ProductFilterStockOption>("all");
  const [variant, setVariant] = useState<ProductFilterVariantOption>("all");
  // ── URL push helper ───────────────────────────────────────────────────────

  const pushParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      // Reset page when filters change (unless explicitly setting page)
      if (!("page" in updates)) {
        params.delete("page");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // ── URL setters ───────────────────────────────────────────────────────────

  const setSearch = useCallback(
    (value: string) => pushParams({ search: value || null }),
    [pushParams]
  );

  const setStatus = useCallback(
    (value: ProductTableStatus[]) =>
      pushParams({ status: value.length > 0 ? value.join(",") : null }),
    [pushParams]
  );

  const setSort = useCallback(
    (value: ProductSortOption) =>
      pushParams({ sort: value === DEFAULT_SORT ? null : value }),
    [pushParams]
  );

  const setFeatured = useCallback(
    (value: ProductFeaturedFilterValue[]) =>
      pushParams({ featured: value.length > 0 ? value.join(",") : null }),
    [pushParams]
  );

  const setCategoryIds = useCallback(
    (value: string[]) =>
      pushParams({ categories: value.length > 0 ? value.join(",") : null, categoryId: null }),
    [pushParams]
  );

  const setPage = useCallback(
    (value: number) => pushParams({ page: value === 1 ? null : String(value) }),
    [pushParams]
  );

  const setPerPage = useCallback(
    (value: number) =>
      pushParams({
        perPage: value === PRODUCT_FILTER_VALID_VALUES.perPageDefault ? null : String(value),
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

  const activeFilters = useMemo(() => [
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
  ], [
    status, categoryIds, featured, image, stock, variant, search,
    categoryOptions, setStatus, setCategoryIds, setFeatured, setSearch, setImage, setStock, setVariant,
  ]);

  // ── Reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setImage("all");
    setStock("all");
    setVariant("all");
    router.push(pathname);
  }, [pathname, router]);

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
