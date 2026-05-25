import { NextResponse, type NextRequest } from "next/server";

import { CATEGORY_FILTER_VALID_VALUES } from "@/features/admin/categories/config";
import { listAdminCategories } from "@/features/admin/categories/queries";
import type {
  CategoryFeaturedFilter,
  CategorySortOption,
} from "@/features/admin/categories/list";
import type { AdminCategoryStatus } from "@/features/admin/categories/types";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";

function parseArray<T extends string>(value: string | null, valid: readonly T[]): T[] {
  if (!value) return [];
  return value.split(",").filter((item): item is T => valid.includes(item as T));
}

function parseStatus(value: string | null): AdminCategoryStatus[] {
  return parseArray(value, CATEGORY_FILTER_VALID_VALUES.statuses as readonly AdminCategoryStatus[]);
}

function parseFeatured(value: string | null): CategoryFeaturedFilter[] {
  return parseArray(value, CATEGORY_FILTER_VALID_VALUES.featured as readonly CategoryFeaturedFilter[]);
}

function parseSort(value: string | null): CategorySortOption {
  return CATEGORY_FILTER_VALID_VALUES.sorts.includes(value as CategorySortOption)
    ? (value as CategorySortOption)
    : "name-asc";
}

export async function GET(request: NextRequest) {
  await requireAuthenticatedAdmin();

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const perPage = (CATEGORY_FILTER_VALID_VALUES.perPage as readonly number[]).includes(
    Number(url.searchParams.get("perPage"))
  )
    ? Number(url.searchParams.get("perPage"))
    : CATEGORY_FILTER_VALID_VALUES.perPageDefault;

  const result = await listAdminCategories({
    search: url.searchParams.get("search") ?? "",
    status: parseStatus(url.searchParams.get("status")),
    featured: parseFeatured(url.searchParams.get("featured")),
    categorySlugs: (url.searchParams.get("categories") ?? "")
      .split(",")
      .filter(Boolean),
    sort: parseSort(url.searchParams.get("sort")),
    page,
    perPage,
  });

  return NextResponse.json(
    {
      items: result.items,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    },
    { headers: { "cache-control": "no-store" } }
  );
}
