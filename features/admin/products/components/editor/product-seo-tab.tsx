"use client";

import { useActionState, useState, type JSX } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
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
  productSeoFormInitialState,
  type AdminProductEditorData,
  type ProductSeoFormAction,
} from "@/features/admin/products/editor/types";

type ProductSeoTabProps = {
  action: ProductSeoFormAction;
  product: AdminProductEditorData;
};

type ProductSeoTabInnerProps = ProductSeoTabProps & {
  onReset: () => void;
};

function ProductSeoTabInner({ action, product, onReset }: ProductSeoTabInnerProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, productSeoFormInitialState);

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <input type="hidden" name="productId" value={product.product.id} />

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-28.25 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:pt-29.25 md:pt-30.25 [@media(max-height:480px)]:pt-25.25 [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pt-17.25 lg:pb-14">
        <div className="w-full space-y-5 px-4 pt-4 pb-4 md:space-y-8 md:px-6 md:pt-6 md:pb-6 lg:mx-auto lg:max-w-3xl lg:px-4 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:pt-3 [@media(max-height:480px)]:pb-3">
          <AdminFormMessage
            tone={state.status === "success" ? "success" : "error"}
            message={state.status !== "idle" ? state.message : null}
          />

          <AdminFormSection
            title="Métadonnées"
            description="Gestion des métadonnées SEO associées au produit."
          >
            <AdminFormField label="Titre SEO" htmlFor="seo-title" error={state.fieldErrors.title}>
              <Input
                id="seo-title"
                name="title"
                defaultValue={product.seo.title}
                className="text-sm"
              />
            </AdminFormField>

            <AdminFormField
              label="Description SEO"
              htmlFor="seo-description"
              error={state.fieldErrors.description}
            >
              <Input
                id="seo-description"
                name="description"
                defaultValue={product.seo.description}
                className="text-sm"
              />
            </AdminFormField>

            <AdminFormField
              label="Canonical path"
              htmlFor="seo-canonical-path"
              error={state.fieldErrors.canonicalPath}
            >
              <Input
                id="seo-canonical-path"
                name="canonicalPath"
                defaultValue={product.seo.canonicalPath ?? ""}
                placeholder={product.seo.fallbackCanonicalPath}
                className="text-sm"
              />
            </AdminFormField>

            <div className="grid gap-4 md:grid-cols-2">
              <AdminFormField
                label="Indexation"
                htmlFor="seo-indexing-mode"
                error={state.fieldErrors.indexingMode}
              >
                <Select name="indexingMode" defaultValue={product.seo.indexingMode}>
                  <SelectTrigger id="seo-indexing-mode" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDEX_FOLLOW">INDEX_FOLLOW</SelectItem>
                    <SelectItem value="INDEX_NOFOLLOW">INDEX_NOFOLLOW</SelectItem>
                    <SelectItem value="NOINDEX_FOLLOW">NOINDEX_FOLLOW</SelectItem>
                    <SelectItem value="NOINDEX_NOFOLLOW">NOINDEX_NOFOLLOW</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFormField>

              <AdminFormField
                label="Sitemap"
                htmlFor="seo-sitemap-included"
                error={state.fieldErrors.sitemapIncluded}
              >
                <Select
                  name="sitemapIncluded"
                  defaultValue={product.seo.sitemapIncluded ? "true" : "false"}
                >
                  <SelectTrigger id="seo-sitemap-included" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Inclus</SelectItem>
                    <SelectItem value="false">Exclu</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFormField>
            </div>
          </AdminFormSection>

          <AdminFormSection
            title="Open Graph"
            description="Paramètres Open Graph spécifiques au produit."
          >
            <AdminFormField
              label="Titre Open Graph"
              htmlFor="seo-og-title"
              error={state.fieldErrors.openGraphTitle}
            >
              <Input
                id="seo-og-title"
                name="openGraphTitle"
                defaultValue={product.seo.openGraphTitle}
                placeholder={product.seo.fallbackOpenGraphTitle}
                className="text-sm"
              />
            </AdminFormField>

            <AdminFormField
              label="Description Open Graph"
              htmlFor="seo-og-description"
              error={state.fieldErrors.openGraphDescription}
            >
              <Input
                id="seo-og-description"
                name="openGraphDescription"
                defaultValue={product.seo.openGraphDescription}
                placeholder={product.seo.fallbackOpenGraphDescription}
                className="text-sm"
              />
            </AdminFormField>

            <AdminFormField
              label="Image Open Graph"
              htmlFor="seo-og-image-id"
              error={state.fieldErrors.openGraphImageId}
            >
              <Input
                id="seo-og-image-id"
                name="openGraphImageId"
                defaultValue={product.seo.openGraphImageId ?? ""}
                className="font-mono text-sm"
              />
            </AdminFormField>
          </AdminFormSection>

          <AdminFormSection
            title="Twitter"
            description="Paramètres Twitter Card spécifiques au produit."
          >
            <AdminFormField
              label="Titre Twitter"
              htmlFor="seo-twitter-title"
              error={state.fieldErrors.twitterTitle}
            >
              <Input
                id="seo-twitter-title"
                name="twitterTitle"
                defaultValue={product.seo.twitterTitle ?? ""}
                className="text-sm"
              />
            </AdminFormField>

            <AdminFormField
              label="Description Twitter"
              htmlFor="seo-twitter-description"
              error={state.fieldErrors.twitterDescription}
            >
              <Input
                id="seo-twitter-description"
                name="twitterDescription"
                defaultValue={product.seo.twitterDescription ?? ""}
                className="text-sm"
              />
            </AdminFormField>

            <AdminFormField
              label="Image Twitter"
              htmlFor="seo-twitter-image-id"
              error={state.fieldErrors.twitterImageId}
            >
              <Input
                id="seo-twitter-image-id"
                name="twitterImageId"
                defaultValue={product.seo.twitterImageId ?? ""}
                className="font-mono text-sm"
              />
            </AdminFormField>
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
          className="h-8 w-fit rounded-full border-border px-4 text-foreground shadow-none sm:flex-none lg:h-9"
          disabled={pending}
        >
          {pending ? "Mise à jour…" : "Enregistrer"}
        </Button>
      </AdminFormFooter>
    </form>
  );
}

export function ProductSeoTab(props: ProductSeoTabProps): JSX.Element {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  return (
    <ProductSeoTabInner
      key={formInstanceKey}
      {...props}
      onReset={() => setFormInstanceKey((current) => current + 1)}
    />
  );
}
