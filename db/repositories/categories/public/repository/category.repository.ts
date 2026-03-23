import { mapCategoryDetail, mapCategorySummary } from "@db-categories/helpers/mappers";
import { normalizeCategorySlug } from "@db-categories/helpers/validation";
import {
  findActiveCategoryDetailRowBySlug,
  findCategoryDetailRowById,
  listActiveCategorySummaryRowsByStoreId,
} from "@db-categories/queries/public-category.queries";
import type {
  CategoryDetail,
  CategorySummary,
  CategoryTreeNode,
} from "@db-categories/public/types/category.types";

function buildCategoryTree(categories: CategorySummary[]): CategoryTreeNode[] {
  const nodes = new Map<string, CategoryTreeNode>(
    categories.map((category) => [category.id, { ...category, children: [] }])
  );
  const roots: CategoryTreeNode[] = [];

  for (const category of categories) {
    const node = nodes.get(category.id);

    if (!node) {
      continue;
    }

    if (category.parentId) {
      const parent = nodes.get(category.parentId);

      if (parent) {
        parent.children.push(node);
        continue;
      }
    }

    roots.push(node);
  }

  const sortNodes = (items: CategoryTreeNode[]) => {
    items.sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.name.localeCompare(right.name, "fr");
    });

    for (const item of items) {
      sortNodes(item.children);
    }
  };

  sortNodes(roots);

  return roots;
}

export async function findCategoryById(id: string): Promise<CategoryDetail | null> {
  const row = await findCategoryDetailRowById(id);
  return row ? mapCategoryDetail(row) : null;
}

export async function findActiveCategoryBySlug(
  storeId: string,
  slug: string
): Promise<CategoryDetail | null> {
  const row = await findActiveCategoryDetailRowBySlug(storeId, normalizeCategorySlug(slug));
  return row ? mapCategoryDetail(row) : null;
}

export async function listActiveCategoriesByStoreId(storeId: string): Promise<CategorySummary[]> {
  const rows = await listActiveCategorySummaryRowsByStoreId(storeId);
  return rows.map(mapCategorySummary);
}

export async function listActiveCategoryTreeByStoreId(storeId: string): Promise<CategoryTreeNode[]> {
  const categories = await listActiveCategoriesByStoreId(storeId);
  return buildCategoryTree(categories);
}
