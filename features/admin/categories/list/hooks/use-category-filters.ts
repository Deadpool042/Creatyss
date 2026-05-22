"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import type { AdminCategoryStatus } from "@/features/admin/categories/types";
import type {
  CategoryFeaturedFilter,
  CategorySortOption,
} from "@/features/admin/categories/queries";

export type CategoryFiltersState = {
  search: string;
  status: AdminCategoryStatus[];
  featured: CategoryFeaturedFilter[];
  categorySlugs: string[];
  sort: CategorySortOption;
  page: number;
  perPage: number;
  activeFilterCount: number;
  setSearch: (value: string) => void;
  setStatus: (value: AdminCategoryStatus[]) => void;
  setFeatured: (value: CategoryFeaturedFilter[]) => void;
  setCategorySlugs: (value: string[]) => void;
  setSort: (value: CategorySortOption) => void;
  setPage: (value: number) => void;
  setPerPage: (value: number) => void;
  resetFilters: () => void;
  reset: () => void;
};

const VALID_STATUSES: AdminCategoryStatus[] = ["draft", "active", "inactive", "archived"];
const VALID_FEATURED: CategoryFeaturedFilter[] = ["featured", "not-featured"];
const VALID_SORTS: CategorySortOption[] = ["name-asc", "name-desc", "updated-asc", "updated-desc"];
const VALID_PER_PAGE = [5, 10, 25, 50];

function parseArray<T extends string>(value: string | null, valid: T[]): T[] {
  if (!value) return [];
  return value.split(",").filter((v): v is T => valid.includes(v as T));
}

function parseCategorySlugs(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

function parseSort(value: string | null): CategorySortOption {
  return VALID_SORTS.includes(value as CategorySortOption)
    ? (value as CategorySortOption)
    : "name-asc";
}

function parsePerPage(value: string | null): number {
  const n = Number(value);
  return VALID_PER_PAGE.includes(n) ? n : 10;
}

function parsePage(value: string | null): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export function useCategoryFilters(): CategoryFiltersState {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const status = parseArray(searchParams.get("status"), VALID_STATUSES);
  const featured = parseArray(searchParams.get("featured"), VALID_FEATURED);
  const categorySlugs = parseCategorySlugs(searchParams.get("categories"));
  const sort = parseSort(searchParams.get("sort"));
  const perPage = parsePerPage(searchParams.get("perPage"));
  const page = parsePage(searchParams.get("page"));

  const activeFilterCount = [
    sort !== "name-asc",
    perPage !== 10,
    status.length > 0,
    featured.length > 0,
    categorySlugs.length > 0,
  ].filter(Boolean).length;

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

      if (!("page" in updates)) {
        params.delete("page");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const setSearch = useCallback(
    (value: string) => pushParams({ search: value || null }),
    [pushParams]
  );

  const setStatus = useCallback(
    (values: AdminCategoryStatus[]) =>
      pushParams({ status: values.length > 0 ? values.join(",") : null }),
    [pushParams]
  );

  const setFeatured = useCallback(
    (values: CategoryFeaturedFilter[]) =>
      pushParams({ featured: values.length > 0 ? values.join(",") : null }),
    [pushParams]
  );

  const setCategorySlugs = useCallback(
    (values: string[]) =>
      pushParams({ categories: values.length > 0 ? values.join(",") : null }),
    [pushParams]
  );

  const setSort = useCallback(
    (value: CategorySortOption) => pushParams({ sort: value === "name-asc" ? null : value }),
    [pushParams]
  );

  const setPage = useCallback(
    (value: number) => pushParams({ page: value === 1 ? null : String(value) }),
    [pushParams]
  );

  const setPerPage = useCallback(
    (value: number) => pushParams({ perPage: value === 10 ? null : String(value) }),
    [pushParams]
  );

  const resetFilters = useCallback(
    () => pushParams({ status: null, featured: null, categories: null }),
    [pushParams]
  );

  const reset = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return {
    search,
    status,
    featured,
    categorySlugs,
    sort,
    page,
    perPage,
    activeFilterCount,
    setSearch,
    setStatus,
    setFeatured,
    setCategorySlugs,
    setSort,
    setPage,
    setPerPage,
    resetFilters,
    reset,
  };
}
