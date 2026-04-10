import { db } from "@/core/db";
import type { AdminCategoryDetail } from "../types";

type GetAdminCategoryDetailInput = {
  categoryId: string;
};

export async function getAdminCategoryDetail(
  input: GetAdminCategoryDetailInput
): Promise<AdminCategoryDetail | null> {
  const category = await db.category.findFirst({
    where: {
      id: input.categoryId,
      archivedAt: null,
    },
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

  if (category === null) {
    return null;
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    parentName: category.parent?.name ?? null,
    isFeatured: category.isFeatured,
    sortOrder: category.sortOrder,
    primaryImageId: category.primaryImageId,
    primaryImageUrl: category.primaryImage?.publicUrl ?? null,
    updatedAt: category.updatedAt.toISOString(),
  };
}
