"use client";

import { useActionState, useEffect, useMemo, useState, type JSX } from "react";

import { useAutoSlug } from "@/entities/shared/slug/hooks/use-auto-slug";
import { getProductStructurePresentation } from "@/entities/product";
import {
  AdminCharCounter,
  AdminFormField,
  AdminFormFooter,
  AdminFormMessage,
  AdminRichTextEditor,
} from "@/components/admin/forms";
import { toast } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

type ProductStatusValue = "draft" | "active" | "inactive" | "archived";
type IsFeaturedValue = "true" | "false";

const MARKETING_HOOK_MIN = 40;
const MARKETING_HOOK_MAX = 110;
const SHORT_DESCRIPTION_MIN = 120;
const SHORT_DESCRIPTION_MAX = 220;

function getProductTypeLabel(option: { code: string; name: string; slug: string }): string {
  const normalizedCode = option.code.trim().toLowerCase();
  const normalizedName = option.name.trim().toLowerCase();
  const normalizedSlug = option.slug.trim().toLowerCase();

  if (normalizedCode === "simple") {
    return PRODUCT_GENERAL_TAB_COPY.typeSimple;
  }

  if (normalizedCode === "variable") {
    return PRODUCT_GENERAL_TAB_COPY.typeVariable;
  }

  if (
    normalizedCode.includes("woo") ||
    normalizedSlug.includes("woo") ||
    normalizedName.includes("woo") ||
    normalizedCode.includes("import") ||
    normalizedSlug.includes("import") ||
    normalizedName.includes("import")
  ) {
    return PRODUCT_GENERAL_TAB_COPY.typeHistorical;
  }

  return option.name;
}

function SectionEyebrow({ children }: { children: string }): JSX.Element {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </p>
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
  const [status, setStatus] = useState<ProductStatusValue>(product.product.status);
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

  const primaryImageSummary = useMemo(() => {
    if (product.product.primaryImageId === null) {
      return PRODUCT_GENERAL_TAB_COPY.primaryImageNone;
    }

    if (product.product.primaryImageAltText) {
      return PRODUCT_GENERAL_TAB_COPY.primaryImageCurrent(product.product.primaryImageAltText);
    }

    return PRODUCT_GENERAL_TAB_COPY.primaryImageDefined;
  }, [product.product.primaryImageAltText, product.product.primaryImageId]);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    toast.success(state.message ?? PRODUCT_FORM_ACTIONS_COPY.saveSuccess);
    // Reset local form state after success to avoid persistent inline success state.
    onReset();
  }, [state.status, state.message, onReset]);

  return (
    <form action={formAction} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(7rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-14">
        <input type="hidden" name="productId" value={product.product.id} />

        <div className="w-full space-y-6 px-4 py-4 md:space-y-7 md:px-6 md:py-6 lg:mx-auto lg:max-w-4xl lg:px-5 xl:px-0 [@media(max-height:480px)]:space-y-4 [@media(max-height:480px)]:py-3">
          <AdminFormMessage
            tone="error"
            message={state.status === "error" ? state.message : null}
          />

          <Card className="rounded-[1.4rem] border border-surface-border-strong bg-surface-panel shadow-raised py-0">
            <CardHeader className="rounded-t-[1.4rem] border-b border-surface-border bg-surface-panel-soft px-5 py-5 md:px-6">
              <div className="space-y-1.5">
                <SectionEyebrow>{PRODUCT_GENERAL_TAB_COPY.identityEyebrow}</SectionEyebrow>
                <CardTitle className="text-lg">{PRODUCT_GENERAL_TAB_COPY.identityTitle}</CardTitle>
                <CardDescription className="leading-6 text-foreground/70">
                  {PRODUCT_GENERAL_TAB_COPY.identityDescription}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 px-5 py-5 md:px-6 md:py-6">
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

              <div className="grid gap-4 md:grid-cols-2">
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
                          {getProductTypeLabel(option)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AdminFormField>
              </div>

              <div className="rounded-2xl border border-surface-border bg-surface-panel-soft px-4 py-3 text-sm shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {PRODUCT_GENERAL_TAB_COPY.structureInfoTitle}
                </p>
                <p className="mt-2 font-medium text-foreground">
                  {getProductStructurePresentation(product.product.isStandalone).label}
                </p>
                <p className="mt-1 leading-6 text-muted-foreground">
                  {PRODUCT_GENERAL_TAB_COPY.structureInfoDescription}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.35rem] border border-surface-border bg-card shadow-card py-0">
            <CardHeader className="rounded-t-[1.35rem] border-b border-surface-border bg-muted/30 px-5 py-4 md:px-6">
              <div className="space-y-1.5">
                <SectionEyebrow>{PRODUCT_GENERAL_TAB_COPY.contentsEyebrow}</SectionEyebrow>
                <CardTitle>{PRODUCT_GENERAL_TAB_COPY.contentsTitle}</CardTitle>
                <CardDescription className="leading-6">
                  {PRODUCT_GENERAL_TAB_COPY.contentsDescription}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-5 py-5 md:px-6 md:py-6">
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
            </CardContent>
          </Card>

          <Card className="rounded-[1.35rem] border border-surface-border bg-card shadow-card py-0">
            <CardHeader className="rounded-t-[1.35rem] border-b border-surface-border bg-muted/30 px-5 py-4 md:px-6">
              <div className="space-y-1.5">
                <SectionEyebrow>{PRODUCT_GENERAL_TAB_COPY.publicationEyebrow}</SectionEyebrow>
                <CardTitle>{PRODUCT_GENERAL_TAB_COPY.publicationTitle}</CardTitle>
                <CardDescription className="leading-6">
                  {PRODUCT_GENERAL_TAB_COPY.publicationDescription}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 px-5 py-5 md:grid-cols-2 md:px-6 md:py-6">
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
                    <SelectItem value="false">{PRODUCT_GENERAL_TAB_COPY.featuredStandard}</SelectItem>
                    <SelectItem value="true">{PRODUCT_GENERAL_TAB_COPY.featuredTrue}</SelectItem>
                  </SelectContent>
                </Select>
              </AdminFormField>

              <div className="rounded-2xl border border-surface-border bg-surface-panel-soft px-4 py-3 text-sm shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {PRODUCT_GENERAL_TAB_COPY.primaryImageInfoTitle}
                </p>
                <p className="mt-2 font-medium text-foreground">{primaryImageSummary}</p>
                <p className="mt-1 leading-6 text-muted-foreground">
                  {PRODUCT_GENERAL_TAB_COPY.primaryImageInfoDescription}
                </p>
              </div>
            </CardContent>
          </Card>
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
