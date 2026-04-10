import { NextResponse } from "next/server";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getAdminProductsFeedPage } from "@/features/admin/products/list/queries/get-admin-products-feed-page.query";

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export async function GET(request: Request) {
  await requireAuthenticatedAdmin();

  const url = new URL(request.url);
  const limit = parsePositiveInt(url.searchParams.get("limit"), 12);
  const cursor = url.searchParams.get("cursor");
  const search = url.searchParams.get("search")?.trim() ?? "";

  const result = await getAdminProductsFeedPage({
    limit,
    cursor,
    search: search.length > 0 ? search : null,
    status: [],
    categoryId: null,
    featured: null,
    sort: "updated-desc",
  });

  return NextResponse.json(result);
}
