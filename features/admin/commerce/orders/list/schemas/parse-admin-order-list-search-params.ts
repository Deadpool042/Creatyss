import { ORDER_STATUS_FILTERS } from "@/features/admin/commerce/orders/config/order-list.config";
import type { OrderStatus } from "@/entities/order/order-status-transition";

import type {
  AdminOrderListFilters,
  AdminOrderListSort,
} from "../types/admin-order-list.types";

type RawSearchParams = Record<string, string | string[] | undefined>;

const VALID_SORTS: readonly AdminOrderListSort[] = [
  "created-desc",
  "created-asc",
  "updated-desc",
  "updated-asc",
];

const DEFAULT_SORT: AdminOrderListSort = "created-desc";

function toSingleString(value: string | string[] | undefined): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? null;
  return null;
}

function parseStatusParam(value: string | null): readonly OrderStatus[] {
  if (!value) return [];
  const validSet = new Set<string>(ORDER_STATUS_FILTERS);
  return value
    .split(",")
    .filter((s): s is OrderStatus => validSet.has(s));
}

function parseSortParam(value: string | null): AdminOrderListSort {
  const validSet = new Set<string>(VALID_SORTS);
  if (value && validSet.has(value)) return value as AdminOrderListSort;
  return DEFAULT_SORT;
}

function parsePageParam(value: string | null): number {
  const next = Number(value);
  return Number.isInteger(next) && next >= 1 ? next : 1;
}

export function parseAdminOrderListSearchParams(
  searchParams: RawSearchParams
): AdminOrderListFilters {
  const filters: AdminOrderListFilters = {};

  const rawSearch = toSingleString(searchParams.search);
  const search = rawSearch?.trim() || undefined;
  if (search) {
    filters.search = search;
  }

  const rawStatus = toSingleString(searchParams.status);
  const statusArray = parseStatusParam(rawStatus);
  if (statusArray.length > 0) {
    filters.status = statusArray;
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
  if (rawPerPage !== null) {
    const perPage = Math.max(1, Math.min(100, parseInt(rawPerPage, 10) || 20));
    filters.perPage = perPage;
  }

  return filters;
}
