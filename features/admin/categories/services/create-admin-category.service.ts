import { CategoryStatus } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db";
import { AdminCategoryServiceError } from "../types";
import { assertMediaAssetExists, assertParentCategoryExists } from "./shared";

type CreateAdminCategoryServiceInput = {
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  primaryImageId: string | null;
  isFeatured: boolean;
  sortOrder: number;
};

export async function createAdminCategory(input: CreateAdminCategoryServiceInput): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertParentCategoryExists(tx, input.parentId);
    await assertMediaAssetExists(tx, input.primaryImageId);

    const store = await tx.store.findFirst({
      where: {
        archivedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
      },
    });

    if (store === null) {
      throw new AdminCategoryServiceError("category_missing");
    }

    const existing = await tx.category.findFirst({
      where: {
        storeId: store.id,
        slug: input.slug,
        archivedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (existing !== null) {
      throw new AdminCategoryServiceError("category_slug_taken");
    }

    return tx.category.create({
      data: {
        storeId: store.id,
        code: input.slug,
        slug: input.slug,
        name: input.name,
        shortDescription: null,
        description: input.description,
        status: CategoryStatus.DRAFT,
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
