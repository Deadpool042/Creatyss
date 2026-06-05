"use client";

import { type JSX, useActionState, useState } from "react";

import { useAutoSlug } from "@/entities/shared/slug/hooks/use-auto-slug";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormFooter } from "@/components/admin/forms/admin-form-footer";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  initialCreateProductActionState,
  type CreateProductActionState,
} from "@/features/admin/products/create/create-product.types";
import {
  PRODUCT_CREATE_PAGE_COPY,
  PRODUCT_CREATE_PANEL_COPY,
  PRODUCT_FORM_ACTIONS_COPY,
} from "@/features/admin/products/config";
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared/product-section-eyebrow";

export type ProductCreateFormAction = (
  prevState: CreateProductActionState,
  formData: FormData
) => Promise<CreateProductActionState>;

type ProductCreateFormProps = {
  action: ProductCreateFormAction;
};

type ProductCreatePanelInnerProps = {
  action: ProductCreateFormAction;
  onReset: () => void;
};

const CREATE_PANEL_CONTENT_BOTTOM_PADDING_CLASS =
  "pb-[calc(var(--admin-bottom-nav-offset)+2.75rem)]";
const CREATE_PANEL_CONTENT_BOTTOM_PADDING_LANDSCAPE_CLASS =
  "[@media(max-height:480px)]:pb-[calc(var(--admin-bottom-nav-offset)+1.75rem)]";
const CREATE_PANEL_FOOTER_BOTTOM_CLASS = "bottom-[var(--admin-bottom-nav-offset)]";
const CREATE_PANEL_FOOTER_BOTTOM_LANDSCAPE_CLASS =
  "[@media(max-height:480px)]:bottom-[calc(var(--admin-bottom-nav-offset)-0.75rem)]";

function ProductCreatePanelInner({ action, onReset }: ProductCreatePanelInnerProps): JSX.Element {
  const [state, formAction, pending] = useActionState(action, initialCreateProductActionState);

  const {
    sourceValue: nameValue,
    slugValue,
    setSourceValue: setNameValue,
    setSlugValue,
  } = useAutoSlug({
    initialSourceValue: "",
    initialSlugValue: "",
  });

  function handleReset(): void {
    onReset();
  }

  return (
    <form action={formAction} className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-panel shadow-card">
      <div className="site-header-blur hidden shrink-0 border-b border-surface-border lg:block">
        <div className="px-6 py-5">
          <h2 className="text-sm font-semibold">{PRODUCT_CREATE_PAGE_COPY.title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {PRODUCT_CREATE_PANEL_COPY.description}
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div
          className={[
            "mx-auto max-w-4xl space-y-4 px-3 pt-4",
            "sm:space-y-5 sm:px-4 sm:pt-5 sm:pb-6",
            "md:space-y-6 md:px-6 md:pt-6",
            "lg:px-5 xl:px-0",
            "[@media(max-height:480px)]:space-y-3",
            "[@media(max-height:480px)]:pt-3",
            CREATE_PANEL_CONTENT_BOTTOM_PADDING_CLASS,
            CREATE_PANEL_CONTENT_BOTTOM_PADDING_LANDSCAPE_CLASS,
          ].join(" ")}
        >
          <AdminFormMessage
            tone={state.status === "success" ? "success" : "error"}
            message={state.status !== "idle" ? state.message : null}
          />

          <Card className="rounded-xl border border-surface-border-strong bg-surface-panel shadow-card py-0">
            <CardHeader className="rounded-t-xl border-b border-surface-border bg-surface-panel-soft px-4 py-3 sm:px-5 sm:py-4">
              <div className="space-y-1.5">
                <ProductSectionEyebrow className="text-[10px] sm:text-[11px]">
                  {PRODUCT_CREATE_PANEL_COPY.identityEyebrow}
                </ProductSectionEyebrow>
                <CardTitle className="text-base sm:text-lg">
                  {PRODUCT_CREATE_PANEL_COPY.identityTitle}
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-foreground/70">
                  {PRODUCT_CREATE_PANEL_COPY.identityCardDescription}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="grid gap-4 px-4 py-4 sm:gap-5 sm:px-5 sm:py-5">
              <AdminFormField
                label={PRODUCT_CREATE_PANEL_COPY.nameLabel}
                htmlFor="new-name"
                required
                error={state.fieldErrors.name}
              >
                <Input
                  id="new-name"
                  name="name"
                  value={nameValue}
                  onChange={(event) => setNameValue(event.target.value)}
                  placeholder={PRODUCT_CREATE_PANEL_COPY.namePlaceholder}
                  className="text-sm"
                />
              </AdminFormField>

              <AdminFormField
                label={PRODUCT_CREATE_PANEL_COPY.slugLabel}
                htmlFor="new-slug"
                required
                hint={PRODUCT_CREATE_PANEL_COPY.identitySlugHint}
                error={state.fieldErrors.slug}
              >
                <Input
                  id="new-slug"
                  name="slug"
                  value={slugValue}
                  onChange={(event) => setSlugValue(event.target.value)}
                  placeholder={PRODUCT_CREATE_PANEL_COPY.slugPlaceholder}
                  className="font-mono text-sm"
                />
              </AdminFormField>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdminFormFooter
        overlay
        actionsClassName="w-full justify-between gap-2 sm:w-auto sm:justify-end"
        className={[
          "px-3 py-2",
          CREATE_PANEL_FOOTER_BOTTOM_CLASS,
          CREATE_PANEL_FOOTER_BOTTOM_LANDSCAPE_CLASS,
          "sm:px-4 sm:py-3",
          "lg:bottom-0 lg:px-4 lg:py-3",
        ].join(" ")}
      >
        <>
          <Button
            variant="ghost"
            type="button"
            size="xs"
            className="h-8 rounded-full px-3 sm:h-9 sm:px-4"
            onClick={handleReset}
          >
            {PRODUCT_FORM_ACTIONS_COPY.reset}
          </Button>
          <Button
            type="submit"
            size="xs"
            className="h-8 rounded-full px-3 sm:h-9 sm:px-4"
            disabled={pending || nameValue.trim().length === 0 || slugValue.trim().length === 0}
          >
            {pending ? PRODUCT_CREATE_PANEL_COPY.createPending : PRODUCT_CREATE_PANEL_COPY.createButton}
          </Button>
        </>
      </AdminFormFooter>
    </form>
  );
}

export function ProductCreatePanel({
  action,
}: ProductCreateFormProps): JSX.Element {
  const [formInstanceKey, setFormInstanceKey] = useState(0);

  return (
    <div className="min-h-0 flex-1">
      <ProductCreatePanelInner
        key={formInstanceKey}
        action={action}
        onReset={() => setFormInstanceKey((current) => current + 1)}
      />
    </div>
  );
}
