import { NextResponse } from "next/server";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getAdminProductsFeed } from "@/features/admin/products/server";
import { productFeedCursorSchema } from "@/features/products/types";

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

  const cursorUpdatedAt = url.searchParams.get("cursorUpdatedAt");
  const cursorId = url.searchParams.get("cursorId");

  const cursor =
    cursorUpdatedAt && cursorId
      ? productFeedCursorSchema.parse({
          updatedAt: cursorUpdatedAt,
          id: cursorId,
        })
      : null;

  const limit = parsePositiveInt(url.searchParams.get("limit"), 12);
  const search = url.searchParams.get("search")?.trim() ?? "";

  const result = await getAdminProductsFeed({
    limit,
    cursor,
    ...(search.length > 0 ? { search } : {}),
  });

  return NextResponse.json(result);
}
