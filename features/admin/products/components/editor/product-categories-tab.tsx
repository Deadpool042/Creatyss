"use client";

import { useActionState, useMemo, useState, type JSX } from "react";

import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import type {
  AdminProductEditorCategoryLink,
  AdminProductEditorData,
} from "@/features/admin/products/editor/public";
import { useProductCategoriesManager } from "@/features/admin/products/editor/hooks";
import type { ProductCategoryOption } from "@/features/admin/products/editor/types/product-categories.types";
import {
  productCategoriesFormInitialState,
  type ProductCategoriesFormAction,
} from "@/features/admin/products/editor/types";
import {
  ProductCategoriesAddFields,
  ProductCategoriesLinkedList,
  ProductCategoriesPrimaryFields,
  ProductCategoriesSummary,
} from "./categories";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";

type ProductCategoriesTabProps = {
  action: ProductCategoriesFormAction;
  product: AdminProductEditorData;
  availableCategories: ProductCategoryOption[];
};

type ProductCategoriesTabInnerProps = ProductCategoriesTabProps & {
  onReset: () => void;
};

function ProductCategoriesTabInner({
  action,
  product,
  availableCategories,
  onReset,
}: ProductCategoriesTabInnerProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, productCategoriesFormInitialState);

  const initialCategoryIds = useMemo(
    () =>
      product.product.categoryLinks.map((link: AdminProductEditorCategoryLink) => link.categoryId),
    [product.product.categoryLinks]
  );

  const initialPrimaryCategoryId = useMemo(
    () =>
      product.product.categoryLinks.find((link: AdminProductEditorCategoryLink) => link.isPrimary)
        ?.categoryId ?? null,
    [product.product.categoryLinks]
  );

  const initialSortOrders = useMemo(() => {
    const result: Record<string, number> = {};

    for (const link of product.product.categoryLinks as AdminProductEditorCategoryLink[]) {
      result[link.categoryId] = link.sortOrder;
    }

    return result;
  }, [product.product.categoryLinks]);

  const manager = useProductCategoriesManager({
    availableCategories,
    initialCategoryIds,
    initialPrimaryCategoryId,
  });

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <input type="hidden" name="productId" value={product.product.id} />

      {manager.linkedCategoryIds.map((categoryId) => (
        <input key={categoryId} type="hidden" name="categoryIds" value={categoryId} />
      ))}

      {manager.linkedCategoryIds.map((categoryId) => (
        <input
          key={`sort-${categoryId}`}
          type="hidden"
          name={`categorySortOrder:${categoryId}`}
          value={String(initialSortOrders[categoryId] ?? 0)}
        />
      ))}

      {manager.primaryCategoryId ? (
        <input type="hidden" name="categoryPrimaryIds" value={manager.primaryCategoryId} />
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-28.25 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:pt-29.25 md:pt-30.25 [@media(max-height:480px)]:pt-25.25 [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pt-17.25 lg:pb-14">
        <div className="w-full space-y-5 px-4 pt-4 pb-4 md:space-y-8 md:px-6 md:pt-6 md:pb-6 lg:mx-auto lg:max-w-3xl lg:px-4 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:pt-3 [@media(max-height:480px)]:pb-3">
          <AdminFormMessage
            tone={state.status === "error" ? "error" : "success"}
            message={state.status !== "idle" ? state.message : null}
          />

          <AdminFormSection
            title="Catégories"
            description="Associer ce produit à une ou plusieurs catégories du catalogue et définir la catégorie principale la plus précise."
          >
            <ProductCategoriesSummary
              linkedCount={manager.linkedCategoryIds.length}
              primaryLabel={manager.primaryCategorySummary}
            />

            <ProductCategoriesPrimaryFields
              rootCategories={manager.rootCategories}
              primaryRootId={manager.primaryRootId}
              primaryChildValue={manager.primaryChildValue}
              primaryRootChildren={manager.primaryRootChildren}
              rootCategorySentinel={manager.rootCategorySentinel}
              error={state.fieldErrors.primaryCategoryId}
              onPrimaryRootChange={manager.handlePrimaryRootChange}
              onPrimaryChildChange={manager.handlePrimaryChildChange}
            />

            <ProductCategoriesAddFields
              rootCategories={manager.rootCategories}
              categoryToAddRootId={manager.categoryToAddRootId}
              categoryToAddChildId={manager.categoryToAddChildId}
              addRootChildren={manager.addRootChildren}
              error={state.fieldErrors.categoryIds}
              onAddRootChange={manager.handleAddRootChange}
              onAddChildChange={manager.handleAddChildChange}
              onAddCategory={manager.handleAddCategory}
            />

            <ProductCategoriesLinkedList
              linkedCategories={manager.linkedCategories}
              linkedCategoryIds={manager.linkedCategoryIds}
              primaryCategoryId={manager.primaryCategoryId}
              childrenByParentId={manager.childrenByParentId}
              onRemoveCategory={manager.handleRemoveCategory}
            />
          </AdminFormSection>
        </div>
      </div>

      <AdminFormFooter
        actionsClassName="w-full justify-between gap-2 sm:w-auto sm:justify-end"
        className={[
          "bottom-[calc(3.5rem+env(safe-area-inset-bottom))]",
          "[@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom))]",
          "lg:bottom-0",
        ].join(" ")}
        overlay
      >
        <Button
          variant="ghost"
          type="button"
          size="xs"
          className="h-8 rounded-full px-4 text-muted-foreground hover:text-foreground lg:h-9"
          onClick={onReset}
        >
          Réinitialiser
        </Button>

        <Button
          type="submit"
          variant="outline"
          size="xs"
          className="h-8 w-fit rounded-full border-shell-border px-4 text-foreground shadow-none sm:flex-none lg:h-9"
          disabled={pending}
        >
          {pending ? "Mise à jour…" : "Enregistrer"}
        </Button>
      </AdminFormFooter>
    </form>
  );
}

export function ProductCategoriesTab(props: ProductCategoriesTabProps): JSX.Element {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  return (
    <ProductCategoriesTabInner
      key={formInstanceKey}
      {...props}
      onReset={() => setFormInstanceKey((current) => current + 1)}
    />
  );
}

export type { ProductCategoryOption } from "@/features/admin/products/editor/types/product-categories.types";
