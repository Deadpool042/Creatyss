"use client";

import type { JSX } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CategoryNode } from "@/features/admin/products/editor/types/product-categories.types";
import { buildCategoryPath } from "@/features/admin/products/editor/hooks/use-product-categories-manager";

type ProductCategoriesLinkedListProps = {
  linkedCategories: CategoryNode[];
  linkedCategoryIds: string[];
  primaryCategoryId: string;
  childrenByParentId: Map<string, CategoryNode[]>;
  onRemoveCategory: (categoryId: string) => void;
};

export function ProductCategoriesLinkedList({
  linkedCategories,
  linkedCategoryIds,
  primaryCategoryId,
  childrenByParentId,
  onRemoveCategory,
}: ProductCategoriesLinkedListProps): JSX.Element {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">Catégories liées</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Le retrait d’une catégorie parente retire également ses sous-catégories liées.
        </p>
      </div>

      {linkedCategories.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground">
          Aucune catégorie liée pour le moment.
        </div>
      ) : (
        <div className="space-y-2">
          {linkedCategories.map((category) => {
            const isPrimary = primaryCategoryId === category.id;
            const hasLinkedChildren =
              category.parentId === null &&
              (childrenByParentId.get(category.id) ?? []).some((child) =>
                linkedCategoryIds.includes(child.id)
              );

            return (
              <div
                key={category.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {buildCategoryPath(category)}
                    </p>

                    {isPrimary ? (
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                        Principale
                      </span>
                    ) : null}

                    {category.parentId === null ? (
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                        Catégorie générale
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">{category.slug}</p>

                  {hasLinkedChildren ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Des sous-catégories liées dépendent de cette catégorie.
                    </p>
                  ) : null}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveCategory(category.id)}
                  disabled={isPrimary && linkedCategories.length === 1}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Retirer
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
