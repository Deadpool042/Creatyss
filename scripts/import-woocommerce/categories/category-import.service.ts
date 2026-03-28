import type { ImportWooCommerceEnv } from "../env";
import { importCategoryPrimaryImage } from "../media/media-import.service";
import type { WooCategory } from "../schemas";
import type { DbClient } from "../shared/db";
import { endProgress, logProgress } from "../shared/logging";
import { mapWooCategoryToImportedCategory } from "./category-mappers";
import {
  setCategoryParent,
  setCategoryPrimaryImage,
  upsertImportedCategory,
} from "./category.repository";

export type ImportedCategoryMap = Map<string, string>;

export type ImportCategoriesResult = {
  categoryIdByExternalId: ImportedCategoryMap;
  importedImages: number;
  reusedImages: number;
  skippedImages: number;
  failedImages: number;
};

function orderWooCategories(categories: readonly WooCategory[]): WooCategory[] {
  return [...categories].sort((left, right) => {
    if (left.menu_order !== right.menu_order) {
      return left.menu_order - right.menu_order;
    }

    return left.name.localeCompare(right.name, "fr");
  });
}

export async function importCategories(
  prisma: DbClient,
  input: {
    env: ImportWooCommerceEnv;
    storeId: string;
    categories: readonly WooCategory[];
    skipImages: boolean;
  }
): Promise<ImportCategoriesResult> {
  const orderedCategories = orderWooCategories(input.categories);
  const categoryIdByExternalId: ImportedCategoryMap = new Map();

  let importedImages = 0;
  let reusedImages = 0;
  let skippedImages = 0;
  let failedImages = 0;

  for (const [index, category] of orderedCategories.entries()) {
    logProgress(index + 1, orderedCategories.length, "Importing categories");

    const mappedCategory = mapWooCategoryToImportedCategory(category, index);
    const savedCategory = await upsertImportedCategory(prisma, input.storeId, mappedCategory);

    categoryIdByExternalId.set(mappedCategory.externalId, savedCategory.id);

    if (!input.skipImages) {
      const imageResult = await importCategoryPrimaryImage(prisma, {
        env: input.env,
        storeId: input.storeId,
        categoryId: savedCategory.id,
        categorySlug: mappedCategory.slug,
        image: mappedCategory.image,
      });

      importedImages += imageResult.importedImages;
      reusedImages += imageResult.reusedImages;
      skippedImages += imageResult.skippedImages;
      failedImages += imageResult.failedImages;

      if (imageResult.primaryImageId !== null) {
        await setCategoryPrimaryImage(prisma, savedCategory.id, imageResult.primaryImageId);
      }
    }
  }

  if (orderedCategories.length > 0) {
    endProgress(`Imported ${categoryIdByExternalId.size} categories`);
  }

  for (const [index, category] of orderedCategories.entries()) {
    logProgress(index + 1, orderedCategories.length, "Linking category hierarchy");

    const mappedCategory = mapWooCategoryToImportedCategory(category, index);
    const categoryId = categoryIdByExternalId.get(mappedCategory.externalId);

    if (!categoryId) {
      continue;
    }

    const parentId =
      mappedCategory.parentExternalId !== null
        ? (categoryIdByExternalId.get(mappedCategory.parentExternalId) ?? null)
        : null;

    await setCategoryParent(prisma, categoryId, parentId);
  }

  if (orderedCategories.length > 0) {
    endProgress("Linked category hierarchy");
  }

  return {
    categoryIdByExternalId,
    importedImages,
    skippedImages,
    failedImages,
    reusedImages,
  };
}
