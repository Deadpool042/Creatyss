"use client";

import type { JSX } from "react";
import { Plus, Trash2 } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryNode } from "@/features/admin/products/editor/types";
import { buildCategoryPath } from "@/features/admin/products/editor/hooks";

type ProductCategoriesSummaryProps = Readonly<{
  linkedCount: number;
  primaryLabel: string;
}>;

type ProductCategoriesPrimaryFieldsProps = Readonly<{
  rootCategories: CategoryNode[];
  primaryRootId: string;
  primaryChildValue: string;
  primaryRootChildren: CategoryNode[];
  rootCategorySentinel: string;
  error?: string | undefined;
  onPrimaryRootChange: (nextRootId: string) => void;
  onPrimaryChildChange: (nextValue: string) => void;
}>;

type ProductCategoriesAddFieldsProps = Readonly<{
  rootCategories: CategoryNode[];
  categoryToAddRootId: string;
  categoryToAddChildId: string;
  addRootChildren: CategoryNode[];
  error?: string | undefined;
  onAddRootChange: (nextRootId: string) => void;
  onAddChildChange: (nextChildId: string) => void;
  onAddCategory: () => void;
}>;

type ProductCategoriesLinkedListProps = Readonly<{
  linkedCategories: CategoryNode[];
  linkedCategoryIds: string[];
  primaryCategoryId: string;
  childrenByParentId: Map<string, CategoryNode[]>;
  onRemoveCategory: (categoryId: string) => void;
}>;

export function ProductCategoriesSummary({
  linkedCount,
  primaryLabel,
}: ProductCategoriesSummaryProps): JSX.Element {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-border/60 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Catégories liées
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">
          {linkedCount} sélectionnées
        </p>
      </div>

      <div className="rounded-xl border border-border/60 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Catégorie principale
        </p>
        <p
          className={[
            "mt-1 text-sm font-medium",
            primaryLabel === "Aucune" ? "text-amber-600 dark:text-amber-400" : "text-foreground",
          ].join(" ")}
        >
          {primaryLabel}
        </p>
      </div>
    </div>
  );
}

export function ProductCategoriesPrimaryFields({
  rootCategories,
  primaryRootId,
  primaryChildValue,
  primaryRootChildren,
  rootCategorySentinel,
  error,
  onPrimaryRootChange,
  onPrimaryChildChange,
}: ProductCategoriesPrimaryFieldsProps): JSX.Element {
  return (
    <AdminFormField
      label="Catégorie principale"
      error={error}
      hint="La catégorie principale définit le classement principal de ce produit dans la boutique. Choisir la plus spécifique disponible."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Select value={primaryRootId} onValueChange={onPrimaryRootChange}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Choisir une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {rootCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {primaryRootChildren.length > 0 ? (
          <Select value={primaryChildValue} onValueChange={onPrimaryChildChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Choisir une sous-catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={rootCategorySentinel}>Catégorie parente</SelectItem>
              {primaryRootChildren.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div />
        )}
      </div>
    </AdminFormField>
  );
}

export function ProductCategoriesAddFields({
  rootCategories,
  categoryToAddRootId,
  categoryToAddChildId,
  addRootChildren,
  error,
  onAddRootChange,
  onAddChildChange,
  onAddCategory,
}: ProductCategoriesAddFieldsProps): JSX.Element {
  return (
    <AdminFormField
      label="Ajouter une catégorie"
      error={error}
      hint="La sélection d’une sous-catégorie associe automatiquement sa catégorie parente."
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <Select value={categoryToAddRootId} onValueChange={onAddRootChange}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Choisir une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {rootCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {addRootChildren.length > 0 ? (
          <Select value={categoryToAddChildId} onValueChange={onAddChildChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Choisir une sous-catégorie" />
            </SelectTrigger>
            <SelectContent>
              {addRootChildren.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div />
        )}

        <Button
          type="button"
          variant="outline"
          onClick={onAddCategory}
          disabled={!categoryToAddRootId}
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>
    </AdminFormField>
  );
}

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
                        Catégorie parente
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
