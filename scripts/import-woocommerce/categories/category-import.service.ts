import type { ImportWooCommerceEnv } from "../env";
import { importCategoryPrimaryImage } from "../media/media-import.service";
import type { DbClient } from "../shared/db";
import type { WooCategory } from "../schemas";
import { mapWooCategoryToImportedCategory } from "./category-mappers";
import { createCategory, setCategoryParent, setCategoryPrimaryImage } from "./category.repository";

export type ImportedCategoryMap = Map<string, string>;

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
): Promise<ImportedCategoryMap> {
  const orderedCategories = orderWooCategories(input.categories);
  const categoryIdByExternalId: ImportedCategoryMap = new Map();

  for (const [index, category] of orderedCategories.entries()) {
    const mappedCategory = mapWooCategoryToImportedCategory(category, index);
    const createdCategory = await createCategory(prisma, input.storeId, mappedCategory);

    categoryIdByExternalId.set(mappedCategory.externalId, createdCategory.id);

    if (!input.skipImages && mappedCategory.image?.src) {
      const primaryImageId = await importCategoryPrimaryImage(prisma, {
        env: input.env,
        storeId: input.storeId,
        categoryId: createdCategory.id,
        categorySlug: mappedCategory.slug,
        image: mappedCategory.image,
      });

      if (primaryImageId !== null) {
        await setCategoryPrimaryImage(prisma, createdCategory.id, primaryImageId);
      }
    }
  }

  for (const [index, category] of orderedCategories.entries()) {
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

  return categoryIdByExternalId;
}
