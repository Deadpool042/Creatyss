import { db } from "@/core/db";

export type AdminOrderSettings = {
  id: string;
  orderNumberPrefix: string | null;
};

export async function getAdminOrderSettings(): Promise<AdminOrderSettings | null> {
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      orderNumberPrefix: true,
    },
  });

  if (!store) return null;

  return {
    id: store.id,
    orderNumberPrefix: store.orderNumberPrefix ?? null,
  };
}
