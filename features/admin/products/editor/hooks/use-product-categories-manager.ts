"use client";

import { useMemo, useState } from "react";

import type {
  CategoryNode,
  ProductCategoryOption,
} from "@/features/admin/products/editor/types/product-categories.types";

const ROOT_CATEGORY_SENTINEL = "__root__";

function buildCategoryPath(category: ProductCategoryOption): string {
  if (category.parentName && category.parentName.trim().length > 0) {
    return `${category.parentName} > ${category.name}`;
  }

  return category.name;
}

function sortCategoriesByPath(left: CategoryNode, right: CategoryNode): number {
  return buildCategoryPath(left).localeCompare(buildCategoryPath(right), "fr");
}

type UseProductCategoriesManagerInput = {
  availableCategories: ProductCategoryOption[];
  initialCategoryIds: string[];
  initialPrimaryCategoryId: string | null;
};

type UseProductCategoriesManagerResult = {
  linkedCategoryIds: string[];
  primaryCategoryId: string;
  primaryCategorySummary: string;
  rootCategories: CategoryNode[];
  primaryRootId: string;
  primaryChildValue: string;
  primaryRootChildren: CategoryNode[];
  categoryToAddRootId: string;
  categoryToAddChildId: string;
  addRootChildren: CategoryNode[];
  linkedCategories: CategoryNode[];
  childrenByParentId: Map<string, CategoryNode[]>;
  rootCategorySentinel: string;
  handlePrimaryRootChange: (nextRootId: string) => void;
  handlePrimaryChildChange: (nextValue: string) => void;
  handleAddRootChange: (nextRootId: string) => void;
  handleAddChildChange: (nextChildId: string) => void;
  handleAddCategory: () => void;
  handleRemoveCategory: (categoryId: string) => void;
};

