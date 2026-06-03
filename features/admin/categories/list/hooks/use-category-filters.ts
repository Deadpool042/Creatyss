"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { useAdminListUrlState } from "@/components/admin/tables/state/use-admin-list-url-state";
import {
  formatAdminListArrayParam,
  formatAdminListDefaultParam,
  formatAdminListPageParam,
  parseAdminListArrayParam,
  parseAdminListPageParam,
  parseAdminListPerPageParam,
  parseAdminListSortParam,
  parseAdminListStringArrayParam,
} from "@/components/admin/tables/state/admin-list-search-params";
import { CATEGORY_FILTER_VALID_VALUES } from "@/features/admin/categories/config";
import type { AdminCategoryStatus } from "@/features/admin/categories/types";
import type { CategoryFeaturedFilter, CategorySortOption } from "@/features/admin/categories/list";

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

const VALID_STATUSES = CATEGORY_FILTER_VALID_VALUES.statuses;
const VALID_FEATURED = CATEGORY_FILTER_VALID_VALUES.featured;
const VALID_SORTS = CATEGORY_FILTER_VALID_VALUES.sorts;
const VALID_PER_PAGE = CATEGORY_FILTER_VALID_VALUES.perPage;

export function useCategoryFilters(): CategoryFiltersState {
  const searchParams = useSearchParams();
  const { pushParams, resetUrl } = useAdminListUrlState();

  const search = searchParams.get("search") ?? "";
  const status = parseAdminListArrayParam(searchParams.get("status"), VALID_STATUSES);
  const featured = parseAdminListArrayParam(searchParams.get("featured"), VALID_FEATURED);
  const categorySlugs = parseAdminListStringArrayParam(searchParams.get("categories"));
  const sort = parseAdminListSortParam(searchParams.get("sort"), VALID_SORTS, "name-asc");
  const perPage = parseAdminListPerPageParam(
    searchParams.get("perPage"),
    VALID_PER_PAGE,
    CATEGORY_FILTER_VALID_VALUES.perPageDefault
  );
  const page = parseAdminListPageParam(searchParams.get("page"));

  const activeFilterCount = [
    sort !== "name-asc",
    perPage !== CATEGORY_FILTER_VALID_VALUES.perPageDefault,
    status.length > 0,
    featured.length > 0,
    categorySlugs.length > 0,
  ].filter(Boolean).length;

  const setSearch = useCallback(
    (value: string) => pushParams({ search: value || null }),
    [pushParams]
  );

  const setStatus = useCallback(
    (values: AdminCategoryStatus[]) => pushParams({ status: formatAdminListArrayParam(values) }),
    [pushParams]
  );

  const setFeatured = useCallback(
    (values: CategoryFeaturedFilter[]) =>
      pushParams({ featured: formatAdminListArrayParam(values) }),
    [pushParams]
  );

  const setCategorySlugs = useCallback(
    (values: string[]) => pushParams({ categories: formatAdminListArrayParam(values) }),
    [pushParams]
  );

  const setSort = useCallback(
    (value: CategorySortOption) =>
      pushParams({ sort: formatAdminListDefaultParam(value, "name-asc") }),
    [pushParams]
  );

  const setPage = useCallback(
    (value: number) => pushParams({ page: formatAdminListPageParam(value) }),
    [pushParams]
  );

  const setPerPage = useCallback(
    (value: number) =>
      pushParams({
        perPage: formatAdminListDefaultParam(value, CATEGORY_FILTER_VALID_VALUES.perPageDefault),
        page: null,
      }),
    [pushParams]
  );

  const resetFilters = useCallback(
    () => pushParams({ status: null, featured: null, categories: null }),
    [pushParams]
  );

  const reset = useCallback(() => {
    resetUrl();
  }, [resetUrl]);

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
