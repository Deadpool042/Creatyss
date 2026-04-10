import { db } from "@/core/db";
import type { ProductFilterCategoryOption } from "../types";

export async function listProductFilterCategories(): Promise<ProductFilterCategoryOption[]> {
  const categories = await db.category.findMany({
    where: {
      archivedAt: null,
      status: {
        in: ["ACTIVE", "DRAFT", "INACTIVE"],
      },
    },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true,
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentId: category.parentId,
    productCount: 0,
  }));
}