export function useProductCategoriesManager(
  input: UseProductCategoriesManagerInput
): UseProductCategoriesManagerResult {
  const categories = useMemo<CategoryNode[]>(() => {
    return input.availableCategories
      .filter((category) => category.slug !== "tout")
      .sort(sortCategoriesByPath);
  }, [input.availableCategories]);

  const categoriesById = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category]));
  }, [categories]);

  const rootCategories = useMemo(() => {
    return categories.filter((category) => category.parentId === null).sort(sortCategoriesByPath);
  }, [categories]);

  const childrenByParentId = useMemo(() => {
    const map = new Map<string, CategoryNode[]>();

    for (const category of categories) {
      if (!category.parentId) {
        continue;
      }

      const current = map.get(category.parentId) ?? [];
      current.push(category);
      map.set(category.parentId, current);
    }

    for (const [key, value] of map.entries()) {
      map.set(key, value.sort(sortCategoriesByPath));
    }

    return map;
  }, [categories]);

  const [linkedCategoryIds, setLinkedCategoryIds] = useState<string[]>(input.initialCategoryIds);
  const [primaryCategoryId, setPrimaryCategoryId] = useState<string>(input.initialPrimaryCategoryId ?? "");

  const initialPrimary = useMemo(() => {
    return input.initialPrimaryCategoryId
      ? (categories.find((category) => category.id === input.initialPrimaryCategoryId) ?? null)
      : null;
  }, [categories, input.initialPrimaryCategoryId]);

  const [primaryRootId, setPrimaryRootId] = useState<string>(
    initialPrimary ? (initialPrimary.parentId ?? initialPrimary.id) : ""
  );
  const [primaryChildValue, setPrimaryChildValue] = useState<string>(() => {
    if (!initialPrimary) {
      return "";
    }

    return initialPrimary.parentId ? initialPrimary.id : ROOT_CATEGORY_SENTINEL;
  });

  const [categoryToAddRootId, setCategoryToAddRootId] = useState<string>("");
  const [categoryToAddChildId, setCategoryToAddChildId] = useState<string>("");

  const linkedCategories = useMemo(() => {
    return linkedCategoryIds
      .map((categoryId) => categoriesById.get(categoryId) ?? null)
      .filter((category): category is CategoryNode => category !== null)
      .sort((left, right) => {
        if (left.id === primaryCategoryId && right.id !== primaryCategoryId) {
          return -1;
        }

        if (right.id === primaryCategoryId && left.id !== primaryCategoryId) {
          return 1;
        }

        if (left.parentId === null && right.parentId !== null) {
          return -1;
        }

        if (right.parentId === null && left.parentId !== null) {
          return 1;
        }

        return sortCategoriesByPath(left, right);
      });
  }, [categoriesById, linkedCategoryIds, primaryCategoryId]);

  const primaryRootChildren = useMemo(() => {
    if (!primaryRootId) {
      return [];
    }

    return childrenByParentId.get(primaryRootId) ?? [];
  }, [childrenByParentId, primaryRootId]);

  const addRootChildren = useMemo(() => {
    if (!categoryToAddRootId) {
      return [];
    }

    return childrenByParentId.get(categoryToAddRootId) ?? [];
  }, [childrenByParentId, categoryToAddRootId]);

  function syncPrimaryAfterLinkedChange(nextLinkedIds: string[]): void {
    if (nextLinkedIds.length === 0) {
      setPrimaryCategoryId("");
      setPrimaryRootId("");
      setPrimaryChildValue("");
      return;
    }

    if (primaryCategoryId && nextLinkedIds.includes(primaryCategoryId)) {
      const keptPrimary = categoriesById.get(primaryCategoryId) ?? null;

      if (keptPrimary) {
        setPrimaryRootId(keptPrimary.parentId ?? keptPrimary.id);
        setPrimaryChildValue(keptPrimary.parentId ? keptPrimary.id : ROOT_CATEGORY_SENTINEL);
      }

      return;
    }

    const fallbackCategory =
      nextLinkedIds
        .map((id) => categoriesById.get(id) ?? null)
        .filter((category): category is CategoryNode => category !== null)
        .sort((left, right) => {
          if (left.parentId !== null && right.parentId === null) {
            return -1;
          }

          if (right.parentId !== null && left.parentId === null) {
            return 1;
          }

          return sortCategoriesByPath(left, right);
        })[0] ?? null;

    if (!fallbackCategory) {
      setPrimaryCategoryId("");
      setPrimaryRootId("");
      setPrimaryChildValue("");
      return;
    }

    setPrimaryCategoryId(fallbackCategory.id);
    setPrimaryRootId(fallbackCategory.parentId ?? fallbackCategory.id);
    setPrimaryChildValue(fallbackCategory.parentId ? fallbackCategory.id : ROOT_CATEGORY_SENTINEL);
  }

  function ensureLinked(categoryIdsToEnsure: string[]): void {
    setLinkedCategoryIds((current) => {
      const next = new Set(current);

      for (const categoryId of categoryIdsToEnsure) {
        if (categoryId.trim().length > 0) {
          next.add(categoryId);
        }
      }

      return Array.from(next);
    });
  }

  function handlePrimaryRootChange(nextRootId: string): void {
    setPrimaryRootId(nextRootId);
    setPrimaryChildValue(ROOT_CATEGORY_SENTINEL);
    setPrimaryCategoryId(nextRootId);
    ensureLinked([nextRootId]);
  }

  function handlePrimaryChildChange(nextValue: string): void {
    setPrimaryChildValue(nextValue);

    if (nextValue === ROOT_CATEGORY_SENTINEL) {
      setPrimaryCategoryId(primaryRootId);
      ensureLinked(primaryRootId ? [primaryRootId] : []);
      return;
    }

    setPrimaryCategoryId(nextValue);
    ensureLinked(primaryRootId ? [primaryRootId, nextValue] : [nextValue]);
  }

  function handleAddRootChange(nextRootId: string): void {
    setCategoryToAddRootId(nextRootId);
    setCategoryToAddChildId("");
  }

  function handleAddChildChange(nextChildId: string): void {
    setCategoryToAddChildId(nextChildId);
  }

  function handleAddCategory(): void {
    if (!categoryToAddRootId) {
      return;
    }

    const idsToAdd = categoryToAddChildId
      ? [categoryToAddRootId, categoryToAddChildId]
      : [categoryToAddRootId];

    ensureLinked(idsToAdd);

    if (primaryCategoryId.trim().length === 0) {
      const nextPrimaryId = categoryToAddChildId || categoryToAddRootId;
      setPrimaryCategoryId(nextPrimaryId);
      setPrimaryRootId(categoryToAddRootId);
      setPrimaryChildValue(categoryToAddChildId || ROOT_CATEGORY_SENTINEL);
    }

    setCategoryToAddRootId("");
    setCategoryToAddChildId("");
  }

  function handleRemoveCategory(categoryId: string): void {
    const category = categoriesById.get(categoryId);

    if (!category) {
      return;
    }

    const nextLinked = new Set(linkedCategoryIds);

    if (category.parentId === null) {
      nextLinked.delete(category.id);

      const children = childrenByParentId.get(category.id) ?? [];
      for (const child of children) {
        nextLinked.delete(child.id);
      }
    } else {
      nextLinked.delete(category.id);
    }

    const nextLinkedIds = Array.from(nextLinked);
    setLinkedCategoryIds(nextLinkedIds);
    syncPrimaryAfterLinkedChange(nextLinkedIds);
  }

  const primaryCategorySummary = primaryCategoryId
    ? buildCategoryPath(
        categoriesById.get(primaryCategoryId) ?? {
          id: "",
          name: "",
          slug: "",
          parentId: null,
          parentName: null,
        }
      )
    : "Aucune";

  return {
    linkedCategoryIds,
    primaryCategoryId,
    primaryCategorySummary,
    rootCategories,
    primaryRootId,
    primaryChildValue,
    primaryRootChildren,
    categoryToAddRootId,
    categoryToAddChildId,
    addRootChildren,
    linkedCategories,
    childrenByParentId,
    rootCategorySentinel: ROOT_CATEGORY_SENTINEL,
    handlePrimaryRootChange,
    handlePrimaryChildChange,
    handleAddRootChange,
    handleAddChildChange,
    handleAddCategory,
    handleRemoveCategory,
  };
}

export { buildCategoryPath };
