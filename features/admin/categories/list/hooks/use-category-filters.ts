"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import type { AdminCategoryStatus } from "@/features/admin/categories/list/types/admin-category-card-item.types";
import type {
  CategoryFeaturedFilter,
  CategorySortOption,
} from "@/features/admin/categories/list/queries/list-admin-categories.query";

export type CategoryStatusFilter = AdminCategoryStatus | "all";

export type CategoryFiltersState = {
  search: string;
  status: CategoryStatusFilter;
  featured: CategoryFeaturedFilter;
  sort: CategorySortOption;
  page: number;
  perPage: number;
  activeFilterCount: number;
  setSearch: (value: string) => void;
  setStatus: (value: CategoryStatusFilter) => void;
  setFeatured: (value: CategoryFeaturedFilter) => void;
  setSort: (value: CategorySortOption) => void;
  setPage: (value: number) => void;
  setPerPage: (value: number) => void;
  applyFilters: (
    partial: Partial<
      Omit<
        CategoryFiltersState,
        | "setSearch"
        | "setStatus"
        | "setFeatured"
        | "setSort"
        | "setPage"
        | "setPerPage"
        | "applyFilters"
        | "reset"
        | "activeFilterCount"
      >
    >
  ) => void;
  reset: () => void;
};

const VALID_STATUSES: CategoryStatusFilter[] = ["all", "draft", "active", "inactive", "archived"];
const VALID_FEATURED: CategoryFeaturedFilter[] = ["all", "featured", "not-featured"];
const VALID_SORTS: CategorySortOption[] = ["name-asc", "name-desc", "updated-asc", "updated-desc"];
const VALID_PER_PAGE = [10, 25, 50];

function parseStatus(value: string | null): CategoryStatusFilter {
  return VALID_STATUSES.includes(value as CategoryStatusFilter)
    ? (value as CategoryStatusFilter)
    : "all";
}

function parseFeatured(value: string | null): CategoryFeaturedFilter {
  return VALID_FEATURED.includes(value as CategoryFeaturedFilter)
    ? (value as CategoryFeaturedFilter)
    : "all";
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
  const status = parseStatus(searchParams.get("status"));
  const featured = parseFeatured(searchParams.get("featured"));
  const sort = parseSort(searchParams.get("sort"));
  const perPage = parsePerPage(searchParams.get("perPage"));
  const page = parsePage(searchParams.get("page"));

  const activeFilterCount = [
    status !== "all",
    featured !== "all",
    sort !== "name-asc",
    perPage !== 10,
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

      // Reset page when filters change (not when page itself changes)
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
    (value: CategoryStatusFilter) => pushParams({ status: value === "all" ? null : value }),
    [pushParams]
  );

  const setFeatured = useCallback(
    (value: CategoryFeaturedFilter) => pushParams({ featured: value === "all" ? null : value }),
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

  const applyFilters = useCallback(
    (
      partial: Partial<{
        search: string;
        status: CategoryStatusFilter;
        featured: CategoryFeaturedFilter;
        sort: CategorySortOption;
        page: number;
        perPage: number;
      }>
    ) => {
      const updates: Record<string, string | null> = {};
      if ("search" in partial) updates.search = partial.search || null;
      if ("status" in partial)
        updates.status = partial.status === "all" ? null : (partial.status ?? null);
      if ("featured" in partial)
        updates.featured = partial.featured === "all" ? null : (partial.featured ?? null);
      if ("sort" in partial)
        updates.sort = partial.sort === "name-asc" ? null : (partial.sort ?? null);
      if ("perPage" in partial)
        updates.perPage = partial.perPage === 10 ? null : String(partial.perPage);
      if ("page" in partial) updates.page = partial.page === 1 ? null : String(partial.page);
      pushParams(updates);
    },
    [pushParams]
  );

  const reset = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return {
    search,
    status,
    featured,
    sort,
    page,
    perPage,
    activeFilterCount,
    setSearch,
    setStatus,
    setFeatured,
    setSort,
    setPage,
    setPerPage,
    applyFilters,
    reset,
  };
}
