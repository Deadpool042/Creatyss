import { db } from "@/core/db";

export async function listAdminProductTypeOptions(input: { storeId: string }) {
  return db.productType.findMany({
    where: {
      storeId: input.storeId,
      archivedAt: null,
    },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      slug: true,
      isActive: true,
    },
  });
}
