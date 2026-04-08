"use client";

import { useActionState, useMemo, useState, type JSX } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  productSeoFormInitialState,
  type ProductSeoFormAction,
  type AdminProductEditorData,
} from "@/features/admin/products/editor/types";

type ProductSeoTabProps = {
  action: ProductSeoFormAction;
  product: AdminProductEditorData;
};

type ProductSeoTabInnerProps = {
  action: ProductSeoFormAction;
  product: AdminProductEditorData;
  onReset: () => void;
};

function ProductSeoTabInner({ action, product, onReset }: ProductSeoTabInnerProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, productSeoFormInitialState);
  const [seoTitle, setSeoTitle] = useState(product.seo.title);
  const [seoDescription, setSeoDescription] = useState(product.seo.description);

  const titleLength = useMemo(() => seoTitle.trim().length, [seoTitle]);
  const descriptionLength = useMemo(() => seoDescription.trim().length, [seoDescription]);

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <input type="hidden" name="id" value={product.id} />

      <div className="min-h-0 flex-1 overflow-y-auto pt-28.25 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:pt-29.25 md:pt-30.25 [@media(max-height:480px)]:pt-25.25 [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pt-17.25 lg:pb-14">
        <div className="w-full space-y-5 px-4 pt-4 pb-4 md:space-y-8 md:px-6 md:pt-6 md:pb-6 lg:mx-auto lg:max-w-3xl lg:px-4 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:pt-3 [@media(max-height:480px)]:pb-3">
          <AdminFormMessage
            tone="error"
            message={state.status === "error" ? state.message : null}
          />
          <AdminFormMessage
            tone="success"
            message={state.status === "success" ? state.message : null}
          />

          <AdminFormSection
            title="Référencement"
            description="Ces champs permettent de mieux présenter le produit dans les moteurs de recherche."
          >
            <AdminFormField
              label={
                <div className="flex items-center justify-between gap-3">
                  <span>Titre SEO</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    {titleLength} caractères
                  </span>
                </div>
              }
              htmlFor="edit-seo-title"
              hint="Utilise un titre clair, descriptif et proche de l’intention de recherche."
              error={state.fieldErrors.seoTitle}
            >
              <Input
                id="edit-seo-title"
                name="seoTitle"
                value={seoTitle}
                onChange={(event) => setSeoTitle(event.target.value)}
                className="text-sm"
              />
            </AdminFormField>

            <AdminFormField
              label={
                <div className="flex items-center justify-between gap-3">
                  <span>Description SEO</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    {descriptionLength} caractères
                  </span>
                </div>
              }
              htmlFor="edit-seo-description"
              hint="Rédige un résumé utile et naturel du produit, sans surcharger en mots-clés."
              error={state.fieldErrors.seoDescription}
            >
              <Textarea
                id="edit-seo-description"
                name="seoDescription"
                value={seoDescription}
                onChange={(event) => setSeoDescription(event.target.value)}
                rows={5}
                className="resize-none text-sm"
              />
            </AdminFormField>
          </AdminFormSection>
        </div>
      </div>

      <AdminFormFooter
        actionsClassName="w-full justify-between gap-2 sm:w-auto sm:justify-end"
        className={[
          "bottom-[calc(3.5rem+env(safe-area-inset-bottom))]",
          "[@media(max-height:480px)]:bottom-[calc(3rem+env(safe-area-inset-bottom))]",
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

export function ProductSeoTab({ action, product }: ProductSeoTabProps): JSX.Element {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  return (
    <ProductSeoTabInner
      key={formInstanceKey}
      action={action}
      product={product}
      onReset={() => setFormInstanceKey((current) => current + 1)}
    />
  );
}
