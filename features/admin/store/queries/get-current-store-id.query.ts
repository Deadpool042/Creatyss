import "server-only";

import { db } from "@/core/db";

export async function getCurrentStoreId(): Promise<string | null> {
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  return store?.id ?? null;
}
