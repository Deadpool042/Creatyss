import { db } from "@/core/db";
import { mapProductFilterCategoryOption } from "@/features/admin/products/list/mappers";
import type { ProductFilterCategoryOption } from "@/features/admin/products/list/types";

export async function listProductFilterCategories(): Promise<ProductFilterCategoryOption[]> {
  const categories = await db.category.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      slug: true,
      name: true,
      parentId: true,
      parent: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return categories.map(mapProductFilterCategoryOption);
}
