"use client";

import { useActionState, useEffect, useState, type JSX } from "react";

import { useAutoSlug } from "@/entities/shared/slug/hooks/use-auto-slug";
import { getProductStructurePresentation } from "@/entities/product/product-public-presentation";
import type { ProductLifecycleStatus } from "@/entities/product/product-lifecycle-status";
import { AdminCharCounter } from "@/components/admin/forms/admin-char-counter";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { AdminRichTextEditor } from "@/components/admin/forms/admin-rich-text-editor";
import { toast } from "@/components/shared";
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
import {
  PRODUCT_GENERAL_TAB_COPY,
  PRODUCT_FORM_ACTIONS_COPY,
} from "@/features/admin/products/config";
import { getProductTypeLabel } from "@/features/admin/products/components/shared/product-type-label";
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared/product-section-eyebrow";

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

type IsFeaturedValue = "true" | "false";

const MARKETING_HOOK_MIN = 40;
const MARKETING_HOOK_MAX = 110;
const SHORT_DESCRIPTION_MIN = 120;
const SHORT_DESCRIPTION_MAX = 220;

type ProductGeneralSectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

type ProductGeneralContextItemProps = {
  label: string;
  value: string;
  description: string;
};

function ProductGeneralSectionIntro({
  eyebrow,
  title,
  description,
}: ProductGeneralSectionIntroProps): JSX.Element {
  return (
    <div className="grid gap-1.5">
      <ProductSectionEyebrow>{eyebrow}</ProductSectionEyebrow>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function ProductGeneralContextItem({
  label,
  value,
  description,
}: ProductGeneralContextItemProps): JSX.Element {
  return (
    <div className="grid gap-1.5 py-3 first:pt-0 last:pb-0">
      <ProductSectionEyebrow className="tracking-[0.14em]">{label}</ProductSectionEyebrow>
      <p className="text-sm font-medium text-foreground">{value}</p>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

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
  } = useAutoSlug({
    initialSourceValue: product.product.name,
    initialSlugValue: product.product.slug,
  });

  const [skuRoot, setSkuRoot] = useState(product.product.skuRoot ?? "");
  const [marketingHook, setMarketingHook] = useState(product.product.marketingHook ?? "");
  const [productTypeId, setProductTypeId] = useState(product.product.productTypeId ?? "__none__");
  const [status, setStatus] = useState<ProductLifecycleStatus>(product.product.status);
  const [isFeatured, setIsFeatured] = useState<IsFeaturedValue>(
    product.product.isFeatured ? "true" : "false"
  );

  function handleStatusChange(value: string): void {
    if (value === "draft" || value === "active" || value === "inactive" || value === "archived") {
      setStatus(value);
    }
  }

  function handleIsFeaturedChange(value: string): void {
    if (value === "true" || value === "false") {
      setIsFeatured(value);
    }
  }

  const primaryImageSummary =
    product.product.primaryImageId === null
      ? PRODUCT_GENERAL_TAB_COPY.primaryImageNone
      : product.product.primaryImageAltText
        ? PRODUCT_GENERAL_TAB_COPY.primaryImageCurrent(product.product.primaryImageAltText)
        : PRODUCT_GENERAL_TAB_COPY.primaryImageDefined;
  const structurePresentation = getProductStructurePresentation(product.product.isStandalone);
  const productPublicPath = `/boutique/${slugValue || product.product.slug}`;
  const skuRootSummary = skuRoot.trim() || "Non renseignée";

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    toast.success(state.message ?? PRODUCT_FORM_ACTIONS_COPY.saveSuccess);
    // Reset local form state after success to avoid persistent inline success state.
    onReset();
  }, [state.status, state.message, onReset]);

  return (
    <form action={formAction} className="relative">
      <div>
        <input type="hidden" name="productId" value={product.product.id} />

        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-4 md:px-6 md:py-6 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start xl:px-0 [@media(max-height:480px)]:gap-4 [@media(max-height:480px)]:py-3">
          <div className="min-w-0 space-y-5 md:space-y-6">
            <AdminFormMessage
              tone="error"
              message={state.status === "error" ? state.message : null}
            />

            <div className="divide-y divide-surface-border/40">
              <section className="grid gap-6 py-6 first:pt-0">
                <ProductGeneralSectionIntro
                  eyebrow={PRODUCT_GENERAL_TAB_COPY.identityEyebrow}
                  title={PRODUCT_GENERAL_TAB_COPY.identityTitle}
                  description={PRODUCT_GENERAL_TAB_COPY.identityDescription}
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <AdminFormField
                    label={PRODUCT_GENERAL_TAB_COPY.nameLabel}
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
                    label={PRODUCT_GENERAL_TAB_COPY.slugLabel}
                    htmlFor="edit-slug"
                    required
                    hint={PRODUCT_GENERAL_TAB_COPY.slugHint}
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
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <AdminFormField
                    label={PRODUCT_GENERAL_TAB_COPY.productTypeLabel}
                    htmlFor="edit-product-type"
                    hint={PRODUCT_GENERAL_TAB_COPY.productTypeHint}
                    error={state.fieldErrors.productTypeId}
                  >
                    <input type="hidden" name="productTypeId" value={productTypeId} />

                    <Select value={productTypeId} onValueChange={setProductTypeId}>
                      <SelectTrigger id="edit-product-type" className="w-full text-sm">
                        <SelectValue placeholder={PRODUCT_GENERAL_TAB_COPY.typeNone} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">{PRODUCT_GENERAL_TAB_COPY.typeNone}</SelectItem>
                        {productTypeOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {getProductTypeLabel(option, PRODUCT_GENERAL_TAB_COPY)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AdminFormField>

                  <AdminFormField
                    label={PRODUCT_GENERAL_TAB_COPY.skuRootLabel}
                    htmlFor="edit-sku-root"
                    hint={PRODUCT_GENERAL_TAB_COPY.skuRootHint}
                    error={state.fieldErrors.skuRoot}
                  >
                    <Input
                      id="edit-sku-root"
                      name="skuRoot"
                      value={skuRoot}
                      onChange={(event) => setSkuRoot(event.target.value)}
                      className="text-sm"
                    />
                  </AdminFormField>
                </div>
              </section>

              <section className="grid gap-6 py-6">
                <ProductGeneralSectionIntro
                  eyebrow={PRODUCT_GENERAL_TAB_COPY.contentsEyebrow}
                  title={PRODUCT_GENERAL_TAB_COPY.contentsTitle}
                  description={PRODUCT_GENERAL_TAB_COPY.contentsDescription}
                />

                <AdminFormField
                  label={PRODUCT_GENERAL_TAB_COPY.marketingHookLabel}
                  htmlFor="edit-marketing-hook"
                  hint={PRODUCT_GENERAL_TAB_COPY.marketingHookHint}
                  error={state.fieldErrors.marketingHook}
                >
                  <div className="space-y-1.5">
                    <Input
                      id="edit-marketing-hook"
                      name="marketingHook"
                      value={marketingHook}
                      onChange={(event) => setMarketingHook(event.target.value)}
                      placeholder={PRODUCT_GENERAL_TAB_COPY.marketingHookPlaceholder}
                      className="text-sm"
                    />
                    <div className="flex items-center justify-end">
                      <AdminCharCounter
                        value={marketingHook}
                        min={MARKETING_HOOK_MIN}
                        max={MARKETING_HOOK_MAX}
                      />
                    </div>
                  </div>
                </AdminFormField>

                <AdminRichTextEditor
                  name="shortDescription"
                  label={PRODUCT_GENERAL_TAB_COPY.shortDescriptionLabel}
                  hint={PRODUCT_GENERAL_TAB_COPY.shortDescriptionHint}
                  preset="full"
                  minHeightClassName="min-h-[140px]"
                  initialValue={product.product.shortDescription ?? ""}
                  counter={{
                    min: SHORT_DESCRIPTION_MIN,
                    max: SHORT_DESCRIPTION_MAX,
                    visibleText: true,
                  }}
                  {...(state.fieldErrors.shortDescription
                    ? { error: state.fieldErrors.shortDescription }
                    : {})}
                />

                <AdminRichTextEditor
                  name="description"
                  label={PRODUCT_GENERAL_TAB_COPY.descriptionLabel}
                  hint={PRODUCT_GENERAL_TAB_COPY.descriptionHint}
                  preset="full"
                  initialValue={product.product.description ?? ""}
                  {...(state.fieldErrors.description ? { error: state.fieldErrors.description } : {})}
                />

                <AdminRichTextEditor
                  name="careInstructions"
                  label={PRODUCT_GENERAL_TAB_COPY.careInstructionsLabel}
                  hint={PRODUCT_GENERAL_TAB_COPY.careInstructionsHint}
                  preset="full"
                  minHeightClassName="min-h-[120px]"
                  initialValue={product.product.careInstructions ?? ""}
                  {...(state.fieldErrors.careInstructions
                    ? { error: state.fieldErrors.careInstructions }
                    : {})}
                />
              </section>
            </div>
          </div>

          <aside className="min-w-0 xl:sticky xl:top-6">
            <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/80">
              <section className="grid gap-4 px-5 py-5">
                <ProductGeneralSectionIntro
                  eyebrow={PRODUCT_GENERAL_TAB_COPY.publicationEyebrow}
                  title={PRODUCT_GENERAL_TAB_COPY.publicationTitle}
                  description={PRODUCT_GENERAL_TAB_COPY.publicationDescription}
                />

                <AdminFormField
                  label={PRODUCT_GENERAL_TAB_COPY.statusLabel}
                  htmlFor="edit-status"
                  hint={PRODUCT_GENERAL_TAB_COPY.statusHint}
                  error={state.fieldErrors.status}
                >
                  <input type="hidden" name="status" value={status} />

                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger id="edit-status" className="w-full text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{PRODUCT_GENERAL_TAB_COPY.statusDraft}</SelectItem>
                      <SelectItem value="active">{PRODUCT_GENERAL_TAB_COPY.statusActive}</SelectItem>
                      <SelectItem value="inactive">{PRODUCT_GENERAL_TAB_COPY.statusInactive}</SelectItem>
                      <SelectItem value="archived">{PRODUCT_GENERAL_TAB_COPY.statusArchived}</SelectItem>
                    </SelectContent>
                  </Select>
                </AdminFormField>

                <AdminFormField
                  label={PRODUCT_GENERAL_TAB_COPY.isFeaturedLabel}
                  htmlFor="edit-is-featured"
                  error={state.fieldErrors.isFeatured}
                >
                  <input type="hidden" name="isFeatured" value={isFeatured} />

                  <Select value={isFeatured} onValueChange={handleIsFeaturedChange}>
                    <SelectTrigger id="edit-is-featured" className="w-full text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">
                        {PRODUCT_GENERAL_TAB_COPY.featuredStandard}
                      </SelectItem>
                      <SelectItem value="true">{PRODUCT_GENERAL_TAB_COPY.featuredTrue}</SelectItem>
                    </SelectContent>
                  </Select>
                </AdminFormField>
              </section>

              <section className="grid gap-1 border-t border-surface-border px-5 py-5">
                <ProductGeneralSectionIntro
                  eyebrow="Repères"
                  title="Contexte produit"
                  description="Gardez sous les yeux les informations qui structurent la fiche sans surcharger le formulaire."
                />

                <div className="divide-y divide-surface-border">
                  <ProductGeneralContextItem
                    label={PRODUCT_GENERAL_TAB_COPY.structureInfoTitle}
                    value={structurePresentation.label}
                    description={PRODUCT_GENERAL_TAB_COPY.structureInfoDescription}
                  />
                  <ProductGeneralContextItem
                    label={PRODUCT_GENERAL_TAB_COPY.primaryImageInfoTitle}
                    value={primaryImageSummary}
                    description={PRODUCT_GENERAL_TAB_COPY.primaryImageInfoDescription}
                  />
                  <ProductGeneralContextItem
                    label="Référence actuelle"
                    value={skuRootSummary}
                    description={PRODUCT_GENERAL_TAB_COPY.skuRootHint}
                  />
                  <ProductGeneralContextItem
                    label="URL publique"
                    value={productPublicPath}
                    description="Cette adresse reprend le slug courant du produit."
                  />
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>

      <AdminFormFooter
        actionsClassName="w-full justify-between gap-2 sm:w-auto sm:justify-end"
        className="sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom))] lg:bottom-0"
      >
        <Button
          variant="ghost"
          type="button"
          size="xs"
          className="h-8 rounded-full px-4 text-muted-foreground hover:text-foreground lg:h-9"
          onClick={onReset}
        >
          {PRODUCT_FORM_ACTIONS_COPY.reset}
        </Button>

        <Button
          type="submit"
          variant="outline"
          size="xs"
          className="h-8 w-fit rounded-full border-shell-border px-4 text-foreground shadow-none sm:flex-none lg:h-9"
          disabled={pending}
        >
          {pending ? PRODUCT_FORM_ACTIONS_COPY.savePending : PRODUCT_FORM_ACTIONS_COPY.save}
        </Button>
      </AdminFormFooter>
    </form>
  );
}

export function ProductGeneralTab(props: ProductGeneralTabProps): JSX.Element {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  const resetKey = [
    props.product.product.id,
    props.product.product.name,
    props.product.product.slug,
    props.product.product.skuRoot ?? "",
    props.product.product.marketingHook ?? "",
    props.product.product.productTypeId ?? "__none__",
    props.product.product.status,
    props.product.product.isFeatured ? "true" : "false",
  ].join(":");

  return (
    <ProductGeneralTabInner
      key={`${resetKey}:${formInstanceKey}`}
      {...props}
      onReset={() => setFormInstanceKey((current) => current + 1)}
    />
  );
}
