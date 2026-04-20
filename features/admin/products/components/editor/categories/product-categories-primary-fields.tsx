"use client";

import type { JSX } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryNode } from "@/features/admin/products/editor/types/product-categories.types";

type ProductCategoriesPrimaryFieldsProps = {
  rootCategories: CategoryNode[];
  primaryRootId: string;
  primaryChildValue: string;
  primaryRootChildren: CategoryNode[];
  rootCategorySentinel: string;
  error?: string | undefined;
  onPrimaryRootChange: (nextRootId: string) => void;
  onPrimaryChildChange: (nextValue: string) => void;
};

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
