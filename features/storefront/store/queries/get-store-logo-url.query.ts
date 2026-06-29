import { db } from "@/core/db";

export async function getStoreLogo(): Promise<{ name: string; logoUrl: string | null }> {
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      name: true,
      logoImage: { select: { publicUrl: true } },
    },
  });

  return {
    name: store?.name ?? "",
    logoUrl: store?.logoImage?.publicUrl ?? null,
  };
}
