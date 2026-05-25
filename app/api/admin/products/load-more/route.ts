import { NextResponse, type NextRequest } from "next/server";

import { PRODUCT_FILTER_VALID_VALUES } from "@/features/admin/products/config";
import {
  listAdminProducts,
  type AdminProductsListView,
} from "@/features/admin/products/list/queries";
import { mapProductTableItem } from "@/features/admin/products/list/mappers";
import type {
  ProductFeaturedFilterValue,
  ProductSortOption,
  ProductTableStatus,
} from "@/features/admin/products/list/types/product-table.types";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";

function parseArray<T extends string>(value: string | null, valid: readonly T[]): T[] {
  if (!value) return [];
  return value.split(",").filter((item): item is T => valid.includes(item as T));
}

function parseStatus(value: string | null): ProductTableStatus[] {
  return parseArray(value, PRODUCT_FILTER_VALID_VALUES.statuses as readonly ProductTableStatus[]);
}

function parseFeatured(value: string | null): ProductFeaturedFilterValue[] {
  return parseArray(
    value,
    PRODUCT_FILTER_VALID_VALUES.featured.filter(
      (item): item is ProductFeaturedFilterValue => item !== "all"
    )
  );
}

function parseSort(value: string | null): ProductSortOption {
  return PRODUCT_FILTER_VALID_VALUES.sorts.includes(value as ProductSortOption)
    ? (value as ProductSortOption)
    : "updated-desc";
}

function parseView(value: string | null): AdminProductsListView {
  return value === "trash" ? "trash" : "active";
}

export async function GET(request: NextRequest) {
  await requireAuthenticatedAdmin();

  const url = new URL(request.url);
  const categoryParam = url.searchParams.get("categories") ?? url.searchParams.get("categoryId");
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const perPage = (PRODUCT_FILTER_VALID_VALUES.perPage as readonly number[]).includes(
    Number(url.searchParams.get("perPage"))
  )
    ? Number(url.searchParams.get("perPage"))
    : PRODUCT_FILTER_VALID_VALUES.perPageDefault;

  const result = await listAdminProducts({
    view: parseView(url.searchParams.get("view")),
    search: url.searchParams.get("search") ?? "",
    status: parseStatus(url.searchParams.get("status")),
    sort: parseSort(url.searchParams.get("sort")),
    page,
    perPage,
    ...(categoryParam ? { categoryIds: categoryParam.split(",").filter(Boolean) } : {}),
    featured: parseFeatured(url.searchParams.get("featured")),
  });

  return NextResponse.json(
    {
      items: result.items.map(mapProductTableItem),
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    },
    { headers: { "cache-control": "no-store" } }
  );
}
