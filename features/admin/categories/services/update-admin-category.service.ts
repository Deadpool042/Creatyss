import { withTransaction } from "@/core/db";
import { AdminCategoryServiceError } from "../types";
import { assertCategoryExists, assertMediaAssetExists, assertParentCategoryExists } from "./shared";

type UpdateAdminCategoryServiceInput = {
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  primaryImageId: string | null;
  isFeatured: boolean;
  sortOrder: number;
};

export async function updateAdminCategory(input: UpdateAdminCategoryServiceInput): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertCategoryExists(tx, input.categoryId);
    await assertParentCategoryExists(tx, input.parentId);
    await assertMediaAssetExists(tx, input.primaryImageId);

    if (input.parentId === input.categoryId) {
      throw new AdminCategoryServiceError("invalid_parent_assignment");
    }

    const existing = await tx.category.findFirst({
      where: {
        slug: input.slug,
        archivedAt: null,
        id: {
          not: input.categoryId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existing !== null) {
      throw new AdminCategoryServiceError("category_slug_taken");
    }

    return tx.category.update({
      where: {
        id: input.categoryId,
      },
      data: {
        code: input.slug,
        slug: input.slug,
        name: input.name,
        description: input.description,
        parentId: input.parentId,
        primaryImageId: input.primaryImageId,
        isFeatured: input.isFeatured,
        sortOrder: input.sortOrder,
      },
      select: {
        id: true,
      },
    });
  });
}
