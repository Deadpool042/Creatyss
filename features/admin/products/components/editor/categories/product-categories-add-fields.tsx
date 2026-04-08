"use client";

import type { JSX } from "react";
import { Plus } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryNode } from "@/features/admin/products/editor/types/product-categories.types";

type ProductCategoriesAddFieldsProps = {
  rootCategories: CategoryNode[];
  categoryToAddRootId: string;
  categoryToAddChildId: string;
  addRootChildren: CategoryNode[];
  error?: string | undefined;
  onAddRootChange: (nextRootId: string) => void;
  onAddChildChange: (nextChildId: string) => void;
  onAddCategory: () => void;
};

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
