"use client";

import { useActionState, useMemo, useState, type JSX } from "react";

import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { Button } from "@/components/ui/button";
import {
  productCategoriesFormInitialState,
  type AdminProductEditorCategoryLink,
  type AdminProductEditorData,
  type ProductCategoryOption,
  type ProductCategoriesFormAction,
} from "@/features/admin/products/editor/types";
import { useProductCategoriesManager } from "@/features/admin/products/editor/hooks";
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared/product-section-eyebrow";
import {
  ProductCategoriesAddFields,
  ProductCategoriesLinkedList,
  ProductCategoriesPrimaryFields,
  ProductCategoriesSummary,
} from "./categories/product-categories-fields";
import { PRODUCT_EDITOR_TAB_LAYOUT_CLASSNAME } from "@/features/admin/products/components/shared/product-module-page-shell";

type ProductCategoriesTabProps = {
  action: ProductCategoriesFormAction;
  product: AdminProductEditorData;
  availableCategories: ProductCategoryOption[];
};

type ProductCategoriesTabInnerProps = ProductCategoriesTabProps & {
  onReset: () => void;
};

type ProductCategoriesSectionIntroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

function ProductCategoriesSectionIntro({
  eyebrow,
  title,
  description,
}: ProductCategoriesSectionIntroProps): JSX.Element {
  return (
    <div className="grid gap-1.5">
      <ProductSectionEyebrow>{eyebrow}</ProductSectionEyebrow>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

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
  const linkedCountLabel =
    manager.linkedCategoryIds.length === 0
      ? "Aucune catégorie liée"
      : manager.linkedCategoryIds.length === 1
        ? "1 catégorie liée"
        : `${manager.linkedCategoryIds.length} catégories liées`;

  return (
    <form action={formAction} className="relative">
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

      <div className="pb-[calc(7rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-14">
        <div className={PRODUCT_EDITOR_TAB_LAYOUT_CLASSNAME}>
          <div className="min-w-0 space-y-5 md:space-y-6">
            <AdminFormMessage
              tone={state.status === "error" ? "error" : "success"}
              message={state.status !== "idle" ? state.message : null}
            />

            <div className="divide-y divide-surface-border/40">
              <section className="grid gap-6 py-6 first:pt-0">
                <ProductCategoriesSectionIntro
                  eyebrow="Navigation boutique"
                  title="Catégories"
                  description="Les catégories déterminent où le produit apparaît. La catégorie principale doit rester la plus spécifique et la plus représentative."
                />

                <ProductCategoriesSummary
                  linkedCount={manager.linkedCategoryIds.length}
                  primaryLabel={manager.primaryCategorySummary}
                />
              </section>

              <section className="grid gap-6 py-6">
                <ProductCategoriesSectionIntro
                  eyebrow="Catégorie principale"
                  title="Ancrage principal"
                  description="Choisissez la catégorie qui porte le mieux la lecture du produit dans la boutique et pour le référencement."
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
              </section>

              <section className="grid gap-6 py-6">
                <ProductCategoriesSectionIntro
                  eyebrow="Liaisons"
                  title="Ajouter ou retirer"
                  description="Ajoutez seulement les catégories réellement utiles pour garder une structure de boutique claire."
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
              </section>
            </div>
          </div>

          <aside className="min-w-0 xl:sticky xl:top-6">
            <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/80">
              <section className="grid gap-4 px-5 py-5">
                <ProductCategoriesSectionIntro
                  eyebrow="Repères"
                  title="Lecture catégories"
                />

                <div className="divide-y divide-surface-border">
                  <div className="grid gap-1.5 py-3 first:pt-0">
                    <ProductSectionEyebrow className="tracking-[0.14em]">Couverture</ProductSectionEyebrow>
                    <p className="text-sm font-medium text-foreground">{linkedCountLabel}</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Multipliez les liaisons seulement quand le produit a un vrai rôle transverse.
                    </p>
                  </div>

                  <div className="grid gap-1.5 py-3">
                    <ProductSectionEyebrow className="tracking-[0.14em]">Principale</ProductSectionEyebrow>
                    <p className="text-sm font-medium text-foreground">{manager.primaryCategorySummary}</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      La principale sert de repère éditorial et améliore la lisibilité des parcours.
                    </p>
                  </div>

                  <div className="grid gap-1.5 py-3 last:pb-0">
                    <ProductSectionEyebrow className="tracking-[0.14em]">Méthode</ProductSectionEyebrow>
                    <p className="text-sm font-medium text-foreground">Du plus spécifique au plus large</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Commencez par la catégorie feuille avant d’ajouter un rattachement plus global.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>

      <AdminFormFooter
        actionsClassName="w-full justify-between gap-2 sm:w-auto sm:justify-end"
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

export type { ProductCategoryOption } from "@/features/admin/products/editor/types";
