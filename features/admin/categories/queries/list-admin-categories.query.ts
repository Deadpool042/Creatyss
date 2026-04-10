import { db } from "@/core/db";
import type { AdminCategorySummary } from "../types";

export async function listAdminCategories(): Promise<readonly AdminCategorySummary[]> {
  const categories = await db.category.findMany({
    where: {
      archivedAt: null,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isFeatured: true,
      sortOrder: true,
      updatedAt: true,
      parentId: true,
      parent: {
        select: {
          name: true,
        },
      },
      primaryImageId: true,
      primaryImage: {
        select: {
          publicUrl: true,
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    parentName: category.parent?.name ?? null,
    isFeatured: category.isFeatured,
    sortOrder: category.sortOrder,
    primaryImageUrl: category.primaryImage?.publicUrl ?? null,
    updatedAt: category.updatedAt.toISOString(),
  }));
}
