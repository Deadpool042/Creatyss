"use client";

import { useActionState, useEffect, useMemo, useState, type JSX } from "react";

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
import { AdminRichTextEditor } from "@/components/admin/forms/admin-rich-text-editor";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import {
  type AdminProductEditorData,
  productGeneralFormInitialState,
  type ProductGeneralFormAction,
} from "@/features/admin/products/editor/types";

type ProductGeneralTabProps = {
  action: ProductGeneralFormAction;
  product: AdminProductEditorData;
  productTypeOptions?: Array<{
    id: string;
    code: string;
    name: string;
    slug: string;
    isActive: boolean;
  }>;
};

type ProductGeneralTabInnerProps = ProductGeneralTabProps & {
  onReset: () => void;
};

function ProductGeneralTabInner({
  action,
  product,
  productTypeOptions = [],
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
    initialSourceValue: product.product.name,
    initialSlugValue: product.product.slug,
  });

  useEffect(() => {
    resetAutoSlug({
      initialSourceValue: product.product.name,
      initialSlugValue: product.product.slug,
    });
  }, [product.product.name, product.product.slug, resetAutoSlug]);

  const primaryImageLabel = useMemo(() => {
    if (product.product.primaryImageStorageKey) {
      return product.product.primaryImageStorageKey;
    }

    return "Aucune image principale";
  }, [product.product.primaryImageStorageKey]);

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-28.25 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:pt-29.25 md:pt-30.25 [@media(max-height:480px)]:pt-25.25 [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pt-17.25 lg:pb-14">
        <input type="hidden" name="productId" value={product.product.id} />

        <div className="w-full space-y-5 px-4 pt-4 pb-4 md:space-y-8 md:px-6 md:pt-6 md:pb-6 lg:mx-auto lg:max-w-3xl lg:px-4 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:pt-3 [@media(max-height:480px)]:pb-3">
          <AdminFormMessage tone="error" message={state.status === "error" ? state.message : null} />
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

            <div className="grid gap-4 md:grid-cols-2">
              <AdminFormField
                label="SKU racine"
                htmlFor="edit-sku-root"
                error={state.fieldErrors.skuRoot}
              >
                <Input
                  id="edit-sku-root"
                  name="skuRoot"
                  defaultValue={product.product.skuRoot ?? ""}
                  className="text-sm"
                />
              </AdminFormField>

              <AdminFormField
                label="Type produit"
                htmlFor="edit-product-type"
                error={state.fieldErrors.productTypeId}
              >
                <Select name="productTypeId" defaultValue={product.product.productTypeId ?? "__none__"}>
                  <SelectTrigger id="edit-product-type" className="text-sm">
                    <SelectValue placeholder="Aucun type produit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Aucun type produit</SelectItem>
                    {productTypeOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name} · {option.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AdminFormField>
            </div>

            <AdminRichTextEditor
              name="shortDescription"
              label="Courte description"
              preset="full"
              initialValue={product.product.shortDescription ?? ""}
              {...(state.fieldErrors.shortDescription
                ? { error: state.fieldErrors.shortDescription }
                : {})}
            />

            <AdminRichTextEditor
              name="description"
              label="Description"
              preset="full"
              initialValue={product.product.description ?? ""}
              {...(state.fieldErrors.description ? { error: state.fieldErrors.description } : {})}
            />
          </AdminFormSection>

          <AdminFormSection
            title="Publication"
            description="Définissez le cycle de vie du produit et sa visibilité métier."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <AdminFormField label="Statut" htmlFor="edit-status" error={state.fieldErrors.status}>
                <Select name="status" defaultValue={product.product.status}>
                  <SelectTrigger id="edit-status" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFormField>

              <AdminFormField
                label="Mise en avant"
                htmlFor="edit-is-featured"
                error={state.fieldErrors.isFeatured}
              >
                <Select
                  name="isFeatured"
                  defaultValue={product.product.isFeatured ? "true" : "false"}
                >
                  <SelectTrigger id="edit-is-featured" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Produit standard</SelectItem>
                    <SelectItem value="true">Produit mis en avant</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFormField>

              <AdminFormField
                label="Standalone"
                htmlFor="edit-is-standalone"
                error={state.fieldErrors.isStandalone}
              >
                <Select
                  name="isStandalone"
                  defaultValue={product.product.isStandalone ? "true" : "false"}
                >
                  <SelectTrigger id="edit-is-standalone" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Oui</SelectItem>
                    <SelectItem value="false">Non</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFormField>

              <AdminFormField
                label="Image principale"
                htmlFor="edit-primary-image-id"
                error={state.fieldErrors.primaryImageId}
                hint={primaryImageLabel}
              >
                <Input
                  id="edit-primary-image-id"
                  name="primaryImageId"
                  defaultValue={product.product.primaryImageId ?? ""}
                  className="font-mono text-sm"
                />
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

export function ProductGeneralTab(props: ProductGeneralTabProps): JSX.Element {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  return (
    <ProductGeneralTabInner
      key={formInstanceKey}
      {...props}
      onReset={() => setFormInstanceKey((current) => current + 1)}
    />
  );
}
