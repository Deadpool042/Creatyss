"use client";

import { useActionState, useEffect, useState, type JSX } from "react";

import { useAutoSlug } from "@/entities/shared/slug/hooks/use-auto-slug";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  type AdminProductEditorData,
  productGeneralFormInitialState,
  type ProductGeneralFormAction,
} from "@/features/admin/products/editor/types";
import { AdminRichTextEditor } from "@/components/admin/forms/admin-rich-text-editor";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";

type ProductGeneralTabProps = {
  action: ProductGeneralFormAction;
  product: AdminProductEditorData;
};

type ProductGeneralTabInnerProps = {
  action: ProductGeneralFormAction;
  product: AdminProductEditorData;
  onReset: () => void;
};

function ProductGeneralTabInner({
  action,
  product,
  onReset,
}: ProductGeneralTabInnerProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, productGeneralFormInitialState);

  const {
    sourceValue: nameValue,
    slugValue,
    setSourceValue: setNameValue,
    setSlugValue,
    resetAutoSlug,
  } = useAutoSlug({
    initialSourceValue: product.name,
    initialSlugValue: product.slug,
  });

  useEffect(() => {
    resetAutoSlug({
      initialSourceValue: product.name,
      initialSlugValue: product.slug,
    });
  }, [product.name, product.slug, resetAutoSlug]);

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto pt-28.25 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:pt-29.25 md:pt-30.25 [@media(max-height:480px)]:pt-25.25 [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pt-17.25 lg:pb-14">
        <input type="hidden" name="id" value={product.id} />

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
            title="Informations générales"
            description="Renseignez les informations principales du produit."
          >
            <AdminFormField
              label="Nom du produit"
              htmlFor="edit-name"
              required
              error={state.fieldErrors.name}
            >
              <Input
                id="edit-name"
                name="name"
                value={nameValue}
                onChange={(event) => setNameValue(event.target.value)}
                className="text-sm"
              />
            </AdminFormField>

            <AdminFormField
              label="Slug"
              htmlFor="edit-slug"
              required
              hint="Généré automatiquement depuis le nom. Vous pouvez le modifier."
              error={state.fieldErrors.slug}
            >
              <Input
                id="edit-slug"
                name="slug"
                value={slugValue}
                onChange={(event) => setSlugValue(event.target.value)}
                className="font-mono text-sm"
              />
            </AdminFormField>

            <AdminRichTextEditor
              name="shortDescription"
              label="Courte description"
              preset="full"
              initialValue={product.shortDescription}
              {...(state.fieldErrors.shortDescription
                ? { error: state.fieldErrors.shortDescription }
                : {})}
            />

            <AdminRichTextEditor
              name="description"
              label="Description"
              preset="full"
              initialValue={product.description}
              {...(state.fieldErrors.description ? { error: state.fieldErrors.description } : {})}
            />
          </AdminFormSection>

          <AdminFormSection
            title="Publication"
            description="Définissez le statut du produit et sa mise en avant dans le catalogue."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <AdminFormField label="Statut" htmlFor="edit-status" error={state.fieldErrors.status}>
                <Select name="status" defaultValue={product.status}>
                  <SelectTrigger id="edit-status" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      Brouillon — visible uniquement par les admins
                    </SelectItem>
                    <SelectItem value="published">Publié — visible sur la boutique</SelectItem>
                    <SelectItem value="archived">Archivé — non visible sur la boutique</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFormField>

              <AdminFormField
                label="Mise en avant"
                htmlFor="edit-is-featured"
                error={state.fieldErrors.isFeatured}
              >
                <Select name="isFeatured" defaultValue={product.isFeatured ? "true" : "false"}>
                  <SelectTrigger id="edit-is-featured" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Produit standard</SelectItem>
                    <SelectItem value="true">Produit mis en avant</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFormField>
            </div>
          </AdminFormSection>
        </div>
      </div>

      <AdminFormFooter
        actionsClassName="w-full justify-between gap-2 sm:w-auto sm:justify-end "
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

export function ProductGeneralTab({ action, product }: ProductGeneralTabProps): JSX.Element {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  return (
    <ProductGeneralTabInner
      key={formInstanceKey}
      action={action}
      product={product}
      onReset={() => setFormInstanceKey((current) => current + 1)}
    />
  );
}
