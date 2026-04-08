import { db } from "@/core/db";
import { mapCategoryListItem } from "@/features/admin/categories/list/mappers/map-category-list-item";
import type { AdminCategoryCardItem } from "@/features/admin/categories/list/types/admin-category-card-item.types";

export async function listAdminCategories(): Promise<AdminCategoryCardItem[]> {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isFeatured: true,
      status: true,
      primaryImage: {
        select: {
          publicUrl: true,
          altText: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories.map(mapCategoryListItem);
}
