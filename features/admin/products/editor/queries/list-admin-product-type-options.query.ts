import { db } from "@/core/db";

export async function listAdminProductTypeOptions() {
  return db.productType.findMany({
    where: {
      archivedAt: null,
      store: { isProduction: true },
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
