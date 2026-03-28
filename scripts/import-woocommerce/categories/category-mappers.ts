import type { WooCategory } from "../schemas";
import { buildStableCode, slugify } from "../normalizers/slug";
import { toNullableText } from "../normalizers/text";
import { normalizeCategoryStatus } from "../normalizers/status";
import type { ImportedCategoryInput } from "./category.types";

export function mapWooCategoryToImportedCategory(
  category: WooCategory,
  sortOrder: number
): ImportedCategoryInput {
  const slug = slugify(category.slug || category.name);

  return {
    externalId: `woo_category:${category.id}`,
    parentExternalId: category.parent > 0 ? `woo_category:${category.parent}` : null,
    code: buildStableCode("woo_cat", category.slug || category.name, category.id),
    slug,
    name: category.name.trim(),
    shortDescription: null,
    description: toNullableText(category.description),
    status: normalizeCategoryStatus("publish"),
    sortOrder,
    isFeatured: false,
    publishedAt: new Date(),
    image: category.image ?? null,
  };
}
