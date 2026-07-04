import {
  CATEGORY_FILTER_VALID_VALUES,
  CATEGORY_LIST_DEFAULT_SORT,
} from "@/features/admin/categories/config";
import type { AdminCategoryStatus } from "@/features/admin/categories/list/types/admin-category-card-item.types";
import type {
  CategoryFeaturedFilter,
  CategoryListFilters,
  CategorySortOption,
} from "@/features/admin/categories/list/types/category-list-query.types";

type RawSearchParams = Record<string, string | string[] | undefined>;

const VALID_SORTS = CATEGORY_FILTER_VALID_VALUES.sorts satisfies readonly CategorySortOption[];
const VALID_STATUSES =
  CATEGORY_FILTER_VALID_VALUES.statuses satisfies readonly AdminCategoryStatus[];
const VALID_FEATURED =
  CATEGORY_FILTER_VALID_VALUES.featured satisfies readonly CategoryFeaturedFilter[];
const VALID_PER_PAGE = CATEGORY_FILTER_VALID_VALUES.perPage;
const DEFAULT_SORT: CategorySortOption = CATEGORY_LIST_DEFAULT_SORT;
const DEFAULT_PER_PAGE = CATEGORY_FILTER_VALID_VALUES.perPageDefault;

function toSingleString(value: string | string[] | undefined): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? null;
  return null;
}

function parseSortParam(value: string | null): CategorySortOption {
  const validSet = new Set<string>(VALID_SORTS);
  if (value && validSet.has(value)) return value as CategorySortOption;
  return DEFAULT_SORT;
}

function parsePageParam(value: string | null): number {
  const next = Number(value);
  return Number.isInteger(next) && next >= 1 ? next : 1;
}

function parsePerPageParam(value: string | null): number {
  const n = parseInt(value ?? "", 10);
  if (Number.isInteger(n) && (VALID_PER_PAGE as readonly number[]).includes(n)) return n;
  return DEFAULT_PER_PAGE;
}

function parseArrayParam<T extends string>(
  value: string | null,
  validValues: readonly T[]
): T[] {
  if (!value) return [];
  const validSet = new Set<string>(validValues);
  return value.split(",").filter((s): s is T => validSet.has(s));
}

export function parseAdminCategoryListSearchParams(
  searchParams: RawSearchParams
): CategoryListFilters {
  const filters: CategoryListFilters = {};

  const rawSearch = toSingleString(searchParams.search);
  const search = rawSearch?.trim() || undefined;
  if (search) {
    filters.search = search;
  }

  const rawStatus = toSingleString(searchParams.status);
  const statusArray = parseArrayParam(rawStatus, VALID_STATUSES);
  if (statusArray.length > 0) {
    filters.status = statusArray;
  }

  const rawFeatured = toSingleString(searchParams.featured);
  const featuredArray = parseArrayParam(rawFeatured, VALID_FEATURED);
  if (featuredArray.length > 0) {
    filters.featured = featuredArray;
  }

  const rawSort = toSingleString(searchParams.sort);
  const sort = parseSortParam(rawSort);
  if (sort !== DEFAULT_SORT) {
    filters.sort = sort;
  }

  const rawPage = toSingleString(searchParams.page);
  const page = parsePageParam(rawPage);
  if (page > 1) {
    filters.page = page;
  }

  const rawPerPage = toSingleString(searchParams.perPage);
  const perPage = parsePerPageParam(rawPerPage);
  if (perPage !== DEFAULT_PER_PAGE) {
    filters.perPage = perPage;
  }

  return filters;
}
